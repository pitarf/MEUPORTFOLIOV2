-- Migration 15: CRM de Prospecção Ativa, Leads e Rastreamento de E-mails
-- Data: 2026-11-05
-- Autor: Rafael Pita Solutions / MeuPortfolio v2
-- Compatível com PostgreSQL 15 + Supabase / PostgREST na VPS

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Criação da Tabela de Leads do CRM
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    original_title TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    niche VARCHAR(100) DEFAULT 'nutricao',
    city VARCHAR(100),
    neighborhood VARCHAR(100),
    address TEXT,
    google_rating NUMERIC(2, 1) DEFAULT 5.0,
    google_reviews_count INTEGER DEFAULT 0,
    has_website BOOLEAN DEFAULT FALSE,
    website_url TEXT,
    status VARCHAR(50) DEFAULT 'descoberto', -- descoberto, qualificado, email_enviado, email_aberto, link_clicado, respondeu, proposta_enviada, fechado, perdido
    demo_url TEXT,
    emails_sent_count INTEGER DEFAULT 0,
    opens_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    last_email_sent_at TIMESTAMPTZ,
    last_opened_at TIMESTAMPTZ,
    last_clicked_at TIMESTAMPTZ,
    deal_value NUMERIC(10, 2) DEFAULT 297.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices de Performance para o Funil
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email ON public.crm_leads(email);
CREATE INDEX IF NOT EXISTS idx_crm_leads_niche ON public.crm_leads(niche);
CREATE INDEX IF NOT EXISTS idx_crm_leads_city ON public.crm_leads(city);
CREATE INDEX IF NOT EXISTS idx_crm_leads_created_at ON public.crm_leads(created_at DESC);

-- 2. Criação da Tabela de Logs e Rastreamento de E-mails Disparados
CREATE TABLE IF NOT EXISTS public.crm_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    tracking_token VARCHAR(100) UNIQUE NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    template_type VARCHAR(100) DEFAULT 'nutricionista_padrao',
    status VARCHAR(50) DEFAULT 'enviado', -- enviado, aberto, clicado, falhou
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    error_message TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices de Busca por Token de Tracking
CREATE INDEX IF NOT EXISTS idx_crm_email_logs_token ON public.crm_email_logs(tracking_token);
CREATE INDEX IF NOT EXISTS idx_crm_email_logs_lead_id ON public.crm_email_logs(lead_id);

-- 3. Concessão de Permissões ao PostgREST / Supabase
GRANT ALL ON TABLE public.crm_leads TO anon, authenticated, authenticator;
GRANT ALL ON TABLE public.crm_email_logs TO anon, authenticated, authenticator;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, authenticator;

-- 4. Habilita RLS (Row Level Security)
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_email_logs ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acesso Seguro (Permite autenticados e anon)
DO $$
BEGIN
    -- Políticas para crm_leads
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'crm_leads' AND policyname = 'Permitir tudo para autenticados em crm_leads') THEN
        CREATE POLICY "Permitir tudo para autenticados em crm_leads" ON public.crm_leads
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'crm_leads' AND policyname = 'Permitir tudo para anon em crm_leads') THEN
        CREATE POLICY "Permitir tudo para anon em crm_leads" ON public.crm_leads
            FOR ALL TO anon USING (true) WITH CHECK (true);
    END IF;

    -- Políticas para crm_email_logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'crm_email_logs' AND policyname = 'Permitir tudo para autenticados em crm_email_logs') THEN
        CREATE POLICY "Permitir tudo para autenticados em crm_email_logs" ON public.crm_email_logs
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'crm_email_logs' AND policyname = 'Permitir tudo para anon em crm_email_logs') THEN
        CREATE POLICY "Permitir tudo para anon em crm_email_logs" ON public.crm_email_logs
            FOR ALL TO anon USING (true) WITH CHECK (true);
    END IF;
END $$;
