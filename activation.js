const LicenseManager = require('../client-library/licenseManager');
const path = require('path');
const fs = require('fs');

// Configuration
const API_URL = 'http://localhost:5000/api/licenses'; // Adjust as necessary
const LICENSE_FILE_PATH = path.join(__dirname, 'license.txt'); // Path to store the license file
const LICENSE_KEY = 'aBe71ZITeZoyn5bQStygftg8nN5vYX/DTjZqTbP93AOnF590X/Bu2Falp19sdSO7GRaRZ+ZOpcc9VI0BOHrZQR2xMTmcn85q3DK0vP7muepK5lPlxzW+m5qxr08ArI99vIlXAZMiu0fhmOpowyUy/7UZoAiLPS+YAfMYtl75fFkzecfy/wSr3SgDubklULgVHXmMNFH0n8I/LrdJ5PNZC+ZkWoBb3AvKhJ2MR2jawtyE29APBBTE03IDfy20M0bf6/gDGHxJybRQTYWlrfyhFUPatdlvZPaLFc4rO0e492kdzAWkh5FdULceiAYIvcF8Xdz45SfU1nOBFZMuKlBl2g=='; // Replace with your actual license key

// Initialize LicenseManager
const licenseManager = new LicenseManager(API_URL, LICENSE_FILE_PATH);

// Function to check and activate the license
async function checkAndActivateLicense() {
    try {
        // Check if the license file exists and is valid
        if (fs.existsSync(LICENSE_FILE_PATH)) {
            const isValid = await licenseManager.verifyLicense();
            if (isValid) {
                console.log('License is already activated and valid. Access granted to the application.');
                return true;
            }
        }

        // If not activated or invalid, attempt to activate the license
        const activationResponse = await licenseManager.activateLicense(LICENSE_KEY);
        console.log('License activated successfully. Access granted to the application.');
        return true;
    } catch (error) {
        console.log('Failed to activate the license:', error.response?.data?.message || error.message);
        return false;
    }
}

// Function to regularly check license validity
async function checkLicenseValidity() {
    const isValid = await licenseManager.verifyLicense();
    
    if (!isValid) {
        console.log('License is invalid or has expired. Access denied.');
    } else {
        console.log('License is valid. Access granted to the application.');
    }
}

// Simulate the application flow
async function runApplication() {
    // Check and activate the license
    const activated = await checkAndActivateLicense();

    if (activated) {
        // Regularly check license validity (e.g., every 30 seconds)
        setInterval(checkLicenseValidity, 30000);
    } else {
        console.log('Application cannot start due to license activation failure.');
    }
}

// Start the application
runApplication();