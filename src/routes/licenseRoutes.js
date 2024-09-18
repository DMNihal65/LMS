const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Move the /user route to the top
router.get('/user', authenticateToken, (req, res, next) => {
  console.log('Authenticated user in /user route:', req.user);
  next();
}, licenseController.getUserLicenses);

router.post('/', authenticateToken, authorizeRole(['admin']), licenseController.createLicense);
router.get('/', authenticateToken, licenseController.getAllLicenses);
router.get('/:id', authenticateToken, licenseController.getLicenseById);
router.put('/:id', authenticateToken, authorizeRole(['admin']), licenseController.updateLicense);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), licenseController.deleteLicense);
router.get('/validate/:licenseKey', licenseController.validateLicense);
router.post('/activate/:licenseKey', authenticateToken, licenseController.activateLicense);

module.exports = router;