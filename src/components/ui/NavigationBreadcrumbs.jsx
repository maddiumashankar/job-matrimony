import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationBreadcrumbs = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/login': { label: 'Sign In', parent: null },
    '/register': { label: 'Sign Up', parent: null },
    '/recruiter-dashboard': { label: 'Dashboard', parent: null },
    '/candidate-dashboard': { label: 'Dashboard', parent: null },
    '/job-posting-creation': { label: 'Create Job Posting', parent: '/recruiter-dashboard' },
    '/candidate-profile': { label: 'My Profile', parent: '/candidate-dashboard' },
    '/candidates': { label: 'Candidates', parent: '/recruiter-dashboard' },
    '/interviews': { label: 'Interviews', parent: null },
    '/analytics': { label: 'Analytics', parent: '/recruiter-dashboard' },
    '/jobs': { label: 'Job Search', parent: '/candidate-dashboard' },
    '/applications': { label: 'My Applications', parent: '/candidate-dashboard' },
    '/tests': { label: 'Assessments', parent: '/candidate-dashboard' },
    '/admin-dashboard': { label: 'Admin Dashboard', parent: null },
    '/admin/users': { label: 'User Management', parent: '/admin-dashboard' },
    '/admin/companies': { label: 'Companies', parent: '/admin-dashboard' },
    '/admin/reports': { label: 'Reports', parent: '/admin-dashboard' },
    '/admin/settings': { label: 'System Settings', parent: '/admin-dashboard' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const currentPath = location.pathname;
    const breadcrumbs = [];
    
    const buildBreadcrumbChain = (path) => {
      const route = routeMap[path];
      if (!route) return;

      if (route.parent) {
        buildBreadcrumbChain(route.parent);
      }

      breadcrumbs.push({
        label: route.label,
        path: path,
        isActive: path === currentPath
      });
    };

    buildBreadcrumbChain(currentPath);
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on auth pages or if only one item
  if (!breadcrumbs || breadcrumbs.length <= 1 || 
      location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleBreadcrumbClick = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  const handleBackClick = () => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      navigate(previousBreadcrumb.path);
    } else {
      navigate(-1);
    }
  };

  return (
    <nav className="flex items-center space-x-2 py-3 px-4 sm:px-6 lg:px-8 bg-background border-b border-border-light" aria-label="Breadcrumb">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackClick}
        className="p-1 mr-2 hover:bg-surface-hover"
        aria-label="Go back"
      >
        <Icon name="ArrowLeft" size={16} />
      </Button>

      {/* Breadcrumb Items */}
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-text-tertiary mx-2" 
              />
            )}
            
            {breadcrumb.isActive ? (
              <span className="font-medium text-text-primary">
                {breadcrumb.label}
              </span>
            ) : (
              <button
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 hover:underline"
              >
                {breadcrumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>

      {/* Mobile Breadcrumb - Show only current page on small screens */}
      <div className="sm:hidden ml-auto">
        <span className="text-sm font-medium text-text-primary">
          {breadcrumbs[breadcrumbs.length - 1]?.label}
        </span>
      </div>
    </nav>
  );
};

export default NavigationBreadcrumbs;