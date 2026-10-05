const fs = require('fs');
const https = require('https');

async function insertVorixa() {
  const urls = JSON.parse(fs.readFileSync('tools/vorixa_urls.json', 'utf8'));

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

  const mainImage = urls["vorixa-hero-wide.png"];
  const gallery = [
    urls["vorixa-hero-wide.png"],
    urls["vorixa-studio-neural.jpg"],
    urls["vorixa-avatar-presenter.jpg"],
    urls["vorixa-commercial-perfume.jpg"],
    urls["vorixa-editorial-fashion.jpg"],
    urls["vorixa-hypercar-cyberpunk.jpg"],
    urls["vorixa-street-dancer.jpg"],
    urls["vorixa-planos.png"],
    urls["vorixa-login.png"],
    urls["vorixa-mobile-home.png"]
  ];

  const payload = {
    title: "VORIXA AI (VORTIXIA): Estúdio de Criação Audiovisual com Modelos Virtuais e Vídeos Virais",
    slug: "vorixa-vortixia-estudio-audiovisual-ia-generativa",
    category_id: 3, // Desenvolvimento de Sites / Sistemas Web
    client: "VORIXA AI / VORTIXIA Studio",
    year: 2026,
    project_url: "https://vortixia.com.br/",
    main_image_url: mainImage,
    gallery_urls: gallery,
    services: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "PostgreSQL & Prisma ORM",
      "Integração fal.ai & Kling 3.0",
      "Node-based Flow Builder (@xyflow/react)",
      "Gateway VorexPay (PIX Imediato)",
      "Sync Audio LipSync & Master Prompts"
    ],
    description: "Plataforma SaaS de última geração de inteligência artificial generativa audiovisual. Permite que criadores e marcas desenvolvam modelos virtuais ultra-realistas com fotos de perfil e corpo todo, comercializem Master Prompts fotográficos exclusivos via créditos e gerem vídeos virais sincronizados com áudio natural em português (LipSync) sem necessidade de filmagens presenciais ou estúdios físicos.",
    challenge: "Superar a barreira de produção audiovisual tradicional e a dependência de assinaturas múltiplas em moeda estrangeira, viabilizando geração de vídeos com sincronia labial precisa, catálogos consistentes de modelos virtuais brasileiros e cobrança acessível em moeda nacional com liquidação instantânea.",
    solution: "Arquitetura Next.js 16 de alta performance conectada a motores de IA generativa de ponta (Kling 3.0, Wan 2.1, Sync Audio via fal.ai), editor visual em nós conectáveis com @xyflow/react, marketplace de 30 modelos fotorrealistas categorizados com fotos em pares (perfil e corpo todo) e venda de Master Prompts com transações atômicas seguras via VorexPay.",
    results: "Redução de até 90% no custo e tempo de produção de anúncios e conteúdos comerciais para mídias sociais, geração de avatares com fidelidade cinematográfica em 8K e experiência fluida de compra e renderização em menos de 2 minutos.",
    display_order: 9,
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

insertVorixa().catch(console.error);
