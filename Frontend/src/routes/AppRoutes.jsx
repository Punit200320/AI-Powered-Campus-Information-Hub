import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ScholarshipsHubPage } from '../pages/ScholarshipsHubPage';
import { CounsellingHubPage } from '../pages/CounsellingHubPage';
import { StudyMaterialHubPage } from '../pages/StudyMaterialHubPage';
import { ChatPage } from '../pages/ChatPage';
import { ResourceFinderPage } from '../pages/ResourceFinderPage';
import { SummarizerPage } from '../pages/SummarizerPage';
import { QuizPage } from '../pages/QuizPage';
import { PlannerPage } from '../pages/PlannerPage';
import { AdminPage } from '../pages/AdminPage';
import { SavedResourcesPage } from '../pages/SavedResourcesPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Marketing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />

        {/* Authenticated Workspace Layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scholarships" element={<ScholarshipsHubPage />} />
          <Route path="/counselling" element={<CounsellingHubPage />} />
          <Route path="/study-material" element={<StudyMaterialHubPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/resources" element={<ResourceFinderPage />} />
          <Route path="/summarize" element={<SummarizerPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/saved" element={<SavedResourcesPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
