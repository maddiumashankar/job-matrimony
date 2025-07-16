import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const JobRecommendationCard = ({ job, onApply, onSave, onViewDetails }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed';
    if (!max) return `$${min.toLocaleString()}+`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDeadline = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return deadlineDate.toLocaleDateString();
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'text-success bg-success-50';
    if (percentage >= 75) return 'text-primary bg-primary-50';
    if (percentage >= 60) return 'text-warning bg-warning-50';
    return 'text-text-secondary bg-surface-active';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-elevation-2 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-active">
            <Image
              src={job.company.logo}
              alt={`${job.company.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary hover:text-primary cursor-pointer" 
                onClick={() => onViewDetails(job.id)}>
              {job.title}
            </h3>
            <p className="text-sm text-text-secondary">{job.company.name}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchPercentage)}`}>
          {job.matchPercentage}% match
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{job.experience}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm font-medium text-text-primary">
            <Icon name="DollarSign" size={14} />
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
          <div className="text-sm text-text-secondary">
            Deadline: {formatDeadline(job.deadline)}
          </div>
        </div>
      </div>

      {/* Key Requirements */}
      <div className="mb-4">
        <p className="text-sm font-medium text-text-primary mb-2">Key Requirements:</p>
        <div className="flex flex-wrap gap-2">
          {job.keyRequirements.slice(0, 4).map((requirement, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-md"
            >
              {requirement}
            </span>
          ))}
          {job.keyRequirements.length > 4 && (
            <span className="px-2 py-1 bg-surface-active text-text-secondary text-xs rounded-md">
              +{job.keyRequirements.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="primary"
          onClick={() => onApply(job.id)}
          className="flex-1"
          iconName="Send"
          iconPosition="left"
        >
          Apply Now
        </Button>
        <Button
          variant="outline"
          onClick={() => onSave(job.id)}
          iconName={job.isSaved ? "Heart" : "Heart"}
          className={job.isSaved ? "text-error border-error" : ""}
        >
          {job.isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => onViewDetails(job.id)}
          iconName="ExternalLink"
        >
        </Button>
      </div>

      {/* Additional Info */}
      {job.isUrgent && (
        <div className="mt-3 flex items-center space-x-1 text-warning text-sm">
          <Icon name="Zap" size={14} />
          <span>Urgent hiring</span>
        </div>
      )}
    </div>
  );
};

export default JobRecommendationCard;