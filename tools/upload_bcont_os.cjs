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
  { name: 'painel-hero.png', path: 'tools/painel-hero.png', target: 'bcont-os-hero-wide.png' },
  { name: 'painel-recursos.png', path: 'tools/painel-recursos.png', target: 'bcont-os-recursos.png' },
  { name: 'painel-ia.png', path: 'tools/painel-ia.png', target: 'bcont-os-ia-gemini.png' },
  { name: 'painel-conciliacao.png', path: 'tools/painel-conciliacao.png', target: 'bcont-os-conciliacao.png' },
  { name: 'painel-auth.png', path: 'tools/painel-auth.png', target: 'bcont-os-auth.png' },
  { name: 'painel-mobile-hero.png', path: 'tools/painel-mobile-hero.png', target: 'bcont-os-mobile-hero.png' },
  { name: 'painel-mobile-preview.png', path: 'tools/painel-mobile-preview.png', target: 'bcont-os-mobile-preview.png' }
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
  fs.writeFileSync('tools/bcont_os_urls.json', JSON.stringify(urls, null, 2));
  console.log('Todas as 7 imagens do BCont OS enviadas com sucesso!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
