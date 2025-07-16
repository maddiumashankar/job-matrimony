import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RoleSelector = ({ selectedRole, onRoleChange }) => {
  const roles = [
    {
      id: 'candidate',
      label: 'Job Seeker',
      description: 'Find your dream job',
      icon: 'User',
      color: 'primary'
    },
    {
      id: 'recruiter',
      label: 'Recruiter',
      description: 'Hire top talent',
      icon: 'Users',
      color: 'secondary'
    },
    {
      id: 'admin',
      label: 'Administrator',
      description: 'Manage platform',
      icon: 'Shield',
      color: 'accent'
    }
  ];

  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-text-primary mb-3">
        Select your role to continue
      </p>
      <div className="grid grid-cols-1 gap-2">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            className={`
              w-full p-3 rounded-lg border-2 transition-all duration-200
              flex items-center space-x-3 text-left
              ${selectedRole === role.id
                ? `border-${role.color} bg-${role.color}-50`
                : 'border-border hover:border-border-dark hover:bg-surface-hover'
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${selectedRole === role.id
                ? `bg-${role.color} text-${role.color}-foreground`
                : 'bg-surface-active text-text-tertiary'
              }
            `}>
              <Icon name={role.icon} size={18} />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                selectedRole === role.id ? `text-${role.color}` : 'text-text-primary'
              }`}>
                {role.label}
              </p>
              <p className="text-sm text-text-secondary">
                {role.description}
              </p>
            </div>
            {selectedRole === role.id && (
              <Icon name="Check" size={16} className={`text-${role.color}`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;