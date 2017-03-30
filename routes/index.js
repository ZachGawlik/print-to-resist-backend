const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multerConfig');
const pool = require('../config/mysqlConnector');
const parseListingBody = require('../utils/parseListingBody');

const upload = multer(multerConfig);
const listingUpload = upload.fields([
  {name: 'poster', maxCount: 1},
  // {name: 'thumbnail', maxCount: 1}
]);

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Connected!' });
});

function get_listings(req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      connection.release();
      console.log(err.message);
      return res.status(100).json({ message: 'Error connecting to database' })
    }
    console.log(`connected as id ${connection.threadId}`);

    connection.query('SELECT * FROM listings', (err, rows) => {
      connection.release();
      if (!err) {
        return res.json(rows);
      } else {
        return res.status(100).json({ message: 'Error while performing query' });
      }
    });
  });
}

routes.get('/listing', (req, res, next) => {
  get_listings(req, res);
});

// TODO: avoid uploading/saving the images unless success?
routes.post('/listing', listingUpload, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return next(err);
    }
    console.log(`connected as id ${connection.threadId}`);

    connection.beginTransaction(function(err) {
      if (err) { throw err; }
      connection.query(
        'INSERT INTO listings SET ?',
        parseListingBody(req),
        (error, results, fields) => {
          if (error) {
            return connection.rollback(() => next(error));
          }
          const poster = req.files.poster[0];
          const posterImage = {
            image_id: poster.filename,
            listing_id: results.insertId,
            mimetype: poster.mimetype
          };
          connection.query(
            'INSERT INTO images SET ?',
            posterImage,
            (error, results, fields) => {
              if (error) {
                connection.rollback(() => next(error));
                return res.status(500).json({message: 'ugh'});
              }
              connection.commit(function(err) {
                if (error) {
                  return connection.rollback(() => next(error));
                }
                return res.status(200).json({message: 'Created successfully'});
              });
            }
          );
        }
      );
    });
  });
});

module.exports = routes;
