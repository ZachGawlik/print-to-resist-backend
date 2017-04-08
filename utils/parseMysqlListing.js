const camelcaseKeys = require('camelcase-keys');

function parseListing(listing) {
  const camelcaseListing = camelcaseKeys(listing);
  return Object.assign(
    {},
    camelcaseListing,
    { isColor: camelcaseListing.isColor === 1 },
    { imageIds: camelcaseListing.imageIds.split(',') }
  );
}

module.exports = parseListing;
