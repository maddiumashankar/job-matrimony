import express from 'express'
import { supabase } from '../config/supabase.js'
import { AppError } from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validation.js'

const router = express.Router()

// GET /api/users/profile
router.get('/profile', async (req, res, next) => {
  try {
    const profile = req.userProfile

    // Get additional profile data based on role
    let additionalData = null
    
    if (profile.role === 'candidate') {
      const { data: candidateProfile } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .single()
      
      additionalData = candidateProfile
    } else if (profile.role === 'recruiter') {
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .single()
      
      additionalData = recruiterProfile
    }

    res.json({
      success: true,
      data: {
        profile: {
          ...profile,
          // Remove sensitive fields
          auth_user_id: undefined
        },
        additionalData
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    next(new AppError('Failed to fetch profile', 500))
  }
})

// PUT /api/users/profile
router.put('/profile', validate(schemas.updateProfile), async (req, res, next) => {
  try {
    const profileData = req.body
    const userId = req.userProfile.id

    // Update user profile
    const { data: updatedProfile, error } = await supabase
      .from('user_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return next(new AppError('Failed to update profile', 500))
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: {
          ...updatedProfile,
          // Remove sensitive fields
          auth_user_id: undefined
        }
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// GET /api/users/me
router.get('/me', async (req, res, next) => {
  try {
    const user = req.user
    const profile = req.userProfile

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at,
          created_at: user.created_at
        },
        profile: {
          ...profile,
          // Remove sensitive fields
          auth_user_id: undefined
        }
      }
    })
  } catch (error) {
    console.error('Get current user error:', error)
    next(new AppError('Failed to fetch user data', 500))
  }
})

// DELETE /api/users/account
router.delete('/account', async (req, res, next) => {
  try {
    const userId = req.user.id
    const profileId = req.userProfile.id

    // Delete user profile (this will cascade to related data)
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', profileId)

    if (profileError) {
      console.error('Profile deletion error:', profileError)
      return next(new AppError('Failed to delete profile', 500))
    }

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Auth user deletion error:', authError)
      // Profile is already deleted, so we can't roll back easily
      // Log this for manual cleanup if needed
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    next(new AppError('Internal server error', 500))
  }
})

export default router
