-- Migration to add SEO and branding fields to site_config
-- Extremely safe: Uses IF NOT EXISTS to prevent any data loss in production

ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS site_title TEXT DEFAULT 'Rafael Pita Solutions',
ADD COLUMN IF NOT EXISTS site_description TEXT DEFAULT 'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas.',
ADD COLUMN IF NOT EXISTS site_keywords TEXT DEFAULT 'portfólio, rafael pita, soluções digitais, desenvolvimento web, design gráfico, fotografia, power bi',
ADD COLUMN IF NOT EXISTS favicon_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Update the existing config with defaults if they are blank (so they don't start null in the app)
UPDATE site_config
SET 
    site_title = COALESCE(site_title, 'Rafael Pita Solutions'),
    site_description = COALESCE(site_description, 'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas.'),
    site_keywords = COALESCE(site_keywords, 'portfólio, rafael pita, soluções digitais, desenvolvimento web, design gráfico, fotografia, power bi')
WHERE id IS NOT NULL;
