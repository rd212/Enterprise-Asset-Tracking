import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SetupPage = () => {
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const checkBackendConnection = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/test');
      if (response.data && response.data.success) {
        setBackendStatus(true);
        setApiMessage(response.data.message);
      } else {
        setBackendStatus(false);
        setError('Unexpected API response format');
      }
    } catch (err) {
      setBackendStatus(false);
      setError('Could not connect to backend server. Make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            <i className="bi bi-box-seam me-2"></i>
            Enterprise Asset Tracking System
          </a>
          <div className="d-flex align-items-center">
            <span className="navbar-text badge bg-primary fs-6 me-3">
              Phase 4 Protected
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom py-3">
                <h4 className="card-title m-0 text-primary fw-bold text-center">
                  Phase 4 — Protected Admin Workspace
                </h4>
              </div>
              <div className="card-body p-4">
                <p className="text-muted text-center mb-4">
                  Authenticated Session Verified via JWT Token.
                </p>

                {/* Status Badges List */}
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <span className="fw-semibold">
                      <i className="bi bi-hdd-network me-2 text-secondary"></i>
                      Backend Status
                    </span>
                    {loading ? (
                      <span className="badge bg-secondary">Checking...</span>
                    ) : backendStatus ? (
                      <span className="badge bg-success fs-6">Connected ✅</span>
                    ) : (
                      <span className="badge bg-danger fs-6">Not Connected ❌</span>
                    )}
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <span className="fw-semibold">
                      <i className="bi bi-database me-2 text-secondary"></i>
                      MongoDB Status
                    </span>
                    {loading ? (
                      <span className="badge bg-secondary">Checking...</span>
                    ) : backendStatus ? (
                      <span className="badge bg-success fs-6">Connected ✅</span>
                    ) : (
                      <span className="badge bg-danger fs-6">Not Connected ❌</span>
                    )}
                  </li>
                </ul>

                {/* API Response Section */}
                {backendStatus && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>
                      <strong>API Message:</strong> {apiMessage}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* Retry Button */}
                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-outline-primary"
                    onClick={checkBackendConnection}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    {loading ? 'Testing Connection...' : 'Re-test Connection'}
                  </button>
                </div>
              </div>

              <div className="card-footer bg-light text-center text-muted py-3">
                <small>Enterprise Asset Tracking System &bull; Phase 4 Auth Verified</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
