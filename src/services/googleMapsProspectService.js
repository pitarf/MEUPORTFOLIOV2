/**
 * Serviço de Radar & Prospecção de Advogados no Google Maps
 * Identifica advogados no Brasil com alta avaliação no Google sem website próprio,
 * extrai WhatsApp e gera propostas personalizadas (R$ 300 + domínio anual).
 */

import { scanLawyersWithoutWebsite } from '../lib/gemini.js';
import { legalProspectService } from './legalProspectService.js';
import { supabase } from '@/lib/customSupabaseClient';
import { cleanLawyerName } from '../utils/lawyerNameFormatter.js';
import { getGreetingByBrasiliaTime, formatLawyerSalutation } from '../utils/greetingUtils.js';

/**
 * Catálogo mestre de nichos suportados no Radar de Prospecção do Google Maps
 */
export const PROSPECT_NICHES = {
  todos: {
    id: 'todos',
    name: 'Todos os Nichos',
    shortName: 'Todos',
    icon: 'Globe',
    defaultQueryPrefix: 'estabelecimentos',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    title: 'Radar Google Maps: Negócios Locais com Avaliação Alta & Sem Site Oficial',
    subtitle: 'Identifique empresas locais bem avaliadas no Google Maps sem website próprio e ofereça presença digital profissional com demonstração imediata.',
    leadTerm: 'Estabelecimento'
  },
  dentista: {
    id: 'dentista',
    name: 'Dentistas & Clínicas Odontológicas',
    shortName: 'Dentistas',
    icon: 'Stethoscope',
    defaultQueryPrefix: 'clinica odontologica',
    badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    title: 'Radar Google Maps: Clínicas Odontológicas & Dentistas Sem Site',
    subtitle: 'Mapeie clínicas dentárias e dentistas com ótima reputação no Google que ainda não possuem página de agendamento de consultas e avaliações.',
    leadTerm: 'Clínica Odontológica'
  },
  hamburgueria: {
    id: 'hamburgueria',
    name: 'Hamburguerias & Gastrobares',
    shortName: 'Hamburguerias',
    icon: 'Utensils',
    defaultQueryPrefix: 'hamburgueria artesanal',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    title: 'Radar Google Maps: Hamburguerias & Gastrobares Sem Cardápio Próprio',
    subtitle: 'Encontre hamburguerias artesanais bem avaliadas que são reféns dos 27% de taxa do iFood por não terem cardápio próprio e pedido direto no WhatsApp.',
    leadTerm: 'Hamburgueria'
  },
  barbearia: {
    id: 'barbearia',
    name: 'Barbearias & Barber Shops',
    shortName: 'Barbearias',
    icon: 'Scissors',
    defaultQueryPrefix: 'barbearia',
    badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    title: 'Radar Google Maps: Barbearias com Alta Avaliação & Sem Site',
    subtitle: 'Localize barbearias de estilo com notas altas no Maps sem página de agendamento sem fila e apresentação de cortes.',
    leadTerm: 'Barbearia'
  },
  psicologo: {
    id: 'psicologo',
    name: 'Psicólogos & Clínicas de Saúde Mental',
    shortName: 'Psicólogos',
    icon: 'Brain',
    defaultQueryPrefix: 'psicologo',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    title: 'Radar Google Maps: Psicólogos & Clínicas de Psicologia Sem Site',
    subtitle: 'Identifique profissionais de saúde mental com ótimas recomendações que necessitam de landing page ética para teleconsulta e acolhimento.',
    leadTerm: 'Consultório de Psicologia'
  },
  nutricionista: {
    id: 'nutricionista',
    name: 'Nutricionistas & Nutrologia',
    shortName: 'Nutricionistas',
    icon: 'Salad',
    defaultQueryPrefix: 'nutricionista',
    badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    title: 'Radar Google Maps: Nutricionistas & Clínicas Nutricionais Sem Site',
    subtitle: 'Descubra nutricionistas conceituados sem presença digital própria para converter pesquisas do Maps em consultas particulares.',
    leadTerm: 'Clínica de Nutrição'
  },
  advocacia: {
    id: 'advocacia',
    name: 'Escritórios de Advocacia',
    shortName: 'Advocacia',
    icon: 'Scale',
    defaultQueryPrefix: 'advogado',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    title: 'Radar Google Maps: Advogados com Avaliação Alta & Sem Site',
    subtitle: 'Identifique escritórios com excelente reputação no Google que não possuem presença na web. Dispare propostas de R$ 297 + domínio no WhatsApp.',
    leadTerm: 'Escritório de Advocacia'
  }
};

