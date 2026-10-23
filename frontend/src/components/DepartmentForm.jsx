import React, { useState, useEffect } from 'react';

const DepartmentForm = ({
  mode = 'add',
  initialData = null,
  onSave,
  onClose,
  loading = false,
  errorMessage = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
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

    // Client-side validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setValidationError('Department Name is required and must be at least 2 characters.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    onSave(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white rounded-top-4 py-3">
            <h5 className="modal-title fw-bold">
              <i className={`bi ${mode === 'add' ? 'bi-building-add' : 'bi-pencil-square'} me-2`}></i>
              {mode === 'add' ? 'Add New Department' : 'Edit Department'}
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

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Department Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. IT, HR, Finance"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional summary of department responsibilities..."
                ></textarea>
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
                    {mode === 'add' ? 'Create Department' : 'Save Changes'}
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

export default DepartmentForm;
