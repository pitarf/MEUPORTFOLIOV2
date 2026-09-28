import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  const outputDir = path.resolve('tests/audit-results/legal');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navegando para a página...');
  await page.goto('http://localhost:3001/advocacia/dr-jorge-santos-aracaju', { waitUntil: 'networkidle' });

  const hero = page.locator('#inicio');

  // Slide 1 inicial (0s)
  console.log('Capturando Slide 1 (tempo inicial)...');
  await page.waitForTimeout(1000);
  await hero.screenshot({ path: path.join(outputDir, 'hero_autoplay_slide1.png') });

  // Aguarda 5.5 segundos para a transição automática
  console.log('Aguardando 5.5s para mudanca automatica...');
  await page.waitForTimeout(5500);
  console.log('Capturando Slide 2 (apos mudanca automatica)...');
  await hero.screenshot({ path: path.join(outputDir, 'hero_autoplay_slide2.png') });

  // Aguarda mais 5.5 segundos para a próxima transição automática
  console.log('Aguardando mais 5.5s para mudanca automatica...');
  await page.waitForTimeout(5500);
  console.log('Capturando Slide 3 (apos segunda mudanca automatica)...');
  await hero.screenshot({ path: path.join(outputDir, 'hero_autoplay_slide3.png') });

  await browser.close();
  console.log('Verificacao de autoplay concluida com sucesso!');
}

run().catch((err) => {
  console.error('Erro na verificacao de autoplay:', err);
  process.exit(1);
});
