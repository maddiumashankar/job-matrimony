import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ candidate, onPhotoUpload, onEditProfile }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        onPhotoUpload(file);
        setIsUploading(false);
      }, 1500);
    }
  };

  const getProfileCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getSkillMatchColor = (score) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-surface rounded-lg shadow-elevation-2 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Profile Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-surface-hover border-4 border-border-light">
              <Image
                src={candidate.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
                alt={`${candidate.name}'s profile photo`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Photo Upload Button */}
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary-600 transition-colors shadow-elevation-2">
              <Icon name={isUploading ? "Loader2" : "Camera"} size={16} className={isUploading ? "animate-spin" : ""} />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Basic Information */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-heading font-bold text-text-primary mb-1">
              {candidate.name}
            </h1>
            <p className="text-lg text-text-secondary mb-2">
              {candidate.currentRole}
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-text-tertiary">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{candidate.experience} years experience</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Mail" size={14} />
                <span>{candidate.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Metrics and Actions */}
        <div className="mt-6 lg:mt-0 flex flex-col items-center lg:items-end space-y-4">
          {/* Profile Metrics */}
          <div className="flex space-x-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getProfileCompletionColor(candidate.profileCompletion)}`}>
                {candidate.profileCompletion}%
              </div>
              <div className="text-xs text-text-tertiary">Profile Complete</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getSkillMatchColor(candidate.skillMatchScore)}`}>
                {candidate.skillMatchScore}
              </div>
              <div className="text-xs text-text-tertiary">Skill Match</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {candidate.applicationCount}
              </div>
              <div className="text-xs text-text-tertiary">Applications</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => window.open(candidate.resumeUrl, '_blank')}
            >
              Download Resume
            </Button>
            <Button
              variant="primary"
              iconName="Edit"
              iconPosition="left"
              onClick={onEditProfile}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Completion Progress */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Profile Completion</span>
          <span className={`text-sm font-medium ${getProfileCompletionColor(candidate.profileCompletion)}`}>
            {candidate.profileCompletion}%
          </span>
        </div>
        <div className="w-full bg-surface-hover rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              candidate.profileCompletion >= 80 ? 'bg-success' :
              candidate.profileCompletion >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${candidate.profileCompletion}%` }}
          />
        </div>
        {candidate.profileCompletion < 100 && (
          <p className="text-xs text-text-tertiary mt-2">
            Complete your profile to increase visibility to recruiters
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;