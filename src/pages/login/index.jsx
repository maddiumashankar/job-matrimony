import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import RoleSelector from './components/RoleSelector';
import TrustSignals from './components/TrustSignals';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock credentials for different roles (for demo purposes)
  const mockCredentials = {
    candidate: {
      email: 'srinubandlamudi55@gmail.com',
      password: 'candidate123'
    },
    recruiter: {
      email: 'recruiter@company.com',
      password: 'recruiter123'
    },
    admin: {
      email: 'admin@gmail.com',
      password: 'admin'
    }
  };

  useEffect(() => {
    // If user is already authenticated and we're not in the middle of a login attempt, redirect to appropriate dashboard
    if (user && !loading && !isLoading) {
      console.log('User detected:', user);
      console.log('User role:', user.role);
      
      // Use role from user object (backend returns role in user object)
      const userRole = user.role || 'candidate';
      console.log('Detected user role:', userRole);
      redirectToDashboard(userRole);
    }
  }, [user, loading, isLoading]);

  const redirectToDashboard = (role) => {
    const from = location.state?.from?.pathname || getDefaultRoute(role);
    navigate(from, { replace: true });
  };

  const getDefaultRoute = (role) => {
    console.log('Getting default route for role:', role);
    switch (role) {
      case 'recruiter': 
        console.log('Redirecting to recruiter dashboard');
        return '/recruiter-dashboard';
      case 'candidate': 
        console.log('Redirecting to candidate dashboard');
        return '/candidate-dashboard';
      case 'admin': 
        console.log('Redirecting to admin dashboard');
        return '/admin-dashboard';
      default:
        console.log('Unknown role, defaulting to candidate dashboard');
        return '/candidate-dashboard';
    }
  };

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email, 'for role:', selectedRole);
      
      // Try backend authentication with role validation
      const { data, error: authError } = await signIn(formData.email, formData.password, selectedRole);
      
      console.log('Backend auth result:', { data, authError });
      
      if (authError) {
        console.log('Backend auth failed, error:', authError.message || authError);
        setError(authError.message || authError.toString());
      } else if (data?.user) {
        // Successful backend authentication
        console.log('Backend auth successful, user:', data.user);
        
        // Get the validated role from backend response
        const userRole = data.user.role || 'candidate';
        console.log('User role validated:', userRole);
        
        redirectToDashboard(userRole);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError(''); // Clear any existing errors when role changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f1f5f9%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      
      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-elevation-4 border border-border p-8">
          <LoginHeader />
          
          <RoleSelector 
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
          />
          
          <LoginForm 
            onLogin={handleLogin}
            isLoading={isLoading}
            error={error}
          />
          
          <TrustSignals />
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 bg-surface rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">Demo Credentials:</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Candidate:</span>
              <span className="text-text-primary font-mono">srinubandlamudi55@gmail.com / candidate123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Recruiter:</span>
              <span className="text-text-primary font-mono">recruiter@company.com / recruiter123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Admin:</span>
              <span className="text-text-primary font-mono">admin@gmail.com / admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;