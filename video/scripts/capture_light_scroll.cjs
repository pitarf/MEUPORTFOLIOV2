const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../public/bg-scroll');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const targets = [
  { name: 'full_portfolio_light', url: 'http://localhost:3001/?theme=light', isLight: true },
  { name: 'full_odonto_light', url: 'http://localhost:3001/odonto/dra-camila', isLight: true },
  { name: 'full_psicologia_light', url: 'http://localhost:3001/psicologia/dr-marcos', isLight: true },
  { name: 'full_nutrivida_light', url: 'http://localhost:3001/nutrivida/dra-amanda', isLight: true },
];

async function capture() {
  console.log('Iniciando captura de telas completas em Tema Claro...');
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

      // Forçar localStorage theme = 'light' e classe 'light' no HTML
      await page.evaluate(() => {
        try {
          localStorage.setItem('theme', 'light');
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        } catch (e) {}
      });

      // Aguarda carregamento de transições e imagens
      await new Promise(r => setTimeout(r, 2000));

      const outPath = path.join(OUTPUT_DIR, `${t.name}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Sucesso: ${outPath}`);
    } catch (err) {
      console.error(`Erro ao capturar ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Capturas de tema claro concluídas!');
}

capture();
