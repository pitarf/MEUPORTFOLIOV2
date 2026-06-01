import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, ArrowRight, Camera, Loader2, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const PhotographyPortfolio = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPhotographyProjects = useCallback(async () => {
        setLoading(true);

        // First get the category ID for 'fotografia'
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

        let query = supabase
            .from('projects')
            .select('*')
            .eq('category_id', categoryData.id)
            .order('created_at', { ascending: false });

        if (searchTerm) {
            query = query.ilike('title', `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching photography projects:', error);
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    }, [searchTerm]);

    useEffect(() => {
        fetchPhotographyProjects();
    }, [fetchPhotographyProjects]);

    return (
        <>
            <Helmet>
                <title>Galeria de Fotografia - Rafael Pita Solutions</title>
                <meta name="description" content="Explore nossa galeria completa de fotografia. Casamentos, eventos, ensaios e muito mais." />
            </Helmet>

            <div className="pt-24 pb-20 min-h-screen bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="mb-6 md:mb-0">
                            <Link to="/portfolio-fotografia">
                                <Button variant="ghost" className="text-gray-400 hover:text-white mb-4 pl-0">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Home de Fotografia
                                </Button>
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                <Camera className="inline-block mr-4 w-10 h-10 text-blue-500" />
                                Galeria de Projetos
                            </h1>
                            <p className="text-xl text-gray-400">
                                Todos os nossos registros em um só lugar.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="w-full md:w-auto relative">
                            <Input
                                placeholder="Buscar projetos..."
                                className="bg-gray-900 border-gray-800 text-white min-w-[300px] pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div>

                    {/* Minimalist Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            <AnimatePresence>
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="group cursor-pointer"
                                    >
                                        <Link to={`/portfolio/fotografia/${project.slug}`} className="block">
                                            <div className="overflow-hidden rounded-sm mb-4 relative aspect-[3/2]">
                                                <img
                                                    src={project.main_image_url || 'https://via.placeholder.com/800x600'}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            <div className="text-center">
                                                <h3 className="text-xl font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm uppercase tracking-widest text-xs">
                                                    Ver Galeria
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {!loading && projects.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">Nenhum projeto encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PhotographyPortfolio;
