const express = require('express');
const router = express.Router();
const {
  loginAdminPortal,
  loginUserPortal,
  loginAdmin,
  getCurrentAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/admin/login', loginAdminPortal);
router.post('/user/login', loginUserPortal);
router.post('/login', loginAdmin);
router.get('/me', protect, getCurrentAdmin);

module.exports = router;