/**
 * Gera um slug único, limpo e amigável para a URL da landing page de um lead
 * @param {Object} lawyer 
 * @returns {string}
 */
export const generateLawyerSlug = (lawyer) => {
  const rawName = lawyer.lawyer_name || lawyer.name || 'empresa';
  const cleaned = cleanLawyerName(rawName);
  // Remove títulos e termos redundantes para manter o slug conciso e elegante
  const cleanName = cleaned
    .replace(/\b(dr|dra|doutor|doutora|advogado|advogada|advocacia|escritorio|associados|clinica|odontologia|barbearia|barber|burger|hamburgueria|psicologo|psicologa|nutricionista)\b/gi, '')
    .trim() || cleaned;

  const slugBase = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return slugBase || 'empresa';
};

/**
 * Constrói a URL oficial de busca no Google Maps unindo Nome, Endereço e Cidade
 * @param {Object} lawyer 
 * @returns {string}
 */
export const buildGoogleMapsUrl = (lawyer) => {
  if (!lawyer) return 'https://www.google.com/maps';
  
  if (lawyer.google_maps_url && !lawyer.google_maps_url.includes('sem+site') && !lawyer.google_maps_url.includes('sem%20site')) {
    if (lawyer.google_maps_url.includes('api=1&query=')) {
      return lawyer.google_maps_url;
    }
  }

  const name = lawyer.lawyer_name || lawyer.name || '';
  const address = lawyer.address || '';
  const city = lawyer.city || '';
  const state = lawyer.state || '';

  const queryParts = [name, address, (!address.includes(city) && city) ? `${city} - ${state}` : ''].filter(Boolean);
  const query = queryParts.join(', ');

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Empresa')}`;
};

/**
 * Constrói a URL de demonstração conectando diretamente ao nicho e à landing page criada
 * Injeta query params para personalização em tempo real (nome, whatsapp, cidade, bairro)
 * @param {Object} lawyer 
 * @param {string} baseUrl
 * @returns {string}
 */
