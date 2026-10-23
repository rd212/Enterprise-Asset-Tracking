import React, { useState, useEffect } from 'react';

const AssetForm = ({
  mode = 'add',
  initialData = null,
  employees = [],
  onSave,
  onClose,
  loading = false,
  errorMessage = ''
}) => {
  const [formData, setFormData] = useState({
    assetName: '',
    assetCode: '',
    category: 'Laptop',
    brand: '',
    purchaseDate: '',
    price: '',
    status: 'Available',
    assignedTo: '',
    description: ''
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // Format date for <input type="date" /> (YYYY-MM-DD)
      let formattedDate = '';
      if (initialData.purchaseDate) {
        formattedDate = new Date(initialData.purchaseDate).toISOString().split('T')[0];
      }

      setFormData({
        assetName: initialData.assetName || '',
        assetCode: initialData.assetCode || '',
        category: initialData.category || 'Laptop',
        brand: initialData.brand || '',
        purchaseDate: formattedDate,
        price: initialData.price !== undefined ? initialData.price : '',
        status: initialData.status || 'Available',
        assignedTo: initialData.assignedTo
          ? typeof initialData.assignedTo === 'object'
            ? initialData.assignedTo._id
            : initialData.assignedTo
          : '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        assetName: '',
        assetCode: '',
        category: 'Laptop',
        brand: '',
        purchaseDate: '',
        price: '',
        status: 'Available',
        assignedTo: '',
        description: ''
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValidationError('');

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Synchronization Rule:
      // If employee is selected, set status to Assigned if currently Available
      if (name === 'assignedTo' && value !== '') {
        if (prev.status === 'Available') {
          updated.status = 'Assigned';
        }
      }

      // If assignedTo cleared (Unassigned), set status to Available if currently Assigned
      if (name === 'assignedTo' && value === '') {
        if (prev.status === 'Assigned') {
          updated.status = 'Available';
        }
      }

      // If status changed to Available/Under Maintenance/Retired, clear assignedTo
      if (name === 'status' && value !== 'Assigned') {
        updated.assignedTo = '';
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.assetName.trim()) {
      setValidationError('Asset Name is required.');
      return;
    }
    if (!formData.assetCode.trim()) {
      setValidationError('Asset Code is required.');
      return;
    }
    if (!formData.category) {
      setValidationError('Category is required.');
      return;
    }
    if (!formData.brand.trim()) {
      setValidationError('Brand is required.');
      return;
    }
    if (formData.price === '' || Number(formData.price) < 0) {
      setValidationError('Price cannot be negative or empty.');
      return;
    }

    const payload = {
      ...formData,
      assetName: formData.assetName.trim(),
      assetCode: formData.assetCode.trim(),
      brand: formData.brand.trim(),
      price: Number(formData.price),
      assignedTo: formData.assignedTo || null,
      purchaseDate: formData.purchaseDate || undefined
    };

    onSave(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white rounded-top-4 py-3">
            <h5 className="modal-title fw-bold">
              <i className={`bi ${mode === 'add' ? 'bi-plus-circle' : 'bi-pencil-square'} me-2`}></i>
              {mode === 'add' ? 'Add New Asset' : 'Edit Asset Specifications'}
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
                {/* Asset Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Asset Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleChange}
                    placeholder="e.g. Dell XPS 15"
                    required
                  />
                </div>

                {/* Asset Code */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Asset Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="assetCode"
                    value={formData.assetCode}
                    onChange={handleChange}
                    placeholder="e.g. AST-001"
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Printer">Printer</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Brand <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Dell, Apple, HP"
                    required
                  />
                </div>

                {/* Price */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Price (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 75000"
                    required
                  />
                </div>

                {/* Purchase Date */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Purchase Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>

                {/* Assigned Employee */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Assigned Employee</label>
                  <select
                    className="form-select"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                  >
                    <option value="">Unassigned</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} {emp.department ? `— ${emp.department.name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Description / Notes</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Optional details or specifications..."
                  ></textarea>
                </div>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    {mode === 'add' ? 'Create Asset' : 'Save Changes'}
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

export default AssetForm;
