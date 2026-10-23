import React, { useState, useEffect } from 'react';

const EmployeeForm = ({
  mode = 'add',
  initialData = null,
  departments = [],
  onSave,
  onClose,
  loading = false,
  errorMessage = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    password: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department
          ? typeof initialData.department === 'object'
            ? initialData.department._id
            : initialData.department
          : '',
        position: initialData.position || '',
        password: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        password: ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValidationError('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.name.trim()) {
      setValidationError('Employee Name is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (!formData.phone.trim()) {
      setValidationError('Phone Number is required.');
      return;
    }

    if (!formData.department) {
      setValidationError('Department selection is required.');
      return;
    }

    if (!formData.position.trim()) {
      setValidationError('Job Position is required.');
      return;
    }

    if (mode === 'add') {
      if (!formData.password || formData.password.length < 6) {
        setValidationError('Password is required and must be at least 6 characters.');
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      department: formData.department,
      position: formData.position.trim()
    };

    if (mode === 'add' && formData.password) {
      payload.password = formData.password;
    }

    onSave(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white rounded-top-4 py-3">
            <h5 className="modal-title fw-bold">
              <i className={`bi ${mode === 'add' ? 'bi-person-plus-fill' : 'bi-pencil-square'} me-2`}></i>
              {mode === 'add' ? 'Add New Employee' : 'Edit Employee Details'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {(validationError || errorMessage) && (
                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                  <div>{validationError || errorMessage}</div>
                </div>
              )}

              <div className="row g-3">
                {/* Full Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Patel"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@gmail.com"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    required
                  />
                </div>

                {/* Department */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Position <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="e.g. Software Developer"
                    required
                  />
                </div>

                {/* Password (Add Mode Only) */}
                {mode === 'add' && (
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Account Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      required
                    />
                    <small className="text-muted">Password used for employee login.</small>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer bg-light rounded-bottom-4 py-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary fw-bold" disabled={loading}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {mode === 'add' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    {mode === 'add' ? 'Create Employee' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
