/**
 * @file lawyerNameFormatter.js
 * @description Utilitário inteligente de higienização de nomes de advogados e bancas jurídicas
 * Remove poluições de SEO do Google Maps (pipes, traços, lista de especialidades) e normaliza honoríficos.
 */

/**
 * Higieniza o nome de um advogado ou escritório de advocacia
 * Remove sufixos de SEO comuns no Google Meu Negócio.
 * Exemplo: "Dra Teresinha Ravena de Sousa - Advogada | Divórcios | Inventários | Direito Civil"
 * Retorna: "Dra. Teresinha Ravena de Sousa"
 * 
 * @param {string} rawName - Nome original retornado pelo Google Places ou digitado
 * @returns {string} Nome limpo e executivo
 */
export function cleanLawyerName(rawName) {
  if (!rawName || typeof rawName !== 'string') return '';

  let name = rawName.trim();

  // 1. Divisão por separadores clássicos de palavras-chave do Google Maps
  const separators = [' | ', ' - ', ' – ', ' — ', ' • ', ' / ', ': '];
  for (const sep of separators) {
    if (name.includes(sep)) {
      name = name.split(sep)[0].trim();
    }
  }

  // Caso contenha pipe ou bala sem espaço ao redor
  if (name.includes('|')) {
    name = name.split('|')[0].trim();
  }
  if (name.includes('•')) {
    name = name.split('•')[0].trim();
  }

  // 2. Remove sufixos como "- Advogada", "- Advocacia", ", Advogado" que sobraram no final
  name = name.replace(/\s*[-–—,]\s*(advogada?|advocacia|escritorio|consultoria|direito|juridico|oab).*$/i, '').trim();

  // Se o nome terminar apenas com a palavra solta "Advogada" ou "Advogado" após o nome próprio
  // Ex: "Teresinha Ravena Advogada" -> "Teresinha Ravena" (mas preserva bancas como "Silva Advocacia")
  if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s\.]+\s+(advogada|advogado)$/i.test(name)) {
    name = name.replace(/\s+(advogada|advogado)$/i, '').trim();
  }

  // 3. Normalização de títulos e honoríficos (Dra / Dr para Dra. / Dr.)
  name = name.replace(/\b(dra?)\b(?!\.)/i, (match) => {
    return match.toLowerCase() === 'dra' ? 'Dra.' : 'Dr.';
  });

  // Limpa espaço incorreto entre Dra e ponto (ex: "Dra .")
  name = name.replace(/\b(Dra|Dr)\s+\./gi, '$1.');

  // 4. Limpeza final de pontuação residual
  name = name.replace(/[-–—/\\|:,;.]+$/, '').trim();

  return name;
}

/**
 * Formata o nome para a Navbar e Logotipo
 * Garante que nomes com muitos sobrenomes caibam perfeitamente na barra sem empurrar o menu
 * 
 * @param {string} rawName - Nome original
 * @param {number} maxLength - Limite sugerido de caracteres (padrão: 32)
 * @returns {string} Nome otimizado para o logotipo
 */
export function formatNavbarLawyerName(rawName, maxLength = 32) {
  const cleaned = cleanLawyerName(rawName);
  if (!cleaned) return 'Advocacia & Consultoria';

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Extrai prefixo honorífico (Dr. ou Dra.) se presente
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const hasHonorific = /^(dr\.|dra\.|doutor|doutora)/i.test(parts[0]);
  const prefix = hasHonorific ? parts[0] : '';
  const nameParts = hasHonorific ? parts.slice(1) : parts;

  // Se for pessoa física com mais de 2 sobrenomes, sintetiza: Prefixo + Primeiro Nome + Último Sobrenome
  if (nameParts.length >= 3 && !/advocacia|sociedade|associados|consultoria/i.test(cleaned)) {
    const compact = prefix ? `${prefix} ${nameParts[0]} ${nameParts[nameParts.length - 1]}` : `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    if (compact.length <= maxLength) {
      return compact;
    }
  }

  return cleaned;
}
