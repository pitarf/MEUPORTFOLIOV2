import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { ExternalLink, ArrowRight, Camera, Loader2, ArrowLeft, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Mapeamento e classificação dinâmica inteligente de nichos
 * Baseia-se em termos contidos no array de serviços ou no título/descrição.
 */
const getProjectNiche = (project) => {
    // 1. Tenta achar tag com o prefixo 'nicho:'
    const nicheTag = (project.services || []).find(s => s.toLowerCase().startsWith('nicho:'));
    if (nicheTag) {
        return nicheTag.substring(6).toLowerCase();
    }

    // 2. Fallback para retrocompatibilidade
    const services = (project.services || []).map(s => s.toLowerCase());
    const title = (project.title || '').toLowerCase();

    if (services.includes('casamento') || services.includes('pedido') || title.includes('casamento') || title.includes('pedido') || title.includes('noivado')) {
        return 'casamentos';
    }
    if (services.includes('evento') || services.includes('festa') || services.includes('corporativo') || title.includes('evento') || title.includes('festa') || title.includes('corporativo') || title.includes('aniversario') || title.includes('aniversário')) {
        return 'eventos';
    }
    return 'ensaios';
};

/**
 * PhotographyPortfolio Page
 * Galeria de fotos assimétrica estilo Masonry premium, com suporte adaptativo de temas
 * e filtros horizontais instantâneos.
 */
const PhotographyPortfolio = ({ cleanMode: propCleanMode, basePath: propBasePath }) => {
    const { theme } = useTheme();
    const location = useLocation();

    // Detecta modo limpo para propostas externas (sem contatos externos)
    const isCleanMode = Boolean(
        propCleanMode ||
        location.pathname.startsWith('/portfolio-fotografia-v2') ||
        location.pathname.startsWith('/portfolio-v2/fotografia') ||
        location.pathname.startsWith('/fotografia-v2')
    );
    const effectiveBasePath = propBasePath || (isCleanMode ? '/portfolio-v2' : '/portfolio');
    const homePhotoPath = isCleanMode ? "/portfolio-fotografia-v2" : "/portfolio-fotografia";

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams] = useSearchParams();
    const nichoParam = searchParams.get('nicho');
    const [activeTab, setActiveTab] = useState(nichoParam || 'all');

    // 1. Coleta todos os nichos únicos encontrados nos projetos
    const dynamicNiches = React.useMemo(() => {
        const nichesSet = new Set(['casamentos', 'ensaios', 'eventos']);
        projects.forEach(p => {
            const niche = getProjectNiche(p);
            if (niche) {
                nichesSet.add(niche);
            }
        });
        return Array.from(nichesSet);
    }, [projects]);

    // 2. Cria o array de abas com título capitalizado e contagem correspondente
    const tabs = React.useMemo(() => {
        const list = [
            { id: 'all', title: 'Todos', count: projects.length }
        ];
        
        dynamicNiches.forEach(niche => {
            const count = projects.filter(p => getProjectNiche(p) === niche).length;
            list.push({
                id: niche,
                title: capitalize(niche),
                count
            });
        });
        return list;
    }, [dynamicNiches, projects]);

    const fetchPhotographyProjects = useCallback(async () => {
        setLoading(true);

        const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', 'fotografia')
            .single();

        if (!categoryData) {
            console.error('Category "fotografia" not found');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('category_id', categoryData.id)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching photography projects:', error);
        } else {
            setProjects(data || []);
            setFilteredProjects(data || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPhotographyProjects();
    }, [fetchPhotographyProjects]);

    // Filtragem local instantânea por Aba e Termo de Busca
    useEffect(() => {
        let result = [...projects];

        if (activeTab !== 'all') {
            result = result.filter(p => getProjectNiche(p) === activeTab);
        }

        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query)) ||
                (p.client && p.client.toLowerCase().includes(query))
            );
        }

        setFilteredProjects(result);
    }, [activeTab, searchTerm, projects]);

    return (
        <>
            <SEO 
                title="Galeria de Fotografia RJ | Pre Wedding, Casamentos e Ensaios"
                description="Confira a galeria de trabalhos fotográficos de Rafael Pita no Rio de Janeiro. Fotos de casamentos, ensaios pre-wedding, aniversários e eventos corporativos no RJ."
                keywords="galeria de fotos pre wedding, fotos pre wedding rj, fotos casamento rio de janeiro, ensaio fotografico rj, fotografo profissional rj, fotos de casamento rio de janeiro"
            />

            <div className="pt-24 pb-20 min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header e Navegação */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="space-y-3">
                            <Link to={homePhotoPath}>
                                <Button variant="ghost" className="text-slate-600 hover:text-[#4d7c0f] dark:text-gray-400 dark:hover:text-[#bcf13b] mb-2 pl-0 font-bold transition-colors">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> {isCleanMode ? "Voltar à Vitrine de Fotografia" : "Voltar para Home de Fotografia"}
                                </Button>
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3.5">
                                <Camera className="w-10 h-10 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                <span>Galeria de <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Arte</span></span>
                            </h1>
                            <p className="text-base md:text-xl text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                                Registros artísticos e cases selecionados com acabamento de excelência.
                            </p>
                        </div>

                        {/* Barra de Pesquisa */}
                        <div className="w-full md:w-80 relative flex-shrink-0">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-4 h-4" />
                            <Input
                                placeholder="Buscar nos cliques..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] rounded-xl focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 font-medium shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-gray-500 dark:hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtros em Abas Deslizantes (Framer Motion) */}
                    <div className="rounded-2xl p-3 border border-slate-200 dark:border-[#23231f] shadow-sm dark:shadow-lg backdrop-blur-xl bg-white dark:bg-[#121210] mb-12 flex flex-wrap gap-2 justify-center md:justify-start">
                        {tabs.map((tab) => {
                            if (tab.count === 0 && tab.id !== 'all') return null;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2 rounded-xl text-xs md:text-[13px] font-bold flex items-center gap-1.5 transition-colors duration-300 z-10 ${
                                        activeTab === tab.id
                                            ? 'text-[#0a0a08]'
                                            : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181814]'
                                    }`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.span
                                            layoutId="activePhotoTabBackground"
                                            className="absolute inset-0 bg-[#bcf13b] rounded-xl -z-10 shadow-md shadow-[#bcf13b]/20"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    {tab.title}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold transition-colors ${
                                        activeTab === tab.id ? 'bg-[#0a0a08]/20 text-[#0a0a08]' : 'bg-slate-100 dark:bg-[#181814] text-slate-600 dark:text-gray-400'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Loader */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-16 w-16 animate-spin text-[#4d7c0f] dark:text-[#bcf13b]" />
                        </div>
                    ) : (
                        <>
                            {/* Visualizacao 1: Sem Filtro Ativo (Modo Completo) */}
                            {activeTab === 'all' && searchTerm.trim() === '' ? (
                                <>
                                    {/* Mobile: Nichos um abaixo do outro com Carrossel Horizontal Deslizavel */}
                                    <div className="block md:hidden space-y-10">
                                        {dynamicNiches.map((niche) => {
                                            const nicheProjects = projects.filter(p => getProjectNiche(p) === niche);
                                            if (nicheProjects.length === 0) return null;
                                            const nicheLabel = capitalize(niche);

                                            return (
                                                <div key={niche} className="space-y-3.5">
                                                    {/* Cabecalho do Nicho Mobile */}
                                                    <div className="flex items-center justify-between px-1">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="w-8 h-8 rounded-xl bg-lime-500/10 dark:bg-[#bcf13b]/10 flex items-center justify-center border border-lime-500/20 dark:border-[#bcf13b]/20 text-[#4d7c0f] dark:text-[#bcf13b] shrink-0">
                                                                <Camera className="w-4 h-4" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                                                                        {nicheLabel}
                                                                    </h2>
                                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#181814] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-[#23231f] shrink-0">
                                                                        {nicheProjects.length}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveTab(niche)}
                                                            className="text-xs font-bold text-[#4d7c0f] dark:text-[#bcf13b] hover:underline flex items-center gap-1 shrink-0 ml-2 py-1"
                                                        >
                                                            <span>Ver todos</span>
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Carrossel Horizontal Deslizavel de Fotos */}
                                                    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-4 -mx-4 scroll-smooth snap-x snap-mandatory no-scrollbar">
                                                        {nicheProjects.map((project) => (
                                                            <div
                                                                key={project.id}
                                                                className="w-[78vw] max-w-[300px] flex-shrink-0 snap-start flex flex-col"
                                                            >
                                                                <Link to={`${effectiveBasePath}/fotografia/${project.slug}`} className="block w-full h-full select-none">
                                                                    {/* Conteiner da Imagem */}
                                                                    <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-md relative bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group hover:border-lime-500 dark:hover:border-[#bcf13b] transition-all duration-300">
                                                                        <img
                                                                            src={project.main_image_url || 'https://via.placeholder.com/800x600'}
                                                                            alt={project.title}
                                                                            className="w-full h-full object-cover"
                                                                            loading="lazy"
                                                                        />
                                                                        <div className="absolute top-2.5 left-2.5">
                                                                            <span className="text-[10px] font-bold text-[#0a0a08] px-2 py-0.5 rounded-full bg-[#bcf13b] uppercase tracking-wider shadow-xs">
                                                                                {nicheLabel}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Informacoes */}
                                                                    <div className="text-center mt-3">
                                                                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                                                                            {project.title}
                                                                        </h3>
                                                                        <span className="text-[10px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-1 inline-flex items-center gap-1 text-[#4d7c0f] dark:text-[#bcf13b]">
                                                                            Ver Galeria <ArrowRight className="w-3 h-3" />
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop: Grid Simétrico Uniforme Tradicional */}
                                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                        <AnimatePresence mode="popLayout">
                                            {filteredProjects.map((project) => {
                                                const niche = getProjectNiche(project);
                                                const nicheLabel = capitalize(niche);
                                                return (
                                                    <motion.div
                                                        key={project.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 20 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="group cursor-pointer flex flex-col"
                                                    >
                                                        <Link to={`${effectiveBasePath}/fotografia/${project.slug}`} className="block w-full">
                                                            {/* Conteiner da Imagem */}
                                                            <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-md relative bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] group-hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:group-hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-500">
                                                                <img
                                                                    src={project.main_image_url || 'https://via.placeholder.com/800x600'}
                                                                    alt={project.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                                {/* Cortina no hover com botao neon */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                    <span className="text-[#0a0a08] text-xs font-bold bg-[#bcf13b] px-4 py-2 rounded-full uppercase tracking-widest scale-95 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-[#bcf13b]/20">
                                                                        Visualizar
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Informacoes Centralizadas */}
                                                            <div className="text-center mt-5 flex flex-col items-center">
                                                                <span className="text-[10px] font-bold text-[#4d7c0f] dark:text-[#bcf13b] uppercase tracking-widest mb-1.5">{nicheLabel}</span>
                                                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors duration-300 leading-tight">
                                                                    {project.title}
                                                                </h3>
                                                                <span className="text-[11px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-2 group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors duration-300">
                                                                    VER GALERIA
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                /* Visualizacao 2: Com Filtro Ativo */
                                <div className="space-y-6">
                                    {/* Barra Informativa do Filtro Ativo */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] shadow-xs">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-semibold text-slate-500 dark:text-gray-400">Exibindo:</span>
                                            <span className="font-bold text-[#4d7c0f] dark:text-[#bcf13b] bg-lime-50 dark:bg-[#bcf13b]/10 border border-lime-200 dark:border-[#bcf13b]/20 px-2.5 py-0.5 rounded-full">
                                                {activeTab !== 'all' ? capitalize(activeTab) : `Busca: "${searchTerm}"`}
                                            </span>
                                            <span className="text-slate-500 font-medium">({filteredProjects.length} {filteredProjects.length === 1 ? 'ensaio' : 'ensaios'})</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActiveTab('all');
                                                setSearchTerm('');
                                            }}
                                            className="text-xs font-bold text-slate-700 hover:text-[#4d7c0f] dark:text-gray-300 dark:hover:text-[#bcf13b] hover:underline flex items-center gap-1 self-start sm:self-auto"
                                        >
                                            <span>Ver todos os nichos</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Grid de Projetos Filtrados */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                        <AnimatePresence mode="popLayout">
                                            {filteredProjects.map((project) => {
                                                const niche = getProjectNiche(project);
                                                const nicheLabel = capitalize(niche);
                                                return (
                                                    <motion.div
                                                        key={project.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 20 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="group cursor-pointer flex flex-col"
                                                    >
                                                        <Link to={`${effectiveBasePath}/fotografia/${project.slug}`} className="block w-full">
                                                            {/* Conteiner da Imagem */}
                                                            <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-md relative bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] group-hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:group-hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-500">
                                                                <img
                                                                    src={project.main_image_url || 'https://via.placeholder.com/800x600'}
                                                                    alt={project.title}
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                                {/* Cortina no hover */}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                    <span className="text-[#0a0a08] text-xs font-bold bg-[#bcf13b] px-4 py-2 rounded-full uppercase tracking-widest scale-95 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-[#bcf13b]/20">
                                                                        Visualizar
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Informacoes Centralizadas */}
                                                            <div className="text-center mt-5 flex flex-col items-center">
                                                                <span className="text-[10px] font-bold text-[#4d7c0f] dark:text-[#bcf13b] uppercase tracking-widest mb-1.5">{nicheLabel}</span>
                                                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors duration-300 leading-tight">
                                                                    {project.title}
                                                                </h3>
                                                                <span className="text-[11px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-2 group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors duration-300">
                                                                    VER GALERIA
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Feedback Vazio */}
                    {!loading && filteredProjects.length === 0 && (
                        <div className="text-center p-12 rounded-2xl max-w-md mx-auto mt-12 border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] shadow-sm">
                            <Camera className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum registro encontrado</h3>
                            <p className="text-slate-600 dark:text-gray-400 mt-2 text-sm font-medium">Tente alterar os termos da busca ou filtre por outro nicho.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PhotographyPortfolio;
