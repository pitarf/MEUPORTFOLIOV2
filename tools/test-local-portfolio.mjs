import { chromium } from 'playwright';

async function testLocalPortfolio() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🌐 Navegando para http://localhost:4173/portfolio ...');
    await page.goto('http://localhost:4173/portfolio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const projectCards = await page.locator('.group.relative.rounded-2xl, [data-project-card]').count();
    console.log(`📊 Total de cards detectados no portfólio: ${projectCards}`);

    const badgeText = await page.locator('button:has-text("Todos")').textContent();
    console.log(`🏷️ Botão 'Todos': ${badgeText}`);

    await page.screenshot({ path: 'tests/audit-results/test-local-portfolio-success.png', fullPage: true });
    console.log('📸 Screenshot salva em tests/audit-results/test-local-portfolio-success.png');

    await browser.close();
}

testLocalPortfolio().catch(console.error);
