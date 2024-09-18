const User = require('../models/User');
const Product = require('../models/Product');
const License = require('../models/License');
const Purchase = require('../models/Purchase');

exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const licenses = await License.countDocuments({ status: 'active' });
    const revenue = await Purchase.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      users,
      products,
      licenses,
      revenue: revenue.length > 0 ? revenue[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const recentPurchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .populate('productId', 'name');

    const activities = recentPurchases.map(purchase => ({
      id: purchase._id,
      activity: `${purchase.userId.name} purchased ${purchase.productId.name}`,
      user: purchase.userId.name,
      date: purchase.createdAt
    }));

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
};