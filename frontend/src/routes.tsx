import { Routes, Route } from "react-router-dom";
import LogInPage from "./features/auth/pages/login/page";
import SignUpPage from "./features/auth/pages/signup/page";
import { DashboardLayout } from "./features/dashboard/layout/DashboardLayout";
import { HomePage } from "./features/dashboard/pages/HomePage";
import { DocumentsPage } from "./features/documents/pages/DocumentsPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Route>
    </Routes>
  );
};
