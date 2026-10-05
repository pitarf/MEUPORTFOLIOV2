const fs = require('fs');
const https = require('https');

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

const url = envVars.VITE_SUPABASE_URL + '/rest/v1/categories?select=*';
const parsed = new URL(url);

https.get({
  protocol: parsed.protocol,
  hostname: parsed.hostname,
  port: parsed.port,
  path: parsed.pathname + parsed.search,
  headers: {
    'apikey': envVars.VITE_SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + envVars.VITE_SUPABASE_ANON_KEY
  }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log('Categorias:', data));
});
