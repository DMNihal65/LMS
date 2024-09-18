const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const License = require('../models/License');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Create purchase
exports.createPurchase = async (req, res) => {
  try {
    const { productId, licenseType, quantity, agreedToTerms } = req.body;
    const userId = req.user.id;

    if (!agreedToTerms) {
      return res.status(400).json({ message: 'You must agree to the terms and conditions' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const licenseTypeInfo = product.licenseTypes.find(lt => lt.type === licenseType);
    if (!licenseTypeInfo) {
      return res.status(400).json({ message: 'Invalid license type' });
    }

    const purchase = new Purchase({
      userId,
      productId,
      licenseType,
      quantity,
      amount: licenseTypeInfo.price * quantity,
      status: 'pending'
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase', error: error.message });
  }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('userId', 'name email')
      .populate('productId', 'name');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error });
  }
};

// Get purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase', error });
  }
};

// Update purchase
exports.updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating purchase', error });
  }
};

// Delete purchase
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase', error });
  }
};

// Approve purchase
exports.approvePurchase = async (req, res) => {
  try {
    const { licenseKey } = req.body;
    const purchase = await Purchase.findById(req.params.id).populate('productId').populate('userId');
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    if (purchase.status !== 'pending') {
      return res.status(400).json({ message: 'Purchase is not pending' });
    }

    // Create a new license
    const license = new License({
      userId: purchase.userId._id,
      productId: purchase.productId._id,
      licenseKey,
      type: purchase.licenseType, // This should now match the custom type from the product
      startDate: new Date(),
      status: 'active'
    });
    await license.save();

    // Update purchase status
    purchase.status = 'approved';
    purchase.approvedBy = req.user.id;
    purchase.approvedAt = new Date();
    await purchase.save();

    // Send email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: purchase.userId.email,
      subject: 'Your Purchase Has Been Approved',
      html: `
        <h1>Purchase Approved</h1>
        <p>Your purchase for ${purchase.productId.name} has been approved.</p>
        <p>License Key: ${licenseKey}</p>
        <p>License Type: ${purchase.licenseType}</p>
        <p>Quantity: ${purchase.quantity}</p>
        <p>Product Details:</p>
        <ul>
          <li>Name: ${purchase.productId.name}</li>
          <li>Description: ${purchase.productId.description}</li>
          <li>Version: ${purchase.productId.version}</li>
        </ul>
        <p>Thank you for your purchase!</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Purchase approved, license generated, and email sent', purchase, license });
  } catch (error) {
    res.status(500).json({ message: 'Error approving purchase', error: error.message });
  }
};

exports.rejectPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('userId').populate('productId');
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    if (purchase.status !== 'pending') {
      return res.status(400).json({ message: 'Purchase is not pending' });
    }

    purchase.status = 'rejected';
    await purchase.save();

    // Send rejection email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: purchase.userId.email,
      subject: 'Your Purchase Has Been Rejected',
      html: `
        <h1>Purchase Rejected</h1>
        <p>We're sorry, but your purchase for ${purchase.productId.name} has been rejected.</p>
        <p>If you have any questions, please contact our support team.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Purchase rejected and email sent', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting purchase', error: error.message });
  }
};

exports.getUserPendingPurchases = async (req, res) => {
  try {
    const pendingPurchases = await Purchase.find({ userId: req.user.id, status: 'pending' }).populate('productId');
    res.json(pendingPurchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending purchases', error: error.message });
  }
};