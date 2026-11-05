const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
    const artifactDir = 'C:\\Users\\rfpit\\.gemini\\antigravity\\brain\\a69657da-b72e-459c-a160-2de0bd502082';
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    console.log('Navegando para http://localhost:3001/nutricionista ...');
    await page.goto('http://localhost:3001/nutricionista', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Screenshot completo da página inteira
    const fullPath = path.join(artifactDir, 'nutrition_fullpage.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('Full page salva em:', fullPath);

    // 2. Screenshots de cada transição/seção
    const sections = ['inicio', 'sobre', 'servicos', 'como-funciona', 'diferenciais', 'avaliacoes', 'localizacao', 'faq'];
    for (const sec of sections) {
        const el = await page.$(`#${sec}`);
        if (el) {
            const secPath = path.join(artifactDir, `sec_${sec}.png`);
            await el.screenshot({ path: secPath });
            console.log(`Secao #${sec} salva em:`, secPath);
        } else {
            console.log(`Secao #${sec} nao encontrada`);
        }
    }

    // 3. Capturar o Final CTA especificamente
    const ctaSection = await page.$('main > section:last-of-type');
    if (ctaSection) {
        const ctaPath = path.join(artifactDir, 'sec_final_cta.png');
        await ctaSection.screenshot({ path: ctaPath });
        console.log('Final CTA salvo em:', ctaPath);
    }

    // 4. Também inspecionar a página nutrivida
    console.log('Navegando para http://localhost:3001/nutrivida ...');
    await page.goto('http://localhost:3001/nutrivida', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const nutrividaFull = path.join(artifactDir, 'nutrivida_fullpage.png');
    await page.screenshot({ path: nutrividaFull, fullPage: true });
    console.log('Nutrivida full page salva em:', nutrividaFull);

    await browser.close();
    console.log('Concluído com sucesso!');
}

run().catch(err => {
    console.error('Erro na captura:', err);
    process.exit(1);
});
