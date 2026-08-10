const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const { checkCooldown } = require('../utils/cooldown');
const { broadcastEvent } = require('../config/socket');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const COOLDOWN_SECONDS = parseInt(process.env.COOLDOWN_SECONDS || '30', 10);

async function handleRfidScan(req, res, next) {
  try {
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string' || uid.trim() === '') {
      return errorResponse(res, 'UID RFID kartu tidak valid atau kosong.', 400, 'INVALID_UID');
    }

    const cleanUid = uid.trim().toUpperCase();

    // 1. Cari anggota berdasarkan UID RFID
    const member = await Member.findByUid(cleanUid);

    // 2. Jika kartu TIDAK DITEMUKAN
    if (!member) {
      // Broadcast unknown card attempt to UI live monitor
      broadcastEvent('attendance:scanned', {
        success: false,
        type: 'UNREGISTERED_CARD',
        uid: cleanUid,
        message: 'Kartu Tidak Terdaftar',
        scannedAt: new Date().toISOString()
      });

      return errorResponse(res, 'Kartu Tidak Terdaftar', 404, 'NOT_FOUND', {
        uid: cleanUid
      });
    }

    // 3. Cek Status Keaktifan Anggota
    if (member.status !== 'active') {
      return errorResponse(res, `Kartu terdaftar atas nama ${member.name}, namun status keanggotaan sedang tidak aktif.`, 403, 'INACTIVE_MEMBER', {
        member: {
          name: member.name,
          nim: member.nim,
          department: member.department
        }
      });
    }

    // 4. Cek Cooldown Anti-Double Attendance
    const cooldownResult = checkCooldown(cleanUid, COOLDOWN_SECONDS);
    if (!cooldownResult.isAllowed) {
      const cooldownData = {
        success: false,
        type: 'COOLDOWN_ALERT',
        message: 'Anda sudah melakukan absensi baru saja. Silakan tunggu beberapa saat.',
        member: {
          name: member.name,
          nim: member.nim,
          department: member.department
        },
        remainingSeconds: cooldownResult.remainingSeconds
      };

      broadcastEvent('attendance:scanned', cooldownData);

      return res.status(429).json({
        success: false,
        error: 'COOLDOWN',
        message: 'Anda sudah melakukan absensi baru saja. Silakan tunggu beberapa saat.',
        member: {
          name: member.name,
          nim: member.nim,
          department: member.department
        },
        remainingSeconds: cooldownResult.remainingSeconds
      });
    }

    // 5. Catat Absensi Baru ke Database
    const attendanceRecord = await Attendance.record({
      member_id: member.id,
      uid_rfid: cleanUid,
      status: 'Hadir'
    });

    const responsePayload = {
      success: true,
      message: 'Absensi berhasil',
      member: {
        id: member.id,
        uid_rfid: member.uid_rfid,
        nim: member.nim,
        name: member.name,
        generation: member.generation,
        department: member.department,
        photo: member.photo
      },
      attendance: {
        id: attendanceRecord.id,
        date: attendanceRecord.attendance_date,
        time: attendanceRecord.attendance_time,
        status: attendanceRecord.status
      }
    };

    // 6. Broadcast Real-time Event via Socket.IO
    broadcastEvent('attendance:scanned', {
      ...responsePayload,
      type: 'SUCCESS_ATTENDANCE'
    });

    // Broadcast updated stats to dashboard
    const updatedStats = await Attendance.getSummaryStats();
    broadcastEvent('attendance:stats', updatedStats);

    return res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
}

async function handleRfidRead(req, res, next) {
  try {
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string' || uid.trim() === '') {
      return errorResponse(
        res,
        'UID RFID tidak valid atau kosong.',
        400,
        'INVALID_UID'
      );
    }

    const cleanUid = uid.trim().toUpperCase();

    broadcastEvent('rfid:registration', {
      uid: cleanUid,
      scannedAt: new Date().toISOString()
    });

    return successResponse(res, 'UID RFID berhasil dibaca.', {
      uid: cleanUid
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleRfidScan,
  handleRfidRead
};