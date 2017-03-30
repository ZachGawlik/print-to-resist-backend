const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multerConfig');
const pool = require('../config/mysqlConnector');
const parseListingBody = require('../utils/parseListingBody');
const using = require('bluebird').using;

const upload = multer(multerConfig);
const listingUpload = upload.fields([
  { name: 'poster', maxCount: 1 },
  // {name: 'thumbnail', maxCount: 1}
]);

function getPosterObj(poster, listing_id) {
  return {
    listing_id,
    image_id: poster.filename,
    mimetype: poster.mimetype
  };
}

routes.get('/', (req, res) => res.status(200).json({ message: 'Connected!' }));

function getSqlConnection() {
  return pool.getConnectionAsync().disposer((connection) => {
    connection.release();
  });
}

function handleSqlConnection(req, res, onConnection) {
  using(
    getSqlConnection(),
    connection => onConnection(req, res, connection)
  ).catch((err) => {
    console.error(`ERROR. ${err.message}`);
    return res.status(500).json({ message: 'Error connecting to database' });
  });
}

function getListings(req, res, connection) {
  console.log(`connected as id ${connection.threadId}`);
  return connection.queryAsync('SELECT * FROM listings')
  .then(rows => res.json(rows))
  .catch((err) => {
    console.error(`ERROR. ${err.message}`);
    return res.status(500).json({ message: 'Error while performing query' });
  });
}

function postListing(req, res, connection) {
  console.log(`connected as id ${connection.threadId}`);
  connection.beginTransactionAsync()
  .then(() => connection.queryAsync(
    'INSERT INTO listings SET ?',
    parseListingBody(req)
  ))
  .then(results => connection.queryAsync(
    'INSERT INTO images SET ?',
    getPosterObj(req.files.poster[0], results.insertId)
  ))
  .then(() => connection.commitAsync()) // prevent passing in result argument
  .then(() => res.status(200).json({ message: 'Created successfully' }))
  .catch(() => {
    connection.rollback();
    return res.status(500).json({ message: 'ugh' });
  });
}

routes.get('/listing', (req, res) => {
  handleSqlConnection(req, res, getListings);
});

// TODO: avoid uploading/saving the images unless success?
routes.post('/listing', listingUpload, (req, res) => {
  handleSqlConnection(req, res, postListing);
});

module.exports = routes;
