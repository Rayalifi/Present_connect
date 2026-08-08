const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/today', attendanceController.getTodayAttendance);
router.get('/history', authMiddleware, attendanceController.getAttendanceHistory);
router.get('/member/:memberId', authMiddleware, attendanceController.getAttendanceByMember);
router.post('/', authMiddleware, attendanceController.createManualAttendance);

module.exports = router;
