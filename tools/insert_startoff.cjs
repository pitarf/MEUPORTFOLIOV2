const fs = require('fs');
const https = require('https');

async function insertStartOFF() {
  const urls = JSON.parse(fs.readFileSync('tools/startoff_urls.json', 'utf8'));

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

  const mainImage = urls["startoff-dashboard-hero-wide.png"];
  const gallery = [
    urls["startoff-dashboard-hero-wide.png"],
    urls["startoff-ia-request.png"],
    urls["startoff-team-calendar.png"],
    urls["startoff-team-management.png"],
    urls["startoff-blocked-periods.png"],
    urls["startoff-login.png"],
    urls["startoff-mobile-login.png"]
  ];

  const payload = {
    title: "StartOFF: Sistema Corporativo de Gestão de Férias com IA e Concorrência de Turnos",
    slug: "startoff-gestao-corporativa-de-ferias-ia",
    category_id: 3, // Desenvolvimento de Sites / Sistemas Web
    client: "StartOFF / Transpetro Petrobras",
    year: 2026,
    project_url: "https://startoff.rafaelpitaoficial.com.br/",
    main_image_url: mainImage,
    gallery_urls: gallery,
    services: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "Node.js & Express 5",
      "Sequelize ORM",
      "PostgreSQL",
      "Algoritmo de IA Heurística para Datas",
      "Controle de Concorrência de Turnos & Papéis"
    ],
    description: "Sistema corporativo web de alta fidelidade desenvolvido sob diretrizes visuais e operacionais da Transpetro para gestão inteligente de férias e afastamentos de equipes offshore e operacionais. A plataforma elimina conflitos de escala, valida saldos em tempo real e utiliza motor de recomendação inteligente que sugere períodos de folga otimizados (emendas com feriados e finais de semana) sem comprometer a capacidade operacional mínima por função.",
    challenge: "Gerenciar escalas de férias em operações industriais e marítimas críticas sem gerar defasagem em postos de trabalho essenciais (motoristas, operadores e líderes de turno), além de eliminar planilhas descentralizadas e resolver gargalos de aprovação entre gestores e colaboradores.",
    solution: "Desenvolvimento de uma aplicação web robusta com React 19 e Tailwind CSS conectada a API Node.js e banco PostgreSQL via Sequelize. O sistema inclui controle de acesso por níveis (Colaborador, Gestor e Administrador), bloqueio parametrizado de períodos críticos de recesso, motor inteligente de sugestão de datas com pontuação de atratividade e catálogo dinâmico de funções para evitar sobreposição de especialistas no mesmo turno.",
    results: "Redução a zero de conflitos de escala em turnos simultâneos, aprovação descentralizada de solicitações em poucos cliques com visualização em calendário interativo corporativo e satisfação máxima dos colaboradores através da sugestão inteligente de períodos com emenda de feriados.",
    display_order: 7,
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

insertStartOFF().catch(console.error);
