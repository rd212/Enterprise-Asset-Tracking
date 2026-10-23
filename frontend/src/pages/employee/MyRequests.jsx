import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/requests/my');
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your requests.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    if (activeFilter === 'All') return requests;
    if (activeFilter === 'Change Requests') return requests.filter((r) => r.type === 'Change Request');
    if (activeFilter === 'Issues') return requests.filter((r) => r.type === 'Issue');
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
        <div className="spinner-border text-success me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading My Requests...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Requests</h2>
          <p className="text-muted mb-0">Track status and administrative updates for your submitted requests and issues.</p>
        </div>
        <span className="badge bg-success fs-6 px-3 py-2">
          Total Requests: {requests.length}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-2 overflow-auto">
          <div className="nav nav-pills flex-nowrap gap-1">
            {['All', 'Change Requests', 'Issues', 'Pending', 'Approved', 'In Progress', 'Completed', 'Rejected'].map(
              (filter) => (
                <button
                  key={filter}
                  className={`nav-link text-nowrap py-1.5 px-3 btn-sm ${
                    activeFilter === filter ? 'active bg-success' : 'text-dark'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                  {filter === 'All' && ` (${requests.length})`}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Table List */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox display-4 d-block mb-2 text-secondary opacity-50"></i>
              <h5 className="fw-bold text-dark">No requests found</h5>
              <p className="mb-0">No records match the selected filter category "{activeFilter}".</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
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
                      <td className="fw-bold text-dark">{req.title}</td>
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
                            <i className="bi bi-laptop me-1 text-secondary"></i>
                            {req.asset.assetName}{' '}
                            <code className="small">({req.asset.assetCode})</code>
                          </span>
                        ) : (
                          <span className="text-muted fst-italic">N/A</span>
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
                          className="btn btn-sm btn-outline-success fw-semibold"
                          onClick={() => setSelectedRequest(req)}
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-file-text me-2"></i>
                  Request Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3 border-bottom pb-2">
                  <small className="text-muted text-uppercase fw-bold">Request Type:</small>
                  <p className="m-0 fs-5 fw-bold text-success">{selectedRequest.type}</p>
                </div>

                <div className="mb-3 border-bottom pb-2">
                  <small className="text-muted text-uppercase fw-bold">Title:</small>
                  <p className="m-0 fs-6 fw-semibold text-dark">{selectedRequest.title}</p>
                </div>

                <div className="mb-3 border-bottom pb-2">
                  <small className="text-muted text-uppercase fw-bold">Description:</small>
                  <p className="m-0 text-dark" style={{ whiteSpace: 'pre-line' }}>
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="mb-3 border-bottom pb-2">
                  <small className="text-muted text-uppercase fw-bold">Related Asset:</small>
                  <p className="m-0 text-dark fw-medium">
                    {selectedRequest.asset ? (
                      <>
                        {selectedRequest.asset.assetName} (Code:{' '}
                        <code>{selectedRequest.asset.assetCode}</code>, Brand:{' '}
                        {selectedRequest.asset.brand})
                      </>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>

                <div className="row mb-3 border-bottom pb-2">
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold d-block">Priority:</small>
                    <span className={`badge ${getPriorityBadgeClass(selectedRequest.priority)}`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                  <div className="col-6">
                    <small className="text-muted text-uppercase fw-bold d-block">Submitted:</small>
                    <span className="text-dark fw-medium">
                      {selectedRequest.createdAt
                        ? new Date(selectedRequest.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <small className="text-muted text-uppercase fw-bold d-block mb-1">Status:</small>
                  <span className={`badge ${getStatusBadgeClass(selectedRequest.status)} px-3 py-2 fs-6`}>
                    {selectedRequest.status}
                  </span>
                </div>

                {selectedRequest.adminComment && (
                  <div className="mt-3 p-3 bg-light rounded border border-secondary">
                    <small className="text-muted fw-bold d-block">Admin Comments:</small>
                    <p className="m-0 text-dark small">{selectedRequest.adminComment}</p>
                  </div>
                )}
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

export default MyRequests;
