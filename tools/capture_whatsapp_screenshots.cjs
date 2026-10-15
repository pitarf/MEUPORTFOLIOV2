const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const distDir = path.resolve(__dirname, '../dist');
const artifactsDir = 'C:\\Users\\rfpit\\.gemini\\antigravity\\brain\\a69657da-b72e-459c-a160-2de0bd502082';
const publicScreenshotsDir = path.resolve(__dirname, '../public/screenshots');

if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
if (!fs.existsSync(publicScreenshotsDir)) fs.mkdirSync(publicScreenshotsDir, { recursive: true });

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + reqPath);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 4175;

server.listen(PORT, async () => {
  console.log(`[INFO] Servidor de validacao executando na porta ${PORT}`);

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    // 1. Validar Site Principal: Pagina de Contato com Floating WhatsApp e Cards
    console.log('[INFO] Navegando para /contato...');
    await page.goto(`http://localhost:${PORT}/contato`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const shotContact = path.join(artifactsDir, 'screenshot_whatsapp_site_contact.png');
    await page.screenshot({ path: shotContact });
    console.log(`[SUCESSO] Screenshot contato salvo em: ${shotContact}`);

    // 2. Validar Landing Page Juridica: Navbar, Hero e Floating WhatsApp
    console.log('[INFO] Navegando para /modelo-advocacia/geral...');
    await page.goto(`http://localhost:${PORT}/modelo-advocacia/geral`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const shotLegalHero = path.join(artifactsDir, 'screenshot_whatsapp_legal_hero.png');
    await page.screenshot({ path: shotLegalHero });
    console.log(`[SUCESSO] Screenshot legal hero salvo em: ${shotLegalHero}`);

    // 3. Validar Landing Page Juridica: Stacking Cards com os botoes de WhatsApp
    const section = await page.$('#atuacao');
    if (section) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const shotLegalStack = path.join(artifactsDir, 'screenshot_whatsapp_legal_cards.png');
      await page.screenshot({ path: shotLegalStack });
      console.log(`[SUCESSO] Screenshot legal cards salvo em: ${shotLegalStack}`);
    }

    await browser.close();
  } catch (err) {
    console.error('[ERRO]', err);
  } finally {
    server.close(() => {
      console.log('[INFO] Servidor de validacao finalizado.');
      process.exit(0);
    });
  }
});
