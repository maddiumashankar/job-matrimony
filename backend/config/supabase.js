import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Node.js 18+ has built-in fetch, Headers, Request, and Response
// No polyfill needed for modern Node.js versions

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for user operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for service operations (uses service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Connection health check
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    return { success: true, message: 'Supabase connection is healthy' }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { success: false, message: error.message }
  }
}
