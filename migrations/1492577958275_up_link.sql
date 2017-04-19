USE print_to_resist;

CREATE TABLE links (
  listing_id    INT           NOT NULL,
  url           VARCHAR(150)  NOT NULL,
  CONSTRAINT links_fk_listings
    FOREIGN KEY (listing_id)
    REFERENCES listings (listing_id)
	ON UPDATE CASCADE
	ON DELETE CASCADE
)
