import React from 'react';

const DepartmentDetails = ({ department, departmentEmployees = [], onClose }) => {
  if (!department) return null;

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
              <i className="bi bi-building me-2 text-primary"></i>
              Department Overview & Personnel
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Department Overview Banner */}
              <div className="col-12">
                <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-semibold text-uppercase d-block">
                      Department Name
                    </span>
                    <h3 className="fw-bold text-dark m-0">{department.name}</h3>
                  </div>
                  <span className="badge bg-primary fs-6 px-3 py-2">
                    {departmentEmployees.length} {departmentEmployees.length === 1 ? 'Employee' : 'Employees'}
                  </span>
                </div>
              </div>

              {/* Department Info */}
              <div className="col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <h6 className="text-primary fw-bold mb-2 border-bottom pb-2">
                    <i className="bi bi-card-text me-2"></i>
                    Description
                  </h6>
                  <p className="text-muted mb-0">
                    {department.description || 'No description specified for this department.'}
                  </p>
                </div>
              </div>

              {/* Created Date */}
              <div className="col-md-6">
                <div className="p-3 border rounded-3 h-100">
                  <h6 className="text-primary fw-bold mb-2 border-bottom pb-2">
                    <i className="bi bi-calendar-event me-2"></i>
                    Registration Details
                  </h6>
                  <p className="mb-0">
                    <span className="text-muted me-2">Created Date:</span>
                    <span className="fw-semibold text-dark">{formatDate(department.createdAt)}</span>
                  </p>
                </div>
              </div>

              {/* Personnel Table Section */}
              <div className="col-12">
                <div className="border rounded-3 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h6 className="text-primary fw-bold m-0">
                      <i className="bi bi-people me-2"></i>
                      Employees in this Department ({departmentEmployees.length})
                    </h6>
                  </div>

                  {departmentEmployees.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-person-x fs-2 d-block mb-1 opacity-50"></i>
                      No employees are assigned to this department.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Position</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departmentEmployees.map((emp) => (
                            <tr key={emp._id}>
                              <td className="fw-bold">{emp.name}</td>
                              <td className="text-muted">{emp.email}</td>
                              <td>{emp.phone}</td>
                              <td className="fw-medium">{emp.position}</td>
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

export default DepartmentDetails;
