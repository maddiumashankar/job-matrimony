import express from 'express'
import { checkConnection } from '../config/supabase.js'

const router = express.Router()

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const dbCheck = await checkConnection()
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'job-matrimony-backend',
      version: '1.0.0',
      database: dbCheck.success ? 'connected' : 'disconnected',
      uptime: process.uptime()
    }

    if (!dbCheck.success) {
      healthStatus.status = 'unhealthy'
      healthStatus.errors = [dbCheck.message]
      return res.status(503).json(healthStatus)
    }

    res.json(healthStatus)
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'job-matrimony-backend',
      version: '1.0.0',
      database: 'error',
      uptime: process.uptime(),
      errors: [error.message]
    })
  }
})

export default router
