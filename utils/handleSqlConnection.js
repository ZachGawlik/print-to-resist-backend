const using = require('bluebird').using;
const getSqlConnection = require('./getSqlConnection');

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
