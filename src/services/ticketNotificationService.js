/**
 * @file ticketNotificationService.js
 * @description Servico de notificacao por e-mail para atualizacoes de chamados tecnicos.
 * Comunica-se com a Serverless Function /api/ticket-notification para despachar avisos oficiais aos clientes.
 * Totalmente desacoplado e resiliente: falhas de envio nao interrompem operacoes locais no banco de dados.
 */

/**
 * Notifica o cliente por e-mail sobre uma nova atualizacao ou mudanca no seu chamado.
 *
 * @param {Object} params Parametros da notificacao
 * @param {Object} params.ticket Objeto do chamado (support_tickets)
 * @param {string} [params.note] Mensagem da nota ou descricao da atualizacao
 * @param {string} [params.attachmentUrl] URL do print anexado (opcional)
 * @param {string} [params.status] Novo status do chamado (opcional)
 * @param {string} [params.priority] Prioridade do chamado (opcional)
 * @returns {Promise<{success: boolean, simulated?: boolean, message: string, reason?: string}>} Resultado do despacho
 */
export const notifyClientTicketUpdate = async ({
    ticket,
    note = '',
    attachmentUrl = null,
    status = null,
    priority = null
}) => {
    if (!ticket) {
        return {
            success: false,
            reason: 'dados_invalidos',
            message: 'Dados do chamado não fornecidos.'
        };
    }

    const clientEmail = (ticket.client_email || ticket.email || '').trim();
    if (!clientEmail || !clientEmail.includes('@')) {
        console.warn(`[ticketNotificationService] Chamado #${ticket.ticket_code} não possui e-mail de cliente válido cadastrado.`);
        return {
            success: false,
            reason: 'sem_email',
            message: 'O chamado não possui endereço de e-mail de cliente cadastrado para notificação.'
        };
    }

    const payload = {
        ticketCode: ticket.ticket_code,
        clientName: ticket.client_name || ticket.name || 'Cliente',
        clientEmail: clientEmail,
        subject: ticket.subject || 'Suporte Técnico',
        note: note || 'Uma nova atualização foi registrada em seu chamado de suporte.',
        attachmentUrl: attachmentUrl || null,
        status: status || ticket.status || 'aberto',
        priority: priority || ticket.priority || 'normal'
    };

    try {
        const response = await fetch('/api/ticket-notification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.warn('[ticketNotificationService] Servidor retornou status de aviso/erro:', response.status, result);
            return {
                success: false,
                status: response.status,
                message: result.message || 'Servidor temporariamente indisponível para despacho de e-mails.',
                details: result
            };
        }

        return {
            success: true,
            simulated: Boolean(result.simulated),
            message: result.message || 'E-mail de notificação enviado com sucesso para o cliente.',
            data: result.data || result.preview
        };
    } catch (networkError) {
        console.error('[ticketNotificationService] Erro de rede ao comunicar com /api/ticket-notification:', networkError);
        return {
            success: false,
            reason: 'network_error',
            message: 'Não foi possível conectar ao serviço de envio de e-mails no momento.'
        };
    }
};

/**
 * Verifica se um chamado possui e-mail cadastrado disponivel para envio de notificacoes.
 *
 * @param {Object} ticket Objeto do chamado
 * @returns {boolean} Verdadeiro se houver e-mail valido
 */
export const canNotifyTicketClient = (ticket) => {
    if (!ticket) return false;
    const email = ticket.client_email || ticket.email;
    return typeof email === 'string' && email.trim().includes('@');
};
