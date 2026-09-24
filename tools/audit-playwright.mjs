/**
 * Script de Auditoria Automatizada com Playwright
 * Executa testes em múltiplos viewports (Desktop e Mobile), detecta vazamentos de layout (horizontal overflow),
 * captura screenshots fullPage, audita console errors e alvos de toque (touch targets).
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'tests', 'audit-results');
const screenshotsDir = path.join(outputDir, 'screenshots');

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3001').trim();

const VIEWPORTS = [
    { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
    { name: 'mobile-iphone-390', width: 390, height: 844, isMobile: true },
    { name: 'mobile-narrow-320', width: 320, height: 568, isMobile: true }
];

const ROUTES = [
    { path: '/', name: 'home' },
    { path: '/sobre', name: 'sobre' },
    { path: '/servicos', name: 'servicos' },
    { path: '/criacao-de-sites', name: 'servico-criacao-sites' },
    { path: '/landing-pages', name: 'servico-landing-pages' },
    { path: '/desenvolvimento-de-sistemas', name: 'servico-desenvolvimento-sistemas' },
    { path: '/automacoes', name: 'servico-automacoes' },
    { path: '/dashboards-power-bi', name: 'servico-dashboards-power-bi' },
    { path: '/fotografia-eventos', name: 'servico-fotografia-eventos' },
    { path: '/fotografia-corporativa', name: 'servico-fotografia-corporativa' },
    { path: '/portfolio', name: 'portfolio' },
    { path: '/portfolio-fotografia', name: 'portfolio-fotografia' },
    { path: '/portfolio-fotografia/galeria', name: 'fotografia-galeria' },
    { path: '/avaliacoes', name: 'avaliacoes' },
    { path: '/contato', name: 'contato' },
    { path: '/area-clientes', name: 'area-clientes' },
    { path: '/track-ticket', name: 'track-ticket' }
];

// Assegura diretórios de saída
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

async function runAudit() {
    console.log(`\n======================================================`);
    console.log(`🚀 Iniciando Auditoria Playwright em ${BASE_URL}`);
    console.log(`======================================================\n`);

    const browser = await chromium.launch({ headless: true });
    const auditReport = {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        totalChecked: 0,
        overflowIssues: [],
        consoleErrors: [],
        touchTargetWarnings: [],
        themeToggleResults: [],
        langToggleResults: [],
        screenshots: []
    };

    try {
        for (const vp of VIEWPORTS) {
            const vpFolder = path.join(screenshotsDir, vp.name);
            if (!fs.existsSync(vpFolder)) fs.mkdirSync(vpFolder, { recursive: true });

            console.log(`\n📱 Testando Viewport: ${vp.name} (${vp.width}x${vp.height}, mobile=${vp.isMobile})`);

            const context = await browser.newContext({
                viewport: { width: vp.width, height: vp.height },
                isMobile: vp.isMobile,
                hasTouch: vp.isMobile,
                userAgent: vp.isMobile 
                    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
                    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();

            // Rastreamento de erros do console
            const pageErrors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    pageErrors.push(msg.text());
                }
            });
            page.on('pageerror', err => {
                pageErrors.push(`[UNCAUGHT] ${err.message}`);
            });

            for (const route of ROUTES) {
                const targetUrl = `${BASE_URL}${route.path}`;
                pageErrors.length = 0; // limpa erros para esta rota
                auditReport.totalChecked++;

                try {
                    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 15000 });
                    await page.waitForTimeout(1000); // espera animações framer-motion estabilizarem
                } catch (navErr) {
                    console.error(`  ❌ Falha de navegação em ${route.path}: ${navErr.message}`);
                    continue;
                }

                // 1. Verificação de Horizontal Overflow (Vazamento de largura)
                const overflowData = await page.evaluate(() => {
                    const clientWidth = document.documentElement.clientWidth;
                    const scrollWidth = Math.max(
                        document.documentElement.scrollWidth,
                        document.body ? document.body.scrollWidth : 0
                    );
                    const isLeaking = scrollWidth > clientWidth + 1; // margem de 1px
                    let offendingNodes = [];

                    if (isLeaking) {
                        const allElements = document.querySelectorAll('*');
                        for (const el of allElements) {
                            const rect = el.getBoundingClientRect();
                            if (rect.right > clientWidth + 1) {
                                offendingNodes.push({
                                    tag: el.tagName.toLowerCase(),
                                    id: el.id || undefined,
                                    class: typeof el.className === 'string' ? el.className.split(' ').slice(0, 4).join(' ') : '',
                                    rectRight: Math.round(rect.right),
                                    clientWidth: Math.round(clientWidth)
                                });
                                if (offendingNodes.length >= 3) break;
                            }
                        }
                    }

                    return { clientWidth, scrollWidth, isLeaking, offendingNodes };
                });

                if (overflowData.isLeaking) {
                    console.warn(`  ⚠️ VAZAMENTO DETECTADO em ${route.path} (${vp.name}): clientWidth=${overflowData.clientWidth}px, scrollWidth=${overflowData.scrollWidth}px`);
                    if (overflowData.offendingNodes.length > 0) {
                        console.warn(`     Elementos ofensores:`, JSON.stringify(overflowData.offendingNodes));
                    }
                    auditReport.overflowIssues.push({
                        route: route.path,
                        viewport: vp.name,
                        clientWidth: overflowData.clientWidth,
                        scrollWidth: overflowData.scrollWidth,
                        nodes: overflowData.offendingNodes
                    });
                } else {
                    process.stdout.write(`  ✅ ${route.path.padEnd(30)} | Sem vazamento (${overflowData.clientWidth}px)\n`);
                }

                // 2. Coleta de erros de console
                if (pageErrors.length > 0) {
                    // Ignora erros conhecidos de terceiros irrelevantes se houver (ex: favicon ou extensões)
                    const relevantErrors = pageErrors.filter(e => !e.includes('favicon') && !e.includes('chrome-extension'));
                    if (relevantErrors.length > 0) {
                        auditReport.consoleErrors.push({
                            route: route.path,
                            viewport: vp.name,
                            errors: [...relevantErrors]
                        });
                    }
                }

                // 3. Checagem de Touch Targets em Mobile
                if (vp.isMobile) {
                    const smallTouchTargets = await page.evaluate(() => {
                        const buttons = document.querySelectorAll('button, a, input, select');
                        const smallOnes = [];
                        for (const btn of buttons) {
                            // ignora elementos invisíveis ou fora da tela
                            const rect = btn.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0 && rect.top < 2000 && rect.bottom > 0) {
                                if (rect.height < 32 || rect.width < 32) {
                                    smallOnes.push({
                                        tag: btn.tagName.toLowerCase(),
                                        text: (btn.innerText || btn.getAttribute('aria-label') || '').slice(0, 30).trim(),
                                        width: Math.round(rect.width),
                                        height: Math.round(rect.height),
                                        class: typeof btn.className === 'string' ? btn.className.split(' ').slice(0, 3).join(' ') : ''
                                    });
                                    if (smallOnes.length >= 3) break;
                                }
                            }
                        }
                        return smallOnes;
                    });

                    if (smallTouchTargets.length > 0) {
                        auditReport.touchTargetWarnings.push({
                            route: route.path,
                            viewport: vp.name,
                            targets: smallTouchTargets
                        });
                    }
                }

                // 4. Captura de Screenshot Full-page
                const screenshotPath = path.join(vpFolder, `${route.name}.png`);
                try {
                    await page.screenshot({ path: screenshotPath, fullPage: true });
                    auditReport.screenshots.push({
                        route: route.path,
                        viewport: vp.name,
                        file: path.relative(rootDir, screenshotPath)
                    });
                } catch (shotErr) {
                    console.error(`  ⚠️ Falha ao salvar screenshot de ${route.name}: ${shotErr.message}`);
                }
            }

            // 5. Testes Especiais de Interação (Navbar, Toggle de Tema e Toggle de Idioma)
            console.log(`\n  🧪 Testando Alternadores de Tema e Idioma na Home...`);
            try {
                await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

                // Toggle de Tema (seletor que funciona tanto em desktop quanto mobile)
                const themeBtn = page.locator('button:has(svg.lucide-sun), button:has(svg.lucide-moon)').filter({ hasNot: page.locator('.hidden') }).first();
                if (await themeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    const initialHtmlClass = await page.evaluate(() => document.documentElement.className);
                    await themeBtn.click({ timeout: 3000 }).catch(() => {});
                    await page.waitForTimeout(500);
                    const toggledHtmlClass = await page.evaluate(() => document.documentElement.className);
                    auditReport.themeToggleResults.push({
                        viewport: vp.name,
                        initial: initialHtmlClass,
                        afterToggle: toggledHtmlClass,
                        success: initialHtmlClass !== toggledHtmlClass
                    });
                    // Screenshot no tema alternado
                    const toggledScreenshot = path.join(vpFolder, `home-theme-toggled.png`);
                    await page.screenshot({ path: toggledScreenshot, fullPage: false }).catch(() => {});
                }

                // Toggle de Idioma (seletor flexível para desktop e mobile)
                const langBtn = page.locator('button:has(svg.lucide-globe)').filter({ hasNot: page.locator('.hidden') }).first();
                if (await langBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    const initialLang = await page.evaluate(() => document.documentElement.lang);
                    await langBtn.click({ timeout: 3000 }).catch(() => {});
                    await page.waitForTimeout(500);
                    const toggledLang = await page.evaluate(() => document.documentElement.lang);
                    auditReport.langToggleResults.push({
                        viewport: vp.name,
                        initial: initialLang,
                        afterToggle: toggledLang,
                        success: initialLang !== toggledLang
                    });
                    // Screenshot no idioma alternado
                    const langScreenshot = path.join(vpFolder, `home-lang-toggled.png`);
                    await page.screenshot({ path: langScreenshot, fullPage: false }).catch(() => {});
                }
            } catch (interactionErr) {
                console.warn(`  ⚠️ Aviso ao testar toggles no viewport ${vp.name}: ${interactionErr.message}`);
            }

            await context.close();
        }
    } finally {
        await browser.close();
    }

    // Salva o relatório completo em JSON
    const reportPath = path.join(outputDir, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2), 'utf-8');

    console.log(`\n======================================================`);
    console.log(`🏁 Auditoria Concluída!`);
    console.log(`- Total de checagens: ${auditReport.totalChecked}`);
    console.log(`- Problemas de overflow (vazamento): ${auditReport.overflowIssues.length}`);
    console.log(`- Erros no console coletados: ${auditReport.consoleErrors.length}`);
    console.log(`- Alvos de toque pequenos: ${auditReport.touchTargetWarnings.length}`);
    console.log(`- Screenshots capturados: ${auditReport.screenshots.length}`);
    console.log(`- Relatório salvo em: ${reportPath}`);
    console.log(`======================================================\n`);
}

runAudit().catch(err => {
    console.error('Erro fatal durante a auditoria Playwright:', err);
    process.exit(1);
});
