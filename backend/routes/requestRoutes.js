const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect, requireAdmin, requireEmployee } = require('../middleware/authMiddleware');

// Route for employee to create request and get employee's requests
router.post('/', protect, requireEmployee, createRequest);
router.get('/my', protect, requireEmployee, getMyRequests);

// Admin-only route to get all requests
router.get('/', protect, requireAdmin, getAllRequests);

// Get single request detail (Owner or Admin)
router.get('/:id', protect, getRequestById);

// Admin-only route to update request status
router.put('/:id/status', protect, requireAdmin, updateRequestStatus);

module.exports = router;
