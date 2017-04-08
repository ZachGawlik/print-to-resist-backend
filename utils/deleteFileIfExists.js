const fs = require('fs');

function deleteFileIfExists(path) {
  if (!!path && fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

module.exports = deleteFileIfExists;
