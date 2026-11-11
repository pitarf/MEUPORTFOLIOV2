const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../public/captures');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const targets = [
  { name: 'burger_mobile', url: 'http://127.0.0.1:3001/burger/degusta-burger', width: 390, height: 844, isMobile: true },
  { name: 'burger_desktop', url: 'http://127.0.0.1:3001/burger/degusta-burger', width: 1280, height: 800, isMobile: false },
  { name: 'barber_mobile', url: 'http://127.0.0.1:3001/barber/vintage-club', width: 390, height: 844, isMobile: true },
  { name: 'dental_mobile', url: 'http://127.0.0.1:3001/odonto/dra-camila', width: 390, height: 844, isMobile: true },
  { name: 'psychology_mobile', url: 'http://127.0.0.1:3001/psicologia/dr-marcos', width: 390, height: 844, isMobile: true },
  { name: 'nutrition_mobile', url: 'http://127.0.0.1:3001/nutrivida/dra-amanda', width: 390, height: 844, isMobile: true },
  { name: 'radar_desktop', url: 'http://127.0.0.1:3001/admin/radar-google-maps', width: 1280, height: 800, isMobile: false },
];

async function capture() {
  console.log('Iniciando captura via Puppeteer Core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  for (const t of targets) {
    try {
      console.log(`Capturando ${t.name} em ${t.url}...`);
      await page.setViewport({
        width: t.width,
        height: t.height,
        deviceScaleFactor: 2,
        isMobile: t.isMobile,
        hasTouch: t.isMobile
      });

      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Pequena pausa para garantir carregamento de animações e imagens
      await new Promise(r => setTimeout(r, 1200));

      const outPath = path.join(OUTPUT_DIR, `${t.name}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`Salvo: ${outPath}`);
    } catch (err) {
      console.error(`Erro ao capturar ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Todas as capturas finalizadas com sucesso!');
}

capture();
