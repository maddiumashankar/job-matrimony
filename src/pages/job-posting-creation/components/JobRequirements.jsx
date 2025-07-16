import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const JobRequirements = ({ formData, onChange, errors = {} }) => {
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  const skillSuggestions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'AWS', 'Docker',
    'Kubernetes', 'MongoDB', 'PostgreSQL', 'Git', 'Agile', 'Scrum', 'REST APIs',
    'GraphQL', 'HTML', 'CSS', 'Vue.js', 'Angular', 'Express.js', 'Redis', 'Jenkins'
  ];

  const educationLevels = [
    { value: 'high-school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
    { value: 'phd', label: 'PhD' },
    { value: 'bootcamp', label: 'Coding Bootcamp' },
    { value: 'certification', label: 'Professional Certification' }
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleSkillAdd = (skill) => {
    const currentSkills = formData.requiredSkills || [];
    if (!currentSkills.includes(skill) && skill.trim()) {
      handleInputChange('requiredSkills', [...currentSkills, skill.trim()]);
      setSkillInput('');
      setShowSkillSuggestions(false);
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    const currentSkills = formData.requiredSkills || [];
    handleInputChange('requiredSkills', currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillInputKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleSkillAdd(skillInput);
    }
  };

  const filteredSuggestions = skillSuggestions.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
    !(formData.requiredSkills || []).includes(skill)
  );

  const handleQualificationAdd = () => {
    const currentQualifications = formData.qualifications || [];
    handleInputChange('qualifications', [...currentQualifications, '']);
  };

  const handleQualificationChange = (index, value) => {
    const currentQualifications = formData.qualifications || [];
    const updatedQualifications = [...currentQualifications];
    updatedQualifications[index] = value;
    handleInputChange('qualifications', updatedQualifications);
  };

  const handleQualificationRemove = (index) => {
    const currentQualifications = formData.qualifications || [];
    handleInputChange('qualifications', currentQualifications.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="CheckSquare" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Requirements & Qualifications</h3>
      </div>

      <div className="space-y-6">
        {/* Required Skills */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Required Skills *
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Type a skill and press Enter"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                setShowSkillSuggestions(e.target.value.length > 0);
              }}
              onKeyPress={handleSkillInputKeyPress}
              onFocus={() => setShowSkillSuggestions(skillInput.length > 0)}
              className={errors.requiredSkills ? 'border-error' : ''}
            />
            
            {/* Skill Suggestions */}
            {showSkillSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-lg shadow-elevation-2 max-h-48 overflow-y-auto">
                {filteredSuggestions.slice(0, 8).map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillAdd(skill)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-surface-hover transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Selected Skills */}
          {formData.requiredSkills && formData.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                >
                  {skill}
                  <button
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-2 hover:text-primary-900"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {errors.requiredSkills && (
            <p className="text-sm text-error mt-1">{errors.requiredSkills}</p>
          )}
        </div>

        {/* Experience Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Minimum Experience (years) *
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="20"
              value={formData.minExperience || ''}
              onChange={(e) => handleInputChange('minExperience', e.target.value)}
              className={errors.minExperience ? 'border-error' : ''}
            />
            {errors.minExperience && (
              <p className="text-sm text-error mt-1">{errors.minExperience}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Preferred Experience (years)
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="20"
              value={formData.preferredExperience || ''}
              onChange={(e) => handleInputChange('preferredExperience', e.target.value)}
            />
          </div>
        </div>

        {/* Education Requirements */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Education Level *
          </label>
          <select
            value={formData.educationLevel || ''}
            onChange={(e) => handleInputChange('educationLevel', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.educationLevel ? 'border-error' : 'border-border'
            }`}
          >
            <option value="">Select minimum education level</option>
            {educationLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {errors.educationLevel && (
            <p className="text-sm text-error mt-1">{errors.educationLevel}</p>
          )}
        </div>

        {/* Specific Qualifications */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-primary">
              Specific Qualifications
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQualificationAdd}
              iconName="Plus"
            >
              Add Qualification
            </Button>
          </div>
          
          {formData.qualifications && formData.qualifications.length > 0 && (
            <div className="space-y-3">
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    value={qualification}
                    onChange={(e) => handleQualificationChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQualificationRemove(index)}
                    iconName="Trash2"
                    className="text-error hover:text-error-600"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nice to Have Skills */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Nice to Have Skills
          </label>
          <textarea
            placeholder="Additional skills that would be beneficial but not required..."
            value={formData.niceToHaveSkills || ''}
            onChange={(e) => handleInputChange('niceToHaveSkills', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Language Requirements */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Language Requirements
          </label>
          <Input
            type="text"
            placeholder="e.g., English (fluent), Spanish (conversational)"
            value={formData.languageRequirements || ''}
            onChange={(e) => handleInputChange('languageRequirements', e.target.value)}
          />
        </div>

        {/* Other Requirements */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Other Requirements
          </label>
          <textarea
            placeholder="Any other specific requirements (travel, security clearance, etc.)"
            value={formData.otherRequirements || ''}
            onChange={(e) => handleInputChange('otherRequirements', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default JobRequirements;