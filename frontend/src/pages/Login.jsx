import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center py-5">
      <div className="container">
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-dark text-white mb-3 shadow">
            <i className="bi bi-box-seam display-4"></i>
          </div>
          <h2 className="fw-bold text-dark mb-2">Enterprise Asset Tracking System</h2>
          <p className="text-muted fs-5">Select your portal entry point to continue</p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Admin Portal Card */}
          <div className="col-md-5 col-lg-4">
            <div className="card h-100 shadow-lg border-0 rounded-4 text-center p-4 hover-shadow transition">
              <div className="card-body d-flex flex-column align-items-center">
                <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3">
                  <i className="bi bi-shield-lock-fill display-4"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Admin Portal</h4>
                <p className="text-muted small mb-4">
                  Full system control, asset management, employee management, department setup, and request approval.
                </p>
                <Link
                  to="/admin/login"
                  className="btn btn-dark w-100 py-2.5 fw-bold rounded-3 mt-auto shadow-sm"
                >
                  <i className="bi bi-speedometer2 me-2 text-primary"></i>
                  Go to Admin Login
                </Link>
              </div>
            </div>
          </div>

          {/* User Portal Card */}
          <div className="col-md-5 col-lg-4">
            <div className="card h-100 shadow-lg border-0 rounded-4 text-center p-4 hover-shadow transition">
              <div className="card-body d-flex flex-column align-items-center">
                <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle mb-3">
                  <i className="bi bi-person-badge-fill display-4"></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">User Portal</h4>
                <p className="text-muted small mb-4">
                  View assigned equipment, submit asset change requests, report hardware/software issues, and check request status.
                </p>
                <Link
                  to="/user/login"
                  className="btn btn-success w-100 py-2.5 fw-bold rounded-3 mt-auto shadow-sm"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  Go to User Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 text-muted small">
          Academic Demo Project &bull; Enterprise Asset Tracking &bull; MERN Stack
        </div>
      </div>
    </div>
  );
};

export default Login;
