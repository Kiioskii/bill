import { Routes, Route, useParams, Navigate } from "react-router-dom";
import LogInPage from "../features/auth/pages/login/page";
import SignUpPage from "../features/auth/pages/signup/page";
import { DashboardLayout } from "../features/dashboard/layout/DashboardLayout";
import { HomePage } from "../features/dashboard/pages/HomePage";
import { DocumentsPage } from "../features/documents/pages/DocumentsPage";
import ProtectedRoute from "./ProtectedRoute";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import QuizzesPage from "@/features/quizzes/pages/QuizzesPage";

const LanguageWrapper = ({ children }) => {
  const { i18n } = useTranslation();
  const { lng } = useParams();

  useEffect(() => {
    if (lng && i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n]);

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pl" replace />} />

      <Route
        path="/:lng/login"
        element={
          <LanguageWrapper>
            <LogInPage />
          </LanguageWrapper>
        }
      />
      <Route
        path="/:lng/signup"
        element={
          <LanguageWrapper>
            <SignUpPage />
          </LanguageWrapper>
        }
      />

      <Route
        path="/:lng"
        element={
          <LanguageWrapper>
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          </LanguageWrapper>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
      </Route>
    </Routes>
  );
};
