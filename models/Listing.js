function create(connection, listingObj, posterFilename) {
  return connection.beginTransactionAsync()
  .then(() => connection.queryAsync(
    'INSERT INTO listings SET ?',
    listingObj
  ))
  .then(results => connection.queryAsync(
    'INSERT INTO images SET ?',
    {
      listing_id: results.insertId,
      image_id: posterFilename,
    }
  ))
  .then(() => connection.commitAsync()) // prevent passing in result argument
  .catch((error) => {
    connection.rollback();
    throw error;
  });
}

function getAll(connection) {
  return connection.queryAsync('SELECT * FROM listings');
}

function getOne(connection, listingId) {
  return connection.queryAsync('SELECT * FROM listings WHERE listing_id = ?', listingId);
}

module.exports = {
  create,
  getAll,
  getOne
};
