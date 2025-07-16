import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 'ssl',
      icon: 'Shield',
      label: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      id: 'gdpr',
      icon: 'Lock',
      label: 'GDPR Compliant',
      description: 'Data protection certified'
    },
    {
      id: 'iso',
      icon: 'Award',
      label: 'ISO 27001',
      description: 'Security certified'
    },
    {
      id: 'privacy',
      icon: 'Eye',
      label: 'Privacy First',
      description: 'Your data is protected'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border-light">
      <div className="text-center mb-4">
        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
          Trusted by 10,000+ Companies Worldwide
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mb-2">
              <Icon name={badge.icon} size={16} className="text-success-600" />
            </div>
            <p className="text-xs font-medium text-text-primary">{badge.label}</p>
            <p className="text-xs text-text-tertiary mt-1">{badge.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-text-tertiary">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-primary hover:text-primary-600 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary hover:text-primary-600 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;