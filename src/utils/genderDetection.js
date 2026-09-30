/**
 * @file genderDetection.js
 * @description Utilitário de detecção inteligente de gênero e provedor de paletas executivas
 * Diferencia advogadas (Dra. / Vinho Nobre & Ouro Champagne) e advogados (Dr. / Navy Profundo & Dourado Real).
 */

// Lista abrangente de nomes próprios femininos no Brasil
const FEMALE_NAMES = new Set([
  'roseli', 'rosely', 'natalie', 'natálie', 'paula', 'sandra', 'maria', 'ana',
  'camila', 'juliana', 'beatriz', 'gabriela', 'fernanda', 'patricia', 'patrícia',
  'luciana', 'mariana', 'larissa', 'aline', 'amanda', 'bruna', 'carla',
  'cristiane', 'daniela', 'danielle', 'debora', 'débora', 'eduarda', 'fabiana',
  'flavia', 'flávia', 'giovanna', 'giovana', 'helena', 'isabela', 'isabella',
  'jessica', 'jéssica', 'julia', 'júlia', 'kelly', 'leticia', 'letícia',
  'luana', 'manuela', 'marcela', 'marina', 'melissa', 'monique', 'natalia',
  'natália', 'nicole', 'priscila', 'priscilla', 'rafaela', 'raffaela', 'renata',
  'sabrina', 'simone', 'taina', 'tainá', 'tatiana', 'tatiane', 'thais', 'thaís',
  'vanessa', 'vitoria', 'vitória', 'teresinha', 'tereza', 'cleide', 'silvia',
  'sílvia', 'marcia', 'márcia', 'claudia', 'cláudia', 'regina', 'denise',
  'eliane', 'elza', 'sonia', 'sônia', 'vera', 'marlene', 'marta', 'ines',
  'inês', 'fatima', 'fátima', 'rita', 'lucia', 'lúcia', 'sueli', 'suely',
  'aparecida', 'terezinha', 'solange', 'rosana', 'neuza', 'neusa', 'cleusa',
  'elizabeth', 'elisangela', 'elisângela', 'elisa', 'adriana', 'monica', 'mônica',
  'andrea', 'andréa', 'andreia', 'andréia', 'viviane', 'clara', 'alice', 'laura',
  'sophia', 'sofia', 'lorena', 'livia', 'lívia', 'mariane', 'bianca', 'carolina',
  'caroline', 'valeria', 'valéria', 'elaine', 'cristina', 'marisa', 'glaucia',
  'gisele', 'giselle', 'joana', 'raquel', 'samara', 'tamires', 'poliana', 'daniele'
]);

/**
 * Detecta se o nome ou razão social pertence a uma advogada (female) ou advogado (male)
 * @param {string} rawName 
 * @returns {'female'|'male'}
 */
export function detectLawyerGender(rawName) {
  if (!rawName) return 'male';

  const clean = rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Termos e prefixos explícitos
  if (
    clean.includes('dra.') ||
    clean.includes('dra ') ||
    clean.includes('doutora') ||
    clean.includes('advogada') ||
    clean.includes('sociedade individual de advogada')
  ) {
    return 'female';
  }

  if (
    clean.includes('dr.') ||
    clean.includes('dr ') ||
    clean.includes('doutor') ||
    clean.includes('advogado')
  ) {
    return 'male';
  }

  // 2. Extração do primeiro nome real (removendo títulos profissionais comuns)
  const tokens = clean
    .replace(/^(dra?|doutor[a]?|advogad[oa]|sociedade|escritorio|associados|consultoria)\b/gi, '')
    .trim()
    .split(/[\s\-_\/]+/)
    .filter(Boolean);

  if (tokens.length > 0) {
    const firstName = tokens[0];

    // Busca exata na base de nomes femininos
    if (FEMALE_NAMES.has(firstName)) {
      return 'female';
    }

    // Heurísticas de sufixos clássicos femininos da língua portuguesa
    if (
      firstName.endsWith('a') &&
      !['luca', 'lucas', 'joshua', 'buda', 'sousa', 'souza', 'costa', 'silva', 'lima'].includes(firstName)
    ) {
      return 'female';
    }

    if (
      firstName.endsWith('ele') ||
      firstName.endsWith('elly') ||
      firstName.endsWith('any') ||
      firstName.endsWith('ane')
    ) {
      return 'female';
    }
  }

  return 'male';
}

