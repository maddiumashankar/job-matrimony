import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WizardNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onSave, 
  onPublish,
  isValid,
  isSaving,
  isPublishing 
}) => {
  const steps = [
    { id: 1, title: 'Basic Info', icon: 'Briefcase' },
    { id: 2, title: 'Description', icon: 'FileText' },
    { id: 3, title: 'Requirements', icon: 'CheckSquare' },
    { id: 4, title: 'Compensation', icon: 'DollarSign' },
    { id: 5, title: 'Settings', icon: 'Settings' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      case 'upcoming':
        return 'bg-surface text-text-tertiary border-border';
      default:
        return 'bg-surface text-text-tertiary border-border';
    }
  };

  return (
    <div className="bg-surface border-b border-border-light">
      <div className="px-6 py-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${getStepClasses(status)}
                  `}>
                    {status === 'completed' ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step.icon} size={16} />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      status === 'current' ? 'text-primary' : 
                      status === 'completed' ? 'text-success' : 'text-text-tertiary'
                    }`}>
                      Step {step.id}
                    </p>
                    <p className={`text-xs ${
                      status === 'current' ? 'text-primary-600' : 
                      status === 'completed' ? 'text-success-600' : 'text-text-tertiary'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    status === 'completed' ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={onPrevious}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Save as Draft */}
            <Button
              variant="ghost"
              onClick={onSave}
              disabled={isSaving}
              iconName={isSaving ? "Loader2" : "Save"}
              className={isSaving ? "animate-spin" : ""}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>

            {/* Next/Publish Button */}
            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                onClick={onNext}
                disabled={!isValid}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onSave}
                  disabled={isSaving || !isValid}
                  iconName={isSaving ? "Loader2" : "Save"}
                  className={isSaving ? "animate-spin" : ""}
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  variant="primary"
                  onClick={onPublish}
                  disabled={isPublishing || !isValid}
                  iconName={isPublishing ? "Loader2" : "Send"}
                  className={isPublishing ? "animate-spin" : ""}
                >
                  {isPublishing ? 'Publishing...' : 'Publish Job'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>Progress</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardNavigation;