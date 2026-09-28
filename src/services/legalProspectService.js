/**
 * Serviço de Gerenciamento de Prospecção de Advogados
 * Armazena advogados prospectados do Google Meu Negócio e gera links e copies de demonstração.
 */

import { LEGAL_NICHES } from '../data/legalTemplates';

const STORAGE_KEY = 'rp_legal_prospects';

// Prospects padrão para demonstração imediata dos 4 nichos com dados genéricos
const DEFAULT_PROSPECTS = [
  {
    id: 'demo-geral',
    slug: 'dr-jorge-santos-aracaju',
    niche: 'geral',
    lawyer_name: 'Dr. Jorge Santos',
    oab_number: 'OAB/UF 00.000',
    whatsapp: '5500900000000',
    phone: '(00) 90000-0000',
    email: 'contato@seuescritorio.adv.br',
    instagram: '@seu.escritorio.adv',
    city: 'Sua Cidade',
    state: 'UF',
    address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
    custom_hero_url: '',
    status: 'demonstracao', // 'novo', 'contatado', 'interessado', 'fechado'
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-consumidor',
    slug: 'dra-camila-nogueira-sp',
    niche: 'consumidor',
    lawyer_name: 'Dra. Camila Nogueira',
    oab_number: 'OAB/UF 00.000',
    whatsapp: '5500900000000',
    phone: '(00) 90000-0000',
    email: 'contato@seuescritorio.adv.br',
    instagram: '@seu.escritorio.adv',
    city: 'Sua Cidade',
    state: 'UF',
    address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
    custom_hero_url: '',
    status: 'novo',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-familia',
    slug: 'dra-beatriz-albuquerque-rj',
    niche: 'familia',
    lawyer_name: 'Dra. Beatriz Albuquerque',
    oab_number: 'OAB/UF 00.000',
    whatsapp: '5500900000000',
    phone: '(00) 90000-0000',
    email: 'contato@seuescritorio.adv.br',
    instagram: '@seu.escritorio.adv',
    city: 'Sua Cidade',
    state: 'UF',
    address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
    custom_hero_url: '',
    status: 'novo',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-trabalhista',
    slug: 'dr-roberto-silveira-bh',
    niche: 'trabalhista',
    lawyer_name: 'Dr. Roberto Silveira',
    oab_number: 'OAB/UF 00.000',
    whatsapp: '5500900000000',
    phone: '(00) 90000-0000',
    email: 'contato@seuescritorio.adv.br',
    instagram: '@seu.escritorio.adv',
    city: 'Sua Cidade',
    state: 'UF',
    address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
    custom_hero_url: '',
    status: 'novo',
    created_at: new Date().toISOString()
  }
];

export const legalProspectService = {
  /**
   * Retorna todos os advogados cadastrados
   */
  getAll: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROSPECTS));
        return DEFAULT_PROSPECTS;
      }
      const parsed = JSON.parse(stored);
      // Auto-migração: se o cache local tiver dados antigos de demonstração, atualizar com os genéricos
      const hasOldPhones = parsed.some(p => p.whatsapp && (p.whatsapp.startsWith('5579') || p.whatsapp.startsWith('551198450')));
      if (hasOldPhones) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROSPECTS));
        return DEFAULT_PROSPECTS;
      }
      return parsed;
    } catch {
      return DEFAULT_PROSPECTS;
    }
  },

  /**
   * Busca um prospect por slug ou ID
   */
  getBySlug: (slug) => {
    const list = legalProspectService.getAll();
    return list.find((p) => p.slug === slug || p.id === slug) || null;
  },

  /**
   * Salva ou edita um prospect
   */
  save: (prospectData) => {
    const list = legalProspectService.getAll();
    const id = prospectData.id || `prospect-${Date.now()}`;
    
    // Gerar slug amigável caso não tenha
    const slugBase = (prospectData.lawyer_name || 'advogado')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const citySlug = (prospectData.city || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');

    const slug = prospectData.slug || `${slugBase}${citySlug ? `-${citySlug}` : ''}`;

    const newProspect = {
      ...prospectData,
      id,
      slug,
      created_at: prospectData.created_at || new Date().toISOString()
    };

    const existingIndex = list.findIndex((p) => p.id === id);
    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = newProspect;
    } else {
      updatedList = [newProspect, ...list];
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Erro ao salvar prospect no localStorage', e);
    }

    return newProspect;
  },

  /**
   * Exclui um prospect
   */
  delete: (id) => {
    const list = legalProspectService.getAll();
    const updated = list.filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao deletar do localStorage', e);
    }
    return updated;
  },

  /**
   * Gera script de abordagem fria ultra persuasivo para WhatsApp
   */
  generateWhatsAppPitch: (prospect, previewUrl) => {
    const nicheInfo = LEGAL_NICHES[prospect.niche] || LEGAL_NICHES.geral;
    const name = prospect.lawyer_name || 'Doutor(a)';
    const city = prospect.city ? `aqui em ${prospect.city}` : 'em sua região';

    return `Olá, ${name}, tudo bem? Me chamo Rafael Pita.

Encontrei o perfil do seu escritório no Google enquanto pesquisava referências de advocacia ${city}. Notei que vocês têm ótimas avaliações, mas ainda não possuem um site próprio e moderno conectado ao perfil.

Hoje, quando um cliente em potencial pesquisa no Google por ${nicheInfo.name}, mais de 80% das decisões de contratação são tomadas em menos de 2 minutos pelo celular, direto no WhatsApp.

Para demonstrar como o escritório pode dobrar o volume de contatos qualificados sem ferir o Provimento 205/2021 da OAB, eu tomei a liberdade de montar uma demonstração exclusiva com o nome e a estrutura de vocês:

👉 ${previewUrl}

É um modelo ultra-rápido, com visual executivo de luxo e botão direto para o seu WhatsApp.

O que achou da estrutura? Se fizer sentido, podemos colocar no ar com o seu domínio próprio ainda esta semana!`;
  }
};
