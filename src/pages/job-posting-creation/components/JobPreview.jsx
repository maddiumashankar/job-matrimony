import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JobPreview = ({ formData }) => {
  const getEmploymentTypeLabel = (type) => {
    const types = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'internship': 'Internship',
      'freelance': 'Freelance'
    };
    return types[type] || type;
  };

  const getWorkModeLabel = (mode) => {
    const modes = {
      'remote': 'Remote',
      'onsite': 'On-site',
      'hybrid': 'Hybrid'
    };
    return modes[mode] || mode;
  };

  const getExperienceLevelLabel = (level) => {
    const levels = {
      'entry': 'Entry Level (0-2 years)',
      'mid': 'Mid Level (3-5 years)',
      'senior': 'Senior Level (6-10 years)',
      'lead': 'Lead/Principal (10+ years)'
    };
    return levels[level] || level;
  };

  const formatSalary = () => {
    if (formData.salaryType === 'negotiable') {
      return 'Salary Negotiable';
    }
    
    if (formData.minSalary && formData.maxSalary) {
      const currency = formData.currency || 'USD';
      const min = parseInt(formData.minSalary).toLocaleString();
      const max = parseInt(formData.maxSalary).toLocaleString();
      const period = formData.salaryType === 'hourly' ? '/hour' : '/year';
      return `${currency} ${min} - ${max}${period}`;
    }
    
    return 'Salary not specified';
  };

  const getBenefitLabel = (benefitId) => {
    const benefits = {
      'health-insurance': 'Health Insurance',
      'dental-vision': 'Dental & Vision',
      'retirement-401k': '401(k) / Retirement Plan',
      'paid-time-off': 'Paid Time Off',
      'flexible-schedule': 'Flexible Schedule',
      'remote-work': 'Remote Work Options',
      'professional-development': 'Professional Development',
      'gym-membership': 'Gym Membership',
      'stock-options': 'Stock Options',
      'commuter-benefits': 'Commuter Benefits',
      'life-insurance': 'Life Insurance',
      'parental-leave': 'Parental Leave'
    };
    return benefits[benefitId] || benefitId;
  };

  const calculateMatchPercentage = () => {
    // Mock match percentage calculation
    let score = 0;
    if (formData.title) score += 20;
    if (formData.description && formData.description.length > 200) score += 20;
    if (formData.requiredSkills && formData.requiredSkills.length > 0) score += 20;
    if (formData.location) score += 10;
    if (formData.minSalary && formData.maxSalary) score += 15;
    if (formData.benefits && formData.benefits.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const matchPercentage = calculateMatchPercentage();

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Preview Header */}
      <div className="p-4 bg-primary-50 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Match Score:</span>
            <div className="flex items-center space-x-1">
              <div className="w-12 h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    matchPercentage >= 80 ? 'bg-success' : 
                    matchPercentage >= 60 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${matchPercentage}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${
                matchPercentage >= 80 ? 'text-success' : 
                matchPercentage >= 60 ? 'text-warning' : 'text-error'
              }`}>
                {matchPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Preview Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {/* Job Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {formData.title || 'Job Title'}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Icon name="Building" size={16} />
                  <span>{formData.department || 'Department'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span>{formData.location || 'Location'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} />
                  <span>Posted 2 hours ago</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Button variant="primary" size="sm">
                Apply Now
              </Button>
              <Button variant="ghost" size="sm" iconName="Heart">
                Save
              </Button>
            </div>
          </div>

          {/* Job Tags */}
          <div className="flex flex-wrap gap-2">
            {formData.employmentType && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                {getEmploymentTypeLabel(formData.employmentType)}
              </span>
            )}
            {formData.workMode && (
              <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                {getWorkModeLabel(formData.workMode)}
              </span>
            )}
            {formData.experienceLevel && (
              <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                {getExperienceLevelLabel(formData.experienceLevel)}
              </span>
            )}
            {formData.isUrgent && (
              <span className="px-3 py-1 bg-error-100 text-error-700 rounded-full text-sm">
                Urgent Hiring
              </span>
            )}
          </div>
        </div>

        {/* Salary Information */}
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={20} className="text-success" />
            <div>
              <h3 className="font-semibold text-success-700">Compensation</h3>
              <p className="text-success-600">{formatSalary()}</p>
            </div>
          </div>
        </div>

        {/* Job Summary */}
        {formData.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">About This Role</h3>
            <p className="text-text-secondary leading-relaxed">{formData.summary}</p>
          </div>
        )}

        {/* Job Description */}
        {formData.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                {formData.description}
              </div>
            </div>
          </div>
        )}

        {/* Required Skills */}
        {formData.requiredSkills && formData.requiredSkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Requirements */}
        {(formData.minExperience || formData.preferredExperience) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Experience Requirements</h3>
            <div className="space-y-2 text-text-secondary">
              {formData.minExperience && (
                <p>• Minimum {formData.minExperience} years of experience required</p>
              )}
              {formData.preferredExperience && (
                <p>• {formData.preferredExperience} years of experience preferred</p>
              )}
            </div>
          </div>
        )}

        {/* Benefits */}
        {((formData.benefits && formData.benefits.length > 0) || 
          (formData.customBenefits && formData.customBenefits.length > 0)) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Benefits & Perks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {formData.benefits && formData.benefits.map((benefitId, index) => (
                <div key={index} className="flex items-center space-x-2 text-text-secondary">
                  <Icon name="Check" size={16} className="text-success" />
                  <span>{getBenefitLabel(benefitId)}</span>
                </div>
              ))}
              {formData.customBenefits && formData.customBenefits.map((benefit, index) => (
                <div key={`custom-${index}`} className="flex items-center space-x-2 text-text-secondary">
                  <Icon name="Check" size={16} className="text-success" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Method */}
        <div className="mb-6 p-4 bg-background border border-border-light rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-3">How to Apply</h3>
          <div className="text-text-secondary">
            {formData.applicationMethod === 'platform' && (
              <p>Apply directly through our platform by clicking the "Apply Now" button above.</p>
            )}
            {formData.applicationMethod === 'email' && formData.applicationEmail && (
              <p>Send your application to: <strong>{formData.applicationEmail}</strong></p>
            )}
            {formData.applicationMethod === 'external' && formData.externalUrl && (
              <p>Apply through our career portal: <strong>{formData.externalUrl}</strong></p>
            )}
          </div>
          
          {formData.applicationDeadline && (
            <div className="mt-2 flex items-center space-x-2 text-warning-600">
              <Icon name="Clock" size={16} />
              <span>Application deadline: {new Date(formData.applicationDeadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Company Info Placeholder */}
        <div className="p-4 bg-background border border-border-light rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Building" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Your Company Name</h4>
              <p className="text-sm text-text-secondary">Technology • 100-500 employees</p>
              <p className="text-sm text-text-secondary">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;