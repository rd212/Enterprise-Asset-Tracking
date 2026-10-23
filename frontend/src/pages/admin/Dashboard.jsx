import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    maintenanceAssets: 0,
    retiredAssets: 0,
    totalEmployees: 0,
    totalDepartments: 0
  });
  const [recentAssets, setRecentAssets] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [assetsRes, usersRes, deptsRes] = await Promise.all([
          api.get('/assets'),
          api.get('/users'),
          api.get('/departments')
        ]);

        const assets = assetsRes.data.data || [];
        const users = usersRes.data.data || [];
        const depts = deptsRes.data.data || [];

        const available = assets.filter((a) => a.status === 'Available').length;
        const assigned = assets.filter((a) => a.status === 'Assigned').length;
        const maintenance = assets.filter((a) => a.status === 'Under Maintenance').length;
        const retired = assets.filter((a) => a.status === 'Retired').length;

        setStats({
          totalAssets: assets.length,
          availableAssets: available,
          assignedAssets: assigned,
          maintenanceAssets: maintenance,
          retiredAssets: retired,
          totalEmployees: users.length,
          totalDepartments: depts.length
        });

        // Set top 5 recent assets
        setRecentAssets(assets.slice(-5).reverse());
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading Dashboard Metrics...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome back, <span className="fw-semibold text-primary">Administrator</span> 👋
          </p>
        </div>
        <span className="badge bg-success fs-6 px-3 py-2">System Active</span>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white h-100">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Total Assets</p>
                <h2 className="display-5 fw-bold m-0">{stats.totalAssets}</h2>
              </div>
              <i className="bi bi-laptop display-4 opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success text-white h-100">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Total Employees</p>
                <h2 className="display-5 fw-bold m-0">{stats.totalEmployees}</h2>
              </div>
              <i className="bi bi-people display-4 opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-dark text-white h-100">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="text-white-50 text-uppercase fw-bold small mb-1">Departments</p>
                <h2 className="display-5 fw-bold m-0">{stats.totalDepartments}</h2>
              </div>
              <i className="bi bi-building display-4 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Status Breakdown Grid */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-success">
            <div className="card-body">
              <span className="text-muted fw-semibold small">Available</span>
              <h3 className="fw-bold text-success mt-1 mb-0">{stats.availableAssets}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-primary">
            <div className="card-body">
              <span className="text-muted fw-semibold small">Assigned</span>
              <h3 className="fw-bold text-primary mt-1 mb-0">{stats.assignedAssets}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-warning">
            <div className="card-body">
              <span className="text-muted fw-semibold small">Under Maintenance</span>
              <h3 className="fw-bold text-warning mt-1 mb-0">{stats.maintenanceAssets}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-secondary">
            <div className="card-body">
              <span className="text-muted fw-semibold small">Retired</span>
              <h3 className="fw-bold text-secondary mt-1 mb-0">{stats.retiredAssets}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assets Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="card-title m-0 fw-bold text-dark">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Recent Assets Overview
          </h5>
        </div>
        <div className="card-body p-0">
          {recentAssets.length === 0 ? (
            <div className="text-center py-4 text-muted">No assets found in system.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Asset Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Assigned Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td className="fw-semibold">{asset.assetName}</td>
                      <td><code>{asset.assetCode}</code></td>
                      <td>{asset.category}</td>
                      <td>
                        <span
                          className={`badge ${
                            asset.status === 'Available'
                              ? 'bg-success'
                              : asset.status === 'Assigned'
                              ? 'bg-primary'
                              : asset.status === 'Under Maintenance'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary'
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        {asset.assignedTo ? (
                          <span className="text-dark fw-medium">
                            <i className="bi bi-person-fill me-1 text-secondary"></i>
                            {asset.assignedTo.name}
                          </span>
                        ) : (
                          <span className="text-muted fst-italic">Unassigned</span>
                        )}
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

export default AdminDashboard;
