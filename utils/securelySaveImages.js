const Promise = require('bluebird');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const getSavedFilePath = require('./getSavedFilePath')

function saveImagePermanently(file) {
  const filenameWithExt = file.filename + path.extname(file.originalname);
  const newPath = getSavedFilePath(filenameWithExt);
  return fs.renameAsync(file.path, newPath).then(() => filenameWithExt);
}

function hasValidExtension(uploadedFile) {
  const buffer = readChunk.sync(uploadedFile.path, 0, 4100);
  const magicNumbersType = fileType(buffer);
  return magicNumbersType.mime === uploadedFile.mimetype;
}

function allHaveValidExtension(uploadedFiles) {
  return uploadedFiles.reduce(
    (acc, file) => acc && hasValidExtension(file), true
  );
}

// Prevents vulnerabilities with trusting user-supplied file extensions
// Described in detail here: https://github.com/expressjs/multer/issues/439
function securelySaveImages(uploadedFiles) {
  if (allHaveValidExtension(uploadedFiles)) {
    return Promise.all(uploadedFiles.map(saveImagePermanently));
  }
  return Promise.reject(new Error('Submitted files have invalid type'));
}

module.exports = securelySaveImages;
