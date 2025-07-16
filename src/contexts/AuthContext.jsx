import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '../lib/apiClient'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session from localStorage
    const getInitialSession = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        if (token && userData) {
          // Set token in API client
          apiClient.setToken(token)
          
          // Parse stored user data
          const parsedUserData = JSON.parse(userData)
          
          // Try to get current user to validate token
          try {
            const response = await apiClient.getCurrentUser()
            if (response.success) {
              // Use fresh data from API if available
              const { user, profile } = response.data
              const mergedUser = {
                ...user,
                ...profile,
                role: profile?.role || parsedUserData.role
              }
              setUser(mergedUser)
              setSession({ access_token: token, user: mergedUser })
            } else {
              // API call failed, use stored data
              setUser(parsedUserData)
              setSession({ access_token: token, user: parsedUserData })
            }
          } catch (apiError) {
            // API call failed, use stored data
            console.warn('API validation failed, using stored user data:', apiError)
            setUser(parsedUserData)
            setSession({ access_token: token, user: parsedUserData })
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
        // Clear invalid session data
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('userRole')
      }
      setLoading(false)
    }

    getInitialSession()
  }, [])

  const signIn = async (email, password, selectedRole = null) => {
    try {
      setLoading(true)
      
      console.log('Signing in user:', email, 'with role:', selectedRole)
      
      // Call backend login endpoint with role validation
      const response = await apiClient.login(email, password, selectedRole)
      
      if (response.success) {
        const { user, profile, session } = response.data
        
        // Merge user and profile data for easier access
        const mergedUser = {
          ...user,
          ...profile,
          role: profile.role // Ensure role comes from profile
        }
        
        // Store auth data
        localStorage.setItem('authToken', session.access_token)
        localStorage.setItem('userData', JSON.stringify(mergedUser))
        localStorage.setItem('userRole', profile.role)
        
        // Set token in API client
        apiClient.setToken(session.access_token)
        
        // Update state with merged user data
        setUser(mergedUser)
        setSession(session)
        
        console.log('Login successful for user:', user.email, 'with role:', profile.role)
        return { data: { user: mergedUser, session }, error: null }
      } else {
        return { data: null, error: new Error(response.message || 'Login failed') }
      }
      
    } catch (error) {
      console.error('SignIn error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      
      console.log('Registering user:', email, 'with role:', userData.role)
      
      // Prepare profile data
      const profileData = {
        full_name: userData.full_name || userData.fullName || email,
        phone: userData.phone || null,
        // Recruiter specific
        company_name: userData.company_name || userData.companyName || null,
        job_title: userData.job_title || userData.jobTitle || null,
        company_size: userData.company_size || userData.companySize || null,
        industry: userData.industry || null,
        company_website: userData.company_website || userData.companyWebsite || null,
        // Candidate specific
        preferred_job_title: userData.preferred_job_title || `${userData.skill_category || userData.skillCategory || 'Software'} Developer`,
        years_of_experience: userData.years_of_experience || (
          userData.experience === 'entry' ? 1 : 
          userData.experience === 'mid' ? 3 : 
          userData.experience === 'senior' ? 5 : 1
        ),
        location: userData.location || null,
        linkedin_url: userData.linkedin_url || userData.linkedinUrl || null,
        github_url: userData.github_url || userData.githubUrl || null
      }
      
      // Call backend register endpoint
      const response = await apiClient.register(email, password, userData.role, profileData)
      
      if (response.success) {
        console.log('Registration successful for user:', email)
        return { data: { user: response.data.user }, error: null }
      } else {
        return { data: null, error: new Error(response.message || 'Registration failed') }
      }
      
    } catch (error) {
      console.error('SignUp error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      console.log('Starting sign out process...')
      
      // Call backend logout endpoint
      try {
        await apiClient.logout()
      } catch (error) {
        console.warn('Backend logout failed:', error)
        // Continue with local cleanup even if backend call fails
      }
      
      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userData')
      localStorage.removeItem('rememberMe')
      
      console.log('Local storage cleared')
      
      // Clear API client token
      apiClient.setToken(null)
      
      // Clear state
      setUser(null)
      setSession(null)
      
      console.log('Auth state cleared')
      
      return { error: null }
    } catch (error) {
      console.error('SignOut error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      // Note: Backend doesn't have this endpoint yet, but we'll prepare for it
      // For now, we'll use a placeholder response
      console.log('Password reset requested for:', email)
      return { 
        data: { message: 'Password reset feature coming soon!' }, 
        error: null 
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
