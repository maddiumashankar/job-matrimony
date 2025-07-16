import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VerificationStep = ({ formData, onComplete, onBack, isLoading }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreedToTerms && agreedToPrivacy) {
      onComplete({
        agreedToTerms,
        agreedToPrivacy,
        agreedToMarketing
      });
    }
  };

  const isFormValid = agreedToTerms && agreedToPrivacy;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Shield" size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Almost Done!
        </h2>
        <p className="text-text-secondary">
          Please review and accept our terms to complete your registration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration Summary */}
        <div className="bg-surface-hover rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Registration Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Name:</span>
              <span className="ml-2 text-text-primary font-medium">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-text-secondary">Email:</span>
              <span className="ml-2 text-text-primary font-medium">{formData.email}</span>
            </div>
            <div>
              <span className="text-text-secondary">Role:</span>
              <span className="ml-2 text-text-primary font-medium capitalize">{formData.role}</span>
            </div>
            {formData.role === 'recruiter' && (
              <div>
                <span className="text-text-secondary">Company:</span>
                <span className="ml-2 text-text-primary font-medium">{formData.companyName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-text-secondary">
              I agree to the{' '}
              <button
                type="button"
                className="text-primary hover:text-primary-600 underline"
                onClick={() => {/* Open terms modal */}}
              >
                Terms of Service
              </button>
              {' '}and acknowledge that I have read and understood the terms and conditions. *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="privacy" className="text-sm text-text-secondary">
              I agree to the{' '}
              <button
                type="button"
                className="text-primary hover:text-primary-600 underline"
                onClick={() => {/* Open privacy modal */}}
              >
                Privacy Policy
              </button>
              {' '}and consent to the collection and use of my personal information as described. *
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing"
              checked={agreedToMarketing}
              onChange={(e) => setAgreedToMarketing(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="marketing" className="text-sm text-text-secondary">
              I would like to receive marketing communications, job alerts, and updates about new features via email. (Optional)
            </label>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Icon name="Mail" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">Email Verification</p>
                <p className="text-xs text-text-secondary">
                  We'll send a verification link to {formData.email}
                </p>
              </div>
            </div>
            
            {formData.role === 'recruiter' && (
              <div className="flex items-start space-x-3">
                <Icon name="Building" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Company Verification</p>
                  <p className="text-xs text-text-secondary">
                    Our team will verify your company details within 24-48 hours
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <Icon name="UserCheck" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">Account Activation</p>
                <p className="text-xs text-text-secondary">
                  Once verified, you can start using all platform features
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!isFormValid}
            iconName="Check"
            iconPosition="right"
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerificationStep;