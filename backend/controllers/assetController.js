const Asset = require('../models/Asset');
const User = require('../models/User');

// @desc    Create new asset
// @route   POST /api/assets
const createAsset = async (req, res, next) => {
  try {
    const {
      assetName,
      assetCode,
      category,
      brand,
      purchaseDate,
      price,
      status,
      assignedTo,
      description
    } = req.body;

    // If assignedTo is provided, verify employee exists
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'Assigned employee not found'
        });
      }
    }

    const asset = await Asset.create({
      assetName,
      assetCode,
      category,
      brand,
      purchaseDate,
      price,
      status,
      assignedTo,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assets with populated assignedTo employee
// @route   GET /api/assets
const getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.find().populate('assignedTo');

    res.status(200).json({
      success: true,
      data: assets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single asset by ID
// @route   GET /api/assets/:id
const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('assignedTo');

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
const updateAsset = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    // If assignedTo is provided and not null, verify employee exists
    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: 'Assigned employee not found'
        });
      }
    }

    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo');

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    await asset.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset
};
