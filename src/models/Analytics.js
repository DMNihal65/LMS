const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  type: { type: String, enum: ['product_view', 'license_activation', 'purchase'], required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Analytics', analyticsSchema);