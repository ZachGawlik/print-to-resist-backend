const multer = require('multer');
const fileFilter = require('../utils/fileFilter');

const multerConfig = {
  storage: multer.diskStorage({
    destination: '/tmp/uploads'
  }),
  fileFilter,
  limits: {
    fileSize: 2 * (10 ** 6), // 2MB
  }
};

module.exports = multerConfig;
