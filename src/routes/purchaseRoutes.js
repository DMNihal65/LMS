const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', authenticateToken, purchaseController.createPurchase);
router.get('/', authenticateToken, authorizeRole(['admin']), purchaseController.getAllPurchases);
router.get('/:id', authenticateToken, purchaseController.getPurchaseById);
router.put('/:id', authenticateToken, authorizeRole(['admin']), purchaseController.updatePurchase);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), purchaseController.deletePurchase);
router.post('/:id/approve', authenticateToken, authorizeRole(['admin']), purchaseController.approvePurchase);
router.post('/:id/reject', authenticateToken, authorizeRole(['admin']), purchaseController.rejectPurchase);
router.get('/user/pending', authenticateToken, purchaseController.getUserPendingPurchases);

module.exports = router;