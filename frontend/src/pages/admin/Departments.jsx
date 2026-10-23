import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import DepartmentForm from '../../components/DepartmentForm';
import DepartmentDetails from '../../components/DepartmentDetails';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal control state
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedDeptForEdit, setSelectedDeptForEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Details Modal
  const [selectedDeptForView, setSelectedDeptForView] = useState(null);

  // Delete Modal
  const [selectedDeptForDelete, setSelectedDeptForDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch Departments and Employees from API
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [deptsRes, usersRes] = await Promise.all([
        api.get('/departments'),
        api.get('/users')
      ]);
      setDepartments(deptsRes.data.data || []);
      setEmployees(usersRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load departments data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Map department IDs to employee lists
  const departmentEmployeesMap = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      if (emp.department) {
        const deptId = typeof emp.department === 'object' ? emp.department._id : emp.department;
        if (deptId) {
          if (!map[deptId]) map[deptId] = [];
          map[deptId].push(emp);
        }
      }
    });
    return map;
  }, [employees]);

  // Calculate live statistics
  const stats = useMemo(() => {
    const total = departments.length;
    let withEmployees = 0;
    let withoutEmployees = 0;

    departments.forEach((dept) => {
      const count = (departmentEmployeesMap[dept._id] || []).length;
      if (count > 0) withEmployees++;
      else withoutEmployees++;
    });

    return { total, withEmployees, withoutEmployees };
  }, [departments, departmentEmployeesMap]);

  // Search Filtering Logic
  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return departments;
    return departments.filter(
      (dept) =>
        (dept.name && dept.name.toLowerCase().includes(query)) ||
        (dept.description && dept.description.toLowerCase().includes(query))
    );
  }, [departments, searchQuery]);

  // Clear Search Handler
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Trigger Add Department Modal
  const handleOpenAddModal = () => {
    setSelectedDeptForEdit(null);
    setFormMode('add');
    setFormError('');
    setShowFormModal(true);
  };

  // Trigger Edit Department Modal
  const handleOpenEditModal = (dept) => {
    setSelectedDeptForEdit(dept);
    setFormMode('edit');
    setFormError('');
    setShowFormModal(true);
  };

  // Save Department Handler (Create or Update)
  const handleSaveDepartment = async (formData) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      if (formMode === 'add') {
        await api.post('/departments', formData);
        setSuccessMessage('Department created successfully.');
      } else {
        await api.put(`/departments/${selectedDeptForEdit._id}`, formData);
        setSuccessMessage('Department updated successfully.');
      }

      setShowFormModal(false);
      await fetchData(); // Refresh data
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      if (msg.includes('duplicate') || msg.includes('name')) {
        setFormError('A department with this name already exists.');
      } else {
        setFormError(msg);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Department Handler
  const handleDeleteDepartment = async () => {
    if (!selectedDeptForDelete) return;

    setDeleteLoading(true);
    setDeleteError('');
    setSuccessMessage('');
    try {
      await api.delete(`/departments/${selectedDeptForDelete._id}`);
      setSuccessMessage('Department deleted successfully.');
      setSelectedDeptForDelete(null);
      await fetchData();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message ||
          'Cannot delete department because employees are assigned to this department.'
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
          <h2 className="fw-bold text-dark mb-1">Departments</h2>
          <p className="text-muted mb-0">Manage company departments and employees</p>
        </div>
        <button className="btn btn-primary fw-bold px-3 py-2" onClick={handleOpenAddModal}>
          <i className="bi bi-building-add me-2"></i>
          Add Department
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
              <span className="text-muted fw-semibold small text-uppercase">Total Departments</span>
              <h3 className="fw-bold text-dark m-0">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-success h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Departments with Employees</span>
              <h3 className="fw-bold text-success m-0">{stats.withEmployees}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-secondary h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Departments without Employees</span>
              <h3 className="fw-bold text-secondary m-0">{stats.withoutEmployees}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4 p-3 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-9">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search departments by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-outline-secondary w-100 fw-semibold"
              onClick={handleClearSearch}
              disabled={searchQuery === ''}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Department Table Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary me-2" role="status"></div>
              <span className="fw-semibold text-secondary">Loading departments...</span>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-building display-3 text-secondary opacity-50 mb-3 d-block"></i>
              <h5 className="fw-bold text-dark">No departments found</h5>
              <p className="text-muted mb-3">
                {departments.length === 0
                  ? 'Get started by creating your first department.'
                  : 'No departments match your search.'}
              </p>
              {departments.length === 0 ? (
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                  <i className="bi bi-building-add me-1"></i> Add Department
                </button>
              ) : (
                <button className="btn btn-outline-secondary" onClick={handleClearSearch}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Department</th>
                    <th>Description</th>
                    <th>Employees</th>
                    <th>Created Date</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.map((dept) => {
                    const empCount = (departmentEmployeesMap[dept._id] || []).length;
                    return (
                      <tr key={dept._id}>
                        <td className="fw-bold text-dark">{dept.name}</td>
                        <td className="text-muted small">
                          {dept.description || 'No description provided'}
                        </td>
                        <td>
                          <span
                            className={`badge fs-6 ${
                              empCount > 0 ? 'bg-primary' : 'bg-light text-dark border'
                            }`}
                          >
                            {empCount} {empCount === 1 ? 'Employee' : 'Employees'}
                          </span>
                        </td>
                        <td className="fw-medium">{formatDate(dept.createdAt)}</td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-secondary"
                              title="View Department Details & Personnel"
                              onClick={() => setSelectedDeptForView(dept)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              title="Edit Department"
                              onClick={() => handleOpenEditModal(dept)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              title="Delete Department"
                              onClick={() => {
                                setSelectedDeptForDelete(dept);
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

      {/* Add / Edit Department Modal */}
      {showFormModal && (
        <DepartmentForm
          mode={formMode}
          initialData={selectedDeptForEdit}
          onSave={handleSaveDepartment}
          onClose={() => setShowFormModal(false)}
          loading={formLoading}
          errorMessage={formError}
        />
      )}

      {/* View Department Details Modal */}
      {selectedDeptForView && (
        <DepartmentDetails
          department={selectedDeptForView}
          departmentEmployees={departmentEmployeesMap[selectedDeptForView._id] || []}
          onClose={() => setSelectedDeptForView(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedDeptForDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white rounded-top-4 py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Delete Department Confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedDeptForDelete(null)}
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
                  Are you sure you want to delete department{' '}
                  <strong className="text-danger">{selectedDeptForDelete.name}</strong>?
                </p>
                <p className="text-muted small mb-0">
                  This action cannot be undone.
                </p>
              </div>

              <div className="modal-footer bg-light rounded-bottom-4 py-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedDeptForDelete(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={handleDeleteDepartment}
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

export default Departments;
