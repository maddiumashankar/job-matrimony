import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import MetricsCard from './components/MetricsCard';
import UserManagementWidget from './components/UserManagementWidget';
import SystemOverviewWidget from './components/SystemOverviewWidget';
import ActivityFeedWidget from './components/ActivityFeedWidget';
import PlatformSettingsWidget from './components/PlatformSettingsWidget';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeRecruiters: 0,
    activeCandidates: 0,
    recentActivities: []
  });

  useEffect(() => {
    // Load dashboard data from backend API
    const loadDashboardData = async () => {
      try {
        // Get admin stats from backend
        const response = await apiClient.getAdminStats();
        if (response.success) {
          setDashboardData(response.data);
        }
        
        // Get user profile if available
        if (user?.id) {
          try {
            const profileResponse = await apiClient.getUserProfile();
            if (profileResponse.success) {
              console.log('User profile from backend:', profileResponse.data);
              setUserProfile(profileResponse.data);
            }
          } catch (profileError) {
            console.log('Could not fetch user profile:', profileError);
          }
        }
        
        setDashboardData({
          totalUsers: 1247,
          totalJobs: 89,
          totalApplications: 2341,
          activeRecruiters: 156,
          activeCandidates: 1091,
          recentActivities: [
            { id: 1, type: 'user_signup', message: 'New candidate registered: John Doe', timestamp: '2 minutes ago' },
            { id: 2, type: 'job_post', message: 'New job posted: Senior React Developer at TechCorp', timestamp: '15 minutes ago' },
            { id: 3, type: 'application', message: '5 new applications received', timestamp: '1 hour ago' },
            { id: 4, type: 'user_signup', message: 'New recruiter registered: Sarah Johnson from StartupXYZ', timestamp: '2 hours ago' },
            { id: 5, type: 'system', message: 'Database backup completed successfully', timestamp: '4 hours ago' }
          ]
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const metrics = [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      change: '+12%',
      changeType: 'increase',
      icon: 'Users',
      description: 'All registered users'
    },
    {
      title: 'Active Jobs',
      value: dashboardData.totalJobs,
      change: '+8%',
      changeType: 'increase',
      icon: 'Briefcase',
      description: 'Currently open positions'
    },
    {
      title: 'Total Applications',
      value: dashboardData.totalApplications,
      change: '+15%',
      changeType: 'increase',
      icon: 'FileText',
      description: 'All job applications'
    },
    {
      title: 'Active Recruiters',
      value: dashboardData.activeRecruiters,
      change: '+5%',
      changeType: 'increase',
      icon: 'UserCheck',
      description: 'Active recruiting companies'
    }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Create user object with the expected format
  console.log('Raw user object from Supabase:', user);
  console.log('User metadata:', user?.user_metadata);
  console.log('User email:', user?.email);
  console.log('User profile from DB:', userProfile);
  
  const headerUser = {
    name: userProfile?.full_name || 
          user?.user_metadata?.full_name || 
          user?.email?.split('@')[0] || 
          'Admin User',
    email: user?.email || userProfile?.email || 'admin@gmail.com',
    role: userProfile?.role || 
          user?.user_metadata?.role || 
          'admin'
  };
  
  console.log('Formatted headerUser:', headerUser);

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader user={headerUser} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Admin Dashboard
              </h1>
              <p className="text-text-secondary mt-1">
                Welcome back, {user?.email || 'Admin'}! Manage your platform from here.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-text-primary">System Status</div>
                <div className="text-success flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricsCard key={index} {...metric} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <UserManagementWidget />
            <SystemOverviewWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ActivityFeedWidget activities={dashboardData.recentActivities} />
            <PlatformSettingsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
