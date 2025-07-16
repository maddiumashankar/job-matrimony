import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ApplicationStatusTracker = ({ applications, onViewApplication, onTakeAction }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Applied': {
        color: 'text-primary bg-primary-50',
        icon: 'Send',
        description: 'Application submitted successfully'
      },
      'Under Review': {
        color: 'text-warning bg-warning-50',
        icon: 'Eye',
        description: 'Recruiter is reviewing your profile'
      },
      'Test Invited': {
        color: 'text-secondary bg-secondary-50',
        icon: 'Code',
        description: 'Complete your assessment'
      },
      'Interview Scheduled': {
        color: 'text-accent bg-accent-50',
        icon: 'Calendar',
        description: 'Prepare for your interview'
      },
      'Decision Pending': {
        color: 'text-text-secondary bg-surface-active',
        icon: 'Clock',
        description: 'Awaiting final decision'
      },
      'Accepted': {
        color: 'text-success bg-success-50',
        icon: 'CheckCircle',
        description: 'Congratulations! Offer accepted'
      },
      'Rejected': {
        color: 'text-error bg-error-50',
        icon: 'XCircle',
        description: 'Application not selected'
      }
    };
    return configs[status] || configs['Applied'];
  };

  const getNextAction = (application) => {
    switch (application.status) {
      case 'Test Invited':
        return {
          label: 'Take Test',
          action: 'take-test',
          variant: 'primary',
          urgent: true
        };
      case 'Interview Scheduled':
        return {
          label: 'Join Interview',
          action: 'join-interview',
          variant: 'primary',
          urgent: true
        };
      case 'Under Review':
        return {
          label: 'View Details',
          action: 'view-details',
          variant: 'outline',
          urgent: false
        };
      default:
        return {
          label: 'View Application',
          action: 'view-application',
          variant: 'ghost',
          urgent: false
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Expired';
    if (diffHours < 24) return `${diffHours}h left`;
    
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays}d left`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Application Status</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="ExternalLink"
          onClick={() => onViewApplication('all')}
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.slice(0, 5).map((application) => {
            const statusConfig = getStatusConfig(application.status);
            const nextAction = getNextAction(application);
            const timeRemaining = getTimeRemaining(application.deadline);

            return (
              <div
                key={application.id}
                className="p-4 rounded-lg border border-border-light hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-text-primary mb-1">
                      {application.jobTitle}
                    </h4>
                    <p className="text-xs text-text-secondary mb-2">
                      {application.companyName}
                    </p>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <Icon name={statusConfig.icon} size={12} />
                      <span>{application.status}</span>
                    </div>
                  </div>
                  {nextAction.urgent && timeRemaining && (
                    <div className="text-xs text-warning font-medium">
                      {timeRemaining}
                    </div>
                  )}
                </div>

                <p className="text-xs text-text-secondary mb-3">
                  {statusConfig.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-tertiary">
                    Applied: {formatDate(application.appliedDate)}
                  </div>
                  <Button
                    variant={nextAction.variant}
                    size="xs"
                    onClick={() => onTakeAction(application.id, nextAction.action)}
                    className={nextAction.urgent ? 'animate-pulse' : ''}
                  >
                    {nextAction.label}
                  </Button>
                </div>

                {application.feedback && (
                  <div className="mt-3 p-2 bg-surface-active rounded text-xs text-text-secondary">
                    <Icon name="MessageSquare" size={12} className="inline mr-1" />
                    {application.feedback}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Icon name="FileText" size={32} className="mx-auto text-text-tertiary mb-3" />
            <p className="text-sm text-text-secondary mb-2">No applications yet</p>
            <p className="text-xs text-text-tertiary">
              Start applying to jobs to track your progress here
            </p>
          </div>
        )}
      </div>

      {applications.length > 5 && (
        <div className="mt-4 pt-4 border-t border-border-light">
          <Button
            variant="outline"
            fullWidth
            onClick={() => onViewApplication('all')}
            iconName="ArrowRight"
            iconPosition="right"
          >
            View All {applications.length} Applications
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusTracker;