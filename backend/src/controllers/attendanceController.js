const Attendance = require('../models/Attendance');
const { successResponse, errorResponse } = require('../utils/responseHelper');

async function getTodayAttendance(req, res, next) {
  try {
    const logs = await Attendance.getTodayLogs();
    return successResponse(res, 'Data absensi hari ini berhasil diambil', logs);
  } catch (err) {
    next(err);
  }
}

async function getAttendanceHistory(req, res, next) {
  try {
    const { search, startDate, endDate, department, generation, status } = req.query;
    const history = await Attendance.getHistory({
      search,
      startDate,
      endDate,
      department,
      generation,
      status
    });
    return successResponse(res, 'Riwayat absensi berhasil diambil', history);
  } catch (err) {
    next(err);
  }
}

async function getAttendanceByMember(req, res, next) {
  try {
    const { memberId } = req.params;
    const logs = await Attendance.getByMemberId(memberId);
    return successResponse(res, 'Riwayat absensi anggota berhasil diambil', logs);
  } catch (err) {
    next(err);
  }
}

async function createManualAttendance(req, res, next) {
  try {
    const { member_id, uid_rfid, status } = req.body;
    if (!member_id) {
      return errorResponse(res, 'ID Anggota wajib diisi.', 400, 'VALIDATION_ERROR');
    }

    const record = await Attendance.record({
      member_id,
      uid_rfid: uid_rfid || 'MANUAL-ENTRY',
      status: status || 'Hadir'
    });

    return successResponse(res, 'Presensi manual berhasil dicatat.', record, 201);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTodayAttendance,
  getAttendanceHistory,
  getAttendanceByMember,
  createManualAttendance
};
