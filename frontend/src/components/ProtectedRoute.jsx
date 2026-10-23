import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedType }) => {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Unauthenticated user redirection
  if (!token || !user) {
    if (allowedType === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/user/login" replace />;
  }

  // Role Mismatch Authorization Check
  if (allowedType && user.type !== allowedType) {
    // If a normal user tries to access an Admin route -> Redirect to user dashboard
    if (user.type === 'employee') {
      return <Navigate to="/user/dashboard" replace />;
    }
    // If an Admin tries to access a User route -> Redirect to admin dashboard
    if (user.type === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
