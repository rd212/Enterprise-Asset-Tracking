import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/requests');
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedRequest) return;

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put(`/requests/${selectedRequest._id}/status`, {
        status: newStatus,
        adminComment
      });

      setSuccess(`Request status changed to ${newStatus} successfully.`);
      
      // Update state locally
      const updatedItem = res.data.data;
      setRequests((prev) =>
        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      setSelectedRequest(updatedItem);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status.');
    } finally {
      setActionLoading(false);
    }
  };

  const getFilteredRequests = () => {
    if (activeFilter === 'All') return requests;
    if (activeFilter === 'Change Request' || activeFilter === 'Issue') {
      return requests.filter((r) => r.type === activeFilter);
    }
    return requests.filter((r) => r.status === activeFilter);
  };

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

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-light text-dark border';
      case 'Medium':
        return 'bg-info text-dark';
      case 'High':
        return 'bg-warning text-dark';
      case 'Critical':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const filteredRequests = getFilteredRequests();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading All User Requests...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Request Management</h2>
          <p className="text-muted mb-0">Review, manage, approve or reject asset change requests and issues from employees.</p>
        </div>
        <span className="badge bg-primary fs-6 px-3 py-2">
          Total User Requests: {requests.length}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-2 overflow-auto">
          <div className="nav nav-pills flex-nowrap gap-1">
            {['All', 'Pending', 'Approved', 'In Progress', 'Completed', 'Rejected', 'Change Request', 'Issue'].map(
              (filter) => (
                <button
                  key={filter}
                  className={`nav-link text-nowrap py-1.5 px-3 btn-sm ${
                    activeFilter === filter ? 'active bg-primary' : 'text-dark'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Admin Request Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox display-4 d-block mb-2 text-secondary opacity-50"></i>
              <h5 className="fw-bold text-dark">No requests found</h5>
              <p className="mb-0">No employee requests match the selected filter category "{activeFilter}".</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Request Title</th>
                    <th>Type</th>
                    <th>Asset</th>
                    <th>Priority</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="fw-bold text-dark">
                        <i className="bi bi-person-circle me-1 text-primary"></i>
                        {req.user?.name || 'Unknown User'}
                        <small className="d-block text-muted fw-normal">
                          {req.user?.email}
                        </small>
                      </td>
                      <td className="fw-semibold">{req.title}</td>
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
                      <td>
                        {req.asset ? (
                          <span>
                            {req.asset.assetName}{' '}
                            <code className="small">({req.asset.assetCode})</code>
                          </span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getPriorityBadgeClass(req.priority)}`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="text-muted">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(req.status)} px-2.5 py-1.5 fs-6`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary fw-semibold"
                          onClick={() => {
                            setSelectedRequest(req);
                            setAdminComment(req.adminComment || '');
                            setSuccess('');
                            setError('');
                          }}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Admin Request Details & Action Modal */}
      {selectedRequest && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Admin Request Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3 mb-3 border-bottom pb-3">
                  <div className="col-md-6">
                    <small className="text-muted text-uppercase fw-bold d-block">Submitted By:</small>
                    <span className="fs-6 fw-bold text-dark">{selectedRequest.user?.name}</span>
                    <span className="d-block text-muted small">{selectedRequest.user?.email}</span>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted text-uppercase fw-bold d-block">Request Type:</small>
                    <span className="fs-6 fw-bold text-primary">{selectedRequest.type}</span>
                  </div>
                </div>

                <div className="mb-3 border-bottom pb-3">
                  <small className="text-muted text-uppercase fw-bold d-block">Title:</small>
                  <p className="m-0 fs-6 fw-bold text-dark">{selectedRequest.title}</p>
                </div>

                <div className="mb-3 border-bottom pb-3">
                  <small className="text-muted text-uppercase fw-bold d-block">Description:</small>
                  <p className="m-0 text-dark" style={{ whiteSpace: 'pre-line' }}>
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="row g-3 mb-3 border-bottom pb-3">
                  <div className="col-md-6">
                    <small className="text-muted text-uppercase fw-bold d-block">Related Asset:</small>
                    <span className="fw-semibold text-dark">
                      {selectedRequest.asset ? (
                        <>
                          {selectedRequest.asset.assetName} (Code: <code>{selectedRequest.asset.assetCode}</code>)
                        </>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>

                  <div className="col-md-3">
                    <small className="text-muted text-uppercase fw-bold d-block">Priority:</small>
                    <span className={`badge ${getPriorityBadgeClass(selectedRequest.priority)} fs-6`}>
                      {selectedRequest.priority}
                    </span>
                  </div>

                  <div className="col-md-3">
                    <small className="text-muted text-uppercase fw-bold d-block">Current Status:</small>
                    <span className={`badge ${getStatusBadgeClass(selectedRequest.status)} px-3 py-1.5 fs-6`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                {/* Admin Note Input */}
                <div className="mb-3">
                  <label className="form-label fw-bold small text-uppercase text-muted">
                    Admin Feedback / Notes (Optional):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter reason or instructions for employee..."
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-3 bg-light rounded border">
                  <small className="text-muted fw-bold d-block mb-2">Update Request Status:</small>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-success fw-bold flex-grow-1"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('Approved')}
                    >
                      <i className="bi bi-check-circle me-1"></i> Approve
                    </button>
                    <button
                      className="btn btn-danger fw-bold flex-grow-1"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('Rejected')}
                    >
                      <i className="bi bi-x-circle me-1"></i> Reject
                    </button>
                    <button
                      className="btn btn-warning fw-bold flex-grow-1 text-dark"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('In Progress')}
                    >
                      <i className="bi bi-hourglass-split me-1"></i> In Progress
                    </button>
                    <button
                      className="btn btn-secondary fw-bold flex-grow-1"
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate('Completed')}
                    >
                      <i className="bi bi-check2-all me-1"></i> Completed
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
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

export default Requests;
