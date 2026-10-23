const express = require('express');
const router = express.Router();
const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset
} = require('../controllers/assetController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Apply protect and requireAdmin middleware to all asset routes
router.use(protect, requireAdmin);

router.route('/')
  .post(createAsset)
  .get(getAssets);

router.route('/:id')
  .get(getAssetById)
  .put(updateAsset)
  .delete(deleteAsset);

module.exports = router;
