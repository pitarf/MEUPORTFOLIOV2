-- Create site_config table for global settings
CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Rafael Pita Solutions',
    contact_email TEXT DEFAULT 'contato@rafaelpitaoficial.com.br',
    contact_phone TEXT DEFAULT '(21) 96614-9077',
    contact_address TEXT DEFAULT 'Rio de Janeiro, RJ - Brasil',
    hero_title TEXT DEFAULT 'Rafael Pita Solutions',
    hero_subtitle TEXT DEFAULT 'Criatividade e tecnologia em um só lugar',
    hero_description TEXT DEFAULT 'Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas para o seu negócio.',
    footer_description TEXT DEFAULT 'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital.',
    stats_projects_count INTEGER DEFAULT 500,
    stats_clients_count INTEGER DEFAULT 200,
    stats_success_rate INTEGER DEFAULT 98,
    social_links JSONB DEFAULT '{"facebook": "#", "instagram": "#", "linkedin": "#", "twitter": "#", "whatsapp": "https://wa.me/5521966149077"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access"
ON site_config FOR SELECT
TO public
USING (true);

-- Allow admin update access (assuming only authenticated users with specific roles or just auth users for now based on previous patterns)
-- Checking previous patterns, usually we protect by auth. Or specific admin logic. 
-- For now, allowing authenticated update.
CREATE POLICY "Admin update access"
ON site_config FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin insert access"
ON site_config FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert the SINGLETON row (only one row should exist)
INSERT INTO site_config (
    site_name, 
    contact_email, 
    contact_phone, 
    contact_address, 
    hero_title, 
    hero_subtitle, 
    hero_description, 
    footer_description,
    stats_projects_count,
    stats_clients_count,
    stats_success_rate,
    social_links
)
SELECT 
    'Rafael Pita Solutions',
    'contato@rafaelpitaoficial.com.br',
    '(21) 96614-9077',
    'Rio de Janeiro, RJ - Brasil',
    'Rafael Pita Solutions',
    'Criatividade e tecnologia em um só lugar',
    'Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas para o seu negócio.',
    'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital.',
    500,
    200,
    98,
    '{"facebook": "#", "instagram": "#", "linkedin": "#", "twitter": "#", "whatsapp": "https://wa.me/5521966149077?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Rafael%20Pita%20Solutions."}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_config);
