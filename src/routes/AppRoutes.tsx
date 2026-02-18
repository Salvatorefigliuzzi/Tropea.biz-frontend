import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import Home from '../pages/protected/Home';
import Gruppi from '../pages/protected/Gruppi';
import Utenti from '../pages/protected/Users';
import Permessi from '../pages/protected/Permessi';
import Ruoli from '../pages/protected/Ruoli';
import LandingPage from '../pages/public/LandingPage';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
        
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="account" element={<Home />} />
          <Route path="Gruppi" element={<Gruppi />} />
          <Route path="Users" element={<Utenti />} />
          <Route path="Permessi" element={<Permessi />} />
          <Route path="Ruoli" element={<Ruoli />} />
          {/* Add more dashboard sub-routes here */}
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
