import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import AssetForm from '../../components/AssetForm';
import AssetDetails from '../../components/AssetDetails';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal control state
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Details Modal
  const [selectedAssetForView, setSelectedAssetForView] = useState(null);

  // Delete Modal
  const [selectedAssetForDelete, setSelectedAssetForDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Assets and Employees from API
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [assetsRes, employeesRes] = await Promise.all([
        api.get('/assets'),
        api.get('/users')
      ]);
      setAssets(assetsRes.data.data || []);
      setEmployees(employeesRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load assets data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Currency (Indian formatting)
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Calculate live statistics
  const stats = useMemo(() => {
    const total = assets.length;
    const available = assets.filter((a) => a.status === 'Available').length;
    const assigned = assets.filter((a) => a.status === 'Assigned').length;
    const maintenance = assets.filter((a) => a.status === 'Under Maintenance').length;
    const retired = assets.filter((a) => a.status === 'Retired').length;
    return { total, available, assigned, maintenance, retired };
  }, [assets]);

  // Combined Search & Multi-Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (asset.assetName && asset.assetName.toLowerCase().includes(query)) ||
        (asset.assetCode && asset.assetCode.toLowerCase().includes(query)) ||
        (asset.brand && asset.brand.toLowerCase().includes(query));

      // 2. Category Filter
      const matchesCategory =
        selectedCategory === 'All' || asset.category === selectedCategory;

      // 3. Status Filter
      const matchesStatus =
        selectedStatus === 'All' || asset.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  // Clear Filters Handler
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  // Trigger Add Asset Modal
  const handleOpenAddModal = () => {
    setSelectedAssetForEdit(null);
    setFormMode('add');
    setFormError('');
    setShowFormModal(true);
  };

  // Trigger Edit Asset Modal
  const handleOpenEditModal = (asset) => {
    setSelectedAssetForEdit(asset);
    setFormMode('edit');
    setFormError('');
    setShowFormModal(true);
  };

  // Save Asset Handler (Create or Update)
  const handleSaveAsset = async (formData) => {
    setFormLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      if (formMode === 'add') {
        await api.post('/assets', formData);
        setSuccessMessage('Asset created successfully.');
      } else {
        await api.put(`/assets/${selectedAssetForEdit._id}`, formData);
        setSuccessMessage('Asset updated successfully.');
      }

      setShowFormModal(false);
      await fetchData(); // Refresh data
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed.';
      if (msg.includes('duplicate') || msg.includes('assetCode')) {
        setFormError('Asset code already exists.');
      } else {
        setFormError(msg);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Asset Handler
  const handleDeleteAsset = async () => {
    if (!selectedAssetForDelete) return;

    setDeleteLoading(true);
    setSuccessMessage('');
    try {
      await api.delete(`/assets/${selectedAssetForDelete._id}`);
      setSuccessMessage('Asset deleted successfully.');
      setSelectedAssetForDelete(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete asset.');
      setSelectedAssetForDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">Assets</h2>
          <p className="text-muted mb-0">Manage and track company assets</p>
        </div>
        <button className="btn btn-primary fw-bold px-3 py-2" onClick={handleOpenAddModal}>
          <i className="bi bi-plus-lg me-2"></i>
          Add Asset
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

      {/* Live Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-dark h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Total Assets</span>
              <h3 className="fw-bold text-dark m-0">{stats.total}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-success h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Available</span>
              <h3 className="fw-bold text-success m-0">{stats.available}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-primary h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Assigned</span>
              <h3 className="fw-bold text-primary m-0">{stats.assigned}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-warning h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Under Maintenance</span>
              <h3 className="fw-bold text-warning m-0">{stats.maintenance}</h3>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm bg-white border-start border-4 border-secondary h-100">
            <div className="card-body py-3">
              <span className="text-muted fw-semibold small text-uppercase">Retired</span>
              <h3 className="fw-bold text-secondary m-0">{stats.retired}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="card border-0 shadow-sm mb-4 p-3 bg-white">
        <div className="row g-3 align-items-center">
          {/* Search Box */}
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name, code, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Printer">Printer</option>
              <option value="Monitor">Monitor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100 fw-semibold"
              onClick={handleClearFilters}
              disabled={searchQuery === '' && selectedCategory === 'All' && selectedStatus === 'All'}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Asset Table Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary me-2" role="status"></div>
              <span className="fw-semibold text-secondary">Loading assets...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-3 text-secondary opacity-50 mb-3 d-block"></i>
              <h5 className="fw-bold text-dark">No assets found</h5>
              <p className="text-muted mb-3">
                {assets.length === 0
                  ? 'Get started by creating your first company asset.'
                  : 'No assets match your search or filter criteria.'}
              </p>
              {assets.length === 0 ? (
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                  <i className="bi bi-plus-lg me-1"></i> Add Asset
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
                    <th>Asset Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td className="fw-bold text-dark">{asset.assetName}</td>
                      <td>
                        <code>{asset.assetCode}</code>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {asset.category}
                        </span>
                      </td>
                      <td className="fw-medium">{asset.brand}</td>
                      <td className="fw-semibold text-success">
                        {formatCurrency(asset.price)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
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
                      </td>
                      <td>
                        {asset.assignedTo ? (
                          <span className="text-dark fw-medium">
                            <i className="bi bi-person-fill me-1 text-primary"></i>
                            {asset.assignedTo.name}
                          </span>
                        ) : (
                          <span className="text-muted fst-italic">Unassigned</span>
                        )}
                      </td>
                      <td className="text-end pe-3">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-secondary"
                            title="View Asset Details"
                            onClick={() => setSelectedAssetForView(asset)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            title="Edit Asset"
                            onClick={() => handleOpenEditModal(asset)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete Asset"
                            onClick={() => setSelectedAssetForDelete(asset)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Asset Modal */}
      {showFormModal && (
        <AssetForm
          mode={formMode}
          initialData={selectedAssetForEdit}
          employees={employees}
          onSave={handleSaveAsset}
          onClose={() => setShowFormModal(false)}
          loading={formLoading}
          errorMessage={formError}
        />
      )}

      {/* View Asset Details Modal */}
      {selectedAssetForView && (
        <AssetDetails
          asset={selectedAssetForView}
          onClose={() => setSelectedAssetForView(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedAssetForDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger text-white rounded-top-4 py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Delete Asset Confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedAssetForDelete(null)}
                  disabled={deleteLoading}
                ></button>
              </div>

              <div className="modal-body p-4 text-center">
                <p className="fs-5 text-dark mb-2">
                  Are you sure you want to delete asset{' '}
                  <strong className="text-danger">{selectedAssetForDelete.assetName}</strong>?
                </p>
                <p className="text-muted small mb-0">
                  Asset Code: <code>{selectedAssetForDelete.assetCode}</code>. This action cannot be undone.
                </p>
              </div>

              <div className="modal-footer bg-light rounded-bottom-4 py-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedAssetForDelete(null)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold"
                  onClick={handleDeleteAsset}
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

export default Assets;
