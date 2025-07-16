import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedHeader from '../../components/ui/AuthenticatedHeader';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import JobBasicInfo from './components/JobBasicInfo';
import JobDescription from './components/JobDescription';
import JobRequirements from './components/JobRequirements';
import CompensationBenefits from './components/CompensationBenefits';
import ApplicationSettings from './components/ApplicationSettings';
import JobPreview from './components/JobPreview';
import WizardNavigation from './components/WizardNavigation';


const JobPostingCreation = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    role: "recruiter",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
  };

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      title: "New Application Received",
      message: "John Doe applied for Senior Developer position",
      time: "5 minutes ago",
      read: false,
      type: "application"
    },
    {
      id: 2,
      title: "Interview Scheduled",
      message: "Interview with Jane Smith scheduled for tomorrow",
      time: "1 hour ago",
      read: false,
      type: "interview"
    },
    {
      id: 3,
      title: "Job Posting Approved",
      message: "Your Frontend Developer job posting has been approved",
      time: "2 hours ago",
      read: true,
      type: "success"
    }
  ];

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    department: '',
    team: '',
    location: '',
    employmentType: '',
    workMode: '',
    experienceLevel: '',
    summary: '',
    
    // Description
    description: '',
    
    // Requirements
    requiredSkills: [],
    minExperience: '',
    preferredExperience: '',
    educationLevel: '',
    qualifications: [],
    niceToHaveSkills: '',
    languageRequirements: '',
    otherRequirements: '',
    
    // Compensation
    salaryType: 'annual',
    currency: 'USD',
    minSalary: '',
    maxSalary: '',
    benefits: [],
    customBenefits: [],
    equityInfo: '',
    workLifeBalance: '',
    
    // Application Settings
    applicationMethod: 'platform',
    applicationEmail: '',
    externalUrl: '',
    applicationDeadline: '',
    screeningQuestions: [],
    requiredAssessments: [],
    teamMembers: [],
    allowCoverLetter: false,
    requirePortfolio: false,
    enableAutoReply: true,
    isUrgent: false
  });

  const totalSteps = 5;

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1: // Basic Info
        if (!formData.title?.trim()) newErrors.title = 'Job title is required';
        if (!formData.department?.trim()) newErrors.department = 'Department is required';
        if (!formData.location?.trim()) newErrors.location = 'Location is required';
        if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
        if (!formData.workMode) newErrors.workMode = 'Work mode is required';
        if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
        if (!formData.summary?.trim()) newErrors.summary = 'Job summary is required';
        break;
        
      case 2: // Description
        if (!formData.description?.trim()) newErrors.description = 'Job description is required';
        if (formData.description && formData.description.length < 100) {
          newErrors.description = 'Job description should be at least 100 characters';
        }
        break;
        
      case 3: // Requirements
        if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
          newErrors.requiredSkills = 'At least one required skill is needed';
        }
        if (!formData.minExperience) newErrors.minExperience = 'Minimum experience is required';
        if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required';
        break;
        
      case 4: // Compensation
        if (formData.salaryType !== 'negotiable') {
          if (!formData.minSalary) newErrors.minSalary = 'Minimum salary is required';
          if (!formData.maxSalary) newErrors.maxSalary = 'Maximum salary is required';
          if (formData.minSalary && formData.maxSalary && 
              parseInt(formData.minSalary) >= parseInt(formData.maxSalary)) {
            newErrors.maxSalary = 'Maximum salary must be greater than minimum salary';
          }
        }
        break;
        
      case 5: // Application Settings
        if (!formData.applicationMethod) {
          newErrors.applicationMethod = 'Application method is required';
        }
        if (formData.applicationMethod === 'email' && !formData.applicationEmail) {
          newErrors.applicationEmail = 'Application email is required';
        }
        if (formData.applicationMethod === 'external' && !formData.externalUrl) {
          newErrors.externalUrl = 'External URL is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Job posting saved as draft:', formData);
      // Show success message
    } catch (error) {
      console.error('Error saving job posting:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    // Validate all steps before publishing
    let allValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        allValid = false;
        break;
      }
    }
    
    if (!allValid) {
      alert('Please complete all required fields before publishing');
      return;
    }
    
    setIsPublishing(true);
    try {
      // Mock API call to publish job
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Job posting published:', formData);
      // Redirect to job listings or success page
      navigate('/recruiter-dashboard');
    } catch (error) {
      console.error('Error publishing job posting:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData(newData);
    // Clear errors for the changed fields
    const clearedErrors = { ...errors };
    Object.keys(newData).forEach(key => {
      if (clearedErrors[key]) {
        delete clearedErrors[key];
      }
    });
    setErrors(clearedErrors);
  };

  const isCurrentStepValid = () => {
    return validateStep(currentStep);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <JobBasicInfo
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <JobDescription
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <JobRequirements
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <CompensationBenefits
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <ApplicationSettings
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  // Custom breadcrumbs
  const customBreadcrumbs = [
    { label: 'Dashboard', path: '/recruiter-dashboard', isActive: false },
    { label: 'Jobs', path: '/recruiter-dashboard', isActive: false },
    { label: 'Create New Job', path: '/job-posting-creation', isActive: true }
  ];

  useEffect(() => {
    // Auto-save draft every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (formData.title || formData.description) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthenticatedHeader
        user={mockUser}
        onLogout={handleLogout}
        notifications={mockNotifications}
      />

      {/* Sidebar */}
      <RoleBasedSidebar
        user={mockUser}
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* Main Content */}
      <div className="pt-16">
        {/* Breadcrumbs */}
        <NavigationBreadcrumbs customBreadcrumbs={customBreadcrumbs} />

        {/* Wizard Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          onPublish={handlePublish}
          isValid={isCurrentStepValid()}
          isSaving={isSaving}
          isPublishing={isPublishing}
        />

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-8">
                <div className="space-y-6">
                  {/* Step Title */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {currentStep}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-text-primary">
                        {currentStep === 1 && 'Basic Information'}
                        {currentStep === 2 && 'Job Description'}
                        {currentStep === 3 && 'Requirements & Qualifications'}
                        {currentStep === 4 && 'Compensation & Benefits'}
                        {currentStep === 5 && 'Application Settings'}
                      </h1>
                      <p className="text-text-secondary">
                        {currentStep === 1 && 'Start with the essential details about the position'}
                        {currentStep === 2 && 'Describe the role and responsibilities in detail'}
                        {currentStep === 3 && 'Define the skills and qualifications needed'}
                        {currentStep === 4 && 'Set compensation and benefits information'}
                        {currentStep === 5 && 'Configure how candidates can apply'}
                      </p>
                    </div>
                  </div>

                  {/* Current Step Content */}
                  {renderCurrentStep()}
                </div>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <JobPreview formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingCreation;