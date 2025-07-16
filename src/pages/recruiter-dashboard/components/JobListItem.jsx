import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobListItem = ({ job, onViewApplications, onEditJob, onShareJob }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'draft':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'closed':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'paused':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      default:
        return 'bg-primary-100 text-primary-700 border-primary-200';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { icon: 'TrendingUp', color: 'text-success-600' };
    if (trend < 0) return { icon: 'TrendingDown', color: 'text-error-600' };
    return { icon: 'Minus', color: 'text-text-tertiary' };
  };

  const trendData = getTrendIcon(job.applicationTrend);

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-1">{job.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span className="flex items-center">
              <Icon name="Building" size={16} className="mr-1" />
              {job.department}
            </span>
            <span className="flex items-center">
              <Icon name="MapPin" size={16} className="mr-1" />
              {job.location}
            </span>
            <span className="flex items-center">
              <Icon name="Calendar" size={16} className="mr-1" />
              Posted {job.postedDate}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
          {job.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
          <div>
            <p className="text-sm text-text-secondary">Applications</p>
            <p className="text-xl font-bold text-text-primary">{job.applicationCount}</p>
          </div>
          <div className="flex items-center">
            <Icon name={trendData.icon} size={16} className={trendData.color} />
            <span className={`text-sm font-medium ml-1 ${trendData.color}`}>
              {Math.abs(job.applicationTrend)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
          <div>
            <p className="text-sm text-text-secondary">Shortlisted</p>
            <p className="text-xl font-bold text-text-primary">{job.shortlistedCount}</p>
          </div>
          <Icon name="UserCheck" size={20} className="text-primary" />
        </div>

        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
          <div>
            <p className="text-sm text-text-secondary">Interviews</p>
            <p className="text-xl font-bold text-text-primary">{job.interviewCount}</p>
          </div>
          <Icon name="Video" size={20} className="text-secondary" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="Clock" size={16} className="mr-1" />
            <span>Expires in {job.expiresIn} days</span>
          </div>
          {job.urgent && (
            <span className="px-2 py-1 bg-error-100 text-error-700 text-xs font-medium rounded-full">
              Urgent
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => onShareJob(job.id)}
            className="p-2"
            iconName="Share2"
            aria-label="Share job"
          />
          <Button
            variant="outline"
            onClick={() => onEditJob(job.id)}
            className="px-3 py-1 text-sm"
          >
            Edit
          </Button>
          <Button
            variant="primary"
            onClick={() => onViewApplications(job.id)}
            className="px-3 py-1 text-sm"
          >
            View Applications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobListItem;