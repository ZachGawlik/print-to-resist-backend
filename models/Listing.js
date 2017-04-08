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
  return connection.queryAsync(`
    SELECT l.*, GROUP_CONCAT(i.image_id SEPARATOR ",") AS image_ids
    FROM listings l
    JOIN images i USING (listing_id)
    GROUP BY l.listing_id;
  `);
}

function getOne(connection, listingId) {
  return connection.queryAsync(
    `SELECT l.*, GROUP_CONCAT(i.image_id SEPARATOR ",") AS image_ids
    FROM listings l
    JOIN images i USING (listing_id)
    WHERE l.listing_id = ?
    GROUP BY l.listing_id;
    `,
    listingId
  );
}

module.exports = {
  create,
  getAll,
  getOne
};
