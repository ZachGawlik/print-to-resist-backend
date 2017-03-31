function create(connection, listingObj, poster) {
  return connection.beginTransactionAsync()
  .then(() => connection.queryAsync(
    'INSERT INTO listings SET ?',
    listingObj
  ))
  .then(results => connection.queryAsync(
    'INSERT INTO images SET ?',
    {
      listing_id: results.insertId,
      image_id: poster.filename,
      mimetype: poster.mimetype
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

module.exports = {
  create,
  getAll
};
