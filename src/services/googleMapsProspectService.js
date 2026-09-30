/**
 * Serviço de Radar & Prospecção de Advogados no Google Maps
 * Identifica advogados no Brasil com alta avaliação no Google sem website próprio,
 * extrai WhatsApp e gera propostas personalizadas (R$ 300 + domínio anual).
 */

import { scanLawyersWithoutWebsite } from '../lib/gemini.js';
import { legalProspectService } from './legalProspectService.js';
import { supabase } from '@/lib/customSupabaseClient';
import { cleanLawyerName } from '../utils/lawyerNameFormatter.js';

/**
 * Gera um slug único, limpo e amigável para a URL da landing page de um advogado
 * Remove termos redundantes como dr, dra, advogada para manter o link extremamente curto
 * @param {Object} lawyer 
 * @returns {string}
 */
export const generateLawyerSlug = (lawyer) => {
  const rawName = lawyer.lawyer_name || lawyer.name || 'advogado';
  const cleaned = cleanLawyerName(rawName);
  // Remove títulos e palavras redundantes para manter o slug conciso e elegante
  const cleanName = cleaned
    .replace(/\b(dr|dra|doutor|doutora|advogado|advogada|advocacia|escritorio|associados)\b/gi, '')
    .trim() || cleaned;

  const slugBase = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return slugBase || 'advocacia';
};

/**
 * Constrói a URL oficial de busca no Google Maps unindo Nome, Endereço e Cidade
 * Garante que o pino e a ficha aberta no Maps coincidam 100% com os dados exibidos
 * @param {Object} lawyer 
 * @returns {string}
 */
export const buildGoogleMapsUrl = (lawyer) => {
  if (!lawyer) return 'https://www.google.com/maps';
  
  // Se já for uma URL do Google Maps com query e NÃO for a busca genérica de 'sem site'
  if (lawyer.google_maps_url && !lawyer.google_maps_url.includes('sem+site') && !lawyer.google_maps_url.includes('sem%20site')) {
    if (lawyer.google_maps_url.includes('api=1&query=')) {
      return lawyer.google_maps_url;
    }
  }

  const name = lawyer.lawyer_name || lawyer.name || '';
  const address = lawyer.address || '';
  const city = lawyer.city || '';
  const state = lawyer.state || '';

  // Combina Nome + Endereço Detalhado + Cidade/UF para cravar o local exato com precisão milimétrica no Maps
  const queryParts = [name, address, (!address.includes(city) && city) ? `${city} - ${state}` : ''].filter(Boolean);
  const query = queryParts.join(', ');

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Advocacia')}`;
};

/**
 * Constrói a URL de demonstração curta e limpa oficial
 * Utiliza o prefixo enxuto /adv/:slug sem poluição de query strings pesadas
 * @param {Object} lawyer 
 * @param {string} baseUrl
 * @returns {string}
 */
export const buildDemoUrl = (lawyer, baseUrl = '') => {
  if (!lawyer) return 'https://rafaelpitaoficial.com.br/adv';
  
  let host = baseUrl;
  if (!host && typeof window !== 'undefined') {
    host = window.location.origin;
  }
  
  // Se for o domínio do projeto, usa a versão canônica sem www para reduzir caracteres
  if (host && host.includes('rafaelpitaoficial.com.br')) {
    host = 'https://rafaelpitaoficial.com.br';
  } else if (!host) {
    host = 'https://rafaelpitaoficial.com.br';
  }

  const slug = lawyer.slug || lawyer.landing_page_slug || generateLawyerSlug(lawyer);
  return `${host}/adv/${slug}`;
};


// Base bruta de leads locais (limpa de quaisquer dados fictícios/alucinados)
const RAW_CURATED_MAPS_LEADS = [];

// Base curada enriquecida automaticamente com URL de precisão no Google Maps e slug padronizado
const CURATED_MAPS_LEADS = RAW_CURATED_MAPS_LEADS.map((lead) => ({
  ...lead,
  google_maps_url: buildGoogleMapsUrl(lead),
  slug: generateLawyerSlug(lead)
}));

/**
 * Sanitiza o cache local removendo leads fictícios legados que possam ter sido salvos anteriormente
 */
