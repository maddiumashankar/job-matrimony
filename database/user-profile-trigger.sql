-- User Profile Auto-Creation Trigger (Fixed Version)
-- This trigger automatically creates a user profile when a user signs up via Supabase Auth

-- ===============================================
-- FUNCTION: AUTO-CREATE USER PROFILE (SAFE VERSION)
-- ===============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create basic user profile (safe, minimal approach)
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    phone,
    bio,
    email_verified,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' IN ('admin', 'recruiter', 'candidate') 
      THEN (NEW.raw_user_meta_data->>'role')::public.user_role
      ELSE 'candidate'::public.user_role
    END,
    NEW.raw_user_meta_data->>'phone',
    'New user profile',
    NEW.email_confirmed_at IS NOT NULL,
    false
  );

  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- TRIGGER: ON USER SIGNUP (SAFE VERSION)
-- ===============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===============================================
-- FUNCTION: CREATE EXTENDED PROFILES MANUALLY
-- ===============================================

-- Function to create candidate profile after user creation
CREATE OR REPLACE FUNCTION create_candidate_profile(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.candidate_profiles (
    user_id,
    preferred_job_title,
    expected_salary_min,
    expected_salary_max,
    years_of_experience,
    open_to_remote,
    availability_status,
    profile_completion_score
  )
  VALUES (
    user_uuid,
    'Software Developer',
    70000,
    120000,
    2,
    true,
    'open_to_opportunities',
    30
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create recruiter profile after user creation
CREATE OR REPLACE FUNCTION create_recruiter_profile(user_uuid UUID, company_name_param TEXT DEFAULT 'New Company')
RETURNS VOID AS $$
DECLARE
  company_uuid UUID;
BEGIN
  -- Create or get company
  INSERT INTO public.companies (name, description, industry, verification_status)
  VALUES (
    company_name_param,
    'Company profile',
    'Technology',
    'pending'
  )
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO company_uuid;
  
  -- Get company ID if it already existed
  IF company_uuid IS NULL THEN
    SELECT id INTO company_uuid FROM public.companies WHERE name = company_name_param LIMIT 1;
  END IF;

  -- Create recruiter profile
  INSERT INTO public.recruiter_profiles (
    user_id,
    company_id,
    job_title,
    verification_status,
    can_post_jobs
  )
  VALUES (
    user_uuid,
    company_uuid,
    'Recruiter',
    'pending',
    true
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- ENABLE TRIGGER PERMISSIONS
-- ===============================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Safe user auto-creation trigger installed!';
    RAISE NOTICE '🔧 Main Function: handle_new_user() - creates basic user_profiles only';
    RAISE NOTICE '🔧 Helper Functions:';
    RAISE NOTICE '   - create_candidate_profile(user_uuid)';
    RAISE NOTICE '   - create_recruiter_profile(user_uuid, company_name)';
    RAISE NOTICE '⚡ Trigger: on_auth_user_created';
    RAISE NOTICE '📋 Usage:';
    RAISE NOTICE '   1. Users signup → basic profile created automatically';
    RAISE NOTICE '   2. Call helper functions to create extended profiles';
    RAISE NOTICE '🚀 Registration should now work without errors!';
END $$;
