import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const backupJsonPath = path.join(rootDir, 'backups', 'backup_latest.json');
const backup = JSON.parse(fs.readFileSync(backupJsonPath, 'utf8'));

let sql = `-- =====================================================================
-- FULL DATABASE INITIALIZATION SCRIPT - RAFAEL PITA SOLUTIONS
-- Host: Oracle Cloud VPS (PostgreSQL 15 + PostgREST)
-- Data: ${new Date().toISOString()}
-- =====================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles de Autenticação do PostgREST
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'pita_secure_authenticator_2026';
  END IF;
END
$$;

GRANT anon TO authenticator;

-- 1. Tabela: categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela: projects
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    client TEXT,
    year INTEGER DEFAULT 2025,
    services JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    project_url TEXT,
    main_image_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    allow_image_download BOOLEAN DEFAULT true,
    video_urls JSONB DEFAULT '[]'::jsonb,
    main_image_aspect_ratio TEXT DEFAULT '16:9',
    gallery_aspect_ratio TEXT DEFAULT '4:5',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Tabela: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    rating INTEGER DEFAULT 5,
    comment TEXT,
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT true,
    likes INTEGER DEFAULT 0,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela: site_config
CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Rafael Pita Solutions',
    contact_email TEXT DEFAULT 'contato@rafaelpitaoficial.com.br',
    contact_phone TEXT DEFAULT '(21) 96614-9077',
    contact_address TEXT DEFAULT 'Rio de Janeiro, RJ - Brasil',
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    footer_description TEXT,
    stats_projects_count INTEGER DEFAULT 500,
    stats_clients_count INTEGER DEFAULT 200,
    stats_success_rate INTEGER DEFAULT 98,
    social_links JSONB DEFAULT '{}'::jsonb,
    user_id UUID,
    logo_url TEXT,
    site_title TEXT,
    site_description TEXT,
    site_keywords TEXT,
    favicon_url TEXT,
    og_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela: landing_page_content
CREATE TABLE IF NOT EXISTS landing_page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT NOT NULL UNIQUE,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_image_url TEXT,
    specialties JSONB DEFAULT '[]'::jsonb,
    nav_logo_url TEXT,
    nav_site_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tabela: services
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    color TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Tabela: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    plan_name TEXT NOT NULL,
    price_monthly NUMERIC(10,2),
    price_yearly NUMERIC(10,2),
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Tabela: support_tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT UNIQUE,
    client_name TEXT,
    client_email TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'aberto',
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Tabela: pricing_settings (Módulo de Precificação HH)
CREATE TABLE IF NOT EXISTS pricing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hourly_rate NUMERIC(10, 2) DEFAULT 120.00 NOT NULL,
    profit_margin_percent NUMERIC(5, 2) DEFAULT 20.00 NOT NULL,
    contingency_margin_percent NUMERIC(5, 2) DEFAULT 15.00 NOT NULL,
    fixed_costs_monthly NUMERIC(10, 2) DEFAULT 0.00,
    min_project_value NUMERIC(10, 2) DEFAULT 500.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Tabela: budgets (Módulo de Orçamentos e CRM)
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    client_company TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    scope_description TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb,
    estimated_hours NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    hourly_rate_used NUMERIC(10, 2) DEFAULT 120.00 NOT NULL,
    subtotal NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    profit_margin_percent NUMERIC(5, 2) DEFAULT 0,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    final_price NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    payment_terms TEXT DEFAULT '50% de entrada + 50% na entrega',
    deadline_days INTEGER DEFAULT 15,
    status TEXT NOT NULL DEFAULT 'pendente',
    notes TEXT,
    ai_scope_analysis JSONB DEFAULT '{}'::jsonb,
    ai_sales_pitch TEXT,
    ai_objections_handling JSONB DEFAULT '[]'::jsonb,
    project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
    project_url TEXT,
    main_image_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Função get_average_rating (RPC do sistema)
CREATE OR REPLACE FUNCTION get_average_rating()
RETURNS TABLE(average_rating NUMERIC, total_reviews BIGINT) 
LANGUAGE sql
STABLE
AS $$
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 1), 5.0) as average_rating,
        COUNT(*)::bigint as total_reviews
    FROM reviews
    WHERE is_approved = true;
$$;

-- INJEÇÃO DOS DADOS DO BACKUP
`;

const tableOrder = [
    'categories',
    'projects',
    'reviews',
    'site_config',
    'landing_page_content',
    'services',
    'subscriptions'
];

for (const tableName of tableOrder) {
    const rows = backup.tables[tableName] || [];
    if (rows.length === 0) continue;

    sql += `\n-- Dados da Tabela: ${tableName} (${rows.length} registros)\n`;
    for (const row of rows) {
        const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
        const values = Object.values(row).map(val => {
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'number' || typeof val === 'boolean') return val;
            if (typeof val === 'object') {
                const jsonStr = JSON.stringify(val).replace(/'/g, "''");
                return `'${jsonStr}'::jsonb`;
            }
            const escaped = String(val).replace(/'/g, "''");
            return `'${escaped}'`;
        }).join(', ');

        sql += `INSERT INTO "${tableName}" (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
    }
}

sql += `
-- Inserir dados padrão em pricing_settings se vazio
INSERT INTO pricing_settings (hourly_rate, profit_margin_percent, contingency_margin_percent, min_project_value, notes)
SELECT 120.00, 20.00, 15.00, 500.00, 'Configuração base inicial de precificação'
WHERE NOT EXISTS (SELECT 1 FROM pricing_settings);

-- Atualização das Sequences
SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1));
SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1));
SELECT setval('reviews_id_seq', COALESCE((SELECT MAX(id) FROM reviews), 1));
SELECT setval('services_id_seq', COALESCE((SELECT MAX(id) FROM services), 1));
SELECT setval('subscriptions_id_seq', COALESCE((SELECT MAX(id) FROM subscriptions), 1));

-- Permissões globais para o PostgREST (Leitura e Escrita pelo frontend)
GRANT USAGE ON SCHEMA public TO anon, authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticator;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticator;
`;

const outputPath = path.join(rootDir, 'backups', 'full_database_init.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`✅ Arquivo gerado com sucesso: ${outputPath}`);
