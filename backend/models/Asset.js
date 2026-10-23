const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true
    },
    assetCode: {
      type: String,
      required: [true, 'Asset code is required'],
      unique: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Laptop', 'Desktop', 'Mobile', 'Printer', 'Monitor', 'Other'],
        message: '{VALUE} is not a valid asset category'
      }
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    purchaseDate: {
      type: Date
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be at least 0']
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Available', 'Assigned', 'Under Maintenance', 'Retired'],
        message: '{VALUE} is not a valid status'
      },
      default: 'Available'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Asset', assetSchema);
