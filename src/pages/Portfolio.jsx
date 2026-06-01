import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, ArrowRight, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield, Loader2, Filter, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const icons = { Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield };

const PortfolioSection = ({ icon, title, description, projects, color, slug }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const Icon = icons[icon] || Code;
    const ITEMS_PER_PAGE = 8;

    // Reset page when projects change (e.g. filtering)
    useEffect(() => {
        setCurrentPage(0);
    }, [projects.length]);

    if (projects.length === 0) return null;

    const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
    const visibleProjects = projects.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    useEffect(() => {
        if (totalPages <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentPage(prev => (prev + 1) % totalPages);
        }, 4000);

        return () => clearInterval(interval);
    }, [totalPages, isPaused]);

    const handlePrevPage = () => {
        setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
    };

    const handleNextPage = () => {
        setCurrentPage(prev => (prev + 1) % totalPages);
    };

    return (
        <section
            id={slug}
            className="py-20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col md:flex-row items-center gap-8 mb-12"
                >
                    <div className={`w-20 h-20 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {title} <span className="text-2xl text-gray-500 font-normal ml-2"> • {projects.length}</span>
                        </h2>
                        <p className="text-base text-gray-400 max-w-3xl">{description}</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {visibleProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 aspect-[16/11] cursor-pointer"
                        >
                            <Link to={`/portfolio/${slug}/${project.slug}`} className="block h-full w-full">
                                {/* Image Background */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        src={project.main_image_url || 'https://images.unsplash.com/photo-1572177812156-58036aae439c'}
                                        loading="lazy"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                            <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                                                {project.description}
                                            </p>
                                            <span className="inline-flex items-center text-xs font-bold text-blue-400 uppercase tracking-wider">
                                                Ver Projeto <ArrowRight className="ml-1 w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Top Right Decoration */}
                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                                        <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <Button
                            onClick={handlePrevPage}
                            variant="outline"
                            size="icon"
                            className="border-gray-600 hover:border-blue-500 hover:text-blue-400 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                        </Button>

                        <span className="text-gray-400 text-sm">
                            Página {currentPage + 1} de {totalPages}
                        </span>

                        <Button
                            onClick={handleNextPage}
                            variant="outline"
                            size="icon"
                            className="border-gray-600 hover:border-blue-500 hover:text-blue-400 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

const Portfolio = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filters, setFilters] = useState({ search: '', category: 'all' });
    const [searchInputValue, setSearchInputValue] = useState('');

    const fetchPortfolioData = useCallback(async () => {
        setLoading(true);
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id, slug, title, description, icon, color')
            .neq('slug', 'fotografia')
            .order('id');

        if (catError) {
            console.error('Error fetching categories:', catError);
            setLoading(false);
            return;
        }
        setAllCategories(categories);

        let projectsQuery = supabase.from('projects').select('*');

        if (filters.search) {
            projectsQuery = projectsQuery.ilike('title', `%${filters.search}%`);
        }
        if (filters.category !== 'all') {
            projectsQuery = projectsQuery.eq('category_id', filters.category);
        }

        const { data: projects, error: projError } = await projectsQuery;

        if (projError) {
            console.error('Error fetching projects:', projError);
            setLoading(false);
            return;
        }

        const dataWithProjects = categories
            .map(category => ({
                ...category,
                projects: projects.filter(p => p.category_id === category.id),
            }))
            .filter(category => filters.category === 'all' || filters.category === category.id);

        setFilteredData(dataWithProjects);
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        fetchPortfolioData();
    }, [fetchPortfolioData]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchInputValue }));
    };

    const handleCategoryFilterChange = (categoryId) => {
        setFilters(prev => ({ ...prev, category: categoryId }));
    };

    const clearFilters = () => {
        setSearchInputValue('');
        setFilters({ search: '', category: 'all' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Portfólio - Rafael Pita Solutions</title>
                <meta name="description" content="Conheça nossos projetos em design, desenvolvimento web, fotografia, vídeos, dashboards e muito mais. Veja a qualidade e criatividade do nosso trabalho." />
            </Helmet>

            <div className="pt-20">
                <section className="py-20 tech-pattern relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="gradient-text">Nosso Portfólio</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Explore a excelência e a inovação em cada projeto que realizamos.
                            </p>
                            <Button onClick={() => setIsFilterVisible(!isFilterVisible)} className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20">
                                <Filter className="mr-2 h-4 w-4" /> {isFilterVisible ? 'Esconder Filtros' : 'Filtrar Projetos'}
                            </Button>
                        </motion.div>
                    </div>
                    <AnimatePresence>
                        {isFilterVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8"
                            >
                                <div className="glass-effect p-6 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                        <form onSubmit={handleSearchSubmit} className="space-y-2">
                                            <Label htmlFor="search-filter">Buscar por nome</Label>
                                            <div className="flex gap-2">
                                                <Input id="search-filter" placeholder="Nome do projeto..." value={searchInputValue} onChange={(e) => setSearchInputValue(e.target.value)} />
                                                <Button type="submit" size="icon"><Search className="h-4 w-4" /></Button>
                                            </div>
                                        </form>
                                        <div className="space-y-2">
                                            <Label>Categorias</Label>
                                            <Select value={filters.category} onValueChange={handleCategoryFilterChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todas as Categorias</SelectItem>
                                                    {allCategories.map(category => (
                                                        <SelectItem key={category.id} value={category.id}>{category.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Limpar Filtros</Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {filteredData.map((sectionData) => (
                    <PortfolioSection key={sectionData.id} {...sectionData} />
                ))}

                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                Gostou do que viu?
                            </h2>
                            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                                Vamos transformar sua ideia em um projeto de sucesso. Entre em contato e solicite um orçamento sem compromisso.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contato">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
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