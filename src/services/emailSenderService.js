/**
 * Serviço de Formatação de E-mails de Prospecção e Disparo com Rastreamento
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gera templates responsivos de alta conversão para nutricionistas e profissionais liberais,
 * com injeção de Pixel 1x1 para rastreamento de abertura e links parametrizados de clique.
 */

export const emailSenderService = {
    /**
     * Gera o token único de rastreamento para o envio
     * @param {string} leadId - ID do lead
     * @returns {string} Token alfanumérico
     */
    generateTrackingToken(leadId) {
        return `trk_${leadId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    },

    /**
     * Monta o HTML responsivo de Cold Mail para Nutricionistas
     * @param {object} params - Dados dinâmicos para interpolação
     * @param {string} params.name - Nome da profissional (ex: "Dra. Roberta Valsechy")
     * @param {string} params.neighborhood - Bairro (ex: "Barra da Tijuca")
     * @param {string} params.city - Cidade (ex: "Rio de Janeiro")
     * @param {number} params.rating - Nota média no Google (ex: 5.0)
     * @param {number} params.reviewsCount - Total de avaliações (ex: 65)
     * @param {string} params.demoUrl - Link da landing page personalizada
     * @param {string} params.trackingToken - Token único do envio
     * @param {string} [params.trackingServerUrl='http://localhost:3005'] - URL do servidor de tracking
     * @returns {{subject: string, html: string, plainText: string}}
     */
    buildNutritionPitchEmail({
        name,
        neighborhood,
        city,
        rating = 5.0,
        reviewsCount = 10,
        demoUrl,
        trackingToken,
        trackingServerUrl = 'http://localhost:3005'
    }) {
        const professionalName = name || 'Doutora';
        const locationName = neighborhood ? `${neighborhood}, ${city}` : city;
        
        // Links com rastreamento
        const openPixelUrl = `${trackingServerUrl}/track/open/${trackingToken}`;
        const trackedDemoUrl = `${trackingServerUrl}/track/click/${trackingToken}?url=${encodeURIComponent(demoUrl)}`;
        const whatsappUrl = `https://wa.me/5521992929983?text=${encodeURIComponent(`Olá, Rafael! Vi o e-mail que me enviou sobre a landing page para ${professionalName} e gostaria de conversar.`)}`;
        const trackedWhatsappUrl = `${trackingServerUrl}/track/click/${trackingToken}?url=${encodeURIComponent(whatsappUrl)}`;

        const subject = `Uma demonstração exclusiva para o seu consultório em ${locationName}`;

        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; line-height: 1.6; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; margin-top: 24px; margin-bottom: 24px; border: 1px solid #E2E8F0; }
        .header { background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); padding: 32px 28px; text-align: left; }
        .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
        .header h1 { margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; line-height: 1.3; }
        .content { padding: 32px 28px; font-size: 15px; color: #334155; }
        .content p { margin: 0 0 16px 0; }
        .highlight-box { background: #F0F9FF; border-left: 4px solid #0284C7; border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 24px 0; }
        .rating-stars { color: #F59E0B; font-weight: 700; font-size: 14px; }
        .cta-container { text-align: center; margin: 32px 0; }
        .cta-button { display: inline-block; background: #0284C7; color: #FFFFFF !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 50px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); }
        .footer { background: #F8FAFC; padding: 24px 28px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center; }
        .footer a { color: #0284C7; text-decoration: none; }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Cabeçalho -->
        <div class="header">
            <span class="badge">Demonstração Interativa de Presença Digital</span>
            <h1>Olá, ${professionalName}!</h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="content">
            <p>Tudo bem? Espero que esteja tendo uma excelente semana!</p>

            <p>Estava realizando um levantamento de nutricionistas de destaque em <strong>${locationName}</strong> e encontrei o perfil do seu consultório no Google.</p>

            <div class="highlight-box">
                <span class="rating-stars">★★★★★ ${rating} no Google (${reviewsCount} avaliações reais)</span>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #475569;">
                    Seus pacientes elogiam muito a qualidade e a empatia do seu atendimento. Porém, notei que você ainda <strong>não possui um site próprio institucional indexado no Google</strong>.
                </p>
            </div>

            <p>Hoje, mais de 80% das pessoas pesquisam no Google antes de agendar uma consulta particular. Sem um site com carregamento rápido e agendamento prático, muitos desses pacientes acabam agendando com concorrentes próximos.</p>

            <p>Como atuo no desenvolvimento de soluções digitais e páginas de alta conversão para a área de saúde, tomei a liberdade de montar uma <strong>demonstração interativa e moderna com o seu nome e endereço</strong> para que você possa ver na prática como seu consultório ficaria posicionado:</p>

            <!-- Botão de Ação -->
            <div class="cta-container">
                <a href="${trackedDemoUrl}" target="_blank" class="cta-button">
                    Visualizar Demonstração do Seu Consultório →
                </a>
            </div>

            <p style="font-size: 13px; color: #64748B;">
                A página já conta com agendamento direto no seu WhatsApp, suporte a teleconsultas e está 100% pronta para indexação no Google.
            </p>

            <p>Se você gostar da proposta, podemos colocar o seu site no ar em até 48 horas por um investimento acessível e sem mensalidades abusivas.</p>

            <p style="margin-top: 24px;">
                Caso prefira bater um papo rápido, estou à disposição também no WhatsApp:
                <br>
                👉 <a href="${trackedWhatsappUrl}" style="color: #0284C7; font-weight: 700;">Conversar com Rafael Pita no WhatsApp (21) 99292-9983</a>
            </p>

            <p style="margin-top: 24px; font-weight: 600;">
                Atenciosamente,<br>
                <span style="color: #0284C7;">Rafael Pita</span><br>
                <span style="font-size: 13px; color: #64748B; font-weight: 400;">Desenvolvimento Web & Soluções Digitais</span>
            </p>
        </div>

        <!-- Rodapé Ético -->
        <div class="footer">
            <p style="margin: 0 0 8px 0;">
                Enviado para ${professionalName} • Respeitamos sua privacidade e não enviamos spam.
            </p>
            <p style="margin: 0;">
                Rafael Pita Solutions — Rio de Janeiro, RJ • <a href="https://rafaelpita.com.br" target="_blank">rafaelpita.com.br</a>
            </p>
        </div>
    </div>

    <!-- Pixel de Rastreamento de Abertura (Invisível 1x1) -->
    <img src="${openPixelUrl}" width="1" height="1" style="display:none !important;" alt="" />
</body>
</html>
        `;

        const plainText = `
Olá, ${professionalName}!

Estava pesquisando nutricionistas de destaque em ${locationName} e notei a excelente reputação do seu consultório no Google (${rating} estrelas com ${reviewsCount} avaliações reais de pacientes), mas vocês ainda não possuem um site próprio indexado.

Tomei a liberdade de montar uma demonstração interativa exclusiva com o seu nome e consultório para você ver como ficaria:
👉 ${trackedDemoUrl}

O projeto já conta com agendamento direto no seu WhatsApp, suporte a teleconsulta e SEO para o Google.

Podemos bater um papo rápido no WhatsApp?
(21) 99292-9983

Atenciosamente,
Rafael Pita
Rafael Pita Solutions
        `.trim();

        return { subject, html, plainText };
    }
};

export default emailSenderService;
