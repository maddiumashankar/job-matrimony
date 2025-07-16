-- Job Matrimony Database Schema
-- Complete database structure for the job matching platform

-- ===============================================
-- DROP EXISTING TABLES (to avoid conflicts)
-- ===============================================

-- Drop tables in reverse dependency order to avoid foreign key conflicts
DROP TABLE IF EXISTS public.job_recommendations CASCADE;
DROP TABLE IF EXISTS public.portfolio_items CASCADE;
DROP TABLE IF EXISTS public.work_experience CASCADE;
DROP TABLE IF EXISTS public.education CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.interviews CASCADE;
DROP TABLE IF EXISTS public.test_attempts CASCADE;
DROP TABLE IF EXISTS public.tests CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.job_postings CASCADE;
DROP TABLE IF EXISTS public.recruiter_profiles CASCADE;
DROP TABLE IF EXISTS public.candidate_profiles CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.application_status CASCADE;
DROP TYPE IF EXISTS public.test_type CASCADE;
DROP TYPE IF EXISTS public.interview_status CASCADE;
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP TYPE IF EXISTS public.job_status CASCADE;
DROP TYPE IF EXISTS public.verification_status CASCADE;

-- ===============================================
-- ENABLE EXTENSIONS
-- ===============================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- CREATE CUSTOM TYPES (ENUMS)
-- ===============================================

-- User roles in the system
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'recruiter', 
  'candidate'
);

-- Job application status tracking
CREATE TYPE public.application_status AS ENUM (
  'applied',
  'screening',
  'interview_scheduled',
  'interview_completed',
  'selected',
  'rejected',
  'withdrawn'
);

-- Different types of skill assessments
CREATE TYPE public.test_type AS ENUM (
  'mcq',
  'coding',
  'technical_writing',
  'system_design',
  'behavioral'
);

-- Interview scheduling and completion status
CREATE TYPE public.interview_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'rescheduled'
);

-- System notification categories
CREATE TYPE public.notification_type AS ENUM (
  'application_update',
  'interview_scheduled',
  'test_assigned',
  'message_received',
  'job_recommendation',
  'system_update'
);

-- Job posting status
CREATE TYPE public.job_status AS ENUM (
  'draft',
  'published',
  'paused',
  'closed',
  'archived'
);

-- Verification status for recruiters and companies
CREATE TYPE public.verification_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'suspended'
);

-- ===============================================
-- CORE TABLES
-- ===============================================

-- Skills master table for job matching
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  is_technical BOOLEAN DEFAULT true,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table for recruiter associations
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url VARCHAR(500),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  headquarters VARCHAR(200),
  founded_year INTEGER,
  verification_status public.verification_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Extended user profiles (links to Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  role public.user_role NOT NULL,
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  location VARCHAR(200),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Candidate-specific profile data
CREATE TABLE public.candidate_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  resume_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  github_profile VARCHAR(255),
  linkedin_profile VARCHAR(255),
  preferred_job_title VARCHAR(200),
  expected_salary_min DECIMAL(12,2),
  expected_salary_max DECIMAL(12,2),
  salary_currency VARCHAR(10) DEFAULT 'USD',
  years_of_experience INTEGER DEFAULT 0,
  notice_period_days INTEGER DEFAULT 30,
  open_to_remote BOOLEAN DEFAULT true,
  open_to_relocation BOOLEAN DEFAULT false,
  preferred_locations TEXT[], -- Array of preferred work locations
  skill_ids UUID[] DEFAULT '{}', -- Array of skill IDs
  availability_status VARCHAR(50) DEFAULT 'open_to_opportunities',
  profile_visibility VARCHAR(20) DEFAULT 'public', -- public, private, recruiter_only
  profile_completion_score INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter-specific profile data
CREATE TABLE public.recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  job_title VARCHAR(200),
  department VARCHAR(100),
  hiring_regions TEXT[], -- Array of regions they can hire for
  specializations TEXT[], -- Array of specialization areas
  verification_status public.verification_status DEFAULT 'pending',
  can_post_jobs BOOLEAN DEFAULT false,
  jobs_posted_count INTEGER DEFAULT 0,
  successful_hires_count INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2) DEFAULT 0.0, -- Percentage
  average_response_time_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job postings by recruiters
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES public.recruiter_profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  salary_min DECIMAL(12,2),
  salary_max DECIMAL(12,2),
  salary_currency VARCHAR(10) DEFAULT 'USD',
  location VARCHAR(200),
  job_type VARCHAR(50) DEFAULT 'full_time', -- full_time, part_time, contract, internship
  experience_level VARCHAR(50), -- entry, mid, senior, lead, principal
  required_skills UUID[], -- Array of skill IDs
  nice_to_have_skills UUID[], -- Array of skill IDs
  benefits TEXT[],
  remote_allowed BOOLEAN DEFAULT false,
  visa_sponsorship BOOLEAN DEFAULT false,
  status public.job_status DEFAULT 'draft',
  application_deadline DATE,
  slots_available INTEGER DEFAULT 1,
  applications_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  ai_match_enabled BOOLEAN DEFAULT true,
  auto_screening_enabled BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job applications by candidates
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  status public.application_status DEFAULT 'applied',
  cover_letter TEXT,
  custom_resume_url VARCHAR(500), -- Custom resume for this application
  ai_match_score DECIMAL(5,2), -- AI-calculated match percentage
  recruiter_rating INTEGER CHECK (recruiter_rating >= 1 AND recruiter_rating <= 5),
  recruiter_notes TEXT,
  withdrawal_reason TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_status_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure candidate can only apply once per job
  UNIQUE(job_id, candidate_id)
);

