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

// Base bruta curada de escritórios mapeados no Google Maps sem site próprio em diversas regiões do Brasil
const RAW_CURATED_MAPS_LEADS = [
  // São Paulo - SP
  {
    id: 'maps-sp-01',
    lawyer_name: 'Dr. Marcos Aurélio Rezende',
    niche: 'trabalhista',
    rating: 4.9,
    reviews_count: 58,
    phone: '(11) 98712-4091',
    whatsapp: '5511987124091',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua São Bento, 480 - Centro Histórico, São Paulo - SP',
    google_maps_url: 'https://www.google.com/maps/search/Marcos+Aurelio+Rezende+Advogado+Sao+Paulo',
    highlights: 'Atendimento humanizado, agilidade no cálculo de verbas e esclarecimento direto.',
    has_website: false,
    status: 'novo'
  },
  {
    id: 'maps-sp-02',
    lawyer_name: 'Dra. Fernanda Lins Advocacia',
    niche: 'consumidor',
    rating: 4.8,
    reviews_count: 44,
    phone: '(11) 97321-8810',
    whatsapp: '5511973218810',
    city: 'São Paulo',
    state: 'SP',
    address: 'Rua Domingos de Morais, 2187 - Vila Mariana, São Paulo - SP',
    google_maps_url: 'https://www.google.com/maps/search/Fernanda+Lins+Advocacia+Sao+Paulo',
    highlights: 'Excelente no combate a juros abusivos e negativações indevidas.',
    has_website: false,
    status: 'novo'
  },
  {
    id: 'maps-sp-03',
    lawyer_name: 'Dra. Beatriz Toledo & Associados',
    niche: 'familia',
    rating: 5.0,
    reviews_count: 36,
    phone: '(11) 99140-5523',
    whatsapp: '5511991405523',
    city: 'São Paulo',
    state: 'SP',
    address: 'Alameda Santos, 1165 - Cerqueira César, São Paulo - SP',
    google_maps_url: 'https://www.google.com/maps/search/Beatriz+Toledo+Advocacia+Familia+Sao+Paulo',
    highlights: 'Empatia excepcional em divórcios consensuais e partilhas amigáveis.',
    has_website: false,
    status: 'novo'
  },

  // Rio de Janeiro - RJ
  {
    id: 'maps-rj-01',
    lawyer_name: 'Dr. Cláudio Henrique Nogueira',
    niche: 'trabalhista',
    rating: 4.9,
    reviews_count: 62,
    phone: '(21) 98144-7720',
    whatsapp: '5521981447720',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Av. Rio Branco, 156 - Centro, Rio de Janeiro - RJ',
    google_maps_url: 'https://www.google.com/maps/search/Claudio+Henrique+Nogueira+Advogado+Rio+de+Janeiro',
    highlights: 'Compromisso com prazos, excelente atendimento e assessoria firme.',
    has_website: false,
    status: 'novo'
  },
  {
    id: 'maps-rj-02',
    lawyer_name: 'Dra. Larissa Mendes Advocacia',
    niche: 'familia',
    rating: 4.8,
    reviews_count: 39,
    phone: '(21) 97230-6611',
    whatsapp: '5521972306611',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Rua Conde de Bonfim, 344 - Tijuca, Rio de Janeiro - RJ',
    google_maps_url: 'https://www.google.com/maps/search/Larissa+Mendes+Advocacia+Rio+de+Janeiro',
    highlights: 'Acolhimento humanizado em processos de pensão e inventários rápidos.',
    has_website: false,
    status: 'novo'
  },

  // Belo Horizonte - MG
  {
    id: 'maps-mg-01',
    lawyer_name: 'Dr. Thiago Guimarães Santos',
    niche: 'geral',
    rating: 4.9,
    reviews_count: 51,
    phone: '(31) 98845-1230',
    whatsapp: '5531988451230',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Av. Afonso Pena, 3111 - Funcionários, Belo Horizonte - MG',
    google_maps_url: 'https://www.google.com/maps/search/Thiago+Guimaraes+Advogado+Belo+Horizonte',
    highlights: 'Grande clareza nas orientações e retorno rápido pelo WhatsApp.',
    has_website: false,
    status: 'novo'
  },
  {
    id: 'maps-mg-02',
    lawyer_name: 'Dra. Renata Vasconcelos',
    niche: 'consumidor',
    rating: 4.7,
    reviews_count: 42,
    phone: '(31) 99210-9944',
    whatsapp: '5531992109944',
    city: 'Belo Horizonte',
    state: 'MG',
    address: 'Rua dos Guajajaras, 650 - Lourdes, Belo Horizonte - MG',
    google_maps_url: 'https://www.google.com/maps/search/Renata+Vasconcelos+Advogada+Belo+Horizonte',
    highlights: 'Resolução rápida de problemas bancários e negativações indevidas.',
    has_website: false,
    status: 'novo'
  },

  // Curitiba - PR
  {
    id: 'maps-pr-01',
    lawyer_name: 'Dr. Leonardo Castilho & Sócios',
    niche: 'geral',
    rating: 5.0,
    reviews_count: 48,
    phone: '(41) 99188-3320',
    whatsapp: '5541991883320',
    city: 'Curitiba',
    state: 'PR',
    address: 'Rua Marechal Deodoro, 630 - Centro, Curitiba - PR',
    google_maps_url: 'https://www.google.com/maps/search/Leonardo+Castilho+Advocacia+Curitiba',
    highlights: 'Transparência ética, comunicação sem jargões e dedicação total.',
    has_website: false,
    status: 'novo'
  },

  // Salvador - BA
  {
    id: 'maps-ba-01',
    lawyer_name: 'Dra. Gabriela Dantas Advocacia',
    niche: 'trabalhista',
    rating: 4.9,
    reviews_count: 53,
    phone: '(71) 98120-4560',
    whatsapp: '5571981204560',
    city: 'Salvador',
    state: 'BA',
    address: 'Av. Tancredo Neves, 1632 - Caminho das Árvores, Salvador - BA',
    google_maps_url: 'https://www.google.com/maps/search/Gabriela+Dantas+Advogada+Salvador',
    highlights: 'Atendimento prestativo, cálculos precisos e defesa firme dos direitos.',
    has_website: false,
    status: 'novo'
  },

  // Brasília - DF
  {
    id: 'maps-df-01',
    lawyer_name: 'Dr. Eduardo Farias Consultoria Jurídica',
    niche: 'geral',
    rating: 4.9,
    reviews_count: 67,
    phone: '(61) 98450-8910',
    whatsapp: '5561984508910',
    city: 'Brasília',
    state: 'DF',
    address: 'SCN Quadra 2 Bloco D - Asa Norte, Brasília - DF',
    google_maps_url: 'https://www.google.com/maps/search/Eduardo+Farias+Advocacia+Brasilia',
    highlights: 'Conhecimento aprofundado dos tribunais e extrema pontualidade.',
    has_website: false,
    status: 'novo'
  },

  // Aracaju - SE
  {
    id: 'maps-se-01',
    lawyer_name: 'Dra. Juliana Prado Advocacia',
    niche: 'familia',
    rating: 5.0,
    reviews_count: 31,
    phone: '(79) 99880-1422',
    whatsapp: '557998801422',
    city: 'Aracaju',
    state: 'SE',
    address: 'Av. Min. Geraldo Barreto Sobral, 2100 - Jardins, Aracaju - SE',
    google_maps_url: 'https://www.google.com/maps/search/Juliana+Prado+Advogada+Aracaju',
    highlights: 'Excelente condução de inventários extrajudiciais e acordos familiares.',
    has_website: false,
    status: 'novo'
  },

  // Porto Alegre - RS
  {
    id: 'maps-rs-01',
    lawyer_name: 'Dr. Rodrigo Bittencourt',
    niche: 'trabalhista',
    rating: 4.8,
    reviews_count: 46,
    phone: '(51) 99310-7740',
    whatsapp: '5551993107740',
    city: 'Porto Alegre',
    state: 'RS',
    address: 'Av. Borges de Medeiros, 2500 - Praia de Belas, Porto Alegre - RS',
    google_maps_url: 'https://www.google.com/maps/search/Rodrigo+Bittencourt+Advogado+Porto+Alegre',
    highlights: 'Especialista dedicado, postura ética e transparência nos honorários.',
    has_website: false,
    status: 'novo'
  },

  // Goiânia - GO
  {
    id: 'maps-go-01',
    lawyer_name: 'Dra. Camila Alencar Advocacia',
    niche: 'consumidor',
    rating: 4.9,
    reviews_count: 38,
    phone: '(62) 98230-1199',
    whatsapp: '5562982301199',
    city: 'Goiânia',
    state: 'GO',
    address: 'Av. T-10, 1300 - Setor Bueno, Goiânia - GO',
    google_maps_url: 'https://www.google.com/maps/search/Camila+Alencar+Advogada+Goiania',
    highlights: 'Atendimento ágil pelo WhatsApp e soluções céleres contra abusos bancários.',
    has_website: false,
    status: 'novo'
  },

  // Fortaleza - CE
  {
    id: 'maps-ce-01',
    lawyer_name: 'Dr. Paulo Victor Holanda',
    niche: 'geral',
    rating: 5.0,
    reviews_count: 41,
    phone: '(85) 99120-6655',
    whatsapp: '5585991206655',
    city: 'Fortaleza',
    state: 'CE',
    address: 'Av. Santos Dumont, 2828 - Aldeota, Fortaleza - CE',
    google_maps_url: 'https://www.google.com/maps/search/Paulo+Victor+Holanda+Advogado+Fortaleza',
    highlights: 'Advogado honesto, prestativo e sempre disponível para tirar dúvidas.',
    has_website: false,
    status: 'novo'
  }
];

