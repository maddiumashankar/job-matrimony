import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedSidebar = ({ user, isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState({});

  const recruiterMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/recruiter-dashboard',
      icon: 'LayoutDashboard',
      badge: null,
      tooltip: 'View recruitment overview and analytics'
    },
    {
      id: 'job-posting',
      label: 'Job Posting',
      path: '/job-posting-creation',
      icon: 'Plus',
      badge: null,
      tooltip: 'Create and manage job postings'
    },
    {
      id: 'candidates',
      label: 'Candidates',
      path: '/candidates',
      icon: 'Users',
      badge: 12,
      tooltip: 'Manage candidate applications'
    },
    {
      id: 'interviews',
      label: 'Interviews',
      path: '/interviews',
      icon: 'Calendar',
      badge: 3,
      tooltip: 'Schedule and manage interviews'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: 'BarChart3',
      badge: null,
      tooltip: 'View hiring metrics and reports'
    }
  ];

  const candidateMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/candidate-dashboard',
      icon: 'LayoutDashboard',
      badge: null,
      tooltip: 'View your job search overview'
    },
    {
      id: 'profile',
      label: 'My Profile',
      path: '/candidate-profile',
      icon: 'User',
      badge: null,
      tooltip: 'Manage your professional profile'
    },
    {
      id: 'jobs',
      label: 'Job Search',
      path: '/jobs',
      icon: 'Search',
      badge: null,
      tooltip: 'Browse and search for jobs'
    },
    {
      id: 'applications',
      label: 'Applications',
      path: '/applications',
      icon: 'FileText',
      badge: 5,
      tooltip: 'Track your job applications'
    },
    {
      id: 'tests',
      label: 'Tests',
      path: '/tests',
      icon: 'Code',
      badge: 2,
      tooltip: 'Complete coding assessments'
    },
    {
      id: 'interviews',
      label: 'Interviews',
      path: '/interviews',
      icon: 'Video',
      badge: 1,
      tooltip: 'Manage interview schedules'
    }
  ];

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      path: '/admin-dashboard',
      icon: 'Shield',
      badge: null,
      tooltip: 'System overview and management'
    },
    {
      id: 'users',
      label: 'User Management',
      path: '/admin/users',
      icon: 'Users',
      badge: null,
      tooltip: 'Manage recruiters and candidates'
    },
    {
      id: 'companies',
      label: 'Companies',
      path: '/admin/companies',
      icon: 'Building',
      badge: null,
      tooltip: 'Manage company accounts'
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/admin/reports',
      icon: 'FileBarChart',
      badge: null,
      tooltip: 'System analytics and reports'
    },
    {
      id: 'settings',
      label: 'System Settings',
      path: '/admin/settings',
      icon: 'Settings',
      badge: null,
      tooltip: 'Configure system parameters'
    }
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'recruiter':
        return recruiterMenuItems;
      case 'candidate':
        return candidateMenuItems;
      case 'admin':
        return adminMenuItems;
      default:
        return candidateMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isOpen) {
        // Auto-open sidebar on desktop if closed
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-modal-backdrop md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-border z-fixed
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                  {user?.role === 'recruiter' ? 'Recruiter Portal' : 
                   user?.role === 'admin' ? 'Admin Panel' : 'Candidate Portal'}
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={onToggle}
                className="p-1 md:hidden"
                aria-label="Close sidebar"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg
                      transition-all duration-200 ease-out group
                      ${isActiveRoute(item.path)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      }
                    `}
                    title={item.tooltip}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      className={`mr-3 ${
                        isActiveRoute(item.path) ? 'text-primary-foreground' : 'text-text-tertiary group-hover:text-text-secondary'
                      }`}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                        ${isActiveRoute(item.path)
                          ? 'bg-primary-foreground text-primary'
                          : 'bg-accent text-accent-foreground'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer for Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
};

export default RoleBasedSidebar;