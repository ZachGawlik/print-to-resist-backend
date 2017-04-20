const using = require('bluebird').using;
const pool = require('../config/mysqlConnector');

function getSqlConnection() {
  return pool.getConnectionAsync().disposer((connection) => {
    connection.release();
  });
}

async function approveListing(connection, listingId) {
  connection.queryAsync('CALL approve_listing(?)', listingId)
  .then((result) => {
    if (result.affectedRows === 0) {
      throw Error(`Poster with id ${listingId} does not exist`);
    }
    console.log(`Approved listing ${listingId}`);
    connection.destroy();
  })
  .catch((err) => {
    console.error(err.message);
    connection.destroy();
  });
}

function main(connection) {
  const listingId = parseInt(process.argv[2], 10);
  if (!isNaN(listingId)) {
    approveListing(connection, listingId);
  }
}

using(
  getSqlConnection(),
  main
);
