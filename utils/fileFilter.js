const ACCEPTED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];

function fileFilter(req, file, cb) {
  if (!ACCEPTED_MIMETYPES.includes(file.mimetype)) {
    return cb(
      new Error(`Only files of types ${ACCEPTED_MIMETYPES} allowed`),
      false
    );
  }
  return cb(null, true);
}
module.exports = fileFilter;
