USE print_to_resist;

ALTER TABLE images
  CHANGE image_id image_id VARCHAR(38),
  DROP COLUMN mimetype;

ALTER TABLE listings
  CHANGE thumbnail_id thumbnail_id VARCHAR(38),
  DROP COLUMN thumbnail_mimetype;
