-- ==============================================================================
-- PIT.AI (PIT AI) — Schema Inicial do Banco de Dados PostgreSQL 16
-- Rafael Pita Solutions / MeuPortfolio v2
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Cache de Briefings & Notícias com TTL de 7 Dias
CREATE TABLE IF NOT EXISTS briefings_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL, -- 'mundo', 'brasil', 'rio_de_janeiro', 'mercado_b3', 'diario_oficial'
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    source_url TEXT,
    location_tag VARCHAR(100), -- 'Rio de Janeiro', 'Brasília', 'Global', etc.
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '7 days'),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_briefings_expires_at ON briefings_cache (expires_at);
CREATE INDEX IF NOT EXISTS idx_briefings_category ON briefings_cache (category);

-- 2. Tabela de Espelho e Cache da Google Agenda (detecção instantânea de conflitos)
CREATE TABLE IF NOT EXISTS agenda_events_sync (
    id VARCHAR(120) PRIMARY KEY, -- ID oficial do Google Calendar
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    attendees JSONB DEFAULT '[]'::jsonb,
    is_all_day BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'tentative', 'cancelled'
    has_conflict BOOLEAN DEFAULT FALSE,
    conflict_details TEXT,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agenda_time_range ON agenda_events_sync (start_time, end_time);

-- 3. Tabela de Espelho de Tarefas do Google Tasks
CREATE TABLE IF NOT EXISTS tasks_sync (
    id VARCHAR(120) PRIMARY KEY, -- ID oficial do Google Tasks
    title TEXT NOT NULL,
    notes TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'needsAction', -- 'needsAction', 'completed'
    priority VARCHAR(20) DEFAULT 'medium',
    recurring_interval VARCHAR(50), -- ex: '2_hours', 'daily'
    last_reminded_at TIMESTAMP WITH TIME ZONE,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks_sync (status, due_date);

-- 4. Tabela de Memória Pessoal e Contexto de Rafael Pita (Conversational Memory)
CREATE TABLE IF NOT EXISTS conversation_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) DEFAULT 'preference', -- 'preference', 'routine', 'contact', 'note'
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Logs de Interações e Briefings Realizados
CREATE TABLE IF NOT EXISTS briefing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_query TEXT,
    briefing_delta_start TIMESTAMP WITH TIME ZONE NOT NULL,
    briefing_delta_end TIMESTAMP WITH TIME ZONE NOT NULL,
    items_count INTEGER DEFAULT 0,
    audio_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_briefing_history_created ON briefing_history (created_at DESC);

-- Função e Trigger de Autolimpeza para Expirar Notícias com mais de 7 dias
CREATE OR REPLACE FUNCTION purge_expired_briefings() RETURNS trigger AS $$
BEGIN
    DELETE FROM briefings_cache WHERE expires_at < CURRENT_TIMESTAMP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_purge_expired_briefings ON briefings_cache;
CREATE TRIGGER trigger_purge_expired_briefings
    AFTER INSERT OR UPDATE ON briefings_cache
    EXECUTE FUNCTION purge_expired_briefings();
