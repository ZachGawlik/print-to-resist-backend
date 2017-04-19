USE print_to_resist;

ALTER TABLE tags
DROP FOREIGN KEY tags_fk_listings;

ALTER TABLE tags
ADD CONSTRAINT tags_fk_listings
   FOREIGN KEY (listing_id)
    REFERENCES listings (listing_id)
     ON UPDATE CASCADE
     ON DELETE CASCADE;
