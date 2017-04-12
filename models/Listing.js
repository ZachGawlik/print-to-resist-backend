function createTag(connection, listingId, tag) {
  return connection.queryAsync(
    'INSERT INTO tags SET ?',
    {
      tag,
      listing_id: listingId
    }
  );
}

function create(connection, listingObj, posterFilename, tags) {
  let listingId;
  return connection.beginTransactionAsync()
  .then(() => connection.queryAsync(
    'INSERT INTO listings SET ?',
    listingObj
  ))
  .then((results) => {
    listingId = results.insertId;
    connection.queryAsync(
      'INSERT INTO images SET ?',
      {
        listing_id: listingId,
        image_id: posterFilename,
      }
    );
  })
  .then(() => {
    const tagPromises = tags.map(tag => createTag(connection, listingId, tag));
    return Promise.all(tagPromises);
  })
  .then(() => connection.commitAsync()) // prevent passing in result argument
  .catch((error) => {
    connection.rollback();
    throw error;
  });
}

const getQuery = `
  SELECT l.*,
         (SELECT GROUP_CONCAT(image_id SEPARATOR ",")
          FROM images
          WHERE listing_id = l.listing_id) AS image_ids,
         (SELECT GROUP_CONCAT(tag SEPARATOR ",")
          FROM tags
          WHERE listing_id = l.listing_id) AS tags
  FROM listings l
`;
const getOneQuery = `${getQuery} WHERE l.listing_id = ?`;

function getAll(connection) {
  return connection.queryAsync(getQuery);
}

function getOne(connection, listingId) {
  return connection.queryAsync(getOneQuery, listingId);
}

module.exports = {
  create,
  getAll,
  getOne
};
