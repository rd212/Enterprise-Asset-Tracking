import React from 'react';

const EmployeeDetails = ({ employee, assignedAssets = [], onClose }) => {
  if (!employee) return null;

  // Format Currency (Indian formatting)
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-dark text-white rounded-top-4 py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-lines-fill me-2 text-primary"></i>
              Employee Profile & Assigned Equipment
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Employee Basic Info Card */}
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle display-4 text-primary me-3"></i>
                    <div>
                      <h3 className="fw-bold text-dark m-0">{employee.name}</h3>
                      <p className="text-muted mb-0 fw-medium">{employee.position}</p>
                    </div>
                  </div>
                  <span className="badge bg-primary fs-6 px-3 py-2">
                    {employee.department?.name || 'Department'}
                  </span>
                </div>
              </div>

              {/* Contact Details */}
              <div className="col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                    <i className="bi bi-card-heading me-2"></i>
                    Contact Information
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className="text-muted">Email:</span>{' '}
                      <span className="fw-semibold text-dark">{employee.email}</span>
                    </li>
                    <li className="mb-0">
                      <span className="text-muted">Phone:</span>{' '}
                      <span className="fw-semibold text-dark">{employee.phone}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Department Details */}
              <div className="col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                    <i className="bi bi-building me-2"></i>
                    Organization Info
                  </h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <span className="text-muted">Department:</span>{' '}
                      <span className="badge bg-secondary ms-1">
                        {employee.department?.name || 'N/A'}
                      </span>
                    </li>
                    <li className="mb-0">
                      <span className="text-muted">Position:</span>{' '}
                      <span className="fw-semibold text-dark">{employee.position}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Assigned Assets List Section */}
              <div className="col-12">
                <div className="border rounded-3 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h6 className="text-primary fw-bold m-0">
                      <i className="bi bi-box-seam me-2"></i>
                      Assigned Equipment ({assignedAssets.length})
                    </h6>
                  </div>

                  {assignedAssets.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-inbox fs-2 d-block mb-1 opacity-50"></i>
                      No assets are currently assigned to this employee.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Asset Name</th>
                            <th>Code</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Status</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedAssets.map((asset) => (
                            <tr key={asset._id}>
                              <td className="fw-bold">{asset.assetName}</td>
                              <td>
                                <code>{asset.assetCode}</code>
                              </td>
                              <td>{asset.category}</td>
                              <td>{asset.brand}</td>
                              <td>
                                <span className="badge bg-primary">{asset.status}</span>
                              </td>
                              <td className="fw-semibold text-success">
                                {formatCurrency(asset.price)}
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

export default EmployeeDetails;
