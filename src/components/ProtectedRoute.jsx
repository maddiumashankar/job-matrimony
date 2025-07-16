import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required role (if roles are specified)
  if (roles.length > 0) {
    console.log('ProtectedRoute - checking roles:', roles);
    console.log('ProtectedRoute - user:', user);
    
    // Use role from user object (backend returns role directly in user object)
    const userRole = user.role || 'candidate';
    console.log('ProtectedRoute - detected user role:', userRole);
    
    if (!roles.includes(userRole)) {
      console.log('ProtectedRoute - access denied for role:', userRole, 'required:', roles);
      
      // Redirect to appropriate dashboard instead of login
      const redirectTo = getDefaultRouteForRole(userRole);
      console.log('ProtectedRoute - redirecting to:', redirectTo);
      return <Navigate to={redirectTo} replace />
    }
  }

  return children
}

// Helper function to get default route for each role
const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'recruiter':
      return '/recruiter-dashboard';
    case 'candidate':
    default:
      return '/candidate-dashboard';
  }
}

export default ProtectedRoute
