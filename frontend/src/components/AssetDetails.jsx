import React from 'react';

const AssetDetails = ({ asset, onClose }) => {
  if (!asset) return null;

  // Format Currency (Indian formatting)
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-dark text-white rounded-top-4 py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-info-circle me-2 text-primary"></i>
              Asset Specification Details
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Top Overview Banner */}
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase d-block">
                      {asset.category}
                    </span>
                    <h3 className="fw-bold text-dark m-0">{asset.assetName}</h3>
                  </div>
                  <div>
                    <span
                      className={`badge fs-6 px-3 py-2 ${
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
                  </div>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                    <i className="bi bi-sliders me-2"></i>
                    Asset Specs
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className="text-muted">Asset Code:</span>{' '}
                      <code className="fs-6 ms-1">{asset.assetCode}</code>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted">Brand:</span>{' '}
                      <span className="fw-semibold text-dark">{asset.brand}</span>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted">Price:</span>{' '}
                      <span className="fw-bold text-success">
                        {formatCurrency(asset.price)}
                      </span>
                    </li>
                    <li className="mb-0">
                      <span className="text-muted">Purchase Date:</span>{' '}
                      <span className="fw-medium">{formatDate(asset.purchaseDate)}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                    <i className="bi bi-person-badge me-2"></i>
                    Assignment Details
                  </h6>
                  {asset.assignedTo ? (
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-person-circle fs-3 text-secondary me-2"></i>
                        <div>
                          <h6 className="fw-bold m-0">{asset.assignedTo.name}</h6>
                          <small className="text-muted">{asset.assignedTo.email}</small>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="badge bg-secondary">
                          Department: {asset.assignedTo.department?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 text-center text-muted">
                      <i className="bi bi-dash-circle display-6 d-block mb-1 opacity-50"></i>
                      Currently Unassigned
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="col-12">
                <div className="p-3 border rounded-3">
                  <h6 className="text-primary fw-bold mb-2">
                    <i className="bi bi-card-text me-2"></i>
                    Notes & Description
                  </h6>
                  <p className="text-muted mb-0">
                    {asset.description || 'No additional description provided for this asset.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light rounded-bottom-4 py-3">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
