-- Migração 13: Campos Corporativos do Emissor e Dados Opcionais do Cliente para Emissão de PDF
-- Criado em: 25/09/2026

ALTER TABLE public.pricing_settings
    ADD COLUMN IF NOT EXISTS company_name text DEFAULT 'Rafael Pita Solutions',
    ADD COLUMN IF NOT EXISTS company_trade_name text DEFAULT 'Rafael Pita',
    ADD COLUMN IF NOT EXISTS company_cnpj text DEFAULT '',
    ADD COLUMN IF NOT EXISTS company_cpf text DEFAULT '',
    ADD COLUMN IF NOT EXISTS company_email text DEFAULT 'contato@rafaelpitaoficial.com.br',
    ADD COLUMN IF NOT EXISTS company_phone text DEFAULT '(21) 96614-9077',
    ADD COLUMN IF NOT EXISTS company_address text DEFAULT 'Rio de Janeiro, RJ - Brasil',
    ADD COLUMN IF NOT EXISTS company_logo_url text DEFAULT '',
    ADD COLUMN IF NOT EXISTS company_website text DEFAULT 'https://rafaelpitaoficial.com.br',
    ADD COLUMN IF NOT EXISTS pix_key text DEFAULT '',
    ADD COLUMN IF NOT EXISTS pix_key_type text DEFAULT 'CNPJ',
    ADD COLUMN IF NOT EXISTS proposal_validity_days integer DEFAULT 15,
    ADD COLUMN IF NOT EXISTS proposal_terms text DEFAULT '1. Esta proposta tem validade pelo período estipulado.
2. O início dos trabalhos ocorre após a confirmação do sinal/primeira parcela.
3. Alterações de escopo não previstas serão orçadas separadamente.
4. Garantia técnica de 30 dias após a entrega final para suporte e ajustes.';

ALTER TABLE public.budgets
    ADD COLUMN IF NOT EXISTS client_document text DEFAULT '',
    ADD COLUMN IF NOT EXISTS client_address text DEFAULT '',
    ADD COLUMN IF NOT EXISTS budget_code text DEFAULT '';

NOTIFY pgrst, 'reload schema';
