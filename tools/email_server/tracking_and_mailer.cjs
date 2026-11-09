/**
 * Servidor de Rastreamento de E-mails & Despacho SMTP Hostinger
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Funcionalidades:
 * 1. Pixel de Abertura 1x1 transparente (/track/open/:token) com gravação de timestamp, IP e User-Agent.
 * 2. Redirecionamento de Clique com Rastreamento (/track/click/:token?url=...).
 * 3. Endpoint de Métricas e Logs (/api/metrics).
 * 4. API de envio seguro via SMTP Hostinger (porta 465 SSL ou 587 TLS).
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const tls = require('tls');

const PORT = process.env.TRACKING_PORT || 3005;
const LOGS_FILE = path.resolve(__dirname, 'tracking_logs.json');

// GIF 1x1 transparente em base64 (43 bytes padrão da RFC)
const TRANSPARENT_GIF_BUFFER = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
);

// Carrega ou inicializa o arquivo de logs local
function getLogs() {
    try {
        if (fs.existsSync(LOGS_FILE)) {
            return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
        }
    } catch (e) {
        console.error('Erro ao ler logs de tracking:', e);
    }
    return { opens: {}, clicks: {} };
}

function saveLogs(logs) {
    try {
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (e) {
        console.error('Erro ao salvar logs de tracking:', e);
    }
}

/**
 * Envia um e-mail direto via protocolo SMTP com criptografia TLS/SSL
 * Suporta Hostinger (smtp.hostinger.com:465) nativamente sem pacotes externos.
 * @param {object} options - Configurações do e-mail
 * @returns {Promise<boolean>}
 */
