USE print_to_resist;

DROP PROCEDURE IF EXISTS approve_listing;
DELIMITER //

CREATE PROCEDURE approve_listing
(
  listing_id_var INT
)
BEGIN
  UPDATE listings
  SET is_approved = 1
  WHERE listing_id = listing_id_var;
END//

DELIMITER ;
