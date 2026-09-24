-- 11_fix_reviews_rpc.sql
-- Corrige o nome da coluna de 'approved' para 'is_approved' na função get_average_rating

CREATE OR REPLACE FUNCTION get_average_rating()
RETURNS numeric AS $$
DECLARE
  avg_rating numeric;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM reviews
  WHERE is_approved = true;
  
  -- Retorna 5.0 se não existirem avaliações cadastradas, ou a média real arredondada para 1 casa decimal
  RETURN COALESCE(ROUND(avg_rating, 1), 5.0);
END;
$$ LANGUAGE plpgsql;
