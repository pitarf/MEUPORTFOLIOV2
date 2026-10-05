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

const projectsToUpdate = [57, 58];

async function updateCategory(projectId) {
  return new Promise((resolve, reject) => {
    const url = envVars.VITE_SUPABASE_URL + '/rest/v1/projects?id=eq.' + projectId;
    const parsed = new URL(url);

    const req = https.request({
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: 'PATCH',
      headers: {
        'apikey': envVars.VITE_SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + envVars.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Projeto ${projectId} atualizado para category_id 3. Status:`, res.statusCode);
        resolve(data);
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ category_id: 3 }));
    req.end();
  });
}

(async () => {
  for (const id of projectsToUpdate) {
    await updateCategory(id);
  }
  console.log('Todos os projetos corrigidos para Desenvolvimento de Sites!');
})();
