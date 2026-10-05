const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: 'AIzaSyCDFBG6kdlRUyNuyY3AhpjeS6BMGLdmxUE',
  authDomain: 'rafael-pita-portfolio.firebaseapp.com',
  projectId: 'rafael-pita-portfolio',
  storageBucket: 'rafael-pita-portfolio.firebasestorage.app',
  messagingSenderId: '421803070377',
  appId: '1:421803070377:web:57c9992f4d2a312f98aab8'
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const outputDir = path.join(__dirname, 'screenshots_auth');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function login(page, email, password) {
  console.log(`Fazendo login com ${email}...`);
  await page.goto('https://vantageapp.rafaelpitaoficial.com.br/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
}

async function captureAndUploadAll() {
  console.log('Iniciando esteira de captura autenticada via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const uploadedUrls = {};

  // ==========================================
  // 1. PERFIL ADMINISTRADOR MASTER (DASHBOARD & FINANÇAS)
  // ==========================================
  console.log('\n--- 1. Sessão Administrador Master ---');
  const adminContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const adminPage = await adminContext.newPage();
  await login(adminPage, 'admin@vantagemapp.com.br', 'Admin@Vantage2026!');

  // 1.1 Capa Principal: Dashboard Master / Analytics Financeiro (1920x1080 16:9)
  console.log('Capturando [admin-dashboard-hero]...');
  await adminPage.goto('https://vantageapp.rafaelpitaoficial.com.br/admin', { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(2500);

  const heroPath = path.join(outputDir, 'admin-dashboard-hero.jpg');
  await adminPage.screenshot({
    path: heroPath,
    type: 'jpeg',
    quality: 94,
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  uploadedUrls['admin-dashboard-hero'] = await uploadFile(heroPath, 'vantage-app-auth-admin-dashboard-hero');

  // 1.2 CRM de Restaurantes e Gestão Master (Scroll / Seção do Admin)
  console.log('Capturando [admin-crm-restaurantes]...');
  // Rola até a tabela de CRM de restaurantes
  await adminPage.evaluate(() => window.scrollBy(0, 600));
  await adminPage.waitForTimeout(1500);

  const crmPath = path.join(outputDir, 'admin-crm-restaurantes.jpg');
  await adminPage.screenshot({
    path: crmPath,
    type: 'jpeg',
    quality: 92,
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  uploadedUrls['admin-crm-restaurantes'] = await uploadFile(crmPath, 'vantage-app-auth-admin-crm');

  // 1.3 Painel Admin no Mobile (iPhone 14)
  console.log('Capturando [admin-mobile-iphone]...');
  const adminMobileContext = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const adminMobilePage = await adminMobileContext.newPage();
  await login(adminMobilePage, 'admin@vantagemapp.com.br', 'Admin@Vantage2026!');
  await adminMobilePage.goto('https://vantageapp.rafaelpitaoficial.com.br/admin', { waitUntil: 'networkidle' });
  await adminMobilePage.waitForTimeout(2000);

  const adminMobilePath = path.join(outputDir, 'admin-mobile-iphone.jpg');
  await adminMobilePage.screenshot({
    path: adminMobilePath,
    type: 'jpeg',
    quality: 92
  });
  uploadedUrls['admin-mobile-iphone'] = await uploadFile(adminMobilePath, 'vantage-app-auth-admin-mobile');
  await adminMobileContext.close();
  await adminContext.close();

  // ==========================================
  // 2. PERFIL DONO DO RESTAURANTE (PORTAL B2B)
  // ==========================================
  console.log('\n--- 2. Sessão Dono de Restaurante ---');
  const ownerContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const ownerPage = await ownerContext.newPage();
  await login(ownerPage, 'carlos.silveira@fogonobre.com.br', 'Dono@Vantage2026!');

  // 2.1 Painel do Restaurante com QR Code Dinâmico & Validador de Garçom
  console.log('Capturando [restaurante-portal-qrcode]...');
  await ownerPage.goto('https://vantageapp.rafaelpitaoficial.com.br/restaurante-admin', { waitUntil: 'networkidle' });
  await ownerPage.waitForTimeout(2500);

  const ownerPath = path.join(outputDir, 'restaurante-portal-qrcode.jpg');
  await ownerPage.screenshot({
    path: ownerPath,
    type: 'jpeg',
    quality: 94,
    clip: { x: 0, y: 0, width: 1920, height: 1080 }
  });
  uploadedUrls['restaurante-portal-qrcode'] = await uploadFile(ownerPath, 'vantage-app-auth-restaurante-qrcode');

  // 2.2 Painel do Restaurante no Mobile
  console.log('Capturando [restaurante-mobile]...');
  const ownerMobileContext = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const ownerMobilePage = await ownerMobileContext.newPage();
  await login(ownerMobilePage, 'carlos.silveira@fogonobre.com.br', 'Dono@Vantage2026!');
  await ownerMobilePage.goto('https://vantageapp.rafaelpitaoficial.com.br/restaurante-admin', { waitUntil: 'networkidle' });
  await ownerMobilePage.waitForTimeout(2000);

  const ownerMobilePath = path.join(outputDir, 'restaurante-mobile.jpg');
  await ownerMobilePage.screenshot({
    path: ownerMobilePath,
    type: 'jpeg',
    quality: 92
  });
  uploadedUrls['restaurante-mobile'] = await uploadFile(ownerMobilePath, 'vantage-app-auth-restaurante-mobile');
  await ownerMobileContext.close();
  await ownerContext.close();

  // ==========================================
  // 3. PERFIL CLIENTE VIP (CARTEIRA DE FIDELIDADE & SCAN)
  // ==========================================
  console.log('\n--- 3. Sessão Cliente VIP ---');
  const clientContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const clientPage = await clientContext.newPage();
  await login(clientPage, 'cliente@teste.com', 'Cliente@Vantage2026!');

  // 3.1 Carteira Digital de Fidelidade (Apple Wallet Style com cartões preenchidos)
  console.log('Capturando [cliente-fidelidade-wallet]...');
  await clientPage.goto('https://vantageapp.rafaelpitaoficial.com.br/fidelidade', { waitUntil: 'networkidle' });
  await clientPage.waitForTimeout(2500);

  const walletPath = path.join(outputDir, 'cliente-fidelidade-wallet.jpg');
  await clientPage.screenshot({
    path: walletPath,
    type: 'jpeg',
    quality: 94
  });
  uploadedUrls['cliente-fidelidade-wallet'] = await uploadFile(walletPath, 'vantage-app-auth-cliente-wallet');

  // 3.2 Carteira Digital no Mobile (iPhone 14)
  console.log('Capturando [cliente-fidelidade-mobile]...');
  const clientMobileContext = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const clientMobilePage = await clientMobileContext.newPage();
  await login(clientMobilePage, 'cliente@teste.com', 'Cliente@Vantage2026!');
  await clientMobilePage.goto('https://vantageapp.rafaelpitaoficial.com.br/fidelidade', { waitUntil: 'networkidle' });
  await clientMobilePage.waitForTimeout(2000);

  const clientMobilePath = path.join(outputDir, 'cliente-fidelidade-mobile.jpg');
  await clientMobilePage.screenshot({
    path: clientMobilePath,
    type: 'jpeg',
    quality: 92
  });
  uploadedUrls['cliente-fidelidade-mobile'] = await uploadFile(clientMobilePath, 'vantage-app-auth-cliente-fidelidade-mobile');

  // 3.3 Scanner Mobile com Mira e Validação (/scan)
  console.log('Capturando [scan-mobile-camera]...');
  await clientMobilePage.goto('https://vantageapp.rafaelpitaoficial.com.br/scan', { waitUntil: 'networkidle' });
  await clientMobilePage.waitForTimeout(2000);

  const scanMobilePath = path.join(outputDir, 'scan-mobile-camera.jpg');
  await clientMobilePage.screenshot({
    path: scanMobilePath,
    type: 'jpeg',
    quality: 92
  });
  uploadedUrls['scan-mobile-camera'] = await uploadFile(scanMobilePath, 'vantage-app-auth-scan-mobile');
  await clientMobileContext.close();
  await clientContext.close();

  await browser.close();

  fs.writeFileSync(
    path.join(outputDir, 'uploaded_auth_urls.json'),
    JSON.stringify(uploadedUrls, null, 2),
    'utf-8'
  );

  console.log('\nTodas as capturas autenticadas foram concluídas e salvas no Firebase!');
}

async function uploadFile(localPath, prefix) {
  const fileBuffer = fs.readFileSync(localPath);
  const timestamp = Date.now();
  const storagePath = `project-images/${prefix}-${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  console.log(`Fazendo upload: ${storagePath}...`);
  await uploadBytes(storageRef, fileBuffer, { contentType: 'image/jpeg' });
  const downloadUrl = await getDownloadURL(storageRef);
  console.log(`Upload concluído: ${downloadUrl}`);
  return downloadUrl;
}

captureAndUploadAll().catch(console.error);
