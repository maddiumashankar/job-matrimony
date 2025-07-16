import { supabase } from '../config/supabase.js'
import { AppError } from './errorHandler.js'

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401))
    }

    const token = authHeader.split(' ')[1]

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return next(new AppError('Invalid or expired token', 401))
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (profileError || !profile) {
      return next(new AppError('User profile not found', 404))
    }

    // Attach user and profile to request
    req.user = user
    req.userProfile = profile
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    next(new AppError('Authentication failed', 401))
  }
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userProfile) {
      return next(new AppError('User profile not found', 404))
    }

    if (!roles.includes(req.userProfile.role)) {
      return next(new AppError('Insufficient permissions', 403))
    }

    next()
  }
}

export const requireAdmin = requireRole('admin')
export const requireRecruiter = requireRole('recruiter', 'admin')
export const requireCandidate = requireRole('candidate', 'admin')
