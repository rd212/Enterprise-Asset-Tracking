const Request = require('../models/Request');
const Asset = require('../models/Asset');

// @desc    Create a new change request or report issue
// @route   POST /api/requests
// @access  Private (Employee)
const createRequest = async (req, res, next) => {
  try {
    const { asset: assetId, type, title, description, priority } = req.body;

    if (!assetId || !type || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide asset, request type, title, and description'
      });
    }

    // Security Check: Verify asset exists and is assigned to the logged-in employee
    const targetAsset = await Asset.findById(assetId);
    if (!targetAsset) {
      return res.status(404).json({
        success: false,
        message: 'Selected asset was not found'
      });
    }

    if (!targetAsset.assignedTo || targetAsset.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit requests for assets assigned to your account'
      });
    }

    const request = await Request.create({
      user: req.user.id,
      asset: assetId,
      type,
      title,
      description,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    const populatedRequest = await Request.findById(request._id)
      .populate('asset')
      .populate('user', 'name email department position');

    res.status(201).json({
      success: true,
      message: `${type} submitted successfully`,
      data: populatedRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests submitted by logged-in employee
// @route   GET /api/requests/my
// @access  Private (Employee)
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ user: req.user.id })
      .populate('asset')
      .populate('user', 'name email position')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests from all users (Admin only)
// @route   GET /api/requests
// @access  Private (Admin)
const getAllRequests = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('asset')
      .populate('user', 'name email department position')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request details by ID
// @route   GET /api/requests/:id
// @access  Private (Admin or Request Owner)
const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('asset')
      .populate('user', 'name email department position');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Authorization: User can only view their own request unless Admin
    if (req.user.type !== 'admin' && request.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status (Admin only)
// @route   PUT /api/requests/:id/status
// @access  Private (Admin)
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, adminComment } = req.body;

    const validStatuses = ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = status;
    if (adminComment !== undefined) {
      request.adminComment = adminComment;
    }

    await request.save();

    const updatedRequest = await Request.findById(request._id)
      .populate('asset')
      .populate('user', 'name email department position');

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: updatedRequest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus
};
