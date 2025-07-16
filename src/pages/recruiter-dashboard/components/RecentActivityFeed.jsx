import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'application':
        return 'FileText';
      case 'interview_scheduled':
        return 'Calendar';
      case 'interview_completed':
        return 'CheckCircle';
      case 'candidate_shortlisted':
        return 'UserCheck';
      case 'job_posted':
        return 'Plus';
      case 'offer_sent':
        return 'Mail';
      case 'candidate_hired':
        return 'Trophy';
      case 'test_completed':
        return 'Code';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'application':
        return 'text-primary';
      case 'interview_scheduled':
        return 'text-secondary';
      case 'interview_completed':
        return 'text-success';
      case 'candidate_shortlisted':
        return 'text-warning';
      case 'job_posted':
        return 'text-accent';
      case 'offer_sent':
        return 'text-primary';
      case 'candidate_hired':
        return 'text-success';
      case 'test_completed':
        return 'text-secondary';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary-600 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border-light ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{activity.candidateName || activity.actor}</span>
                    <span className="text-text-secondary ml-1">{activity.action}</span>
                    {activity.jobTitle && (
                      <span className="font-medium text-text-primary ml-1">{activity.jobTitle}</span>
                    )}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-text-tertiary mt-1">{activity.details}</p>
                  )}
                </div>
                <span className="text-xs text-text-tertiary flex-shrink-0 ml-2">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={32} className="mx-auto text-text-tertiary mb-3" />
          <p className="text-sm text-text-secondary">No recent activity</p>
          <p className="text-xs text-text-tertiary mt-1">
            Activity updates will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;