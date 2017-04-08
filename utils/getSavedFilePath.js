function getSavedFilePath(filenameWithExt) {
  return `uploads/${filenameWithExt}`;
}

module.exports = getSavedFilePath;
