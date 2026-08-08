const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/responseHelper');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Akses ditolak. Token autentikasi tidak ditemukan.', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return errorResponse(res, 'Sesi tidak valid atau telah kadaluarsa. Silakan login kembali.', 401, 'TOKEN_INVALID');
  }

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
