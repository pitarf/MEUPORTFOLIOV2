/**
 * Utilitarios de Prospeccao Ativa e Parametrizacao Dinamica para Nutricionistas
 * Permite que a mesma landing page seja 100% maleavel atraves de parametros da URL
 * ou edicao manual no simulador de prospecção.
 */

import { getGreetingByBrasiliaTime } from './greetingUtils';

/**
 * Limpa e padroniza o nome do profissional (remove caracteres especiais e termos excessivos do Maps)
 * @param {string} rawName - Nome bruto vindo do Google Maps
 * @returns {string} Nome higienizado com honorifico
 */
export function cleanNutritionistName(rawName) {
  if (!rawName) return 'Nutricionista';

  // Corta termos apos barras, tracos ou pipes
  let cleaned = rawName.split(/[\/|\u2013\u2014\-]/)[0].trim();

  // Remove termos como "Nutricionista", "Nutricao", "Consultorio", "Clinica"
  cleaned = cleaned.replace(/\b(Nutricionista|Nutricao|Nutrição|Clinica|Clínica|Consultorio|Consultório|Espaco|Espaço)\b/gi, '').trim();

  // Se nao comecar com Dr. ou Dra., e for nome feminino comum ou geral
  if (!cleaned.match(/^(Dr\.|Dra\.|Doutor|Doutora)/i)) {
    // Detecta heuristica simples de nomes femininos terminados em a
    const firstName = cleaned.split(' ')[0].toLowerCase();
    const isLikelyFemale = firstName.endsWith('a') || ['beatriz', 'carmen', 'cleo', 'elis', 'ines', 'isis', 'lais', 'raquel'].includes(firstName);
    cleaned = (isLikelyFemale ? 'Dra. ' : 'Dr. ') + cleaned;
  }

  return cleaned.trim();
}

/**
 * Gera URL de embed do Google Maps para qualquer endereco
 * @param {string} address - Endereco completo ou cidade
 * @returns {string} URL embed do Google Maps
 */
