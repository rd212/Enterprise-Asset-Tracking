import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReportIssue = () => {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const [formData, setFormData] = useState({
    asset: '',
    title: '',
    description: '',
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
        setError('Failed to load your assigned assets.');
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

    // Frontend validation
    if (!formData.asset) {
      setError('Please select an assigned asset.');
      return;
    }
    if (!formData.title.trim()) {
      setError('Issue title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Issue description is required.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/requests', {
        asset: formData.asset,
        type: 'Issue',
        title: formData.title,
        description: formData.description,
        priority: formData.priority
      });

      setSuccess('Issue reported successfully.');
      setTimeout(() => {
        navigate('/employee/requests');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue. Please try again.');
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
        <h2 className="fw-bold text-dark mb-1">Report Issue</h2>
        <p className="text-muted mb-0">Report a technical defect or problem with an assigned asset to the admin.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-warning text-dark py-3">
              <h5 className="card-title m-0 fw-bold">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Asset Issue Form
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
                  <i className="bi bi-info-circle text-warning display-4 d-block mb-2"></i>
                  <h5>No Assigned Assets Found</h5>
                  <p className="text-muted">You do not have any assigned assets to report an issue for.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Select Asset */}
                  <div className="mb-3">
                    <label htmlFor="assetSelect" className="form-label fw-bold">
                      Select Asset <span className="text-danger">*</span>
                    </label>
                    <select
                      id="assetSelect"
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
                  </div>

                  {/* Issue Title */}
                  <div className="mb-3">
                    <label htmlFor="titleInput" className="form-label fw-bold">
                      Issue Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="titleInput"
                      name="title"
                      className="form-control"
                      placeholder="e.g. Screen flickering, Battery draining fast"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Issue Description */}
                  <div className="mb-3">
                    <label htmlFor="descriptionInput" className="form-label fw-bold">
                      Issue Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="descriptionInput"
                      name="description"
                      rows="4"
                      className="form-control"
                      placeholder="Provide details about the issue you are experiencing..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Priority */}
                  <div className="mb-4">
                    <label htmlFor="prioritySelect" className="form-label fw-bold">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <select
                      id="prioritySelect"
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
                      className="btn btn-warning py-2 fw-bold text-dark shadow-sm"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Submitting Issue...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Report Issue
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

export default ReportIssue;
