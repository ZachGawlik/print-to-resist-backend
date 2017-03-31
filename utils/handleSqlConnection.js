const pool = require('../config/mysqlConnector');
const using = require('bluebird').using;

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

module.exports = handleSqlConnection;
