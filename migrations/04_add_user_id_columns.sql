-- Add user_id column to site_config
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS for site_config
DROP POLICY IF EXISTS "Public read access" ON site_config;
DROP POLICY IF EXISTS "Admin update access" ON site_config;
DROP POLICY IF EXISTS "Admin insert access" ON site_config;

-- 1. Read: Everyone can read (Public Portfolio), BUT usually filtered by query.
--    For now, open read is fine, frontend filters.
CREATE POLICY "Public read access"
ON site_config FOR SELECT
TO public
USING (true);

-- 2. Insert: Authenticated users can insert THEIR OWN config.
CREATE POLICY "Users can insert own config"
ON site_config FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Update: Users can only update their own config.
CREATE POLICY "Users can update own config"
ON site_config FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Delete: Users can delete their own config.
CREATE POLICY "Users can delete own config"
ON site_config FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Optional: If you want to associate other tables like 'projects' or 'landing_page_content':
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- (And apply similar RLS policies)
