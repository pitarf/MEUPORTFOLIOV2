/**
 * Utilitários de Prospecção Ativa e Parametrização Dinâmica para Barbearias
 * Projeto: MeuPortfolio v2
 * 
 * Permite que a Landing Page de Barbearia seja 100% dinâmica e adaptável
 * via query params da URL (?nome=...&whatsapp=...&cidade=...&bairro=...)
 * ou via dados importados do Google Maps Scraper e CRM.
 */

/**
 * Higieniza e formata o nome bruto de barbearia vindo do Google Maps
 * @param {string} rawName - Nome bruto da barbearia
 * @returns {string} Nome formatado e profissional
 */
export function cleanBarbershopName(rawName) {
  if (!rawName) return 'Barbearia Clássica';

  // Corta termos após barras, traços ou pipes longos comuns no Google Maps
  let cleaned = rawName.split(/[\/|\u2013\u2014\-]/)[0].trim();

  // Remove repetições desnecessárias se o usuário colocou emoji ou prefixos extras
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();

  return cleaned || 'Barbearia Clássica';
}

/**
 * Higieniza números de telefone e formata para o padrão internacional do WhatsApp
 * @param {string} rawPhone - Telefone em formato qualquer
 * @returns {string} Dígitos numéricos prontos para o link do WhatsApp (ex: 5521999999999)
 */
export function formatWhatsappNumber(rawPhone) {
  if (!rawPhone) return '5521988443210';
  const digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length <= 11) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Gera URL do WhatsApp com mensagem pré-formatada para agendamento
 * @param {string} phone - Telefone celular ou WhatsApp
 * @param {string} shopName - Nome da barbearia
 * @param {string} [serviceName] - Nome opcional do serviço escolhido
 * @returns {string} Link https://wa.me/...
 */
export function formatBarbershopWhatsappUrl(phone, shopName, serviceName = null) {
  const cleanPhone = formatWhatsappNumber(phone);
  let message = `Olá! Encontrei a ${shopName || 'Barbearia'} na internet e gostaria de agendar um horário.`;
  if (serviceName) {
    message = `Olá! Gostaria de agendar o serviço "${serviceName}" na ${shopName || 'Barbearia'}. Quais são os horários disponíveis?`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Gera URL de embed do Google Maps para qualquer endereço ou cidade
 * @param {string} address - Endereço completo ou ponto de referência
 * @param {string} city - Cidade e Estado
 * @returns {string} URL segura para o iframe do Google Maps
 */
export function buildMapEmbedUrl(address, city) {
  const query = encodeURIComponent(`${address || ''} ${city || ''}`.trim() || 'Barra da Tijuca Rio de Janeiro');
  return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/**
 * Aplica sobreposições (overrides) em tempo real vindas da URL ou do CRM
 * Suporta instâncias de URLSearchParams ou objetos comuns de propriedades.
 * 
 * Parâmetros suportados:
 * - nome, name, barbearia, n -> Nome da barbearia
 * - whatsapp, tel, phone, zap, w -> Telefone / WhatsApp de agendamento
 * - cidade, city, c -> Cidade
 * - bairro, neighborhood, b -> Bairro
 * - endereco, address, rua -> Endereço completo
 * - foto, hero, banner -> Foto de destaque do hero
 * - barbeiro, barber -> Nome do barbeiro principal
 * - avaliacao, rating -> Nota do Google (ex: 4.9)
 * - horario, hours -> Horário de funcionamento resumido
 * 
 * @param {object} baseData - Dados base de Barbearia
 * @param {URLSearchParams|object} params - Parâmetros da requisição
 * @returns {object} Objeto clonado com os dados sobrepostos
 */
export function applyBarbershopOverrides(baseData, params) {
  if (!baseData) return null;

  // Clone profundo para não poluir o objeto de referência
  const data = JSON.parse(JSON.stringify(baseData));

  if (!params) return data;

  // Função auxiliar para buscar chaves compatíveis
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

  // 1. Nome da Barbearia
  const rawName = getParam(['nome', 'name', 'barbearia', 'n']);
  if (rawName) {
    const formattedName = cleanBarbershopName(rawName);
    data.name = formattedName;
    data.headline = `Estilo, Precisão e Tradição na ${formattedName}`;
    data.subheadline = `Mais do que um corte, uma experiência de barbearia clássica na ${formattedName}. Toalha quente, navalha afiada e chopp artesanal cortesia.`;
    data.seo.title = `${formattedName} | Estilo, Tradição e Barboterapia`;
    data.seo.description = `Agende seu horário na ${formattedName}. Barboterapia, cortes modernos e tradicionais, ambiente vintage climatizado e chopp gelado.`;
  }

  // 2. Telefone / WhatsApp
  const phoneParam = getParam(['whatsapp', 'tel', 'phone', 'zap', 'w']);
  if (phoneParam) {
    const cleanPhone = formatWhatsappNumber(phoneParam);
    data.contact.whatsapp = cleanPhone;
    data.contact.phone = phoneParam;
    data.contact.bookingMessage = `Olá! Gostaria de agendar um horário na ${data.name}.`;
  }

  // 3. Localização (Cidade, Bairro, Endereço)
  const cityParam = getParam(['cidade', 'city', 'c']);
  if (cityParam) {
    data.location.city = cityParam;
  }

  const neighborhoodParam = getParam(['bairro', 'neighborhood', 'b']);
  if (neighborhoodParam) {
    data.location.neighborhood = neighborhoodParam;
  }

  const addressParam = getParam(['endereco', 'address', 'rua']);
  if (addressParam) {
    data.location.address = addressParam;
  }

  // Ajusta o SEO e o link de mapas caso a localização tenha mudado
  if (cityParam || neighborhoodParam || addressParam) {
    const locText = [data.location.neighborhood, data.location.city].filter(Boolean).join(' - ');
    if (locText) {
      data.seo.title = `${data.name} | Barbearia em ${locText}`;
    }
    const fullLocQuery = `${data.location.address}, ${data.location.neighborhood || ''}, ${data.location.city || ''}`.trim();
    data.location.googleMapsLink = `https://maps.google.com/?q=${encodeURIComponent(fullLocQuery)}`;
  }

  // 4. Barbeiro Principal Personalizado
  const barberParam = getParam(['barbeiro', 'barber']);
  if (barberParam && data.specialists && data.specialists.length > 0) {
    data.specialists[0].name = barberParam;
  }

  // 5. Avaliação do Google (Rating)
  const ratingParam = getParam(['avaliacao', 'rating', 'stars']);
  if (ratingParam) {
    const parsedRating = parseFloat(ratingParam);
    if (!isNaN(parsedRating) && parsedRating >= 3.0 && parsedRating <= 5.0) {
      data.stats.rating = parsedRating;
      if (data.stats.highlights?.[0]) {
        data.stats.highlights[0].title = `${parsedRating.toFixed(1)} no Google`;
      }
    }
  }

  // 6. Horário de Atendimento
  const hoursParam = getParam(['horario', 'hours', 'h']);
  if (hoursParam) {
    data.hours.display = hoursParam;
  }

  // 7. Imagem de Destaque (Hero)
  const heroImageParam = getParam(['foto', 'hero', 'banner', 'img']);
  if (heroImageParam) {
    data.heroCustomImage = heroImageParam;
  }

  return data;
}
