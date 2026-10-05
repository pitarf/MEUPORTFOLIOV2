const { chromium } = require('playwright');

async function captureConsultasBrasil() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop 1920x1080
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('1. Capturando Home Widescreen (Hero)...');
  await page.goto('https://consultasbrasil.net', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/consultasbrasil-hero.png' });

  console.log('2. Capturando Seção de Módulos e Tipos de Consultas...');
  const modulesSection = await page.$('section:has-text("Escolha o tipo")') || await page.$('section:has-text("módulos")') || await page.$('#modulos');
  if (modulesSection) {
    await modulesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  } else {
    await page.evaluate(() => window.scrollBy(0, 700));
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: 'tools/consultasbrasil-modulos.png' });

  console.log('3. Capturando Como Funciona e Fontes...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'tools/consultasbrasil-como-funciona.png' });

  console.log('4. Capturando Planos e Recarga de Créditos...');
  const pricingSection = await page.$('section:has-text("créditos")') || await page.$('section:has-text("Pague apenas")') || await page.$('#precos');
  if (pricingSection) {
    await pricingSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  } else {
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: 'tools/consultasbrasil-recarga.png' });

  console.log('5. Capturando FAQ Interativo...');
  const faqSection = await page.$('section:has-text("Perguntas frequentes")') || await page.$('section:has-text("FAQ")');
  if (faqSection) {
    await faqSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: 'tools/consultasbrasil-faq.png' });

  console.log('6. Capturando Tela de Login...');
  await page.goto('https://consultasbrasil.net/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'tools/consultasbrasil-login.png' });

  // 2. Mobile Viewport (iPhone 14)
  const mobileContext = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();

  console.log('7. Capturando Mobile Home...');
  await mobilePage.goto('https://consultasbrasil.net', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: 'tools/consultasbrasil-mobile-home.png' });

  console.log('8. Capturando Mobile Módulos...');
  await mobilePage.evaluate(() => window.scrollBy(0, 650));
  await mobilePage.waitForTimeout(600);
  await mobilePage.screenshot({ path: 'tools/consultasbrasil-mobile-modulos.png' });

  await browser.close();
  console.log('Todas as 8 telas do Consultas Brasil foram capturadas com sucesso!');
}

captureConsultasBrasil().catch(console.error);
