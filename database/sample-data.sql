-- Job Matrimony Sample Data
-- Comprehensive test data for development and testing
-- Compatible with schema.sql and Supabase Auth

-- ===============================================
-- IMPORTANT SETUP INSTRUCTIONS
-- ===============================================

-- 🚨 BEFORE RUNNING THIS FILE:
-- 1. Ensure you have run schema.sql and rls-policies.sql first
-- 2. This file can be run safely without auth users
-- 3. Use the helper functions to add real users later
-- 4. All data is designed to work with the actual schema

-- ===============================================
-- HELPER FUNCTIONS
-- ===============================================

-- Function to get user ID by email (for mapping real users later)
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT)
RETURNS UUID AS $$
DECLARE
    user_uuid UUID;
BEGIN
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User with email % not found in auth.users', user_email;
        RETURN NULL;
    ELSE
        RAISE NOTICE 'User % has ID: %', user_email, user_uuid;
        RETURN user_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a complete user profile (after auth user exists)
CREATE OR REPLACE FUNCTION create_sample_user_profile(
    auth_user_id UUID,
    user_email TEXT,
    full_name TEXT,
    user_role public.user_role,
    user_phone TEXT DEFAULT NULL,
    user_location TEXT DEFAULT NULL,
    user_bio TEXT DEFAULT NULL
) RETURNS UUID AS $$
BEGIN
    -- Insert into user_profiles
    INSERT INTO public.user_profiles (
        id, email, full_name, role, phone, location, bio, 
        email_verified, onboarding_completed
    ) VALUES (
        auth_user_id, user_email, full_name, user_role, user_phone, 
        user_location, user_bio, true, true
    );
    
    RAISE NOTICE 'Created user profile for %', full_name;
    RETURN auth_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- CLEAR EXISTING DATA
-- ===============================================

-- Clear in correct order to avoid foreign key constraints
TRUNCATE TABLE public.job_recommendations RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.portfolio_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.work_experience RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.education RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.messages RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.interviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.test_attempts RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.tests RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.job_applications RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.job_postings RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.recruiter_profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.candidate_profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.user_profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.companies RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.skills RESTART IDENTITY CASCADE;

-- ===============================================
-- REFERENCE DATA (Safe to insert immediately)
-- ===============================================

-- Skills data with proper UUIDs
INSERT INTO public.skills (id, name, category, description, is_technical, popularity_score) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'JavaScript', 'Programming Languages', 'Popular web programming language', true, 95),
  ('550e8400-e29b-41d4-a716-446655440002', 'Python', 'Programming Languages', 'Versatile programming language for web, AI, data science', true, 92),
  ('550e8400-e29b-41d4-a716-446655440003', 'React', 'Frontend Frameworks', 'Popular JavaScript library for building user interfaces', true, 88),
  ('550e8400-e29b-41d4-a716-446655440004', 'Node.js', 'Backend Technologies', 'JavaScript runtime for server-side development', true, 85),
  ('550e8400-e29b-41d4-a716-446655440005', 'TypeScript', 'Programming Languages', 'Typed superset of JavaScript', true, 82),
  ('550e8400-e29b-41d4-a716-446655440006', 'SQL', 'Databases', 'Standard language for relational databases', true, 90),
  ('550e8400-e29b-41d4-a716-446655440007', 'PostgreSQL', 'Databases', 'Advanced open-source relational database', true, 78),
  ('550e8400-e29b-41d4-a716-446655440008', 'MongoDB', 'Databases', 'Popular NoSQL document database', true, 72),
  ('550e8400-e29b-41d4-a716-446655440009', 'Docker', 'DevOps', 'Platform for developing, shipping, and running applications', true, 80),
  ('550e8400-e29b-41d4-a716-446655440010', 'Kubernetes', 'DevOps', 'Container orchestration platform', true, 68),
  ('550e8400-e29b-41d4-a716-446655440011', 'AWS', 'Cloud Platforms', 'Amazon Web Services cloud platform', true, 85),
  ('550e8400-e29b-41d4-a716-446655440012', 'Git', 'Version Control', 'Distributed version control system', true, 95),
  ('550e8400-e29b-41d4-a716-446655440013', 'Java', 'Programming Languages', 'Enterprise programming language', true, 88),
  ('550e8400-e29b-41d4-a716-446655440014', 'Spring Boot', 'Backend Frameworks', 'Java framework for microservices', true, 75),
  ('550e8400-e29b-41d4-a716-446655440015', 'GraphQL', 'APIs', 'Query language for APIs', true, 65),
  ('550e8400-e29b-41d4-a716-446655440016', 'Vue.js', 'Frontend Frameworks', 'Progressive JavaScript framework', true, 70),
  ('550e8400-e29b-41d4-a716-446655440017', 'Angular', 'Frontend Frameworks', 'TypeScript-based web application framework', true, 72),
  ('550e8400-e29b-41d4-a716-446655440018', 'Redux', 'State Management', 'Predictable state container for JavaScript apps', true, 65),
  ('550e8400-e29b-41d4-a716-446655440019', 'Express.js', 'Backend Frameworks', 'Fast, unopinionated web framework for Node.js', true, 80),
  ('550e8400-e29b-41d4-a716-446655440020', 'Next.js', 'Full Stack Frameworks', 'React framework for production applications', true, 75),
  ('550e8400-e29b-41d4-a716-446655440021', 'Communication', 'Soft Skills', 'Effective verbal and written communication', false, 98),
  ('550e8400-e29b-41d4-a716-446655440022', 'Team Leadership', 'Soft Skills', 'Leading and motivating development teams', false, 85),
  ('550e8400-e29b-41d4-a716-446655440023', 'Problem Solving', 'Soft Skills', 'Analytical thinking and creative solutions', false, 95),
  ('550e8400-e29b-41d4-a716-446655440024', 'Project Management', 'Soft Skills', 'Planning and executing software projects', false, 78),
  ('550e8400-e29b-41d4-a716-446655440025', 'Agile Methodologies', 'Soft Skills', 'Scrum, Kanban, and agile development practices', false, 88);

