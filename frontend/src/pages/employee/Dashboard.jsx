import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileRes, assetsRes, requestsRes] = await Promise.all([
          api.get('/employee/profile'),
          api.get('/employee/assets'),
          api.get('/requests/my')
        ]);

        setProfile(profileRes.data.data);
        setAssets(assetsRes.data.data || []);
        setRequests(requestsRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load employee dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading Employee Dashboard...</span>
      </div>
    );
  }

  // Calculate metric card counts
  const totalAssignedAssets = assets.length;
  const activeAssets = assets.filter(
    (a) => a.status === 'Assigned' || a.status === 'Active' || a.status === 'Available'
  ).length;
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const approvedRequests = requests.filter((r) => r.status === 'Approved').length;
  const openIssues = requests.filter((r) => r.type === 'Issue' && r.status !== 'Completed' && r.status !== 'Rejected').length;

  const recentRequests = requests.slice(0, 5);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Approved':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      case 'In Progress':
        return 'bg-info text-dark';
      case 'Completed':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">User Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome back, <span className="fw-bold text-success">{profile?.name}</span> 👋
          </p>
        </div>
        <span className="badge bg-success fs-6 px-3 py-2">
          <i className="bi bi-building me-1"></i>
          {profile?.department?.name || 'Employee Portal'}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="row g-3 mb-4">
        {/* Total Assigned Assets */}
        <div className="col-md-4 col-lg">
          <div className="card shadow-sm border-0 bg-primary text-white h-100">
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Total Assigned Assets</p>
                <h3 className="fw-bold m-0">{totalAssignedAssets}</h3>
              </div>
              <i className="bi bi-laptop fs-1 opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Active Assets */}
        <div className="col-md-4 col-lg">
          <div className="card shadow-sm border-0 bg-success text-white h-100">
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Active Assets</p>
                <h3 className="fw-bold m-0">{activeAssets}</h3>
              </div>
              <i className="bi bi-check-circle fs-1 opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-md-4 col-lg">
          <div className="card shadow-sm border-0 bg-warning text-dark h-100">
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-dark-50 text-uppercase fw-bold small mb-1">Pending Requests</p>
                <h3 className="fw-bold m-0">{pendingRequests}</h3>
              </div>
              <i className="bi bi-hourglass-split fs-1 opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Approved Requests */}
        <div className="col-md-4 col-lg">
          <div className="card shadow-sm border-0 bg-info text-white h-100">
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Approved Requests</p>
                <h3 className="fw-bold m-0">{approvedRequests}</h3>
              </div>
              <i className="bi bi-hand-thumbs-up fs-1 opacity-50"></i>
            </div>
          </div>
        </div>

        {/* Open Issues */}
        <div className="col-md-4 col-lg">
          <div className="card shadow-sm border-0 bg-danger text-white h-100">
            <div className="card-body p-3 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Open Issues</p>
                <h3 className="fw-bold m-0">{openIssues}</h3>
              </div>
              <i className="bi bi-exclamation-triangle fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Quick Bar */}
      <div className="row mb-4">
        <div className="col-12 d-flex gap-2">
          <Link to="/employee/change-request" className="btn btn-success shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>
            New Change Request
          </Link>
          <Link to="/employee/report-issue" className="btn btn-outline-warning text-dark shadow-sm">
            <i className="bi bi-exclamation-octagon me-2"></i>
            Report Asset Issue
          </Link>
          <Link to="/employee/requests" className="btn btn-outline-secondary shadow-sm ms-auto">
            <i className="bi bi-list-task me-2"></i>
            View All Requests
          </Link>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h5 className="card-title m-0 fw-bold text-dark">
            <i className="bi bi-clock-history me-2 text-success"></i>
            Recent Requests
          </h5>
          <Link to="/employee/requests" className="btn btn-sm btn-outline-success">
            View All
          </Link>
        </div>
        <div className="card-body p-0">
          {recentRequests.length === 0 ? (
            <div className="p-4 text-center text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
              No recent requests submitted.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Request</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="fw-semibold text-dark">{req.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            req.type === 'Change Request'
                              ? 'bg-primary'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {req.type}
                        </span>
                      </td>
                      <td className="text-muted">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(req.status)} px-2 py-1`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
