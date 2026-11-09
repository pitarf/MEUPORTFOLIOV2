/**
 * Serviço de Gerenciamento do CRM & Funil de Leads de Prospecção
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gerencia o ciclo de vida completo de cada lead capturado via Google Maps:
 * Descoberto -> Qualificado -> E-mail Enviado -> E-mail Aberto -> Clicou Demo -> Negociação -> Fechado.
 * Suporta persistência no Supabase com fallback seguro em cache local.
 */

import { supabase } from '@/lib/customSupabaseClient';

const LOCAL_STORAGE_KEY = 'rp_crm_leads_cache_v1';

/**
 * Recupera o cache local de leads caso o Supabase esteja temporariamente indisponível
 * @returns {Array} Lista de leads em cache
 */
function getLocalCache() {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Salva a lista de leads no cache local
 * @param {Array} leads - Lista de leads
 */
function setLocalCache(leads) {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
        console.warn('Não foi possível salvar cache local do CRM:', e);
    }
}

export const crmService = {
    /**
     * Recupera todos os leads com filtros avançados
     * @param {object} params - Parâmetros de consulta
     * @param {string} [params.status] - Filtro de status
     * @param {string} [params.niche] - Filtro de nicho
     * @param {string} [params.city] - Filtro de cidade
     * @param {string} [params.search] - Busca por nome, email ou telefone
     * @returns {Promise<Array>} Lista de leads
     */
    async getLeads({ status = 'all', niche = 'all', city = 'all', search = '' } = {}) {
        try {
            let query = supabase.from('crm_leads').select('*').order('created_at', { ascending: false });

            if (status && status !== 'all') {
                query = query.eq('status', status);
            }
            if (niche && niche !== 'all') {
                query = query.eq('niche', niche);
            }
            if (city && city !== 'all') {
                query = query.ilike('city', `%${city}%`);
            }
            if (search) {
                query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,neighborhood.ilike.%${search}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.warn('Erro ao consultar Supabase para crm_leads, usando cache local:', error.message);
                return this.filterLocalLeads(getLocalCache(), { status, niche, city, search });
            }

            // Atualiza cache local para redundância
            if (data && data.length > 0) {
                setLocalCache(data);
                return data;
            }

            return getLocalCache();
        } catch (err) {
            console.error('Falha geral ao buscar leads do CRM:', err);
            return this.filterLocalLeads(getLocalCache(), { status, niche, city, search });
        }
    },

    /**
     * Filtra leads no array local (fallback)
     */
    filterLocalLeads(leads, { status, niche, city, search }) {
        return leads.filter(lead => {
            if (status && status !== 'all' && lead.status !== status) return false;
            if (niche && niche !== 'all' && lead.niche !== niche) return false;
            if (city && city !== 'all' && !lead.city?.toLowerCase().includes(city.toLowerCase())) return false;
            if (search) {
                const s = search.toLowerCase();
                const matchName = lead.name?.toLowerCase().includes(s);
                const matchEmail = lead.email?.toLowerCase().includes(s);
                const matchPhone = lead.phone?.toLowerCase().includes(s);
                const matchBairro = lead.neighborhood?.toLowerCase().includes(s);
                if (!matchName && !matchEmail && !matchPhone && !matchBairro) return false;
            }
            return true;
        });
    },

    /**
     * Atualiza o status de um lead no funil (Kanban)
     * @param {string} id - Identificador do lead
     * @param {string} newStatus - Novo estágio no funil
     * @returns {Promise<boolean>}
     */
    async updateLeadStatus(id, newStatus) {
        try {
            const { error } = await supabase
                .from('crm_leads')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.warn('Aviso: atualizando status apenas no cache local:', error.message);
            }

            // Atualiza cache local
            const cache = getLocalCache();
            const updated = cache.map(lead => lead.id === id ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead);
            setLocalCache(updated);

            return true;
        } catch (err) {
            console.error('Falha ao atualizar status do lead:', err);
            return false;
        }
    },

    /**
     * Registra o envio de um e-mail para o lead
     * @param {string} id - ID do lead
     * @returns {Promise<boolean>}
     */
    async markEmailSent(id) {
        try {
            const now = new Date().toISOString();
            const cache = getLocalCache();
            const existing = cache.find(l => l.id === id);
            const count = (existing?.emails_sent_count || 0) + 1;

            await supabase
                .from('crm_leads')
                .update({
                    status: 'email_enviado',
                    emails_sent_count: count,
                    last_email_sent_at: now,
                    updated_at: now
                })
                .eq('id', id);

            const updated = cache.map(lead => lead.id === id ? {
                ...lead,
                status: 'email_enviado',
                emails_sent_count: count,
                last_email_sent_at: now,
                updated_at: now
            } : lead);
            setLocalCache(updated);

            return true;
        } catch (err) {
            console.error('Falha ao registrar envio de e-mail no lead:', err);
            return false;
        }
    },

    /**
     * Importa lote de leads gerados pelo Google Maps Scraper Kit
     * @param {Array} scrapedLeads - Leads enriquecidos do scraper
     * @param {string} [niche='nutricao'] - Nicho dos leads
     * @returns {Promise<{inserted: number, skipped: number}>}
     */
    async importScrapedLeads(scrapedLeads, niche = 'nutricao') {
        if (!Array.isArray(scrapedLeads) || scrapedLeads.length === 0) {
            return { inserted: 0, skipped: 0 };
        }

        let insertedCount = 0;
        let skippedCount = 0;
        const currentCache = getLocalCache();

        const formattedBatch = scrapedLeads.map(item => {
            const id = item.id ? `lead_${Date.now()}_${item.id}` : `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            
            return {
                id,
                name: item.nomeTratado || item.title || 'Profissional',
                original_title: item.nomeOriginal || item.title || '',
                email: item.emails ? item.emails.split(',')[0].trim() : (item.email || ''),
                phone: item.telefoneOriginal || item.phone || '',
                whatsapp: item.whatsappNumerico || '',
                niche: niche,
                city: item.cidade || 'Rio de Janeiro',
                neighborhood: item.bairro || 'Centro',
                address: item.enderecoCompleto || item.address || '',
                google_rating: item.notaGoogle || parseFloat(item.review_rating) || 5.0,
                google_reviews_count: item.avaliacoesGoogle || parseInt(item.review_count, 10) || 0,
                has_website: item.possuiSite || false,
                website_url: item.website || '',
                status: (item.emails || item.email) ? 'qualificado' : 'descoberto',
                demo_url: item.linkDemoClinico || '',
                emails_sent_count: 0,
                opens_count: 0,
                clicks_count: 0,
                deal_value: 297.00,
                notes: `Importado via Google Maps Scraper Kit. Nota: ${item.notaGoogle || item.review_rating} (${item.avaliacoesGoogle || item.review_count} avaliações).`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        });

        // 1. Tenta gravar no Supabase
        try {
            const { error } = await supabase.from('crm_leads').upsert(formattedBatch, { onConflict: 'original_title' });
            if (!error) {
                insertedCount = formattedBatch.length;
            } else {
                console.warn('Erro ao inserir no Supabase, mantendo no cache local:', error.message);
                insertedCount = formattedBatch.length;
            }
        } catch (e) {
            console.warn('Exceção ao inserir no Supabase, usando cache local:', e.message);
            insertedCount = formattedBatch.length;
        }

        // 2. Mescla no Cache Local (evita duplicatas pelo original_title ou telefone)
        const existingTitles = new Set(currentCache.map(l => l.original_title));
        const newItems = [];

        formattedBatch.forEach(item => {
            if (!existingTitles.has(item.original_title)) {
                newItems.push(item);
                existingTitles.add(item.original_title);
            } else {
                skippedCount++;
            }
        });

        const updatedCache = [...newItems, ...currentCache];
        setLocalCache(updatedCache);

        return { inserted: newItems.length, skipped: skippedCount };
    },

    /**
     * Calcula métricas agregadas do funil para o Dashboard
     * @param {Array} leads - Lista de leads
     * @returns {object} Métricas do CRM
     */
    calculateMetrics(leads = []) {
        const total = leads.length;
        if (total === 0) {
            return {
                totalLeads: 0,
                emailsEnviados: 0,
                emailsAbertos: 0,
                linksClicados: 0,
                negociacoes: 0,
                fechados: 0,
                taxaAbertura: 0,
                taxaClique: 0,
                taxaConversao: 0,
                valorPipeline: 0,
                valorFechado: 0
            };
        }

        const enviados = leads.filter(l => ['email_enviado', 'email_aberto', 'link_clicado', 'respondeu', 'proposta_enviada', 'fechado'].includes(l.status)).length;
        const abertos = leads.filter(l => ['email_aberto', 'link_clicado', 'respondeu', 'proposta_enviada', 'fechado'].includes(l.status)).length;
        const clicados = leads.filter(l => ['link_clicado', 'respondeu', 'proposta_enviada', 'fechado'].includes(l.status)).length;
        const negociacoes = leads.filter(l => ['respondeu', 'proposta_enviada'].includes(l.status)).length;
        const fechados = leads.filter(l => l.status === 'fechado').length;

        const taxaAbertura = enviados > 0 ? Math.round((abertos / enviados) * 100) : 0;
        const taxaClique = abertos > 0 ? Math.round((clicados / abertos) * 100) : 0;
        const taxaConversao = total > 0 ? Math.round((fechados / total) * 100) : 0;

        const valorPipeline = leads
            .filter(l => !['fechado', 'perdido'].includes(l.status))
            .reduce((acc, l) => acc + (Number(l.deal_value) || 297), 0);

        const valorFechado = leads
            .filter(l => l.status === 'fechado')
            .reduce((acc, l) => acc + (Number(l.deal_value) || 297), 0);

        return {
            totalLeads: total,
            emailsEnviados: enviados,
            emailsAbertos: abertos,
            linksClicados: clicados,
            negociacoes: negociacoes,
            fechados: fechados,
            taxaAbertura,
            taxaClique,
            taxaConversao,
            valorPipeline,
            valorFechado
        };
    }
};

export default crmService;
