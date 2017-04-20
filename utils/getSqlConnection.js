const pool = require('../config/mysqlConnector');

function getSqlConnection() {
  return pool.getConnectionAsync().disposer((connection) => {
    connection.release();
  });
}

module.exports = getSqlConnection;
