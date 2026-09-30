/**
 * Serviço de Radar & Prospecção de Advogados no Google Maps
 * Identifica advogados no Brasil com alta avaliação no Google sem website próprio,
 * extrai WhatsApp e gera propostas personalizadas (R$ 300 + domínio anual).
 */

import { scanLawyersWithoutWebsite } from '../lib/gemini.js';
import { legalProspectService } from './legalProspectService.js';

/**
 * Gera um slug único e amigável para a URL da landing page de um advogado
 * @param {Object} lawyer 
 * @returns {string}
 */
export const generateLawyerSlug = (lawyer) => {
  const name = lawyer.lawyer_name || lawyer.name || 'advogado';
  const slugBase = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const city = lawyer.city || '';
  const citySlug = city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');

  return `${slugBase}${citySlug ? `-${citySlug}` : ''}`;
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

      const leadsFromApi = (result.data || []).map((lead) => ({
        ...lead,
        niche: niche,
        status: 'novo'
      }));

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
      const newLead = {
        ...leadData,
        id: leadData.id || `maps-real-${Date.now()}`,
        slug: leadData.slug || generateLawyerSlug(leadData),
        google_maps_url: buildGoogleMapsUrl(leadData),
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
  generateProposalMessage: (lawyer, variant = 'direto') => {
    const name = lawyer.lawyer_name || lawyer.name || 'Doutor(a)';
    const rating = lawyer.rating ? `${Number(lawyer.rating).toFixed(1)}★` : '5.0★';
    const reviews = lawyer.reviews_count ? ` (${lawyer.reviews_count} avaliações)` : '';
    const city = lawyer.city || 'sua região';
    const baseUrl = window.location.origin;

    // Gerar slug padronizado da landing page
    const slug = lawyer.slug || generateLawyerSlug(lawyer);
    const previewUrl = `${baseUrl}/advocacia/${slug}`;

    if (variant === 'curto') {
      return `Olá, ${name}, tudo bem? Me chamo Rafael Pita.

Vi seu perfil no Google Maps com ótima avaliação (${rating}${reviews}), porém notei que ainda não tem um site oficial cadastrado.

Fiz um protótipo sob medida para você ver como ficaria:
👉 ${previewUrl}

Cobro apenas R$ 300 (taxa única de implementação) + o valor do domínio oficial anual (R$ 40/ano no Registro.br).

Se tiver interesse em colocar no ar com o seu nome essa semana, é só me dar um retorno por aqui!`;
    }

    if (variant === 'autoridade') {
      return `Olá, ${name}, tudo bem? Me chamo Rafael Pita, especialista em presença digital para o setor jurídico.

Estava pesquisando escritórios de referência em ${city} e me deparei com a excelente nota do seu escritório no Google (${rating}${reviews}).

Muitos clientes em potencial procuram um site oficial para validar autoridade antes de entrar em contato e não conseguem localizar o seu. Pensando nisso, desenhei uma estrutura executiva sob medida pronta para o seu escritório:

👉 ${previewUrl}

A implementação completa fica em apenas R$ 300 (pagamento único), mais a taxa anual do domínio próprio no Registro.br (cerca de R$ 40 ao ano).

Teria interesse em subir essa página oficial para converter mais contatos que te encontram no Google Maps?`;
    }

    // Padrão solicitado pelo usuário:
    return `Oi, ${name}, tudo bem? Me chamo Rafael.

Vi aqui no Google Maps que você tem uma boa avaliação (${rating}${reviews}), porém ainda não tem um site — tentei pesquisar e não consegui localizar o seu site.

Gostaria de dizer que eu desenvolvi um modelo exclusivo aqui para o seu escritório para você ver como ficaria:

👉 ${previewUrl}

O valor para deixar ele no ar e personalizado com a sua marca é de apenas R$ 300 (taxa única), mais o valor do domínio (anual, direto no Registro.br em torno de R$ 40).

Queria saber se você tem interesse em colocar no ar para passar ainda mais autoridade aos clientes que te acham no Google?`;
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
