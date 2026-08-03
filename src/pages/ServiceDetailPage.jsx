import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SEO from '@/components/SEO';
import { 
    ArrowRight, 
    CheckCircle2, 
    HelpCircle, 
    MessageSquare, 
    Star, 
    Zap, 
    FileText, 
    ArrowLeft, 
    Loader2, 
    ChevronDown, 
    ChevronUp,
    Code,
    Layers,
    Bot,
    BarChart3,
    Camera,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Conteúdo fixo e otimizado para os 7 serviços (Copy, Benefícios, FAQ, SEO Local)
const SERVICES_DATA = {
    'criacao-de-sites': {
        title: 'Criação de Sites Profissionais e de Alta Conversão',
        categorySlug: 'desenvolvimento-web',
        icon: Code,
        color: 'from-green-500 to-emerald-600',
        seoTitle: 'Criação de Sites RJ | Desenvolvimento Web Profissional | Pita Solutions',
        seoDesc: 'Desenvolvemos sites profissionais, responsivos e ultra-rápidos com foco em vendas e posicionamento no Google. Solicite seu orçamento de criação de sites no Rio de Janeiro.',
        seoKeywords: 'criacao de sites rj, desenvolvimento de sites rio de janeiro, criar site profissional rj, desenvolvedor front-end rj, programador rio de janeiro',
        schemaType: 'ProfessionalService',
        description: 'Desenvolvimento de websites modernos, focados em gerar autoridade e vendas para o seu negócio no Rio de Janeiro. Criamos projetos sob medida, 100% responsivos e otimizados para os motores de busca (SEO).',
        benefits: [
            { title: 'Design Exclusivo e Premium', desc: 'Layouts modernos e personalizados que transmitem credibilidade e encantam seus clientes.' },
            { title: 'Velocidade de Carregamento', desc: 'Sites otimizados no Lighthouse para carregar em milissegundos, reduzindo a taxa de rejeição.' },
            { title: 'SEO Estruturado desde a Base', desc: 'Código limpo e semântico preparado para ranquear nas primeiras posições do Google e Bing.' },
            { title: 'Responsividade Impecável', desc: 'Navegação fluida e perfeita em smartphones, tablets e computadores.' }
        ],
        faq: [
            { q: 'Quanto tempo demora para criar um site?', a: 'O prazo médio para entrega de um site institucional profissional varia entre 15 e 30 dias úteis, dependendo da complexidade do projeto e da entrega do conteúdo.' },
            { q: 'O site terá painel de gerenciamento?', a: 'Sim! Integramos painéis administrativos sob medida (ou WordPress/Supabase dependendo do escopo) para que você edite textos, banners e imagens sem precisar de conhecimento técnico.' },
            { q: 'O site já vem com certificado de segurança SSL?', a: 'Sim, todos os sites desenvolvidos pela Pita Solutions possuem certificado SSL (HTTPS) ativado, garantindo segurança e melhor classificação no Google.' }
        ],
        localContext: 'Ideal para empresas da Penha, Barra da Tijuca, Centro e demais regiões do Rio de Janeiro que buscam dominar as pesquisas locais do Google.',
        projectFilter: (p) => {
            const servicesStr = (p.services || []).map(s => s.toLowerCase());
            const title = (p.title || '').toLowerCase();
            return !servicesStr.includes('landing page') && !title.includes('sistema') && !title.includes('dashboard') && !title.includes('bot');
        }
    },
    'landing-pages': {
        title: 'Landing Pages Otimizadas para Campanhas de Tráfego Pago',
        categorySlug: 'desenvolvimento-web',
        icon: Layers,
        color: 'from-blue-500 to-indigo-600',
        seoTitle: 'Landing Pages de Alta Conversão RJ | Pita Solutions',
        seoDesc: 'Landing pages premium focadas em converter visitantes em clientes. Otimizadas para Google Ads e Meta Ads no Rio de Janeiro. Solicite sua página de vendas.',
        seoKeywords: 'landing page rj, criar landing page de alta conversao, landing page para trafego pago rj, pagina de vendas profissional rj',
        schemaType: 'ProfessionalService',
        description: 'Páginas de vendas de alta performance focadas em um único objetivo: converter visitantes em leads ou vendas diretas. Essencial para alavancar os resultados dos seus anúncios patrocinados no RJ.',
        benefits: [
            { title: 'Foco Absoluto em Conversão', desc: 'Design e copy estruturados estrategicamente para capturar o contato do cliente instantaneamente.' },
            { title: 'Otimização para Anúncios', desc: 'Carregamento extremamente rápido para reduzir a perda de cliques nas campanhas do Google e Facebook.' },
            { title: 'Copywriting Persuasiva', desc: 'Textos escritos sob medida focados na quebra de objeções e persuasão do público-alvo.' },
            { title: 'Integrações Automatizadas', desc: 'Receba leads direto no seu WhatsApp, E-mail ou sistemas de CRM de forma instantânea.' }
        ],
        faq: [
            { q: 'Por que preciso de uma Landing Page em vez de um site?', a: 'Diferente de um site institucional com múltiplos links, a Landing Page tem apenas uma saída: a conversão. Isso reduz a dispersão do usuário e pode aumentar suas conversões em anúncios em até 300%.' },
            { q: 'Vocês criam os textos da página?', a: 'Sim! Nosso time desenvolve toda a redação publicitária (copywriting) com base em um briefing detalhado do seu negócio e público-alvo.' },
            { q: 'A página é integrada ao Pixel do Facebook e Google Tag Manager?', a: 'Sim, realizamos todas as configurações de rastreamento de conversão para que suas campanhas de tráfego pago funcionem perfeitamente.' }
        ],
        localContext: 'Acelere as vendas do seu negócio físico ou digital no Rio de Janeiro com páginas otimizadas para tráfego regional.',
        projectFilter: (p) => {
            const servicesStr = (p.services || []).map(s => s.toLowerCase());
            const title = (p.title || '').toLowerCase();
            return servicesStr.includes('landing page') || servicesStr.includes('landingpage') || title.includes('landing');
        }
    },
    'desenvolvimento-de-sistemas': {
        title: 'Desenvolvimento de Sistemas e Softwares Corporativos',
        categorySlug: 'desenvolvimento-web',
        icon: Code,
        color: 'from-purple-500 to-indigo-600',
        seoTitle: 'Desenvolvimento de Sistemas e Softwares RJ | Pita Solutions',
        seoDesc: 'Desenvolvimento de sistemas web sob medida, CRMs, ERPs e portais corporativos para automatizar a gestão do seu negócio no Rio de Janeiro. Solicite uma proposta.',
        seoKeywords: 'desenvolvimento de sistemas rj, desenvolvedor de software rio de janeiro, sistemas sob medida rj, criacao de sistemas comerciais rj',
        schemaType: 'ProfessionalService',
        description: 'Sistemas e softwares sob medida criados para resolver problemas específicos do seu negócio. Automatize processos manuais, integre setores e gerencie seus dados com painéis executivos seguros.',
        benefits: [
            { title: 'Customização Completa', desc: 'Diga adeus a ferramentas genéricas. Desenvolvemos o sistema exatamente do jeito que a sua gestão exige.' },
            { title: 'Arquitetura Moderna e Segura', desc: 'Utilizamos tecnologias de ponta e bancos de dados criptografados para total proteção das informações.' },
            { title: 'Automatização de Rotinas', desc: 'Reduza erros manuais integrando fluxos de trabalho, notas fiscais e controle de estoques.' },
            { title: 'Multiplataforma de Elite', desc: 'Acesse o sistema com segurança de qualquer dispositivo (desktop, tablet ou mobile).' }
        ],
        faq: [
            { q: 'Quais tecnologias são utilizadas no desenvolvimento?', a: 'Nossos sistemas são construídos com React no frontend, Node.js/Vite no backend e Supabase/PostgreSQL no banco de dados. Isso garante altíssima velocidade, estabilidade e segurança.' },
            { q: 'Como é feito o suporte do sistema?', a: 'Oferecemos planos de suporte contínuo e evolução do sistema pós-entrega, incluindo monitoramento de servidores e atualizações de segurança.' },
            { q: 'Vocês integram com sistemas legados da empresa?', a: 'Sim, analisamos as APIs dos seus sistemas antigos para criar integrações e sincronizar dados em lote.' }
        ],
        localContext: 'Segurança corporativa e tecnologia escalável para impulsionar negócios no Rio de Janeiro.',
        projectFilter: (p) => {
            const title = (p.title || '').toLowerCase();
            const servicesStr = (p.services || []).map(s => s.toLowerCase());
            return title.includes('sistema') || title.includes('gestão') || title.includes('plataforma') || servicesStr.includes('sistema web');
        }
    },
    'automacoes': {
        title: 'Automação de Processos, APIs e Chatbots Inteligentes',
        categorySlug: 'videos-com-ia',
        icon: Bot,
        color: 'from-violet-500 to-purple-650',
        seoTitle: 'Automação de Processos e Chatbots RJ | Pita Solutions',
        seoDesc: 'Automatize o atendimento e os fluxos de trabalho da sua empresa no RJ. Chatbots inteligentes para WhatsApp, integrações de APIs e bots customizados.',
        seoKeywords: 'automacao de processos rj, chatbots whatsapp rj, integrar apis rio de janeiro, automacao comercial rj, bots de atendimento',
        schemaType: 'ProfessionalService',
        description: 'Elimine tarefas repetitivas e configure assistentes virtuais para atender seus clientes 24 horas por dia. Integramos suas ferramentas para criar fluxos de trabalho automáticos e inteligentes.',
        benefits: [
            { title: 'Atendimento 24h Automatizado', desc: 'Responda instantaneamente seus leads no WhatsApp e filtre os contatos antes de repassar ao humano.' },
            { title: 'Integrações de APIs Complexas', desc: 'Conecte planilhas, CRMs, e-mails e gateways de pagamento para trabalharem em sincronia.' },
            { title: 'Economia de Tempo e Escala', desc: 'Deixe as tarefas mecânicas com os robôs e foque sua equipe na estratégia e fechamento de vendas.' },
            { title: 'Disparo de Alertas e Notificações', desc: 'Envie status de entrega, lembretes de cobrança e mensagens de engajamento de forma autônoma.' }
        ],
        faq: [
            { q: 'Os chatbots no WhatsApp são seguros e oficiais?', a: 'Sim, trabalhamos tanto com integrações via API oficial (Cloud API) para empresas com alto volume, quanto com integrações adaptadas para cenários mais ágeis, respeitando os termos para evitar bloqueios.' },
            { q: 'Consigo integrar minhas planilhas do Google?', a: 'Com certeza! Conseguimos salvar dados, ler informações e disparar mensagens automáticas a partir de qualquer alteração nas planilhas do Google.' },
            { q: 'Preciso deixar meu computador ligado?', a: 'Não. Todas as automações criadas pela Pita Solutions rodam em servidores na nuvem (Cloud) de forma contínua, sem interrupções.' }
        ],
        localContext: 'Modernização operacional de processos para comércios, imobiliárias e prestadores de serviços no Rio de Janeiro.',
        projectFilter: (p) => {
            const title = (p.title || '').toLowerCase();
            const servicesStr = (p.services || []).map(s => s.toLowerCase());
            return title.includes('bot') || title.includes('automação') || title.includes('ia') || servicesStr.includes('integração') || servicesStr.includes('automação');
        }
    },
    'dashboards-power-bi': {
        title: 'Consultoria de Business Intelligence e Painéis no Power BI',
        categorySlug: 'dashboards-power-bi',
        icon: BarChart3,
        color: 'from-yellow-500 to-amber-600',
        seoTitle: 'Consultoria Power BI RJ | Dashboards de Negócios | Pita Solutions',
        seoDesc: 'Consultoria especializada em Power BI no Rio de Janeiro. Transforme dados complexos de vendas e finanças em dashboards interativos para decisões assertivas.',
        seoKeywords: 'consultoria power bi rj, dashboards power bi rio de janeiro, analise de dados corporativa, paineis executivos bi rj, analista de dados rj',
        schemaType: 'ProfessionalService',
        description: 'Consultoria e engenharia de dados completa. Transformamos pilhas de planilhas e bancos de dados isolados em painéis interativos visualmente incríveis, permitindo decisões executivas baseadas em fatos.',
        benefits: [
            { title: 'Visibilidade de Indicadores (KPIs)', desc: 'Tenha o controle de vendas, custos, margens e metas consolidadas em uma única tela ao vivo.' },
            { title: 'Filtros e Relatórios Dinâmicos', desc: 'Explore os dados clicando nos gráficos para descobrir padrões, gargalos e oportunidades de venda.' },
            { title: 'Conexão Híbrida de Dados', desc: 'Reúna informações de bancos de dados SQL, ERPs, planilhas e arquivos PDF de forma centralizada.' },
            { title: 'Decisões Rápidas e Seguras', desc: 'Substitua relatórios em papel ou planilhas confusas por visualizações claras que poupam tempo da gestão.' }
        ],
        faq: [
            { q: 'Preciso ter licença paga do Power BI?', a: 'Para relatórios individuais ou compartilhados publicamente, não. Para compartilhamento seguro de painéis entre equipes específicas da empresa, o Power BI Pro (Microsoft) é recomendado, mas analisamos a opção ideal para seu orçamento.' },
            { q: 'Como meus dados se atualizam?', a: 'Configuramos gateways de atualização automática. Seus dados do ERP ou planilha são lidos e atualizados nos dashboards nos horários definidos pela sua equipe.' },
            { q: 'Vocês prestam serviço de modelagem de dados?', a: 'Sim, realizamos desde a extração e limpeza dos dados (ETL), modelagem dimensional (Star Schema) até a criação do layout premium final.' }
        ],
        localContext: 'Dashboards executivos de inteligência de dados para tomada de decisão no mercado do Rio de Janeiro.',
        projectFilter: (p) => true // Todos os projetos dessa categoria no Supabase
    },
    'fotografia-eventos': {
        title: 'Cobertura Fotográfica de Eventos Corporativos e Sociais',
        categorySlug: 'fotografia',
        icon: Camera,
        color: 'from-cyan-500 to-blue-600',
        seoTitle: 'Fotógrafo de Eventos RJ | Cobertura Fotográfica Profissional | Pita',
        seoDesc: 'Fotografia profissional de eventos corporativos, palestras, conferências e eventos sociais no Rio de Janeiro. Fotos premium espontâneas e ágeis.',
        seoKeywords: 'fotografo de eventos rj, cobertura fotografica rio de janeiro, fotos de eventos corporativos rj, fotografo profissional rj, fotografo penha',
        schemaType: 'LocalBusiness',
        description: 'Cobertura fotográfica de alto impacto para eventos empresariais, palestras, inaugurações, congressos e festas corporativas no Rio de Janeiro. Registros dinâmicos que fortalecem o branding do seu negócio.',
        benefits: [
            { title: 'Equipamento de Cinema', desc: 'Lentes e câmeras de alta performance que garantem nitidez absurda em qualquer iluminação.' },
            { title: 'Olhar Técnico e Espontâneo', desc: 'Captura de emoções reais, conexões de networking e momentos chaves do seu evento de forma natural.' },
            { title: 'Entrega Digital de Alta Velocidade', desc: 'Suas fotos tratadas e organizadas em galeria na nuvem para download imediato em alta resolução.' },
            { title: 'Edição de Cores Profissional', desc: 'Tratamento de cores uniforme alinhado à sobriedade e refinamento do seu evento.' }
        ],
        faq: [
            { q: 'Qual o prazo de entrega das fotos do evento?', a: 'Entregamos uma prévia de 5 a 10 fotos no dia seguinte para suas redes sociais. A galeria completa tratada é entregue em até 5 dias úteis.' },
            { q: 'Como as fotos são entregues?', a: 'Através de uma galeria online premium e segura. Você recebe um link exclusivo de alta velocidade, protegido por senha, ideal para compartilhar com a equipe e convidados.' },
            { q: 'Vocês emitem nota fiscal corporativa?', a: 'Sim, emitimos nota fiscal para todos os serviços contratados por empresas no Rio de Janeiro.' }
        ],
        localContext: 'Cobertura fotográfica profissional na Zona Norte, Zona Sul, Barra da Tijuca e Centro do Rio de Janeiro.',
        projectFilter: (p) => {
            const servicesStr = (p.services || []).map(s => s.toLowerCase());
            const title = (p.title || '').toLowerCase();
            return servicesStr.some(s => s.includes('nicho:eventos') || s.includes('evento')) || title.includes('evento') || title.includes('festa') || title.includes('aniversário') || title.includes('aniversario');
        }
    },
    'fotografia-corporativa': {
        title: 'Fotografia Corporativa, Ensaios Executivos e Retratos',
        categorySlug: 'fotografia',
        icon: Sparkles,
        color: 'from-blue-500 to-indigo-600',
        seoTitle: 'Fotógrafo Corporativo RJ | Retratos Profissionais | Pita',
        seoDesc: 'Fotografia corporativa premium no Rio de Janeiro. Retratos profissionais para LinkedIn, fotos executivas, fotos de produtos e posicionamento de marca no RJ.',
        seoKeywords: 'fotografo corporativo rj, retrato profissional rj, fotos linkedin rio de janeiro, ensaio executivo rj, fotografo profissional rj',
        schemaType: 'LocalBusiness',
        description: 'Posicione sua marca pessoal com autoridade. Criamos retratos corporativos executivos focados em transmitir credibilidade, liderança e profissionalismo, seja para o seu LinkedIn ou site institucional.',
        benefits: [
            { title: 'Posicionamento de Autoridade', desc: 'Retratos planejados para alinhar sua imagem com os objetivos do seu negócio ou carreira.' },
            { title: 'Estúdio Móvel no seu Escritório', desc: 'Montamos toda a estrutura de iluminação e fundo na sua empresa para total comodidade e otimização de tempo.' },
            { title: 'Direção de Pose Humanizada', desc: 'Não sabe como posar? Conduzimos cada pose detalhadamente para que você saia confiante e natural.' },
            { title: 'Tratamento de Pele Avançado', desc: 'Retoques profissionais, preservando os traços naturais e a textura da pele de forma elegante.' }
        ],
        faq: [
            { q: 'Onde as sessões fotográficas corporativas são realizadas?', a: 'Podem ser realizadas diretamente na sede da sua empresa no Rio de Janeiro (com nosso estúdio portátil de iluminação profissional) ou em estúdios parceiros selecionados.' },
            { q: 'O que devo vestir no dia do ensaio?', a: 'Enviamos um PDF de briefing exclusivo com dicas de paleta de cores, estilo de roupa e acessórios adequados para o seu nicho profissional.' },
            { q: 'Vocês fazem retratos para toda a equipe da empresa?', a: 'Sim! Temos pacotes corporativos específicos para fotografar equipes de diretoria, gerência e colaboradores no mesmo dia, mantendo o padrão visual.' }
        ],
        localContext: 'Retratos executivos na Penha, Barra da Tijuca, Leblon, Ipanema e Centro do Rio de Janeiro.',
        projectFilter: (p) => {
            const servicesStr = (p.services || []).map(s => s.toLowerCase());
            const title = (p.title || '').toLowerCase();
            return !servicesStr.some(s => s.includes('nicho:eventos') || s.includes('evento')) && !title.includes('evento') && !title.includes('festa');
        }
    }
};

const ServiceDetailPage = ({ serviceSlug }) => {
    const { slug: urlSlug } = useParams();
    const activeSlug = serviceSlug || urlSlug;
    const service = SERVICES_DATA[activeSlug];

    const [projects, setProjects] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    // Redireciona se a slug não for válida
    if (!service) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-bold mb-4">Serviço não encontrado</h1>
                <p className="text-muted-foreground mb-6">A página de serviço solicitada não existe ou foi movida.</p>
                <Link to="/servicos">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Serviços
                    </Button>
                </Link>
            </div>
        );
    }

    const IconComponent = service.icon || Code;

    useEffect(() => {
        const fetchRelatedData = async () => {
            try {
                setProjectsLoading(true);
                // 1. Busca categoria correspondente no Supabase
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', service.categorySlug)
                    .single();

                if (categoryData) {
                    // 2. Busca projetos vinculados a essa categoria
                    const { data: projectsData, error: projError } = await supabase
                        .from('projects')
                        .select('*, category:categories(slug)')
                        .eq('category_id', categoryData.id)
                        .order('display_order', { ascending: true })
                        .order('created_at', { ascending: false });

                    if (!projError && projectsData) {
                        // Aplica o filtro de subcategoria específico (ex: sites vs landing pages)
                        const filtered = projectsData.filter(service.projectFilter).slice(0, 6);
                        setProjects(filtered);
                    }
                }
            } catch (err) {
                console.error('Erro ao carregar projetos relacionados:', err);
            } finally {
                setProjectsLoading(false);
            }
        };

        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                // Busca reviews aprovados de alta avaliação para prova social
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('is_approved', true)
                    .order('rating', { ascending: false })
                    .limit(3);

                if (!error && data) {
                    setReviews(data);
                }
            } catch (err) {
                console.error('Erro ao carregar avaliações:', err);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchRelatedData();
        fetchReviews();
        setOpenFaqIndex(null); // Reseta FAQ ao mudar de página
    }, [activeSlug, service]);

    // Dados estruturados Schema.org (JSON-LD)
    const schemaJson = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://rafaelpitaoficial.com.br/#organization",
                "name": "Pita Solutions",
                "url": "https://rafaelpitaoficial.com.br",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://rafaelpitaoficial.com.br/favicon.png"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+55-21-99999-9999", // Número fictício de fallback ou dinâmico
                    "contactType": "sales",
                    "areaServed": "BR",
                    "availableLanguage": "Portuguese"
                }
            },
            {
                "@type": service.schemaType,
                "@id": `https://rafaelpitaoficial.com.br/${activeSlug}/#service`,
                "name": service.title,
                "provider": {
                    "@id": "https://rafaelpitaoficial.com.br/#organization"
                },
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "Rio de Janeiro"
                },
                "description": service.description
            },
            {
                "@type": "FAQPage",
                "@id": `https://rafaelpitaoficial.com.br/${activeSlug}/#faq`,
                "mainEntity": service.faq.map(item => ({
                    "@type": "Question",
                    "name": item.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.a
                    }
                }))
            }
        ]
    };

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <>
            <SEO 
                title={service.seoTitle}
                description={service.seoDesc}
                keywords={service.seoKeywords}
                url={`https://rafaelpitaoficial.com.br/${activeSlug}`}
            />

            {/* Injeta JSON-LD de forma segura no Head */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(schemaJson)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <main id="main-content">
                    {/* Hero Section */}
                    <section aria-label="Hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/20 via-transparent to-transparent dark:from-blue-950/10 z-0 border-b border-gray-250/20 dark:border-white/5">
                        <div className="absolute inset-0 aurora-bg opacity-20 dark:opacity-30 pointer-events-none"></div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <Link to="/servicos">
                                <Button variant="ghost" className="text-slate-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white mb-6 font-bold pl-0 transition-colors">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Todos os Serviços
                                </Button>
                            </Link>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                <div className="lg:col-span-8 space-y-6 text-left">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center shadow-md`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Serviço Premium</span>
                                    </div>
                                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                                        <span className="gradient-text">{service.title}</span>
                                    </h1>
                                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-semibold leading-relaxed max-w-4xl">
                                        {service.description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <Link to="/contato">
                                            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform text-md px-8 py-5 font-bold text-white shadow-md">
                                                Solicitar Orçamento
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Benefícios e Proposta de Valor */}
                    <section aria-label="Benefícios" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-250/20 dark:border-white/5">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Por que Escolher a <span className="gradient-text">Pita Solutions</span>?
                            </h2>
                            <p className="text-md md:text-lg text-slate-500 max-w-2xl mx-auto font-semibold">
                                Foco em resultado técnico de alto nível, agilidade e excelência corporativa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {service.benefits.map((benefit, idx) => (
                                <div key={idx} className="glass-effect p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-gray-900/30 flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                                        <p className="text-slate-650 dark:text-gray-400 leading-relaxed font-semibold text-sm">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projetos Recentes (Portfólio Relacionado) */}
                    <section aria-label="Portfólio Relacionado" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-250/20 dark:border-white/5">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Casos de <span className="gradient-text">Sucesso</span> Recentes
                                </h2>
                                <p className="text-md text-slate-500 mt-2 font-semibold">
                                    Trabalhos reais desenvolvidos para clientes de diversos nichos no mercado.
                                </p>
                            </div>
                            <Link to="/portfolio">
                                <Button variant="outline" className="border-slate-300 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 font-bold transition-all">
                                    Ver Todo o Portfólio <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        {projectsLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center p-12 bg-muted/20 border border-dashed border-border rounded-xl">
                                <p className="text-muted-foreground font-semibold">Nenhum projeto relacionado cadastrado no momento.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((proj) => (
                                    <Link key={proj.id} to={`/portfolio/${proj.category?.slug || 'geral'}/${proj.slug}`} className="group block">
                                        <article className="glass-effect rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-gray-900/30">
                                            <div className="aspect-[16/10] w-full overflow-hidden bg-muted relative">
                                                <img 
                                                    src={proj.main_image_url || 'https://via.placeholder.com/800x600'} 
                                                    alt={proj.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                    loading="lazy" 
                                                />
                                            </div>
                                            <div className="p-6 space-y-2">
                                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                                                    {proj.client || 'Cliente Corporativo'}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors leading-tight">
                                                    {proj.title}
                                                </h3>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Prova Social (Depoimentos) */}
                    <section aria-label="Depoimentos" className="py-20 bg-slate-50 dark:bg-gray-900/40 border-b border-gray-250/20 dark:border-white/5">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16 space-y-4">
                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                    O que dizem os <span className="gradient-text">Nossos Clientes</span>
                                </h2>
                                <p className="text-md text-slate-500 font-semibold max-w-xl mx-auto">
                                    Garantia de satisfação e alto nível de fidelidade em orçamentos entregues.
                                </p>
                            </div>

                            {reviewsLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center p-6">
                                    <p className="text-muted-foreground font-semibold">Avaliações em fase de moderação.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="glass-effect p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-gray-900/40 flex flex-col justify-between shadow-md">
                                            <div className="space-y-4">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-700'}`} 
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-slate-650 dark:text-gray-300 italic font-semibold leading-relaxed">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 pt-6 border-t border-gray-200/30 mt-6">
                                                {review.avatar_url ? (
                                                    <img src={review.avatar_url} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-bold text-sm">
                                                        {review.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{review.name}</h4>
                                                    <span className="text-[10px] text-muted-foreground font-bold">{review.role || 'Cliente'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SEO Local e Contexto Regional */}
                    <section aria-label="Presença Regional" className="py-16 max-w-4xl mx-auto px-4 text-center">
                        <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-200/20 dark:border-blue-800/15 rounded-3xl p-8 space-y-4">
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Presença Local RJ</span>
                            <h3 className="text-xl font-bold text-gray-950 dark:text-white">Atendimento em Todo o Rio de Janeiro</h3>
                            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-semibold">
                                {service.localContext} Prestamos serviços de excelência técnica com flexibilidade de reuniões presenciais, sessões de fotos locais ou entregas corporativas integradas na Região Metropolitana do Rio de Janeiro.
                            </p>
                        </div>
                    </section>

                    {/* FAQ Interativo (SEO para IA) */}
                    <section aria-label="Perguntas Frequentes" className="py-20 bg-background max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-250/20 dark:border-white/5">
                        <div className="text-center mb-12 space-y-4">
                            <h2 className="text-3xl font-extrabold tracking-tight">
                                Perguntas <span className="gradient-text">Frequentes</span> (FAQ)
                            </h2>
                            <p className="text-sm text-slate-500 font-semibold">
                                Dúvidas comuns para agilizar o escopo de contratação e alinhar as expectativas técnicas.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {service.faq.map((item, index) => {
                                const isOpen = openFaqIndex === index;
                                return (
                                    <div 
                                        key={index} 
                                        className="glass-effect rounded-xl border border-gray-200/50 dark:border-white/10 overflow-hidden bg-white/40 dark:bg-gray-900/20 transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors font-bold text-slate-900 dark:text-white"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="text-base flex items-center gap-2">
                                                <HelpCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                                {item.q}
                                            </span>
                                            {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                        </button>
                                        
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <div className="p-5 pt-0 text-sm text-slate-650 dark:text-gray-400 border-t border-gray-200/20 font-semibold leading-relaxed">
                                                        {item.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* CTA Final */}
                    <section aria-label="CTA de Contato" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center glass-effect p-12 rounded-3xl border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                                Vamos iniciar seu projeto de <span className="gradient-text">{service.title.split(' ')[0]}</span>?
                            </h2>
                            <p className="text-base md:text-lg text-slate-650 dark:text-gray-300 mb-8 max-w-xl mx-auto font-semibold leading-relaxed">
                                Orçamentos sob medida adaptados para o tamanho do seu negócio e suporte contínuo premium.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link to="/contato" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform text-lg px-10 py-5 font-bold text-white shadow-md">
                                        Solicitar Orçamento
                                    </Button>
                                </Link>
                                <a 
                                    href="https://wa.me/5521999999999" // Link dinâmico se houvesse no site_config, senão fallback
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full sm:w-auto"
                                >
                                    <Button size="lg" variant="outline" className="w-full border-green-500/30 dark:border-green-800/40 text-green-600 dark:text-green-400 hover:bg-green-500/5 hover:text-green-700 text-lg px-10 py-5 font-bold transition-all shadow-sm">
                                        Falar no WhatsApp
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default ServiceDetailPage;
