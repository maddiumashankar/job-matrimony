import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActionsPanel = ({ onPostJob, onBrowseCandidates, onScheduleInterview, onViewAnalytics }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'post-job',
      title: 'Post New Job',
      description: 'Create and publish a new job posting',
      icon: 'Plus',
      color: 'primary',
      onClick: () => navigate('/job-posting-creation')
    },
    {
      id: 'browse-candidates',
      title: 'Browse Candidates',
      description: 'Search and filter candidate profiles',
      icon: 'Search',
      color: 'secondary',
      onClick: onBrowseCandidates
    },
    {
      id: 'schedule-interview',
      title: 'Schedule Interview',
      description: 'Set up interviews with candidates',
      icon: 'Calendar',
      color: 'accent',
      onClick: onScheduleInterview
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Check hiring performance metrics',
      icon: 'BarChart3',
      color: 'success',
      onClick: onViewAnalytics
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 hover:bg-primary-100 border-primary-200 text-primary-700';
      case 'secondary':
        return 'bg-secondary-50 hover:bg-secondary-100 border-secondary-200 text-secondary-700';
      case 'accent':
        return 'bg-accent-50 hover:bg-accent-100 border-accent-200 text-accent-700';
      case 'success':
        return 'bg-success-50 hover:bg-success-100 border-success-200 text-success-700';
      default:
        return 'bg-primary-50 hover:bg-primary-100 border-primary-200 text-primary-700';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`
              p-4 rounded-lg border transition-all duration-200 text-left
              hover:shadow-elevation-2 hover:scale-105 active:scale-95
              ${getColorClasses(action.color)}
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon name={action.icon} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-text-primary mb-1">{action.title}</h4>
                <p className="text-sm text-text-secondary">{action.description}</p>
              </div>
              <Icon name="ArrowRight" size={16} className="flex-shrink-0 opacity-60" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border-light">
        <h4 className="text-sm font-medium text-text-primary mb-3">Recent Templates</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-2 rounded hover:bg-surface-hover transition-colors">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">Software Engineer - Frontend</span>
            </div>
            <Icon name="Copy" size={14} className="text-text-tertiary" />
          </button>
          <button className="w-full flex items-center justify-between p-2 rounded hover:bg-surface-hover transition-colors">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">Product Manager - Senior</span>
            </div>
            <Icon name="Copy" size={14} className="text-text-tertiary" />
          </button>
          <button className="w-full flex items-center justify-between p-2 rounded hover:bg-surface-hover transition-colors">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">Data Scientist - ML</span>
            </div>
            <Icon name="Copy" size={14} className="text-text-tertiary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;