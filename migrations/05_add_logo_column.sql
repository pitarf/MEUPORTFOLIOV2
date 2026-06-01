-- Add logo_url column
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create a new storage bucket for site assets if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage (site-assets)
-- 1. Public Read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'site-assets' );

-- 2. Authenticated Upload (Insert) - Any auth user can upload (since we are multi-tenant SaaS)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'site-assets' );

-- 3. Authenticated Update/Delete (Optional, for managing own files)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'site-assets' );

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'site-assets' );
