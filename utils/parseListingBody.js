function parseListingBody(body, thumbnailFilename) {
  const listingBody = {
    description: body.description,
    instruction: body.instruction,
    is_color: body.isColor === 'true',
    paper_size: body.paperSize,
    title: body.title,
    thumbnail_id: thumbnailFilename
  };
  if (body.deadline !== 'null') {
    listingBody.deadline = new Date(body.deadline);
  }
  return listingBody;
}

module.exports = parseListingBody;
