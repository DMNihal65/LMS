const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  price: { type: Number, required: true },
  licenseTypes: [{
    type: { type: String, enum: ['perpetual', 'subscription'], required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  features: [{ type: String }],
  systemRequirements: { type: String },
  downloadUrl: { type: String },
  documentationUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);