import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AdminLogin = () => {
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
      setError('Please enter both admin email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/admin/login', {
        email: email.trim(),
        password
      });

      const { token, user } = response.data;

      if (!token || user?.type !== 'admin') {
        setError('Access Denied: This login portal is for Administrators only.');
        setLoading(false);
        return;
      }

      // Store auth session
      localStorage.setItem('adminToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to Admin Dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please check your admin credentials.'
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
              {/* Admin Portal Header Banner */}
              <div className="card-header bg-dark text-white text-center py-4 border-0">
                <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-25 mb-2">
                  <i className="bi bi-shield-lock-fill text-primary display-5"></i>
                </div>
                <h4 className="fw-bold mb-1">Enterprise Asset Tracking</h4>
                <span className="badge bg-primary fs-6 px-3 py-1 text-uppercase tracking-wider">
                  Admin Portal
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
                    <label htmlFor="adminEmail" className="form-label fw-bold text-secondary">
                      <i className="bi bi-envelope-fill me-1"></i>
                      Admin Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg fs-6"
                      id="adminEmail"
                      placeholder="e.g. admin@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label htmlFor="adminPassword" className="form-label fw-bold text-secondary mb-0">
                        <i className="bi bi-key-fill me-1"></i>
                        Password
                      </label>
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0 small text-primary fw-semibold"
                        onClick={() => setShowForgotModal(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      className="form-control form-control-lg fs-6"
                      id="adminPassword"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-3"
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
                <span className="text-muted small">Are you an employee? </span>
                <Link to="/user/login" className="text-primary fw-bold text-decoration-none small ms-1">
                  User Portal Login &rarr;
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
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-question-circle me-2 text-primary"></i>
                  Reset Admin Password
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <i className="bi bi-shield-lock display-3 text-primary d-block mb-3"></i>
                <h5 className="fw-bold text-dark">System Administrator Security</h5>
                <p className="text-muted">
                  For security reasons, admin credentials cannot be self-reset online.
                  Please contact the IT Security Department or check your seed credentials:
                </p>
                <div className="p-3 bg-light rounded text-start border">
                  <small className="d-block text-muted fw-bold">Default Seed Credentials:</small>
                  <code>Email: admin@gmail.com</code><br/>
                  <code>Password: admin123</code>
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

export default AdminLogin;
