const User = require('../models/User');
const Department = require('../models/Department');
const Asset = require('../models/Asset');

// @desc    Create new employee/user
// @route   POST /api/users
const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, department, position, password } = req.body;

    // Verify department exists
    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(400).json({
        success: false,
        message: 'Department not found'
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      department,
      position,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees/users with populated department
// @route   GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').populate('department');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('department');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { department } = req.body;

    // If department is supplied, verify it exists
    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        return res.status(400).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password').populate('department');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if assets are assigned to this employee
    const assignedAssetCount = await Asset.countDocuments({ assignedTo: req.params.id });
    if (assignedAssetCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete employee because assets are assigned to this employee'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
