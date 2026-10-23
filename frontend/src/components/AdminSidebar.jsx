import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="bg-dark text-white p-3 vh-100 d-flex flex-column shadow-sm" style={{ width: '250px', minWidth: '250px' }}>
      <div className="pb-3 mb-3 border-bottom border-secondary">
        <h5 className="m-0 fw-bold text-primary">
          <i className="bi bi-speedometer2 me-2"></i>
          Admin Panel
        </h5>
        <small className="text-muted">Enterprise Asset Tracking</small>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className="bi bi-grid-1x2-fill me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/admin/assets"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className="bi bi-laptop me-2"></i>
            Assets
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className="bi bi-people-fill me-2"></i>
            Employees
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/admin/departments"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className="bi bi-building me-2"></i>
            Departments
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/admin/requests"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className="bi bi-chat-left-text-fill me-2"></i>
            Requests
          </NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
            }
          >
            <i className="bi bi-gear-fill me-2"></i>
            Settings
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

export default AdminSidebar;
