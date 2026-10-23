import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';

// Layouts & Protection
import AdminLayout from './components/AdminLayout';
import EmployeeLayout from './components/EmployeeLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Assets from './pages/admin/Assets';
import Employees from './pages/admin/Employees';
import Departments from './pages/admin/Departments';
import AdminRequests from './pages/admin/Requests';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import Profile from './pages/employee/Profile';
import MyAssets from './pages/employee/MyAssets';
import ReportIssue from './pages/employee/ReportIssue';
import ChangeRequest from './pages/employee/ChangeRequest';
import MyRequests from './pages/employee/MyRequests';

// Root redirect helper
const RootRedirect = () => {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/user/login" replace />;
  }
  if (user.type === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user.type === 'employee') {
    return <Navigate to="/user/dashboard" replace />;
  }
  return <Navigate to="/user/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/login" element={<UserLogin />} />

        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedType="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/assets" element={<Assets />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/reports" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedType="employee" />}>
          <Route element={<EmployeeLayout />}>
            <Route path="/user/dashboard" element={<EmployeeDashboard />} />
            <Route path="/user/assets" element={<MyAssets />} />
            <Route path="/user/report-issue" element={<ReportIssue />} />
            <Route path="/user/change-request" element={<ChangeRequest />} />
            <Route path="/user/requests" element={<MyRequests />} />
            <Route path="/user/profile" element={<Profile />} />

            {/* Support /employee/... path aliases */}
            <Route path="/employee/dashboard" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/employee/assets" element={<Navigate to="/user/assets" replace />} />
            <Route path="/employee/report-issue" element={<Navigate to="/user/report-issue" replace />} />
            <Route path="/employee/change-request" element={<Navigate to="/user/change-request" replace />} />
            <Route path="/employee/requests" element={<Navigate to="/user/requests" replace />} />
            <Route path="/employee/profile" element={<Navigate to="/user/profile" replace />} />
          </Route>
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
