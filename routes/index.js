const routes = require('express').Router();
const pool = require('../config/mysqlConnector');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

function get_from_example_db(req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      connection.release();
      res.json({code: 100, status: 'Error in connection database'});
      return;
    }
    console.log(`connected as id ${connection.threadId}`);

    connection.query('SELECT * FROM movies', (err, rows) => {
      connection.release();
      if(!err) {
        console.log('The solution is', rows);
        res.json(rows);
      } else {
        res.json({code: 100, status: 'error while performing query'});
      }
    });

    connection.on('error', (err) => {
        res.json({code: 100, status: 'error in connection database'})
        console.log('Error while performing query');
        console.log(err);
        return;
    });
  });
}

routes.get('/listing', (req, res, next) => {
  get_from_example_db(req, res);
});

module.exports = routes;
