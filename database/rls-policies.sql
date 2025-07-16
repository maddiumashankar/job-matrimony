-- Row Level Security (RLS) Policies for Job Matrimony
-- These policies control who can access what data in your database

-- ===============================================
-- DROP ALL EXISTING POLICIES (to avoid conflicts)
-- ===============================================

-- User profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Companies policies
DROP POLICY IF EXISTS "Everyone can view companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
DROP POLICY IF EXISTS "Recruiters can update their company" ON public.companies;

-- Recruiter profiles policies
DROP POLICY IF EXISTS "Everyone can view recruiter profiles" ON public.recruiter_profiles;
DROP POLICY IF EXISTS "Recruiters can update own profile" ON public.recruiter_profiles;
DROP POLICY IF EXISTS "Recruiters can insert own profile" ON public.recruiter_profiles;

-- Candidate profiles policies
DROP POLICY IF EXISTS "Recruiters and admins can view candidate profiles" ON public.candidate_profiles;
DROP POLICY IF EXISTS "Candidates can update own profile" ON public.candidate_profiles;
DROP POLICY IF EXISTS "Candidates can insert own profile" ON public.candidate_profiles;

-- Skills policies
DROP POLICY IF EXISTS "Everyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON public.skills;

-- Education policies
DROP POLICY IF EXISTS "Users can view education" ON public.education;
DROP POLICY IF EXISTS "Candidates can manage own education" ON public.education;

-- Work experience policies
DROP POLICY IF EXISTS "Users can view work experience" ON public.work_experience;
DROP POLICY IF EXISTS "Candidates can manage own work experience" ON public.work_experience;

-- Portfolio items policies
DROP POLICY IF EXISTS "Users can view portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Candidates can manage own portfolio items" ON public.portfolio_items;

-- Job postings policies
DROP POLICY IF EXISTS "Everyone can view active job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Recruiters can view all job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Recruiters can manage own job postings" ON public.job_postings;

-- Job applications policies
DROP POLICY IF EXISTS "Candidates can view own applications" ON public.job_applications;
DROP POLICY IF EXISTS "Recruiters can view applications for their job postings" ON public.job_applications;
DROP POLICY IF EXISTS "Candidates can create applications" ON public.job_applications;
DROP POLICY IF EXISTS "Candidates can update own applications" ON public.job_applications;
DROP POLICY IF EXISTS "Recruiters can update applications for their job postings" ON public.job_applications;

-- Tests policies
DROP POLICY IF EXISTS "Recruiters can view tests" ON public.tests;
DROP POLICY IF EXISTS "Candidates can view tests they're invited to" ON public.tests;
DROP POLICY IF EXISTS "Recruiters can manage tests" ON public.tests;

-- Test attempts policies
DROP POLICY IF EXISTS "Candidates can view own test attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Recruiters can view test attempts for their tests" ON public.test_attempts;
DROP POLICY IF EXISTS "Candidates can create test attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Candidates can update own test attempts" ON public.test_attempts;

-- Interview policies
DROP POLICY IF EXISTS "Users can view their interviews" ON public.interviews;
DROP POLICY IF EXISTS "Recruiters can manage interviews" ON public.interviews;

-- Messages policies
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages they sent" ON public.messages;

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Job recommendations policies
DROP POLICY IF EXISTS "Candidates can view own recommendations" ON public.job_recommendations;
DROP POLICY IF EXISTS "System can create recommendations" ON public.job_recommendations;
DROP POLICY IF EXISTS "Candidates can update own recommendations" ON public.job_recommendations;

-- ===============================================
-- CREATE NEW POLICIES
-- ===============================================

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies policies
CREATE POLICY "Everyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage companies" ON public.companies FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Recruiters can update their company" ON public.companies FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.recruiter_profiles 
        WHERE user_id = auth.uid() AND company_id = companies.id
    )
);

