import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/rfpit/.gemini/antigravity/brain/a69657da-b72e-459c-a160-2de0bd502082';

async function testLightboxOpen() {
    console.log('Testando abertura do Lightbox...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    try {
        await page.goto('http://localhost:3001/admin/support', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        const ticketCard = page.locator('.glass-effect.border-l-4').first();
        await ticketCard.click();
        await page.waitForTimeout(1500);

        // Localiza a miniatura do print clicavel
        const printThumbnail = page.locator('.group.relative.inline-block.cursor-pointer').first();
        await printThumbnail.click();
        await page.waitForTimeout(1000);

        // Screenshot do modal Lightbox aberto
        const lightboxPath = path.join(ARTIFACT_DIR, 'screenshot_lightbox_modal_open.png');
        await page.screenshot({ path: lightboxPath, fullPage: false });
        console.log('Screenshot do Lightbox salvo em:', lightboxPath);

    } catch (e) {
        console.error('Erro:', e);
    } finally {
        await browser.close();
    }
}

testLightboxOpen();
