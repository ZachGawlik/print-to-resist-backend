USE print_to_resist;

DROP PROCEDURE IF EXISTS get_one_listing;
DELIMITER //

CREATE PROCEDURE get_one_listing (
  listing_id_var INT
)
BEGIN
  SELECT l.*,
         (SELECT GROUP_CONCAT(image_id SEPARATOR ",")
          FROM images
          WHERE listing_id = l.listing_id) AS image_ids,
         (SELECT GROUP_CONCAT(tag SEPARATOR ",")
          FROM tags
          WHERE listing_id = l.listing_id) AS tags,
         (SELECT GROUP_CONCAT(url SEPARATOR ",")
          FROM links
          WHERE listing_id = l.listing_id) AS links
  FROM listings l
  WHERE l.listing_id = listing_id_var;
END//

DELIMITER ;
