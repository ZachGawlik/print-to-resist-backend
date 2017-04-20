USE print_to_resist;

DROP PROCEDURE IF EXISTS get_approved_listings;
DELIMITER //

CREATE PROCEDURE get_approved_listings ()
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
  WHERE l.is_approved = 1;
END//

DELIMITER ;
