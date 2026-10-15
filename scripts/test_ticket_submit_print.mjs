import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/rfpit/.gemini/antigravity/brain/a69657da-b72e-459c-a160-2de0bd502082';

async function runLiveSubmitTest() {
    console.log('Iniciando teste de submissao com print real...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    try {
        await page.goto('http://localhost:3001/admin/support', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(3000);

        const ticketCard = page.locator('.glass-effect.border-l-4').first();
        await ticketCard.click();
        await page.waitForTimeout(1500);

        // Preenche nota
        await page.locator('#new-note').fill('Validando envio de print via suporte técnico automatizado.');

        // Cria imagem de teste colorida
        const tempImgPath = path.join(process.cwd(), 'print_teste_suporte.png');
        const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAALUlEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIB3A01wAAE95YI7AAAAAElFTkSuQmCC';
        fs.writeFileSync(tempImgPath, Buffer.from(samplePngBase64, 'base64'));

        // Anexa
        const fileInput = page.locator('input[type="file"][accept="image/*"]');
        await fileInput.setInputFiles(tempImgPath);
        await page.waitForTimeout(1000);

        // Clica em Enviar
        console.log('Submetendo nota com print...');
        const submitBtn = page.getByRole('button', { name: 'Enviar' });
        await submitBtn.click();

        // Aguarda upload e retorno
        await page.waitForTimeout(6000);

        // Screenshot pos-envio
        const afterSubmitPath = path.join(ARTIFACT_DIR, 'screenshot_ticket_with_submitted_print.png');
        await page.screenshot({ path: afterSubmitPath, fullPage: false });
        console.log('Screenshot com print submetido salvo em:', afterSubmitPath);

        // Limpeza
        if (fs.existsSync(tempImgPath)) fs.unlinkSync(tempImgPath);

    } catch (e) {
        console.error('Erro no teste de submissao:', e);
    } finally {
        await browser.close();
    }
}

runLiveSubmitTest();
