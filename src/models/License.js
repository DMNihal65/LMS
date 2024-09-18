const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  licenseKey: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // Changed from enum to String
  startDate: { type: Date, required: true },
  expiryDate: Date,
  status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' },
  activations: [{
    deviceId: String,
    activatedAt: Date
  }],
  maxActivations: Number,
}, { timestamps: true });

module.exports = mongoose.model('License', licenseSchema);