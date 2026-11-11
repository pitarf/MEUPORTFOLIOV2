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
        const whatsappUrl = `https://wa.me/5521966149077?text=${encodeURIComponent(`Olá, Rafael! Vi o e-mail que me enviou sobre a landing page para ${professionalName} e gostaria de conversar.`)}`;
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
                👉 <a href="${trackedWhatsappUrl}" style="color: #0284C7; font-weight: 700;">Conversar com Rafael Pita no WhatsApp (21) 96614-9077</a>
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
                Rafael Pita Solutions — Rio de Janeiro, RJ • <a href="https://rafaelpitaoficial.com.br" target="_blank">rafaelpitaoficial.com.br</a>
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
(21) 96614-9077

Atenciosamente,
Rafael Pita
Rafael Pita Solutions
        `.trim();

        return { subject, html, plainText };
    },

    /**
     * Monta o HTML executivo de Prospecção para Advogados e Sociedades de Advocacia
     * 100% alinhado ao Código de Ética e Provimento 205/2021 do CFOAB (sem mercantilização, foco em autoridade e presença).
     * 
     * @param {object} params
     * @param {string} params.lawyerName - Nome do advogado ou escritório (ex: "Dr. Marcelo Tavares")
     * @param {string} params.city - Cidade (ex: "Niterói")
     * @param {string} params.state - Estado (ex: "RJ")
     * @param {number} [params.rating=5.0] - Nota no Google
     * @param {number} [params.reviewsCount=48] - Total de avaliações no Google
     * @param {string} params.demoUrl - Link da landing page personalizada
     * @param {string} params.trackingToken - Token único do envio
     * @param {string} [params.trackingServerUrl='http://localhost:3005'] - URL do servidor de tracking
     * @returns {{subject: string, html: string, plainText: string}}
     */
    buildLegalPitchEmail({
        lawyerName,
        city,
        state,
        rating = 5.0,
        reviewsCount = 48,
        demoUrl,
        trackingToken,
        trackingServerUrl = 'http://localhost:3005'
    }) {
        const name = lawyerName || 'Doutor(a)';
        const locationName = city ? (state ? `${city} - ${state}` : city) : 'sua região';

        // Links com rastreamento
        const openPixelUrl = `${trackingServerUrl}/track/open/${trackingToken}`;
        const trackedDemoUrl = `${trackingServerUrl}/track/click/${trackingToken}?url=${encodeURIComponent(demoUrl)}`;
        const whatsappUrl = `https://wa.me/5521966149077?text=${encodeURIComponent(`Olá, Rafael! Recebi sua mensagem com a demonstração da landing page jurídica para ${name} e gostaria de avaliar.`)}`;
        const trackedWhatsappUrl = `${trackingServerUrl}/track/click/${trackingToken}?url=${encodeURIComponent(whatsappUrl)}`;

        const subject = `Demonstração institucional para ${name} (${locationName})`;

        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #0B132B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; line-height: 1.6; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; margin-top: 24px; margin-bottom: 24px; border: 1px solid #CBD5E1; }
        .header { background: linear-gradient(135deg, #071326 0%, #0A192F 100%); padding: 36px 30px; text-align: left; border-bottom: 3px solid #C6923C; }
        .badge { display: inline-block; background: rgba(198, 146, 60, 0.2); color: #F3D79E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px; border: 1px solid rgba(198, 146, 60, 0.35); }
        .header h1 { margin: 0; color: #FFFFFF; font-size: 21px; font-weight: 800; line-height: 1.35; letter-spacing: -0.02em; }
        .content { padding: 32px 30px; font-size: 15px; color: #334155; }
        .content p { margin: 0 0 16px 0; }
        .highlight-box { background: #FAFBFD; border-left: 4px solid #C6923C; border-radius: 0 12px 12px 0; padding: 18px 20px; margin: 24px 0; border-top: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; }
        .rating-stars { color: #C6923C; font-weight: 700; font-size: 14px; }
        .cta-container { text-align: center; margin: 34px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #C6923C 0%, #B37F2C 100%); color: #071326 !important; font-size: 15px; font-weight: 800; text-decoration: none; padding: 15px 34px; border-radius: 50px; box-shadow: 0 6px 16px rgba(198, 146, 60, 0.35); letter-spacing: 0.3px; }
        .footer { background: #F8FAFC; padding: 24px 30px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center; }
        .footer a { color: #0A192F; font-weight: 600; text-decoration: none; }
        .legal-seal { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #64748B; background: #F1F5F9; padding: 6px 12px; border-radius: 6px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Cabeçalho Executivo -->
        <div class="header">
            <span class="badge">Presença Digital & Posicionamento OAB</span>
            <h1>Prezado(a) ${name},</h1>
        </div>

        <!-- Conteúdo Principal -->
        <div class="content">
            <p>Espero que este contato o(a) encontre em um excelente momento profissional.</p>

            <p>Ao realizar um estudo de escritórios de destaque e atuação jurídica em <strong>${locationName}</strong>, identifiquei o perfil do seu escritório no Google com excelente reputação.</p>

            <div class="highlight-box">
                <span class="rating-stars">★★★★★ ${rating} de avaliação no Google</span>
                <p style="margin: 6px 0 0 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
                    Sua banca possui um histórico exemplar reconhecido por clientes. No entanto, notei que o escritório ainda <strong>não possui uma página institucional própria indexada nas buscas</strong> para atendimento direto.
                </p>
            </div>

            <p>Diariamente, pessoas e empresários pesquisam por especialistas jurídicos em sua região. Sem um canal oficial moderno, muitos desses contatos qualificados acabam recorrendo a outras bancas.</p>

            <p>Para ilustrar como o seu escritório pode consolidar essa autoridade com rigor ético, preparei uma <strong>demonstração interativa e executiva</strong> já personalizada com a sua localização e dados públicos:</p>

            <!-- Botão de Ação -->
            <div class="cta-container">
                <a href="${trackedDemoUrl}" target="_blank" class="cta-button">
                    Acessar Demonstração do Escritório →
                </a>
            </div>

            <p style="font-size: 13px; color: #64748B; line-height: 1.5;">
                • Estrutura 100% responsiva (celular e computador).<br>
                • Conexão direta com o WhatsApp de triagem do escritório.<br>
                • Em conformidade rigorosa com o Provimento 205/2021 do CFOAB.
            </p>

            <p>Podemos colocar o seu portal institucional no ar em até 48 horas, com investimento único promocional de <strong>R$ 297,00</strong> (sem mensalidades obrigatórias de manutenção).</p>

            <p style="margin-top: 24px;">
                Caso prefira conversar diretamente ou tirar dúvidas, estou à disposição também no WhatsApp:
                <br>
                👉 <a href="${trackedWhatsappUrl}" style="color: #0A192F; font-weight: 700; text-decoration: underline;">Conversar com Rafael Pita no WhatsApp (21) 96614-9077</a>
            </p>

            <p style="margin-top: 24px; font-weight: 600;">
                Atenciosamente,<br>
                <span style="color: #0A192F;">Rafael Pita</span><br>
                <span style="font-size: 13px; color: #64748B; font-weight: 400;">Desenvolvimento Web & Soluções Digitais</span>
            </p>
        </div>

        <!-- Rodapé Ético -->
        <div class="footer">
            <p style="margin: 0 0 8px 0;">
                Mensagem enviada com caráter profissional para ${name}. Respeitamos sua privacidade.
            </p>
            <p style="margin: 0;">
                Rafael Pita Solutions — Rio de Janeiro, RJ • <a href="https://rafaelpitaoficial.com.br" target="_blank">rafaelpitaoficial.com.br</a>
            </p>
        </div>
    </div>

    <!-- Pixel de Rastreamento de Abertura (Invisível 1x1) -->
    <img src="${openPixelUrl}" width="1" height="1" style="display:none !important;" alt="" />
</body>
</html>
        `;

        const plainText = `
Prezado(a) ${name},

Espero que este contato o(a) encontre bem.

Ao pesquisar bancas de advocacia de destaque em ${locationName}, notei a excelente reputação do seu escritório no Google (${rating} estrelas), porém vocês ainda não contam com uma página institucional própria indexada para captação de clientes.

Tomei a liberdade de preparar uma demonstração interativa e executiva personalizada com o seu nome e dados:
👉 ${trackedDemoUrl}

O projeto é 100% responsivo, respeita rigorosamente o Provimento 205/2021 da OAB e direciona contatos diretamente para o seu WhatsApp.

Caso queira avaliar ou colocar no ar por apenas R$ 297, podemos conversar pelo WhatsApp:
(21) 96614-9077

Atenciosamente,
Rafael Pita
Rafael Pita Solutions
rafaelpitaoficial.com.br
        `.trim();

        return { subject, html, plainText };
    }
};

export default emailSenderService;