-- Recruiter profiles policies
CREATE POLICY "Everyone can view recruiter profiles" ON public.recruiter_profiles FOR SELECT USING (true);
CREATE POLICY "Recruiters can update own profile" ON public.recruiter_profiles FOR UPDATE USING (
    user_id = auth.uid()
);
CREATE POLICY "Recruiters can insert own profile" ON public.recruiter_profiles FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Candidate profiles policies
CREATE POLICY "Recruiters and admins can view candidate profiles" ON public.candidate_profiles FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    ) OR user_id = auth.uid()
);
CREATE POLICY "Candidates can update own profile" ON public.candidate_profiles FOR UPDATE USING (
    user_id = auth.uid()
);
CREATE POLICY "Candidates can insert own profile" ON public.candidate_profiles FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Skills policies (read-only for most users)
CREATE POLICY "Everyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Education policies
CREATE POLICY "Users can view education" ON public.education FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
);
CREATE POLICY "Candidates can manage own education" ON public.education FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);

-- Work experience policies
CREATE POLICY "Users can view work experience" ON public.work_experience FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
);
CREATE POLICY "Candidates can manage own work experience" ON public.work_experience FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);

-- Portfolio items policies
CREATE POLICY "Users can view portfolio items" ON public.portfolio_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
);
CREATE POLICY "Candidates can manage own portfolio items" ON public.portfolio_items FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);

-- Job postings policies
CREATE POLICY "Everyone can view active job postings" ON public.job_postings FOR SELECT USING (
    status = 'published'
);
CREATE POLICY "Recruiters can view all job postings" ON public.job_postings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
);
CREATE POLICY "Recruiters can manage own job postings" ON public.job_postings FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.recruiter_profiles 
        WHERE id = recruiter_id AND user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Job applications policies
CREATE POLICY "Candidates can view own applications" ON public.job_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Recruiters can view applications for their job postings" ON public.job_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.job_postings jp
        JOIN public.recruiter_profiles rp ON jp.recruiter_id = rp.id
        WHERE jp.id = job_id AND rp.user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Candidates can create applications" ON public.job_applications FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Candidates can update own applications" ON public.job_applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Recruiters can update applications for their job postings" ON public.job_applications FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.job_postings jp
        JOIN public.recruiter_profiles rp ON jp.recruiter_id = rp.id
        WHERE jp.id = job_id AND rp.user_id = auth.uid()
    )
);

-- Tests policies
CREATE POLICY "Recruiters can view tests" ON public.tests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.recruiter_profiles 
        WHERE id = created_by AND user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Candidates can view tests they're invited to" ON public.tests FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.test_attempts ta
        JOIN public.candidate_profiles cp ON ta.candidate_id = cp.id
        WHERE ta.test_id = tests.id AND cp.user_id = auth.uid()
    )
);
CREATE POLICY "Recruiters can manage tests" ON public.tests FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.recruiter_profiles 
        WHERE id = created_by AND user_id = auth.uid()
    ) OR 
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Test attempts policies
CREATE POLICY "Candidates can view own test attempts" ON public.test_attempts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Recruiters can view test attempts for their tests" ON public.test_attempts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.tests t
        JOIN public.recruiter_profiles rp ON t.created_by = rp.id
        WHERE t.id = test_id AND rp.user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Candidates can create test attempts" ON public.test_attempts FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Candidates can update own test attempts" ON public.test_attempts FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);

-- Interview policies
CREATE POLICY "Users can view their interviews" ON public.interviews FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.recruiter_profiles 
        WHERE id = recruiter_id AND user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
CREATE POLICY "Recruiters can manage interviews" ON public.interviews FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.recruiter_profiles 
        WHERE id = recruiter_id AND user_id = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Messages policies
CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
);
CREATE POLICY "Users can update messages they sent" ON public.messages FOR UPDATE USING (
    auth.uid() = sender_id
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
    auth.uid() = user_id
);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (
    auth.uid() = user_id
);

-- Job recommendations policies
CREATE POLICY "Candidates can view own recommendations" ON public.job_recommendations FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);
CREATE POLICY "System can create recommendations" ON public.job_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Candidates can update own recommendations" ON public.job_recommendations FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.candidate_profiles 
        WHERE id = candidate_id AND user_id = auth.uid()
    )
);

-- ===============================================
-- SUCCESS MESSAGE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Row Level Security Policies Created Successfully!';
    RAISE NOTICE '🔐 Applied security rules to all 16 tables';
    RAISE NOTICE '👥 Role-based access control configured';
    RAISE NOTICE '🚀 Ready for sample data insertion!';
END $$;
