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

const files = [
  { name: 'pc-hero.png', path: 'tools/pc-hero.png', target: 'precocerto-hero-wide.png' },
  { name: 'pc-diagnostico-metodologia.png', path: 'tools/pc-diagnostico-metodologia.png', target: 'precocerto-diagnostico-metodologia.png' },
  { name: 'pc-publico-alvo.png', path: 'tools/pc-publico-alvo.png', target: 'precocerto-publico-alvo.png' },
  { name: 'pc-jornada-passos.png', path: 'tools/pc-jornada-passos.png', target: 'precocerto-jornada-passos.png' },
  { name: 'pc-planos-comerciais.png', path: 'tools/pc-planos-comerciais.png', target: 'precocerto-planos-comerciais.png' },
  { name: 'pc-faq.png', path: 'tools/pc-faq.png', target: 'precocerto-faq.png' },
  { name: 'pc-login.png', path: 'tools/pc-login.png', target: 'precocerto-login.png' },
  { name: 'pc-mobile-hero.png', path: 'tools/pc-mobile-hero.png', target: 'precocerto-mobile-hero.png' },
  { name: 'pc-mobile-planos.png', path: 'tools/pc-mobile-planos.png', target: 'precocerto-mobile-planos.png' }
];

async function main() {
  const urls = {};
  for (const f of files) {
    const buffer = fs.readFileSync(f.path);
    const storageRef = ref(storage, 'project-images/' + f.target);
    await uploadBytes(storageRef, buffer, { contentType: 'image/png' });
    const downloadURL = await getDownloadURL(storageRef);
    urls[f.target] = downloadURL;
    console.log('Uploaded:', f.target, '->', downloadURL);
  }
  fs.writeFileSync('tools/precocerto_urls.json', JSON.stringify(urls, null, 2));
  console.log('Todas as 9 imagens de Preço Certo enviadas com sucesso ao Firebase!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
