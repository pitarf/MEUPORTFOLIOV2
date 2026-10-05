-- Migracao 14: Criacao das tabelas de gestao de assinaturas de manutencao e cobrancas PIX

SET search_path = public, pg_catalog;

-- 1. Tabela maintenance_categories
CREATE TABLE IF NOT EXISTS public.maintenance_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT 'from-blue-500 to-indigo-600',
    icon TEXT DEFAULT 'Wrench',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Limpar eventuais registros corrompidos com interrogacao
DELETE FROM public.maintenance_categories WHERE name LIKE '%?%';

-- Insercao de categorias padrao de forma idempotente
INSERT INTO public.maintenance_categories (name, description, color, icon)
VALUES
    ('Manutenção Web & Hospedagem', 'Gestão, atualizações de segurança e hospedagem para sites e sistemas.', 'from-blue-500 to-indigo-600', 'Wrench'),
    ('Suporte Técnico & Infraestrutura', 'Suporte contínuo, monitoramento preventivo e infraestrutura em nuvem.', 'from-indigo-500 to-purple-600', 'Server'),
    ('Gestão de Tráfego & SEO', 'Otimização para motores de busca e gestão de tráfego qualificado.', 'from-amber-500 to-orange-600', 'TrendingUp'),
    ('Automações & APIs', 'Desenvolvimento, integrações via webhook e rotinas automatizadas.', 'from-emerald-500 to-teal-600', 'Cpu')
ON CONFLICT (name) DO NOTHING;

-- 2. Tabela maintenance_subscriptions
CREATE TABLE IF NOT EXISTS public.maintenance_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_code TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    client_document TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_company TEXT,
    category_id UUID REFERENCES public.maintenance_categories(id) ON DELETE SET NULL,
    plan_title TEXT NOT NULL,
    plan_description TEXT,
    current_price NUMERIC(10,2) NOT NULL,
    next_price NUMERIC(10,2),
    next_price_effective_date DATE,
    billing_day INTEGER NOT NULL DEFAULT 10,
    billing_cycle TEXT NOT NULL DEFAULT 'mensal',
    status TEXT NOT NULL DEFAULT 'ativo',
    next_due_date DATE NOT NULL,
    last_payment_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela maintenance_invoices
CREATE TABLE IF NOT EXISTS public.maintenance_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.maintenance_subscriptions(id) ON DELETE CASCADE,
    invoice_code TEXT UNIQUE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    pushinpay_id TEXT,
    pix_qr_code TEXT,
    pix_qr_code_base64 TEXT,
    paid_at TIMESTAMPTZ,
    end_to_end_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Atualizacao na tabela support_tickets
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS client_document TEXT;
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.maintenance_subscriptions(id) ON DELETE SET NULL;

-- 5. Tabela maintenance_settings
CREATE TABLE IF NOT EXISTS public.maintenance_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pushinpay_token TEXT,
    pushinpay_webhook_token TEXT,
    default_pix_key TEXT,
    default_pix_key_type TEXT,
    webhook_url TEXT,
    whatsapp_notification_template TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir registro inicial se tabela vazia
INSERT INTO public.maintenance_settings (pushinpay_token, default_pix_key, default_pix_key_type, whatsapp_notification_template)
SELECT NULL, NULL, 'chave_aleatoria', 'Olá {{cliente}}, sua fatura {{fatura}} no valor de R$ {{valor}} vence em {{vencimento}}. Acesse seu link PIX para pagamento: {{link_pix}}'
WHERE NOT EXISTS (SELECT 1 FROM public.maintenance_settings);

-- 6. Funcao e triggers para atualizacao de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_maintenance_subscriptions_updated_at') THEN
        CREATE TRIGGER trg_maintenance_subscriptions_updated_at
        BEFORE UPDATE ON public.maintenance_subscriptions
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_maintenance_invoices_updated_at') THEN
        CREATE TRIGGER trg_maintenance_invoices_updated_at
        BEFORE UPDATE ON public.maintenance_invoices
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_maintenance_settings_updated_at') THEN
        CREATE TRIGGER trg_maintenance_settings_updated_at
        BEFORE UPDATE ON public.maintenance_settings
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- 7. Permissoes e Grants para as roles PostgREST
GRANT USAGE ON SCHEMA public TO anon, authenticated, authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, authenticator;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, authenticator;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, authenticator;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, authenticator;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, authenticator;
