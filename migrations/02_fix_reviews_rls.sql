-- Enable RLS on reviews table (if not already enabled)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon and authenticated) to insert reviews
-- They are created with is_approved = false by default, so it's safe.
CREATE POLICY "Public reviews insert"
ON reviews
FOR INSERT
TO public
WITH CHECK (true);

-- Allow everyone to read approved reviews
CREATE POLICY "Public reviews read approved"
ON reviews
FOR SELECT
TO public
USING (is_approved = true);
