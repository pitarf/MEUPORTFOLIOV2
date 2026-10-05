const { chromium } = require('playwright');

async function captureStartOFFRich() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Context
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  console.log('1. Capturando tela de Login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tools/startoff-login.png' });

  console.log('2. Efetuando Login como Gestor...');
  await page.fill('input[type="email"]', 'roberto.manager2@startoff.com');
  await page.fill('input[type="password"]', '123456');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  console.log('3. Capturando Dashboard Principal / Hero Widescreen...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/startoff-dashboard-hero.png' });

  console.log('4. Capturando Calendário da Equipe...');
  await page.goto('http://localhost:5173/team-calendar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/startoff-team-calendar.png' });

  console.log('5. Capturando Gestão da Equipe e Aprovações...');
  await page.goto('http://localhost:5173/team-management', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/startoff-team-management.png' });

  console.log('6. Capturando Nova Solicitação com Recomendações de IA...');
  await page.goto('http://localhost:5173/new-request', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Clica no botão sugerir para disparar o motor inteligente
  try {
    const sugerirBtn = await page.$('button:has-text("Sugerir")');
    if (sugerirBtn) {
      await sugerirBtn.click();
      await page.waitForTimeout(1500);
    }
  } catch (e) {
    console.log('Botão sugerir não acionado:', e.message);
  }
  await page.screenshot({ path: 'tools/startoff-ia-request.png' });

  console.log('7. Capturando Períodos Bloqueados...');
  await page.goto('http://localhost:5173/blocked-periods', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/startoff-blocked-periods.png' });

  // 8. Mobile Viewport (iPhone 14)
  const mobileContext = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2
  });
  const mobilePage = await mobileContext.newPage();

  console.log('8. Capturando Mobile Login...');
  await mobilePage.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: 'tools/startoff-mobile-login.png' });

  console.log('9. Capturando Mobile Dashboard...');
  await mobilePage.fill('input[type="email"]', 'roberto.manager2@startoff.com');
  await mobilePage.fill('input[type="password"]', '123456');
  await mobilePage.click('button[type="submit"]');
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: 'tools/startoff-mobile-dashboard.png' });

  await browser.close();
  console.log('Todas as telas com dados ricos foram atualizadas com sucesso!');
}

captureStartOFFRich().catch(console.error);
