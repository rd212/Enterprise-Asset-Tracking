import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const EmployeeSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    navigate('/user/login');
  };

  return (
    <div className="bg-dark text-white p-3 vh-100 d-flex flex-column shadow-sm overflow-auto" style={{ width: '260px', minWidth: '260px' }}>
      <div className="pb-3 mb-3 border-bottom border-secondary">
        <h5 className="m-0 fw-bold text-success">
          <i className="bi bi-shield-lock-fill me-2"></i>
          User Portal
        </h5>
        <small className="text-muted">Enterprise Asset Tracking</small>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-success fw-bold' : ''}`
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>

        <li className="text-uppercase text-muted fw-bold small px-2 mt-2 mb-1" style={{ fontSize: '0.75rem' }}>
          My Assets
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/user/assets"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-success fw-bold' : ''}`
            }
          >
            <i className="bi bi-laptop me-2"></i>
            My Assets
          </NavLink>
        </li>

        <li className="text-uppercase text-muted fw-bold small px-2 mt-2 mb-1" style={{ fontSize: '0.75rem' }}>
          Requests
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/user/report-issue"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-success fw-bold' : ''}`
            }
          >
            <i className="bi bi-exclamation-octagon-fill me-2 text-warning"></i>
            Report Issue
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/user/change-request"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-success fw-bold' : ''}`
            }
          >
            <i className="bi bi-arrow-repeat me-2 text-info"></i>
            Change Request
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/user/requests"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-success fw-bold' : ''}`
            }
          >
            <i className="bi bi-clock-history me-2"></i>
            My Requests
          </NavLink>
        </li>

        <li className="text-uppercase text-muted fw-bold small px-2 mt-2 mb-1" style={{ fontSize: '0.75rem' }}>
          Account
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-success fw-bold' : ''}`
            }
          >
            <i className="bi bi-person-circle me-2"></i>
            Profile
          </NavLink>
        </li>
      </ul>

      <div className="pt-3 border-top border-secondary">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
