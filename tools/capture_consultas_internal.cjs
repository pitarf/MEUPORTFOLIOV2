const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureConsultas() {
  const outDir = path.resolve(__dirname, 'consultas-captures');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    storageState: {
      cookies: [
        {
          name: 'session',
          value: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiZjE5ZTcxOS05ZjUwLTRiYmUtOGMxNS1lMjMwZDdkOWEzNDciLCJleHBpcmVzQXQiOiIyMDI2LTEwLTA5VDExOjM4OjAzLjI3NFoiLCJpYXQiOjE3OTA5NDEwODMsImV4cCI6MTc5MTU0NTg4M30.tpHlFAvivDOz3E_MTpZA379HQfWXeC2Mq9KA1jkGZgI',
          domain: 'consultasbrasil.net',
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'Lax',
        },
        {
          name: 'admin_verified',
          value: 'true',
          domain: 'consultasbrasil.net',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'Lax',
        }
      ],
      origins: []
    }
  });

  const page = await context.newPage();

  const pagesToTest = [
    { url: 'https://consultasbrasil.net/dashboard', name: 'dashboard-cockpit' },
    { url: 'https://consultasbrasil.net/dashboard/processos', name: 'dashboard-processos' },
    { url: 'https://consultasbrasil.net/dashboard/veiculos', name: 'dashboard-veiculos' },
    { url: 'https://consultasbrasil.net/dashboard/empresas', name: 'dashboard-empresas' },
    { url: 'https://consultasbrasil.net/dashboard/faturas', name: 'dashboard-faturas' },
    { url: 'https://consultasbrasil.net/admin', name: 'admin-dashboard' },
    { url: 'https://consultasbrasil.net/admin/precos', name: 'admin-precos' },
    { url: 'https://consultasbrasil.net/admin/custos', name: 'admin-custos' },
    { url: 'https://consultasbrasil.net/admin/usuarios', name: 'admin-usuarios' },
  ];

  for (const item of pagesToTest) {
    console.log('Navegando para:', item.url);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log('  URL final:', currentUrl);
      const filePath = path.join(outDir, `${item.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log('  Salvo:', filePath);
    } catch (e) {
      console.error('  Erro:', e.message);
    }
  }

  await browser.close();
}

captureConsultas();
