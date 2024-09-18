const mongoose = require('mongoose');

const licenseTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  price: { type: Number, required: true },
  licenseTypes: [licenseTypeSchema],
  features: [{ type: String }],
  systemRequirements: { type: String },
  downloadUrl: { type: String },
  documentationUrl: { type: String },
  licenseAgreement: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);