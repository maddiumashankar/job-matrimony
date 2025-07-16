import express from 'express'
import { supabase } from '../config/supabase.js'
import { AppError } from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validation.js'
import { requireRecruiter, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/jobs - List jobs with filtering
router.get('/', validate(schemas.pagination, 'query'), async (req, res, next) => {
  try {
    const { 
      page, 
      limit, 
      sortBy = 'created_at', 
      sortOrder,
      job_type,
      experience_level,
      location,
      remote_allowed,
      salary_min,
      salary_max,
      search
    } = req.query
    
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        description,
        company_name,
        location,
        job_type,
        experience_level,
        salary_min,
        salary_max,
        currency,
        remote_allowed,
        status,
        created_at,
        application_deadline,
        user_profiles!recruiter_id (
          full_name,
          avatar_url
        )
      `, { count: 'exact' })
      .eq('status', 'published')

    // Apply filters
    if (job_type) query = query.eq('job_type', job_type)
    if (experience_level) query = query.eq('experience_level', experience_level)
    if (location) query = query.ilike('location', `%${location}%`)
    if (remote_allowed === 'true') query = query.eq('remote_allowed', true)
    if (salary_min) query = query.gte('salary_min', parseInt(salary_min))
    if (salary_max) query = query.lte('salary_max', parseInt(salary_max))
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company_name.ilike.%${search}%`)
    }

    // Apply sorting and pagination
    if (sortBy && ['created_at', 'title', 'salary_min', 'salary_max'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }
    
    query = query.range(offset, offset + limit - 1)

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('List jobs error:', error)
      return next(new AppError('Failed to fetch jobs', 500))
    }

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    })
  } catch (error) {
    console.error('List jobs error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// GET /api/jobs/:id - Get single job
router.get('/:id', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: job, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        user_profiles!recruiter_id (
          id,
          full_name,
          avatar_url,
          recruiter_profiles (
            company_name,
            company_website,
            company_size,
            industry
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error || !job) {
      return next(new AppError('Job not found', 404))
    }

    // Check if job is published or user is the owner
    if (job.status !== 'published' && job.recruiter_id !== req.userProfile?.id) {
      return next(new AppError('Job not found', 404))
    }

    res.json({
      success: true,
      data: { job }
    })
  } catch (error) {
    console.error('Get job error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// POST /api/jobs - Create new job (recruiters only)
router.post('/', requireRecruiter, validate(schemas.createJob), async (req, res, next) => {
  try {
    const jobData = req.body
    const recruiterId = req.userProfile.id

    const { data: job, error } = await supabase
      .from('job_postings')
      .insert({
        ...jobData,
        recruiter_id: recruiterId,
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Create job error:', error)
      return next(new AppError('Failed to create job', 500))
    }

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: { job }
    })
  } catch (error) {
    console.error('Create job error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// PUT /api/jobs/:id - Update job (owner only)
router.put('/:id', requireRecruiter, validate(schemas.idParam, 'params'), validate(schemas.updateJob), async (req, res, next) => {
  try {
    const { id } = req.params
    const jobData = req.body
    const recruiterId = req.userProfile.id

    // Check if job exists and user owns it
    const { data: existingJob, error: checkError } = await supabase
      .from('job_postings')
      .select('recruiter_id')
      .eq('id', id)
      .single()

    if (checkError || !existingJob) {
      return next(new AppError('Job not found', 404))
    }

    if (existingJob.recruiter_id !== recruiterId && req.userProfile.role !== 'admin') {
      return next(new AppError('Not authorized to update this job', 403))
    }

    // Update job
    const { data: job, error } = await supabase
      .from('job_postings')
      .update({
        ...jobData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update job error:', error)
      return next(new AppError('Failed to update job', 500))
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job }
    })
  } catch (error) {
    console.error('Update job error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// DELETE /api/jobs/:id - Delete job (owner only)
router.delete('/:id', requireRecruiter, validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params
    const recruiterId = req.userProfile.id

    // Check if job exists and user owns it
    const { data: existingJob, error: checkError } = await supabase
      .from('job_postings')
      .select('recruiter_id')
      .eq('id', id)
      .single()

    if (checkError || !existingJob) {
      return next(new AppError('Job not found', 404))
    }

    if (existingJob.recruiter_id !== recruiterId && req.userProfile.role !== 'admin') {
      return next(new AppError('Not authorized to delete this job', 403))
    }

    // Delete job
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete job error:', error)
      return next(new AppError('Failed to delete job', 500))
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    console.error('Delete job error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// GET /api/jobs/my/jobs - Get recruiter's jobs
router.get('/my/jobs', requireRecruiter, validate(schemas.pagination, 'query'), async (req, res, next) => {
  try {
    const { page, limit, sortBy = 'created_at', sortOrder } = req.query
    const offset = (page - 1) * limit
    const recruiterId = req.userProfile.id

    let query = supabase
      .from('job_postings')
      .select('*', { count: 'exact' })
      .eq('recruiter_id', recruiterId)
      .range(offset, offset + limit - 1)

    if (sortBy && ['created_at', 'title', 'status', 'updated_at'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('Get my jobs error:', error)
      return next(new AppError('Failed to fetch jobs', 500))
    }

    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    })
  } catch (error) {
    console.error('Get my jobs error:', error)
    next(new AppError('Internal server error', 500))
  }
})

export default router