-- Skill assessment tests
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES public.recruiter_profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type public.test_type NOT NULL,
  difficulty_level VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard, expert
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_questions INTEGER,
  passing_score DECIMAL(5,2) DEFAULT 70.0,
  skill_ids UUID[], -- Array of skills this test evaluates
  questions JSONB, -- Test questions and options
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test attempts by candidates
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  job_application_id UUID REFERENCES public.job_applications(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_taken_minutes INTEGER,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 100.0,
  percentage_score DECIMAL(5,2),
  answers JSONB, -- Candidate's answers
  ai_analysis JSONB, -- AI analysis of coding solutions
  proctoring_data JSONB, -- Webcam/screen monitoring data
  is_passed BOOLEAN,
  attempt_number INTEGER DEFAULT 1,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interview scheduling and management
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  recruiter_id UUID NOT NULL REFERENCES public.recruiter_profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  interview_type VARCHAR(50) DEFAULT 'video', -- video, phone, in_person
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link VARCHAR(500),
  meeting_room VARCHAR(100),
  agenda TEXT,
  status public.interview_status DEFAULT 'scheduled',
  interviewer_notes TEXT,
  candidate_feedback TEXT,
  technical_rating INTEGER CHECK (technical_rating >= 1 AND technical_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  cultural_fit_rating INTEGER CHECK (cultural_fit_rating >= 1 AND cultural_fit_rating <= 5),
  overall_recommendation VARCHAR(50), -- strong_hire, hire, no_hire, strong_no_hire
  recording_url VARCHAR(500),
  rescheduled_from UUID REFERENCES public.interviews(id),
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Direct messaging between users
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  job_application_id UUID REFERENCES public.job_applications(id) ON DELETE SET NULL,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, file, system_notification
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  file_size INTEGER,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_archived BOOLEAN DEFAULT false,
  reply_to UUID REFERENCES public.messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  action_url VARCHAR(500),
  action_label VARCHAR(100),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB, -- Additional notification data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================================
-- PROFILE EXTENSION TABLES
-- ===============================================

-- Educational background
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  institution_name VARCHAR(200) NOT NULL,
  degree VARCHAR(100) NOT NULL,
  field_of_study VARCHAR(100),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  grade_cgpa VARCHAR(20),
  activities TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Professional work experience
CREATE TABLE public.work_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  job_title VARCHAR(200) NOT NULL,
  employment_type VARCHAR(50), -- full_time, part_time, contract, internship, freelance
  location VARCHAR(200),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[],
  skills_used UUID[], -- Array of skill IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio projects and achievements
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  project_url VARCHAR(500),
  repository_url VARCHAR(500),
  image_urls TEXT[],
  technologies_used UUID[], -- Array of skill IDs
  project_type VARCHAR(50), -- web_app, mobile_app, api, library, other
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI-powered job recommendations
CREATE TABLE public.job_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL,
  match_reasons TEXT[], -- Array of reasons for the match
  ai_explanation TEXT,
  is_viewed BOOLEAN DEFAULT false,
  is_applied BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  recommended_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique recommendations
  UNIQUE(candidate_id, job_id)
);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_active ON public.user_profiles(is_active);

-- Candidate profiles indexes
CREATE INDEX idx_candidate_profiles_user_id ON public.candidate_profiles(user_id);
CREATE INDEX idx_candidate_profiles_skills ON public.candidate_profiles USING GIN(skill_ids);
CREATE INDEX idx_candidate_profiles_availability ON public.candidate_profiles(availability_status);
CREATE INDEX idx_candidate_profiles_experience ON public.candidate_profiles(years_of_experience);
CREATE INDEX idx_candidate_profiles_salary ON public.candidate_profiles(expected_salary_min, expected_salary_max);

-- Recruiter profiles indexes
CREATE INDEX idx_recruiter_profiles_user_id ON public.recruiter_profiles(user_id);
CREATE INDEX idx_recruiter_profiles_company_id ON public.recruiter_profiles(company_id);
CREATE INDEX idx_recruiter_profiles_verification ON public.recruiter_profiles(verification_status);

-- Job postings indexes
CREATE INDEX idx_job_postings_recruiter_id ON public.job_postings(recruiter_id);
CREATE INDEX idx_job_postings_company_id ON public.job_postings(company_id);
CREATE INDEX idx_job_postings_status ON public.job_postings(status);
CREATE INDEX idx_job_postings_skills ON public.job_postings USING GIN(required_skills);
CREATE INDEX idx_job_postings_location ON public.job_postings(location);
CREATE INDEX idx_job_postings_salary ON public.job_postings(salary_min, salary_max);
CREATE INDEX idx_job_postings_published ON public.job_postings(published_at);

-- Job applications indexes
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_candidate_id ON public.job_applications(candidate_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON public.job_applications(applied_at);

-- Messages indexes
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Skills indexes
CREATE INDEX idx_skills_category ON public.skills(category);
CREATE INDEX idx_skills_name ON public.skills(name);
CREATE INDEX idx_skills_popularity ON public.skills(popularity_score);

-- Companies indexes
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_industry ON public.companies(industry);
CREATE INDEX idx_companies_verification ON public.companies(verification_status);

-- Test attempts indexes
CREATE INDEX idx_test_attempts_candidate_id ON public.test_attempts(candidate_id);
CREATE INDEX idx_test_attempts_test_id ON public.test_attempts(test_id);
CREATE INDEX idx_test_attempts_completed_at ON public.test_attempts(completed_at);

-- Job recommendations indexes
CREATE INDEX idx_job_recommendations_candidate_id ON public.job_recommendations(candidate_id);
CREATE INDEX idx_job_recommendations_job_id ON public.job_recommendations(job_id);
CREATE INDEX idx_job_recommendations_match_score ON public.job_recommendations(match_score);

-- ===============================================
-- TRIGGERS FOR AUTO-UPDATES
-- ===============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidate_profiles_updated_at BEFORE UPDATE ON public.candidate_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON public.recruiter_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_attempts_updated_at BEFORE UPDATE ON public.test_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_experience_updated_at BEFORE UPDATE ON public.work_experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_recommendations_updated_at BEFORE UPDATE ON public.job_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- ENABLE ROW LEVEL SECURITY
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_recommendations ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ Job Matrimony Database Schema Created Successfully!';
    RAISE NOTICE '📊 Created 19 tables with relationships and indexes';
    RAISE NOTICE '🔐 Row Level Security enabled on all tables';
    RAISE NOTICE '⚡ Auto-update triggers configured';
    RAISE NOTICE '🚀 Ready for RLS policies and sample data!';
END $$;
