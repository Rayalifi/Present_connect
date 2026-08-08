const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const { successResponse } = require('../utils/responseHelper');

async function getDashboardSummary(req, res, next) {
  try {
    const stats = await Attendance.getSummaryStats();
    const todayLogs = await Attendance.getTodayLogs();

    // Take top 5 recent for quick view
    const recentScans = todayLogs.slice(0, 5);

    return successResponse(res, 'Ringkasan data dashboard berhasil diambil', {
      stats,
      recentScans,
      serverTime: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardSummary
};
