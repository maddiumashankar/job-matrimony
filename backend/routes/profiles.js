import express from 'express'
import { supabase } from '../config/supabase.js'
import { AppError } from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validation.js'

const router = express.Router()

// GET /api/profiles/:id
router.get('/:id', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params

    // Get user profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        role,
        location,
        bio,
        avatar_url,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single()

    if (error || !profile) {
      return next(new AppError('Profile not found', 404))
    }

    // Get role-specific profile data
    let additionalData = null
    
    if (profile.role === 'candidate') {
      const { data: candidateProfile } = await supabase
        .from('candidate_profiles')
        .select(`
          resume_url,
          portfolio_url,
          skills,
          experience_years,
          education,
          certifications,
          preferred_job_types,
          preferred_locations,
          expected_salary_min,
          expected_salary_max,
          available_from
        `)
        .eq('user_id', profile.id)
        .single()
      
      additionalData = candidateProfile
    } else if (profile.role === 'recruiter') {
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select(`
          company_name,
          company_website,
          company_size,
          industry,
          company_description,
          verification_status
        `)
        .eq('user_id', profile.id)
        .single()
      
      additionalData = recruiterProfile
    }

    res.json({
      success: true,
      data: {
        profile,
        additionalData
      }
    })
  } catch (error) {
    console.error('Get profile by ID error:', error)
    next(new AppError('Failed to fetch profile', 500))
  }
})

// GET /api/profiles/candidate/:id/detailed
router.get('/candidate/:id/detailed', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params

    // Get complete candidate profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        candidate_profiles (*)
      `)
      .eq('id', id)
      .eq('role', 'candidate')
      .single()

    if (error || !profile) {
      return next(new AppError('Candidate profile not found', 404))
    }

    // Remove sensitive information
    delete profile.auth_user_id
    delete profile.email
    delete profile.phone

    res.json({
      success: true,
      data: { profile }
    })
  } catch (error) {
    console.error('Get detailed candidate profile error:', error)
    next(new AppError('Failed to fetch candidate profile', 500))
  }
})

// GET /api/profiles/recruiter/:id/detailed
router.get('/recruiter/:id/detailed', validate(schemas.idParam, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params

    // Get complete recruiter profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        recruiter_profiles (*)
      `)
      .eq('id', id)
      .eq('role', 'recruiter')
      .single()

    if (error || !profile) {
      return next(new AppError('Recruiter profile not found', 404))
    }

    // Remove sensitive information
    delete profile.auth_user_id
    delete profile.email
    delete profile.phone

    res.json({
      success: true,
      data: { profile }
    })
  } catch (error) {
    console.error('Get detailed recruiter profile error:', error)
    next(new AppError('Failed to fetch recruiter profile', 500))
  }
})

// GET /api/profiles/candidates - Search candidates
router.get('/candidates', validate(schemas.pagination, 'query'), async (req, res, next) => {
  try {
    const { page, limit, sortBy = 'created_at', sortOrder } = req.query
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        location,
        bio,
        avatar_url,
        created_at,
        candidate_profiles (
          skills,
          experience_years,
          preferred_job_types,
          expected_salary_min,
          expected_salary_max
        )
      `, { count: 'exact' })
      .eq('role', 'candidate')
      .range(offset, offset + limit - 1)

    // Apply sorting
    if (sortBy && ['created_at', 'full_name', 'updated_at'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }

    const { data: profiles, error, count } = await query

    if (error) {
      console.error('Search candidates error:', error)
      return next(new AppError('Failed to search candidates', 500))
    }

    res.json({
      success: true,
      data: {
        profiles,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    })
  } catch (error) {
    console.error('Search candidates error:', error)
    next(new AppError('Internal server error', 500))
  }
})

export default router
