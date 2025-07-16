import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIEnhancementSuggestions = ({ candidate, onApplySuggestion, onDismissSuggestion }) => {
  const [expandedSuggestions, setExpandedSuggestions] = useState({});

  const suggestions = [
    {
      id: 1,
      type: 'profile_summary',
      priority: 'high',
      title: 'Enhance Your Professional Summary',
      description: 'Your summary could be more compelling with specific achievements and metrics.',
      impact: 'Could increase profile views by 40%',
      suggestion: `Consider adding quantifiable achievements like "Led a team of 5 developers to deliver 3 major projects, resulting in 25% improvement in system performance" instead of generic statements.`,
      actionType: 'rewrite',
      category: 'Content'
    },
    {
      id: 2,
      type: 'skills_gap',
      priority: 'medium',
      title: 'Add Trending Skills',
      description: 'Based on current job market trends, these skills could boost your profile.',
      impact: 'Could match 60% more job opportunities',
      suggestion: 'Consider learning and adding these in-demand skills: TypeScript, Docker, Kubernetes, GraphQL. These are frequently requested in your field.',
      actionType: 'add_skills',
      category: 'Skills',
      recommendedSkills: ['TypeScript', 'Docker', 'Kubernetes', 'GraphQL']
    },
    {
      id: 3,
      type: 'experience_detail',
      priority: 'medium',
      title: 'Add More Project Details',
      description: 'Your recent projects lack specific technical details and outcomes.',
      impact: 'Could improve recruiter engagement by 30%',
      suggestion: 'Add specific technologies used, team size, project duration, and measurable outcomes for your recent projects.',
      actionType: 'enhance_projects',
      category: 'Experience'
    },
    {
      id: 4,
      type: 'certification',
      priority: 'low',
      title: 'Consider Professional Certifications',
      description: 'Industry certifications could strengthen your profile credibility.',
      impact: 'Could increase interview callbacks by 20%',
      suggestion: 'Consider pursuing certifications like AWS Solutions Architect, Google Cloud Professional, or Microsoft Azure certifications based on your tech stack.',
      actionType: 'add_certifications',
      category: 'Credentials'
    },
    {
      id: 5,
      type: 'portfolio_enhancement',
      priority: 'high',
      title: 'Showcase More Projects',
      description: 'Your portfolio has only 2 projects. Adding more diverse projects could help.',
      impact: 'Could demonstrate broader skill range',
      suggestion: 'Add 2-3 more projects showcasing different technologies and problem-solving approaches. Include personal projects, open-source contributions, or hackathon entries.',
      actionType: 'add_projects',
      category: 'Portfolio'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error-50 border-error-200';
      case 'medium': return 'bg-warning-50 border-warning-200';
      case 'low': return 'bg-success-50 border-success-200';
      default: return 'bg-surface-hover border-border';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Content': return 'FileText';
      case 'Skills': return 'Code';
      case 'Experience': return 'Briefcase';
      case 'Credentials': return 'Award';
      case 'Portfolio': return 'FolderOpen';
      default: return 'Lightbulb';
    }
  };

  const toggleExpansion = (suggestionId) => {
    setExpandedSuggestions(prev => ({
      ...prev,
      [suggestionId]: !prev[suggestionId]
    }));
  };

  const handleApplySuggestion = (suggestion) => {
    onApplySuggestion(suggestion);
  };

  const handleDismissSuggestion = (suggestionId) => {
    onDismissSuggestion(suggestionId);
  };

  return (
    <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Icon name="Sparkles" size={20} color="white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">AI Enhancement Suggestions</h3>
          <p className="text-sm text-text-secondary">Personalized recommendations to improve your profile</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-error-50 rounded-lg p-4 border border-error-200">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">High Priority</span>
          </div>
          <div className="text-2xl font-bold text-error mt-1">
            {suggestions.filter(s => s.priority === 'high').length}
          </div>
        </div>
        <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Medium Priority</span>
          </div>
          <div className="text-2xl font-bold text-warning mt-1">
            {suggestions.filter(s => s.priority === 'medium').length}
          </div>
        </div>
        <div className="bg-success-50 rounded-lg p-4 border border-success-200">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Low Priority</span>
          </div>
          <div className="text-2xl font-bold text-success mt-1">
            {suggestions.filter(s => s.priority === 'low').length}
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`rounded-lg border-2 p-4 transition-all ${getPriorityBg(suggestion.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  <Icon name={getCategoryIcon(suggestion.category)} size={20} className={getPriorityColor(suggestion.priority)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-text-primary">{suggestion.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      suggestion.priority === 'high' ? 'bg-error text-error-foreground' :
                      suggestion.priority === 'medium' ? 'bg-warning text-warning-foreground' :
                      'bg-success text-success-foreground'
                    }`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{suggestion.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-text-tertiary mb-3">
                    <span className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={12} />
                      <span>{suggestion.impact}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Tag" size={12} />
                      <span>{suggestion.category}</span>
                    </span>
                  </div>

                  {/* Expanded Details */}
                  {expandedSuggestions[suggestion.id] && (
                    <div className="mt-4 p-3 bg-surface rounded-lg border border-border-light">
                      <h5 className="font-medium text-text-primary mb-2">Detailed Suggestion:</h5>
                      <p className="text-sm text-text-secondary mb-3">{suggestion.suggestion}</p>
                      
                      {/* Recommended Skills */}
                      {suggestion.recommendedSkills && (
                        <div className="mb-3">
                          <h6 className="text-sm font-medium text-text-primary mb-2">Recommended Skills:</h6>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.recommendedSkills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary-100 text-primary text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  onClick={() => toggleExpansion(suggestion.id)}
                  className="p-2"
                  iconName={expandedSuggestions[suggestion.id] ? "ChevronUp" : "ChevronDown"}
                />
                <Button
                  variant="primary"
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="px-3 py-1 text-sm"
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDismissSuggestion(suggestion.id)}
                  className="p-2 text-text-tertiary hover:text-error"
                  iconName="X"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Enhancement Footer */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Zap" size={16} className="text-primary" />
            <span>Suggestions updated based on latest job market trends</span>
          </div>
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Refresh Suggestions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIEnhancementSuggestions;