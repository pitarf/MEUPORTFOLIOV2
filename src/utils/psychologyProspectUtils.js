/**
 * Utilitários de Prospecção Ativa, Parametrização Dinâmica e Conformidade Ética para Psicologia
 * Permite que a Landing Page seja 100% maleável via parâmetros da URL ou simulação no CRM.
 */

import { getGreetingByBrasiliaTime } from './greetingUtils';

/**
 * Limpa e padroniza o nome do profissional vindo do Google Maps ou formulários
 * @param {string} rawName - Nome bruto
 * @returns {string} Nome higienizado com honorífico adequado
 */
export function cleanPsychologistName(rawName) {
  if (!rawName) return 'Psicóloga Clínica';

  // Corta termos após barras, traços ou pipes
  let cleaned = rawName.split(/[\/|\u2013\u2014\-]/)[0].trim();

  // Remove termos comuns do Google Maps
  cleaned = cleaned.replace(/\b(Psicologia|Psicólogo|Psicóloga|Psic|Psi|Consultorio|Consultório|Clínica|Clinica|Espaço|Espaco|Instituto|Centro)\b/gi, '').trim();

  // Se não começar com Dr. ou Dra., detecta heurística feminina simples
  if (!cleaned.match(/^(Dr\.|Dra\.|Doutor|Doutora|Psicóloga|Psicólogo)/i)) {
    const firstName = cleaned.split(' ')[0].toLowerCase();
    const isLikelyFemale = firstName.endsWith('a') || ['beatriz', 'carmen', 'cleo', 'elis', 'ines', 'isis', 'lais', 'raquel', 'marina', 'camila', 'aline'].includes(firstName);
    cleaned = (isLikelyFemale ? 'Dra. ' : 'Dr. ') + cleaned;
  }

  return cleaned.trim();
}

/**
 * Formata ou valida o número de CRP (Conselho Regional de Psicologia)
 * @param {string} rawCrp - Ex: "05/67890" ou "67890" ou "CRP 05/12345"
 * @returns {string} CRP formatado
 */
export function formatCrpNumber(rawCrp) {
  if (!rawCrp) return 'CRP 05/67890';
  let cleaned = rawCrp.trim();
  if (!cleaned.toUpperCase().startsWith('CRP')) {
    cleaned = `CRP ${cleaned}`;
  }
  return cleaned;
}

/**
 * Gera URL de embed do Google Maps para o endereço do consultório
 * @param {string} address - Endereço ou ponto de referência
 * @param {string} city - Cidade / Bairro
 * @returns {string} URL embed do Google Maps
 */
