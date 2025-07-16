import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CandidatePipelineWidget = ({ candidates, onViewCandidate, onMoveStage }) => {
  const getStageColor = (stage) => {
    switch (stage.toLowerCase()) {
      case 'applied':
        return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'screening':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'interview':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      case 'offer':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'rejected':
        return 'bg-error-100 text-error-700 border-error-200';
      default:
        return 'bg-primary-100 text-primary-700 border-primary-200';
    }
  };

  const getSkillBadgeColor = (skill) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-orange-100 text-orange-700',
      'bg-pink-100 text-pink-700'
    ];
    return colors[skill.length % colors.length];
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Candidate Pipeline</h3>
        <Button variant="ghost" className="text-sm text-primary">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="border border-border-light rounded-lg p-4 hover:bg-surface-hover transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{candidate.name}</h4>
                  <p className="text-sm text-text-secondary">{candidate.position}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(candidate.stage)}`}>
                {candidate.stage}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <span className="flex items-center">
                <Icon name="MapPin" size={14} className="mr-1" />
                {candidate.location}
              </span>
              <span className="flex items-center">
                <Icon name="Briefcase" size={14} className="mr-1" />
                {candidate.experience}
              </span>
              <span className="flex items-center">
                <Icon name="Clock" size={14} className="mr-1" />
                {formatTimeAgo(candidate.appliedAt)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillBadgeColor(skill)}`}
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-background text-text-secondary">
                  +{candidate.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm">
                  <Icon name="Star" size={14} className="text-warning mr-1" />
                  <span className="font-medium text-text-primary">{candidate.rating}</span>
                  <span className="text-text-secondary ml-1">Match Score</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => onViewCandidate(candidate.id)}
                  className="p-2"
                  iconName="Eye"
                  aria-label="View candidate"
                />
                <Button
                  variant="outline"
                  onClick={() => onMoveStage(candidate.id)}
                  className="px-3 py-1 text-sm"
                >
                  Move Stage
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={32} className="mx-auto text-text-tertiary mb-3" />
          <p className="text-sm text-text-secondary">No candidates in pipeline</p>
          <p className="text-xs text-text-tertiary mt-1">
            New applications will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidatePipelineWidget;