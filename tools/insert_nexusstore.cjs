const fs = require('fs');
const https = require('https');

async function insertNexusStore() {
  const urls = JSON.parse(fs.readFileSync('tools/nexusstore_urls.json', 'utf8'));

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

  const mainImage = urls["nexusstore-hero-wide.png"];
  const gallery = [
    urls["nexusstore-hero-wide.png"],
    urls["nexusstore-produtos.png"],
    urls["nexusstore-diferenciais.png"],
    urls["nexusstore-canva-landing.png"],
    urls["nexusstore-acesso.png"],
    urls["nexusstore-mobile-hero.png"],
    urls["nexusstore-mobile-produtos.png"]
  ];

  const payload = {
    title: "NEXUSSTORE: E-commerce de Assinaturas Digitais com Fulfillment Automático",
    slug: "nexusstore-ecommerce-assinaturas-digitais",
    category_id: 3, // Desenvolvimento de Sites
    client: "NEXUSSTORE",
    year: 2026,
    project_url: "https://nexussstore.vercel.app/",
    main_image_url: mainImage,
    gallery_urls: gallery,
    services: [
      "Next.js 14 (App Router)",
      "React 18",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL na VPS",
      "Gateway PushinPay (PIX Imediato)",
      "Fulfillment Multi-Fornecedor API",
      "Brevo E-mails Transacionais"
    ],
    description: "Plataforma completa de e-commerce voltada para a comercialização de assinaturas digitais, licenças premium e ferramentas de inteligência artificial. Desenvolvida em Next.js 14 e Tailwind CSS com banco de dados PostgreSQL via Prisma ORM, o ecossistema automatiza 100% do fluxo transacional: desde o checkout instantâneo via PIX com PushinPay até a entrega das credenciais e links de convite via API multi-fornecedor e notificações transacionais por e-mail com Brevo.",
    challenge: "Superar a lentidão operacional e a fricção no atendimento de entregas manuais de credenciais, além de evitar rupturas de estoque causadas pela indisponibilidade de fornecedores individuais e garantir que os pagamentos via PIX resultem em ativação automática e em tempo real para o cliente final.",
    solution: "Arquitetura com roteamento inteligente e redundância multi-provedor (SellAuth e Premium Supermarket), checkout otimizado com QR Code PIX dinâmico e webhook em tempo real (PushinPay), entrega programada de licenças com painel do cliente (/acesso) para resgate transparente e disparos automatizados de e-mails transacionais com o Brevo.",
    results: "Redução do tempo de entrega de assinaturas de minutos para menos de 45 segundos após o pagamento, operação 100% automatizada e sem intervenção humana 24 horas por dia, 7 dias por semana, além de interface moderna e responsiva com landing pages de alta conversão.",
    display_order: 6,
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

insertNexusStore().catch(console.error);
