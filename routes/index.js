const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multerConfig');
const parseListingBody = require('../utils/parseListingBody');
const handleSqlConnection = require('../utils/handleSqlConnection');
const Listing = require('../models/Listing');

const upload = multer(multerConfig);
const listingUpload = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

function getListings(req, res, connection) {
  return Listing.getAll(connection)
  .then(rows => res.json(rows))
  .catch((err) => {
    console.error(`ERROR. ${err.message}`);
    return res.status(500).json({ message: 'Error while performing query' });
  });
}

function postListing(req, res, connection) {
  Listing.create(
    connection,
    parseListingBody(req.body, req.files.thumbnail[0]),
    req.files.poster[0]
  )
  .then(() => res.status(200).json({ message: 'Created successfully' }))
  .catch(() => res.status(500).json({ message: 'ugh' }));
}

routes.get('/', (req, res) => res.status(200).json({ message: 'Connected!' }));

routes.get('/listing', (req, res) => {
  handleSqlConnection(req, res, getListings);
});

// TODO: avoid uploading/saving the images unless success?
routes.post('/listing', listingUpload, (req, res) => {
  handleSqlConnection(req, res, postListing);
});

module.exports = routes;
