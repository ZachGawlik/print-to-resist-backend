const appRoot = require('app-root-path');
const path = require('path');

function getSavedFilePath(filenameWithExt) {
  return path.resolve(appRoot.toString(), 'uploads', filenameWithExt);
}

module.exports = getSavedFilePath;
