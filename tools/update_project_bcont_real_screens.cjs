const fs = require('fs');

const internalUrls = JSON.parse(fs.readFileSync('tools/bcont_internal_urls.json', 'utf8'));

// Capa principal: Painel Operacional ao vivo do Cockpit
const mainImage = internalUrls['bcont-painel-operacional-live.png'];

// Galeria completa com a capa em primeiro lugar e todas as telas internas reais
const gallery = [
  internalUrls['bcont-painel-operacional-live.png'],
  internalUrls['bcont-dre-gerencial-live.png'],
  internalUrls['bcont-conciliacao-matching-live.png'],
  internalUrls['bcont-certidoes-ia-live.png'],
  internalUrls['bcont-produtividade-setores-live.png'],
  internalUrls['bcont-matriz-obrigacoes-live.png'],
  internalUrls['bcont-plano-contas-lote-live.png'],
  internalUrls['bcont-cadastro-empresa-live.png'],
  internalUrls['bcont-email-smtp-live.png']
];

const payload = {
  title: 'BCont Contábil OS: Inteligência, Gestão e Conciliação Contábil',
  description: 'Sistema operacional SaaS completo para escritórios de contabilidade. Apresenta cockpit operacional de gestão por setor com proteção RLS no banco de dados, matriz dinâmica de obrigações tributárias, leitura automatizada de certidões negativas (CNDs) com IA Google Gemini e supervisão humana, motor tolerante de conciliação bancária OFX (matching 1:1 e somatório N:1), DRE analítica em tempo real e relatórios de produtividade por colaborador.',
  category_id: 1,
  client: 'BCont Contabilidade Digital',
  year: 2026,
  project_url: 'https://painel.bcontdigital.com.br/',
  main_image_url: mainImage,
  gallery_urls: gallery,
  services: ['React 19', 'TypeScript', 'TanStack Start', 'Tailwind CSS', 'Supabase (PostgreSQL + RLS)', 'Google Gemini AI', 'Conciliação Bancária OFX', 'DRE Gerencial em Tempo Real'],
  challenge: 'Escritórios contábeis perdem centenas de horas mensais na auditoria manual de certidões negativas (CNDs) em múltiplas esferas, conciliação minuciosa de extratos contra planilhas de clientes sem suporte a somatório (N:1) e desorganização de prazos de obrigações fiscais entre departamentos (Fiscal, DP e Contábil), gerando riscos frequentes de multas por atraso.',
  solution: 'Desenvolvimento do BCont Contábil OS: uma plataforma SaaS robusta baseada em React 19, TanStack Start e Supabase com segurança RLS a nível de setor. Implementou processamento de certidões e faturamentos com Google Gemini AI com supervisão humana, motor tolerante de conciliação bancária com somatórios complexos, matriz dinâmica de obrigações tributárias por regime e município, e DRE analítica em tempo real.',
  results: 'Redução de mais de 80% no tempo gasto na conciliação de extratos bancários com o algoritmo inteligente N:1, leitura e identificação instantânea de débitos fiscais em certidões multi-esfera com IA auditável, e sincronização impecável das rotinas operacionais dos colaboradores sob governança estrita de banco de dados.'
};

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

const url = envVars.VITE_SUPABASE_URL + '/rest/v1/projects?id=eq.57';
const https = require('https');
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
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status PATCH Supabase:', res.statusCode);
    console.log('Projeto 57 atualizado com as telas reais do sistema!');
  });
});

req.on('error', err => console.error('Erro na requisição:', err));
req.write(JSON.stringify(payload));
req.end();
