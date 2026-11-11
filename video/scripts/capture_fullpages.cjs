const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../public/bg-scroll');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const targets = [
  { name: 'full_burger', url: 'http://127.0.0.1:3001/burger/degusta-burger' },
  { name: 'full_odonto', url: 'http://127.0.0.1:3001/odonto/dra-camila' },
  { name: 'full_barber', url: 'http://127.0.0.1:3001/barber/vintage-club' },
  { name: 'full_portfolio', url: 'http://127.0.0.1:3001/portfolio' },
];

async function capture() {
  console.log('Iniciando captura de páginas completas (Full Page)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1920,
    deviceScaleFactor: 1.5,
  });

  for (const t of targets) {
    try {
      console.log(`Carregando ${t.name} em ${t.url}...`);
      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 20000 });
      // Rola um pouco para disparar lazy loading e animações
      await page.evaluate(async () => {
        window.scrollBy(0, 1000);
        await new Promise(r => setTimeout(r, 600));
        window.scrollBy(0, 1500);
        await new Promise(r => setTimeout(r, 600));
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 800));
      });

      const outPath = path.join(OUTPUT_DIR, `${t.name}.png`);
      await page.screenshot({ path: outPath, fullPage: true, type: 'png' });
      console.log(`Página completa salva: ${outPath}`);
    } catch (err) {
      console.error(`Erro ao capturar ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Todas as páginas completas foram capturadas!');
}

capture();
