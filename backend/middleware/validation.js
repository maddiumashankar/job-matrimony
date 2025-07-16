import Joi from 'joi'
import { AppError } from './errorHandler.js'

export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    })

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ')
      
      return next(new AppError(errorMessage, 400))
    }

    next()
  }
}

// Common validation schemas
export const schemas = {
  // Authentication schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
    role: Joi.string().valid('candidate', 'recruiter', 'admin').required()
  }),

  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('candidate', 'recruiter').required(),
    profile: Joi.object({
      full_name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^[+]?[1-9][\d\s\-()]{7,15}$/).optional(),
      location: Joi.string().max(200).optional(),
      bio: Joi.string().max(1000).optional()
    }).required()
  }),

  // Profile schemas
  updateProfile: Joi.object({
    full_name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^[+]?[1-9][\d\s\-()]{7,15}$/).optional(),
    location: Joi.string().max(200).optional(),
    bio: Joi.string().max(1000).optional(),
    avatar_url: Joi.string().uri().optional()
  }),

  // Job schemas
  createJob: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(50).max(5000).required(),
    requirements: Joi.string().min(20).max(2000).required(),
    company_name: Joi.string().min(2).max(100).required(),
    location: Joi.string().max(200).required(),
    job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'freelance', 'internship').required(),
    experience_level: Joi.string().valid('entry', 'mid', 'senior', 'executive').required(),
    salary_min: Joi.number().positive().optional(),
    salary_max: Joi.number().positive().optional(),
    currency: Joi.string().length(3).uppercase().optional(),
    remote_allowed: Joi.boolean().default(false),
    application_deadline: Joi.date().greater('now').optional()
  }),

  updateJob: Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(50).max(5000).optional(),
    requirements: Joi.string().min(20).max(2000).optional(),
    company_name: Joi.string().min(2).max(100).optional(),
    location: Joi.string().max(200).optional(),
    job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'freelance', 'internship').optional(),
    experience_level: Joi.string().valid('entry', 'mid', 'senior', 'executive').optional(),
    salary_min: Joi.number().positive().optional(),
    salary_max: Joi.number().positive().optional(),
    currency: Joi.string().length(3).uppercase().optional(),
    remote_allowed: Joi.boolean().optional(),
    application_deadline: Joi.date().greater('now').optional(),
    status: Joi.string().valid('draft', 'published', 'closed').optional()
  }),

  // Common schemas
  idParam: Joi.object({
    id: Joi.string().uuid().required()
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
}
