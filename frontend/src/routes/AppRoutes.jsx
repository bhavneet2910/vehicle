import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../features/login/LoginPage";
import EmployeeDashboard from "../features/employee/Dashboard";
import AdminDashboard from "../features/admin/Dashboard";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
