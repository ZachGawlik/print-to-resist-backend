const using = require('bluebird').using;
const deleteFileIfExists = require('../utils/deleteFileIfExists');
const getSavedFilePath = require('../utils/getSavedFilePath');
const getSqlConnection = require('../utils/getSqlConnection');
const Listing = require('../models/Listing');

async function deleteListingAndImages(connection, listingId) {
  const listing = await Listing.getOne(connection, listingId);
  connection.queryAsync('CALL remove_listing(?)', listingId)
  .then(() => {
    deleteFileIfExists(getSavedFilePath(listing.thumbnailId));
    listing.imageIds.forEach((imageId) => {
      deleteFileIfExists(getSavedFilePath(imageId));
    });
  })
  .then(() => {
    console.log(`Deleted listing and images for ${listingId}`);
    connection.destroy();
  })
  .catch((err) => {
    console.error(err);
    connection.destroy();
  });
}

function main(connection) {
  const listingId = parseInt(process.argv[2], 10);
  if (!isNaN(listingId)) {
    deleteListingAndImages(connection, listingId);
  }
}

using(
  getSqlConnection(),
  main
);
