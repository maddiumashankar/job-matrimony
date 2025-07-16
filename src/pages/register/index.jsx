import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RoleSelectionCard from './components/RoleSelectionCard';
import ProgressIndicator from './components/ProgressIndicator';
import RecruiterForm from './components/RecruiterForm';
import CandidateForm from './components/CandidateForm';
import VerificationStep from './components/VerificationStep';
import TermsAndPrivacyModal from './components/TermsAndPrivacyModal';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: null });
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Recruiter specific
    companyName: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    companyWebsite: '',
    // Candidate specific
    experience: '',
    skillCategory: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    resume: null
  });

  const steps = [
    { id: 1, label: 'Role' },
    { id: 2, label: 'Details' },
    { id: 3, label: 'Verify' }
  ];

  const roleOptions = [
    {
      role: 'recruiter',
      title: 'I\'m a Recruiter',
      description: 'Looking to hire talented professionals for my organization',
      icon: 'Users',
      benefits: [
        'Post unlimited job openings',
        'Access to candidate database',
        'AI-powered candidate matching',
        'Integrated testing platform',
        'Interview scheduling tools'
      ]
    },
    {
      role: 'candidate',
      title: 'I\'m a Job Seeker',
      description: 'Searching for new career opportunities and challenges',
      icon: 'User',
      benefits: [
        'Personalized job recommendations',
        'Skill assessment tests',
        'Direct communication with recruiters',
        'Application tracking',
        'Interview preparation tools'
      ]
    }
  ];

  const handleRoleSelection = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !formData.role) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleRegistration = async (agreementData) => {
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.email || !formData.password || !formData.role || !formData.fullName) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Register user with backend API
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          role: formData.role,
          fullName: formData.fullName,
          full_name: formData.fullName, // Backend expects this field name
          phone: formData.phone || null,
          // Recruiter specific fields
          companyName: formData.companyName || null,
          company_name: formData.companyName || null, // Backend field
          jobTitle: formData.jobTitle || null,
          job_title: formData.jobTitle || null, // Backend field
          companySize: formData.companySize || null,
          company_size: formData.companySize || null, // Backend field
          industry: formData.industry || null,
          companyWebsite: formData.companyWebsite || null,
          company_website: formData.companyWebsite || null, // Backend field
          // Candidate specific fields
          experience: formData.experience || null,
          skillCategory: formData.skillCategory || null,
          skill_category: formData.skillCategory || null, // Backend field
          location: formData.location || null,
          linkedinUrl: formData.linkedinUrl || null,
          linkedin_url: formData.linkedinUrl || null, // Backend field
          githubUrl: formData.githubUrl || null,
          github_url: formData.githubUrl || null // Backend field
        }
      );

      if (error) {
        throw error;
      }

      console.log('User registered successfully:', data);
      
      // Show success message and redirect
      alert(`Registration successful! Welcome to Job Matrimony, ${formData.fullName}!`);
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in to continue.',
          email: formData.email,
          role: formData.role
        }
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (type) => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                Choose Your Role
              </h2>
              <p className="text-text-secondary">
                Select how you'd like to use Job Matrimony
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roleOptions.map((option) => (
                <RoleSelectionCard
                  key={option.role}
                  role={option.role}
                  title={option.title}
                  description={option.description}
                  benefits={option.benefits}
                  icon={option.icon}
                  isSelected={formData.role === option.role}
                  onSelect={handleRoleSelection}
                />
              ))}
            </div>
            
            <div className="flex justify-center pt-6">
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={!formData.role}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Continue
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return formData.role === 'recruiter' ? (
          <RecruiterForm
            formData={formData}
            onFormChange={handleFormChange}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            isLoading={isLoading}
          />
        ) : (
          <CandidateForm
            formData={formData}
            onFormChange={handleFormChange}
            onNext={handleNextStep}
            onBack={handlePrevStep}
            isLoading={isLoading}
          />
        );
        
      case 3:
        return (
          <VerificationStep
            formData={formData}
            onComplete={handleRegistration}
            onBack={handlePrevStep}
            isLoading={isLoading}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Icon name="Briefcase" size={20} color="white" />
              </div>
              <span className="text-xl font-heading font-semibold text-text-primary">
                Job Matrimony
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">Already have an account?</span>
              <Link to="/login">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
          />
          
          {/* Step Content */}
          <div className="bg-surface rounded-xl shadow-elevation-2 p-8">
            {renderStepContent()}
          </div>
          
          {/* Footer Links */}
          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-6 text-sm text-text-secondary">
              <button
                onClick={() => openModal('terms')}
                className="hover:text-text-primary transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => openModal('privacy')}
                className="hover:text-text-primary transition-colors"
              >
                Privacy Policy
              </button>
              <a
                href="mailto:support@jobmatrimony.com"
                className="hover:text-text-primary transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
      />
    </div>
  );
};

export default Register;