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
  { name: 'nexus-hero.png', path: 'tools/nexus-hero.png', target: 'nexusstore-hero-wide.png' },
  { name: 'nexus-produtos.png', path: 'tools/nexus-produtos.png', target: 'nexusstore-produtos.png' },
  { name: 'nexus-diferenciais.png', path: 'tools/nexus-diferenciais.png', target: 'nexusstore-diferenciais.png' },
  { name: 'nexus-canva-landing.png', path: 'tools/nexus-canva-landing.png', target: 'nexusstore-canva-landing.png' },
  { name: 'nexus-acesso.png', path: 'tools/nexus-acesso.png', target: 'nexusstore-acesso.png' },
  { name: 'nexus-mobile-hero.png', path: 'tools/nexus-mobile-hero.png', target: 'nexusstore-mobile-hero.png' },
  { name: 'nexus-mobile-produtos.png', path: 'tools/nexus-mobile-produtos.png', target: 'nexusstore-mobile-produtos.png' }
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
  fs.writeFileSync('tools/nexusstore_urls.json', JSON.stringify(urls, null, 2));
  console.log('Todas as 7 imagens da NEXUSSTORE foram enviadas com sucesso ao Firebase!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
