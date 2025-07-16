import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const CandidateForm = ({ formData, onFormChange, onNext, onBack, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Experience level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    onFormChange(field, value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFormChange('resume', file);
    }
  };

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (2-5 years)' },
    { value: 'senior', label: 'Senior Level (5-10 years)' },
    { value: 'lead', label: 'Lead/Principal (10+ years)' }
  ];

  const skillCategories = [
    'Frontend Development', 'Backend Development', 'Full Stack Development',
    'Mobile Development', 'DevOps', 'Data Science', 'Machine Learning',
    'UI/UX Design', 'Product Management', 'Quality Assurance'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-error' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-error mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-error' : ''}
            />
            {errors.email && (
              <p className="text-sm text-error mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone Number *
            </label>
            <Input
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={errors.phone ? 'border-error' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-error mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Password *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password || ''}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'border-error pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-error mt-1">{errors.password}</p>
            )}
            <PasswordStrengthIndicator password={formData.password || ''} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword || ''}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-error pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-error mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Professional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Experience Level *
            </label>
            <select
              value={formData.experience || ''}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.experience ? 'border-error' : 'border-border'
              }`}
            >
              <option value="">Select experience level</option>
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.experience && (
              <p className="text-sm text-error mt-1">{errors.experience}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Primary Skill Category
            </label>
            <select
              value={formData.skillCategory || ''}
              onChange={(e) => handleInputChange('skillCategory', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select primary skill</option>
              {skillCategories.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Location
            </label>
            <Input
              type="text"
              placeholder="City, State/Country"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              LinkedIn Profile
            </label>
            <Input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedinUrl || ''}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              GitHub Profile
            </label>
            <Input
              type="url"
              placeholder="https://github.com/yourusername"
              value={formData.githubUrl || ''}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Upload Resume
            </label>
            <div className="border-2 border-dashed border-border-light rounded-lg p-4 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Icon name="Upload" size={24} className="mx-auto text-text-tertiary mb-2" />
                <p className="text-sm text-text-secondary">
                  {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Social Integration */}
      <div className="border-t border-border-light pt-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Setup (Optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            iconName="Linkedin"
            iconPosition="left"
            className="justify-center"
          >
            Import from LinkedIn
          </Button>
          <Button
            type="button"
            variant="outline"
            iconName="Github"
            iconPosition="left"
            className="justify-center"
          >
            Import from GitHub
          </Button>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default CandidateForm;