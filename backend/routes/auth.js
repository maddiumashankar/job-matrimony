import express from 'express'
import { supabase, supabaseAdmin } from '../config/supabase.js'
import { AppError } from '../middleware/errorHandler.js'
import { validate, schemas } from '../middleware/validation.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', validate(schemas.login), async (req, res, next) => {
  try {
    const { email, password, role } = req.body

    // First, check if user exists and get their role
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('role, id')
      .eq('email', email)
      .single()

    console.log('Profile check result:', { existingProfile, profileCheckError })

    if (profileCheckError) {
      console.error('Profile check error details:', {
        message: profileCheckError.message,
        code: profileCheckError.code,
        details: profileCheckError.details,
        hint: profileCheckError.hint
      })
      
      if (profileCheckError.code !== 'PGRST116') {
        return next(new AppError('Database error during login', 500))
      }
    }

    // If user doesn't exist in our profiles
    if (!existingProfile) {
      console.log('User profile not found for email:', email)
      return next(new AppError('User not found. Please register first.', 401))
    }

    // Validate the role matches
    if (existingProfile.role !== role) {
      return next(new AppError(`Invalid role. This account is registered as a ${existingProfile.role}`, 400))
    }

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Auth error:', error)
      return next(new AppError('Invalid email or password', 401))
    }

    if (!data.user || !data.session) {
      return next(new AppError('Authentication failed', 401))
    }

    // Get complete user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError || !userProfile) {
      console.error('User profile fetch error:', userError)
      return next(new AppError('User profile not found', 404))
    }

    // Return sanitized user data (no sensitive info)
    res.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          last_sign_in_at: data.user.last_sign_in_at
        },
        profile: {
          id: userProfile.id,
          full_name: userProfile.full_name,
          role: userProfile.role,
          avatar_url: userProfile.avatar_url,
          created_at: userProfile.created_at
        },
        session: {
          access_token: data.session.access_token,
          token_type: data.session.token_type,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// POST /api/auth/register
router.post('/register', validate(schemas.register), async (req, res, next) => {
  try {
    const { email, password, role, profile } = req.body

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingProfile) {
      return next(new AppError('User with this email already exists', 409))
    }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: profile.full_name
        }
      }
    })

    if (error) {
      console.error('Auth signup error:', error)
      return next(new AppError(error.message || 'Registration failed', 400))
    }

    if (!data.user) {
      return next(new AppError('User creation failed', 400))
    }

    // The user profile should be created automatically by the database trigger
    // Wait a moment and then fetch it
    await new Promise(resolve => setTimeout(resolve, 1000))

    let { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // If profile doesn't exist, create it manually (trigger might not be working)
    if (profileError && profileError.code === 'PGRST116') {
      console.log('User profile not found, creating manually for user:', data.user.id)
      
      const profileData = {
        id: data.user.id,
        email: data.user.email,
        full_name: profile.full_name || data.user.email,
        role,
        phone: profile.phone || null,
        location: profile.location || null,
        bio: profile.bio || `New ${role} user`,
        email_verified: false,
        onboarding_completed: false
      }

      const { data: createdProfile, error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single()

      if (createError) {
        console.error('Manual profile creation failed:', createError)
        return next(new AppError('Profile creation failed', 500))
      }

      userProfile = createdProfile
    } else if (profileError) {
      console.error('Profile fetch error after registration:', profileError)
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at
        },
        profile: userProfile ? {
          id: userProfile.id,
          full_name: userProfile.full_name,
          role: userProfile.role,
          created_at: userProfile.created_at
        } : null
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    next(new AppError('Internal server error', 500))
  }
})

// POST /api/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      
      // Sign out with token
      const { error } = await supabase.auth.admin.signOut(token)
      
      if (error) {
        console.error('Logout error:', error)
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    next(new AppError('Logout failed', 500))
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return next(new AppError('Refresh token required', 400))
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    })

    if (error) {
      return next(new AppError('Invalid refresh token', 401))
    }

    res.json({
      success: true,
      data: {
        session: {
          access_token: data.session.access_token,
          token_type: data.session.token_type,
          expires_at: data.session.expires_at,
          expires_in: data.session.expires_in,
          refresh_token: data.session.refresh_token
        }
      }
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    next(new AppError('Internal server error', 500))
  }
})

export default router
