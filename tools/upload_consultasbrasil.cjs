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
  { path: 'tools/consultasbrasil-hero.png', target: 'consultasbrasil-hero-wide.png' },
  { path: 'tools/consultasbrasil-modulos.png', target: 'consultasbrasil-modulos.png' },
  { path: 'tools/consultasbrasil-como-funciona.png', target: 'consultasbrasil-como-funciona.png' },
  { path: 'tools/consultasbrasil-recarga.png', target: 'consultasbrasil-recarga.png' },
  { path: 'tools/consultasbrasil-faq.png', target: 'consultasbrasil-faq.png' },
  { path: 'tools/consultasbrasil-login.png', target: 'consultasbrasil-login.png' },
  { path: 'tools/consultasbrasil-mobile-home.png', target: 'consultasbrasil-mobile-home.png' },
  { path: 'tools/consultasbrasil-mobile-modulos.png', target: 'consultasbrasil-mobile-modulos.png' }
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
  fs.writeFileSync('tools/consultasbrasil_urls.json', JSON.stringify(urls, null, 2));
  console.log('Todas as 8 imagens do Consultas Brasil foram enviadas com sucesso ao Firebase!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
