import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

// Import all components
import MetricsCard from './components/MetricsCard';
import JobListItem from './components/JobListItem';
import CandidatePipelineWidget from './components/CandidatePipelineWidget';
import UpcomingInterviewsWidget from './components/UpcomingInterviewsWidget';
import RecentActivityFeed from './components/RecentActivityFeed';
import PerformanceChart from './components/PerformanceChart';
import QuickActionsPanel from './components/QuickActionsPanel';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Get user data from backend API response
  const getUserData = () => {
    if (user) {
      return {
        id: user.id,
        name: user.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: user.role || 'recruiter',
        company: user.company_name || 'Company',
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
        role: parsedUser.role || 'recruiter',
        company: parsedUser.company_name || 'Company',
        avatar: parsedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.full_name || parsedUser.email)}&background=0284c7&color=fff`
      };
    }
    
    return {
      id: 1,
      name: "Sarah Johnson",
      email: "recruiter@company.com",
      role: "recruiter",
      company: "TechCorp Solutions",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=0284c7&color=fff"
    };
  };

  const currentUser = getUserData();

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New Application Received",
      message: "John Doe applied for Senior Frontend Developer position",
      time: "5 minutes ago",
      read: false,
      type: "application"
    },
    {
      id: 2,
      title: "Interview Reminder",
      message: "Interview with Jane Smith in 30 minutes",
      time: "25 minutes ago",
      read: false,
      type: "interview"
    },
    {
      id: 3,
      title: "Candidate Test Completed",
      message: "Mike Wilson completed the coding assessment",
      time: "2 hours ago",
      read: true,
      type: "test"
    }
  ];

  // Mock metrics data
  const metricsData = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+2",
      changeType: "positive",
      icon: "Briefcase",
      color: "primary"
    },
    {
      title: "Total Applications",
      value: "248",
      change: "+18%",
      changeType: "positive",
      icon: "FileText",
      color: "success"
    },
    {
      title: "Interviews Scheduled",
      value: "15",
      change: "+5",
      changeType: "positive",
      icon: "Calendar",
      color: "secondary"
    },
    {
      title: "Hires This Month",
      value: "8",
      change: "+3",
      changeType: "positive",
      icon: "Trophy",
      color: "warning"
    }
  ];

  // Mock jobs data
  const jobsData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      status: "Active",
      postedDate: "3 days ago",
      applicationCount: 45,
      shortlistedCount: 12,
      interviewCount: 5,
      applicationTrend: 15,
      expiresIn: 25,
      urgent: true
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      status: "Active",
      postedDate: "1 week ago",
      applicationCount: 32,
      shortlistedCount: 8,
      interviewCount: 3,
      applicationTrend: -5,
      expiresIn: 18,
      urgent: false
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      location: "Remote",
      status: "Draft",
      postedDate: "2 days ago",
      applicationCount: 0,
      shortlistedCount: 0,
      interviewCount: 0,
      applicationTrend: 0,
      expiresIn: 30,
      urgent: false
    }
  ];

  // Mock candidates data
  const candidatesData = [
    {
      id: 1,
      name: "Alex Rodriguez",
      position: "Senior Frontend Developer",
      location: "San Francisco, CA",
      experience: "5+ years",
      stage: "Interview",
      rating: "92%",
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: "Emily Chen",
      position: "Product Manager",
      location: "New York, NY",
      experience: "7+ years",
      stage: "Screening",
      rating: "88%",
      skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
      appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: "Michael Thompson",
      position: "Data Scientist",
      location: "Remote",
      experience: "4+ years",
      stage: "Applied",
      rating: "85%",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  // Mock interviews data
  const interviewsData = [
    {
      id: 1,
      candidateName: "Alex Rodriguez",
      position: "Senior Frontend Developer",
      dateTime: new Date(Date.now() + 30 * 60 * 1000),
      type: "Video",
      interviewer: "Sarah Johnson",
      duration: 60,
      round: 2
    },
    {
      id: 2,
      candidateName: "Emily Chen",
      position: "Product Manager",
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      type: "Phone",
      interviewer: "Mark Davis",
      duration: 45,
      round: 1
    },
    {
      id: 3,
      candidateName: "Michael Thompson",
      position: "Data Scientist",
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      type: "Video",
      interviewer: "Lisa Wang",
      duration: 90,
      round: 3
    }
  ];

  // Mock activity data
  const activityData = [
    {
      id: 1,
      type: "application",
      candidateName: "John Doe",
      action: "applied for",
      jobTitle: "Senior Frontend Developer",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 2,
      type: "interview_scheduled",
      candidateName: "Jane Smith",
      action: "interview scheduled for",
      jobTitle: "Product Manager",
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 3,
      type: "test_completed",
      candidateName: "Mike Wilson",
      action: "completed coding test for",
      jobTitle: "Full Stack Developer",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 4,
      type: "candidate_shortlisted",
      candidateName: "Sarah Davis",
      action: "was shortlisted for",
      jobTitle: "UX Designer",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  // Mock performance chart data
  const performanceData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 25 },
    { name: 'Fri', value: 22 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 5 }
  ];

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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewApplications = (jobId) => {
    console.log('View applications for job:', jobId);
  };

  const handleEditJob = (jobId) => {
    console.log('Edit job:', jobId);
  };

  const handleShareJob = (jobId) => {
    console.log('Share job:', jobId);
  };

  const handleViewCandidate = (candidateId) => {
    console.log('View candidate:', candidateId);
  };

  const handleMoveStage = (candidateId) => {
    console.log('Move candidate stage:', candidateId);
  };

  const handleJoinInterview = (interviewId) => {
    console.log('Join interview:', interviewId);
  };

  const handleReschedule = (interviewId) => {
    console.log('Reschedule interview:', interviewId);
  };

  const handlePostJob = () => {
    navigate('/job-posting-creation');
  };

  const handleBrowseCandidates = () => {
    console.log('Browse candidates');
  };

  const handleScheduleInterview = () => {
    console.log('Schedule interview');
  };

  const handleViewAnalytics = () => {
    console.log('View analytics');
  };

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'applications':
        return b.applicationCount - a.applicationCount;
      case 'recent':
        return new Date(b.postedDate) - new Date(a.postedDate);
      case 'expiring':
        return a.expiresIn - b.expiresIn;
      default:
        return 0;
    }
  });

  useEffect(() => {
    document.title = 'Recruiter Dashboard - Job Matrimony';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthenticatedHeader
        user={currentUser}
        onLogout={handleLogout}
        notifications={notifications}
      />

      {/* Sidebar */}
      <RoleBasedSidebar
        user={currentUser}
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <main className="pt-16 md:pl-64">
        {/* Breadcrumbs */}
        <NavigationBreadcrumbs />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-text-secondary">
                Here's what's happening with your recruitment pipeline today.
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={handleBrowseCandidates}
                iconName="Search"
                className="px-4 py-2"
              >
                Browse Candidates
              </Button>
              <Button
                variant="primary"
                onClick={handlePostJob}
                iconName="Plus"
                className="px-4 py-2"
              >
                Post New Job
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Job Listings */}
            <div className="lg:col-span-8">
              <div className="bg-surface rounded-lg border border-border p-6">
                {/* Jobs Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4 sm:mb-0">
                    Active Job Postings
                  </h2>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="search"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="recent">Most Recent</option>
                      <option value="applications">Most Applications</option>
                      <option value="expiring">Expiring Soon</option>
                    </select>
                  </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                  {sortedJobs.map((job) => (
                    <JobListItem
                      key={job.id}
                      job={job}
                      onViewApplications={handleViewApplications}
                      onEditJob={handleEditJob}
                      onShareJob={handleShareJob}
                    />
                  ))}
                </div>

                {sortedJobs.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="Briefcase" size={48} className="mx-auto text-text-tertiary mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No jobs found</h3>
                    <p className="text-text-secondary mb-4">
                      {searchQuery || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'Get started by posting your first job'
                      }
                    </p>
                    <Button variant="primary" onClick={handlePostJob}>
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Widgets */}
            <div className="lg:col-span-4 space-y-6">
              {/* Candidate Pipeline */}
              <CandidatePipelineWidget
                candidates={candidatesData}
                onViewCandidate={handleViewCandidate}
                onMoveStage={handleMoveStage}
              />

              {/* Upcoming Interviews */}
              <UpcomingInterviewsWidget
                interviews={interviewsData}
                onJoinInterview={handleJoinInterview}
                onReschedule={handleReschedule}
              />

              {/* Quick Actions */}
              <QuickActionsPanel
                onPostJob={handlePostJob}
                onBrowseCandidates={handleBrowseCandidates}
                onScheduleInterview={handleScheduleInterview}
                onViewAnalytics={handleViewAnalytics}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Recent Activity */}
            <RecentActivityFeed activities={activityData} />

            {/* Performance Chart */}
            <PerformanceChart
              data={performanceData}
              type="bar"
              title="Weekly Application Trends"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;