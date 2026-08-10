const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { MEMBERS_UPLOAD_DIR } = require('../config/uploadConfig');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, MEMBERS_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'member-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const isMimeValid = allowedExtensions.test(file.mimetype);

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  }
  cb(new Error('Format file tidak didukung! Hanya gambar JPG, PNG, atau WEBP yang diperbolehkan.'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter: fileFilter
});

module.exports = upload;
