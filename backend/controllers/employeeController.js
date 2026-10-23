const User = require('../models/User');
const Asset = require('../models/Asset');

// @desc    Get Logged-in Employee Profile
// @route   GET /api/employee/profile
const getEmployeeProfile = async (req, res, next) => {
  try {
    const profile = await User.findById(req.user.id)
      .select('-password')
      .populate('department');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Employee profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Assets Assigned to Logged-in Employee Only
// @route   GET /api/employee/assets
const getEmployeeAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find({ assignedTo: req.user.id });

    res.status(200).json({
      success: true,
      data: assets
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployeeProfile,
  getEmployeeAssets
};
