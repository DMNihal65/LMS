const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/log', authenticateToken, analyticsController.logEvent);
router.get('/', authenticateToken, authorizeRole(['admin']), analyticsController.getAllEvents);
router.get('/report', authenticateToken, authorizeRole(['admin']), analyticsController.getReport);

module.exports = router;