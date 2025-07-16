import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PreferencesTab = ({ candidate, onUpdatePreferences }) => {
  const [preferences, setPreferences] = useState(candidate.preferences || {
    jobTypes: [],
    workModes: [],
    salaryRange: { min: 0, max: 0, currency: 'USD' },
    locations: [],
    industries: [],
    companySize: [],
    availability: 'immediately',
    noticePeriod: 30,
    willingToRelocate: false,
    remoteWork: true,
    travelWillingness: 'none'
  });

  const [isEditing, setIsEditing] = useState(false);

  const jobTypes = [
    { id: 'full-time', label: 'Full-time', icon: 'Clock' },
    { id: 'part-time', label: 'Part-time', icon: 'Clock' },
    { id: 'contract', label: 'Contract', icon: 'FileText' },
    { id: 'freelance', label: 'Freelance', icon: 'Briefcase' },
    { id: 'internship', label: 'Internship', icon: 'GraduationCap' }
  ];

  const workModes = [
    { id: 'remote', label: 'Remote', icon: 'Home' },
    { id: 'hybrid', label: 'Hybrid', icon: 'Shuffle' },
    { id: 'onsite', label: 'On-site', icon: 'Building' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
    'Manufacturing', 'Consulting', 'Media', 'Government', 'Non-profit'
  ];

  const companySizes = [
    { id: 'startup', label: 'Startup (1-50)', icon: 'Zap' },
    { id: 'small', label: 'Small (51-200)', icon: 'Users' },
    { id: 'medium', label: 'Medium (201-1000)', icon: 'Building' },
    { id: 'large', label: 'Large (1000+)', icon: 'Building2' }
  ];

  const availabilityOptions = [
    { id: 'immediately', label: 'Immediately' },
    { id: '2-weeks', label: 'Within 2 weeks' },
    { id: '1-month', label: 'Within 1 month' },
    { id: '2-months', label: 'Within 2 months' },
    { id: '3-months', label: 'Within 3 months' }
  ];

  const travelOptions = [
    { id: 'none', label: 'No travel' },
    { id: 'minimal', label: 'Minimal (0-25%)' },
    { id: 'moderate', label: 'Moderate (25-50%)' },
    { id: 'frequent', label: 'Frequent (50%+)' }
  ];

  const handleToggleSelection = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleSalaryChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      salaryRange: {
        ...prev.salaryRange,
        [field]: field === 'currency' ? value : parseInt(value) || 0
      }
    }));
  };

  const handleSavePreferences = () => {
    onUpdatePreferences(preferences);
    setIsEditing(false);
  };

  const addLocation = (location) => {
    if (location.trim() && !preferences.locations.includes(location.trim())) {
      setPreferences(prev => ({
        ...prev,
        locations: [...prev.locations, location.trim()]
      }));
    }
  };

  const removeLocation = (location) => {
    setPreferences(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== location)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Job Preferences</h3>
          <Button
            variant={isEditing ? "outline" : "primary"}
            iconName={isEditing ? "X" : "Edit"}
            iconPosition="left"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Preferences'}
          </Button>
        </div>
        <p className="text-text-secondary">
          Set your job preferences to help recruiters find the perfect opportunities for you.
        </p>
      </div>

      {/* Job Types */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-md font-semibold text-text-primary mb-4">Preferred Job Types</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {jobTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => isEditing && handleToggleSelection('jobTypes', type.id)}
              disabled={!isEditing}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                preferences.jobTypes.includes(type.id)
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-border-dark text-text-secondary'
              } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <Icon name={type.icon} size={24} className="mb-2" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Work Modes */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-md font-semibold text-text-primary mb-4">Work Mode Preferences</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {workModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => isEditing && handleToggleSelection('workModes', mode.id)}
              disabled={!isEditing}
              className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                preferences.workModes.includes(mode.id)
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-border-dark text-text-secondary'
              } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <Icon name={mode.icon} size={20} className="mr-3" />
              <span className="font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Salary Expectations */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-md font-semibold text-text-primary mb-4">Salary Expectations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Currency</label>
            <select
              value={preferences.salaryRange.currency}
              onChange={(e) => handleSalaryChange('currency', e.target.value)}
              disabled={!isEditing}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-hover disabled:cursor-not-allowed"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Minimum Salary</label>
            <Input
              type="number"
              value={preferences.salaryRange.min}
              onChange={(e) => handleSalaryChange('min', e.target.value)}
              disabled={!isEditing}
              placeholder="50000"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Maximum Salary</label>
            <Input
              type="number"
              value={preferences.salaryRange.max}
              onChange={(e) => handleSalaryChange('max', e.target.value)}
              disabled={!isEditing}
              placeholder="100000"
              className="w-full"
            />
          </div>
        </div>
        {preferences.salaryRange.min > 0 && preferences.salaryRange.max > 0 && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary">
              Expected salary range: {preferences.salaryRange.currency} {preferences.salaryRange.min.toLocaleString()} - {preferences.salaryRange.max.toLocaleString()} annually
            </p>
          </div>
        )}
      </div>

      {/* Preferred Locations */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-md font-semibold text-text-primary mb-4">Preferred Locations</h4>
        
        {isEditing && (
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Add location (e.g., New York, NY)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addLocation(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full"
            />
            <p className="text-xs text-text-tertiary mt-1">Press Enter to add location</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {preferences.locations.map((location, index) => (
            <span
              key={index}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-100 text-primary rounded-full"
            >
              <Icon name="MapPin" size={14} />
              <span className="text-sm">{location}</span>
              {isEditing && (
                <button
                  onClick={() => removeLocation(location)}
                  className="text-primary hover:text-primary-600"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </span>
          ))}
        </div>

        {preferences.locations.length === 0 && (
          <p className="text-text-tertiary text-sm">No preferred locations specified</p>
        )}
      </div>

      {/* Industries */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-md font-semibold text-text-primary mb-4">Preferred Industries</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => isEditing && handleToggleSelection('industries', industry)}
              disabled={!isEditing}
              className={`p-3 text-sm rounded-lg border transition-all ${
                preferences.industries.includes(industry)
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-border-dark text-text-secondary'
              } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Company Size */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-md font-semibold text-text-primary mb-4">Preferred Company Size</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {companySizes.map((size) => (
            <button
              key={size.id}
              onClick={() => isEditing && handleToggleSelection('companySize', size.id)}
              disabled={!isEditing}
              className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                preferences.companySize.includes(size.id)
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-border-dark text-text-secondary'
              } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <Icon name={size.icon} size={20} className="mr-3" />
              <span className="font-medium text-sm">{size.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability & Other Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability */}
        <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
          <h4 className="text-md font-semibold text-text-primary mb-4">Availability</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">When can you start?</label>
              <select
                value={preferences.availability}
                onChange={(e) => setPreferences(prev => ({ ...prev, availability: e.target.value }))}
                disabled={!isEditing}
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-hover disabled:cursor-not-allowed"
              >
                {availabilityOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Notice Period (days)</label>
              <Input
                type="number"
                value={preferences.noticePeriod}
                onChange={(e) => setPreferences(prev => ({ ...prev, noticePeriod: parseInt(e.target.value) || 0 }))}
                disabled={!isEditing}
                placeholder="30"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Additional Preferences */}
        <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
          <h4 className="text-md font-semibold text-text-primary mb-4">Additional Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">Willing to relocate</label>
                <p className="text-xs text-text-secondary">Open to moving for the right opportunity</p>
              </div>
              <button
                onClick={() => isEditing && setPreferences(prev => ({ ...prev, willingToRelocate: !prev.willingToRelocate }))}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.willingToRelocate ? 'bg-primary' : 'bg-border'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.willingToRelocate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Travel willingness</label>
              <select
                value={preferences.travelWillingness}
                onChange={(e) => setPreferences(prev => ({ ...prev, travelWillingness: e.target.value }))}
                disabled={!isEditing}
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-surface-hover disabled:cursor-not-allowed"
              >
                {travelOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-1" />
          <div>
            <h4 className="font-medium text-text-primary mb-2">AI-Powered Job Recommendations</h4>
            <p className="text-sm text-text-secondary mb-3">
              Based on your preferences, we'll recommend jobs that match your criteria and career goals.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Icon name="Target" size={14} className="text-success" />
                <span className="text-success">85% match accuracy</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} className="text-primary" />
                <span className="text-text-secondary">Updated daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;