import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import EmployeeForm from '../../components/EmployeeForm';
import EmployeeDetails from '../../components/EmployeeDetails';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Modal control state
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Details Modal
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState(null);

  // Delete Modal
  const [selectedEmployeeForDelete, setSelectedEmployeeForDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch Employees, Departments, and Assets from API
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, deptsRes, assetsRes] = await Promise.all([
        api.get('/users'),
        api.get('/departments'),
        api.get('/assets')
      ]);
      setEmployees(usersRes.data.data || []);
      setDepartments(deptsRes.data.data || []);
      setAssets(assetsRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load employees data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map employee IDs to assigned assets list
  const employeeAssetsMap = useMemo(() => {
    const map = {};
    assets.forEach((asset) => {
      if (asset.assignedTo) {
        const empId = typeof asset.assignedTo === 'object' ? asset.assignedTo._id : asset.assignedTo;
        if (empId) {
          if (!map[empId]) map[empId] = [];
          map[empId].push(asset);
        }
      }
    });
    return map;
  }, [assets]);

  // Calculate live statistics
  const stats = useMemo(() => {
    const total = employees.length;
    let withAssets = 0;
    let withoutAssets = 0;

    employees.forEach((emp) => {
      const count = (employeeAssetsMap[emp._id] || []).length;
      if (count > 0) withAssets++;
      else withoutAssets++;
    });

    return { total, withAssets, withoutAssets };
  }, [employees, employeeAssetsMap]);

  // Combined Search & Department Filter Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (emp.name && emp.name.toLowerCase().includes(query)) ||
        (emp.email && emp.email.toLowerCase().includes(query)) ||
        (emp.phone && emp.phone.toLowerCase().includes(query)) ||
        (emp.position && emp.position.toLowerCase().includes(query));

      // 2. Department Filter
      const deptId = emp.department ? (typeof emp.department === 'object' ? emp.department._id : emp.department) : '';
      const matchesDepartment =
        selectedDepartment === 'All' || deptId === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchQuery, selectedDepartment]);

  // Clear Filters Handler
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
  };

  // Trigger Add Employee Modal
  const handleOpenAddModal = () => {
    setSelectedEmployeeForEdit(null);
    setFormMode('add');
    setFormError('');
    setShowFormModal(true);
  };

  // Trigger Edit Employee Modal
  const handleOpenEditModal = (emp) => {
    setSelectedEmployeeForEdit(emp);
    setFormMode('edit');
    setFormError('');
    setShowFormModal(true);
  };

  // Save Employee Handler (Create or Update)
  const handleSaveEmployee = async (formData) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      if (formMode === 'add') {
        await api.post('/users', formData);
        setSuccessMessage('Employee created successfully.');
      } else {
        await api.put(`/users/${selectedEmployeeForEdit._id}`, formData);
        setSuccessMessage('Employee updated successfully.');
      }

      setShowFormModal(false);
      await fetchData(); // Refresh data
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      if (msg.includes('duplicate') || msg.includes('email')) {
        setFormError('An employee with this email already exists.');
      } else {
        setFormError(msg);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Employee Handler
  const handleDeleteEmployee = async () => {
    if (!selectedEmployeeForDelete) return;

    setDeleteLoading(true);
    setDeleteError('');
    setSuccessMessage('');
    try {
      await api.delete(`/users/${selectedEmployeeForDelete._id}`);
      setSuccessMessage('Employee deleted successfully.');
      setSelectedEmployeeForDelete(null);
      await fetchData();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          'Cannot delete employee because assets are assigned to this employee.'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Employees</h2>
          <p className="text-muted mb-0">Manage employees and their assigned assets</p>
        </div>
        <button className="btn btn-primary fw-bold px-3 py-2" onClick={handleOpenAddModal}>
          <i className="bi bi-person-plus-fill me-2"></i>
          Add Employee
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <strong>Success!</strong> {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage('')}
          ></button>
        </div>
      )}

      {/* Global Error Alert */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchData}>
            Try Again
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-primary h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Total Employees</span>
              <h3 className="fw-bold text-dark m-0">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-success h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Employees with Assets</span>
              <h3 className="fw-bold text-success m-0">{stats.withAssets}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-secondary h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Employees without Assets</span>
              <h3 className="fw-bold text-secondary m-0">{stats.withoutAssets}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="card border-0 shadow-sm mb-4 p-3 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name, email, phone, position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100 fw-semibold"
              onClick={handleClearFilters}
              disabled={searchQuery === '' && selectedDepartment === 'All'}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Employee Table Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary me-2" role="status"></div>
              <span className="fw-semibold text-secondary">Loading employees...</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-3 text-secondary opacity-50 mb-3 d-block"></i>
              <h5 className="fw-bold text-dark">No employees found</h5>
              <p className="text-muted mb-3">
                {employees.length === 0
                  ? 'Get started by registering your first employee.'
                  : 'No employees match your search or filter criteria.'}
              </p>
              {employees.length === 0 ? (
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                  <i className="bi bi-person-plus-fill me-1"></i> Add Employee
                </button>
              ) : (
                <button className="btn btn-outline-secondary" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Assigned Assets</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => {
                    const assignedCount = (employeeAssetsMap[emp._id] || []).length;
                    return (
                      <tr key={emp._id}>
                        <td className="fw-bold text-dark">{emp.name}</td>
                        <td className="text-muted">{emp.email}</td>
                        <td>{emp.phone}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {emp.department?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="fw-medium">{emp.position}</td>
                        <td>
                          <span
                            className={`badge fs-6 ${
                              assignedCount > 0 ? 'bg-primary' : 'bg-light text-dark border'
                            }`}
                          >
                            {assignedCount} {assignedCount === 1 ? 'Asset' : 'Assets'}
                          </span>
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-secondary"
                              title="View Employee Profile & Equipment"
                              onClick={() => setSelectedEmployeeForView(emp)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              title="Edit Employee"
                              onClick={() => handleOpenEditModal(emp)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              title="Delete Employee"
                              onClick={() => {
                                setSelectedEmployeeForDelete(emp);
                                setDeleteError('');
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {showFormModal && (
        <EmployeeForm
          mode={formMode}
          initialData={selectedEmployeeForEdit}
          departments={departments}
          onSave={handleSaveEmployee}
          onClose={() => setShowFormModal(false)}
          loading={formLoading}
          errorMessage={formError}
        />
      )}

      {/* View Employee Details Modal */}
      {selectedEmployeeForView && (
        <EmployeeDetails
          employee={selectedEmployeeForView}
          assignedAssets={employeeAssetsMap[selectedEmployeeForView._id] || []}
          onClose={() => setSelectedEmployeeForView(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedEmployeeForDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white rounded-top-4 py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Delete Employee Confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedEmployeeForDelete(null)}
                  disabled={deleteLoading}
                ></button>
              </div>

              <div className="modal-body p-4 text-center">
                {deleteError && (
                  <div className="alert alert-danger d-flex align-items-center mb-3 text-start" role="alert">
                    <i className="bi bi-shield-x me-2 fs-4"></i>
                    <div>{deleteError}</div>
                  </div>
                )}

                <p className="fs-5 text-dark mb-2">
                  Are you sure you want to delete employee{' '}
                  <strong className="text-danger">{selectedEmployeeForDelete.name}</strong>?
                </p>
                <p className="text-muted small mb-0">
                  Email: <code>{selectedEmployeeForDelete.email}</code>.
                </p>
              </div>

              <div className="modal-footer bg-light rounded-bottom-4 py-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedEmployeeForDelete(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={handleDeleteEmployee}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-1"></i>
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
