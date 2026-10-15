/**
 * @file greetingUtils.js
 * @description Utilitário de saudações temporais sincronizadas com o Horário Oficial de Brasília
 * e formatação de pronomes/honoríficos jurídicos humanizados.
 */

import { cleanLawyerName } from './lawyerNameFormatter';
import { detectLawyerGender } from './genderDetection';

/**
 * Retorna a saudação formal ('bom dia', 'boa tarde' ou 'boa noite')
 * calculada estritamente com base no Horário Oficial de Brasília (fuso America/Sao_Paulo).
 *
 * Faixas de horário brasileiras:
 * - 05:00 às 11:59: 'bom dia'
 * - 12:00 às 17:59: 'boa tarde'
 * - 18:00 às 04:59: 'boa noite'
 *
 * @returns {'bom dia' | 'boa tarde' | 'boa noite'}
 */
export function getGreetingByBrasiliaTime() {
    try {
        const brasiliaHourStr = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour: 'numeric',
            hour12: false
        }).format(new Date());

        const hour = parseInt(brasiliaHourStr, 10);

        if (hour >= 5 && hour < 12) {
            return 'bom dia';
        } else if (hour >= 12 && hour < 18) {
            return 'boa tarde';
        } else {
            return 'boa noite';
        }
    } catch (err) {
        // Fallback seguro por cálculo de deslocamento UTC-3
        const utcHours = new Date().getUTCHours();
        const brasiliaHour = (utcHours - 3 + 24) % 24;

        if (brasiliaHour >= 5 && brasiliaHour < 12) return 'bom dia';
        if (brasiliaHour >= 12 && brasiliaHour < 18) return 'boa tarde';
        return 'boa noite';
    }
}

/**
 * Retorna a saudação com a primeira letra em maiúscula ('Bom dia', 'Boa tarde' ou 'Boa noite')
 *
 * @returns {'Bom dia' | 'Boa tarde' | 'Boa noite'}
 */
export function getCapitalizedGreetingByBrasiliaTime() {
    const greeting = getGreetingByBrasiliaTime();
    return greeting.charAt(0).toUpperCase() + greeting.slice(1);
}

/**
 * Formata os honoríficos, pronomes de tratamento e nome de advogados
 * de maneira personalizada e sem construções robóticas como 'o(a) Dr(a).'
 *
 * @param {string} rawName - Nome original do advogado
 * @returns {Object} Dados formatados de tratamento
 */
export function formatLawyerSalutation(rawName) {
    const cleaned = cleanLawyerName(rawName) || 'Doutor(a)';
    const gender = detectLawyerGender(cleaned);
    const isFemale = gender === 'female';

    // Remove prefixo Dr./Dra. pré-existente para reconstrução limpa
    const nameWithoutTitle = cleaned.replace(/^(dra?\.|dra?|doutor(a)?)\s+/i, '').trim();

    const title = isFemale ? 'Dra.' : 'Dr.';
    const fullNameWithTitle = `${title} ${nameWithoutTitle}`.trim();
    const article = isFemale ? 'a' : 'o';
    const preposition = isFemale ? 'da' : 'do';

    return {
        gender,
        isFemale,
        title,
        cleanName: cleaned,
        nameWithoutTitle,
        fullNameWithTitle,
        directContactPhrase: `com ${article} ${fullNameWithTitle}`,
        officeOfPhrase: `${preposition} ${fullNameWithTitle}`,
        salutationCall: `${title} ${nameWithoutTitle}`
    };
}
