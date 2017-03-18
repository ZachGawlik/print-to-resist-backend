USE print_to_resist;

CREATE TABLE listings (
  listing_id      INT             PRIMARY KEY  AUTO_INCREMENT,
  thumbnail       VARCHAR(100)    NOT NULL,
  deadline        DATE,
  description     VARCHAR(1000),
  special_notes   VARCHAR(1000),
  is_color        BOOLEAN         NOT NULL     DEFAULT 0,
  paper_size      ENUM('Letter', 'Tabloid')    NOT NULL DEFAULT 'Letter',
  date_submitted  DATETIME        NOT NULL     DEFAULT CURRENT_TIMESTAMP,
  is_approved     BOOLEAN         NOT NULL     DEFAULT 0
);

CREATE TABLE images (
  id          CHAR(32)       PRIMARY KEY,
  mimetype    VARCHAR(16)    NOT NULL,
  listing_id  INT            NOT NULL,
  CONSTRAINT images_fk_listings
    FOREIGN KEY (listing_id)
    REFERENCES listings (listing_id)
);

CREATE TABLE tags (
  tag         VARCHAR(20)  NOT NULL,
  listing_id  INT          NOT NULL,
  CONSTRAINT tags_pk
    PRIMARY KEY (tag, listing_id),
  CONSTRAINT tags_fk_listings
    FOREIGN KEY (listing_id)
    REFERENCES listings (listing_id)
);
