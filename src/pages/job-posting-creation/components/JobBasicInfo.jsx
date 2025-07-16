import React from 'react';
import Input from '../../../components/ui/Input';

import Icon from '../../../components/AppIcon';

const JobBasicInfo = ({ formData, onChange, errors = {} }) => {
  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Briefcase" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Basic Information</h3>
      </div>

      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Job Title *
          </label>
          <Input
            type="text"
            placeholder="e.g., Senior Software Engineer"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={errors.title ? 'border-error' : ''}
          />
          {errors.title && (
            <p className="text-sm text-error mt-1">{errors.title}</p>
          )}
        </div>

        {/* Department and Team */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Department *
            </label>
            <Input
              type="text"
              placeholder="e.g., Engineering"
              value={formData.department || ''}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className={errors.department ? 'border-error' : ''}
            />
            {errors.department && (
              <p className="text-sm text-error mt-1">{errors.department}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Team
            </label>
            <Input
              type="text"
              placeholder="e.g., Frontend Team"
              value={formData.team || ''}
              onChange={(e) => handleInputChange('team', e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location *
          </label>
          <Input
            type="text"
            placeholder="e.g., San Francisco, CA or Remote"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={errors.location ? 'border-error' : ''}
          />
          {errors.location && (
            <p className="text-sm text-error mt-1">{errors.location}</p>
          )}
        </div>

        {/* Employment Type and Work Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Employment Type *
            </label>
            <select
              value={formData.employmentType || ''}
              onChange={(e) => handleInputChange('employmentType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.employmentType ? 'border-error' : 'border-border'
              }`}
            >
              <option value="">Select employment type</option>
              {employmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.employmentType && (
              <p className="text-sm text-error mt-1">{errors.employmentType}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Work Mode *
            </label>
            <select
              value={formData.workMode || ''}
              onChange={(e) => handleInputChange('workMode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.workMode ? 'border-error' : 'border-border'
              }`}
            >
              <option value="">Select work mode</option>
              {workModes.map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
            {errors.workMode && (
              <p className="text-sm text-error mt-1">{errors.workMode}</p>
            )}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Experience Level *
          </label>
          <select
            value={formData.experienceLevel || ''}
            onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.experienceLevel ? 'border-error' : 'border-border'
            }`}
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {errors.experienceLevel && (
            <p className="text-sm text-error mt-1">{errors.experienceLevel}</p>
          )}
        </div>

        {/* Job Summary */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Job Summary *
          </label>
          <textarea
            placeholder="Brief overview of the role and what the candidate will be doing..."
            value={formData.summary || ''}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              errors.summary ? 'border-error' : 'border-border'
            }`}
          />
          {errors.summary && (
            <p className="text-sm text-error mt-1">{errors.summary}</p>
          )}
          <p className="text-xs text-text-tertiary mt-1">
            {formData.summary?.length || 0}/500 characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobBasicInfo;