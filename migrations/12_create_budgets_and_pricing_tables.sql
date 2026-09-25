-- Migração 12: Criação das tabelas de Gestão de Orçamentos, Precificação (HH) e Pipeline Comercial
-- Compatível com o Supabase PostgreSQL

-- 1. Tabela de Configurações de Precificação e Hora-Homem (HH)
CREATE TABLE IF NOT EXISTS pricing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hourly_rate NUMERIC(10, 2) DEFAULT 120.00 NOT NULL,
    profit_margin_percent NUMERIC(5, 2) DEFAULT 20.00 NOT NULL,
    contingency_margin_percent NUMERIC(5, 2) DEFAULT 15.00 NOT NULL,
    fixed_costs_monthly NUMERIC(10, 2) DEFAULT 0.00,
    min_project_value NUMERIC(10, 2) DEFAULT 500.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa RLS para pricing_settings
ALTER TABLE pricing_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para pricing_settings (Acesso irrestrito a administradores autenticados)
CREATE POLICY "Permitir leitura para autenticados em pricing_settings"
ON pricing_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir inserção para autenticados em pricing_settings"
ON pricing_settings FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir atualização para autenticados em pricing_settings"
ON pricing_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Garante linha inicial padrão (singleton)
INSERT INTO pricing_settings (
    hourly_rate,
    profit_margin_percent,
    contingency_margin_percent,
    min_project_value,
    notes
)
SELECT 
    120.00,
    20.00,
    15.00,
    500.00,
    'Configuração base de HH (Hora-Homem) e margens de segurança para propostas comerciais da Rafael Pita Solutions.'
WHERE NOT EXISTS (SELECT 1 FROM pricing_settings);


-- 2. Tabela de Orçamentos e Pipeline Comercial (Budgets)
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
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (
        status IN (
            'pendente',
            'em_analise',
            'aceito',
            'em_andamento',
            'entregue',
            'pendente_pagamento',
            'concluido',
            'recusado'
        )
    ),
    notes TEXT,
    ai_scope_analysis JSONB DEFAULT '{}'::jsonb,
    ai_sales_pitch TEXT,
    ai_objections_handling JSONB DEFAULT '[]'::jsonb,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_url TEXT,
    main_image_url TEXT,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa RLS para budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para budgets (Área restrita de gestão administrativa)
CREATE POLICY "Permitir leitura para autenticados em budgets"
ON budgets FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir inserção para autenticados em budgets"
ON budgets FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir atualização para autenticados em budgets"
ON budgets FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir deleção para autenticados em budgets"
ON budgets FOR DELETE
TO authenticated
USING (true);

-- Índices de performance para busca e filtros do Kanban
CREATE INDEX IF NOT EXISTS idx_budgets_status ON budgets(status);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_created_at ON budgets(created_at DESC);
