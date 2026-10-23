import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/employee/profile');
        setProfile(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employee profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading Profile Information...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-dark mb-1">My Profile</h2>
        <p className="text-muted mb-0">View your official employee records and organizational details.</p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {profile && (
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-header bg-success text-white text-center py-4 rounded-top-4">
                <i className="bi bi-person-circle display-3 mb-2 d-block"></i>
                <h3 className="fw-bold mb-1">{profile.name}</h3>
                <span className="badge bg-light text-dark fs-6 px-3">{profile.position}</span>
              </div>

              <div className="card-body p-4">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-envelope-fill me-2 text-success"></i>
                      Email Address
                    </span>
                    <span className="fw-bold text-dark">{profile.email}</span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-telephone-fill me-2 text-success"></i>
                      Phone Number
                    </span>
                    <span className="fw-bold text-dark">{profile.phone}</span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-building me-2 text-success"></i>
                      Department
                    </span>
                    <span className="badge bg-success fs-6">{profile.department?.name || 'N/A'}</span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center py-3">
                    <span className="text-muted fw-semibold">
                      <i className="bi bi-person-badge-fill me-2 text-success"></i>
                      Job Position
                    </span>
                    <span className="fw-bold text-dark">{profile.position}</span>
                  </li>
                </ul>
              </div>

              <div className="card-footer bg-light text-center py-3 rounded-bottom-4">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1 text-success"></i>
                  Verified Employee Record
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
