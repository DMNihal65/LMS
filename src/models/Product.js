const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  version: String,
  price: Number,
  licenseTypes: [{
    type: { type: String, enum: ['perpetual', 'subscription'] },
    duration: Number,
    price: Number
  }],
  features: [String],
  systemRequirements: String,
  downloadUrl: String,
  documentationUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);