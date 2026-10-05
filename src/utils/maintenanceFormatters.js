/**
 * Funcoes utilitarias de formatacao e mascaras para o modulo de Assinaturas e Portal do Cliente
 * Projeto MeuPortfolio v2
 */

/**
 * Formata um valor numerico para o formato de moeda Real brasileiro (R$ 0,00).
 *
 * @param {number|string} value Valor a ser formatado
 * @returns {string} Valor formatado em BRL
 */
export const formatCurrencyBRL = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

/**
 * Formata string de data (YYYY-MM-DD ou ISO) para exibicao no padrao brasileiro DD/MM/AAAA.
 *
 * @param {string|Date} dateVal Data de entrada
 * @returns {string} Data formatada ou texto informativo
 */
export const formatDateBR = (dateVal) => {
    if (!dateVal) return 'Nao informada';
    try {
        if (typeof dateVal === 'string' && dateVal.includes('-')) {
            const parts = dateVal.split('T')[0].split('-');
            if (parts.length === 3) {
                const [year, month, day] = parts;
                return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            }
        }
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString('pt-BR');
    } catch {
        return String(dateVal);
    }
};

/**
 * Aplica mascara dinamica de CPF (11 digitos) ou CNPJ (14 digitos).
 *
 * @param {string} value Documento com ou sem pontuacao
 * @returns {string} Documento com mascara aplicada
 */
export const maskCpfCnpj = (value) => {
    if (!value) return '';
    const clean = String(value).replace(/\D/g, '');

    if (clean.length <= 11) {
        // CPF: 000.000.000-00
        return clean
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    // CNPJ: 00.000.000/0000-00
    return clean
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

/**
 * Aplica mascara de telefone ou WhatsApp no padrao brasileiro.
 * Exemplo: (11) 98765-4321 ou (11) 3456-7890
 *
 * @param {string} value Telefone bruto
 * @returns {string} Telefone com mascara
 */
export const maskPhone = (value) => {
    if (!value) return '';
    const clean = String(value).replace(/\D/g, '').slice(0, 11);

    if (clean.length <= 10) {
        return clean
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    }

    return clean
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

/**
 * Normaliza o numero de telefone para link internacional do WhatsApp (wa.me).
 *
 * @param {string} phone Telefone com DDD
 * @returns {string} Numero com codigo 55 para WhatsApp
 */
export const getCleanWhatsappNumber = (phone) => {
    if (!phone) return '';
    const clean = String(phone).replace(/\D/g, '');
    if (clean.startsWith('55')) return clean;
    return `55${clean}`;
};

/**
 * Retorna classe e rotulo de status para assinaturas.
 *
 * @param {string} status Status da assinatura
 * @returns {{ label: string, badgeClass: string, dotClass: string }}
 */
export const getSubscriptionStatusMeta = (status) => {
    switch (status?.toLowerCase()) {
        case 'ativo':
            return {
                label: 'Ativo',
                badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                dotClass: 'bg-emerald-500 animate-pulse'
            };
        case 'pendente':
            return {
                label: 'Pendente',
                badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                dotClass: 'bg-amber-500'
            };
        case 'atrasado':
            return {
                label: 'Atrasado',
                badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
                dotClass: 'bg-rose-500 animate-bounce'
            };
        case 'pausado':
            return {
                label: 'Pausado',
                badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
                dotClass: 'bg-slate-400'
            };
        case 'cancelado':
            return {
                label: 'Cancelado',
                badgeClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20',
                dotClass: 'bg-zinc-400'
            };
        default:
            return {
                label: status || 'Desconhecido',
                badgeClass: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20',
                dotClass: 'bg-gray-400'
            };
    }
};

/**
 * Retorna classe e rotulo de status para faturas.
 *
 * @param {string} status Status da fatura
 * @returns {{ label: string, badgeClass: string }}
 */
export const getInvoiceStatusMeta = (status) => {
    switch (status?.toLowerCase()) {
        case 'pago':
            return {
                label: 'Pago',
                badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            };
        case 'pendente':
            return {
                label: 'Pendente',
                badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            };
        case 'cancelado':
            return {
                label: 'Cancelado',
                badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
            };
        default:
            return {
                label: status || 'Aberto',
                badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
            };
    }
};

/**
 * Retorna meta de status para chamados de suporte.
 *
 * @param {string} status Status do chamado
 * @returns {{ label: string, badgeClass: string }}
 */
export const getTicketStatusMeta = (status) => {
    switch (status?.toLowerCase()) {
        case 'aberto':
            return {
                label: 'Aberto',
                badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
            };
        case 'em andamento':
        case 'em_andamento':
            return {
                label: 'Em Andamento',
                badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            };
        case 'concluido':
        case 'concluído':
        case 'resolvido':
            return {
                label: 'Concluido',
                badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            };
        default:
            return {
                label: status || 'Aberto',
                badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
            };
    }
};
