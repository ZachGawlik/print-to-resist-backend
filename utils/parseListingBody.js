function parseListingBody(req) {
  const listingBody = {
    description: req.body.description,
    instruction: req.body.instruction,
    is_color: req.body.isColor === 'true',
    paper_size: req.body.paperSize,
    title: req.body.title
  };
  if (req.body.deadline !== 'null') {
    listingBody.deadline = new Date(req.body.deadline);
  }
  return listingBody;
}

module.exports = parseListingBody;