/**
 * Paletas Executivas de Alta Conversão por Gênero
 */
export const LEGAL_THEMES = {
  // Paleta Feminina: Vinho Nobre Real, Borgonha Profundo & Ouro Champagne
  female: {
    gender: 'female',
    honorific: 'Dra.',
    article: 'a',
    articleCap: 'A',
    roleLabel: 'Advogada Especialista',
    roleTag: 'Advocacia & Assessoria Jurídica',
    welcomeLabel: 'Boutique Jurídica de Excelência',
    headlinePrefix: 'Defesa Estratégica & Atendimento Humanizado',
    
    // Cores Principais
    primaryAccent: '#D8A756',      // Ouro Champagne Nobre
    primaryAccentDark: '#C6923C',  // Ouro Clássico
    wineDeep: '#220619',           // Borgonha Profundo (Fundo Dark)
    wineDarker: '#14030F',         // Vinho Ultra Noturno (Topo/Rodapé)
    wineMiddle: '#2C0920',         // Vinho Acetinado
    wineSoftBg: '#FDF7FA',         // Nuance Suave para Seções Claras
    wineBorderSoft: '#F2DFEB',     // Bordas delicadas com toque vinho
    wineHighlight: '#9A1E58',      // Púrpura Vinho vibrante
    
    // Classes Utilitárias Tailwind
    topBarBgClass: 'bg-[#14030F] border-b border-white/10',
    heroBgClass: 'bg-gradient-to-b from-[#1C0515] via-[#26081D] to-[#12030E]',
    bannerBgClass: 'bg-gradient-to-r from-[#1C0515] via-[#2D0A22] to-[#12030E]',
    footerBgClass: 'bg-[#12020D] text-slate-300',
    cardBorderHover: 'hover:border-[#9A1E58]/40',
    badgeClass: 'bg-[#D8A756]/15 text-[#D8A756] border-[#D8A756]/30',
    sectionSubtleBg: 'bg-[#FAF5F8]',
    logoGradient: 'from-[#E0B266] via-[#D8A756] to-[#B37F2C]'
  },

  // Paleta Masculina: Navy Clássico Imperial, Azul Noite & Ouro Nobre
  male: {
    gender: 'male',
    honorific: 'Dr.',
    article: 'o',
    articleCap: 'O',
    roleLabel: 'Advogado Especialista',
    roleTag: 'Advocacia & Consultoria Estratégica',
    welcomeLabel: 'Bancada Jurídica de Prestígio',
    headlinePrefix: 'Autoridade Jurídica & Rigor Estratégico',
    
    // Cores Principais
    primaryAccent: '#C6923C',      // Dourado Real
    primaryAccentDark: '#B37F2C',  // Dourado Clássico
    wineDeep: '#0A192F',           // Dark Navy Clássico
    wineDarker: '#071326',         // Navy Noturno (Topo)
    wineMiddle: '#0D223F',         // Navy Médio
    wineSoftBg: '#F8FAFC',         // Cinza Gelo Neutro
    wineBorderSoft: '#E2E8F0',     // Bordas neutras
    wineHighlight: '#1E3A8A',      // Azul Royal
    
    // Classes Utilitárias Tailwind
    topBarBgClass: 'bg-[#071326] border-b border-white/10',
    heroBgClass: 'bg-gradient-to-b from-[#071326] via-[#0A192F] to-[#050C18]',
    bannerBgClass: 'bg-gradient-to-r from-[#071326] via-[#0E2547] to-[#050C18]',
    footerBgClass: 'bg-[#06101E] text-slate-300',
    cardBorderHover: 'hover:border-[#C6923C]/40',
    badgeClass: 'bg-[#C6923C]/15 text-[#C6923C] border-[#C6923C]/30',
    sectionSubtleBg: 'bg-[#F8FAFC]',
    logoGradient: 'from-[#D8A756] to-[#C6923C]'
  }
};
