const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multerConfig');
const deleteFileIfExists = require('../utils/deleteFileIfExists');
const getSavedFilePath = require('../utils/getSavedFilePath');
const parseListingBody = require('../utils/parseListingBody');
const parseMysqlListing = require('../utils/parseMysqlListing');
const handleSqlConnection = require('../utils/handleSqlConnection');
const securelySaveImages = require('../utils/securelySaveImages');
const Listing = require('../models/Listing');

const upload = multer(multerConfig);
const listingUpload = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

function getListing(req, res, connection) {
  return Listing.getOne(connection, req.params.listingId)
  .then((rows) => {
    if (rows.length === 0) {
      throw Error(`Poster with id ${req.params.listingId} does not exist`);
    }
    const jsonRow = JSON.parse(JSON.stringify(rows[0]));
    return parseMysqlListing(jsonRow);
  })
  .then(row => res.json(row))
  .catch(err => res.status(500).json({ message: err.message }));
}

function getListings(req, res, connection) {
  return Listing.getAll(connection)
  .then((rows) => {
    const jsonRows = JSON.parse(JSON.stringify(rows));
    return jsonRows.map(parseMysqlListing);
  })
  .then(rows => res.json(rows))
  .catch(err => res.status(500).json({ message: err.message }));
}

function postListing(req, res, connection) {
  const tempThumbnail = req.files.thumbnail[0];
  const tempPoster = req.files.poster[0];
  let thumbnailFilename;
  let posterFilename;

  return securelySaveImages([tempThumbnail, tempPoster])
  .then((newPaths) => {
    thumbnailFilename = newPaths[0];
    posterFilename = newPaths[1];
    return Listing.create(
      connection,
      parseListingBody(req.body, thumbnailFilename),
      posterFilename
    );
  })
  .then(() => res.status(200).json({ message: 'Created successfully' }))
  .catch((err) => {
    deleteFileIfExists(tempThumbnail.path);
    deleteFileIfExists(tempPoster.path);
    deleteFileIfExists(getSavedFilePath(thumbnailFilename));
    deleteFileIfExists(getSavedFilePath(posterFilename));
    return res.status(500).json({ message: err.message });
  });
}

routes.get('/', (req, res) => res.status(200).json({ message: 'Connected!' }));

routes.get('/listing', (req, res) => {
  handleSqlConnection(req, res, getListings);
});

routes.get('/listing/:listingId', (req, res) => {
  if (isNaN(parseInt(req.params.listingId, 10))) {
    return res.status(500).json({ message: 'Poster id must be a number' });
  }
  return handleSqlConnection(req, res, getListing);
});

routes.post('/listing', listingUpload, (req, res) => {
  handleSqlConnection(req, res, postListing);
});

module.exports = routes;
