/**
 * Utilitários de Prospecção Ativa, Parametrização Dinâmica e Scraper para Dentistas
 * Projeto: Landing Page Ultra-Premium de Odontologia
 * 
 * Permite que a landing page seja 100% maleável através de parâmetros da URL (Query Params)
 * ou integração com Google Maps Scraper e CRM.
 */

/**
 * Limpa e padroniza o nome do cirurgião-dentista ou clínica vindo de bases de dados ou Maps
 * @param {string} rawName - Nome bruto vindo do Google Maps
 * @returns {string} Nome higienizado com honorífico médico apropriado
 */
export function cleanDentistName(rawName) {
  if (!rawName) return 'Dr. Especialista';

  // Corta termos após barras, traços ou pipes
  let cleaned = rawName.split(/[\/|\u2013\u2014\-]/)[0].trim();

  // Remove termos genéricos de busca do Maps se estiverem no início ou fim
  cleaned = cleaned.replace(/\b(Dentista|Odontologia|Odonto|Consultorio|Consultório|Clinica|Clínica|Instituto|Centro Odontologico|Centro Odontológico|Atendimento)\b/gi, '').trim();

  // Se o resultado ficou muito curto ou vazio
  if (cleaned.length < 3) {
    return 'Dr. Especialista em Odontologia';
  }

  // Se não começar com Dr. ou Dra.
  if (!cleaned.match(/^(Dr\.|Dra\.|Doutor|Doutora)/i)) {
    const firstName = cleaned.split(' ')[0].toLowerCase();
    // Heurística de nomes femininos comuns
    const isLikelyFemale = firstName.endsWith('a') || [
      'beatriz', 'carmen', 'cleo', 'elis', 'ines', 'isis', 'lais', 'raquel', 'carol', 'alessandra', 'patricia', 'vanessa'
    ].includes(firstName);
    
    cleaned = (isLikelyFemale ? 'Dra. ' : 'Dr. ') + cleaned;
  }

  return cleaned.trim();
}

/**
 * Gera URL de embed do Google Maps para qualquer endereço ou cidade
 * @param {string} address - Endereço completo ou bairro/cidade
 * @param {string} city - Cidade
 * @returns {string} URL embed do Google Maps
 */
export function buildMapEmbedUrl(address, city) {
  const query = encodeURIComponent(`${address || ''} ${city || ''}`.trim() || 'Barra da Tijuca Rio de Janeiro');
  return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Aplica sobreposições (overrides) em tempo real vindas da URL ou do Customizador do Operador
 * @param {object} baseProfile - Perfil base demonstrativo
 * @param {URLSearchParams|object} params - Parâmetros de busca da URL ou objeto direto
 * @returns {object} Perfil com dados substituídos
 */
export function applyDentalOverrides(baseProfile, params) {
  if (!baseProfile) return null;
  if (!params) return baseProfile;

  // Cria clone profundo seguro para não modificar o banco em memória
  const profile = JSON.parse(JSON.stringify(baseProfile));

  // Helper para extrair valor seja de URLSearchParams ou de Plain Object
  const getParam = (keys) => {
    for (const key of keys) {
      if (typeof params.get === 'function') {
        const val = params.get(key);
        if (val) return val.trim();
      } else if (params && params[key]) {
        return String(params[key]).trim();
      }
    }
    return null;
  };

  // 1. Nome do Profissional / Clínica
  const rawName = getParam(['nome', 'name', 'n', 'doutor', 'dentista']);
  if (rawName) {
    const formattedName = cleanDentistName(rawName);
    profile.professional.name = formattedName;
    profile.professional.displayName = formattedName.replace(/^(Dr\.|Dra\.)\s*/i, '');
    const words = profile.professional.displayName.split(' ');
    profile.professional.avatarInitials = (words[0]?.[0] || 'D') + (words[1]?.[0] || 'R');
  }

  const clinicNameParam = getParam(['clinica', 'clinic', 'instituto', 'consultorio']);
  if (clinicNameParam) {
    profile.clinicName = clinicNameParam;
  } else if (rawName) {
    profile.clinicName = `Instituto Odontológico ${profile.professional.name}`;
  }

  const croParam = getParam(['cro', 'registro', 'r']);
  if (croParam) {
    profile.professional.cro = croParam.toUpperCase();
  }

  const titleParam = getParam(['titulo', 'title', 'especialidade', 'nicho']);
  if (titleParam) {
    profile.professional.title = titleParam;
  }

  const photoParam = getParam(['foto', 'photo', 'img']);
  if (photoParam) {
    profile.professional.photo = photoParam;
  }

  // 2. Informações de Contato & WhatsApp
  const telParam = getParam(['whatsapp', 'tel', 'phone', 'w', 'celular']);
  if (telParam) {
    const cleanDigits = telParam.replace(/\D/g, '');
    profile.contact.phone = telParam;
    profile.contact.whatsapp = cleanDigits.length <= 11 ? `55${cleanDigits}` : cleanDigits;
    const defaultBookingMsg = encodeURIComponent(
      `Olá, ${profile.professional.name}! Encontrei seu site e gostaria de agendar uma consulta de avaliação odontológica.`
    );
    profile.contact.bookingUrl = `https://wa.me/${profile.contact.whatsapp}?text=${defaultBookingMsg}`;
  }

  const emailParam = getParam(['email', 'mail']);
  if (emailParam) {
    profile.contact.email = emailParam;
  }

  // 3. Localização & Bairro / Cidade
  const cityParam = getParam(['cidade', 'city', 'c']);
  if (cityParam) {
    profile.location.city = cityParam;
  }

  const stateParam = getParam(['uf', 'estado', 'state']);
  if (stateParam) {
    profile.location.state = stateParam.toUpperCase();
  }

  const neighborhoodParam = getParam(['bairro', 'neighborhood', 'regiao']);
  if (neighborhoodParam) {
    profile.location.neighborhood = neighborhoodParam;
  }

  const addressParam = getParam(['endereco', 'address', 'rua']);
  if (addressParam) {
    profile.location.address = addressParam;
  }

  // Atualiza mapa caso cidade, bairro ou endereço tenham sido informados
  if (addressParam || neighborhoodParam || cityParam) {
    const fullLocationQuery = `${profile.location.address || ''} ${profile.location.neighborhood || ''} ${profile.location.city || ''} ${profile.location.state || ''}`.trim();
    profile.location.mapEmbedUrl = buildMapEmbedUrl(fullLocationQuery, profile.location.city);
  }

  // 4. Customização de SEO dinâmico para cidades e nomes
  if (rawName || cityParam || neighborhoodParam) {
    const locText = [profile.location.neighborhood, profile.location.city].filter(Boolean).join(' - ');
    profile.seo.title = `${profile.professional.name} | Dentista em ${locText || 'sua região'} | Odontologia Digital`;
    profile.seo.description = `Agende sua consulta odontológica com ${profile.professional.name} em ${locText}. Tratamentos modernos de implantes, alinhadores e estética dental com conforto e sem dor.`;
  }

  return profile;
}
