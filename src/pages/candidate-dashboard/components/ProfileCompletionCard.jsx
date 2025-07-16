import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileCompletionCard = ({ profileData, onActionClick }) => {
  const completionItems = [
    {
      id: 'resume',
      label: 'Upload Resume',
      completed: profileData.hasResume,
      action: 'Upload',
      icon: 'FileText',
      description: 'Add your latest resume to get better job matches'
    },
    {
      id: 'skills',
      label: 'Add Skills',
      completed: profileData.skillsCount > 0,
      action: 'Add Skills',
      icon: 'Code',
      description: `${profileData.skillsCount} skills added`
    },
    {
      id: 'experience',
      label: 'Work Experience',
      completed: profileData.hasExperience,
      action: 'Add Experience',
      icon: 'Briefcase',
      description: 'Share your professional background'
    },
    {
      id: 'education',
      label: 'Education Details',
      completed: profileData.hasEducation,
      action: 'Add Education',
      icon: 'GraduationCap',
      description: 'Include your educational qualifications'
    },
    {
      id: 'preferences',
      label: 'Job Preferences',
      completed: profileData.hasPreferences,
      action: 'Set Preferences',
      icon: 'Settings',
      description: 'Define your ideal job criteria'
    }
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="bg-surface rounded-lg border border-border p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Profile Completion</h3>
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeDasharray={`${completionPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-text-primary">{completionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {completionItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border-light hover:bg-surface-hover transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-success text-success-foreground' : 'bg-border text-text-tertiary'
              }`}>
                {item.completed ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <Icon name={item.icon} size={16} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-secondary">{item.description}</p>
              </div>
            </div>
            {!item.completed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onActionClick(item.id)}
                className="text-primary hover:text-primary-600"
              >
                {item.action}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border-light">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onActionClick('complete-profile')}
          iconName="User"
          iconPosition="left"
        >
          Complete Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCompletionCard;