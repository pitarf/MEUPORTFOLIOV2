const fs = require('fs');

const pcUrls = JSON.parse(fs.readFileSync('tools/precocerto_urls.json', 'utf8'));

const mainImage = pcUrls['precocerto-hero-wide.png'];

const gallery = [
  pcUrls['precocerto-hero-wide.png'],
  pcUrls['precocerto-diagnostico-metodologia.png'],
  pcUrls['precocerto-publico-alvo.png'],
  pcUrls['precocerto-jornada-passos.png'],
  pcUrls['precocerto-planos-comerciais.png'],
  pcUrls['precocerto-faq.png'],
  pcUrls['precocerto-login.png'],
  pcUrls['precocerto-mobile-hero.png'],
  pcUrls['precocerto-mobile-planos.png']
];

const payload = {
  title: 'Preço Certo by BCONT: Precificação com Inteligência Fiscal, Comercial e de Compras',
  slug: 'preco-certo-by-bcont-precificacao-inteligente',
  category_id: 1, // Sistemas Web / Desenvolvimento de Sites
  client: 'BCONT (Thiago Souza & Equipe)',
  year: 2026,
  project_url: 'https://precocerto.bcontdigital.com.br/',
  main_image_url: mainImage,
  gallery_urls: gallery,
  services: [
    'React 19',
    'TypeScript',
    'TanStack Start',
    'Tailwind CSS',
    'Supabase (PostgreSQL + RLS)',
    'Inteligência Fiscal Condicional',
    'Simulação Reforma Tributária',
    'Gateway Asaas (PIX + Cartão)'
  ],
  description: 'Plataforma SaaS de engenharia de preços desenvolvida em parceria com a BCONT Contabilidade Digital. Substitui planilhas comuns por um motor matemático de markup inverso com inteligência fiscal condicional (Simples Nacional com alíquota efetiva por RBT12, Lucro Presumido e Lucro Real não cumulativo), simulação de impactos da Reforma Tributária (IBS/CBS), central de compras para negociação de fornecedores, auditoria Raio-X de margem em lote via Excel e gateway de pagamentos automatizado via Asaas.',
  challenge: 'A grande maioria das empresas erra a formação de preços por utilizar fórmulas ingênuas de markup em planilhas manuais, ignorando despesas variáveis, taxas de cartão, comissões e regras fiscais complexas (como PIS/COFINS e regimes cumulativos). Isso gera a ilusão de alto faturamento com caixa deficitário e perda silenciosa de margem de lucro.',
  solution: 'Desenvolvimento do Preço Certo by BCONT em React 19 e TanStack Start com arquitetura mobile-first adaptativa. O sistema oferece cálculo rigoroso de preço de venda e margem líquida real, central de compras que determina o custo teto de negociação com fornecedores, simulação de sensibilidade de descontos por volume, integração com a API v3 do Asaas para assinaturas automáticas e compatibilidade com a Reforma Tributária.',
  results: 'Capacidade de diagnosticar a saúde financeira de milhares de produtos em segundos via auditoria Raio-X, eliminação de vendas com prejuízo camuflado, precisão matemática na definição de preços e autonomia comercial para empresários e distribuidores negociarem com segurança.',
  display_order: 5,
  allow_image_download: true,
  main_image_aspect_ratio: '16:9',
  gallery_aspect_ratio: '16:9'
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

const url = envVars.VITE_SUPABASE_URL + '/rest/v1/projects';
const https = require('https');
const parsed = new URL(url);

const req = https.request({
  protocol: parsed.protocol,
  hostname: parsed.hostname,
  port: parsed.port,
  path: parsed.pathname + parsed.search,
  method: 'POST',
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
    console.log('Status POST Supabase:', res.statusCode);
    console.log('Resposta Supabase:', data);
  });
});

req.on('error', err => console.error('Erro na requisição:', err));
req.write(JSON.stringify(payload));
req.end();
