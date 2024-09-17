const License = require('../models/License');
const crypto = require('crypto');

// Create license
exports.createLicense = async (req, res) => {
  try {
    const licenseKey = crypto.randomBytes(16).toString('hex');
    const license = new License({ ...req.body, licenseKey });
    await license.save();
    res.status(201).json(license);
  } catch (error) {
    res.status(500).json({ message: 'Error creating license', error });
  }
};

// Get all licenses
exports.getAllLicenses = async (req, res) => {
  try {
    const licenses = await License.find();
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching licenses', error });
  }
};

// Get license by ID
exports.getLicenseById = async (req, res) => {
  try {
    const license = await License.findById(req.params.id);
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching license', error });
  }
};

// Update license
exports.updateLicense = async (req, res) => {
  try {
    const license = await License.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }
    res.json(license);
  } catch (error) {
    res.status(500).json({ message: 'Error updating license', error });
  }
};

// Delete license
exports.deleteLicense = async (req, res) => {
  try {
    const license = await License.findByIdAndDelete(req.params.id);
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }
    res.json({ message: 'License deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting license', error });
  }
};

// Validate license
exports.validateLicense = async (req, res) => {
  try {
    const { licenseKey } = req.params;
    const license = await License.findOne({ licenseKey });
    if (!license) {
      return res.status(404).json({ message: 'Invalid license key' });
    }
    if (license.status !== 'active') {
      return res.status(400).json({ message: 'License is not active' });
    }
    res.json({ message: 'License is valid', license });
  } catch (error) {
    res.status(500).json({ message: 'Error validating license', error });
  }
};

// Activate license
exports.activateLicense = async (req, res) => {
  try {
    const { licenseKey } = req.params;
    const { deviceId } = req.body;
    const license = await License.findOne({ licenseKey });
    if (!license) {
      return res.status(404).json({ message: 'Invalid license key' });
    }
    if (license.status !== 'active') {
      return res.status(400).json({ message: 'License is not active' });
    }
    if (license.activations.length >= license.maxActivations) {
      return res.status(400).json({ message: 'Maximum activations reached' });
    }
    license.activations.push({ deviceId, activatedAt: new Date() });
    await license.save();
    res.json({ message: 'License activated successfully', license });
  } catch (error) {
    res.status(500).json({ message: 'Error activating license', error });
  }
};