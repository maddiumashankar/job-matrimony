import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ApplicationSettings = ({ formData, onChange, errors = {} }) => {
  const [screeningQuestion, setScreeningQuestion] = useState('');
  const [assessmentName, setAssessmentName] = useState('');

  const applicationMethods = [
    { value: 'platform', label: 'Through Job Matrimony Platform', icon: 'Globe' },
    { value: 'email', label: 'Email Application', icon: 'Mail' },
    { value: 'external', label: 'External Link', icon: 'ExternalLink' }
  ];

  const assessmentTypes = [
    { value: 'coding', label: 'Coding Assessment', icon: 'Code' },
    { value: 'mcq', label: 'Multiple Choice Quiz', icon: 'CheckSquare' },
    { value: 'portfolio', label: 'Portfolio Review', icon: 'Folder' },
    { value: 'video', label: 'Video Interview', icon: 'Video' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleScreeningQuestionAdd = () => {
    if (screeningQuestion.trim()) {
      const currentQuestions = formData.screeningQuestions || [];
      handleInputChange('screeningQuestions', [...currentQuestions, screeningQuestion.trim()]);
      setScreeningQuestion('');
    }
  };

  const handleScreeningQuestionRemove = (index) => {
    const currentQuestions = formData.screeningQuestions || [];
    handleInputChange('screeningQuestions', currentQuestions.filter((_, i) => i !== index));
  };

  const handleAssessmentToggle = (assessmentType) => {
    const currentAssessments = formData.requiredAssessments || [];
    const isSelected = currentAssessments.includes(assessmentType);
    
    if (isSelected) {
      handleInputChange('requiredAssessments', currentAssessments.filter(type => type !== assessmentType));
    } else {
      handleInputChange('requiredAssessments', [...currentAssessments, assessmentType]);
    }
  };

  const handleTeamMemberAdd = () => {
    const currentMembers = formData.teamMembers || [];
    handleInputChange('teamMembers', [...currentMembers, { email: '', role: 'viewer' }]);
  };

  const handleTeamMemberChange = (index, field, value) => {
    const currentMembers = formData.teamMembers || [];
    const updatedMembers = [...currentMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    handleInputChange('teamMembers', updatedMembers);
  };

  const handleTeamMemberRemove = (index) => {
    const currentMembers = formData.teamMembers || [];
    handleInputChange('teamMembers', currentMembers.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Settings" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Application Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Application Method */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            How should candidates apply? *
          </label>
          <div className="space-y-3">
            {applicationMethods.map(method => (
              <div
                key={method.value}
                onClick={() => handleInputChange('applicationMethod', method.value)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.applicationMethod === method.value
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={method.icon} 
                    size={20} 
                    className={formData.applicationMethod === method.value ? 'text-primary' : 'text-text-tertiary'}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{method.label}</h4>
                    <p className="text-sm text-text-secondary mt-1">
                      {method.value === 'platform' && 'Candidates apply directly through our platform with built-in tracking'}
                      {method.value === 'email' && 'Candidates send applications to your specified email address'}
                      {method.value === 'external' && 'Redirect candidates to your company\'s career page or ATS'}
                    </p>
                  </div>
                  {formData.applicationMethod === method.value && (
                    <Icon name="Check" size={20} className="text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {errors.applicationMethod && (
            <p className="text-sm text-error mt-1">{errors.applicationMethod}</p>
          )}
        </div>

        {/* Email or External URL based on selection */}
        {formData.applicationMethod === 'email' && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Application Email *
            </label>
            <Input
              type="email"
              placeholder="careers@company.com"
              value={formData.applicationEmail || ''}
              onChange={(e) => handleInputChange('applicationEmail', e.target.value)}
              className={errors.applicationEmail ? 'border-error' : ''}
            />
            {errors.applicationEmail && (
              <p className="text-sm text-error mt-1">{errors.applicationEmail}</p>
            )}
          </div>
        )}

        {formData.applicationMethod === 'external' && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              External Application URL *
            </label>
            <Input
              type="url"
              placeholder="https://company.com/careers/job-id"
              value={formData.externalUrl || ''}
              onChange={(e) => handleInputChange('externalUrl', e.target.value)}
              className={errors.externalUrl ? 'border-error' : ''}
            />
            {errors.externalUrl && (
              <p className="text-sm text-error mt-1">{errors.externalUrl}</p>
            )}
          </div>
        )}

        {/* Application Deadline */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Application Deadline
          </label>
          <Input
            type="date"
            value={formData.applicationDeadline || ''}
            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-text-tertiary mt-1">
            Leave empty for no deadline
          </p>
        </div>

        {/* Screening Questions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-text-primary">
              Screening Questions
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleScreeningQuestionAdd}
              iconName="Plus"
              disabled={!screeningQuestion.trim()}
            >
              Add Question
            </Button>
          </div>
          
          <Input
            type="text"
            placeholder="e.g., Are you authorized to work in the US?"
            value={screeningQuestion}
            onChange={(e) => setScreeningQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScreeningQuestionAdd()}
          />
          
          {formData.screeningQuestions && formData.screeningQuestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.screeningQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border-light">
                  <span className="text-sm text-text-primary">{question}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleScreeningQuestionRemove(index)}
                    iconName="Trash2"
                    className="text-error hover:text-error-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Required Assessments */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Required Assessments
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assessmentTypes.map(assessment => (
              <div
                key={assessment.value}
                onClick={() => handleAssessmentToggle(assessment.value)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  (formData.requiredAssessments || []).includes(assessment.value)
                    ? 'border-primary bg-primary-50 text-primary-700' :'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={assessment.icon} 
                    size={16} 
                    className={(formData.requiredAssessments || []).includes(assessment.value) ? 'text-primary' : 'text-text-tertiary'}
                  />
                  <span className="text-sm font-medium">{assessment.label}</span>
                  {(formData.requiredAssessments || []).includes(assessment.value) && (
                    <Icon name="Check" size={14} className="text-primary ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Access */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-text-primary">
              Team Access
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTeamMemberAdd}
              iconName="UserPlus"
            >
              Add Team Member
            </Button>
          </div>
          
          {formData.teamMembers && formData.teamMembers.length > 0 && (
            <div className="space-y-3">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border-light">
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={member.email}
                    onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                    className="flex-1"
                  />
                  <select
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTeamMemberRemove(index)}
                    iconName="Trash2"
                    className="text-error hover:text-error-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-text-primary">Additional Settings</h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allowCoverLetter || false}
                onChange={(e) => handleInputChange('allowCoverLetter', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-primary">Allow cover letter submission</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.requirePortfolio || false}
                onChange={(e) => handleInputChange('requirePortfolio', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-primary">Require portfolio/work samples</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.enableAutoReply || false}
                onChange={(e) => handleInputChange('enableAutoReply', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-primary">Send automatic confirmation emails</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isUrgent || false}
                onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-primary">Mark as urgent hiring</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettings;