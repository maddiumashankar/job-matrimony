import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <Icon name="Briefcase" size={24} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              Job Matrimony
            </h1>
            <p className="text-sm text-text-secondary">
              AI-Powered Hiring Platform
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold text-text-primary mb-2">
          Welcome Back
        </h2>
        <p className="text-text-secondary">
          Sign in to your account to continue your hiring journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">10K+</p>
          <p className="text-xs text-text-tertiary">Active Jobs</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-secondary">50K+</p>
          <p className="text-xs text-text-tertiary">Candidates</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-accent">1K+</p>
          <p className="text-xs text-text-tertiary">Companies</p>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;