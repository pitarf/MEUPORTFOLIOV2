/**
 * @file ticket-notification.js
 * @description Serverless Function (Vercel) para envio de notificacoes por e-mail sobre atualizacoes em chamados tecnicos.
 * Envia um e-mail com layout corporativo responsivo de alto padrao sempre que o suporte adiciona uma nova nota, print ou altera o status do chamado.
 * Protege chaves de API no backend e possui modo de simulacao resiliente para desenvolvimento.
 */

/**
 * Mapeamento de cores e rotulos para status do chamado
 */
const STATUS_CONFIG = {
    'aberto': { label: 'Aberto', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    'em andamento': { label: 'Em Andamento', color: '#eab308', bg: '#fefce8', border: '#fef08a' },
    'concluído': { label: 'Concluído', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
    'cancelado': { label: 'Cancelado', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
};

/**
 * Mapeamento de rotulos para prioridade do chamado
 */
const PRIORITY_CONFIG = {
    'baixa': { label: 'Baixa', color: '#64748b' },
    'normal': { label: 'Normal', color: '#3b82f6' },
    'alta': { label: 'Alta', color: '#f59e0b' },
    'urgente': { label: 'Urgente', color: '#ef4444' }
};

/**
 * Formata data no Horario de Brasilia (America/Sao_Paulo)
 *
 * @param {string|Date} dateVal Data a ser formatada
 * @returns {string} Data e hora formatadas em PT-BR
 */
function formatBrasiliaDateTime(dateVal) {
    try {
        const d = dateVal ? new Date(dateVal) : new Date();
        const dateStr = d.toLocaleDateString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = d.toLocaleTimeString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${dateStr} às ${timeStr} (Horário de Brasília)`;
    } catch {
        return new Date().toLocaleString('pt-BR');
    }
}

/**
 * Gera o template HTML corporativo premium para o e-mail de atualizacao do chamado.
 * Compativel com Gmail, Outlook, Apple Mail e clientes mobile.
 *
 * @param {Object} data Dados do chamado e da nota
 * @returns {string} HTML completo do e-mail
 */
function buildTicketEmailHtml(data) {
    const {
        ticketCode,
        clientName,
        subject,
        note,
        attachmentUrl,
        status = 'aberto',
        priority = 'normal',
        trackingUrl,
        formattedDate
    } = data;

    const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG['aberto'];
    const priorityInfo = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['normal'];
    const cleanClientName = clientName || 'Cliente';
    const safeNote = (note || 'Atualização registrada pela equipe de suporte.').replace(/\n/g, '<br />');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atualização do Chamado #${ticketCode}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #18181b;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
    .header-bar {
      background-color: #0a0a08;
      padding: 28px 32px;
      text-align: left;
      border-bottom: 2px solid #23231f;
    }
    .brand-logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      text-decoration: none;
      display: inline-block;
    }
    .brand-dot {
      color: #bcf13b;
    }
    .brand-tagline {
      display: inline-block;
      margin-left: 12px;
      padding-left: 12px;
      border-left: 1px solid #33332d;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #9da3af;
      vertical-align: middle;
    }
    .content-body {
      padding: 36px 32px;
    }
    .ticket-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #f4f4f5;
      color: #3f3f46;
      border-radius: 9999px;
      font-size: 12px;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      border: 1px solid #e4e4e7;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: ${statusInfo.bg};
      color: ${statusInfo.color};
      border: 1px solid ${statusInfo.border};
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: capitalize;
    }
    .priority-badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: #f4f4f5;
      color: ${priorityInfo.color};
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .email-title {
      font-size: 22px;
      font-weight: 700;
      color: #09090b;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }
    .greeting {
      font-size: 15px;
      color: #3f3f46;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .info-grid {
      background-color: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    .info-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #71717a;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #18181b;
    }
    .note-box {
      background-color: #fcfcfc;
      border-left: 4px solid #bcf13b;
      border-top: 1px solid #e4e4e7;
      border-right: 1px solid #e4e4e7;
      border-bottom: 1px solid #e4e4e7;
      border-radius: 0 10px 10px 0;
      padding: 20px;
      margin-bottom: 24px;
    }
    .note-box-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #27272a;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .note-content {
      font-size: 15px;
      line-height: 1.6;
      color: #27272a;
      margin: 0;
    }
    .attachment-card {
      background-color: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 28px;
      text-align: center;
    }
    .attachment-img {
      max-width: 100%;
      max-height: 260px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 10px;
      object-fit: cover;
    }
    .btn-cta {
      display: inline-block;
      background-color: #0a0a08;
      color: #bcf13b !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .btn-cta:hover {
      background-color: #1a1a16;
    }
    .footer-bar {
      background-color: #fafafa;
      padding: 28px 32px;
      border-top: 1px solid #e4e4e7;
      text-align: center;
      font-size: 12px;
      color: #71717a;
      line-height: 1.6;
    }
    .footer-link {
      color: #0a0a08;
      text-decoration: underline;
      font-weight: 600;
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <div class="email-container">
          <!-- Top Header -->
          <div class="header-bar">
            <span class="brand-logo">rp<span class="brand-dot">.</span></span>
            <span class="brand-tagline">Soluções Digitais & Tecnologia</span>
          </div>

          <!-- Main Content -->
          <div class="content-body">
            <div style="margin-bottom: 12px;">
              <span class="ticket-badge">CHAMADO #${ticketCode}</span>
              <span class="status-badge" style="margin-left: 8px;">${statusInfo.label}</span>
            </div>

            <h1 class="email-title">Nova atualização em seu chamado</h1>

            <p class="greeting">
              Olá, <strong>${cleanClientName}</strong>. Nossa equipe técnica adicionou uma nova atualização ao seu chamado de suporte. Confira os detalhes abaixo:
            </p>

            <!-- Info Summary Box -->
            <table role="presentation" width="100%" class="info-grid">
              <tr>
                <td style="padding-bottom: 10px;">
                  <div class="info-label">Assunto do Chamado</div>
                  <div class="info-value">${subject}</div>
                </td>
              </tr>
              <tr>
                <td style="padding-top: 8px; border-top: 1px solid #ebebeb;">
                  <table role="presentation" width="100%">
                    <tr>
                      <td width="50%">
                        <div class="info-label">Prioridade</div>
                        <span class="priority-badge">${priorityInfo.label}</span>
                      </td>
                      <td width="50%" align="right">
                        <div class="info-label">Data da Atualização</div>
                        <div class="info-value" style="font-size: 12px; font-weight: normal; color: #52525b;">${formattedDate}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Note Box -->
            <div class="note-box">
              <div class="note-box-title">
                Mensagem da Equipe Técnica:
              </div>
              <p class="note-content">
                ${safeNote}
              </p>
            </div>

            <!-- Attachment Section (if provided) -->
            ${attachmentUrl ? `
            <div class="attachment-card">
              <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 10px; text-transform: uppercase;">
                Print ou Imagem Anexada
              </div>
              <a href="${attachmentUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: block;">
                <img src="${attachmentUrl}" alt="Print do chamado" class="attachment-img" />
                <div style="font-size: 12px; font-weight: 600; color: #2563eb;">Clique para abrir a imagem em tamanho original &rarr;</div>
              </a>
            </div>
            ` : ''}

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 16px 0;">
              <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="btn-cta">
                Acompanhar Chamado em Tempo Real &rarr;
              </a>
            </div>

            <p style="font-size: 12px; color: #71717a; text-align: center; margin-top: 12px;">
              Link direto: <a href="${trackingUrl}" style="color: #0284c7; word-break: break-all;">${trackingUrl}</a>
            </p>
          </div>

          <!-- Footer -->
          <div class="footer-bar">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #3f3f46;">
              Rafael Pita Solutions: Desenvolvimento de Software, Inteligência e Infraestrutura
            </p>
            <p style="margin: 0 0 12px 0;">
              Precisa de ajuda urgente? Fale diretamente via WhatsApp: 
              <a href="https://wa.me/5521975945264?text=${encodeURIComponent(`Olá Rafael, gostaria de tirar dúvidas sobre o chamado #${ticketCode}`)}" class="footer-link">(21) 97594-5264</a>
            </p>
            <p style="margin: 0; font-size: 11px; color: #a1a1aa;">
              Você está recebendo este e-mail porque abriu ou possui uma solicitação de suporte técnico vinculada ao seu endereço.
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Handler principal da Serverless Function Vercel
 */
export default async function handler(req, res) {
    // Configura headers CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método não permitido. Utilize POST para envio de notificações.'
        });
    }

    try {
        const body = req.body || {};
        const {
            ticketCode,
            clientName,
            clientEmail,
            subject,
            note,
            attachmentUrl,
            status = 'aberto',
            priority = 'normal'
        } = body;

        // Validacoes obrigatorias
        if (!clientEmail || !clientEmail.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'E-mail do cliente inválido ou não fornecido para notificação.'
            });
        }

        if (!ticketCode) {
            return res.status(400).json({
                success: false,
                message: 'Código do chamado (ticketCode) é obrigatório.'
            });
        }

        const safeSubject = subject || 'Suporte Técnico';
        const formattedDate = formatBrasiliaDateTime(new Date());
        const trackingUrl = `https://rafaelpitaoficial.com.br/track-ticket/${encodeURIComponent(ticketCode)}`;

        // Monta o template HTML de alto padrao
        const emailHtml = buildTicketEmailHtml({
            ticketCode,
            clientName,
            subject: safeSubject,
            note,
            attachmentUrl,
            status,
            priority,
            trackingUrl,
            formattedDate
        });

        const emailSubject = `[Chamado #${ticketCode}] Atualização: ${safeSubject}`;
        const resendApiKey = process.env.RESEND_API_KEY;

        // Caso a chave Resend esteja configurada no ambiente
        if (resendApiKey) {
            const senderEmail = process.env.EMAIL_FROM || 'Rafael Pita Solutions <suporte@rafaelpitaoficial.com.br>';

            const resendPayload = {
                from: senderEmail,
                to: [clientEmail.trim().toLowerCase()],
                subject: emailSubject,
                html: emailHtml
            };

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resendPayload)
            });

            const resendResult = await response.json();

            if (!response.ok) {
                console.error('Falha na resposta do Resend:', resendResult);
                
                // Se o dominio nao estiver verificado no Resend (erro comum em testes 403), tenta enviar com o remetente de teste padrao
                if (response.status === 403 && resendResult.message?.includes('domain')) {
                    console.log('Tentando fallback com remetente de teste onboarding@resend.dev...');
                    const fallbackResponse = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...resendPayload,
                            from: 'onboarding@resend.dev'
                        })
                    });
                    const fallbackResult = await fallbackResponse.json();
                    if (fallbackResponse.ok) {
                        return res.status(200).json({
                            success: true,
                            message: 'Notificação enviada com sucesso ao cliente (modo sandbox Resend).',
                            data: fallbackResult
                        });
                    }
                }

                return res.status(502).json({
                    success: false,
                    message: resendResult.message || 'Falha ao despachar e-mail via gateway Resend.',
                    details: resendResult
                });
            }

            return res.status(200).json({
                success: true,
                message: 'E-mail de notificação enviado com sucesso para o cliente.',
                data: resendResult
            });
        }

        // Modo de simulacao e fallback gracioso (quando RESEND_API_KEY ainda nao foi adicionada nas variaveis de ambiente da Vercel)
        console.log(`[SIMULACAO NOTIFICACAO] E-mail para ${clientEmail} sobre chamado #${ticketCode}: ${emailSubject}`);
        
        return res.status(200).json({
            success: true,
            simulated: true,
            message: 'Notificação processada com sucesso (modo simulação). Configure RESEND_API_KEY no painel da Vercel para envio em produção.',
            preview: {
                to: clientEmail,
                subject: emailSubject,
                ticketCode,
                trackingUrl
            }
        });
    } catch (error) {
        console.error('Erro interno na Serverless Function ticket-notification:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno ao processar a notificação por e-mail.',
            error: error.message
        });
    }
}
