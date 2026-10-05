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
  { path: 'tools/vorixa-hero.png', target: 'vorixa-hero-wide.png' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/28b816e0-fe12-4990-9c20-d62c507a3bb3/vorixa_hero_cinematic_1787458464543.jpg', target: 'vorixa-studio-neural.jpg' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/28b816e0-fe12-4990-9c20-d62c507a3bb3/vorixa_avatar_presenter_1787458565840.jpg', target: 'vorixa-avatar-presenter.jpg' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/28b816e0-fe12-4990-9c20-d62c507a3bb3/vorixa_commercial_perfume_1787458507906.jpg', target: 'vorixa-commercial-perfume.jpg' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/28b816e0-fe12-4990-9c20-d62c507a3bb3/vorixa_editorial_fashion_1787458685942.jpg', target: 'vorixa-editorial-fashion.jpg' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/28b816e0-fe12-4990-9c20-d62c507a3bb3/vorixa_hypercar_cyberpunk_1787458534501.jpg', target: 'vorixa-hypercar-cyberpunk.jpg' },
  { path: 'C:/Users/rfpit/.gemini/antigravity/brain/28b816e0-fe12-4990-9c20-d62c507a3bb3/vorixa_street_dancer_1787458601122.jpg', target: 'vorixa-street-dancer.jpg' },
  { path: 'tools/vorixa-planos.png', target: 'vorixa-planos.png' },
  { path: 'tools/vorixa-login.png', target: 'vorixa-login.png' },
  { path: 'tools/vorixa-mobile-home.png', target: 'vorixa-mobile-home.png' }
];

async function main() {
  const urls = {};
  for (const f of files) {
    const buffer = fs.readFileSync(f.path);
    const contentType = f.target.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const storageRef = ref(storage, 'project-images/' + f.target);
    await uploadBytes(storageRef, buffer, { contentType });
    const downloadURL = await getDownloadURL(storageRef);
    urls[f.target] = downloadURL;
    console.log('Uploaded:', f.target, '->', downloadURL);
  }
  fs.writeFileSync('tools/vorixa_urls.json', JSON.stringify(urls, null, 2));
  console.log('Todas as 10 imagens da VORTIXIA / VORIXA foram enviadas com sucesso ao Firebase!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