export function buildPsychologyMapEmbedUrl(address, city) {
  const query = encodeURIComponent(`${address || ''} ${city || ''}`.trim() || 'Ipanema Rio de Janeiro');
  return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Constrói o link do WhatsApp com mensagem acolhedora pré-preenchida
 * @param {string} phone - Telefone em formato numérico
 * @param {string} psychologistName - Nome do profissional
 * @param {string} context - Motivo ou especialidade selecionada
 * @returns {string} URL wa.me
 */
export function buildWhatsAppBookingUrl(phone, psychologistName, context = '') {
  const cleanPhone = (phone || '21987654321').replace(/\D/g, '');
  const greeting = getGreetingByBrasiliaTime ? getGreetingByBrasiliaTime() : 'Olá';
  const name = psychologistName || 'Dra. Juliana';
  
  let text = `${greeting}, ${name}! Gostaria de receber informações sobre o atendimento e agendamento de psicoterapia.`;
  if (context) {
    text += ` Tenho interesse especial em acolhimento para: ${context}.`;
  }

  return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Scripts de abordagem comercial sob medida para psicólogos
 */
export const PSYCHOLOGY_PITCH_SCRIPTS = [
  {
    id: 'script-acolhimento',
    title: 'Abordagem Empática e Elegante (Mais Convertida)',
    text: (name, link) =>
      `Olá, ${name}! Tudo bem?\n\nEstive pesquisando sobre consultórios de psicologia na sua região e notei o cuidado que você tem com seus pacientes.\n\nMontei uma demonstração exclusiva de como a sua presença digital pode transmitir o mesmo acolhimento, serenidade e respeito ético do seu consultório físico, com agendamento direto pelo WhatsApp:\n\n👉 ${link}\n\nO que achou da proposta visual?`
  },
  {
    id: 'script-online',
    title: 'Foco em Atendimento Online & Expatriação',
    text: (name, link) =>
      `Olá, ${name}! Como vai?\n\nMuitos psicólogos estão expandindo seus atendimentos para pacientes particulares em todo o Brasil e brasileiros no exterior, mas enfrentam barreiras com sites genéricos ou lentos.\n\nCriei este modelo interativo pensado especialmente para a sua especialidade, em estrita conformidade com o CFP:\n\n👉 ${link}\n\nSe fizer sentido para o seu momento, posso personalizá-lo com suas fotos e textos reais.`
  }
];

/**
 * Gera URL de demonstração personalizada pronta com parâmetros de busca
 * @param {object} data - Dados do formulário
 * @param {string} baseUrl - URL base da aplicação
 * @returns {string} Link com query params
 */
export function buildPsychologyShareUrl(data, baseUrl = '') {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();

  if (data.name) params.set('nome', data.name);
  if (data.crp) params.set('crp', data.crp);
  if (data.whatsapp || data.phone) params.set('whatsapp', (data.whatsapp || data.phone).replace(/\D/g, ''));
  if (data.city) params.set('cidade', data.city);
  if (data.neighborhood) params.set('bairro', data.neighborhood);
  if (data.address) params.set('endereco', data.address);
  if (data.title) params.set('titulo', data.title);
  if (data.avatarUrl) params.set('foto', data.avatarUrl);

  const query = params.toString();
  return `${base}/psicologo${query ? `?${query}` : ''}`;
}

/**
 * Aplica sobreposições dinâmicas (overrides) em tempo real vindas da URL ou do CRM
 * @param {object} baseProfile - Perfil base de psicologia
 * @param {URLSearchParams|object} params - Parâmetros de consulta da URL ou plain object
 * @returns {object} Perfil com todas as informações personalizadas
 */
export function applyPsychologyOverrides(baseProfile, params) {
  if (!baseProfile) return null;

  // Cria clone profundo seguro
  const profile = JSON.parse(JSON.stringify(baseProfile));
  if (!params) return profile;

  // Helper para ler parâmetros tanto de URLSearchParams quanto de objetos plain
  const getParam = (keys) => {
    for (const key of keys) {
      if (typeof params.get === 'function') {
        const val = params.get(key);
        if (val !== null && val !== undefined && val.trim() !== '') return val.trim();
      } else if (params && typeof params === 'object') {
        const val = params[key];
        if (val !== null && val !== undefined && String(val).trim() !== '') return String(val).trim();
      }
    }
    return null;
  };

  // 1. Nome e Apresentação
  const rawName = getParam(['nome', 'name', 'profissional', 'psicologo', 'psicologa']);
  if (rawName) {
    profile.name = cleanPsychologistName(rawName);
    profile.slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  // 2. Registro CRP
  const rawCrp = getParam(['crp', 'registro', 'registroProfissional']);
  if (rawCrp) {
    profile.crp = formatCrpNumber(rawCrp);
    if (profile.hero) {
      profile.hero.confidentialityBadge = `Sigilo Profissional Absoluto (${profile.crp})`;
    }
  }

  // 3. Título / Abordagem Terapêutica
  const title = getParam(['titulo', 'title', 'cargo', 'abordagem']);
  if (title) {
    profile.title = title;
  }

  // 4. Telefone e WhatsApp
  const phone = getParam(['whatsapp', 'telefone', 'phone', 'celular', 'contato']);
  if (phone) {
    const cleanNumber = phone.replace(/\D/g, '');
    profile.phone = cleanNumber;
    if (cleanNumber.length === 11) {
      profile.phoneFormatted = `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2, 7)}-${cleanNumber.slice(7)}`;
    } else if (cleanNumber.length === 10) {
      profile.phoneFormatted = `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2, 6)}-${cleanNumber.slice(6)}`;
    } else {
      profile.phoneFormatted = phone;
    }
  }

  // 5. Localização (Cidade, Estado, Bairro, Endereço)
  const city = getParam(['cidade', 'city', 'municipio']);
  if (city) profile.city = city;

  const state = getParam(['estado', 'state', 'uf']);
  if (state) profile.state = state.toUpperCase();

  const neighborhood = getParam(['bairro', 'neighborhood']);
  if (neighborhood) profile.neighborhood = neighborhood;

  const address = getParam(['endereco', 'address', 'rua', 'logradouro']);
  if (address) profile.address = address;

  const addressComplement = getParam(['complemento', 'addressComplement']);
  if (addressComplement) profile.addressComplement = addressComplement;

  // Atualiza subtítulo do atendimento presencial se houver cidade/bairro
  if (profile.modalities && profile.modalities[0]) {
    const locString = [profile.neighborhood, profile.city].filter(Boolean).join(', ');
    if (locString) {
      profile.modalities[0].subtitle = `Consultório em ${locString}`;
    }
  }

  // 6. Foto do Profissional (Avatar / Perfil)
  const avatar = getParam(['foto', 'avatar', 'avatarUrl', 'imagem', 'photo']);
  if (avatar) {
    profile.avatarUrl = avatar;
  }

  // 7. Textos do Hero
  const headline = getParam(['headline', 'chamada', 'tituloHero']);
  if (headline && profile.hero) {
    profile.hero.headline = headline;
  }

  const subheadline = getParam(['subheadline', 'subtitulo', 'descricaoHero']);
  if (subheadline && profile.hero) {
    profile.hero.subheadline = subheadline;
  }

  // 8. Anos de Experiência e Avaliações Google
  const experience = getParam(['experiencia', 'anos', 'yearsOfExperience']);
  if (experience) {
    profile.yearsOfExperience = parseInt(experience, 10) || profile.yearsOfExperience;
  }

  const reviews = getParam(['avaliacoes', 'reviews', 'reviewCount']);
  if (reviews) {
    profile.reviewCount = parseInt(reviews, 10) || profile.reviewCount;
  }

  const rating = getParam(['nota', 'rating', 'estrelas']);
  if (rating) {
    profile.rating = parseFloat(rating) || 5.0;
  }

  // 9. E-mail
  const email = getParam(['email', 'mail']);
  if (email) profile.email = email;

  // 10. Atualiza mensagem padrão do WhatsApp com o nome ativo
  profile.whatsappMessage = `Olá, ${profile.name}! Gostaria de saber como funciona o atendimento e verificar os horários disponíveis para psicoterapia.`;

  return profile;
}
