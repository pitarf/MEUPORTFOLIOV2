import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft, ArrowRight, ExternalLink, User, Calendar, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageGalleryModal from '@/components/ImageGalleryModal';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ReviewForm from '@/components/ReviewForm';

const getEmbedUrl = (url) => {
    let embedUrl = '';
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1].split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    return embedUrl;
};

const ProjectPage = () => {
    const { projectSlug } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allProjects, setAllProjects] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStartIndex, setModalStartIndex] = useState(0);

    const fetchProjectData = useCallback(async () => {
        setLoading(true);

        const { data: allData, error: allError } = await supabase
            .from('projects')
            .select('id, slug, title, category:categories(slug)')
            .order('created_at', { ascending: false });

        if (allError) {
            console.error("Error fetching all projects:", allError);
            setLoading(false);
            return;
        }
        setAllProjects(allData);

        const { data, error } = await supabase
            .from('projects')
            .select('*, category:categories(title, slug)')
            .eq('slug', projectSlug)
            .single();

        if (error || !data) {
            console.error('Error fetching project:', error);
            navigate('/portfolio');
        } else {
            setProject(data);
            const currentIdx = allData.findIndex(p => p.slug === data.slug);
            setCurrentIndex(currentIdx);
        }
        setLoading(false);
    }, [projectSlug, navigate]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const openModal = (index) => {
        setModalStartIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!project) {
        return null;
    }

    const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const aspectRatioClasses = {
        '16:9': 'aspect-video',
        '9:16': 'aspect-[9/16] max-w-md mx-auto',
        '4:3': 'aspect-[4/3]',
        '3:4': 'aspect-[3/4] max-w-lg mx-auto',
        '1:1': 'aspect-square max-w-2xl mx-auto',
        '4:5': 'aspect-[4/5] max-w-sm mx-auto',
    };
    const mainImageAspectRatio = project.main_image_aspect_ratio || '16:9';

    return (
        <>
            <Helmet>
                <title>{`${project.title} - Portfólio`}</title>
                <meta name="description" content={project.description} />
            </Helmet>

            {isModalOpen && (
                <ImageGalleryModal
                    images={project.gallery_urls}
                    startIndex={modalStartIndex}
                    onClose={closeModal}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link
                        to={project.category && project.category.slug === 'fotografia' ? '/portfolio-fotografia/galeria' : '/portfolio'}
                        className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="mr-2" /> {project.category && project.category.slug === 'fotografia' ? 'Voltar para Galeria' : 'Voltar ao Portfólio'}
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2">
                        <span className="gradient-text">{project.title}</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 text-gray-400 mb-8">
                        <Link to={`/portfolio?category=${project.category.slug}`} className="hover:text-blue-400 transition-colors">{project.category.title}</Link>
                    </div>
                </motion.div>

                <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                    <div className={cn("w-full rounded-2xl mb-12 shadow-2xl shadow-black/30 overflow-hidden", aspectRatioClasses[mainImageAspectRatio])}>
                        <img
                            className="w-full h-full object-cover"
                            alt={`Imagem principal do projeto ${project.title}`}
                            src={project.main_image_url || "https://images.unsplash.com/photo-1572177812156-58036aae439c"}
                            loading="lazy"
                        />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
                        {project.description && (
                            <motion.div variants={itemVariants} className="glass-effect p-8 rounded-2xl">
                                <h2 className="text-3xl font-bold mb-4 gradient-text">Sobre o Projeto</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.challenge && (
                                <motion.div variants={itemVariants} className="glass-effect p-6 rounded-2xl">
                                    <h2 className="text-2xl font-bold mb-3 gradient-text">O Desafio</h2>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{project.challenge}</p>
                                </motion.div>
                            )}
                            {project.solution && (
                                <motion.div variants={itemVariants} className="glass-effect p-6 rounded-2xl">
                                    <h2 className="text-2xl font-bold mb-3 gradient-text">A Solução</h2>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{project.solution}</p>
                                </motion.div>
                            )}
                        </div>

                        {project.results && (
                            <motion.div variants={itemVariants} className="glass-effect p-8 rounded-2xl">
                                <h2 className="text-3xl font-bold mb-4 gradient-text">Resultados</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.results}</p>
                            </motion.div>
                        )}
                    </motion.div>

                    <aside className="lg:sticky top-24 self-start">
                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="glass-effect p-8 rounded-2xl space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4">Detalhes do Projeto</h3>
                                <ul className="space-y-3 text-gray-300">
                                    <li className="flex items-center gap-3"><User className="w-5 h-5 text-blue-400" /> <span>{project.client}</span></li>
                                    <li className="flex items-center gap-3"><Calendar className="w-5 h-5 text-blue-400" /> <span>{project.year}</span></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-4">Serviços Prestados</h3>
                                <ul className="flex flex-wrap gap-2">
                                    {project.services.map((service, index) => (
                                        <li key={index} className="bg-gray-700/50 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center gap-2"><Tag className="w-3 h-3" />{service}</li>
                                    ))}
                                </ul>
                            </div>
                            {project.project_url && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Link do Projeto</h3>
                                    <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition-transform">
                                            Visitar Site <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </aside>
                </div>

                {project.video_urls && project.video_urls.length > 0 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mt-20">
                        <h2 className="text-4xl font-bold mb-8 text-center gradient-text">Galeria de Vídeos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.video_urls.map((url, index) => {
                                const embedUrl = getEmbedUrl(url);
                                if (!embedUrl) return null;
                                return (
                                    <motion.div key={index} variants={itemVariants} className="aspect-video">
                                        <iframe
                                            src={embedUrl}
                                            title={`Vídeo do projeto ${project.title} - ${index + 1}`}
                                            className="w-full h-full rounded-lg shadow-lg"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {project.gallery_urls && project.gallery_urls.length > 0 && (
                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mt-20">
                        <h2 className="text-4xl font-bold mb-8 text-center gradient-text">Galeria de Imagens</h2>
                        <div className={cn("grid gap-4",
                            project.gallery_aspect_ratio === '16:9' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        )}>
                            {project.gallery_urls.map((url, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className={cn("relative group overflow-hidden rounded-lg cursor-pointer",
                                        aspectRatioClasses[project.gallery_aspect_ratio || '16:9'] || 'aspect-[4/5]'
                                    )}
                                    onClick={() => openModal(index)}
                                >
                                    <img
                                        src={url}
                                        alt={`Galeria do projeto ${project.title} - ${index + 1}`}
                                        className=" h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <p className="text-white text-lg font-bold">Ver Imagem</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-20 text-center"
                >
                    <div className="glass-effect inline-block p-8 rounded-2xl max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4 gradient-text">Vamos criar algo incrível?</h3>
                        <p className="text-gray-400 mb-8">Transforme suas ideias em realidade ou nos conte como foi sua experiência.</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contato">
                                <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-600 hover:scale-105 transition-transform w-full sm:w-auto">
                                    Peça seu orçamento
                                </Button>
                            </Link>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg" variant="outline" className="border-gray-600 hover:border-blue-500 w-full sm:w-auto hover:bg-gray-800 text-white">
                                        <Star className="mr-2 h-4 w-4" /> Deixar Avaliação
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold gradient-text">Sua opinião é importante</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <ReviewForm />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-between items-center mt-20 pt-8 border-t border-gray-800"
                >
                    {prevProject ? (
                        <Link to={`/portfolio/${prevProject.category.slug}/${prevProject.slug}`}>
                            <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Projeto Anterior
                            </Button>
                        </Link>
                    ) : <div />}
                    {nextProject ? (
                        <Link to={`/portfolio/${nextProject.category.slug}/${nextProject.slug}`}>
                            <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                                Próximo Projeto <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    ) : <div />}
                </motion.div>
            </div>
        </>
    );
};

export default ProjectPage;