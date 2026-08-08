const Member = require('../models/Member');
const Attendance = require('../models/Attendance');
const { successResponse, errorResponse } = require('../utils/responseHelper');

async function getAllMembers(req, res, next) {
  try {
    const { search, department, generation, status } = req.query;
    const members = await Member.findAll({ search, department, generation, status });
    return successResponse(res, 'Data anggota berhasil diambil', members);
  } catch (err) {
    next(err);
  }
}

async function getMemberById(req, res, next) {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return errorResponse(res, 'Data anggota tidak ditemukan.', 404, 'NOT_FOUND');
    }

    // Get member's attendance history
    const history = await Attendance.getByMemberId(id);
    const totalAttendance = history.length;

    return successResponse(res, 'Detail anggota berhasil diambil', {
      member,
      stats: {
        totalAttendance
      },
      attendanceHistory: history
    });
  } catch (err) {
    next(err);
  }
}

async function createMember(req, res, next) {
  try {
    const { uid_rfid, nim, name, generation, department, status, photoUrl } = req.body;

    if (!nim || !name || !uid_rfid || !generation || !department) {
      return errorResponse(res, 'NIM, Nama, UID RFID, Angkatan, dan Departemen wajib diisi.', 400, 'VALIDATION_ERROR');
    }

    // Check unique UID
    const existingUid = await Member.findByUid(uid_rfid);
    if (existingUid) {
      return errorResponse(res, `UID RFID '${uid_rfid}' sudah terdaftar untuk anggota ${existingUid.name}.`, 400, 'DUPLICATE_UID');
    }

    // Check unique NIM
    const existingNim = await Member.findByNim(nim);
    if (existingNim) {
      return errorResponse(res, `NIM '${nim}' sudah terdaftar dalam sistem.`, 400, 'DUPLICATE_NIM');
    }

    // Photo handling: uploaded file > photoUrl > default placeholder
    let photo = '/uploads/members/default-avatar.png';
    if (req.file) {
      photo = `/uploads/members/${req.file.filename}`;
    } else if (photoUrl) {
      photo = photoUrl;
    }

    const insertId = await Member.create({
      uid_rfid,
      nim,
      name,
      generation,
      department,
      photo,
      status: status || 'active'
    });

    const newMember = await Member.findById(insertId);
    return successResponse(res, 'Data anggota baru berhasil ditambahkan.', newMember, 201);
  } catch (err) {
    next(err);
  }
}

async function updateMember(req, res, next) {
  try {
    const { id } = req.params;
    const { uid_rfid, nim, name, generation, department, status, photoUrl } = req.body;

    const currentMember = await Member.findById(id);
    if (!currentMember) {
      return errorResponse(res, 'Data anggota tidak ditemukan.', 404, 'NOT_FOUND');
    }

    // If UID changed, check uniqueness
    if (uid_rfid && uid_rfid.toUpperCase() !== currentMember.uid_rfid.toUpperCase()) {
      const existingUid = await Member.findByUid(uid_rfid);
      if (existingUid && existingUid.id !== Number(id)) {
        return errorResponse(res, `UID RFID '${uid_rfid}' sudah digunakan oleh anggota lain.`, 400, 'DUPLICATE_UID');
      }
    }

    // If NIM changed, check uniqueness
    if (nim && nim !== currentMember.nim) {
      const existingNim = await Member.findByNim(nim);
      if (existingNim && existingNim.id !== Number(id)) {
        return errorResponse(res, `NIM '${nim}' sudah digunakan oleh anggota lain.`, 400, 'DUPLICATE_NIM');
      }
    }

    let photo = currentMember.photo;
    if (req.file) {
      photo = `/uploads/members/${req.file.filename}`;
    } else if (photoUrl) {
      photo = photoUrl;
    }

    const updated = await Member.update(id, {
      uid_rfid,
      nim,
      name,
      generation,
      department,
      photo,
      status
    });

    return successResponse(res, 'Data anggota berhasil diperbarui.', updated);
  } catch (err) {
    next(err);
  }
}

async function deleteMember(req, res, next) {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member) {
      return errorResponse(res, 'Data anggota tidak ditemukan.', 404, 'NOT_FOUND');
    }

    await Member.delete(id);
    return successResponse(res, `Data anggota '${member.name}' berhasil dihapus.`);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};
