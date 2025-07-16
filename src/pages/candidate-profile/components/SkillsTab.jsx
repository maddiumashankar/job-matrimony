import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SkillsTab = ({ candidate, onUpdateSkills }) => {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('technical');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 3, category: 'technical' });

  const skillCategories = [
    { id: 'technical', label: 'Technical Skills', icon: 'Code' },
    { id: 'soft', label: 'Soft Skills', icon: 'Users' },
    { id: 'languages', label: 'Languages', icon: 'Globe' },
    { id: 'tools', label: 'Tools & Platforms', icon: 'Settings' }
  ];

  const getSkillLevelLabel = (level) => {
    const levels = {
      1: 'Beginner',
      2: 'Basic',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    };
    return levels[level] || 'Intermediate';
  };

  const getSkillLevelColor = (level) => {
    if (level >= 4) return 'bg-success';
    if (level >= 3) return 'bg-warning';
    return 'bg-error';
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      onUpdateSkills([...candidate.skills, { ...newSkill, id: Date.now() }]);
      setNewSkill({ name: '', level: 3, category: 'technical' });
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (skillId) => {
    onUpdateSkills(candidate.skills.filter(skill => skill.id !== skillId));
  };

  const filteredSkills = candidate.skills.filter(skill => skill.category === selectedSkillCategory);

  const renderSkillRadarChart = () => {
    const topSkills = candidate.skills
      .filter(skill => skill.category === 'technical')
      .sort((a, b) => b.level - a.level)
      .slice(0, 6);

    return (
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h4 className="text-lg font-semibold text-text-primary mb-4">Skill Proficiency Overview</h4>
        <div className="relative w-64 h-64 mx-auto">
          {/* Placeholder for radar chart - in real implementation, use a chart library */}
          <div className="absolute inset-0 rounded-full border-2 border-border-light flex items-center justify-center">
            <div className="text-center">
              <Icon name="TrendingUp" size={32} className="text-primary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">Skill Radar Chart</p>
              <p className="text-xs text-text-tertiary">Visual representation of top skills</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {topSkills.map((skill, index) => (
            <div key={skill.id} className="flex items-center space-x-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${getSkillLevelColor(skill.level)}`} />
              <span className="text-text-secondary">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Skill Categories */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Skills & Expertise</h3>
          <Button
            variant="primary"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingSkill(true)}
          >
            Add Skill
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedSkillCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedSkillCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface-hover text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={category.icon} size={16} />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Add Skill Form */}
        {isAddingSkill && (
          <div className="bg-surface-hover rounded-lg p-4 mb-6">
            <h4 className="text-md font-semibold text-text-primary mb-4">Add New Skill</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., React, Python, Leadership"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {skillCategories.map((category) => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Proficiency Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>{getSkillLevelLabel(level)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button variant="primary" onClick={handleAddSkill}>
                Add Skill
              </Button>
              <Button variant="outline" onClick={() => setIsAddingSkill(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="bg-surface-hover rounded-lg p-4 relative group">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary">{skill.name}</h5>
                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error-600"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm text-text-secondary">{getSkillLevelLabel(skill.level)}</span>
                <div className="flex-1 bg-border-light rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Skill Verification Status */}
              <div className="flex items-center space-x-2">
                {skill.verified ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={14} />
                    <span className="text-xs">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-text-tertiary">
                    <Icon name="Clock" size={14} />
                    <span className="text-xs">Self-assessed</span>
                  </div>
                )}
                
                {skill.endorsements > 0 && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Icon name="Users" size={14} />
                    <span className="text-xs">{skill.endorsements} endorsements</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Plus" size={32} className="text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary">No skills added in this category yet</p>
            <p className="text-sm text-text-tertiary">Add your first skill to get started</p>
          </div>
        )}
      </div>

      {/* Skill Radar Chart */}
      {selectedSkillCategory === 'technical' && renderSkillRadarChart()}

      {/* Certifications */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Certifications</h3>
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Add Certification
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidate.certifications.map((cert) => (
            <div key={cert.id} className="bg-surface-hover rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-medium text-text-primary">{cert.name}</h5>
                  <p className="text-sm text-text-secondary">{cert.issuer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {cert.verified && (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  )}
                  <Button variant="ghost" iconName="ExternalLink" className="p-1" />
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-text-tertiary">
                <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                {cert.expiryDate && (
                  <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                )}
              </div>

              {cert.credentialId && (
                <p className="text-xs text-text-tertiary mt-2">
                  Credential ID: {cert.credentialId}
                </p>
              )}
            </div>
          ))}
        </div>

        {candidate.certifications.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Award" size={32} className="text-text-tertiary mx-auto mb-2" />
            <p className="text-text-secondary">No certifications added yet</p>
            <p className="text-sm text-text-tertiary">Add your professional certifications to showcase your expertise</p>
          </div>
        )}
      </div>

      {/* Skill Gap Analysis */}
      <div className="bg-surface rounded-lg p-6 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-text-primary mb-4">AI-Powered Skill Recommendations</h3>
        <div className="bg-primary-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary mb-2">Recommended Skills to Learn</h4>
              <p className="text-sm text-text-secondary mb-3">
                Based on your current skills and job market trends, here are skills that could boost your profile:
              </p>
              <div className="flex flex-wrap gap-2">
                {['TypeScript', 'Docker', 'Kubernetes', 'GraphQL', 'Next.js'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;