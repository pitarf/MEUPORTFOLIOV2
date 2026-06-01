-- Add display_order column to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Initialize display_order based on current ID order (optional but recommended for existing data)
WITH numbered_services AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
  FROM services
)
UPDATE services
SET display_order = numbered_services.rn
FROM numbered_services
WHERE services.id = numbered_services.id;
