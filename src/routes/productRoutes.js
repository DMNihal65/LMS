const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRole(['admin']), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', authenticateToken, authorizeRole(['admin']), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), productController.deleteProduct);

module.exports = router;