const sanitizeStoredLeads = () => {
  try {
    const stored = localStorage.getItem('rp_radar_maps_leads');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    // Filtra e elimina qualquer lead que contenha IDs legados gerados por IA ou mock anteriores
    const cleaned = parsed.filter((l) => {
      const id = String(l.id || '');
      const isLegacyMock = id.startsWith('maps-sp-') ||
        id.startsWith('maps-rj-') ||
        id.startsWith('maps-mg-') ||
        id.startsWith('maps-pr-') ||
        id.startsWith('maps-ba-') ||
        id.startsWith('maps-df-') ||
        id.startsWith('maps-se-') ||
        id.startsWith('maps-go-') ||
        id.startsWith('maps-rs-') ||
        id.startsWith('maps-ce-') ||
        id.startsWith('maps-ai-');
      return !isLegacyMock;
    });

    localStorage.setItem('rp_radar_maps_leads', JSON.stringify(cleaned));
    return cleaned;
  } catch (e) {
    console.warn('Erro ao sanitizar leads do radar:', e);
    return [];
  }
};

export const googleMapsProspectService = {
  /**
   * Realiza a busca ao vivo na API oficial do Google Places
   * Filtra advogados reais que não possuem site e com avaliação qualificada
   * @param {Object} params
   * @param {string} params.city - Cidade de busca
   * @param {string} params.state - Estado (UF)
   * @param {string} params.niche - Especialidade
   * @param {number} params.minRating - Avaliação mínima
   * @returns {Promise<Array>}
   */
  searchLiveGooglePlaces: async ({ city = '', state = '', niche = 'todos', minRating = 4.0 }) => {
    try {
      let query = '';
      const nichePrefix = niche === 'trabalhista' ? 'advogado trabalhista'
        : niche === 'familia' ? 'advogado de familia'
        : niche === 'consumidor' ? 'advogado do consumidor'
        : 'advogado';

      if (city) {
        query = `${nichePrefix} em ${city} ${state}`.trim();
      } else if (state) {
        query = `${nichePrefix} ${state}`.trim();
      } else {
        query = `${nichePrefix} em São Paulo SP`;
      }

      const params = new URLSearchParams({
        query,
        city,
        state,
        onlyWithoutWebsite: 'true',
        minRating: String(minRating || 4.0)
      });

      const response = await fetch(`/api/places-search?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status} ao consultar a API do Google Places.`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Falha ao processar dados da API.');
      }

      const leadsFromApi = (result.data || []).map((lead) => {
        const cleanName = cleanLawyerName(lead.name || lead.lawyer_name);
        return {
          ...lead,
          name: cleanName,
          lawyer_name: cleanName,
          niche: niche,
          status: 'novo'
        };
      });

      // Persiste no histórico local sanitizado sem sobrescrever leads já salvos
      if (leadsFromApi.length > 0) {
        const currentStored = sanitizeStoredLeads();
        const combined = [
          ...leadsFromApi,
          ...currentStored.filter(
            (l) => !leadsFromApi.some(
              (nl) => (nl.place_id && nl.place_id === l.place_id) || (nl.name === l.name && nl.phone === l.phone)
            )
          )
        ];
        localStorage.setItem('rp_radar_maps_leads', JSON.stringify(combined));
      }

      return leadsFromApi;
    } catch (err) {
      console.error('[GoogleMapsProspectService.searchLiveGooglePlaces Error]:', err);
      throw err;
    }
  },

  /**
   * Realiza a busca de advogados sem site no Google Maps
   * @param {Object} params
   * @param {string} params.city - Cidade de busca
   * @param {string} params.state - Estado (UF)
   * @param {string} params.niche - Especialidade (geral, trabalhista, familia, consumidor, todos)
   * @param {number} params.minRating - Avaliação mínima (ex: 4.5, 4.7)
   * @param {boolean} params.liveApi - Se deve consultar a API oficial do Google Places ao vivo
   * @returns {Promise<Array>}
   */
  search: async ({ city = '', state = '', niche = 'todos', minRating = 4.5, liveApi = false }) => {
    // Se a busca ao vivo na API do Google Places estiver acionada
    if (liveApi) {
      return await googleMapsProspectService.searchLiveGooglePlaces({ city, state, niche, minRating });
    }

    // 1. Sanitizar e carregar apenas leads reais salvos pelo usuário no histórico
    const storedLeads = sanitizeStoredLeads();
    
    // 2. Filtrar os leads cadastrados
    const results = storedLeads.filter((item) => {
      const matchCity = !city || (item.city || '').toLowerCase().includes(city.toLowerCase().trim());
      const matchState = !state || (item.state || '').toLowerCase() === state.toLowerCase().trim();
      const matchNiche = niche === 'todos' || item.niche === niche;
      const matchRating = Number(item.rating || 0) >= Number(minRating);

      return matchCity && matchState && matchNiche && matchRating;
    });

    return results;
  },

  /**
   * Limpa integralmente o histórico de leads do radar
   */
  clearAllLeads: () => {
    try {
      localStorage.removeItem('rp_radar_maps_leads');
      return [];
    } catch (e) {
      console.warn('Erro ao limpar leads do radar:', e);
      return [];
    }
  },

  /**
   * Adiciona um lead real capturado do Google Maps à lista do Radar
   * @param {Object} leadData 
   * @returns {Array}
   */
  addRealLead: (leadData) => {
    try {
      const current = sanitizeStoredLeads();
      const rawName = leadData.lawyer_name || leadData.name || '';
      const cleanName = cleanLawyerName(rawName);
      const newLead = {
        ...leadData,
        name: cleanName,
        lawyer_name: cleanName,
        id: leadData.id || `maps-real-${Date.now()}`,
        slug: leadData.slug || generateLawyerSlug({ ...leadData, name: cleanName }),
        google_maps_url: buildGoogleMapsUrl({ ...leadData, name: cleanName }),
        rating: Number(leadData.rating || 5.0),
        reviews_count: Number(leadData.reviews_count || 10),
        has_website: false,
        status: 'novo'
      };

      const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
      localStorage.setItem('rp_radar_maps_leads', JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Erro ao adicionar lead real no radar:', e);
      return [];
    }
  },

  /**
   * Busca um lead do Google Maps por slug
   * @param {string} slug
   * @returns {Object|null}
   */
  getBySlug: (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Procurar no CRM oficial primeiro
    try {
      const crmMatch = legalProspectService.getBySlug(cleanSlug);
      if (crmMatch) {
        return {
          ...crmMatch,
          google_maps_url: buildGoogleMapsUrl(crmMatch)
        };
      }
    } catch {}

    // 2. Procurar nos leads reais sanitizados do radar
    const stored = sanitizeStoredLeads();
    const match = stored.find((l) => {
      const lSlug = (l.slug || generateLawyerSlug(l)).toLowerCase();
      return lSlug === cleanSlug || l.id === cleanSlug;
    });
    if (match) {
      return {
        ...match,
        google_maps_url: buildGoogleMapsUrl(match)
      };
    }

    // 3. Fallback neutro com dados genéricos de demonstração (sem inventar pessoas ou nomes de terceiros)
    const parts = cleanSlug.split('-').filter(Boolean);
    const capitalized = parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

    return {
      name: capitalized || 'Advocacia & Consultoria',
      role: 'Advocacia Especializada',
      city: 'Sua Cidade',
      state: 'UF',
      address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
      phone: '(00) 90000-0000',
      whatsapp: '5500900000000',
      email: 'contato@seuescritorio.adv.br',
      instagram: '',
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(capitalized || 'Advocacia')}`,
      rating: 5.0,
      reviews_count: 48
    };
  },

  /**
   * Gera a mensagem de proposta comercial de R$ 300 + domínio anual
   * @param {Object} lawyer - Dados do advogado
   * @param {string} variant - 'direto', 'autoridade' ou 'curto'
   * @returns {string}
   */
  /**
   * Gera a mensagem de proposta comercial de R$ 300 + anuidade do domínio
   * Sem uso de travessão, com menção à personalização completa de fotos e textos
   * @param {Object} lawyer - Dados do advogado
   * @param {string} variant - 'direto', 'autoridade' ou 'curto'
   * @returns {string}
   */
  generateProposalMessage: (lawyer, variant = 'direto') => {
    const rawName = lawyer.lawyer_name || lawyer.name || 'Doutor(a)';
    const name = cleanLawyerName(rawName) || 'Doutor(a)';
    const rating = lawyer.rating ? `${Number(lawyer.rating).toFixed(1)}★` : '5.0★';
    const reviews = lawyer.reviews_count ? ` (${lawyer.reviews_count} avaliações)` : '';
    const city = lawyer.city || 'sua região';
    const baseUrl = window.location.origin;

    // Gerar URL limpa e oficial da landing page de demonstração
    const previewUrl = buildDemoUrl(lawyer, baseUrl);

    if (variant === 'curto') {
      return `Olá, ${name}, tudo bem? Me chamo Rafael Pita.

Vi seu perfil no Google Maps com ótima avaliação (${rating}${reviews}), porém notei que ainda não tem um site oficial cadastrado.

Fiz um modelo sob medida para você ver como ficaria:
👉 ${previewUrl}

(Lembrando que todos os textos, áreas de atuação e as fotos podem ser 100% alterados para colocar suas fotos reais e biografia. A ideia aqui é apenas ilustrar como o seu escritório pode se posicionar com alto padrão).

Cobro apenas R$ 300 (taxa única de implementação), mais a anuidade do domínio próprio (em média R$ 60 ao ano).

Se tiver interesse em colocar no ar com o seu nome essa semana, é só me dar um retorno por aqui!`;
    }

    if (variant === 'autoridade') {
      return `Olá, ${name}, tudo bem? Me chamo Rafael Pita, especialista em presença digital para o setor jurídico.

Estava pesquisando escritórios de referência em ${city} e me deparei com a excelente nota do seu escritório no Google (${rating}${reviews}).

Muitos clientes em potencial procuram um site oficial para validar autoridade antes de entrar em contato e não conseguem localizar o seu. Pensando nisso, desenhei uma estrutura executiva sob medida pronta para o seu escritório:

👉 ${previewUrl}

(Lembrando que fotos reais, biografia, textos e especialidades são 100% personalizáveis com a sua identidade oficial. A proposta é demonstrar visualmente o potencial de autoridade da sua banca).

A implementação completa fica em apenas R$ 300 (pagamento único), mais a taxa anual do domínio próprio (em média R$ 60 ao ano).

Teria interesse em subir essa página oficial para converter mais contatos que te encontram no Google Maps?`;
    }

    // Padrão solicitado:
    return `Oi, ${name}, tudo bem? Me chamo Rafael.

Vi aqui no Google Maps que você tem uma excelente avaliação (${rating}${reviews}), porém ainda não tem um site oficial conectado ao perfil.

Gostaria de dizer que desenvolvi um modelo exclusivo aqui para o seu escritório para você ver como ficaria:

👉 ${previewUrl}

(Lembrando que todos os textos, áreas de atuação e as fotos podem ser 100% alterados para colocar suas fotos reais e biografia. A ideia aqui é apenas ilustrar como o seu escritório pode se posicionar com alto padrão).

O valor para deixar ele no ar e personalizado com a sua marca é de apenas R$ 300 (taxa única), mais o valor do domínio (anual, em média R$ 60 ao ano).

Queria saber se você tem interesse em colocar no ar para passar ainda mais autoridade aos clientes que te acham no Google?`;
  },

  /**
   * Salva uma demonstração de cliente temporária na nuvem (Supabase VPS)
   * Validade padrão de 5 dias corridos
   * @param {Object} lawyer 
   * @returns {Promise<Object>}
   */
  saveCloudDemo: async (lawyer) => {
    try {
      const slug = lawyer.slug || lawyer.landing_page_slug || generateLawyerSlug(lawyer);
      const rawLawyerName = lawyer.lawyer_name || lawyer.name || 'Advogado(a)';
      const name = cleanLawyerName(rawLawyerName) || 'Advogado(a)';
      const phone = (lawyer.whatsapp || lawyer.phone || '').toString().replace(/\D/g, '');
      const rawAddress = lawyer.address || (lawyer.city ? `${lawyer.city} - ${lawyer.state || 'SP'}` : '');
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

      const payload = {
        slug,
        name,
        lawyer_name: name,
        city: lawyer.city || '',
        state: lawyer.state || '',
        address: rawAddress,
        phone: lawyer.phone || '',
        whatsapp: phone,
        rating: Number(lawyer.rating || 5.0),
        reviews_count: Number(lawyer.reviews_count || 48),
        niche: lawyer.niche || 'geral',
        instagram: lawyer.instagram || '',
        google_maps_url: buildGoogleMapsUrl(lawyer),
        expires_at: expiresAt,
        created_at: now.toISOString()
      };

      // Verifica se já existe demonstração para este slug
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('scope_description', 'demonstracao_legal')
        .eq('budget_code', slug)
        .maybeSingle();

      if (existing?.id) {
        const { data: updated, error: updateError } = await supabase
          .from('budgets')
          .update({
            title: `[DEMO-LEGAL] ${name}`,
            client_name: name,
            client_phone: phone,
            client_address: rawAddress,
            ai_scope_analysis: payload,
            deadline_days: 5,
            updated_at: now.toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return { success: true, id: updated.id, slug, expiresAt };
      }

      const { data: created, error: insertError } = await supabase
        .from('budgets')
        .insert([{
          budget_code: slug,
          title: `[DEMO-LEGAL] ${name}`,
          client_name: name,
          client_phone: phone,
          client_address: rawAddress,
          scope_description: 'demonstracao_legal',
          status: 'pendente',
          deadline_days: 5,
          ai_scope_analysis: payload
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return { success: true, id: created.id, slug, expiresAt };
    } catch (err) {
      console.warn('Aviso: falha ao salvar demo na nuvem, fallback local continuará ativo:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Busca os dados da demonstração salva na nuvem pelo slug
   * Verifica se ainda está dentro do prazo de validade de 5 dias
   * @param {string} slug 
   * @returns {Promise<Object|null>}
   */
  getCloudDemo: async (slug) => {
    try {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('budgets')
        .select('id, budget_code, client_name, client_phone, client_address, ai_scope_analysis, created_at')
        .eq('scope_description', 'demonstracao_legal')
        .eq('budget_code', slug)
        .maybeSingle();

      if (error || !data) return null;

      const payload = data.ai_scope_analysis || {};
      const expiresAt = payload.expires_at ? new Date(payload.expires_at) : null;
      const isExpired = expiresAt && expiresAt.getTime() < Date.now();

      return {
        id: data.id,
        slug: data.budget_code,
        ...payload,
        isExpired
      };
    } catch (err) {
      console.warn('Erro ao consultar demo na nuvem:', err);
      return null;
    }
  },

  /**
   * Lista todas as demonstrações ativas salvas na nuvem
   * @returns {Promise<Array>}
   */
  listCloudDemos: async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('id, budget_code, client_name, client_phone, client_address, ai_scope_analysis, created_at')
        .eq('scope_description', 'demonstracao_legal')
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item) => {
        const payload = item.ai_scope_analysis || {};
        const expiresAt = payload.expires_at ? new Date(payload.expires_at) : null;
        const now = new Date();
        const diffMs = expiresAt ? expiresAt.getTime() - now.getTime() : 0;
        const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        const isExpired = diffMs <= 0;

        return {
          id: item.id,
          slug: item.budget_code,
          name: payload.name || item.client_name,
          phone: payload.whatsapp || item.client_phone,
          city: payload.city || '',
          state: payload.state || '',
          rating: payload.rating || 5.0,
          reviews_count: payload.reviews_count || 0,
          created_at: item.created_at,
          expires_at: payload.expires_at,
          daysLeft,
          isExpired
        };
      });
    } catch (err) {
      console.warn('Erro ao listar demonstrações na nuvem:', err);
      return [];
    }
  },

  /**
   * Exclui uma demonstração da nuvem com 1 clique (Opção de Excluir Possível Cliente)
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  deleteCloudDemo: async (id) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Erro ao excluir possível cliente da nuvem:', err);
      return false;
    }
  },

  /**
   * Salva o lead encontrado no CRM de prospecção do sistema (legalProspectService)
   * @param {Object} lawyer
   * @returns {Object}
   */
  saveToCrm: (lawyer) => {
    return legalProspectService.save({
      id: lawyer.id,
      slug: lawyer.slug || generateLawyerSlug(lawyer),
      lawyer_name: lawyer.lawyer_name || lawyer.name,
      niche: lawyer.niche || 'geral',
      whatsapp: lawyer.whatsapp,
      phone: lawyer.phone,
      city: lawyer.city,
      state: lawyer.state,
      address: lawyer.address,
      rating: lawyer.rating,
      reviews_count: lawyer.reviews_count,
      instagram: lawyer.instagram || '',
      google_maps_url: buildGoogleMapsUrl(lawyer),
      highlights: lawyer.highlights || '',
      status: 'novo'
    });
  },

  /**
   * Monta o link para abrir a busca exata no Google Maps Web
   * @param {string} city 
   * @param {string} state 
   * @param {string} niche 
   * @returns {string}
   */
  getGoogleMapsWebSearchUrl: (city = '', state = '', niche = '') => {
    const query = [
      'advogado',
      niche && niche !== 'todos' ? niche : '',
      city,
      state,
      'sem site'
    ]
      .filter(Boolean)
      .join(' ');

    return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  }
};
