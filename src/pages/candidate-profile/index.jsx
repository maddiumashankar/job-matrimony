import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import components
import ProfileHeader from './components/ProfileHeader';
import OverviewTab from './components/OverviewTab';
import SkillsTab from './components/SkillsTab';
import PortfolioTab from './components/PortfolioTab';
import PreferencesTab from './components/PreferencesTab';
import AIEnhancementSuggestions from './components/AIEnhancementSuggestions';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [candidate, setCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "candidate"
  };

  // Mock candidate data
  const mockCandidate = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    currentRole: "Senior Frontend Developer",
    location: "San Francisco, CA",
    yearsExperience: 5,
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    profileCompletion: 85,
    skillMatchScore: 92,
    applicationCount: 12,
    resumeUrl: "/assets/resume.pdf",
    summary: `Passionate Frontend Developer with 5+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Led development teams in delivering high-performance applications that serve millions of users. Expertise in responsive design, performance optimization, and user experience enhancement.

Strong background in collaborating with cross-functional teams including designers, product managers, and backend engineers to deliver exceptional digital experiences. Proven track record of mentoring junior developers and implementing best practices for code quality and maintainability.`,
    
    workExperience: [
      {
        id: 1,
        position: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "2021-03-01",
        endDate: null,
        description: `Leading the frontend development team in building next-generation web applications using React, TypeScript, and GraphQL. Responsible for architecting scalable component libraries and implementing performance optimization strategies that improved page load times by 40%.

Collaborate closely with UX/UI designers to translate complex design systems into responsive, accessible web interfaces. Mentor junior developers and conduct code reviews to maintain high code quality standards across the team.`,
        achievements: [
          "Improved application performance by 40% through code splitting and lazy loading",
          "Led migration from JavaScript to TypeScript, reducing bugs by 30%",
          "Implemented automated testing suite with 90% code coverage",
          "Mentored 3 junior developers who were promoted within 6 months"
        ],
        technologies: ["React", "TypeScript", "GraphQL", "Next.js", "Tailwind CSS", "Jest", "Cypress"]
      },
      {
        id: 2,
        position: "Frontend Developer",
        company: "StartupXYZ",
        location: "San Francisco, CA",
        startDate: "2019-06-01",
        endDate: "2021-02-28",
        description: `Developed and maintained multiple client-facing web applications using React and Redux. Worked in an agile environment with rapid iteration cycles, delivering features that directly impacted user engagement and conversion rates.

Collaborated with the design team to implement pixel-perfect UI components and ensure consistent user experience across different devices and browsers. Participated in product planning sessions and provided technical insights for feature feasibility.`,
        achievements: [
          "Built responsive web applications serving 100K+ daily active users",
          "Implemented real-time chat functionality using WebSocket",
          "Reduced bundle size by 50% through webpack optimization",
          "Achieved 95+ Lighthouse performance scores across all pages"
        ],
        technologies: ["React", "Redux", "JavaScript", "SASS", "Webpack", "Node.js"]
      },
      {
        id: 3,
        position: "Junior Web Developer",
        company: "Digital Agency Pro",
        location: "San Francisco, CA",
        startDate: "2018-01-01",
        endDate: "2019-05-31",
        description: `Started career as a junior developer working on various client projects ranging from corporate websites to e-commerce platforms. Gained experience in multiple technologies and learned best practices for web development.

Worked closely with senior developers to understand code architecture and design patterns. Contributed to both frontend and backend development tasks while building a strong foundation in web technologies.`,
        achievements: [
          "Delivered 15+ client projects on time and within budget",
          "Learned and applied modern JavaScript frameworks",
          "Contributed to company\'s internal component library",
          "Received \'Rising Star\' award for exceptional learning curve"
        ],
        technologies: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "WordPress"]
      }
    ],

    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "2014-08-01",
        endDate: "2018-05-01",
        gpa: "3.8",
        description: `Comprehensive computer science education with focus on software engineering, algorithms, and data structures. Participated in multiple hackathons and coding competitions. Completed senior capstone project developing a machine learning-powered recommendation system.

Active member of the Computer Science Student Association and Women in Tech club. Served as teaching assistant for Introduction to Programming course for two semesters.`,
        coursework: [
          "Data Structures & Algorithms",
          "Software Engineering",
          "Database Systems",
          "Computer Networks",
          "Machine Learning",
          "Web Development"
        ]
      }
    ],

    skills: [
      { id: 1, name: "React", level: 5, category: "technical", verified: true, endorsements: 8 },
      { id: 2, name: "TypeScript", level: 4, category: "technical", verified: true, endorsements: 6 },
      { id: 3, name: "JavaScript", level: 5, category: "technical", verified: true, endorsements: 12 },
      { id: 4, name: "Next.js", level: 4, category: "technical", verified: false, endorsements: 4 },
      { id: 5, name: "GraphQL", level: 3, category: "technical", verified: false, endorsements: 3 },
      { id: 6, name: "Node.js", level: 3, category: "technical", verified: false, endorsements: 5 },
      { id: 7, name: "Leadership", level: 4, category: "soft", verified: false, endorsements: 7 },
      { id: 8, name: "Communication", level: 5, category: "soft", verified: false, endorsements: 9 },
      { id: 9, name: "Problem Solving", level: 5, category: "soft", verified: false, endorsements: 8 },
      { id: 10, name: "English", level: 5, category: "languages", verified: true, endorsements: 0 },
      { id: 11, name: "Spanish", level: 3, category: "languages", verified: false, endorsements: 0 },
      { id: 12, name: "Git", level: 4, category: "tools", verified: false, endorsements: 6 },
      { id: 13, name: "Docker", level: 2, category: "tools", verified: false, endorsements: 2 },
      { id: 14, name: "AWS", level: 3, category: "tools", verified: false, endorsements: 4 }
    ],

    certifications: [
      {
        id: 1,
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2023-06-15",
        expiryDate: "2026-06-15",
        credentialId: "AWS-SAA-123456",
        verified: true
      },
      {
        id: 2,
        name: "React Developer Certification",
        issuer: "Meta",
        issueDate: "2022-11-20",
        expiryDate: null,
        credentialId: "META-REACT-789012",
        verified: true
      }
    ],

    portfolio: [
      {
        id: 1,
        title: "E-commerce Dashboard",
        description: `A comprehensive admin dashboard for e-commerce businesses built with React, TypeScript, and Material-UI. Features include real-time analytics, inventory management, order processing, and customer relationship management.

The application handles complex data visualization with interactive charts and graphs, implements role-based access control, and provides a responsive design that works seamlessly across desktop and mobile devices.`,
        technologies: ["React", "TypeScript", "Material-UI", "Chart.js", "Redux Toolkit", "Node.js", "MongoDB"],
        liveUrl: "https://ecommerce-dashboard-demo.com",
        githubUrl: "https://github.com/sarah-johnson/ecommerce-dashboard",
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
        ],
        features: [
          "Real-time sales analytics and reporting",
          "Inventory management with low-stock alerts",
          "Customer management and communication tools",
          "Order processing and fulfillment tracking",
          "Role-based access control for team members",
          "Responsive design for mobile and desktop"
        ]
      },
      {
        id: 2,
        title: "Task Management App",
        description: `A collaborative task management application inspired by modern productivity tools. Built with React, Node.js, and PostgreSQL, featuring real-time collaboration, drag-and-drop functionality, and team workspace management.

Implements advanced features like real-time notifications, file attachments, time tracking, and detailed project analytics. The application supports multiple project views including Kanban boards, calendar view, and list view.`,
        technologies: ["React", "Node.js", "PostgreSQL", "Socket.io", "Express", "JWT", "Tailwind CSS"],
        liveUrl: "https://taskflow-app.com",
        githubUrl: "https://github.com/sarah-johnson/taskflow",
        images: [
          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
          "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop"
        ],
        features: [
          "Real-time collaboration with team members",
          "Drag-and-drop task management",
          "Multiple project views (Kanban, Calendar, List)",
          "Time tracking and productivity analytics",
          "File attachments and comments",
          "Team workspace management"
        ]
      }
    ],

    githubStats: {
      repositories: 42,
      followers: 156,
      contributions: 1247,
      stars: 89
    },

    preferences: {
      jobTypes: ["full-time", "contract"],
      workModes: ["remote", "hybrid"],
      salaryRange: { min: 120000, max: 180000, currency: "USD" },
      locations: ["San Francisco, CA", "New York, NY", "Remote"],
      industries: ["Technology", "Finance", "Healthcare"],
      companySize: ["medium", "large"],
      availability: "2-weeks",
      noticePeriod: 14,
      willingToRelocate: false,
      remoteWork: true,
      travelWillingness: "minimal"
    }
  };

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      title: "Profile View",
      message: "TechCorp Inc. viewed your profile",
      type: "application",
      read: false,
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      title: "New Job Match",
      message: "5 new jobs match your preferences",
      type: "success",
      read: false,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      title: "Interview Scheduled",
      message: "Interview with StartupXYZ scheduled for tomorrow",
      type: "interview",
      read: true,
      timestamp: new Date(Date.now() - 86400000)
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCandidate(mockCandidate);
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'skills', label: 'Skills & Certifications', icon: 'Code' },
    { id: 'portfolio', label: 'Portfolio', icon: 'FolderOpen' },
    { id: 'preferences', label: 'Job Preferences', icon: 'Settings' },
    { id: 'ai-suggestions', label: 'AI Suggestions', icon: 'Sparkles' }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handlePhotoUpload = (file) => {
    // Simulate photo upload
    console.log('Uploading photo:', file.name);
    // In real app, upload to server and update candidate photo
  };

  const handleEditProfile = () => {
    // Navigate to edit mode or show edit modal
    console.log('Edit profile clicked');
  };

  const handleUpdateSummary = (summary) => {
    setCandidate(prev => ({ ...prev, summary }));
  };

  const handleUpdateSkills = (skills) => {
    setCandidate(prev => ({ ...prev, skills }));
  };

  const handleUpdatePortfolio = (portfolio) => {
    setCandidate(prev => ({ ...prev, portfolio }));
  };

  const handleUpdatePreferences = (preferences) => {
    setCandidate(prev => ({ ...prev, preferences }));
  };

  const handleApplySuggestion = (suggestion) => {
    console.log('Applying suggestion:', suggestion);
    // Implement suggestion application logic
  };

  const handleDismissSuggestion = (suggestionId) => {
    console.log('Dismissing suggestion:', suggestionId);
    // Implement suggestion dismissal logic
  };

  const renderTabContent = () => {
    if (!candidate) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            candidate={candidate}
            onUpdateSummary={handleUpdateSummary}
          />
        );
      case 'skills':
        return (
          <SkillsTab
            candidate={candidate}
            onUpdateSkills={handleUpdateSkills}
          />
        );
      case 'portfolio':
        return (
          <PortfolioTab
            candidate={candidate}
            onUpdatePortfolio={handleUpdatePortfolio}
          />
        );
      case 'preferences':
        return (
          <PreferencesTab
            candidate={candidate}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );
      case 'ai-suggestions':
        return (
          <AIEnhancementSuggestions
            candidate={candidate}
            onApplySuggestion={handleApplySuggestion}
            onDismissSuggestion={handleDismissSuggestion}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader user={mockUser} onLogout={handleLogout} notifications={[]} />
        <div className="flex">
          <RoleBasedSidebar
            user={mockUser}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthenticatedHeader
        user={mockUser}
        onLogout={handleLogout}
        notifications={notifications}
      />

      <div className="flex">
        {/* Sidebar */}
        <RoleBasedSidebar
          user={mockUser}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 min-h-[calc(100vh-4rem)]">
          {/* Breadcrumbs */}
          <NavigationBreadcrumbs />

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Profile Header */}
            <ProfileHeader
              candidate={candidate}
              onPhotoUpload={handlePhotoUpload}
              onEditProfile={handleEditProfile}
            />

            {/* Tab Navigation */}
            <div className="bg-surface rounded-lg shadow-elevation-1 mb-6">
              <div className="border-b border-border-light">
                <nav className="flex space-x-8 px-6" aria-label="Profile tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border-dark'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <Button
        variant="primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 md:hidden w-12 h-12 rounded-full shadow-elevation-4 z-fixed"
        iconName="Menu"
      />
    </div>
  );
};

export default CandidateProfile;