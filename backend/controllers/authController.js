const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Helper to generate JWT token with role/type
const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// @desc    Admin Portal Login Only
// @route   POST /api/auth/admin/login
const loginAdminPortal = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is in Admin model
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      // Check if it's an employee trying to login on admin portal
      const employee = await User.findOne({ email: normalizedEmail });
      if (employee) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This portal is restricted to Administrators only.'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!await admin.matchPassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(admin._id, 'admin');

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        type: 'admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    User/Employee Portal Login Only
// @route   POST /api/auth/user/login
const loginUserPortal = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is in User model (Employee)
    const employee = await User.findOne({ email: normalizedEmail });
    if (!employee) {
      // Check if an admin is trying to login on user portal
      const admin = await Admin.findOne({ email: normalizedEmail });
      if (admin) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Administrators should log in via the Admin Portal (/admin/login).'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!employee.password || !(await employee.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(employee._id, 'employee');

    return res.status(200).json({
      success: true,
      message: 'User login successful',
      token,
      user: {
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        type: 'employee'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    General Admin & Employee Login (backward compatibility)
// @route   POST /api/auth/login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check Admin
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id, 'admin');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          type: 'admin'
        }
      });
    }

    // 2. Check Employee
    const employee = await User.findOne({ email: normalizedEmail });
    if (employee && employee.password && (await employee.matchPassword(password))) {
      const token = generateToken(employee._id, 'employee');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: employee._id.toString(),
          name: employee.name,
          email: employee.email,
          type: 'employee'
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in Profile
// @route   GET /api/auth/me
const getCurrentAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdminPortal,
  loginUserPortal,
  loginAdmin,
  getCurrentAdmin
};
