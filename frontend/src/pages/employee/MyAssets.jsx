import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    const fetchMyAssets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/employee/assets');
        setAssets(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assigned assets.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAssets();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading Assigned Equipment...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Assets</h2>
          <p className="text-muted mb-0">Assets officially assigned to your user account.</p>
        </div>
        <span className="badge bg-success fs-6 px-3 py-2">
          Total Assigned: {assets.length}
        </span>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {assets.length === 0 ? (
        <div className="card shadow-sm border-0 text-center py-5">
          <div className="card-body">
            <i className="bi bi-inbox display-1 text-secondary opacity-50 mb-3 d-block"></i>
            <h4 className="fw-bold text-dark mb-2">No Assets Assigned</h4>
            <p className="text-muted mb-0">No company assets or equipment are currently assigned to your account.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {assets.map((asset) => (
            <div key={asset._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
                  <span className="fw-bold text-dark fs-5">
                    <i className="bi bi-laptop me-2 text-success"></i>
                    {asset.assetName}
                  </span>
                  <span className="badge bg-success">{asset.status}</span>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-3">
                    <li className="mb-2">
                      <span className="text-muted small d-block">Asset Code:</span>
                      <code className="fs-6 text-dark fw-bold">{asset.assetCode}</code>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted small d-block">Category / Type:</span>
                      <span className="fw-semibold text-dark">{asset.category}</span>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted small d-block">Brand:</span>
                      <span className="fw-semibold text-dark">{asset.brand}</span>
                    </li>
                    <li className="mb-2">
                      <span className="text-muted small d-block">Assigned Date:</span>
                      <span className="fw-semibold text-dark">
                        {asset.updatedAt
                          ? new Date(asset.updatedAt).toLocaleDateString()
                          : asset.purchaseDate
                          ? new Date(asset.purchaseDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </li>
                    <li className="mb-0">
                      <span className="text-muted small d-block">Condition / Description:</span>
                      <span className="text-dark small">
                        {asset.description || 'Good Condition'}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="card-footer bg-white border-top-0 pt-0 pb-3">
                  <button
                    className="btn btn-outline-success w-100 fw-semibold"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <i className="bi bi-eye me-2"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-laptop me-2"></i>
                  {selectedAsset.assetName} Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedAsset(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <table className="table table-borderless align-middle mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted fw-bold" style={{ width: '40%' }}>Asset Code:</td>
                      <td><code>{selectedAsset.assetCode}</code></td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-bold">Asset Type:</td>
                      <td>{selectedAsset.category}</td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-bold">Brand:</td>
                      <td>{selectedAsset.brand}</td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-bold">Status:</td>
                      <td>
                        <span className="badge bg-success">{selectedAsset.status}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-bold">Assigned Date:</td>
                      <td>
                        {selectedAsset.updatedAt
                          ? new Date(selectedAsset.updatedAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted fw-bold">Condition / Notes:</td>
                      <td>{selectedAsset.description || 'Good Condition'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedAsset(null)}
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

export default MyAssets;
