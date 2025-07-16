import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import ProfileCompletionCard from './components/ProfileCompletionCard';
import JobRecommendationCard from './components/JobRecommendationCard';
import ApplicationStatusTracker from './components/ApplicationStatusTracker';
import UpcomingActivitiesCard from './components/UpcomingActivitiesCard';
import JobFilters from './components/JobFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    jobType: '',
    salary: { min: null, max: null },
    skills: []
  });

  // Get user data from backend API response
  const getUserData = () => {
    if (user) {
      return {
        id: user.id,
        name: user.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: user.role || 'candidate',
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=0284c7&color=fff`
      };
    }
    
    // Fallback to localStorage for demo users
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      return {
        id: parsedUser.id,
        name: parsedUser.full_name || parsedUser.email?.split('@')[0] || 'User',
        email: parsedUser.email,
        role: parsedUser.role || 'candidate',
        avatar: parsedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.full_name || parsedUser.email)}&background=0284c7&color=fff`
      };
    }
    
    return {
      id: 1,
      name: "John Doe",
      email: "candidate@example.com",
      role: "candidate",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=0284c7&color=fff"
    };
  };

  const currentUser = getUserData();

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New Job Match",
      message: "Senior Frontend Developer at TechCorp matches your profile 95%",
      time: "2 minutes ago",
      read: false,
      type: "application"
    },
    {
      id: 2,
      title: "Test Invitation",
      message: "Complete your coding assessment for DataFlow Inc.",
      time: "1 hour ago",
      read: false,
      type: "test"
    },
    {
      id: 3,
      title: "Interview Scheduled",
      message: "Video interview with CloudTech scheduled for tomorrow at 2 PM",
      time: "3 hours ago",
      read: true,
      type: "interview"
    }
  ];

  // Mock profile data
  const profileData = {
    hasResume: true,
    skillsCount: 8,
    hasExperience: true,
    hasEducation: true,
    hasPreferences: false
  };

  // Mock job recommendations
  const jobRecommendations = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: {
        name: "TechCorp Solutions",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100"
      },
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "5-8 years",
      salaryMin: 120000,
      salaryMax: 160000,
      matchPercentage: 95,
      keyRequirements: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
      deadline: "2024-02-15",
      isUrgent: true,
      isSaved: false
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: {
        name: "DataFlow Inc",
        logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100"
      },
      location: "Remote",
      type: "Full-time",
      experience: "3-6 years",
      salaryMin: 100000,
      salaryMax: 140000,
      matchPercentage: 88,
      keyRequirements: ["Python", "Django", "React", "PostgreSQL"],
      deadline: "2024-02-20",
      isUrgent: false,
      isSaved: true
    },
    {
      id: 3,
      title: "React Developer",
      company: {
        name: "CloudTech",
        logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100"
      },
      location: "Austin, TX",
      type: "Full-time",
      experience: "2-5 years",
      salaryMin: 85000,
      salaryMax: 115000,
      matchPercentage: 82,
      keyRequirements: ["React", "JavaScript", "CSS", "Git"],
      deadline: "2024-02-25",
      isUrgent: false,
      isSaved: false
    }
  ];

  // Mock applications
  const applications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      companyName: "TechCorp Solutions",
      status: "Test Invited",
      appliedDate: "2024-01-15",
      deadline: "2024-01-20T14:00:00",
      feedback: null
    },
    {
      id: 2,
      jobTitle: "Full Stack Engineer",
      companyName: "DataFlow Inc",
      status: "Interview Scheduled",
      appliedDate: "2024-01-10",
      deadline: "2024-01-18T15:30:00",
      feedback: null
    },
    {
      id: 3,
      jobTitle: "React Developer",
      companyName: "CloudTech",
      status: "Under Review",
      appliedDate: "2024-01-12",
      deadline: null,
      feedback: "Your profile looks great! We\'ll get back to you soon."
    },
    {
      id: 4,
      jobTitle: "Frontend Developer",
      companyName: "StartupXYZ",
      status: "Applied",
      appliedDate: "2024-01-14",
      deadline: null,
      feedback: null
    },
    {
      id: 5,
      jobTitle: "UI Developer",
      companyName: "DesignCorp",
      status: "Rejected",
      appliedDate: "2024-01-08",
      deadline: null,
      feedback: "Thank you for your interest. We\'ve decided to move forward with other candidates."
    }
  ];

  // Mock upcoming activities
  const upcomingActivities = [
    {
      id: 1,
      type: "test",
      title: "Frontend Coding Assessment",
      company: "TechCorp Solutions",
      dateTime: "2024-01-20T14:00:00",
      duration: "90 minutes",
      instructions: "Complete the React component challenges and algorithm questions."
    },
    {
      id: 2,
      type: "interview",
      title: "Technical Interview",
      company: "DataFlow Inc",
      dateTime: "2024-01-18T15:30:00",
      duration: "60 minutes",
      instructions: "Prepare for system design and coding questions."
    },
    {
      id: 3,
      type: "meeting",
      title: "Culture Fit Discussion",
      company: "CloudTech",
      dateTime: "2024-01-22T10:00:00",
      duration: "30 minutes",
      instructions: "Casual conversation with the team lead."
    }
  ];

  // Mock saved searches
  const [savedSearches, setSavedSearches] = useState([
    {
      id: 1,
      name: "Remote React Jobs",
      filters: {
        location: "Remote",
        experience: "Mid Level (2-5 years)",
        jobType: "Full-time",
        salary: { min: 80000, max: 120000 },
        skills: ["React", "JavaScript"]
      }
    }
  ]);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      // Navigation will be handled by the auth context and protected routes
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback: clear localStorage and navigate
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('rememberMe');
      navigate('/login');
    }
  };

  const handleProfileAction = (actionId) => {
    switch (actionId) {
      case 'complete-profile':
        navigate('/candidate-profile');
        break;
      case 'resume': navigate('/candidate-profile?section=resume');
        break;
      case 'skills': navigate('/candidate-profile?section=skills');
        break;
      case 'experience': navigate('/candidate-profile?section=experience');
        break;
      case 'education': navigate('/candidate-profile?section=education');
        break;
      case 'preferences': navigate('/candidate-profile?section=preferences');
        break;
      default:
        navigate('/candidate-profile');
    }
  };

  const handleJobApply = (jobId) => {
    console.log('Applying to job:', jobId);
    // In real app, this would trigger application process
  };

  const handleJobSave = (jobId) => {
    console.log('Saving job:', jobId);
    // In real app, this would save/unsave the job
  };

  const handleJobViewDetails = (jobId) => {
    console.log('Viewing job details:', jobId);
    // In real app, this would navigate to job details page
  };

  const handleViewApplication = (applicationId) => {
    if (applicationId === 'all') {
      navigate('/applications');
    } else {
      console.log('Viewing application:', applicationId);
      // In real app, this would navigate to application details
    }
  };

  const handleTakeAction = (applicationId, action) => {
    console.log('Taking action:', action, 'for application:', applicationId);
    switch (action) {
      case 'take-test':
        navigate(`/tests/${applicationId}`);
        break;
      case 'join-interview':
        navigate(`/interviews/${applicationId}`);
        break;
      case 'view-details': case'view-application':
        navigate(`/applications/${applicationId}`);
        break;
    }
  };

  const handleJoinActivity = (activityId, type) => {
    console.log('Joining activity:', activityId, type);
    switch (type) {
      case 'test':
        navigate(`/tests/${activityId}`);
        break;
      case 'interview':
        navigate(`/interviews/${activityId}`);
        break;
      case 'meeting':
        navigate(`/meetings/${activityId}`);
        break;
    }
  };

  const handleReschedule = (activityId) => {
    console.log('Rescheduling activity:', activityId);
    // In real app, this would open reschedule dialog
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // In real app, this would trigger job search with new filters
  };

  const handleSaveSearch = (name, searchFilters) => {
    const newSearch = {
      id: Date.now(),
      name,
      filters: searchFilters
    };
    setSavedSearches([...savedSearches, newSearch]);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader
        user={currentUser}
        onLogout={handleLogout}
        notifications={notifications}
      />

      <div className="flex">
        <RoleBasedSidebar
          user={currentUser}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 pt-16">
          <NavigationBreadcrumbs />
          
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-text-secondary">
                Track your applications, discover new opportunities, and manage your career journey.
              </p>
            </div>

            {/* Job Filters */}
            <JobFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSaveSearch={handleSaveSearch}
              savedSearches={savedSearches}
            />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Panel - Profile Completion */}
              <div className="lg:col-span-3">
                <ProfileCompletionCard
                  profileData={profileData}
                  onActionClick={handleProfileAction}
                />
              </div>

              {/* Center Panel - Job Recommendations */}
              <div className="lg:col-span-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">
                      Recommended Jobs
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/jobs')}
                      iconName="Search"
                      iconPosition="left"
                    >
                      Browse All Jobs
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {jobRecommendations.map((job) => (
                      <JobRecommendationCard
                        key={job.id}
                        job={job}
                        onApply={handleJobApply}
                        onSave={handleJobSave}
                        onViewDetails={handleJobViewDetails}
                      />
                    ))}
                  </div>

                  {jobRecommendations.length === 0 && (
                    <div className="text-center py-12 bg-surface rounded-lg border border-border">
                      <Icon name="Search" size={48} className="mx-auto text-text-tertiary mb-4" />
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        No job recommendations yet
                      </h3>
                      <p className="text-text-secondary mb-4">
                        Complete your profile to get personalized job matches
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/candidate-profile')}
                      >
                        Complete Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Applications & Activities */}
              <div className="lg:col-span-3 space-y-6">
                <ApplicationStatusTracker
                  applications={applications}
                  onViewApplication={handleViewApplication}
                  onTakeAction={handleTakeAction}
                />
                
                <UpcomingActivitiesCard
                  activities={upcomingActivities}
                  onJoinActivity={handleJoinActivity}
                  onReschedule={handleReschedule}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-surface rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  iconName="Search"
                  iconPosition="left"
                  className="justify-start"
                >
                  Search Jobs
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/applications')}
                  iconName="FileText"
                  iconPosition="left"
                  className="justify-start"
                >
                  My Applications
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/tests')}
                  iconName="Code"
                  iconPosition="left"
                  className="justify-start"
                >
                  Take Tests
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/candidate-profile')}
                  iconName="User"
                  iconPosition="left"
                  className="justify-start"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;