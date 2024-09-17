const Purchase = require('../models/Purchase');

// Create purchase
exports.createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating purchase', error });
  }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
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
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    purchase.status = 'approved';
    purchase.approvedBy = req.user.id;
    purchase.approvedAt = new Date();
    await purchase.save();
    res.json({ message: 'Purchase approved successfully', purchase });
  } catch (error) {
    res.status(500).json({ message: 'Error approving purchase', error });
  }
};