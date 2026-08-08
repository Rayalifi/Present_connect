const { errorResponse } = require('../utils/responseHelper');

function notFoundHandler(req, res, next) {
  return errorResponse(res, `Route '${req.originalUrl}' tidak ditemukan pada server API.`, 404, 'NOT_FOUND');
}

function globalErrorHandler(err, req, res, next) {
  console.error('[Unhandled Error]', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  return errorResponse(res, message, statusCode, 'INTERNAL_SERVER_ERROR', {
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
