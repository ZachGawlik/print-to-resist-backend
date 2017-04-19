const multer = require('multer');
const fileFilter = require('../utils/fileFilter');

const multerConfig = {
  storage: multer.diskStorage({
    destination: '/tmp/uploads'
  }),
  fileFilter,
  limits: {
    fileSize: 10 * (10 ** 6), // 10MB
  }
};

module.exports = multerConfig;