function sendSmtpHostinger({
    host = 'smtp.hostinger.com',
    port = 465,
    user,
    pass,
    from,
    to,
    subject,
    html,
    text
}) {
    return new Promise((resolve, reject) => {
        if (!user || !pass || !to) {
            return reject(new Error('Credenciais de SMTP (usuário, senha e destinatário) são obrigatórias.'));
        }

        const socket = tls.connect({
            host: host,
            port: port,
            rejectUnauthorized: false
        }, () => {
            // Conexão TLS estabelecida
        });

        socket.setEncoding('utf-8');

        let step = 0;
        let responseBuffer = '';

        const senderAddress = from || user;

        socket.on('data', (data) => {
            responseBuffer += data;
            const lines = data.split('\r\n').filter(Boolean);
            const lastLine = lines[lines.length - 1] || '';

            // Código de resposta SMTP (ex: 220, 250, 334, 235, 354)
            const code = parseInt(lastLine.substring(0, 3), 10);

            if (code >= 400) {
                socket.end();
                return reject(new Error(`Erro do servidor SMTP Hostinger: ${lastLine}`));
            }

            if (step === 0 && code === 220) {
                // Servidor saudou, envia EHLO
                socket.write(`EHLO localhost\r\n`);
                step++;
            } else if (step === 1 && code === 250) {
                // Inicia autenticação AUTH LOGIN
                socket.write(`AUTH LOGIN\r\n`);
                step++;
            } else if (step === 2 && code === 334) {
                // Envia usuário em base64
                socket.write(`${Buffer.from(user).toString('base64')}\r\n`);
                step++;
            } else if (step === 3 && code === 334) {
                // Envia senha em base64
                socket.write(`${Buffer.from(pass).toString('base64')}\r\n`);
                step++;
            } else if (step === 4 && code === 235) {
                // Autenticado com sucesso! MAIL FROM
                socket.write(`MAIL FROM:<${senderAddress}>\r\n`);
                step++;
            } else if (step === 5 && code === 250) {
                // RCPT TO
                socket.write(`RCPT TO:<${to}>\r\n`);
                step++;
            } else if (step === 6 && code === 250) {
                // DATA
                socket.write(`DATA\r\n`);
                step++;
            } else if (step === 7 && code === 354) {
                // Envia cabeçalhos e corpo MIME
                const boundary = `boundary_${Date.now()}`;
                let message = '';
                message += `From: "Rafael Pita Solutions" <${senderAddress}>\r\n`;
                message += `To: <${to}>\r\n`;
                message += `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=\r\n`;
                message += `MIME-Version: 1.0\r\n`;
                message += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;

                // Parte texto puro
                message += `--${boundary}\r\n`;
                message += `Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
                message += `${text || ''}\r\n\r\n`;

                // Parte HTML
                message += `--${boundary}\r\n`;
                message += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
                message += `${html || ''}\r\n\r\n`;

                message += `--${boundary}--\r\n`;
                message += `.\r\n`;

                socket.write(message);
                step++;
            } else if (step === 8 && code === 250) {
                // Mensagem aceita pelo servidor! QUIT
                socket.write(`QUIT\r\n`);
                socket.end();
                resolve(true);
            }
        });

        socket.on('error', (err) => {
            reject(new Error(`Falha de conexão com SMTP Hostinger: ${err.message}`));
        });

        socket.setTimeout(20000, () => {
            socket.destroy();
            reject(new Error('Tempo limite excedido (timeout) ao comunicar com a Hostinger.'));
        });
    });
}

// Criação do Servidor HTTP
const server = http.createServer((req, res) => {
    // Habilita CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 1. Rota de Rastreamento de Abertura: /track/open/:token
    if (pathname.startsWith('/track/open/')) {
        const token = pathname.replace('/track/open/', '').trim();
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || 'Desconhecido';

        if (token) {
            const logs = getLogs();
            if (!logs.opens[token]) {
                logs.opens[token] = [];
            }
            logs.opens[token].push({
                timestamp: new Date().toISOString(),
                ip: clientIp,
                userAgent: userAgent
            });
            saveLogs(logs);
            console.log(`👁️ E-mail aberto! Token: ${token} | IP: ${clientIp}`);
        }

        // Retorna o GIF 1x1 sem cache
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': TRANSPARENT_GIF_BUFFER.length,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(TRANSPARENT_GIF_BUFFER);
        return;
    }

    // 2. Rota de Rastreamento de Clique: /track/click/:token?url=...
    if (pathname.startsWith('/track/click/')) {
        const token = pathname.replace('/track/click/', '').trim();
        const targetUrl = parsedUrl.query.url;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (token) {
            const logs = getLogs();
            if (!logs.clicks[token]) {
                logs.clicks[token] = [];
            }
            logs.clicks[token].push({
                timestamp: new Date().toISOString(),
                targetUrl: targetUrl,
                ip: clientIp
            });
            saveLogs(logs);
            console.log(`🔗 Link clicado! Token: ${token} | Alvo: ${targetUrl}`);
        }

        // Redireciona 302 imediatamente para a Landing Page de destino
        const destination = targetUrl ? decodeURIComponent(targetUrl) : 'http://localhost:3001/nutricionista';
        res.writeHead(302, { 'Location': destination });
        res.end();
        return;
    }

    // 3. Rota de Métricas e Logs: /api/metrics
    if (pathname === '/api/metrics' && req.method === 'GET') {
        const logs = getLogs();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(logs, null, 2));
        return;
    }

    // 4. Rota de Envio de E-mail: /api/send-email (POST)
    if (pathname === '/api/send-email' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body);
                console.log(`📤 Disparando e-mail para: ${payload.to} | Assunto: ${payload.subject}`);

                await sendSmtpHostinger({
                    host: payload.host || process.env.SMTP_HOST || 'smtp.hostinger.com',
                    port: parseInt(payload.port || process.env.SMTP_PORT || '465', 10),
                    user: payload.user || process.env.SMTP_USER,
                    pass: payload.pass || process.env.SMTP_PASS,
                    from: payload.from || payload.user || process.env.SMTP_USER,
                    to: payload.to,
                    subject: payload.subject,
                    html: payload.html,
                    text: payload.text
                });

                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, message: 'E-mail enviado com sucesso via Hostinger.' }));
            } catch (err) {
                console.error(`❌ Falha no envio SMTP:`, err.message);
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Rota padrão 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint não encontrado.');
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 SERVIDOR DE TRACKING & SMTP HOSTINGER ATIVO`);
    console.log(`📡 Ouvindo em: http://localhost:${PORT}`);
    console.log(`👁️ Pixel de Abertura: http://localhost:${PORT}/track/open/:token`);
    console.log(`🔗 Link de Clique:   http://localhost:${PORT}/track/click/:token?url=...`);
    console.log(`📊 API de Métricas:  http://localhost:${PORT}/api/metrics`);
    console.log(`======================================================\n`);
});
