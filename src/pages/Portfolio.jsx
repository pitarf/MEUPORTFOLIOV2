import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
    ExternalLink, ArrowRight, Palette, Camera, Code, 
    BarChart3, Video, Target, Wrench, Shield, Loader2, 
    Filter, X, Search, Award, CheckCircle2, Cpu, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

// Mapeamento dos ícones para as categorias de portfólio
const icons = { 
    Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield 
};

// Pílulas de tecnologia geradas dinamicamente com base na categoria e título do projeto para conferir autoridade técnica
const getProjectTechs = (categorySlug, projectTitle) => {
    const slug = categorySlug.toLowerCase();
    const title = projectTitle.toLowerCase();
    
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

const Portfolio = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

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
            setAllCategories(categoriesData || []);

            // 2. Coleta todos os projetos
            const { data: projectsData, error: projError } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (projError) throw projError;
            
            // Filtra fora projetos de fotografia (estes possuem galeria exclusiva)
            const photoCat = categoriesData.find(c => c.slug === 'fotografia');
            const photoCatId = photoCat ? photoCat.id : null;
            const filteredProjs = projectsData ? projectsData.filter(p => p.category_id !== photoCatId) : [];
            
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
            <div className="flex justify-center items-center h-screen bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Portfólio de Alta Performance - Rafael Pita Solutions</title>
                <meta name="description" content="Explore a excelência técnica de dezenas de projetos concluídos em tecnologia, design inteligente, marketing de alta conversão e inteligência de dados." />
            </Helmet>

            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                
                {/* 1. Hero Section de Autoridade */}
                <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-blue-50/20 via-transparent to-transparent dark:from-blue-950/10">
                    <div className="absolute inset-0 aurora-bg opacity-30 dark:opacity-40 z-0 pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-md">
                                <Award className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-extrabold px-2 tracking-tight">
                                <span className="gradient-text">Nosso Portfólio</span>
                            </h1>
                            <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 font-semibold leading-relaxed">
                                Excelência Técnica e Design de Conversão em Dezenas de Projetos Entregues
                            </p>
                            <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4 leading-relaxed font-medium">
                                Explore a notoriedade do nosso histórico. Cada cartão expõe a aplicação rigorosa de metodologias e ferramentas para gerar lucros e resultados expressivos aos nossos parceiros.
                            </p>

                            {/* Contadores Rápidos de Autoridade */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto pt-6 text-center">
                                <div className="glass-effect p-4 rounded-xl border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">500+</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase mt-1">Entregas de Sucesso</div>
                                </div>
                                <div className="glass-effect p-4 rounded-xl border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">98%</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase mt-1">Satisfação Geral</div>
                                </div>
                                <div className="glass-effect p-4 rounded-xl border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30 col-span-2 md:col-span-1">
                                    <div className="text-2xl sm:text-3xl font-extrabold text-pink-600 dark:text-pink-400">100%</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase mt-1">Foco Comercial</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* 2. Barra de Controle e Filtros de Elite (Dashboard Style) */}
                <section className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6">
                    <div className="glass-effect rounded-2xl p-4 border border-gray-200/50 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/60 flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Seletor de Categorias por Abas Horizontais com Contadores */}
                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto py-1 no-scrollbar scroll-smooth">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                                    activeTab === 'all'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                            >
                                <Cpu className="w-4 h-4" />
                                Todos
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                    activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                                }`}>
                                    {projects.length}
                                </span>
                            </button>

                            {allCategories.map((cat) => {
                                const IconComp = icons[cat.icon] || Code;
                                const catCount = projects.filter(p => p.category_id === cat.id).length;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.slug)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
                                            activeTab === cat.slug
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/10'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <IconComp className="w-4 h-4" />
                                        {cat.title}
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                            activeTab === cat.slug ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                                        }`}>
                                            {catCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Barra de Pesquisa Integrada */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Buscar projetos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
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
                            {filteredProjects.map((project, index) => {
                                const cat = allCategories.find(c => c.id === project.category_id) || { title: 'Geral', slug: 'geral', color: 'from-blue-500 to-purple-600' };
                                const techs = getProjectTechs(cat.slug, project.title);
                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="group relative rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 aspect-[4/3] cursor-pointer bg-slate-900"
                                    >
                                        <Link to={`/portfolio/${cat.slug}/${project.slug}`} className="block h-full w-full">
                                            
                                            {/* Imagem de Fundo em Alta Definição com Zoom no Hover */}
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    src={project.main_image_url || 'https://images.unsplash.com/photo-1572177812156-58036aae439c'}
                                                    loading="lazy"
                                                />
                                                {/* Gradiente de Fusão para Legibilidade */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300" />
                                            </div>

                                            {/* Micro-cápsula da Categoria no topo esquerdo */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className={`inline-flex items-center text-xs font-bold text-white px-3 py-1.5 rounded-full bg-gradient-to-r ${cat.color || 'from-blue-500 to-purple-600'} shadow-md uppercase tracking-wider`}>
                                                    {cat.title}
                                                </span>
                                            </div>

                                            {/* Conteúdo Central e Base */}
                                            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                                                <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                                                    
                                                    {/* Título do Projeto */}
                                                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight group-hover:text-blue-400 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    
                                                    {/* Descrição do Projeto */}
                                                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 group-hover:block transition-opacity duration-300">
                                                        {project.description}
                                                    </p>

                                                    {/* Pílulas de Tecnologia / Ferramentas que aparecem no Hover */}
                                                    <div className="flex flex-wrap gap-1.5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        {techs.map((tech) => (
                                                            <span key={tech} className="text-[10px] font-bold text-blue-300 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-450/20 px-2 py-0.5 rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Botão de Ver Projeto */}
                                                    <div className="pt-2 flex items-center text-xs font-extrabold text-blue-400 uppercase tracking-wider gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        Conhecer Case <ArrowRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>

                                                {/* Detalhe de Setinha Sutil no Canto Superior Direito */}
                                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0 shadow-md">
                                                    <ExternalLink className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProjects.length === 0 && (
                        <div className="text-center glass-effect p-12 rounded-2xl max-w-md mx-auto mt-8 border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30">
                            <X className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nenhum projeto encontrado</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">Tente alterar os termos da busca ou filtre por outra especialidade.</p>
                        </div>
                    )}
                </section>

                {/* 4. Seção de Pilares de Competência e Notoriedade Técnica */}
                <section className="py-20 bg-slate-50 dark:bg-gray-900/40 border-y border-gray-200/50 dark:border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                <span className="gradient-text">Rigores & Competências</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Por que a Rafael Pita Solutions garante a entrega perfeita de projetos de alta complexidade
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { 
                                    icon: <Cpu className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
                                    title: 'Arquitetura e Escalabilidade', 
                                    description: 'Código limpo, estruturação de banco de dados PostgreSQL robusto e integrações via Supabase prontas para expansão comercial.' 
                                },
                                { 
                                    icon: <Palette className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
                                    title: 'Design Centrado no Usuário', 
                                    description: 'Interfaces construídas sob rigorosos padrões de ergonomia, design moderno em Figma e consistência visual impecável.' 
                                },
                                { 
                                    icon: <TrendingUp className="w-6 h-6 text-pink-500 dark:text-pink-400" />,
                                    title: 'Decisões Baseadas em Dados', 
                                    description: 'Desenvolvimento de painéis Power BI de nível executivo com modelagem ETL rápida para decisões financeiras e comerciais imediatas.' 
                                },
                                { 
                                    icon: <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />,
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
                                    className="glass-effect p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-gray-900/30 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center border border-blue-500/20 dark:border-blue-400/20">
                                            {pilar.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{pilar.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{pilar.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CTA Section (Chamada para Ação Corporativa) */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                                Gostou do nosso histórico técnico?
                            </h2>
                            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                                Vamos transformar seu próximo projeto em um case de sucesso de alta notoriedade comercial. Agende sua consultoria agora!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link to="/contato" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold transition-all duration-300">
                                        Solicitar Orçamento
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Portfolio;