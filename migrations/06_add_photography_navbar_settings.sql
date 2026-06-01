-- Add columns for custom navbar branding in landing pages
ALTER TABLE public.landing_page_content
ADD COLUMN nav_logo_url text,
ADD COLUMN nav_site_name text;
