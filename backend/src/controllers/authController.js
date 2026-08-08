const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/responseHelper');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 'Username/email dan password wajib diisi.', 400, 'VALIDATION_ERROR');
    }

    const admin = await Admin.findByUsernameOrEmail(username.trim());
    if (!admin) {
      return errorResponse(res, 'Kredensial login tidak valid. Silakan periksa kembali.', 401, 'INVALID_CREDENTIALS');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return errorResponse(res, 'Password yang Anda masukkan salah.', 401, 'INVALID_CREDENTIALS');
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      email: admin.email
    });

    return successResponse(res, 'Login berhasil. Selamat datang di HIMATIF Connect!', {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return errorResponse(res, 'Data admin tidak ditemukan.', 404, 'NOT_FOUND');
    }
    return successResponse(res, 'Data admin berhasil diambil', { admin });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  return successResponse(res, 'Logout berhasil.');
}

async function updatePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Password lama dan password baru wajib diisi.', 400, 'VALIDATION_ERROR');
    }

    const admin = await Admin.findById(req.user.id);
    const fullAdmin = await Admin.findByUsernameOrEmail(admin.username);
    const isMatch = await bcrypt.compare(currentPassword, fullAdmin.password_hash);

    if (!isMatch) {
      return errorResponse(res, 'Password lama tidak sesuai.', 400, 'INVALID_PASSWORD');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await Admin.updatePassword(admin.id, hashed);

    return successResponse(res, 'Password berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getMe,
  logout,
  updatePassword
};
