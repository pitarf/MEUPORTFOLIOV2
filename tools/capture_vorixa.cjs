const { chromium } = require('playwright');

async function captureVorixa() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1920x1080
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('1. Capturando Home Widescreen Hero...');
  await page.goto('https://vortixia.com.br', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/vorixa-hero.png' });

  console.log('2. Capturando Recursos / Modelos / Studio...');
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tools/vorixa-recursos.png' });

  console.log('3. Capturando Galeria de Criações...');
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tools/vorixa-galeria.png' });

  console.log('4. Capturando Planos e Créditos...');
  const pricing = await page.$('section:has-text("Planos")') || await page.$('#pricing') || await page.$('#planos');
  if (pricing) {
    await pricing.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  } else {
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: 'tools/vorixa-planos.png' });

  console.log('5. Capturando Tela de Login...');
  await page.goto('https://vortixia.com.br/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'tools/vorixa-login.png' });

  // 2. Mobile Viewport (iPhone 14)
  const mobileContext = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();

  console.log('6. Capturando Mobile Home...');
  await mobilePage.goto('https://vortixia.com.br', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'tools/vorixa-mobile-home.png' });

  console.log('7. Capturando Mobile Recursos...');
  await mobilePage.evaluate(() => window.scrollBy(0, 700));
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'tools/vorixa-mobile-recursos.png' });

  await browser.close();
  console.log('Todas as 7 telas da VORTIXIA / VORIXA foram capturadas com sucesso!');
}

captureVorixa().catch(console.error);
