/**
 * Utilitarios de Formatacao de Mensagens e Links do WhatsApp
 * Modulo de Comunicacao e Notificacao de Clientes do MeuPortfolio v2
 *
 * Todas as mensagens sao redigidas em PT-BR de forma amigavel, clara e profissional.
 * Regra estrita: NUNCA utilizar caracteres de travessao.
 */

/**
 * Formata um valor numerico para o formato monetario brasileiro (R$ 0,00).
 *
 * @param {number|string} value Valor a ser formatado
 * @returns {string} Valor formatado em Reais
 */
export const formatCurrencyBRL = (value) => {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
};

/**
 * Formata uma data no padrao brasileiro (DD/MM/AAAA).
 * Aceita strings ISO (YYYY-MM-DD), objetos Date ou timestamps.
 *
 * @param {string|Date} dateVal Data de entrada
 * @returns {string} Data formatada
 */
export const formatDateBR = (dateVal) => {
    if (!dateVal) return '';

    if (typeof dateVal === 'string' && dateVal.includes('-')) {
        const parts = dateVal.split('T')[0].split('-');
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
    }

    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);

    return d.toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    });
};

/**
 * Higieniza numero de telefone e garante o formato internacional para WhatsApp.
 * Remove pontuacoes e adiciona o DDI 55 (Brasil) caso necessario.
 *
 * @param {string|number} phone Telefone de entrada
 * @returns {string} Telefone numerico com prefixo DDI 55
 */
export const sanitizeWhatsAppPhone = (phone) => {
    if (!phone) return '';
    const digitsOnly = String(phone).replace(/\D/g, '');

    // Se possui 10 ou 11 digitos (ex: DDD + celular), prefixa com 55
    if (digitsOnly.length === 10 || digitsOnly.length === 11) {
        return `55${digitsOnly}`;
    }

    // Se ja possui 12 ou 13 digitos iniciando com 55, mantem
    if ((digitsOnly.length === 12 || digitsOnly.length === 13) && digitsOnly.startsWith('55')) {
        return digitsOnly;
    }

    return digitsOnly;
};

/**
 * Gera URL oficial de redirecionamento para o WhatsApp (wa.me)
 *
 * @param {string} phone Telefone do destinatario
 * @param {string} message Mensagem pre-formatada
 * @returns {string} Link clicavel para wa.me
 */
