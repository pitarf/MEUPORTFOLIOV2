const fs = require('fs');
const https = require('https');

async function insertConsultasBrasil() {
  const urls = JSON.parse(fs.readFileSync('tools/consultasbrasil_urls.json', 'utf8'));

  const env = fs.readFileSync('.env', 'utf8');
  const envVars = {};
  env.split('\n').forEach(l => {
    const match = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = (match[2] || '').trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      envVars[match[1]] = val.trim();
    }
  });

  const mainImage = urls["consultasbrasil-hero-wide.png"];
  const gallery = [
    urls["consultasbrasil-hero-wide.png"],
    urls["consultasbrasil-modulos.png"],
    urls["consultasbrasil-como-funciona.png"],
    urls["consultasbrasil-recarga.png"],
    urls["consultasbrasil-faq.png"],
    urls["consultasbrasil-login.png"],
    urls["consultasbrasil-mobile-home.png"],
    urls["consultasbrasil-mobile-modulos.png"]
  ];

  const payload = {
    title: "Consultas Brasil: Plataforma Inteligente de Dados Cadastrais com PIX e SEO Avançado",
    slug: "consultas-brasil-plataforma-dados-cadastrais-pix",
    category_id: 3, // Desenvolvimento de Sites / Sistemas Web
    client: "Consultas Brasil Data Intelligence",
    year: 2026,
    project_url: "https://consultasbrasil.net/",
    main_image_url: mainImage,
    gallery_urls: gallery,
    services: [
      "Next.js 16 (App Router + Turbopack)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "PostgreSQL & Prisma ORM",
      "Gateway PushinPay (PIX < 100ms)",
      "DirectData API V2 & V3",
      "SEO Semântico Avançado & Google Search Console"
    ],
    description: "Plataforma SaaS moderna de inteligência cadastral e background check desenvolvida em Next.js 16 e Tailwind CSS v4. Permite pesquisas unificadas de CPF, CNPJ, telefone, placa veicular e nome com modelo pré-pago sem mensalidades fixas. O sistema conta com motor de checkout instantâneo via PIX com webhook em menos de 100ms via PushinPay, integração de dados cadastrais oficiais e arquitetura de SEO semântico de alta densidade aprovada para indexação orgânica no Google.",
    challenge: "Construir uma solução de inteligência de dados ágil que substituísse assinaturas corporativas caras e burocráticas por um modelo de pagamento avulso por módulo consultado, garantindo resposta quase instantânea nos webhooks de pagamento (timeout de 2s) e ranqueamento orgânico em buscas disputadas de consultas cadastrais.",
    solution: "Desenvolvimento com Next.js 16 App Router, Turbopack e Prisma ORM sobre PostgreSQL. Implementação de consultas modulares fracionadas (dados cadastrais, empresas, veículos, telefones e score) com cache inteligente para buscas repetidas sem bitributação, liquidação imediata via PushinPay com transações atômicas seguras, modo claro/escuro nativo e otimização completa de H1, entidades semânticas, FAQ e metadados Open Graph.",
    results: "Redução drástica do custo de pesquisa cadastral para profissionais e empresas, ativação imediata de créditos via PIX em menos de 1 segundo e indexação orgânica sólida no Google Search Console com carregamento ultra-rápido.",
    display_order: 8,
    allow_image_download: true,
    main_image_aspect_ratio: "16:9",
    gallery_aspect_ratio: "16:9"
  };

  const parsed = new URL(envVars.VITE_SUPABASE_URL + '/rest/v1/projects');

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
}

insertConsultasBrasil().catch(console.error);
