import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  const outputDir = path.resolve('tests/audit-results/legal');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  
  // 1. Resolução crítica do print do usuário: Laptop 1200x800
  console.log('Capturando Laptop 1200x800 (resolução do print do usuário)...');
  const page1200 = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await page1200.goto('http://localhost:3001/advocacia/dr-jorge-santos-aracaju', { waitUntil: 'networkidle' });
  await page1200.waitForTimeout(1500);
  
  const header = page1200.locator('header');
  if (await header.count() > 0) {
    await header.screenshot({ path: path.join(outputDir, 'navbar_1200.png') });
  }
  await page1200.screenshot({ path: path.join(outputDir, 'desktop_1200_full.png'), fullPage: true });
  await page1200.close();

  // 2. Desktop 1440x900
  console.log('Capturando Desktop 1440x900...');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3001/advocacia/dr-jorge-santos-aracaju', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(outputDir, 'desktop_full.png'), fullPage: true });

  const hero = page.locator('#inicio');
  if (await hero.count() > 0) {
    await hero.screenshot({ path: path.join(outputDir, 'desktop_hero.png') });
  }

  const atuacao = page.locator('#atuacao');
  if (await atuacao.count() > 0) {
    await atuacao.screenshot({ path: path.join(outputDir, 'desktop_atuacao.png') });
  }

  const sobre = page.locator('#sobre');
  if (await sobre.count() > 0) {
    await sobre.screenshot({ path: path.join(outputDir, 'desktop_sobre.png') });
  }

  const metodologia = page.locator('#metodologia');
  if (await metodologia.count() > 0) {
    await metodologia.screenshot({ path: path.join(outputDir, 'desktop_metodologia.png') });
  }

  const diagnostico = page.locator('#diagnostico');
  if (await diagnostico.count() > 0) {
    await diagnostico.screenshot({ path: path.join(outputDir, 'desktop_diagnostico.png') });
  }

  const banner = page.locator('section:has(a:has-text("Agendar uma Consulta")):has-text("Pronto para Assumir")');
  if (await banner.count() > 0) {
    await banner.screenshot({ path: path.join(outputDir, 'desktop_banner_pre_rodape.png') });
  }

  const footer = page.locator('footer');
  if (await footer.count() > 0) {
    await footer.screenshot({ path: path.join(outputDir, 'desktop_footer.png') });
  }

  await page.close();

  // 3. Mobile 390x844
  console.log('Capturando Mobile 390x844...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobilePage.goto('http://localhost:3001/advocacia/dr-jorge-santos-aracaju', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({ path: path.join(outputDir, 'mobile_full.png'), fullPage: true });
  await mobilePage.close();

  await browser.close();
  console.log('Capturas salvas com sucesso em:', outputDir);
}

run().catch((err) => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
