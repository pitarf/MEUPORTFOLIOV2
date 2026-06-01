-- Create a function to get the average rating from approved reviews
CREATE OR REPLACE FUNCTION get_average_rating()
RETURNS numeric AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM reviews
  WHERE approved = true;
  
  -- Return 5 if no reviews exist (default fallback), or the actual average rounded to 1 decimal
  RETURN COALESCE(ROUND(avg_rating, 1), 5.0);
END;
$$ LANGUAGE plpgsql;
