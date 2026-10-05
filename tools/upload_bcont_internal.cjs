const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');
const envVars = {};
lines.forEach(l => {
  const match = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = (match[2] || '').trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    envVars[match[1]] = val.trim();
  }
});

const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const realScreenshots = [
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/a69657da-b72e-459c-a160-2de0bd502082/.user_uploaded/media_1790910389269.png', target: 'bcont-painel-operacional-live.png', label: 'Painel Operacional Cockpit' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1787310697521.png', target: 'bcont-dre-gerencial-live.png', label: 'DRE Demonstrativo de Resultado' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1787265848669.png', target: 'bcont-certidoes-ia-live.png', label: 'Análise de Certidões CND com IA Gemini' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1790316237787.png', target: 'bcont-conciliacao-matching-live.png', label: 'Motor de Conciliação Bancária N:1' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1788282295343.png', target: 'bcont-produtividade-setores-live.png', label: 'Produtividade Operacional por Colaborador' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1790201352093.png', target: 'bcont-plano-contas-lote-live.png', label: 'Importação de Plano de Contas em Lote' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1787679592764.png', target: 'bcont-matriz-obrigacoes-live.png', label: 'Matriz de Obrigações Tributárias' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1787667383647.png', target: 'bcont-cadastro-empresa-live.png', label: 'Cadastro e Governança de Empresas' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/8e81738c-7b95-48b9-a8f4-133ce4a170c4/.user_uploaded/media_1787638891455.png', target: 'bcont-email-smtp-live.png', label: 'Disparo de E-mails com Domínio Próprio' }
];

async function main() {
  const uploadedUrls = {};
  for (const s of realScreenshots) {
    if (fs.existsSync(s.path)) {
      const buf = fs.readFileSync(s.path);
      const storageRef = ref(storage, 'project-images/' + s.target);
      await uploadBytes(storageRef, buf, { contentType: s.path.endsWith('.jpg') ? 'image/jpeg' : 'image/png' });
      const url = await getDownloadURL(storageRef);
      uploadedUrls[s.target] = url;
      console.log('OK:', s.label, '->', url);
    } else {
      console.error('File not found:', s.path);
    }
  }
  fs.writeFileSync('tools/bcont_internal_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('Todas as telas internas reais foram enviadas!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