export const generateWhatsAppUrl = (phone, message) => {
    const cleanPhone = sanitizeWhatsAppPhone(phone);
    const encodedMessage = encodeURIComponent(message || '');

    if (!cleanPhone) {
        return `https://wa.me/?text=${encodedMessage}`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Formata mensagem amigavel e profissional notificando sobre reajuste ou alteracao de valor de assinatura.
 *
 * @param {Object} params
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.planTitle Titulo do plano de manutencao
 * @param {number|string} params.oldPrice Valor anterior
 * @param {number|string} params.newPrice Novo valor atualizado
 * @param {string|Date} [params.effectiveDate] Data de vigencia da alteracao
 * @param {number|string} [params.billingDay] Dia fixo de faturamento no mes
 * @returns {string} Texto da mensagem formatado para envio no WhatsApp
 */
export const formatWhatsAppPriceChangeMessage = ({
    clientName = 'Cliente',
    planTitle = 'Plano de Manutencao',
    oldPrice = 0,
    newPrice = 0,
    effectiveDate = '',
    billingDay = 10
} = {}) => {
    const formattedOldPrice = formatCurrencyBRL(oldPrice);
    const formattedNewPrice = formatCurrencyBRL(newPrice);
    const formattedDate = effectiveDate ? formatDateBR(effectiveDate) : `dia ${billingDay} do proximo ciclo`;

    return [
        `Ola, ${clientName}! Tudo bem?`,
        '',
        `Passando para compartilhar uma atualizacao sobre a manutencao e sustentacao do seu projeto (${planTitle}).`,
        '',
        'Visando manter a maxima qualidade na nossa infraestrutura, seguranca preventiva e monitoramento contínuo, faremos a atualizacao do valor mensal do plano:',
        '',
        `* Valor anterior: ${formattedOldPrice}`,
        `* Novo valor atualizado: ${formattedNewPrice}`,
        `* Data de vigencia: ${formattedDate}`,
        `* Dia de vencimento: Todo dia ${billingDay}`,
        '',
        'Permanecemos a total disposicao para qualquer esclarecimento ou duvida sobre suas demandas e melhorias.',
        '',
        'Agradecemos imensamente pela confianca e parceria de sempre!',
        'Rafael Pita : Solucoes em Tecnologia e Desenvolvimento'
    ].join('\n');
};

/**
 * Formata mensagem com o lembrete de vencimento da fatura e codigo Pix Copia e Cola.
 *
 * @param {Object} params
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.planTitle Titulo do plano de manutencao
 * @param {number|string} params.amount Valor da fatura
 * @param {string|Date} params.dueDate Data de vencimento
 * @param {string} [params.pixCode] Codigo Pix Copia e Cola
 * @param {string} [params.invoiceCode] Codigo da fatura (ex: FAT-2026-001)
 * @returns {string} Texto da mensagem formatado para envio no WhatsApp
 */
export const formatWhatsAppInvoiceMessage = ({
    clientName = 'Cliente',
    planTitle = 'Plano de Manutencao',
    amount = 0,
    dueDate = '',
    pixCode = '',
    invoiceCode = ''
} = {}) => {
    const formattedAmount = formatCurrencyBRL(amount);
    const formattedDueDate = formatDateBR(dueDate);
    const codeInfo = invoiceCode ? ` (Fatura: ${invoiceCode})` : '';

    const lines = [
        `Ola, ${clientName}!`,
        '',
        `Sua fatura referente ao servico de ${planTitle}${codeInfo} esta disponivel para pagamento.`,
        '',
        `* Valor: ${formattedAmount}`,
        `* Vencimento: ${formattedDueDate}`
    ];

    if (pixCode) {
        lines.push('');
        lines.push('Voce pode efetuar o pagamento diretamente via PIX com compensacao imediata:');
        lines.push('');
        lines.push('*Pix Copia e Cola:*');
        lines.push('```' + pixCode + '```');
        lines.push('');
        lines.push('(Basta copiar o codigo acima e colar na opcao Pix Copia e Cola do aplicativo do seu banco)');
    }

    lines.push('');
    lines.push('Caso ja tenha efetuado o pagamento, por favor desconsidere este aviso.');
    lines.push('');
    lines.push('Muito obrigado pela parceria!');
    lines.push('Rafael Pita : Suporte e Desenvolvimento');

    return lines.join('\n');
};

/**
 * Formata mensagem de confirmacao de abertura de chamado de suporte no portal do cliente.
 *
 * @param {Object} params
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.ticketCode Codigo do ticket (ex: TICK-2026-001)
 * @param {string} params.subject Assunto do chamado
 * @param {string} [params.priority] Prioridade do atendimento
 * @returns {string} Texto formatado para o WhatsApp
 */
export const formatWhatsAppTicketMessage = ({
    clientName = 'Cliente',
    ticketCode = '',
    subject = '',
    priority = 'normal'
} = {}) => {
    return [
        `Ola, ${clientName}!`,
        '',
        `Seu chamado de suporte foi registrado com sucesso em nossa central de atendimento.`,
        '',
        `* Codigo do chamado: ${ticketCode}`,
        `* Assunto: ${subject}`,
        `* Prioridade: ${priority.toUpperCase()}`,
        '',
        'Nossa equipe ja recebeu sua solicitacao e iniciara a analise imediatamente.',
        'Voce pode acompanhar o status diretamente pelo Portal do Cliente.',
        '',
        'Atenciosamente,',
        'Rafael Pita : Suporte Tecnico'
    ].join('\n');
};

/**
 * Gera URL publica do Portal do Assinante com parametro de acesso automatico.
 *
 * @param {string} [identifier] E-mail ou documento para auto-login
 * @returns {string} URL completa do portal
 */
export const generatePortalUrl = (identifier = '') => {
    const origin = typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://rafaelpitaoficial.com.br';

    if (!identifier || !identifier.trim()) {
        return `${origin}/minha-assinatura`;
    }

    return `${origin}/minha-assinatura?lookup=${encodeURIComponent(identifier.trim())}`;
};

/**
 * 1ª Mensagem : Apresentacao do Novo Sistema & Boas-Vindas do Assinante.
 * Explica o funcionamento do portal sem senha, acompanhamento de historico,
 * recibos de pagamentos e suporte prioritario.
 *
 * @param {Object} params
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.planTitle Titulo do plano
 * @param {number|string} params.amount Valor mensal
 * @param {number|string} params.billingDay Dia de vencimento
 * @param {string|Date} [params.dueDate] Proximo vencimento
 * @param {string} [params.pixCode] Pix Copia e Cola da fatura atual
 * @param {string} [params.clientEmail] E-mail do cliente
 * @param {string} [params.portalUrl] Link do portal
 * @returns {string} Mensagem completa de onboarding
 */
export const formatWhatsAppOnboardingMessage = ({
    clientName = 'Cliente',
    planTitle = 'Manutenção Contínua',
    amount = 0,
    billingDay = 10,
    dueDate = '',
    pixCode = '',
    clientEmail = '',
    portalUrl = ''
} = {}) => {
    const formattedAmount = formatCurrencyBRL(amount);
    const formattedDueDate = dueDate ? formatDateBR(dueDate) : `dia ${billingDay}`;
    const directUrl = portalUrl || generatePortalUrl(clientEmail);

    const lines = [
        `Olá, ${clientName}! Tudo bem?`,
        '',
        `Passando para compartilhar uma novidade muito bacana: agora a gestão e sustentação do seu projeto (${planTitle}) está oficialmente integrada ao nosso novo sistema de assinaturas e suporte!`,
        '',
        'Pensando em trazer ainda mais comodidade, agilidade e total transparência para o seu dia a dia, preparamos o seu *Portal do Assinante*:',
        '',
        '✓ *Acesso sem complicação:* você entra a qualquer momento sem precisar memorizar senhas (basta informar seu e-mail ou documento).',
        '✓ *Histórico completo:* consulte todos os pagamentos realizados e emita seus recibos de quitação em PDF quando precisar.',
        '✓ *Faturas & PIX:* visualize suas faturas em aberto e pague com compensação imediata via PIX Copia e Cola ou QR Code.',
        '✓ *Suporte técnico:* abra chamados com protocolo para solicitar ajustes, melhorias ou suporte prioritário.',
        '',
        '*Resumo do seu Contrato:*',
        `• Serviço: ${planTitle}`,
        `• Valor Mensal: ${formattedAmount}`,
        `• Vencimento: Todo dia ${billingDay}`
    ];

    if (dueDate) {
        lines.push(`• Próximo Vencimento: ${formattedDueDate}`);
    }

    if (pixCode) {
        lines.push('');
        lines.push('*Fatura do ciclo atual disponível:*');
        lines.push(`Valor: ${formattedAmount} | Vencimento: ${formattedDueDate}`);
        lines.push('');
        lines.push('*Pix Copia e Cola:*');
        lines.push('```' + pixCode + '```');
    }

    lines.push('');
    lines.push('🔗 *Acesse sua área exclusiva agora pelo link:*');
    lines.push(directUrl);
    lines.push('');
    lines.push('Qualquer dúvida ou caso queira alinhar novas demandas, estou à sua inteira disposição!');
    lines.push('');
    lines.push('Abraços,');
    lines.push('Rafael Pita : Soluções em Tecnologia');

    return lines.join('\n');
};

/**
 * 2ª Mensagem : Lembrete Padrão Mensal de Fatura & Cobrança Recorrente.
 * Enviada a cada mês com os dados da fatura, Pix e atalho para o portal.
 *
 * @param {Object} params
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.planTitle Titulo do plano
 * @param {number|string} params.amount Valor da fatura
 * @param {number|string} params.billingDay Dia do vencimento
 * @param {string|Date} params.dueDate Data de vencimento
 * @param {string} [params.pixCode] Codigo Pix Copia e Cola
 * @param {string} [params.invoiceCode] Codigo da fatura (ex: FAT-2026-001)
 * @param {string} [params.clientEmail] E-mail do cliente
 * @param {string} [params.portalUrl] Link do portal
 * @returns {string} Mensagem de lembrete mensal
 */
export const formatWhatsAppMonthlyReminderMessage = ({
    clientName = 'Cliente',
    planTitle = 'Manutenção Contínua',
    amount = 0,
    billingDay = 10,
    dueDate = '',
    pixCode = '',
    invoiceCode = '',
    clientEmail = '',
    portalUrl = ''
} = {}) => {
    const formattedAmount = formatCurrencyBRL(amount);
    const formattedDueDate = dueDate ? formatDateBR(dueDate) : `dia ${billingDay}`;
    const codeTag = invoiceCode ? ` (${invoiceCode})` : '';
    const directUrl = portalUrl || generatePortalUrl(clientEmail);

    const lines = [
        `Olá, ${clientName}! Tudo bem?`,
        '',
        `Passando para enviar o lembrete da sua fatura mensal referente à sustentação e manutenção (${planTitle})${codeTag}.`,
        '',
        '*Dados da Fatura:*',
        `• Valor: ${formattedAmount}`,
        `• Vencimento: ${formattedDueDate}`
    ];

    if (pixCode) {
        lines.push('');
        lines.push('Para sua praticidade, você pode pagar diretamente via PIX:');
        lines.push('');
        lines.push('*Pix Copia e Cola:*');
        lines.push('```' + pixCode + '```');
        lines.push('');
        lines.push('(Basta copiar o código acima e colar na opção Pix Copia e Cola no app do seu banco)');
    }

    lines.push('');
    lines.push('📄 *Acompanhe suas faturas e histórico de recibos:*');
    lines.push(directUrl);
    lines.push('');
    lines.push('Após a compensação, o recibo de quitação fica disponível automaticamente no portal.');
    lines.push('Se já efetuou o pagamento, por gentileza desconsidere esta mensagem.');
    lines.push('');
    lines.push('Muito obrigado pela parceria!');
    lines.push('Rafael Pita : Suporte e Desenvolvimento');

    return lines.join('\n');
};

