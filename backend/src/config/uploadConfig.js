const path = require('path');
const fs = require('fs');

/**
 * Determine the base upload directory.
 * - If UPLOAD_DIR environment variable is provided, use it.
 * - In Railway container environment (process.env.RAILWAY_ENVIRONMENT or Linux container with /app), use /app/uploads.
 * - Otherwise (local development), use <backend>/uploads.
 */
function getBaseUploadsDir() {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(process.env.UPLOAD_DIR);
  }
  const isRailway = Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_ENVIRONMENT_NAME ||
    process.env.RAILWAY_SERVICE_ID ||
    process.env.RAILWAY_PUBLIC_DOMAIN ||
    process.env.RAILWAY_PROJECT_ID
  );
  if (isRailway || (process.platform !== 'win32' && fs.existsSync('/app'))) {
    return '/app/uploads';
  }
  return path.resolve(__dirname, '../../uploads');
}

const BASE_UPLOADS_DIR = getBaseUploadsDir();
const MEMBERS_UPLOAD_DIR = path.join(BASE_UPLOADS_DIR, 'members');

// Automatically ensure uploads directory structure exists
try {
  if (!fs.existsSync(MEMBERS_UPLOAD_DIR)) {
    fs.mkdirSync(MEMBERS_UPLOAD_DIR, { recursive: true });
    console.log(`[Upload System] Directory created: ${MEMBERS_UPLOAD_DIR}`);
  }
} catch (err) {
  console.error(`[Upload System Error] Failed to create ${MEMBERS_UPLOAD_DIR}:`, err.message);
}

// Copy default-avatar.svg to uploads/members if not present
try {
  const localDefaultAvatar = path.resolve(__dirname, '../../uploads/members/default-avatar.svg');
  const targetDefaultAvatar = path.join(MEMBERS_UPLOAD_DIR, 'default-avatar.svg');
  if (fs.existsSync(localDefaultAvatar) && !fs.existsSync(targetDefaultAvatar)) {
    fs.copyFileSync(localDefaultAvatar, targetDefaultAvatar);
    console.log('[Upload System] Default avatar copied to active uploads directory.');
  }
} catch (err) {
  console.warn('[Upload System] Notice copying default avatar:', err.message);
}

module.exports = {
  BASE_UPLOADS_DIR,
  MEMBERS_UPLOAD_DIR
};