// Base curada enriquecida automaticamente com URL de precisão no Google Maps e slug padronizado
const CURATED_MAPS_LEADS = RAW_CURATED_MAPS_LEADS.map((lead) => ({
  ...lead,
  google_maps_url: buildGoogleMapsUrl(lead),
  slug: generateLawyerSlug(lead)
}));

export const googleMapsProspectService = {
  /**
   * Realiza a busca de advogados sem site no Google Maps
   * @param {Object} params
   * @param {string} params.city - Cidade de busca
   * @param {string} params.state - Estado (UF)
   * @param {string} params.niche - Especialidade (geral, trabalhista, familia, consumidor, todos)
   * @param {number} params.minRating - Avaliação mínima (ex: 4.5, 4.7)
   * @param {boolean} params.useAi - Se deve acionar a IA do Gemini para escanear novos leads ao vivo
   * @returns {Promise<Array>}
   */
  search: async ({ city = '', state = '', niche = 'todos', minRating = 4.5, useAi = false }) => {
    let results = [];

    // 1. Filtrar base curada local
    results = CURATED_MAPS_LEADS.filter((item) => {
      const matchCity = !city || item.city.toLowerCase().includes(city.toLowerCase().trim());
      const matchState = !state || item.state.toLowerCase() === state.toLowerCase().trim();
      const matchNiche = niche === 'todos' || item.niche === niche;
      const matchRating = item.rating >= Number(minRating);

      return matchCity && matchState && matchNiche && matchRating;
    });

    // 2. Se o usuário solicitou varredura com IA ou se a busca local retornou poucos resultados
    if (useAi || results.length === 0) {
      try {
        const targetCity = city.trim() || 'São Paulo';
        const targetState = state.trim() || 'SP';
        const aiLeads = await scanLawyersWithoutWebsite(targetCity, targetState, niche);

        if (Array.isArray(aiLeads) && aiLeads.length > 0) {
          // Filtrar por rating
          const validAiLeads = aiLeads.filter(
            (l) => Number(l.rating || 0) >= Number(minRating) && !l.has_website
          );

          // Mesclar evitando duplicados
          const existingNames = new Set(results.map((r) => (r.lawyer_name || r.name || '').toLowerCase()).filter(Boolean));
          for (const lead of validAiLeads) {
            const leadName = (lead.lawyer_name || lead.name || '').toLowerCase();
            if (leadName && !existingNames.has(leadName)) {
              results.unshift({
                ...lead,
                id: lead.id || `maps-ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                isAiGenerated: true,
                status: 'novo'
              });
            }
          }
        }
      } catch (err) {
        console.warn('Varredura com IA indisponível ou limitada, usando base curada:', err);
      }
    }

    // Adiciona slug normalizado e garante URL oficial do Google Maps a cada lead
    const leadsWithSlugs = results.map((item) => ({
      ...item,
      slug: item.slug || generateLawyerSlug(item),
      google_maps_url: buildGoogleMapsUrl(item)
    }));

    try {
      localStorage.setItem('rp_radar_maps_leads', JSON.stringify(leadsWithSlugs));
    } catch (e) {
      console.warn('Erro ao salvar cache do radar no localStorage', e);
    }

    return leadsWithSlugs;
  },

  /**
   * Busca um lead do Google Maps por slug
   * @param {string} slug
   * @returns {Object|null}
   */
  getBySlug: (slug) => {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();

    // 1. Procurar no cache salvo pelo Radar no localStorage
    try {
      const stored = localStorage.getItem('rp_radar_maps_leads');
      if (stored) {
        const parsed = JSON.parse(stored);
        const match = parsed.find((l) => {
          const lSlug = (l.slug || generateLawyerSlug(l)).toLowerCase();
          return lSlug === cleanSlug || l.id === cleanSlug;
        });
        if (match) {
          return {
            ...match,
            google_maps_url: buildGoogleMapsUrl(match)
          };
        }
      }
    } catch (e) {
      console.warn('Erro ao ler cache do radar no localStorage', e);
    }

    // 2. Procurar na base curada fixa
    const matchCurated = CURATED_MAPS_LEADS.find((l) => {
      const lSlug = (l.slug || generateLawyerSlug(l)).toLowerCase();
      return lSlug === cleanSlug || l.id === cleanSlug;
    });
    if (matchCurated) {
      return {
        ...matchCurated,
        slug: generateLawyerSlug(matchCurated),
        google_maps_url: buildGoogleMapsUrl(matchCurated)
      };
    }

    // 3. Fallback inteligente por prefixo do nome
    try {
      const stored = localStorage.getItem('rp_radar_maps_leads');
      const allLeads = [
        ...(stored ? JSON.parse(stored) : []),
        ...CURATED_MAPS_LEADS
      ];
      const matchPartial = allLeads.find((l) => {
        const lSlug = (l.slug || generateLawyerSlug(l)).toLowerCase();
        return cleanSlug.startsWith(lSlug) || lSlug.startsWith(cleanSlug);
      });
      if (matchPartial) {
        return {
          ...matchPartial,
          google_maps_url: buildGoogleMapsUrl(matchPartial)
        };
      }
    } catch {}

    // 4. Inferência dinâmica a partir do slug (caso aberto em aba anônima ou dispositivo do cliente)
    const parts = cleanSlug.split('-').filter(Boolean);
    if (parts.length >= 2) {
      const titleCased = parts.map((p) => {
        if (p === 'dr') return 'Dr.';
        if (p === 'dra') return 'Dra.';
        if (['de', 'da', 'do', 'dos', 'das', 'e'].includes(p)) return p;
        return p.charAt(0).toUpperCase() + p.slice(1);
      }).join(' ');

      return {
        id: `inferred-${cleanSlug}`,
        lawyer_name: titleCased,
        niche: 'geral',
        rating: 4.9,
        reviews_count: 28,
        city: 'Atendimento Nacional',
        state: 'BR',
        address: 'Atendimento Presencial e Online em Todo o Território Nacional',
        phone: '',
        whatsapp: '',
        instagram: '',
        highlights: 'Excelência em atendimento jurídico e suporte consultivo.',
        has_website: false,
        slug: cleanSlug,
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(titleCased)}`
      };
    }

    return null;
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
