import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
// Add your imports here
import Login from "pages/login";
import CandidateDashboard from "pages/candidate-dashboard";
import RecruiterDashboard from "pages/recruiter-dashboard";
import AdminDashboard from "pages/admin-dashboard";
import Register from "pages/register";
import JobPostingCreation from "pages/job-posting-creation";
import CandidateProfile from "pages/candidate-profile";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route 
          path="/candidate-dashboard" 
          element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter-dashboard" 
          element={
            <ProtectedRoute roles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job-posting-creation" 
          element={
            <ProtectedRoute roles={['recruiter']}>
              <JobPostingCreation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/candidate-profile" 
          element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;