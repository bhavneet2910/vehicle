import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginPage from "../features/login/LoginPage";
import CoDashboard from "../features/admin/CoDashboard";
import AdminDashboard from "../features/admin/AdminDashboard";
import RequestHistory from "../features/admin/RequestHistory";
// import NotFound from "../pages/NotFound"; // File does not exist
// import api from '../../services/api'; // Not needed here
import VehicleSelectionPage from '../features/vehicle/VehicleSelectionPage';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/employee/dashboard" element={<EmployeeDashboard />} /> */}
      { <Route path="/admin/dashboard" element={<AdminDashboard />} /> }
      <Route path="/admin/request-history" element={<RequestHistory />} />
      <Route path="/co/dashboard" element={<CoDashboard coUserId={user?.cpfNumber} />} />
      <Route path="/co/request-history" element={<RequestHistory />} />
      <Route path="/vehicle-selection" element={<VehicleSelectionPage />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
