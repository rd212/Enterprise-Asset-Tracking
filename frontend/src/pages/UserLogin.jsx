import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const UserLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both employee email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/user/login', {
        email: email.trim(),
        password
      });

      const { token, user } = response.data;

      if (!token || user?.type !== 'employee') {
        setError('Access Denied: Normal user credentials required for User Portal.');
        setLoading(false);
        return;
      }

      // Store auth session
      localStorage.setItem('adminToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to User Dashboard
      navigate('/user/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please check your employee credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              {/* User Portal Header Banner */}
              <div className="card-header bg-success text-white text-center py-4 border-0">
                <div className="d-inline-flex p-3 rounded-circle bg-white bg-opacity-25 mb-2">
                  <i className="bi bi-person-badge-fill text-white display-5"></i>
                </div>
                <h4 className="fw-bold mb-1">Enterprise Asset Tracking</h4>
                <span className="badge bg-light text-success fs-6 px-3 py-1 text-uppercase tracking-wider">
                  User Portal
                </span>
              </div>

              <div className="card-body p-4 p-md-5 bg-white">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="employeeEmail" className="form-label fw-bold text-secondary">
                      <i className="bi bi-envelope-fill me-1"></i>
                      Employee Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg fs-6"
                      id="employeeEmail"
                      placeholder="e.g. rahulpatel12kar@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label htmlFor="employeePassword" className="form-label fw-bold text-secondary mb-0">
                        <i className="bi bi-key-fill me-1"></i>
                        Password
                      </label>
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0 small text-success fw-semibold"
                        onClick={() => setShowForgotModal(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      className="form-control form-control-lg fs-6"
                      id="employeePassword"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-success w-100 py-3 fw-bold shadow-sm rounded-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Portal Switch Footer */}
              <div className="card-footer bg-light text-center py-3 border-top">
                <span className="text-muted small">Are you a system administrator? </span>
                <Link to="/admin/login" className="text-success fw-bold text-decoration-none small ms-1">
                  Admin Portal Login &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-question-circle me-2"></i>
                  Reset Employee Password
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="bi bi-person-badge display-3 text-success d-block mb-3"></i>
                <h5 className="fw-bold text-dark">Employee Password Assistance</h5>
                <p className="text-muted">
                  Please contact your IT Administrator or HR Department to request a password reset for your employee profile.
                </p>
                <div className="p-3 bg-light rounded text-start border">
                  <small className="d-block text-muted fw-bold">Default Test Credentials:</small>
                  <code>Email: rahulpatel12kar@gmail.com</code><br/>
                  <code>Password: 12345</code>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForgotModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
