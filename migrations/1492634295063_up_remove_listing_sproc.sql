USE print_to_resist;

DROP PROCEDURE IF EXISTS remove_listing;
DELIMITER //

CREATE PROCEDURE remove_listing
(
  listing_id_var INT
)
BEGIN
  DELETE FROM listings
  WHERE listing_id = listing_id_var;
END//

DELIMITER ;
