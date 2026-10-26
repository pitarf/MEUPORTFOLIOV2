import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { 
    ExternalLink, ArrowRight, Palette, Camera, Code, 
    BarChart3, Video, Target, Wrench, Shield, Loader2, 
    Filter, X, Search, Award, CheckCircle2, Cpu, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';

// Mapeamento dos ícones para as categorias de portfólio
const icons = { 
    Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield 
};

// Pílulas de tecnologia geradas dinamicamente com base nas tags salvas do projeto ou fallback por categoria/título
const getProjectTechs = (categorySlug, projectTitle, projectServices) => {
    // 1. Tenta extrair tags personalizadas cadastradas manualmente no projeto (ignorando tags de sistema)
    let customTechs = [];
    if (Array.isArray(projectServices)) {
        customTechs = projectServices.filter(s => 
            typeof s === 'string' && 
            !s.startsWith('subcategoria:') && 
            !s.startsWith('nicho:') &&
            s.trim() !== ''
        );
    } else if (typeof projectServices === 'string' && projectServices.trim() !== '') {
        customTechs = projectServices.split(',')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('subcategoria:') && !s.startsWith('nicho:'));
    }

    if (customTechs.length > 0) {
        return customTechs;
    }

    // 2. Fallback automático por categoria e título se não houver nada cadastrado no projeto
    const slug = (categorySlug || '').toLowerCase();
    const title = (projectTitle || '').toLowerCase();
    
    if (slug.includes('web') || slug.includes('site') || slug.includes('app')) {
        const techs = ['React', 'Tailwind CSS', 'Supabase', 'Node.js'];
        if (title.includes('crm') || title.includes('sistema')) techs.push('PostgreSQL', 'REST API');
        if (title.includes('landing') || title.includes('institucional')) techs.push('SEO Premium', 'Framer Motion');
        return techs;
    }
    if (slug.includes('design') || slug.includes('identidade') || slug.includes('marca')) {
        const techs = ['Figma', 'Adobe Photoshop', 'Illustrator', 'Branding'];
        if (title.includes('cardapio') || title.includes('embalagem')) techs.push('Mockups 3D', 'Vetorização');
        return techs;
    }
    if (slug.includes('bi') || slug.includes('dashboard') || slug.includes('dados')) {
        const techs = ['Power BI', 'DAX', 'Power Query', 'ETL', 'SQL Server'];
        if (title.includes('financeiro') || title.includes('vendas')) techs.push('KPIs de Lucro', 'Excel Avançado');
        return techs;
    }
    if (slug.includes('trafego') || slug.includes('ads') || slug.includes('marketing')) {
        const techs = ['Google Ads', 'Meta Ads', 'Copywriting', 'Pixel Web', 'ROI / ROAS'];
        return techs;
    }
    if (slug.includes('video') || slug.includes('ia') || slug.includes('edicao')) {
        const techs = ['Premiere Pro', 'Midjourney', 'After Effects', 'IA Generativa'];
        return techs;
    }
    return ['Figma', 'Soluções Digitais', 'Excelência'];
};

