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
    roleTag: 'Boutique Jurídica & Assessoria Estratégica',
    welcomeLabel: 'Boutique Jurídica de Excelência',
    headlinePrefix: 'Defesa Estratégica & Atendimento Humanizado',
    
    // Imagens Temáticas de Alta Resolução para Mulheres
    heroDefaultImg: '/images/legal/advogada_hero.jpg',
    aboutImg: '/images/legal/advogada_sobre.jpg',

    // Tipografia Nobre Editorial
    headingFontClass: 'font-serif font-medium tracking-normal text-[#2C0822]',
    subheadingFontClass: 'font-sans font-light text-stone-600 leading-relaxed',
    badgeTextClass: 'font-sans font-medium text-[11px] uppercase tracking-widest text-[#C89445]',
    
    // Cores Principais
    primaryAccent: '#D8A756',      // Ouro Champagne Nobre
    primaryAccentDark: '#C6923C',  // Ouro Clássico
    wineDeep: '#220619',           // Borgonha Profundo (Fundo Dark)
    wineDarker: '#14030F',         // Vinho Ultra Noturno (Topo/Rodapé)
    wineMiddle: '#2C0920',         // Vinho Acetinado
    wineSoftBg: '#FAF4F7',         // Nuance Suave para Seções Claras
    wineBorderSoft: '#EEDCE7',     // Bordas delicadas com toque vinho
    wineHighlight: '#9A1E58',      // Púrpura Vinho vibrante
    
    // Fundos de Seções Harmonizados (Nude / Champagne Suave)
    sectionBgBase: 'bg-[#FCF9F7]',
    sectionBgAlt: 'bg-[#FAF4F7]',
    cardBgClass: 'bg-white/95 border border-[#EEDCE7] shadow-[0_10px_30px_rgba(44,8,34,0.04)] rounded-2xl sm:rounded-3xl hover:border-[#D8A756]/50 transition-all duration-300',
    
    // Classes Utilitárias Tailwind
    topBarBgClass: 'bg-[#14030F] border-b border-[#D8A756]/20',
    heroBgClass: 'bg-gradient-to-b from-[#1C0515] via-[#26081D] to-[#12030E]',
    bannerBgClass: 'bg-gradient-to-r from-[#1C0515] via-[#2D0A22] to-[#12030E]',
    footerBgClass: 'bg-[#12020D] text-stone-300',
    cardBorderHover: 'hover:border-[#D8A756]/60',
    badgeClass: 'bg-[#D8A756]/15 text-[#C89445] border-[#D8A756]/30',
    sectionSubtleBg: 'bg-[#FAF4F7]',
    logoGradient: 'from-[#F3D79E] via-[#D8A756] to-[#B37F2C]',

    // Ações & Botões Refinados
    ctaPrimaryClass: 'bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold tracking-wide shadow-lg shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35',
    ctaSecondaryClass: 'bg-white/10 hover:bg-white/15 text-white border border-[#D8A756]/40 backdrop-blur-md',
    ctaWhatsappClass: 'bg-gradient-to-r from-[#1F6E43] to-[#144E2E] hover:from-[#1b5f3a] hover:to-[#103e25] text-white font-medium tracking-wide shadow-md shadow-emerald-900/20',
    methodologyCircleClass: 'bg-gradient-to-br from-[#2D0A22] to-[#1A0314] text-[#D8A756] border-2 border-[#D8A756]/40 shadow-lg shadow-[#2D0A22]/20'
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
    
    // Imagens Temáticas Masculinas
    heroDefaultImg: '/images/legal/hero_desk.jpg',
    aboutImg: '/images/legal/reuniao.jpg',

    // Tipografia
    headingFontClass: 'font-sans font-extrabold tracking-tight text-[#0A192F]',
    subheadingFontClass: 'font-sans font-normal text-slate-600 leading-relaxed',
    badgeTextClass: 'font-sans font-bold text-xs uppercase tracking-widest text-[#C6923C]',

    // Cores Principais
    primaryAccent: '#C6923C',      // Dourado Real
    primaryAccentDark: '#B37F2C',  // Dourado Clássico
    wineDeep: '#0A192F',           // Dark Navy Clássico
    wineDarker: '#071326',         // Navy Noturno (Topo)
    wineMiddle: '#0D223F',         // Navy Médio
    wineSoftBg: '#F8FAFC',         // Cinza Gelo Neutro
    wineBorderSoft: '#E2E8F0',     // Bordas neutras
    wineHighlight: '#1E3A8A',      // Azul Royal
    
    // Fundos de Seções
    sectionBgBase: 'bg-white',
    sectionBgAlt: 'bg-[#FAFBFD]',
    cardBgClass: 'bg-white border border-slate-200/80 shadow-md rounded-2xl hover:border-amber-400/80 transition-all duration-300',

    // Classes Utilitárias Tailwind
    topBarBgClass: 'bg-[#071326] border-b border-white/10',
    heroBgClass: 'bg-gradient-to-b from-[#071326] via-[#0A192F] to-[#050C18]',
    bannerBgClass: 'bg-gradient-to-r from-[#071326] via-[#0E2547] to-[#050C18]',
    footerBgClass: 'bg-[#06101E] text-slate-300',
    cardBorderHover: 'hover:border-[#C6923C]/40',
    badgeClass: 'bg-[#C6923C]/15 text-[#C6923C] border-[#C6923C]/30',
    sectionSubtleBg: 'bg-[#F8FAFC]',
    logoGradient: 'from-[#D8A756] to-[#C6923C]',

    // Ações & Botões
    ctaPrimaryClass: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-extrabold shadow-lg',
    ctaSecondaryClass: 'bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md',
    ctaWhatsappClass: 'bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold',
    methodologyCircleClass: 'bg-[#0A192F] text-amber-300 border border-amber-400/30'
  }
};
