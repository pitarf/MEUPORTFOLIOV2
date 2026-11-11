const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(__dirname, '../public/captures');

const extraTargets = [
  { name: 'legal_mobile', url: 'http://127.0.0.1:3001/adv/silva-santos', width: 390, height: 844, isMobile: true },
  { name: 'portfolio_desktop', url: 'http://127.0.0.1:3001/portfolio', width: 1280, height: 800, isMobile: false },
];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  for (const t of extraTargets) {
    try {
      await page.setViewport({
        width: t.width,
        height: t.height,
        deviceScaleFactor: 2,
        isMobile: t.isMobile,
        hasTouch: t.isMobile
      });

      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1200));

      const outPath = path.join(OUTPUT_DIR, `${t.name}.png`);
      await page.screenshot({ path: outPath, type: 'png' });
      console.log(`Salvo: ${outPath}`);
    } catch (err) {
      console.error(`Erro ao capturar ${t.name}:`, err.message);
    }
  }

  await browser.close();
}

capture();
