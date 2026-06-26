import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { ExternalLink, ArrowRight, Camera, Loader2, ArrowLeft, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useSearchParams } from 'react-router-dom';
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
const PhotographyPortfolio = () => {
    const { theme } = useTheme();
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
        const nichesSet = new Set(['casamentos', 'ensaios', 'eventos']); // Inicia com os nichos padrão
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

        // Obter o ID da categoria de fotografia
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

        // 1. Filtrar por Especialidade (Aba)
        if (activeTab !== 'all') {
            result = result.filter(p => getProjectNiche(p) === activeTab);
        }

        // 2. Filtrar por Busca de Texto
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

            <div className="pt-24 pb-20 min-h-screen bg-background text-foreground transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header e Navegação */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="space-y-3">
                            <Link to="/portfolio-fotografia">
                                <Button variant="ghost" className="text-slate-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white mb-2 pl-0 font-bold">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Home de Fotografia
                                </Button>
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3.5">
                                <Camera className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                                <span className="gradient-text">Galeria de Arte</span>
                            </h1>
                            <p className="text-base md:text-xl text-slate-600 dark:text-gray-400 font-semibold leading-relaxed">
                                Registros artísticos e cases selecionados com acabamento de excelência.
                            </p>
                        </div>

                        {/* Barra de Pesquisa */}
                        <div className="w-full md:w-80 relative flex-shrink-0">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                            <Input
                                placeholder="Buscar nos cliques..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-semibold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filtros em Abas Deslizantes (Framer Motion) */}
                    <div className="glass-effect rounded-2xl p-3 border border-gray-200/50 dark:border-white/10 shadow-lg backdrop-blur-xl bg-white/60 dark:bg-gray-900/40 mb-12 flex flex-wrap gap-2 justify-center md:justify-start">
                        {tabs.map((tab) => {
                            if (tab.count === 0 && tab.id !== 'all') return null; // Oculta abas sem projetos
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-2 rounded-xl text-xs md:text-[13px] font-bold flex items-center gap-1.5 transition-colors duration-300 z-10 ${
                                        activeTab === tab.id
                                            ? 'text-white'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                                >
                                    {activeTab === tab.id && (
                                        <motion.span
                                            layoutId="activePhotoTabBackground"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl -z-10 shadow-md shadow-blue-500/15"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    {tab.title}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                                        activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
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
                            <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        /* Grid Simétrico Uniforme Premium */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.map((project, index) => {
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
                                            <Link to={`/portfolio/fotografia/${project.slug}`} className="block w-full">
                                                {/* Contêiner da Imagem com proporção regular 3/2 */}
                                                <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-md relative bg-slate-100 dark:bg-gray-800 border border-gray-200/50 dark:border-white/10 group-hover:border-blue-500/30 group-hover:shadow-2xl transition-all duration-500">
                                                    <img
                                                        src={project.main_image_url || 'https://via.placeholder.com/800x600'}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    {/* Cortina escura ultra-sutil no hover */}
                                                    <div className="absolute inset-0 bg-black/10 dark:bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 uppercase tracking-widest scale-95 group-hover:scale-100 transition-all duration-300">
                                                            Visualizar
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Informações Centralizadas por Baixo do Card */}
                                                <div className="text-center mt-5 flex flex-col items-center">
                                                    <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1.5">{nicheLabel}</span>
                                                    <h3 className="text-lg md:text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                                                        {project.title}
                                                    </h3>
                                                    <span className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                        VER GALERIA
                                                    </span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Feedback Vazio */}
                    {!loading && filteredProjects.length === 0 && (
                        <div className="text-center glass-effect p-12 rounded-2xl max-w-md mx-auto mt-12 border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30">
                            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nenhum registro encontrado</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-semibold">Tente alterar os termos da busca ou filtre por outro nicho.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PhotographyPortfolio;
