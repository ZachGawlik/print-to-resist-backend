const parseMysqlListing = require('../utils/parseMysqlListing');

function createTag(connection, listingId, tag) {
  return connection.queryAsync(
    'INSERT INTO tags SET ?',
    {
      tag,
      listing_id: listingId
    }
  );
}

function createLink(connection, listingId, link) {
  return connection.queryAsync(
    'INSERT INTO links SET ?',
    {
      url: link,
      listing_id: listingId
    }
  );
}

function create(connection, listingObj, posterFilename, tags, links) {
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
  .then(() => {
    const linkPromises = links.map(link => createLink(connection, listingId, link));
    return Promise.all(linkPromises);
  })
  .then(() => connection.commitAsync()) // prevent passing in result argument
  .catch((error) => {
    connection.rollback();
    throw error;
  });
}

function getAll(connection) {
  return connection.queryAsync('CALL get_approved_listings()')
  .then((result) => {
    const rows = result[0];
    const jsonRows = JSON.parse(JSON.stringify(rows));
    return jsonRows.map(parseMysqlListing);
  });
}

function getOne(connection, listingId) {
  return connection.queryAsync('CALL get_one_listing(?)', listingId)
  .then((result) => {
    const rows = result[0];
    if (rows.length === 0) {
      throw Error(`Poster with id ${listingId} does not exist`);
    }
    const jsonRow = JSON.parse(JSON.stringify(rows[0]));
    return parseMysqlListing(jsonRow);
  });
}

module.exports = {
  create,
  getAll,
  getOne
};
