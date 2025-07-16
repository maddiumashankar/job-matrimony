import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const JobDescription = ({ formData, onChange, errors = {} }) => {
  const [activeTab, setActiveTab] = useState('editor');
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      category: 'Engineering',
      description: `We are seeking a talented Software Engineer to join our dynamic team. In this role, you will be responsible for designing, developing, and maintaining high-quality software solutions that meet our business needs.

Key Responsibilities:
• Design and develop scalable software applications
• Collaborate with cross-functional teams to define and implement new features
• Write clean, maintainable, and efficient code
• Participate in code reviews and maintain coding standards
• Troubleshoot and debug applications
• Stay updated with emerging technologies and industry trends

What We Offer:
• Competitive salary and benefits package
• Flexible working arrangements
• Professional development opportunities
• Collaborative and innovative work environment`
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      category: 'Product',
      description: `We are looking for an experienced Product Manager to drive the development and success of our products. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.

Key Responsibilities:
• Define product strategy and roadmap
• Gather and prioritize product requirements
• Work closely with engineering teams to deliver products
• Analyze market trends and competitive landscape
• Collaborate with stakeholders across the organization
• Monitor product performance and user feedback

What We Offer:
• Opportunity to shape product direction
• Work with cutting-edge technologies
• Competitive compensation package
• Growth and learning opportunities`
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      category: 'Data & Analytics',
      description: `Join our data team as a Data Scientist and help us unlock insights from complex datasets. You will work on challenging problems and develop machine learning models that drive business decisions.

Key Responsibilities:
• Analyze large datasets to extract meaningful insights
• Develop and implement machine learning models
• Create data visualizations and reports
• Collaborate with business stakeholders
• Design and conduct experiments
• Present findings to technical and non-technical audiences

What We Offer:
• Access to cutting-edge tools and technologies
• Opportunity to work on diverse projects
• Competitive salary and stock options
• Continuous learning and development support`
    }
  ];

  const handleDescriptionChange = (value) => {
    onChange({ ...formData, description: value });
  };

  const handleTemplateSelect = (template) => {
    handleDescriptionChange(template.description);
    setShowTemplates(false);
  };

  const getQualityScore = () => {
    const description = formData.description || '';
    let score = 0;
    
    // Length check
    if (description.length > 200) score += 20;
    if (description.length > 500) score += 10;
    
    // Key sections check
    if (description.includes('responsibilities') || description.includes('Responsibilities')) score += 20;
    if (description.includes('requirements') || description.includes('Requirements')) score += 15;
    if (description.includes('benefits') || description.includes('Benefits') || description.includes('offer')) score += 15;
    
    // Formatting check
    if (description.includes('•') || description.includes('-') || description.includes('*')) score += 10;
    
    // Keywords check
    const keywords = ['experience', 'skills', 'team', 'growth', 'opportunity'];
    const foundKeywords = keywords.filter(keyword => 
      description.toLowerCase().includes(keyword)
    );
    score += foundKeywords.length * 2;
    
    return Math.min(score, 100);
  };

  const qualityScore = getQualityScore();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Job Description</h3>
        </div>
        <div className="flex items-center space-x-4">
          {/* Quality Score */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Quality Score:</span>
            <div className="flex items-center space-x-1">
              <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreBgColor(qualityScore)} transition-all duration-300`}
                  style={{ width: `${qualityScore}%` }}
                />
              </div>
              <span className={`text-sm font-medium ${getScoreColor(qualityScore)}`}>
                {qualityScore}%
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
            iconName="Template"
            size="sm"
          >
            Templates
          </Button>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="mb-6 p-4 bg-background rounded-lg border border-border-light">
          <h4 className="text-sm font-medium text-text-primary mb-3">Choose a Template</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="p-3 border border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary-50 transition-colors"
              >
                <h5 className="font-medium text-text-primary text-sm">{template.title}</h5>
                <p className="text-xs text-text-secondary mt-1">{template.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor Tabs */}
      <div className="flex space-x-1 mb-4 border-b border-border-light">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'editor' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'preview' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'editor' ? (
        <div>
          <textarea
            placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
            value={formData.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={12}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm ${
              errors.description ? 'border-error' : 'border-border'
            }`}
          />
          {errors.description && (
            <p className="text-sm text-error mt-1">{errors.description}</p>
          )}
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-text-tertiary">
              {formData.description?.length || 0} characters
            </p>
            <div className="flex space-x-2 text-xs text-text-tertiary">
              <span>• Use bullet points for lists</span>
              <span>• Include key responsibilities</span>
              <span>• Mention required skills</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-background min-h-[300px]">
          <div className="prose prose-sm max-w-none">
            {formData.description ? (
              <div className="whitespace-pre-wrap text-text-primary">
                {formData.description}
              </div>
            ) : (
              <div className="text-text-tertiary italic">
                Start writing your job description to see the preview...
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {formData.description && qualityScore < 80 && (
        <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-warning-700">AI Suggestions</h5>
              <ul className="text-xs text-warning-600 mt-1 space-y-1">
                {qualityScore < 40 && (
                  <li>• Add more details about key responsibilities and requirements</li>
                )}
                {!formData.description.includes('•') && !formData.description.includes('-') && (
                  <li>• Use bullet points to improve readability</li>
                )}
                {!formData.description.toLowerCase().includes('benefit') && (
                  <li>• Include information about benefits and company culture</li>
                )}
                {formData.description.length < 300 && (
                  <li>• Expand the description to provide more comprehensive information</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescription;