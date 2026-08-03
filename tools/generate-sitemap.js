import fs from 'fs';
import path from 'path';

const domain = 'https://rafaelpitaoficial.com.br';

async function generate() {
    console.log('Iniciando geração dinâmica do sitemap.xml...');
    
    // Rotas estáticas
    const staticRoutes = [
        { path: '', priority: '1.0', changefreq: 'monthly' },
        { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
        { path: '/servicos', priority: '0.8', changefreq: 'monthly' },
        { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
        { path: '/assinaturas', priority: '0.8', changefreq: 'monthly' },
        { path: '/portfolio-fotografia', priority: '0.8', changefreq: 'weekly' },
        { path: '/portfolio-fotografia/galeria', priority: '0.7', changefreq: 'weekly' },
        { path: '/avaliacoes', priority: '0.7', changefreq: 'weekly' },
        { path: '/contato', priority: '0.8', changefreq: 'monthly' },
        
        // As 7 novas páginas específicas de serviços
        { path: '/criacao-de-sites', priority: '0.9', changefreq: 'monthly' },
        { path: '/landing-pages', priority: '0.9', changefreq: 'monthly' },
        { path: '/desenvolvimento-de-sistemas', priority: '0.9', changefreq: 'monthly' },
        { path: '/automacoes', priority: '0.9', changefreq: 'monthly' },
        { path: '/dashboards-power-bi', priority: '0.9', changefreq: 'monthly' },
        { path: '/fotografia-eventos', priority: '0.8', changefreq: 'monthly' },
        { path: '/fotografia-corporativa', priority: '0.8', changefreq: 'monthly' }
    ];

    const urls = [...staticRoutes];

    let supabaseUrl = process.env.VITE_SUPABASE_URL;
    let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    try {
        if (!supabaseUrl || !supabaseAnonKey) {
            // Tenta ler o .env do projeto local se não estiver no process.env
            const envPath = path.resolve('.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const env = {};
                envContent.split('\n').forEach(line => {
                    const parts = line.split('=');
                    if (parts.length >= 2) {
                        env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, '');
                    }
                });
                supabaseUrl = supabaseUrl || env.VITE_SUPABASE_URL;
                supabaseAnonKey = supabaseAnonKey || env.VITE_SUPABASE_ANON_KEY;
            }
        }

        if (supabaseUrl && supabaseAnonKey) {
            // Efetua chamada REST HTTP para buscar todos os projetos cadastrados
            const res = await fetch(`${supabaseUrl}/rest/v1/projects?select=slug,category:categories(slug)&order=display_order.asc,created_at.desc`, {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`
                }
            });

            if (res.ok) {
                const projects = await res.json();
                projects.forEach(proj => {
                    const catSlug = proj.category?.slug || 'geral';
                    if (catSlug !== 'fotografia') {
                        urls.push({
                            path: `/portfolio/${catSlug}/${proj.slug}`,
                            priority: '0.6',
                            changefreq: 'weekly'
                        });
                    }
                });
                console.log(`Sucesso: ${projects.length} projetos dinâmicos adicionados ao sitemap.`);
            } else {
                console.warn('Aviso: Falha ao carregar projetos do Supabase para o sitemap. Status:', res.status);
            }
        } else {
            console.warn('Aviso: Credenciais do Supabase não encontradas no ambiente (process.env) ou no arquivo .env.');
        }
    } catch (error) {
        console.error('Erro na conexão com o banco de dados durante a geração do sitemap:', error.message);
    }

    // Gera o XML
    const lastmod = new Date().toISOString().split('T')[0];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(route => {
        xml += '  <url>\n';
        xml += `    <loc>${domain}${route.path}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>\n';

    // Salva o sitemap na pasta public
    const outputPath = path.resolve('public/sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf8');
    console.log(`Sitemap gerado com sucesso em: ${outputPath}`);
}

generate().catch(err => {
    console.error('Falha crítica na geração do sitemap:', err);
    process.exit(0);
});
