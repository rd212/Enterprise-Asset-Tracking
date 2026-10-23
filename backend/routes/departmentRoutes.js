const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Apply protect and requireAdmin middleware to all department routes
router.use(protect, requireAdmin);

router.route('/')
  .post(createDepartment)
  .get(getDepartments);

router.route('/:id')
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
