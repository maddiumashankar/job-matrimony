import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeedWidget = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_signup': return 'UserPlus';
      case 'job_post': return 'Briefcase';
      case 'application': return 'FileText';
      case 'system': return 'Settings';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_signup': return 'text-blue-600 bg-blue-100';
      case 'job_post': return 'text-green-600 bg-green-100';
      case 'application': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary-dark">
            View All
          </button>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-gray-300 mx-auto mb-4" />
            <div className="text-text-secondary">No recent activity</div>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <Icon name={getActivityIcon(activity.type)} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text-primary">{activity.message}</div>
                  <div className="text-xs text-text-secondary mt-1">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedWidget;