const Portfolio = ({ cleanMode: propCleanMode, basePath: propBasePath }) => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    // Detecta modo limpo para propostas externas (sem contatos externos)
    const isCleanMode = Boolean(
        propCleanMode ||
        location.pathname.startsWith('/portfolio-v2') ||
        location.pathname.startsWith('/portfolio/v2') ||
        location.pathname.startsWith('/projetos-v2')
    );
    const effectiveBasePath = propBasePath || (isCleanMode ? '/portfolio-v2' : '/portfolio');

    const [allCategories, setAllCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(() => {
        return searchParams.get('category') || (location.hash ? location.hash.replace('#', '') : 'all');
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Reage dinamicamente a mudanças de categoria via query params ou hash
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            setActiveTab(cat);
        } else if (location.hash) {
            const hash = location.hash.replace('#', '');
            if (hash) setActiveTab(hash);
        }
    }, [searchParams, location.hash]);

    const fetchPortfolioData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Coleta todas as categorias menos Fotografia
            const { data: categoriesData, error: catError } = await supabase
                .from('categories')
                .select('id, slug, title, description, icon, color')
                .neq('slug', 'fotografia')
                .order('id');

            if (catError) throw catError;
            
            // Mapeamento dinâmico de títulos corporativos compactos de elite
            const mappedCategories = (categoriesData || []).map(cat => {
                const slug = (cat.slug || '').toLowerCase();
                const title = (cat.title || '').toLowerCase();

                if (slug === 'desenvolvimento-de-sites' || title === 'desenvolvimento de sites') {
                    return { ...cat, title: 'Sites' };
                }
                if (slug === 'dashboards-em-power-bi' || title === 'dashboards em power bi') {
                    return { ...cat, title: 'Power BI' };
                }
                if (slug === 'producao-com-ia' || title === 'produção com ia' || title === 'produção ia') {
                    return { ...cat, title: 'Produção IA' };
                }
                return cat;
            });

            setAllCategories(mappedCategories);

            // 2. Coleta todos os projetos
            const { data: projectsData, error: projError } = await supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (projError) throw projError;
            
            // Filtra fora projetos de fotografia e projetos sem categoria corporativa válida (descartando "Geral")
            const activeCategoryIds = new Set(mappedCategories.map(c => c.id));
            const filteredProjs = projectsData ? projectsData.filter(p => p.category_id && activeCategoryIds.has(p.category_id)) : [];
            
            // Filtra e mantém apenas as categorias corporativas que possuem pelo menos 1 projeto ativo
            const categoriesWithProjects = mappedCategories.filter(cat => {
                const count = filteredProjs.filter(p => p.category_id === cat.id).length;
                return count > 0;
            });
            
            setAllCategories(categoriesWithProjects);
            setProjects(filteredProjs);
            setFilteredProjects(filteredProjs);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolioData();
    }, [fetchPortfolioData]);

    // Lógica inteligente de filtragem local instantânea baseada em Abas e Busca
    useEffect(() => {
        let result = [...projects];

        // 1. Filtrar por Categoria ativa
        if (activeTab !== 'all') {
            const selectedCat = allCategories.find(c => c.slug === activeTab);
            if (selectedCat) {
                result = result.filter(p => p.category_id === selectedCat.id);
            }
        }

        // 2. Filtrar por Busca Textual
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        setFilteredProjects(result);
    }, [activeTab, searchQuery, projects, allCategories]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-[#0a0a08]">
                <Loader2 className="h-16 w-16 animate-spin text-[#4d7c0f] dark:text-[#bcf13b]" />
            </div>
        );
    }

    return (
        <>
            <SEO 
                title={`${t('portfolio_title', 'Nosso Portfólio')} - Rafael Pita Solutions`}
                description={t('portfolio_description', 'Explore nosso histórico técnico de excelência.')}
            />

            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
                
                {/* 1. Hero Section de Autoridade */}
                <section className="relative pt-12 pb-14 md:pt-16 md:pb-20 overflow-hidden bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(77,124,15,0.08)_0%,_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(188,241,59,0.06)_0%,_transparent_60%)] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="w-14 h-14 mx-auto mb-2 bg-lime-500/10 dark:bg-[#bcf13b]/10 rounded-full flex items-center justify-center border border-lime-500/20 dark:border-[#bcf13b]/20 shadow-md">
                                <Award className="w-7 h-7 text-[#4d7c0f] dark:text-[#bcf13b]" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold px-2 tracking-tight text-slate-900 dark:text-white">
                                Nosso <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Portfólio</span>
                            </h1>
                            <p className="text-base md:text-xl text-slate-700 dark:text-gray-300 max-w-2xl mx-auto px-4 font-semibold leading-relaxed">
                                {t('portfolio_subtitle', 'Excelência Técnica e Design de Conversão em Dezenas de Projetos Entregues')}
                            </p>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-gray-400 max-w-xl mx-auto px-4 leading-relaxed font-medium">
                                {t('portfolio_description_long', 'Explore a notoriedade do nosso histórico. Cada cartão expõe a aplicação rigorosa de metodologias e ferramentas para gerar lucros e resultados expressivos aos nossos parceiros.')}
                            </p>

                            {/* Contadores Rápidos de Autoridade */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 max-w-xl mx-auto pt-4 text-center">
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] shadow-sm dark:shadow-none">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-[#4d7c0f] dark:text-[#bcf13b]">50+</div>
                                    <div className="text-xs text-slate-600 dark:text-gray-400 font-semibold tracking-wide uppercase mt-1">{t('portfolio_stat_deliveries', 'Entregas de Sucesso')}</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] shadow-sm dark:shadow-none">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-[#4d7c0f] dark:text-[#bcf13b]">98%</div>
                                    <div className="text-xs text-slate-600 dark:text-gray-400 font-semibold tracking-wide uppercase mt-1">{t('portfolio_stat_satisfaction', 'Satisfação Geral')}</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] shadow-sm dark:shadow-none col-span-2 md:col-span-1">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-[#4d7c0f] dark:text-[#bcf13b]">100%</div>
                                    <div className="text-xs text-slate-600 dark:text-gray-400 font-semibold tracking-wide uppercase mt-1">{t('portfolio_stat_focus', 'Foco Comercial')}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 2. Barra de Controle e Filtros de Elite (Dashboard Style) */}
                <section className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6">
                    <div className="rounded-2xl p-4 border border-slate-200 dark:border-[#23231f] shadow-lg dark:shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-[#121210] flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Seletor de Categorias por Abas Multilinha */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:flex-1 py-1">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`relative px-3.5 py-2 rounded-xl text-xs md:text-[13px] font-semibold flex items-center gap-1.5 transition-colors duration-300 z-10 border ${
                                    activeTab === 'all'
                                        ? 'bg-[#bcf13b] text-[#0a0a08] font-bold border-[#bcf13b] shadow-md shadow-[#bcf13b]/20'
                                        : 'bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181814]'
                                }`}
                            >
                                <Cpu className="w-3.5 h-3.5" />
                                {t('portfolio_all_categories', 'Todos')}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                                    activeTab === 'all' ? 'bg-[#0a0a08]/20 text-[#0a0a08]' : 'bg-slate-100 dark:bg-[#181814] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-[#23231f]'
                                }`}>
                                    {projects.length}
                                </span>
                            </button>

                            {allCategories.map((cat) => {
                                const IconComp = icons[cat.icon] || Code;
                                const catCount = projects.filter(p => p.category_id === cat.id).length;
                                const isActive = activeTab === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.slug)}
                                        className={`relative px-3.5 py-2 rounded-xl text-xs md:text-[13px] font-semibold flex items-center gap-1.5 transition-colors duration-300 z-10 border ${
                                            isActive
                                                ? 'bg-[#bcf13b] text-[#0a0a08] font-bold border-[#bcf13b] shadow-md shadow-[#bcf13b]/20'
                                                : 'bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181814]'
                                        }`}
                                    >
                                        <IconComp className="w-3.5 h-3.5" />
                                        {cat.title}
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                                            isActive ? 'bg-[#0a0a08]/20 text-[#0a0a08]' : 'bg-slate-100 dark:bg-[#181814] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-[#23231f]'
                                        }`}>
                                            {catCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Barra de Pesquisa Integrada */}
                        <div className="relative w-full md:w-72 flex-shrink-0">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400" />
                            <Input
                                type="text"
                                placeholder={t('portfolio_search_placeholder', 'Buscar projetos...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 rounded-xl focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] font-semibold"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. Grid de Projetos Ultra-Premium (Animações Fluidas Framer Motion) */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => {
                                const cat = allCategories.find(c => c.id === project.category_id) || { title: 'Geral', slug: 'geral' };
                                const techs = getProjectTechs(cat.slug, project.title, project.services);
                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] shadow-sm hover:shadow-md dark:shadow-none hover:shadow-lime-500/10 dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 cursor-pointer bg-white dark:bg-[#121210] flex flex-col h-full"
                                    >
                                        <Link to={`${effectiveBasePath}/${cat.slug}/${project.slug}`} className="flex flex-col h-full w-full">
                                            
                                            {/* Imagem de Fundo */}
                                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#181814]">
                                                <img
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    src={project.main_image_url || 'https://images.unsplash.com/photo-1572177812156-58036aae439c'}
                                                    loading="lazy"
                                                />
                                                
                                                {/* Gradiente sutil */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#121210]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                {/* Badge da Categoria sobre a Imagem */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="inline-flex items-center text-[11px] font-bold text-[#0a0a08] px-2.5 py-1 rounded-full bg-[#bcf13b] shadow-sm uppercase tracking-wider">
                                                        {cat.title}
                                                    </span>
                                                </div>

                                                {/* Ícone de Link Externo no Hover */}
                                                <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-[#121210]/90 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md border border-slate-200 dark:border-[#23231f]">
                                                    <ExternalLink className="w-3.5 h-3.5 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                                </div>
                                            </div>

                                            {/* Conteúdo do Card Abaixo da Imagem */}
                                            <div className="p-5 flex flex-col justify-between flex-1 space-y-3 bg-white dark:bg-[#121210]">
                                                <div className="space-y-1.5">
                                                    {/* Cliente e Ano */}
                                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400">
                                                        <span className="truncate">{project.client || t('portfolio_corporate_client', 'Cliente Corporativo')}</span>
                                                        {project.year && <span className="flex-shrink-0">{project.year}</span>}
                                                    </div>

                                                    {/* Título do Projeto */}
                                                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors line-clamp-1">
                                                        {project.title}
                                                    </h3>
                                                    
                                                    {/* Descrição Curta */}
                                                    {project.description && (
                                                        <p className="text-slate-600 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed font-normal">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Rodapé do Card: Tecnologias e Call to Action */}
                                                <div className="pt-3 border-t border-slate-100 dark:border-[#23231f] flex items-center justify-between gap-2">
                                                    <div className="flex flex-wrap gap-1 max-w-[70%]">
                                                        {techs.slice(0, 3).map((tech) => (
                                                            <span key={tech} className="text-[10px] font-semibold text-lime-700 dark:text-[#bcf13b] bg-lime-50 dark:bg-[#bcf13b]/10 border border-lime-200 dark:border-[#bcf13b]/20 px-2 py-0.5 rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center text-xs font-bold text-[#4d7c0f] dark:text-[#bcf13b] group-hover:translate-x-1 transition-transform duration-200">
                                                        {t('portfolio_view_case', 'Ver Case')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProjects.length === 0 && (
                        <div className="text-center p-12 rounded-2xl max-w-md mx-auto mt-8 border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] shadow-sm dark:shadow-none">
                            <X className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('portfolio_no_projects', 'Nenhum projeto encontrado')}</h3>
                            <p className="text-slate-600 dark:text-gray-400 mt-2 text-sm font-medium">{t('portfolio_no_projects_desc', 'Tente alterar os termos da busca ou filtre por outra especialidade.')}</p>
                        </div>
                    )}
                </section>

                {/* 4. Seção de Pilares de Competência e Notoriedade Técnica */}
                <section className="py-20 bg-slate-100/60 dark:bg-[#0a0a08] border-y border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Rigores & <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Competências</span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Por que a Rafael Pita Solutions garante a entrega perfeita de projetos de alta complexidade
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { 
                                    icon: <Cpu className="w-6 h-6 text-[#4d7c0f] dark:text-[#bcf13b]" />,
                                    title: 'Arquitetura e Escalabilidade', 
                                    description: 'Código limpo, estruturação de banco de dados PostgreSQL robusto e integrações via Supabase prontas para expansão comercial.' 
                                },
                                { 
                                    icon: <Palette className="w-6 h-6 text-[#4d7c0f] dark:text-[#bcf13b]" />,
                                    title: 'Design Centrado no Usuário', 
                                    description: 'Interfaces construídas sob rigorosos padrões de ergonomia, design moderno em Figma e consistência visual impecável.' 
                                },
                                { 
                                    icon: <TrendingUp className="w-6 h-6 text-[#4d7c0f] dark:text-[#bcf13b]" />,
                                    title: 'Decisões Baseadas em Dados', 
                                    description: 'Desenvolvimento de painéis Power BI de nível executivo com modelagem ETL rápida para decisões financeiras e comerciais imediatas.' 
                                },
                                { 
                                    icon: <CheckCircle2 className="w-6 h-6 text-[#4d7c0f] dark:text-[#bcf13b]" />,
                                    title: 'Alta Performance Comercial', 
                                    description: 'Campanhas de tráfego pago otimizadas em Google/Meta Ads e SEO ultra-potente para ranqueamento líder nas buscas do Google.' 
                                }
                            ].map((pilar, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] bg-white dark:bg-[#121210] shadow-sm dark:shadow-none flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-xl bg-lime-500/10 dark:bg-[#bcf13b]/10 flex items-center justify-center border border-lime-500/20 dark:border-[#bcf13b]/20">
                                            {pilar.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{pilar.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{pilar.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CTA Section (Chamada para Ação Corporativa) */}
                <section className="py-20 bg-white dark:bg-[#121210] border-t border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
                                Gostou do nosso <span className="text-[#4d7c0f] dark:text-[#bcf13b]">histórico técnico</span>?
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
                                {isCleanMode 
                                    ? 'Transformamos sua necessidade em um projeto de alto nível e acabamento impecável. Responda diretamente na nossa proposta para alinharmos detalhes e prazos!'
                                    : 'Vamos transformar seu próximo projeto em um case de sucesso de alta notoriedade comercial. Agende sua consultoria agora!'}
                            </p>
                            {isCleanMode ? (
                                <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-lime-500/10 text-lime-700 dark:text-[#bcf13b] border border-lime-500/20 text-sm font-bold shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-lime-600 dark:text-[#bcf13b]" />
                                    <span>Comunicação e contratação 100% integradas pela plataforma do 99freelas.</span>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Link to="/contato" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#bcf13b]/20 text-lg px-8 py-4 transition-all duration-300">
                                            Solicitar Orçamento
                                            <ArrowRight className="ml-2 w-5 h-5 text-[#0a0a08]" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Portfolio;