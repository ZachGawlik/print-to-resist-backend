USE print_to_resist;

ALTER TABLE listings CHANGE special_notes instruction VARCHAR(1000);
ALTER TABLE listings
  DROP COLUMN thumbnail;

ALTER TABLE listings ADD title VARCHAR(100);

ALTER TABLE images CHANGE id image_id CHAR(32);
