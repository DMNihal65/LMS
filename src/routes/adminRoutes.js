const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/stats', authenticateToken, authorizeRole(['admin']), adminController.getStats);
router.get('/recent-activities', authenticateToken, authorizeRole(['admin']), adminController.getRecentActivities);

module.exports = router;