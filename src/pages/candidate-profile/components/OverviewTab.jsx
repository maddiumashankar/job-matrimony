import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OverviewTab = ({ candidate, onUpdateSummary }) => {
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(candidate?.summary || '');
  const [expandedExperience, setExpandedExperience] = useState({});
  const [expandedEducation, setExpandedEducation] = useState({});

  const handleSaveSummary = () => {
    onUpdateSummary(summaryText);
    setIsEditingSummary(false);
  };

  const toggleExperienceExpansion = (id) => {
    setExpandedExperience(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleEducationExpansion = (id) => {
    setExpandedEducation(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '';
    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      
      if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
      if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } catch (error) {
      return '';
    }
  };

  // Early return if candidate data is not available
  if (!candidate) {
    return (
      <div className="space-y-8">
        <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
          <p className="text-text-secondary">Loading candidate information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Professional Summary */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Professional Summary</h3>
          <Button
            variant="ghost"
            iconName={isEditingSummary ? "X" : "Edit"}
            onClick={() => setIsEditingSummary(!isEditingSummary)}
            className="p-2"
          />
        </div>
        
        {isEditingSummary ? (
          <div className="space-y-4">
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Write a compelling professional summary that highlights your key skills and achievements..."
            />
            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleSaveSummary}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditingSummary(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-text-secondary leading-relaxed">
            {summaryText || "Add a professional summary to showcase your expertise and career objectives to potential employers."}
          </p>
        )}
      </div>

      {/* Experience Timeline */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Work Experience</h3>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Add Experience
          </Button>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border-light" />
          
          <div className="space-y-6">
            {candidate?.experience?.map((exp, index) => (
              <div key={exp?.id || index} className="relative flex items-start space-x-4">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-elevation-1">
                  <Icon name="Briefcase" size={20} color="white" />
                </div>

                {/* Experience Content */}
                <div className="flex-1 bg-surface-hover rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">{exp?.position || 'Position'}</h4>
                      <p className="text-text-secondary font-medium">{exp?.company || 'Company'}</p>
                      <div className="flex items-center space-x-4 text-sm text-text-tertiary mt-1">
                        <span>{formatDate(exp?.startDate)} - {formatDate(exp?.endDate)}</span>
                        <span>•</span>
                        <span>{calculateDuration(exp?.startDate, exp?.endDate)}</span>
                        <span>•</span>
                        <span>{exp?.location || 'Location'}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      iconName="Edit"
                      className="p-2"
                    />
                  </div>

                  {/* Experience Description */}
                  {exp?.description && (
                    <div className="mt-3">
                      <p className="text-text-secondary">
                        {expandedExperience[exp.id] ? exp.description : `${exp.description.substring(0, 150)}...`}
                      </p>
                      {exp.description.length > 150 && (
                        <Button
                          variant="ghost"
                          onClick={() => toggleExperienceExpansion(exp.id)}
                          className="mt-2 p-0 text-primary hover:text-primary-600"
                        >
                          {expandedExperience[exp.id] ? 'Show Less' : 'Show More'}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Key Achievements */}
                  {exp?.achievements && Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-text-primary mb-2">Key Achievements:</h5>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-text-secondary">
                            <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                            <span>{String(achievement)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies Used */}
                  {exp?.technologies && Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-text-primary mb-2">Technologies:</h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary-100 text-primary text-xs rounded-full"
                          >
                            {String(tech)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education Timeline */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Education</h3>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Add Education
          </Button>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border-light" />
          
          <div className="space-y-6">
            {candidate?.education?.map((edu, index) => (
              <div key={edu?.id || index} className="relative flex items-start space-x-4">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-elevation-1">
                  <Icon name="GraduationCap" size={20} color="white" />
                </div>

                {/* Education Content */}
                <div className="flex-1 bg-surface-hover rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">{edu?.degree || 'Degree'}</h4>
                      <p className="text-text-secondary font-medium">{edu?.institution || 'Institution'}</p>
                      <div className="flex items-center space-x-4 text-sm text-text-tertiary mt-1">
                        <span>{formatDate(edu?.startDate)} - {formatDate(edu?.endDate)}</span>
                        {edu?.gpa && (
                          <>
                            <span>•</span>
                            <span>GPA: {edu.gpa}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      iconName="Edit"
                      className="p-2"
                    />
                  </div>

                  {/* Education Description */}
                  {edu?.description && (
                    <div className="mt-3">
                      <p className="text-text-secondary">
                        {expandedEducation[edu.id] ? edu.description : `${edu.description.substring(0, 150)}...`}
                      </p>
                      {edu.description.length > 150 && (
                        <Button
                          variant="ghost"
                          onClick={() => toggleEducationExpansion(edu.id)}
                          className="mt-2 p-0 text-primary hover:text-primary-600"
                        >
                          {expandedEducation[edu.id] ? 'Show Less' : 'Show More'}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Relevant Coursework */}
                  {edu?.coursework && Array.isArray(edu.coursework) && edu.coursework.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-text-primary mb-2">Relevant Coursework:</h5>
                      <div className="flex flex-wrap gap-2">
                        {edu.coursework.map((course, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-secondary-100 text-secondary text-xs rounded-full"
                          >
                            {String(course)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;