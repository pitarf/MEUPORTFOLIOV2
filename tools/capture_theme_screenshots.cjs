const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const distDir = path.resolve(__dirname, '../dist');
const artifactsDir = 'C:\\Users\\rfpit\\.gemini\\antigravity\\brain\\a69657da-b72e-459c-a160-2de0bd502082';
const publicScreenshotsDir = path.resolve(__dirname, '../public/screenshots');

if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
if (!fs.existsSync(publicScreenshotsDir)) fs.mkdirSync(publicScreenshotsDir, { recursive: true });

// Servidor estático com fallback para index.html (SPA)
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

const PORT = 4173;

server.listen(PORT, async () => {
  console.log(`[INFO] Servidor local executando na porta ${PORT}`);

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });

    const pagesToCapture = [
      { name: 'home', route: '/' },
      { name: 'portfolio', route: '/portfolio' },
      { name: 'servicos', route: '/servicos' },
      { name: 'sobre', route: '/sobre' },
      { name: 'avaliacoes', route: '/avaliacoes' },
      { name: 'contato', route: '/contato' }
    ];

    const themes = ['light', 'dark'];

    for (const theme of themes) {
      console.log(`\n[INFO] Capturando paginas no modo: ${theme.toUpperCase()}...`);
      for (const p of pagesToCapture) {
        const page = await context.newPage();
        
        // Define o tema antes de carregar
        await page.addInitScript((th) => {
          window.localStorage.setItem('theme', th);
        }, theme);

        await page.goto(`http://localhost:${PORT}${p.route}`, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Forca classe light ou dark no HTML para garantia absoluta
        await page.evaluate((th) => {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(th);
        }, theme);

        // Aguarda estabilizacao de animacoes
        await page.waitForTimeout(1000);

        const filename = `screenshot_${p.name}_${theme}.png`;
        const artifactPath = path.join(artifactsDir, filename);
        const publicPath = path.join(publicScreenshotsDir, filename);

        await page.screenshot({ path: artifactPath, fullPage: false });
        fs.copyFileSync(artifactPath, publicPath);

        console.log(`[SUCESSO] Capturado: ${filename}`);
        await page.close();
      }
    }

    await browser.close();
    console.log('\n[CONCLUIDO] Todas as capturas de tela foram salvas com sucesso!');
  } catch (error) {
    console.error('[ERRO] Falha ao capturar telas:', error);
  } finally {
    server.close();
    process.exit(0);
  }
});
