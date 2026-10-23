const express = require('express');
const router = express.Router();
const { getEmployeeProfile, getEmployeeAssets } = require('../controllers/employeeController');
const { protect, requireEmployee } = require('../middleware/authMiddleware');

// Apply protect and requireEmployee middleware
router.use(protect, requireEmployee);

router.get('/profile', getEmployeeProfile);
router.get('/assets', getEmployeeAssets);

module.exports = router;