export const buildDemoUrl = (lawyer, baseUrl = '') => {
  if (!lawyer) return 'https://rafaelpitaoficial.com.br';
  
  let host = baseUrl;
  if (!host && typeof window !== 'undefined') {
    host = window.location.origin;
  }
  
  if (host && host.includes('rafaelpitaoficial.com.br')) {
    host = 'https://rafaelpitaoficial.com.br';
  } else if (!host) {
    host = 'https://rafaelpitaoficial.com.br';
  }

  const slug = lawyer.slug || lawyer.landing_page_slug || generateLawyerSlug(lawyer);
  const niche = (lawyer.niche || 'advocacia').toLowerCase();
  const rawName = lawyer.lawyer_name || lawyer.name || '';
  const cleanName = cleanLawyerName(rawName);
  const nameParam = encodeURIComponent(cleanName);
  const phoneParam = (lawyer.whatsapp || lawyer.phone || '').toString().replace(/\D/g, '');
  const cityParam = encodeURIComponent(lawyer.city || '');

  // 1. Nicho Odontologia / Dentista
  if (niche.includes('dentist') || niche.includes('odonto')) {
    return `${host}/odonto/${slug}?nome=${nameParam}&cidade=${cityParam}&whatsapp=${phoneParam}`;
  }

  // 2. Nicho Hamburgueria / Gastronomia
  if (niche.includes('burger') || niche.includes('hamburguer') || niche.includes('gastro')) {
    return `${host}/burger/${slug}?nome=${nameParam}&cidade=${cityParam}&whatsapp=${phoneParam}`;
  }

  // 3. Nicho Barbearia / Barber Shop
  if (niche.includes('barber') || niche.includes('barbearia')) {
    return `${host}/barber/${slug}?nome=${nameParam}&cidade=${cityParam}&whatsapp=${phoneParam}`;
  }

  // 4. Nicho Psicologia / Saúde Mental
  if (niche.includes('psicolog') || niche.includes('terapia') || niche.includes('mente')) {
    return `${host}/psicologia/${slug}?nome=${nameParam}&cidade=${cityParam}&whatsapp=${phoneParam}`;
  }

  // 5. Nicho Nutrição / Nutricionista
  if (niche.includes('nutri')) {
    return `${host}/nutrivida/${slug}?nome=${nameParam}&cidade=${cityParam}&whatsapp=${phoneParam}`;
  }

  // 6. Nicho Advocacia (padrão)
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
   * Filtra estabelecimentos reais que não possuem site e com avaliação qualificada
   * @param {Object} params
   * @param {string} params.city - Cidade de busca
   * @param {string} params.state - Estado (UF)
   * @param {string} params.niche - Nicho/Especialidade
   * @param {number} params.minRating - Avaliação mínima
   * @returns {Promise<Array>}
   */
  searchLiveGooglePlaces: async ({ city = '', state = '', niche = 'todos', minRating = 4.0 }) => {
    try {
      let nichePrefix = 'estabelecimentos';
      const cleanNiche = (niche || 'todos').toLowerCase();

      if (cleanNiche === 'dentista' || cleanNiche === 'odonto') {
        nichePrefix = 'clinica odontologica';
      } else if (cleanNiche === 'hamburgueria' || cleanNiche === 'burger') {
        nichePrefix = 'hamburgueria artesanal';
      } else if (cleanNiche === 'barbearia' || cleanNiche === 'barber') {
        nichePrefix = 'barbearia';
      } else if (cleanNiche === 'psicologo' || cleanNiche === 'psicologia') {
        nichePrefix = 'psicologo';
      } else if (cleanNiche === 'nutricionista' || cleanNiche === 'nutricao') {
        nichePrefix = 'nutricionista';
      } else if (cleanNiche === 'trabalhista') {
        nichePrefix = 'advogado trabalhista';
      } else if (cleanNiche === 'familia') {
        nichePrefix = 'advogado de familia';
      } else if (cleanNiche === 'consumidor') {
        nichePrefix = 'advogado do consumidor';
      } else if (cleanNiche === 'advocacia') {
        nichePrefix = 'advogado';
      } else {
        nichePrefix = 'negocios locais';
      }

      let query = '';
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
        niche: cleanNiche,
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
        const resolvedNiche = lead.niche || (cleanNiche !== 'todos' ? cleanNiche : 'geral');
        return {
          ...lead,
          name: cleanName,
          lawyer_name: cleanName,
          niche: resolvedNiche,
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
   * Realiza a busca de estabelecimentos sem site no Google Maps
   * @param {Object} params
   * @param {string} params.city - Cidade de busca
   * @param {string} params.state - Estado (UF)
   * @param {string} params.niche - Especialidade/Nicho
   * @param {number} params.minRating - Avaliação mínima
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
      const matchNiche = niche === 'todos' || item.niche === niche || (!item.niche && niche === 'advocacia');
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
   * Gera a mensagem de proposta comercial de R$ 297 + anuidade do domínio
   * Hiper-personalizada de acordo com o nicho do lead
   * @param {Object} lawyer - Dados do lead
   * @param {string} variant - 'passo1', 'passo2', 'passo3', 'recuperacao1', 'recuperacao2', 'curto', 'autoridade'
   * @returns {string}
   */
  generateProposalMessage: (lawyer, variant = 'direto') => {
    const rawName = lawyer.lawyer_name || lawyer.name || 'Empresa';
    const cleanName = cleanLawyerName(rawName);
    const salutation = formatLawyerSalutation(rawName);
    const greeting = getGreetingByBrasiliaTime();
    const rating = lawyer.rating ? `${Number(lawyer.rating).toFixed(1)}★` : '5.0★';
    const reviews = lawyer.reviews_count ? ` (${lawyer.reviews_count} avaliações)` : '';
    const city = lawyer.city || 'sua região';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rafaelpitaoficial.com.br';
    const previewUrl = buildDemoUrl(lawyer, baseUrl);
    const niche = (lawyer.niche || 'advocacia').toLowerCase();

    // 1. Nicho ODONTOLOGIA / DENTISTA
    if (niche.includes('dentist') || niche.includes('odonto')) {
      if (variant === 'passo1') {
        return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, este canal é o contato direto com a administração da ${cleanName} ou falo com a equipe de atendimento da clínica?`;
      }
      if (variant === 'passo2') {
        return `Aqui é o Rafael. Estava analisando as clínicas odontológicas em ${city} e vi que vocês possuem excelente reputação e ótimas avaliações no Google (${rating}${reviews})!\n\nPorém, notei que ainda não possuem um site próprio de agendamento de avaliações conectado ao perfil, e hoje muitos pacientes da região acabam fechando com outras clínicas por não encontrarem uma página oficial com os tratamentos.\n\nDesenvolvi um protótipo exclusivo para a clínica de vocês para mostrar na prática como converter essas buscas em consultas.\n\nMe autoriza a enviar o link rápido de demonstração para vocês darem uma olhada sem nenhum compromisso?`;
      }
      if (variant === 'passo3') {
        return `Perfeito! Montei esta prévia personalizada pensando exatamente no posicionamento da ${cleanName}:\n\n👉 ${previewUrl}\n(Caso prefira por segurança, posso te encaminhar a prévia completa em PDF por aqui para você avaliar o layout com tranquilidade!)\n\nO objetivo é transformar quem pesquisa por dentistas e implantes em ${city} no Google em agendamentos diretos no WhatsApp de vocês, com alto padrão visual e destaque para os tratamentos.\n\nTodos os textos, fotos dos consultórios e especialidades podem ser 100% personalizados com a identidade oficial de vocês.\n\nPara colocar no ar com domínio próprio e configurado, o valor é de apenas R$ 297 (taxa única de implementação) mais a anuidade do domínio próprio (em média R$ 60 ao ano).\n\nDepois me conte o que achou da estrutura!`;
      }
      if (variant === 'recuperacao' || variant === 'recuperacao1' || variant === 'followup') {
        return `Olá, tudo bem?\n\nMandei uma mensagem anteriormente, mas nem sei se este é o melhor contato para tratar sobre a presença digital e novos pacientes da clínica...\n\nCaso não seja, teria algum outro canal ou pessoa responsável que você pudesse me indicar?`;
      }
      if (variant === 'recuperacao2' || variant === 'recuperacao_confirmou') {
        return `Perfeito! Retomei o contato porque verifiquei que vocês possuem excelente avaliação no Google Maps em ${city}, mas ainda não têm um site oficial cadastrado.\n\nCheguei a desenhar um modelo exclusivo para a clínica de vocês verem na prática como reter os pacientes da região:\n\n👉 ${previewUrl}\n\nPara subir com domínio próprio e configurado, o valor é de apenas R$ 297 (taxa única de implementação) mais a anuidade do domínio (cerca de R$ 60 ao ano). Dê uma olhada quando puder!`;
      }
    }

    // 2. Nicho HAMBURGUERIA / GASTROBAR
    if (niche.includes('burger') || niche.includes('hamburguer') || niche.includes('gastro')) {
      if (variant === 'passo1') {
        return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, falo com a gerência ou com o responsável pelos pedidos e delivery da ${cleanName}?`;
      }
      if (variant === 'passo2') {
        return `Aqui é o Rafael. Estava analisando as hamburguerias em ${city} e vi que a ${cleanName} tem excelente reputação e nota alta no Google (${rating}${reviews})!\n\nPorém, notei que vocês ainda não possuem um cardápio digital próprio conectado ao perfil, e hoje muitos estabelecimentos acabam perdendo até 27% de comissão por pedido para o iFood por não terem canal direto.\n\nDesenvolvi um modelo interativo exclusivo para a ${cleanName} com cardápio online e pedidos direto no WhatsApp, sem nenhuma taxa sobre as vendas.\n\nMe autoriza a enviar uma prévia rápida para vocês darem uma olhada sem compromisso?`;
      }
      if (variant === 'passo3') {
        return `Perfeito! Montei esta demonstração exclusiva com o visual da ${cleanName}:\n\n👉 ${previewUrl}\n(Se preferir, também posso te enviar a prévia em PDF por aqui!)\n\nCom essa estrutura, seus clientes montam os combos, escolhem os burgers e o pedido chega pronto e formatado no WhatsApp de vocês, economizando milhares de reais em taxas de aplicativos todo mês.\n\nTodos os burgers, fotos, adicionais e preços são 100% personalizáveis.\n\nPara colocar no ar no domínio próprio da hamburgueria (ex: suahamburgueria.com.br), o valor é de apenas R$ 297 (taxa única de implementação) mais o domínio anual (~R$ 60 ao ano).\n\nDê uma olhada no link e me diga o que achou!`;
      }
      if (variant === 'recuperacao' || variant === 'recuperacao1' || variant === 'followup') {
        return `Olá, tudo bem?\n\nMandei mensagem aqui antes sobre o cardápio próprio para pedidos direto no WhatsApp da hamburgueria. Este é o canal certo ou teria outro contato da gerência?`;
      }
      if (variant === 'recuperacao2' || variant === 'recuperacao_confirmou') {
        return `Show! Retomei o contato para deixar o link da demonstração que preparei para a ${cleanName} lucrar 100% dos pedidos sem taxa de app:\n\n👉 ${previewUrl}\n\nFica apenas R$ 297 para subir no domínio próprio de vocês. Veja o que achou!`;
      }
    }

    // 3. Nicho BARBEARIA
    if (niche.includes('barber') || niche.includes('barbearia')) {
      if (variant === 'passo1') {
        return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, falo com o barbeiro titular ou com o atendimento da ${cleanName}?`;
      }
      if (variant === 'passo2') {
        return `Aqui é o Rafael. Estava pesquisando as barbearias de destaque em ${city} e vi que a ${cleanName} tem ótima reputação e avaliações no Google (${rating}${reviews})!\n\nPorém, notei que ainda não possuem um site oficial com tabela de cortes e agendamento rápido sem fila, e muitos clientes novos da região acabam indo para barbearias com agendamento web.\n\nDesenvolvi um modelo exclusivo para a ${cleanName} ver como facilitar o agendamento dos clientes.\n\nMe autoriza a enviar o link rápido de demonstração sem compromisso?`;
      }
      if (variant === 'passo3') {
        return `Perfeito! Montei esta prévia com o estilo e identidade da ${cleanName}:\n\n👉 ${previewUrl}\n\nO objetivo é permitir que quem busca barbearia em ${city} no Google veja seus cortes, serviços e reserve horário direto no WhatsApp sem complicação.\n\nTabela de serviços, fotos reais e horários são 100% personalizáveis.\n\nPara colocar no ar com domínio próprio, o valor é de apenas R$ 297 (taxa única de implementação) mais o domínio anual (~R$ 60 ao ano). Me conte o que achou!`;
      }
      if (variant === 'recuperacao' || variant === 'recuperacao1' || variant === 'followup') {
        return `Olá, tudo bem?\n\nMandei mensagem antes sobre a página de agendamento da barbearia. Caso este não seja o canal correto com a administração, teria outro para me indicar?`;
      }
      if (variant === 'recuperacao2' || variant === 'recuperacao_confirmou') {
        return `Show! Deixando aqui a demonstração que fiz para a ${cleanName} para agendamentos rápidos de barba e corte:\n\n👉 ${previewUrl}\n\nTaxa única de R$ 297 para subir no domínio próprio. Depois me diga o que achou!`;
      }
    }

    // 4. Nicho PSICOLOGIA / SAÚDE MENTAL
    if (niche.includes('psicolog') || niche.includes('terapia') || niche.includes('mente')) {
      if (variant === 'passo1') {
        return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, este contato fala com o(a) psicólogo(a) ${cleanName} ou com a recepção do consultório?`;
      }
      if (variant === 'passo2') {
        return `Aqui é o Rafael. Estava pesquisando consultórios de psicologia em ${city} e vi que você possui excelentes recomendações e avaliações no Google (${rating}${reviews})!\n\nPorém, notei que ainda não tem um site profissional para acolhimento e agendamento de teleconsulta ou consultas presenciais.\n\nDesenvolvi um protótipo exclusivo estruturado de acordo com as diretrizes éticas do CFP para apresentar suas abordagens terapêuticas.\n\nMe autoriza a enviar uma demonstração rápida para você avaliar sem nenhum compromisso?`;
      }
      if (variant === 'passo3') {
        return `Perfeito! Montei esta demonstração ética pensada para o seu posicionamento clínico:\n\n👉 ${previewUrl}\n\nO objetivo é transmitir acolhimento, autoridade e facilitar o agendamento seguro de novos pacientes em ${city}.\n\nTextos de abordagem, fotos do consultório e perguntas frequentes são 100% personalizáveis.\n\nPara subir com domínio próprio (ex: seunome.com.br), o investimento é de apenas R$ 297 (taxa única de implementação) mais a anuidade do domínio (~R$ 60 ao ano). Fico à disposição para qualquer ajuste!`;
      }
    }

    // 5. Nicho NUTRIÇÃO
    if (niche.includes('nutri')) {
      if (variant === 'passo1') {
        return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, este canal fala com o consultório do(a) Dr(a). ${cleanName} ou com a equipe de atendimento?`;
      }
      if (variant === 'passo2') {
        return `Aqui é o Rafael. Estava analisando nutricionistas em ${city} e vi suas ótimas avaliações no Google (${rating}${reviews})!\n\nPorém, verifiquei que ainda não possui uma página oficial para agendamento de consultas particulares e apresentação dos planos alimentares.\n\nDesenvolvi um modelo exclusivo para o seu perfil profissional. Me autoriza a enviar para você dar uma olhada sem compromisso?`;
      }
      if (variant === 'passo3') {
        return `Perfeito! Montei esta demonstração pensada para o seu consultório de nutrição:\n\n👉 ${previewUrl}\n\nO objetivo é converter buscas no Google Maps em consultas particulares agendadas direto no seu WhatsApp. Implementação por apenas R$ 297 mais o domínio anual. Me conte o que achou!`;
      }
    }

    // 6. Nicho ADVOCACIA / GERAL (Padrão com Ética OAB)
    if (variant === 'passo1') {
      return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, este canal é o contato direto ${salutation.directContactPhrase} ou falo com a equipe do escritório?`;
    }

    if (variant === 'passo2') {
      return `Aqui é o Rafael. Estava analisando os escritórios de advocacia em ${city} e vi que vocês possuem uma excelente reputação e ótimas avaliações no Google (${rating}${reviews})!\n\nPorém, notei que ainda não possuem um site próprio de atendimento rápido conectado ao perfil, e hoje muitos clientes em potencial da região acabam fechando com outros escritórios por não encontrarem uma página oficial.\n\nDesenvolvi um protótipo exclusivo para o escritório de vocês para mostrar na prática como reter esses clientes.\n\nMe autoriza a enviar o link rápido de demonstração para vocês darem uma olhada sem nenhum compromisso?`;
    }

    if (variant === 'passo3') {
      return `Perfeito, ${salutation.salutationCall}! Montei esta prévia personalizada pensando exatamente no posicionamento de vocês:\n\n👉 ${previewUrl}\n(Caso prefira por segurança, posso te encaminhar a prévia completa em PDF por aqui para você avaliar o layout com tranquilidade!)\n\nO objetivo é transformar quem pesquisa por advogados em ${city} no Google em contatos diretos no WhatsApp de vocês, com alto padrão visual e total respeito ao Código de Ética da OAB.\n\nTodos os textos, fotos e áreas de atuação podem ser 100% personalizados com a identidade oficial do escritório.\n\nPara colocar no ar com domínio próprio e configurado, o valor é de apenas R$ 297 (taxa única de implementação) mais a anuidade do domínio próprio (em média R$ 60 ao ano).\n\nDepois me conte o que achou da estrutura!`;
    }

    if (variant === 'recuperacao' || variant === 'recuperacao1' || variant === 'followup') {
      return `Olá, tudo bem?\n\nMandei uma mensagem aqui anteriormente, mas nem sei se este é o melhor contato para tratar sobre a presença digital e novos clientes do escritório...\n\nCaso não seja, teria algum outro canal ou pessoa responsável que você pudesse me indicar?`;
    }

    if (variant === 'recuperacao2' || variant === 'recuperacao_confirmou') {
      return `Perfeito, ${salutation.salutationCall}!\n\nQuis apenas retomar o contato porque verifiquei que vocês possuem excelente avaliação no Google Maps em ${city}, mas ainda não têm um site oficial cadastrado.\n\nHoje, potenciais clientes que pesquisam por advogados na sua região acabam fechando com outros escritórios por não encontrarem uma página de contato rápido de vocês.\n\nCheguei a desenhar um modelo exclusivo para o escritório de vocês verem na prática como resolver isso:\n\n👉 ${previewUrl}\n(Caso ache mais seguro e prático, também posso te enviar a prévia completa em PDF por aqui para dar uma olhada no layout).\n\n(Lembrando que todos os textos, áreas de atuação e fotos podem ser 100% personalizados com a identidade oficial de vocês).\n\nPara subir com domínio próprio e configurado, o valor é de apenas R$ 297 (taxa única de implementação) mais a anuidade do domínio (em média R$ 60 ao ano).\n\nDepois me dê um retorno sobre o que achou da estrutura!`;
    }

    if (variant === 'recuperacao_indicado') {
      return `Olá! Tudo bem?\n\nFalei anteriormente no canal principal do escritório ${salutation.officeOfPhrase} e me indicaram falar com você sobre a presença digital e captação de clientes.\n\nDesenvolvi um protótipo visual exclusivo para o escritório em ${city}:\n👉 ${previewUrl}\n\nGostaria de saber se você teria 2 minutinhos para dar uma olhada sem nenhum compromisso?`;
    }

    if (variant === 'recuperacao_recusa') {
      return `Sem problemas! Agradeço pelo retorno e pela atenção.\n\nCaso em algum momento decidam estruturar uma página rápida para converter quem pesquisa pelo escritório no Google em ${city}, fico à disposição.\n\nUm abraço e excelente trabalho para toda a equipe!`;
    }

    if (variant === 'curto') {
      return `Olá, ${salutation.salutationCall}, tudo bem? Me chamo Rafael Pita.\n\nVi seu perfil no Google Maps com ótima avaliação (${rating}${reviews}), porém notei que ainda não tem um site oficial cadastrado.\n\nFiz um modelo sob medida para você ver como ficaria:\n👉 ${previewUrl}\n(Se preferir por segurança, também posso te enviar o PDF da prévia por aqui!)\n\n(Lembrando que todos os textos, áreas de atuação e as fotos podem ser 100% alterados para colocar suas fotos reais e biografia. A ideia aqui é apenas ilustrar como o seu escritório pode se posicionar com alto padrão).\n\nCobro apenas R$ 297 (taxa única de implementação com desconto de lançamento), mais a anuidade do domínio próprio (em média R$ 60 ao ano).\n\nSe tiver interesse em colocar no ar com o seu nome essa semana, é só me dar um retorno por aqui!`;
    }

    if (variant === 'autoridade') {
      return `Olá, ${salutation.salutationCall}, tudo bem? Me chamo Rafael Pita, especialista em presença digital.\n\nEstava pesquisando em ${city} e me deparei com a excelente nota do seu estabelecimento no Google (${rating}${reviews}).\n\nMuitos clientes em potencial procuram um site oficial para validar credibilidade antes de entrar em contato e não conseguem localizar o seu. Pensando nisso, desenhei uma estrutura executiva sob medida pronta para vocês:\n\n👉 ${previewUrl}\n\nA implementação completa fica em apenas R$ 297 (pagamento único de lançamento), mais a taxa anual do domínio próprio (em média R$ 60 ao ano).\n\nTeria interesse em subir essa página oficial para converter mais contatos que te encontram no Google Maps?`;
    }

    // Padrão: Passo 1
    return `Olá, ${greeting}! Tudo bem?\n\nPor gentileza, este canal é o contato direto ${salutation.directContactPhrase} ou falo com a equipe?`;
  },

  /**
   * Retorna os 3 passos estruturados do roteiro cadenciado de prospecção
   * @param {Object} lawyer - Dados do prospecto
   * @returns {Array<{step: number, title: string, subtitle: string, variant: string, message: string}>}
   */
  getPitchSteps: (lawyer) => {
    return [
      {
        step: 1,
        title: 'Passo 1: Abertura',
        subtitle: 'Filtro da secretária / quebra de gelo',
        badge: 'Anti-spam',
        variant: 'passo1',
        message: googleMapsProspectService.generateProposalMessage(lawyer, 'passo1')
      },
      {
        step: 2,
        title: 'Passo 2: Oportunidade',
        subtitle: 'Alerta concorrência e pede autorização',
        badge: 'Permissão',
        variant: 'passo2',
        message: googleMapsProspectService.generateProposalMessage(lawyer, 'passo2')
      },
      {
        step: 3,
        title: 'Passo 3: Demonstração',
        subtitle: 'Envia o link da Landing Page e proposta de R$ 297',
        badge: 'Link + Proposta',
        variant: 'passo3',
        message: googleMapsProspectService.generateProposalMessage(lawyer, 'passo3')
      },
      {
        step: 4,
        title: 'Passo 4: Resgate (Parte 1)',
        subtitle: 'Pergunta se é o contato certo ou se há outro',
        badge: 'Canal Certo',
        variant: 'recuperacao1',
        message: googleMapsProspectService.generateProposalMessage(lawyer, 'recuperacao1')
      },
      {
        step: 5,
        title: 'Passo 5: Resgate (Parte 2)',
        subtitle: 'Envio da demonstração após confirmação',
        badge: 'Link + Proposta',
        variant: 'recuperacao2',
        message: googleMapsProspectService.generateProposalMessage(lawyer, 'recuperacao2')
      }
    ];
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
    const cleanNiche = (niche || '').toLowerCase();
    let prefix = 'estabelecimentos';
    if (cleanNiche.includes('dentist') || cleanNiche.includes('odonto')) prefix = 'clinica odontologica';
    else if (cleanNiche.includes('burger') || cleanNiche.includes('hamburguer')) prefix = 'hamburgueria artesanal';
    else if (cleanNiche.includes('barber') || cleanNiche.includes('barbearia')) prefix = 'barbearia';
    else if (cleanNiche.includes('psicolog') || cleanNiche.includes('terapia')) prefix = 'psicologo';
    else if (cleanNiche.includes('nutri')) prefix = 'nutricionista';
    else if (cleanNiche.includes('advocacia') || cleanNiche.includes('trabalhista') || cleanNiche.includes('familia') || cleanNiche.includes('consumidor')) prefix = 'advogado';

    const query = [
      prefix,
      city,
      state,
      'sem site'
    ]
      .filter(Boolean)
      .join(' ');

    return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  }
};
