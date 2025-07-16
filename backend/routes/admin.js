import express from 'express'
import { supabase, supabaseAdmin } from '../config/supabase.js'
import { AppError } from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validation.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require admin role
router.use(requireAdmin)

// GET /api/admin/dashboard/stats - Dashboard statistics
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    // Get counts for different entities
    const [
      { count: totalUsers },
      { count: totalCandidates },
      { count: totalRecruiters },
      { count: totalJobs },
      { count: activeJobs },
      { count: totalApplications }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'candidate'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'recruiter'),
      supabase.from('job_postings').select('*', { count: 'exact', head: true }),
      supabase.from('job_postings').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('job_applications').select('*', { count: 'exact', head: true })
    ])

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      { count: newUsersThisWeek },
      { count: newJobsThisWeek },
      { count: newApplicationsThisWeek }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('job_postings').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('job_applications').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString())
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCandidates,
          totalRecruiters,
          totalJobs,
          activeJobs,
          totalApplications
        },
        weeklyActivity: {
          newUsers: newUsersThisWeek,
          newJobs: newJobsThisWeek,
          newApplications: newApplicationsThisWeek
        }
      }
    })
  } catch (error) {
    console.error('Admin dashboard stats error:', error)
    next(new AppError('Failed to fetch dashboard statistics', 500))
  }
})

// GET /api/admin/users - List all users with pagination
router.get('/users', validate(schemas.pagination, 'query'), async (req, res, next) => {
  try {
    const { page, limit, sortBy = 'created_at', sortOrder, role, search } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        location,
        created_at,
        updated_at,
        candidate_profiles (
          skills,
          experience_years
        ),
        recruiter_profiles (
          company_name,
          verification_status
        )
      `, { count: 'exact' })

    // Apply filters
    if (role && ['candidate', 'recruiter', 'admin'].includes(role)) {
      query = query.eq('role', role)
    }
    
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Apply sorting and pagination
    if (sortBy && ['created_at', 'full_name', 'email', 'updated_at'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }
    
    query = query.range(offset, offset + limit - 1)

    const { data: users, error, count } = await query

    if (error) {
      console.error('Admin list users error:', error)
      return next(new AppError('Failed to fetch users', 500))
    }

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    })
  } catch (error) {
    console.error('Admin list users error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params

    const { data: user, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        candidate_profiles (*),
        recruiter_profiles (*)
      `)
      .eq('id', id)
      .single()

    if (error || !user) {
      return next(new AppError('User not found', 404))
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    console.error('Admin get user error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!role || !['candidate', 'recruiter', 'admin'].includes(role)) {
      return next(new AppError('Valid role is required', 400))
    }

    // Don't allow changing own role
    if (id === req.userProfile.id) {
      return next(new AppError('Cannot change your own role', 400))
    }

    const { data: user, error } = await supabase
      .from('user_profiles')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Admin update user role error:', error)
      return next(new AppError('Failed to update user role', 500))
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    })
  } catch (error) {
    console.error('Admin update user role error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params

    // Don't allow deleting own account
    if (id === req.userProfile.id) {
      return next(new AppError('Cannot delete your own account', 400))
    }

    // Get user auth ID
    const { data: userProfile, error: getUserError } = await supabase
      .from('user_profiles')
      .select('auth_user_id')
      .eq('id', id)
      .single()

    if (getUserError || !userProfile) {
      return next(new AppError('User not found', 404))
    }

    // Delete user profile (cascades to related data)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id)

    if (profileError) {
      console.error('Admin delete user profile error:', profileError)
      return next(new AppError('Failed to delete user profile', 500))
    }

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userProfile.auth_user_id)

    if (authError) {
      console.error('Admin delete auth user error:', authError)
      // Profile is already deleted, log this for manual cleanup
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Admin delete user error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// GET /api/admin/jobs - List all jobs
router.get('/jobs', validate(schemas.pagination, 'query'), async (req, res, next) => {
  try {
    const { page, limit, sortBy = 'created_at', sortOrder, status, search } = req.query
    const offset = (page - 1) * limit

    let query = supabase
      .from('job_postings')
      .select(`
        *,
        user_profiles!recruiter_id (
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (status && ['draft', 'published', 'closed'].includes(status)) {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%`)
    }

    // Apply sorting and pagination
    if (sortBy && ['created_at', 'title', 'status', 'updated_at'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }
    
    query = query.range(offset, offset + limit - 1)

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('Admin list jobs error:', error)
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
    console.error('Admin list jobs error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// PUT /api/admin/jobs/:id/status - Update job status
router.put('/jobs/:id/status', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status || !['draft', 'published', 'closed'].includes(status)) {
      return next(new AppError('Valid status is required', 400))
    }

    const { data: job, error } = await supabase
      .from('job_postings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Admin update job status error:', error)
      return next(new AppError('Failed to update job status', 500))
    }

    res.json({
      success: true,
      message: 'Job status updated successfully',
      data: { job }
    })
  } catch (error) {
    console.error('Admin update job status error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// GET /api/admin/system/health - System health check
router.get('/system/health', async (req, res, next) => {
  try {
    // Check database tables
    const tableChecks = await Promise.allSettled([
      supabase.from('user_profiles').select('count', { count: 'exact', head: true }),
      supabase.from('job_postings').select('count', { count: 'exact', head: true }),
      supabase.from('job_applications').select('count', { count: 'exact', head: true }),
      supabase.from('candidate_profiles').select('count', { count: 'exact', head: true }),
      supabase.from('recruiter_profiles').select('count', { count: 'exact', head: true })
    ])

    const healthData = {
      database: {
        connected: true,
        tables: {
          user_profiles: tableChecks[0].status === 'fulfilled' ? 'healthy' : 'error',
          job_postings: tableChecks[1].status === 'fulfilled' ? 'healthy' : 'error',
          job_applications: tableChecks[2].status === 'fulfilled' ? 'healthy' : 'error',
          candidate_profiles: tableChecks[3].status === 'fulfilled' ? 'healthy' : 'error',
          recruiter_profiles: tableChecks[4].status === 'fulfilled' ? 'healthy' : 'error'
        }
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
      }
    }

    res.json({
      success: true,
      data: healthData
    })
  } catch (error) {
    console.error('Admin system health error:', error)
    next(new AppError('Failed to check system health', 500))
  }
})

export default router
