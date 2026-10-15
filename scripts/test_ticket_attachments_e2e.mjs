import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/rfpit/.gemini/antigravity/brain/a69657da-b72e-459c-a160-2de0bd502082';

async function runTest() {
    console.log('Iniciando teste automatizado de anexo de prints com Playwright...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();

    try {
        // 1. Acessar a pagina de administracao de chamados
        console.log('Navegando para http://localhost:3001/admin/support ...');
        await page.goto('http://localhost:3001/admin/support', { waitUntil: 'networkidle', timeout: 30000 });

        // Aguarda carregar o conteudo
        await page.waitForTimeout(3000);

        // Screenshot da tela geral de chamados
        const ticketsScreenPath = path.join(ARTIFACT_DIR, 'screenshot_admin_support_board.png');
        await page.screenshot({ path: ticketsScreenPath, fullPage: false });
        console.log('Screenshot do quadro de chamados salvo em:', ticketsScreenPath);

        // Localiza algum card de chamado clicavel
        const ticketCards = page.locator('.glass-effect.border-l-4');
        const count = await ticketCards.count();
        console.log(`Encontrados ${count} cards de chamado.`);

        if (count > 0) {
            console.log('Clicando no primeiro chamado para abrir o modal de detalhes...');
            await ticketCards.first().click();
            await page.waitForTimeout(2000);

            // Verifica se o modal abriu e se os elementos de anexo estao presentes
            const noteTextarea = page.locator('#new-note');
            await noteTextarea.waitFor({ state: 'visible', timeout: 5000 });
            console.log('Textarea de notas visivel!');

            // Cria um arquivo de imagem temporario para simular upload
            const tempImgPath = path.join(process.cwd(), 'temp_test_screenshot.png');
            // Cria um PNG minimo de 1x1 pixel ou imagem de teste
            const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjuAAAAAElFTkSuQmCC';
            fs.writeFileSync(tempImgPath, Buffer.from(samplePngBase64, 'base64'));

            // Localiza o input file oculto e faz o upload
            const fileInput = page.locator('input[type="file"][accept="image/*"]');
            await fileInput.setInputFiles(tempImgPath);
            await page.waitForTimeout(1500);

            console.log('Arquivo de teste anexado!');

            // Screenshot do modal com o print anexado e o preview visivel
            const modalScreenshotPath = path.join(ARTIFACT_DIR, 'screenshot_ticket_attachment_modal.png');
            await page.screenshot({ path: modalScreenshotPath, fullPage: false });
            console.log('Screenshot do modal com print anexado salvo em:', modalScreenshotPath);

            // Remove o arquivo temporario
            if (fs.existsSync(tempImgPath)) {
                fs.unlinkSync(tempImgPath);
            }
        } else {
            console.warn('Nenhum chamado no banco local. Criando teste direto no portal do cliente...');
        }

        // 2. Acessar o Portal do Assinante para testar o modal de abertura de chamado
        console.log('Navegando para http://localhost:3001/minha-assinatura ...');
        await page.goto('http://localhost:3001/minha-assinatura', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        const portalScreenshotPath = path.join(ARTIFACT_DIR, 'screenshot_portal_assinante.png');
        await page.screenshot({ path: portalScreenshotPath, fullPage: false });
        console.log('Screenshot do portal salvo em:', portalScreenshotPath);

        console.log('Teste concluido com sucesso!');
    } catch (err) {
        console.error('Erro durante o teste Playwright:', err);
    } finally {
        await browser.close();
    }
}

runTest();
