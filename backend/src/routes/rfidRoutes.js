const express = require('express');
const router = express.Router();
const rfidController = require('../controllers/rfidController');

// RFID Scan endpoint is public so ESP32 (and frontend simulator) can post without session token
router.post('/scan', rfidController.handleRfidScan);
router.post('/read', rfidController.handleRfidRead);
router.get('/mode', rfidController.getRfidMode);
router.post('/mode', rfidController.setRfidMode);

module.exports = router;
