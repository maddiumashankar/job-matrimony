import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingActivitiesCard = ({ activities, onJoinActivity, onReschedule }) => {
  const getActivityConfig = (type) => {
    const configs = {
      'test': {
        icon: 'Code',
        color: 'text-secondary bg-secondary-50',
        title: 'Coding Assessment',
        actionLabel: 'Start Test'
      },
      'interview': {
        icon: 'Video',
        color: 'text-primary bg-primary-50',
        title: 'Interview',
        actionLabel: 'Join Interview'
      },
      'meeting': {
        icon: 'Users',
        color: 'text-accent bg-accent-50',
        title: 'Meeting',
        actionLabel: 'Join Meeting'
      }
    };
    return configs[type] || configs['test'];
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${timeString}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${timeString}`;
    } else {
      return `${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })} at ${timeString}`;
    }
  };

  const getTimeUntil = (dateTime) => {
    const now = new Date();
    const activityTime = new Date(dateTime);
    const diffMs = activityTime - now;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) return 'Overdue';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const isUrgent = (dateTime) => {
    const now = new Date();
    const activityTime = new Date(dateTime);
    const diffHours = (activityTime - now) / (1000 * 60 * 60);
    return diffHours <= 2 && diffHours > 0;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Upcoming Activities</h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs text-text-secondary">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.slice(0, 4).map((activity) => {
            const config = getActivityConfig(activity.type);
            const timeUntil = getTimeUntil(activity.dateTime);
            const urgent = isUrgent(activity.dateTime);

            return (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  urgent 
                    ? 'border-warning bg-warning-50 animate-pulse' :'border-border-light hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}>
                    <Icon name={config.icon} size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-text-primary">
                        {config.title}
                      </h4>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        urgent ? 'text-warning bg-warning-100' : 'text-text-secondary bg-surface-active'
                      }`}>
                        {timeUntil}
                      </span>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-1">
                      {activity.title}
                    </p>
                    
                    <p className="text-xs text-text-tertiary mb-3">
                      {activity.company} • {formatDateTime(activity.dateTime)}
                    </p>

                    {activity.duration && (
                      <div className="flex items-center space-x-1 text-xs text-text-secondary mb-3">
                        <Icon name="Clock" size={12} />
                        <span>Duration: {activity.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Button
                        variant={urgent ? "primary" : "outline"}
                        size="xs"
                        onClick={() => onJoinActivity(activity.id, activity.type)}
                        className={urgent ? 'animate-pulse' : ''}
                      >
                        {config.actionLabel}
                      </Button>
                      
                      {activity.type === 'interview' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => onReschedule(activity.id)}
                          iconName="Calendar"
                        >
                          Reschedule
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {activity.instructions && (
                  <div className="mt-3 p-2 bg-surface-active rounded text-xs text-text-secondary">
                    <Icon name="Info" size={12} className="inline mr-1" />
                    {activity.instructions}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Icon name="Calendar" size={32} className="mx-auto text-text-tertiary mb-3" />
            <p className="text-sm text-text-secondary mb-2">No upcoming activities</p>
            <p className="text-xs text-text-tertiary">
              Your tests and interviews will appear here
            </p>
          </div>
        )}
      </div>

      {activities.length > 4 && (
        <div className="mt-4 pt-4 border-t border-border-light">
          <Button
            variant="ghost"
            fullWidth
            iconName="Calendar"
            iconPosition="left"
          >
            View Full Calendar
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpcomingActivitiesCard;