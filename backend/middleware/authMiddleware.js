const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type === 'admin') {
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
          });
        }
        req.user = {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          type: 'admin'
        };
      } else if (decoded.type === 'employee') {
        const employee = await User.findById(decoded.id).select('-password');
        if (!employee) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
          });
        }
        req.user = {
          id: employee._id.toString(),
          name: employee.name,
          email: employee.email,
          type: 'employee'
        };
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid token payload'
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
};

// Require Admin Role
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.type === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Admin authorization required'
  });
};

// Require Employee Role
const requireEmployee = (req, res, next) => {
  if (req.user && req.user.type === 'employee') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Employee authorization required'
  });
};

module.exports = {
  protect,
  requireAdmin,
  requireEmployee
};