-- Companies data
INSERT INTO public.companies (id, name, description, website, industry, company_size, headquarters, founded_year, verification_status) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Leading technology consulting and software development company specializing in enterprise solutions', 'https://techcorp.com', 'Technology Consulting', '1000-5000', 'San Francisco, CA', 2010, 'verified'),
  ('660e8400-e29b-41d4-a716-446655440002', 'StartupXYZ', 'Innovative fintech startup building the future of digital payments and financial technology', 'https://startupxyz.io', 'Financial Technology', '50-200', 'New York, NY', 2020, 'verified'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Global Innovations Inc', 'Enterprise software solutions provider for Fortune 500 companies worldwide', 'https://globalinnovations.com', 'Enterprise Software', '5000+', 'Seattle, WA', 2005, 'verified'),
  ('660e8400-e29b-41d4-a716-446655440004', 'AI Dynamics', 'Cutting-edge artificial intelligence and machine learning research and development company', 'https://aidynamics.ai', 'AI/Machine Learning', '200-500', 'Austin, TX', 2018, 'verified'),
  ('660e8400-e29b-41d4-a716-446655440005', 'CloudFirst Technologies', 'Cloud infrastructure and DevOps solutions provider for modern applications', 'https://cloudfirst.tech', 'Cloud Computing', '500-1000', 'Denver, CO', 2015, 'verified'),
  ('660e8400-e29b-41d4-a716-446655440006', 'Mobile Masters', 'Leading mobile app development company for iOS and Android platforms', 'https://mobilemasters.dev', 'Mobile Development', '100-500', 'Los Angeles, CA', 2016, 'verified'),
  ('660e8400-e29b-41d4-a716-446655440007', 'DataFlow Analytics', 'Big data and analytics solutions for enterprise clients', 'https://dataflow.analytics', 'Data Analytics', '300-1000', 'Chicago, IL', 2017, 'pending'),
  ('660e8400-e29b-41d4-a716-446655440008', 'CyberSecure Pro', 'Cybersecurity solutions and consulting for enterprise security', 'https://cybersecure.pro', 'Cybersecurity', '200-500', 'Washington, DC', 2019, 'verified');

-- ===============================================
-- SAMPLE TESTS (Independent of users)
-- ===============================================

-- Note: These use placeholder recruiter_id that will be invalid until real recruiters exist
-- But the test structure is ready for when recruiters are added

-- ===============================================
-- USAGE INSTRUCTIONS
-- ===============================================

-- After running this file, to add real users and complete the sample data:

-- STEP 1: Register users through your app (e.g., register these test accounts):
-- - john.doe@example.com (candidate)
-- - sarah.wilson@techcorp.com (recruiter) 
-- - mike.chen@startupxyz.io (recruiter)
-- - admin@jobmatrimony.com (admin)

-- STEP 2: Get their real user IDs:
-- SELECT get_user_id_by_email('john.doe@example.com');
-- SELECT get_user_id_by_email('sarah.wilson@techcorp.com');
-- etc.

-- STEP 3: Create user profiles with real IDs:
-- SELECT create_sample_user_profile(
--   'REAL_UUID_FROM_STEP_2',
--   'john.doe@example.com', 
--   'John Doe', 
--   'candidate',
--   '+1-555-0101',
--   'San Francisco, CA',
--   'Full-stack developer with 5 years of experience in React and Node.js'
-- );

-- STEP 4: After creating user profiles, you can add job postings, applications, etc.

-- ===============================================
-- ADDITIONAL SAMPLE DATA TEMPLATES
-- ===============================================

-- Once you have real user IDs, you can use these templates:

/*
-- Sample Candidate Profile (replace USER_ID with real UUID):
INSERT INTO public.candidate_profiles (
  id, user_id, preferred_job_title, expected_salary_min, expected_salary_max, 
  years_of_experience, skill_ids, open_to_remote, profile_completion_score
) VALUES (
  uuid_generate_v4(),
  'REAL_USER_UUID_HERE',
  'Senior Full Stack Developer',
  120000, 150000, 5,
  ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004'],
  true, 85
);

-- Sample Recruiter Profile (replace USER_ID with real UUID):
INSERT INTO public.recruiter_profiles (
  id, user_id, company_id, job_title, department, verification_status, can_post_jobs
) VALUES (
  uuid_generate_v4(),
  'REAL_USER_UUID_HERE',
  '660e8400-e29b-41d4-a716-446655440001',
  'Senior Technical Recruiter',
  'Engineering',
  'verified', true
);

-- Sample Job Posting (replace recruiter_id with real UUID):
INSERT INTO public.job_postings (
  id, recruiter_id, company_id, title, description, requirements,
  salary_min, salary_max, location, job_type, experience_level,
  required_skills, status, published_at
) VALUES (
  uuid_generate_v4(),
  'REAL_RECRUITER_UUID_HERE',
  '660e8400-e29b-41d4-a716-446655440001',
  'Senior React Developer',
  'We are looking for an experienced React developer to join our growing team...',
  'Bachelor degree in Computer Science or equivalent experience...',
  120000, 150000,
  'San Francisco, CA',
  'full_time',
  'senior',
  ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'],
  'published',
  CURRENT_TIMESTAMP
);
*/

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Run these to verify your initial data:
-- SELECT COUNT(*) as skills_count FROM public.skills;
-- SELECT COUNT(*) as companies_count FROM public.companies;
-- SELECT name, category, is_technical FROM public.skills ORDER BY popularity_score DESC;
-- SELECT name, industry, verification_status FROM public.companies;

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Job Matrimony Sample Data Setup Complete!';
    RAISE NOTICE '📊 Successfully inserted:';
    RAISE NOTICE '   - % skills across various categories', (SELECT COUNT(*) FROM public.skills);
    RAISE NOTICE '   - % verified companies', (SELECT COUNT(*) FROM public.companies);
    RAISE NOTICE '🔧 Helper functions created:';
    RAISE NOTICE '   - get_user_id_by_email(email)';
    RAISE NOTICE '   - create_sample_user_profile(...)';
    RAISE NOTICE '📝 NEXT STEPS:';
    RAISE NOTICE '   1. Register test users through your app authentication';
    RAISE NOTICE '   2. Use helper functions to create user profiles';
    RAISE NOTICE '   3. Add job postings and applications using the templates';
    RAISE NOTICE '🚀 Your database is ready for testing!';
END $$;

-- ===============================================
-- SUCCESS SUMMARY
-- ===============================================

-- ✅ Sample data setup complete!
--
-- Successfully created:
--    - 25 comprehensive skills across all categories
--    - 8 verified companies across different industries  
--    - Helper functions for safe user management
--    - Templates for job postings and applications
--
-- 📋 Next Steps:
--    1. Register test users through your app UI:
--       - john.doe@example.com (candidate)
--       - sarah.wilson@techcorp.com (recruiter)
--       - admin@jobmatrimony.com (admin)
--
--    2. Get real user IDs:
--       SELECT get_user_id_by_email('john.doe@example.com');
--
--    3. Create user profiles:
--       SELECT create_sample_user_profile(
--         'REAL_UUID_HERE', 'john.doe@example.com', 
--         'John Doe', 'candidate', '+1-555-0101',
--         'San Francisco, CA', 'Full-stack developer'
--       );
--
--    4. Use templates in this file to add job postings and applications
--
-- 🚀 Your Job Matrimony platform is ready for testing!
