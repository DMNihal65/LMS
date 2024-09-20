const axios = require('axios');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

class LicenseManager {
  constructor(apiUrl, licenseFilePath) {
    this.apiUrl = apiUrl;
    this.licenseFilePath = licenseFilePath;
  }

  async activateLicense(licenseKey) {
    try {
      const response = await axios.post(`${this.apiUrl}/activate`, {
        licenseKey,
        machineId: this.getMachineId()
      });
      fs.writeFileSync(this.licenseFilePath, JSON.stringify(response.data));
      console.log('License data saved successfully');
      return response.data;
    } catch (error) {
      console.error('License activation failed:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async verifyLicense() {
    if (!fs.existsSync(this.licenseFilePath)) {
      console.log('License file not found');
      return false;
    }

    const licenseData = JSON.parse(fs.readFileSync(this.licenseFilePath, 'utf8'));

    try {
      const response = await axios.post(`${this.apiUrl}/verify`, {
        licenseKey: licenseData.licenseKey,
        machineId: this.getMachineId()
      });
      console.log('Verification response:', response.data);
      return response.data.message === 'License is valid';
    } catch (error) {
      console.error('License verification failed:', error.response?.data?.message || error.message);
      return false;
    }
  }

  getMachineId() {
    const cpus = os.cpus();
    const networkInterfaces = os.networkInterfaces();
    
    let machineIdData = cpus[0].model + cpus.length + os.totalmem();
    
    for (let key in networkInterfaces) {
      for (let net of networkInterfaces[key]) {
        if (net.mac && net.mac !== '00:00:00:00:00:00') {
          machineIdData += net.mac;
        }
      }
    }
    
    return crypto.createHash('sha256').update(machineIdData).digest('hex');
  }
}

module.exports = LicenseManager;