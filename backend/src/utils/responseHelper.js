function successResponse(res, message, data = null, statusCode = 200) {
  const response = {
    success: true,
    message
  };
  if (data !== null) {
    if (typeof data === 'object' && !Array.isArray(data) && (data.member || data.attendance || data.token)) {
      Object.assign(response, data);
    } else {
      response.data = data;
    }
  }
  return res.status(statusCode).json(response);
}

function errorResponse(res, message, statusCode = 500, errorType = 'SERVER_ERROR', extra = {}) {
  return res.status(statusCode).json({
    success: false,
    error: errorType,
    message,
    ...extra
  });
}

module.exports = {
  successResponse,
  errorResponse
};
