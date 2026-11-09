/**
 * Utilitários de Prospecção Ativa e Parametrização Dinâmica para Hamburguerias & Gastrobares
 * Permite que a Landing Page seja 100% maleável através de query params da URL
 * vindos do Google Maps Scraper, CRM ou links personalizados de prospecção.
 */

import { sanitizeWhatsAppPhone } from './whatsappMessages';

/**
 * Higieniza o nome da hamburgueria removendo termos residuais de buscas brutas
 * @param {string} rawName - Nome bruto vindo do Google Maps
 * @returns {string} Nome limpo e atrativo
 */
export function cleanBurgerBusinessName(rawName) {
  if (!rawName) return 'Hamburgueria Artesanal';

  // Corta termos após barras, traços ou pipes longos
  let cleaned = rawName.split(/[\/|\u2013\u2014\-]/)[0].trim();

  // Limpa caracteres especiais soltos
  cleaned = cleaned.replace(/[#@*!]/g, '').trim();

  return cleaned || 'Hamburgueria Artesanal';
}

/**
 * Cria a URL de direcionamento para o WhatsApp com mensagem codificada
 * @param {string} phone - Telefone com ou sem código do país
 * @param {string} message - Mensagem pré-formatada
 * @returns {string} Link pronto wa.me
 */
export function buildWhatsAppLink(phone, message) {
  const cleanPhone = sanitizeWhatsAppPhone(phone || '5521987654321');
  const encodedText = encodeURIComponent(message || 'Olá! Gostaria de ver o cardápio e fazer um pedido!');
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Mensagem rápida para pedido de item específico do cardápio
 * @param {object} item - Item do cardápio selecionado
 * @param {string} businessName - Nome da hamburgueria
 * @returns {string} Texto formatado para o WhatsApp
 */
export function buildItemOrderMessage(item, businessName = 'Hamburgueria') {
  const priceFormatted = Number(item.price || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return `Olá, equipe da *${businessName}*! 🔥\n\nGostaria de pedir o seguinte item do cardápio:\n👉 *${item.name}* (${priceFormatted})\n\nPor favor, me informe o tempo estimado de entrega e a taxa para o meu endereço!`;
}

/**
 * Mensagem rápida para pedido de Combo Promocional
 * @param {object} combo - Combo selecionado
 * @param {string} businessName - Nome da hamburgueria
 * @returns {string} Texto formatado para o WhatsApp
 */
export function buildComboOrderMessage(combo, businessName = 'Hamburgueria') {
  const priceFormatted = Number(combo.price || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return `Olá, *${businessName}*! 🔥\n\nQuero aproveitar o desconto especial e pedir o:\n🍔 *${combo.title}* por *${priceFormatted}*\n\nComo faço para confirmar meu pedido e forma de pagamento?`;
}

/**
 * Mensagem padrão de primeiro pedido com desconto direto
 * @param {string} businessName - Nome da hamburgueria
 * @param {string} discountText - Texto do benefício/desconto
 * @returns {string} Texto do WhatsApp
 */
export function buildGeneralOrderMessage(businessName = 'Hamburgueria', discountText = '15% OFF') {
  return `Olá, equipe da *${businessName}*! 🔥\n\nGostaria de ver o cardápio completo e fazer um pedido com a condição especial de pedido direto (${discountText})!`;
}

/**
 * Aplica sobreposições (overrides) em tempo real vindas da URL ou do CRM
 * @param {object} baseData - Dados base da hamburgueria (defaultBurgerData)
 * @param {URLSearchParams|object} params - Parâmetros da busca ou objeto de edição
 * @returns {object} Dados combinados com sobreposições
 */
export function applyBurgerOverrides(baseData, params) {
  if (!baseData) return null;
  if (!params) return baseData;

  // Cria clone profundo seguro
  const data = JSON.parse(JSON.stringify(baseData));

  // Helper para buscar parâmetros com múltiplos sinônimos
  const getParam = (keys) => {
    for (const key of keys) {
      if (typeof params.get === 'function') {
        const val = params.get(key);
        if (val && val.trim() !== '') return val.trim();
      } else if (params[key] && String(params[key]).trim() !== '') {
        return String(params[key]).trim();
      }
    }
    return null;
  };

  // 1. Nome da Hamburgueria
  const rawName = getParam(['nome', 'name', 'n', 'hamburgueria', 'loja', 'fantasia']);
  if (rawName) {
    const cleaned = cleanBurgerBusinessName(rawName);
    data.name = cleaned;
    data.slogan = `O Verdadeiro Hambúrguer Artesanal de ${cleaned}`;
    data.tagline = `Crosta perfeita, queijo derretido e pão brioche amanteigado. Peça direto no WhatsApp da ${cleaned}.`;
  }

  // 2. Telefone / WhatsApp
  const phoneParam = getParam(['whatsapp', 'tel', 'telefone', 'phone', 'zap', 'w']);
  if (phoneParam) {
    const cleanDigits = phoneParam.replace(/\D/g, '');
    const fullPhone = cleanDigits.length <= 11 ? `55${cleanDigits}` : cleanDigits;
    data.contact.whatsapp = fullPhone;
    data.contact.phone = phoneParam;
  }

  // 3. Cidade e Bairro
  const cityParam = getParam(['cidade', 'city', 'municipio', 'c']);
  if (cityParam) {
    data.location.city = cityParam;
  }

  const neighborhoodParam = getParam(['bairro', 'neighborhood', 'regiao', 'b']);
  if (neighborhoodParam) {
    data.location.neighborhood = neighborhoodParam;
    if (!data.location.coveredNeighborhoods.includes(neighborhoodParam)) {
      data.location.coveredNeighborhoods = [neighborhoodParam, ...data.location.coveredNeighborhoods];
    }
  }

  const addressParam = getParam(['endereco', 'rua', 'address', 'local']);
  if (addressParam) {
    data.location.address = addressParam;
  }

  const stateParam = getParam(['estado', 'uf', 'state']);
  if (stateParam) {
    data.location.state = stateParam.toUpperCase();
  }

  // Atualiza Google Maps URL se endereco/cidade mudarem
  if (cityParam || addressParam) {
    const fullQuery = encodeURIComponent(`${data.location.address}, ${data.location.neighborhood}, ${data.location.city} - ${data.location.state}`);
    data.location.googleMapsUrl = `https://maps.google.com/?q=${fullQuery}`;
  }

  // 4. Instagram
  const instaParam = getParam(['instagram', 'insta', 'ig']);
  if (instaParam) {
    data.contact.instagram = instaParam.startsWith('@') ? instaParam : `@${instaParam}`;
  }

  // 5. Parâmetros de Delivery & Operação
  const deliveryTimeParam = getParam(['tempo', 'tempoEntrega', 'tempo_entrega']);
  if (deliveryTimeParam) {
    data.avgDeliveryTime = deliveryTimeParam;
  }

  const deliveryFeeParam = getParam(['taxa', 'taxaEntrega', 'taxa_entrega', 'frete']);
  if (deliveryFeeParam) {
    data.standardDeliveryFee = deliveryFeeParam.startsWith('R$') ? deliveryFeeParam : `R$ ${deliveryFeeParam}`;
  }

  const discountParam = getParam(['desconto', 'cupom', 'promocao']);
  if (discountParam) {
    data.discountDirectOrder = discountParam;
  }

  const ratingParam = getParam(['nota', 'avaliacao', 'rating']);
  if (ratingParam) {
    const num = parseFloat(ratingParam.replace(',', '.'));
    if (!isNaN(num) && num >= 3.5 && num <= 5.0) {
      data.rating = num;
    }
  }

  return data;
}
