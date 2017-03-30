const fileFilter = require('../utils/fileFilter');

const UPLOAD_FOLDER = 'uploads';

const multerConfig = {
  dest: `${UPLOAD_FOLDER}/`,
  fileFilter,
  limits: {
    fileSize: 2 * (10 ** 6), // 2MB
  }
};

module.exports = multerConfig;
