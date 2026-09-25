import { chromium } from 'playwright';

async function checkSite() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const consoleLogs = [];
    const failedRequests = [];

    page.on('console', msg => {
        consoleLogs.push({ type: msg.type(), text: msg.text() });
    });

    page.on('pageerror', err => {
        consoleLogs.push({ type: 'pageerror', text: err.message });
    });

    page.on('requestfailed', request => {
        failedRequests.push({
            url: request.url(),
            failure: request.failure()?.errorText
        });
    });

    page.on('response', response => {
        if (response.status() >= 400) {
            failedRequests.push({
                url: response.url(),
                status: response.status()
            });
        }
    });

    console.log('🌐 Navegando para https://rafaelpitaoficial.com.br/portfolio ...');
    try {
        await page.goto('https://rafaelpitaoficial.com.br/portfolio', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);
    } catch (err) {
        console.error('Erro ao navegar:', err.message);
    }

    console.log('\n=== LOGS DE CONSOLE ===');
    consoleLogs.forEach(l => console.log(`[${l.type}] ${l.text}`));

    console.log('\n=== REQUISIÇÕES COM FALHA OU STATUS >= 400 ===');
    failedRequests.forEach(f => console.log(f));

    await page.screenshot({ path: 'tests/audit-results/debug-portfolio-live.png', fullPage: true });
    console.log('\n📸 Screenshot salva em tests/audit-results/debug-portfolio-live.png');

    await browser.close();
}

checkSite().catch(console.error);
