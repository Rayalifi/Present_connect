const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/summary', authMiddleware, statsController.getDashboardSummary);

module.exports = router;
