import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ChangeRequest = () => {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    asset: '',
    priority: 'Medium'
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserAssets = async () => {
      setLoadingAssets(true);
      try {
        const res = await api.get('/employee/assets');
        const userAssets = res.data.data || [];
        setAssets(userAssets);
        if (userAssets.length > 0) {
          setFormData((prev) => ({ ...prev, asset: userAssets[0]._id }));
        }
      } catch (err) {
        setError('Failed to fetch assigned assets.');
      } finally {
        setLoadingAssets(false);
      }
    };

    fetchUserAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Frontend Validation
    if (!formData.title.trim()) {
      setError('Change title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }
    if (!formData.asset) {
      setError('Please select a related asset.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/requests', {
        title: formData.title,
        description: formData.description,
        asset: formData.asset,
        priority: formData.priority,
        type: 'Change Request'
      });

      setSuccess('Change Request submitted successfully.');
      setTimeout(() => {
        navigate('/employee/requests');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit change request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAssets) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success me-2" role="status"></div>
        <span className="fw-semibold text-secondary">Loading Assets...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-dark mb-1">Change Request</h2>
        <p className="text-muted mb-0">Submit an asset change, replacement, software installation, or modification request to Admin.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-success text-white py-3">
              <h5 className="card-title m-0 fw-bold">
                <i className="bi bi-arrow-repeat me-2"></i>
                Change Request Form
              </h5>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success mb-4" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              )}

              {assets.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-info-circle text-success display-4 d-block mb-2"></i>
                  <h5>No Assigned Assets Found</h5>
                  <p className="text-muted">You need an assigned asset to submit a change request.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Change Title */}
                  <div className="mb-3">
                    <label htmlFor="changeTitle" className="form-label fw-bold">
                      Change Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="changeTitle"
                      name="title"
                      className="form-control"
                      placeholder="e.g. Request laptop replacement, Request additional monitor, Request software installation"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label htmlFor="changeDescription" className="form-label fw-bold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="changeDescription"
                      name="description"
                      rows="4"
                      className="form-control"
                      placeholder="Describe why you need this change or what specific modifications are required..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Related Asset */}
                  <div className="mb-3">
                    <label htmlFor="relatedAsset" className="form-label fw-bold">
                      Related Asset <span className="text-danger">*</span>
                    </label>
                    <select
                      id="relatedAsset"
                      name="asset"
                      className="form-select"
                      value={formData.asset}
                      onChange={handleChange}
                      required
                    >
                      {assets.map((ast) => (
                        <option key={ast._id} value={ast._id}>
                          {ast.assetName} ({ast.assetCode} - {ast.brand})
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      Only assets assigned to your account are displayed.
                    </small>
                  </div>

                  {/* Priority */}
                  <div className="mb-4">
                    <label htmlFor="changePriority" className="form-label fw-bold">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <select
                      id="changePriority"
                      name="priority"
                      className="form-select"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success py-2 fw-bold text-white shadow-sm"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Submitting Change Request...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Send Change Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequest;
