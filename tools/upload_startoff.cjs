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
  { path: 'tools/startoff-dashboard-hero.png', target: 'startoff-dashboard-hero-wide.png' },
  { path: 'tools/startoff-ia-request.png', target: 'startoff-ia-request.png' },
  { path: 'tools/startoff-team-calendar.png', target: 'startoff-team-calendar.png' },
  { path: 'tools/startoff-team-management.png', target: 'startoff-team-management.png' },
  { path: 'tools/startoff-blocked-periods.png', target: 'startoff-blocked-periods.png' },
  { path: 'tools/startoff-login.png', target: 'startoff-login.png' },
  { path: 'tools/startoff-mobile-login.png', target: 'startoff-mobile-login.png' }
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
  fs.writeFileSync('tools/startoff_urls.json', JSON.stringify(urls, null, 2));
  console.log('Todas as 7 imagens do StartOFF foram enviadas com sucesso ao Firebase!');
}

main().catch(err => {
  console.error('Erro no upload:', err);
  process.exit(1);
});
