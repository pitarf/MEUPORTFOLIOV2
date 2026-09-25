import { chromium } from 'playwright';

async function checkLiveCards() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🌐 Conectando em produção: https://rafaelpitaoficial.com.br/portfolio ...');
    await page.goto('https://rafaelpitaoficial.com.br/portfolio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const btn = await page.locator('button:has-text("Todos")').first().textContent();
    console.log(`🏷️ Botão 'Todos' ao vivo: ${btn}`);

    const cards = await page.locator('.group.relative.rounded-2xl, [data-project-card]').count();
    console.log(`📊 Total de cards visíveis em produção: ${cards}`);

    await page.screenshot({ path: 'tests/audit-results/live-portfolio-fixed.png', fullPage: true });
    console.log('📸 Screenshot salva em tests/audit-results/live-portfolio-fixed.png');

    await browser.close();
}

checkLiveCards().catch(console.error);