export function buildMapEmbedUrl(address, city) {
  const query = encodeURIComponent(`${address || ''} ${city || ''}`.trim() || 'Rio de Janeiro');
  return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Aplica sobreposicoes (overrides) em tempo real vindas da URL ou do Customizador
 * @param {object} baseProfile - Perfil base demonstrativo
 * @param {URLSearchParams|object} params - Parametros de busca ou objeto de edicao
 * @returns {object} Perfil com todas as informacoes substituidas
 */
export function applyNutritionistOverrides(baseProfile, params) {
  if (!baseProfile) return null;

  // Cria clone profundo seguro
  const profile = JSON.parse(JSON.stringify(baseProfile));

  // Helper para extrair valor seja de URLSearchParams ou de Plain Object
  const getParam = (keys) => {
    for (const key of keys) {
      if (typeof params.get === 'function') {
        const val = params.get(key);
        if (val) return val.trim();
      } else if (params[key]) {
        return String(params[key]).trim();
      }
    }
    return null;
  };

  // 1. Parametros do Profissional
  const rawName = getParam(['nome', 'name', 'n']);
  if (rawName) {
    const formattedName = cleanNutritionistName(rawName);
    profile.professional.name = formattedName;
    profile.professional.displayName = formattedName.replace(/^(Dr\.|Dra\.)\s*/i, '');
    const words = profile.professional.displayName.split(' ');
    profile.professional.avatarInitials = (words[0]?.[0] || 'N') + (words[1]?.[0] || 'U');
  }

  const crnParam = getParam(['crn', 'registro', 'r']);
  if (crnParam) {
    profile.professional.crn = crnParam.toUpperCase();
  }

  const titleParam = getParam(['titulo', 'title', 'especialidade', 'nicho']);
  if (titleParam) {
    profile.professional.title = titleParam;
  }

  const photoParam = getParam(['foto', 'photo', 'img']);
  if (photoParam) {
    profile.professional.photo = photoParam;
  }

  // 2. Parametros de Contato
  const telParam = getParam(['whatsapp', 'tel', 'phone', 'w']);
  if (telParam) {
    const cleanDigits = telParam.replace(/\D/g, '');
    profile.contact.phone = telParam;
    profile.contact.whatsapp = cleanDigits.length <= 11 ? `55${cleanDigits}` : cleanDigits;
    const defaultBookingMsg = encodeURIComponent(
      `Ola, ${profile.professional.name}! Vi seu site e gostaria de agendar uma consulta nutricional.`
    );
    profile.contact.bookingUrl = `https://wa.me/${profile.contact.whatsapp}?text=${defaultBookingMsg}`;
  }

  const emailParam = getParam(['email', 'mail']);
  if (emailParam) {
    profile.contact.email = emailParam;
  }

  // 3. Parametros de Localizacao
  const cityParam = getParam(['cidade', 'city', 'c']);
  if (cityParam) {
    profile.location.city = cityParam;
  }

  const stateParam = getParam(['uf', 'estado', 'state']);
  if (stateParam) {
    profile.location.state = stateParam.toUpperCase();
  }

  const neighborhoodParam = getParam(['bairro', 'b']);
  if (neighborhoodParam) {
    profile.location.neighborhood = neighborhoodParam;
  }

  const addressParam = getParam(['endereco', 'address', 'end', 'e']);
  if (addressParam) {
    profile.location.address = addressParam;
  }

  // Se mudou cidade ou endereco, atualiza o mapa interativo
  if (addressParam || cityParam) {
    profile.location.mapEmbedUrl = buildMapEmbedUrl(profile.location.address, profile.location.city);
  }

  // 4. Atualiza Metadados de SEO para refletir os novos dados
  const locationSummary = [profile.location.neighborhood, profile.location.city].filter(Boolean).join(', ');
  profile.seo.title = `${profile.professional.name} : ${profile.professional.title} : ${locationSummary || 'Atendimento Presencial e Online'}`;
  profile.seo.description = `Agende sua consulta com ${profile.professional.name}. Acompanhamento nutricional individualizado em ${profile.location.city || 'sua regiao'} e teleconsulta em todo o Brasil.`;
  profile.seo.keywords = `nutricionista ${profile.location.city}, consulta nutricao ${profile.location.city}, ${profile.professional.title.toLowerCase()}, teleconsulta nutricao`;

  // 5. Sincroniza Badge do Hero e Itens da Faixa de Confiança
  if (profile.hero) {
    if (neighborhoodParam || cityParam) {
      profile.hero.badge = [profile.location.neighborhood, profile.location.city].filter(Boolean).join(' • ') || profile.hero.badge;
    }
  }

  if (Array.isArray(profile.trustElements)) {
    profile.trustElements = profile.trustElements.map((el) => {
      if (el.label === 'Registro Profissional' && profile.professional.crn) {
        return { ...el, value: profile.professional.crn };
      }
      if (el.label === 'Localização' && (cityParam || neighborhoodParam)) {
        return {
          ...el,
          value: profile.location.city || el.value,
          description: profile.location.neighborhood ? `${profile.location.neighborhood} • Consultório` : el.description
        };
      }
      return el;
    });
  }

  return profile;
}

/**
 * Gera a URL parametrizada pronta para compartilhar com o prospect no WhatsApp
 * @param {object} prospectData - Dados do lead do Google Maps
 * @param {string} baseOrigin - Origem da aplicacao (ex: https://rafaelpitaoficial.com.br)
 * @returns {string} URL completa com os parametros de URL
 */
export function buildNutritionistShareUrl(prospectData, baseOrigin = 'https://rafaelpitaoficial.com.br') {
  const url = new URL('/nutricionista', baseOrigin);
  const p = url.searchParams;

  if (prospectData.name) p.set('nome', prospectData.name);
  if (prospectData.whatsapp || prospectData.phone) p.set('whatsapp', (prospectData.whatsapp || prospectData.phone).replace(/\D/g, ''));
  if (prospectData.crn) p.set('crn', prospectData.crn);
  if (prospectData.city) p.set('cidade', prospectData.city);
  if (prospectData.state) p.set('uf', prospectData.state);
  if (prospectData.neighborhood) p.set('bairro', prospectData.neighborhood);
  if (prospectData.address) p.set('endereco', prospectData.address);
  if (prospectData.nicheTitle) p.set('titulo', prospectData.nicheTitle);

  return url.toString();
}

/**
 * Scripts de Prospeccao Especializados para Nutricionistas
 * Adaptados para romper filtros e focar na dor de captacao de pacientes particulares
 */
export const NUTRITION_PITCH_SCRIPTS = [
  {
    id: 'passo1_abertura',
    title: '1. Abertura Gentil (Anti-Spam)',
    badge: 'Filtro Secretária / WhatsApp',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    objective: 'Quebra de gelo sem envio de link. Identifica se fala com a secretaria ou com o(a) nutricionista.',
    getText: (data) => {
      const saudacao = getGreetingByBrasiliaTime();
      const nome = cleanNutritionistName(data.name || 'Dra. Nutricionista');
      return `Olá, ${saudacao}! Tudo bem?

Por gentileza, este canal é o contato direto com a ${nome} ou falo com a equipe do consultório?`;
    }
  },
  {
    id: 'passo2_permissao',
    title: '2. Elogio & Permissão',
    badge: 'Permissão',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
    objective: 'Destaca as avaliações no Google Maps e solicita autorização expressa para mostrar o modelo.',
    getText: (data) => {
      const cidade = data.city || 'sua região';
      return `Aqui é o Rafael Pita. Estava pesquisando nutricionistas em ${cidade} e notei a ótima reputação do consultório de vocês no Google!

Porém, reparei que vocês ainda não possuem um site próprio de agendamento conectado ao perfil do Maps, e hoje muitos pacientes que buscam no Google acabam marcando com outros profissionais por não acharem uma página oficial.

Desenvolvi uma prévia exclusiva para o consultório de vocês para mostrar como resolver isso na prática.

Me autoriza a enviar o link rápido para vocês darem uma olhada sem nenhum compromisso?`;
    }
  },
  {
    id: 'passo3_demonstracao',
    title: '3. Demonstração Personalizada + Proposta',
    badge: 'Link + Proposta R$ 297',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    objective: 'Entrega da página personalizada em tempo real com o nome e cidade do profissional.',
    getText: (data, shareUrl) => {
      const nome = cleanNutritionistName(data.name || 'Dra. Nutricionista');
      const cidade = data.city || 'sua cidade';
      const link = shareUrl || 'https://rafaelpitaoficial.com.br/nutricionista';

      return `Perfeito, ${nome}! Preparei esta prévia personalizada pensando no posicionamento do seu consultório em ${cidade}:

👉 ${link}

O foco é transformar quem pesquisa por nutricionista no Google em contatos diretos no seu WhatsApp, com layout acolhedor e 100% alinhado com o Código de Ética do CFN.

Todos os textos, fotos e especialidades podem ser personalizados com as suas informações oficiais.

Para colocar no ar no seu próprio domínio (.com.br) configurado, o valor é de apenas R$ 297 (taxa única de implementação) mais a anuidade do domínio próprio.

Depois me conte o que achou da estrutura!`;
    }
  },
  {
    id: 'passo4_resgate',
    title: '4. Resgate Despretensioso',
    badge: 'Sem Resposta',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    objective: 'Para quem visualizou e não respondeu. Pergunta de forma leve se aquele é o canal correto.',
    getText: () => {
      return `Olá, tudo bem?

Mandei uma mensagem anteriormente, mas nem sei se este é o melhor canal para falar sobre a presença digital e novos pacientes do consultório...

Caso não seja, teria algum outro contato ou responsável que você pudesse me indicar?`;
    }
  }
];
