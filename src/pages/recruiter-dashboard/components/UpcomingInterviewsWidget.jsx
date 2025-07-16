import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpcomingInterviewsWidget = ({ interviews, onJoinInterview, onReschedule }) => {
  const getInterviewTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'Video';
      case 'phone':
        return 'Phone';
      case 'in-person':
        return 'MapPin';
      default:
        return 'Calendar';
    }
  };

  const getInterviewTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'text-primary';
      case 'phone':
        return 'text-secondary';
      case 'in-person':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getTimeUntilInterview = (dateTime) => {
    const now = new Date();
    const interviewTime = new Date(dateTime);
    const diffInMinutes = Math.floor((interviewTime - now) / (1000 * 60));
    
    if (diffInMinutes < 0) return 'Overdue';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const isInterviewSoon = (dateTime) => {
    const now = new Date();
    const interviewTime = new Date(dateTime);
    const diffInMinutes = Math.floor((interviewTime - now) / (1000 * 60));
    return diffInMinutes <= 30 && diffInMinutes > 0;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Upcoming Interviews</h3>
        <Button variant="ghost" className="text-sm text-primary">
          View Calendar
        </Button>
      </div>

      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className={`border rounded-lg p-4 transition-all duration-200 ${
              isInterviewSoon(interview.dateTime)
                ? 'border-warning bg-warning-50 hover:bg-warning-100' :'border-border-light hover:bg-surface-hover'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1">{interview.candidateName}</h4>
                <p className="text-sm text-text-secondary">{interview.position}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-text-secondary mb-1">
                  <Icon name="Clock" size={14} className="mr-1" />
                  <span>{getTimeUntilInterview(interview.dateTime)}</span>
                </div>
                {isInterviewSoon(interview.dateTime) && (
                  <span className="px-2 py-1 bg-warning text-warning-foreground text-xs font-medium rounded-full">
                    Starting Soon
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <span className="flex items-center">
                <Icon name="Calendar" size={14} className="mr-1" />
                {formatDate(interview.dateTime)}
              </span>
              <span className="flex items-center">
                <Icon name="Clock" size={14} className="mr-1" />
                {formatTime(interview.dateTime)}
              </span>
              <span className="flex items-center">
                <Icon 
                  name={getInterviewTypeIcon(interview.type)} 
                  size={14} 
                  className={`mr-1 ${getInterviewTypeColor(interview.type)}`} 
                />
                {interview.type}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-text-secondary mb-3">
              <Icon name="User" size={14} />
              <span>Interviewer: {interview.interviewer}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {interview.round && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    Round {interview.round}
                  </span>
                )}
                <span className="px-2 py-1 bg-background text-text-secondary text-xs font-medium rounded-full">
                  {interview.duration} min
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => onReschedule(interview.id)}
                  className="p-2"
                  iconName="Calendar"
                  aria-label="Reschedule interview"
                />
                <Button
                  variant="primary"
                  onClick={() => onJoinInterview(interview.id)}
                  className="px-3 py-1 text-sm"
                  disabled={getTimeUntilInterview(interview.dateTime) === 'Overdue'}
                >
                  {interview.type === 'video' ? 'Join Call' : 'View Details'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {interviews.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Calendar" size={32} className="mx-auto text-text-tertiary mb-3" />
          <p className="text-sm text-text-secondary">No upcoming interviews</p>
          <p className="text-xs text-text-tertiary mt-1">
            Scheduled interviews will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviewsWidget;