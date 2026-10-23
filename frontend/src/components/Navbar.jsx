import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 py-2 shadow-sm border-bottom border-secondary">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold d-flex align-items-center">
          <i className="bi bi-box-seam-fill me-2 text-primary"></i>
          Enterprise Asset Tracking System
        </span>

        <div className="d-flex align-items-center ms-auto">
          {user && (
            <div className="me-3 text-end d-none d-md-block">
              <span className="badge bg-primary me-2">
                {user.type === 'admin' ? 'Administrator' : 'Employee Portal'}
              </span>
              <span className="text-light fw-medium">{user.name}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm d-flex align-items-center"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
