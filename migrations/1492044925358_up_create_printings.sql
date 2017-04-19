USE print_to_resist;

CREATE TABLE printings (
  printings_id  INT       PRIMARY KEY  AUTO_INCREMENT,
  listing_id    INT       NOT NULL,
  copies        INT       NOT NULL,
  print_date    DATETIME  NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_copies CHECK (copies > 0 AND copies <= 200),
  CONSTRAINT printings_fk_listings
    FOREIGN KEY (listing_id)
    REFERENCES listings (listing_id)
	ON UPDATE CASCADE
	ON DELETE CASCADE
);
