import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Weak', color: 'bg-error', textColor: 'text-error' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-warning', textColor: 'text-warning' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-accent', textColor: 'text-accent' };
    return { score, label: 'Strong', color: 'bg-success', textColor: 'text-success' };
  };
  
  const strength = getPasswordStrength(password);
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">Password strength:</span>
        <span className={`text-sm font-medium ${strength.textColor}`}>
          {strength.label}
        </span>
      </div>
      
      <div className="flex space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full ${
              level <= strength.score ? strength.color : 'bg-border-light'
            }`}
          />
        ))}
      </div>
      
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-xs">
            <Icon 
              name={req.met ? "Check" : "X"} 
              size={12} 
              className={`mr-2 ${req.met ? 'text-success' : 'text-text-tertiary'}`} 
            />
            <span className={req.met ? 'text-success' : 'text-text-tertiary'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;