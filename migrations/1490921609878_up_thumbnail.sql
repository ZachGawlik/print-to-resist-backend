USE print_to_resist;

ALTER TABLE images
DROP FOREIGN KEY images_fk_listings;

ALTER TABLE images
ADD CONSTRAINT images_fk_listings
   FOREIGN KEY (listing_id)
    REFERENCES listings (listing_id)
     ON UPDATE CASCADE
     ON DELETE CASCADE;

DELETE FROM listings;

ALTER TABLE listings
        ADD thumbnail_id        CHAR(32)     NOT NULL  UNIQUE,
        ADD thumbnail_mimetype  VARCHAR(32)  NOT NULL;
