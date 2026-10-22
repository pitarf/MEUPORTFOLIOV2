import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft, ArrowRight, ExternalLink, User, Calendar, Tag, Star, Play, Image as ImageIcon } from 'lucide-react';
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
            .order('display_order', { ascending: true })
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
            // Mapeamento dinâmico de títulos corporativos compactos e refinados
            if (data.category) {
                const slug = (data.category.slug || '').toLowerCase();
                const title = (data.category.title || '').toLowerCase();

                if (slug === 'desenvolvimento-de-sites' || title === 'desenvolvimento de sites') {
                    data.category.title = 'Sites';
                } else if (slug === 'dashboards-em-power-bi' || title === 'dashboards em power bi') {
                    data.category.title = 'Power BI';
                } else if (slug === 'producao-com-ia' || title === 'produção com ia' || title === 'produção ia') {
                    data.category.title = 'Produção IA';
                }
            }
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
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-[#0a0a08]">
                <Loader2 className="h-16 w-16 animate-spin text-[#4d7c0f] dark:text-[#bcf13b]" />
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

    const allGalleryImages = Array.from(new Set([
        ...(project.main_image_url ? [project.main_image_url] : []),
        ...(project.gallery_urls || [])
    ]));

    const [mediaMode, setMediaMode] = useState('auto');
    const firstVideoUrl = (project.video_urls && project.video_urls.length > 0) ? project.video_urls[0] : null;
    const primaryVideoEmbed = firstVideoUrl ? getEmbedUrl(firstVideoUrl) : null;
    const isShowingVideo = primaryVideoEmbed && (mediaMode === 'video' || mediaMode === 'auto');

    return (
        <>
            <SEO 
                title={project.title}
                description={project.description ? (project.description.length > 160 ? `${project.description.substring(0, 157)}...` : project.description) : `Detalhes do projeto ${project.title} desenvolvido por Rafael Pita Solutions.`}
                keywords={`projeto ${project.title}, ${project.client || ''}, ${project.category?.title || ''}, Rafael Pita, portfolio`}
                image={project.main_image_url}
            />

            {isModalOpen && (
                <ImageGalleryModal
                    images={allGalleryImages}
                    startIndex={modalStartIndex}
                    onClose={closeModal}
                />
            )}

            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link
                            to={project.category && project.category.slug === 'fotografia' ? '/portfolio-fotografia/galeria' : '/portfolio'}
                            className="inline-flex items-center text-slate-600 dark:text-gray-400 hover:text-lime-600 dark:hover:text-[#bcf13b] mb-8 transition-colors font-semibold"
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" /> {project.category && project.category.slug === 'fotografia' ? 'Voltar para Galeria' : 'Voltar ao Portfólio'}
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-slate-900 dark:text-white">
                            {project.title}
                        </h1>
                        {project.category && (
                            <div className="flex flex-wrap items-center gap-x-4 text-slate-600 dark:text-gray-400 mb-8 font-semibold">
                                <Link to={`/portfolio?category=${project.category.slug || ''}`} className="text-[#4d7c0f] dark:text-[#bcf13b] hover:underline transition-colors">
                                    {project.category.title || 'Portfólio'}
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {/* Alternador de Midia: Video vs Imagem de Capa */}
                    {primaryVideoEmbed && (
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setMediaMode('video')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm",
                                    isShowingVideo
                                        ? "bg-[#bcf13b] text-[#0a0a08] shadow-lime-500/20"
                                        : "bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:border-lime-500"
                                )}
                            >
                                <Play className="w-4 h-4 fill-current" />
                                <span>Assistir Vídeo / Curta Completo</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMediaMode('image')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm",
                                    !isShowingVideo
                                        ? "bg-[#bcf13b] text-[#0a0a08] shadow-lime-500/20"
                                        : "bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:border-lime-500"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span>Ver Imagem de Capa</span>
                            </button>
                        </div>
                    )}

                    <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                        {isShowingVideo ? (
                            <div className="w-full aspect-video rounded-2xl mb-12 shadow-xl dark:shadow-2xl overflow-hidden border border-slate-200 dark:border-[#23231f] bg-black">
                                <iframe
                                    src={primaryVideoEmbed}
                                    title={`Vídeo oficial de ${project.title}`}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div 
                                className={cn("w-full rounded-2xl mb-12 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden cursor-pointer group relative border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] transition-all duration-300", aspectRatioClasses[mainImageAspectRatio])}
                                onClick={() => openModal(0)}
                            >
                                <img
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    alt={`Imagem principal do projeto ${project.title}`}
                                    src={project.main_image_url || "https://images.unsplash.com/photo-1572177812156-58036aae439c"}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <p className="text-[#0a0a08] text-sm font-bold bg-[#bcf13b] px-4 py-2 rounded-full border border-[#bcf13b]/30 backdrop-blur-sm shadow-lg">
                                        Ver Capa Completa
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
                            {project.description && (
                                <motion.div variants={itemVariants} className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-8 rounded-2xl shadow-sm dark:shadow-none">
                                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                                        Sobre o <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Projeto</span>
                                    </h2>
                                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{project.description}</p>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {project.challenge && (
                                    <motion.div variants={itemVariants} className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-6 rounded-2xl shadow-sm dark:shadow-none">
                                        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                                            O <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Desafio</span>
                                        </h2>
                                        <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-medium">{project.challenge}</p>
                                    </motion.div>
                                )}
                                {project.solution && (
                                    <motion.div variants={itemVariants} className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-6 rounded-2xl shadow-sm dark:shadow-none">
                                        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                                            A <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Solução</span>
                                        </h2>
                                        <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-medium">{project.solution}</p>
                                    </motion.div>
                                )}
                            </div>

                            {project.results && (
                                <motion.div variants={itemVariants} className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-8 rounded-2xl shadow-sm dark:shadow-none">
                                    <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                                        <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Resultados</span>
                                    </h2>
                                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{project.results}</p>
                                </motion.div>
                            )}
                        </motion.div>

                        <aside className="lg:sticky top-24 self-start">
                            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-8 rounded-2xl shadow-sm dark:shadow-none space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Detalhes do Projeto</h3>
                                    <ul className="space-y-3 text-slate-600 dark:text-gray-300 font-semibold text-sm">
                                        <li className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-[#4d7c0f] dark:text-[#bcf13b]" /> 
                                            <span>{project.client}</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-[#4d7c0f] dark:text-[#bcf13b]" /> 
                                            <span>{project.year}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Serviços Prestados</h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {(project.services || [])
                                            .filter(service => typeof service === 'string' && !service.startsWith('subcategoria:') && !service.startsWith('nicho:'))
                                            .map((service, index) => (
                                                <li key={index} className="bg-slate-100 dark:bg-[#181814] text-slate-700 dark:text-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2 border border-slate-200 dark:border-[#23231f] font-bold">
                                                    <Tag className="w-3 h-3 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                                    {service}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                {project.project_url && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                                            {project.project_url.includes('youtu') ? 'Assistir no YouTube' : 'Link do Projeto'}
                                        </h3>
                                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                            <Button className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#bcf13b]/20 hover:scale-[1.02] transition-transform">
                                                {project.project_url.includes('youtu') ? 'Assistir no YouTube Oficial' : 'Visitar Site'} <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        </aside>
                    </div>

                    {project.video_urls && project.video_urls.length > 0 && (
                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mt-20">
                            <h2 className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-white">
                                {project.video_urls.length === 1 ? 'Vídeo Completo' : 'Galeria de'} <span className="text-[#4d7c0f] dark:text-[#bcf13b]">{project.video_urls.length === 1 ? 'em Alta Definição' : 'Vídeos'}</span>
                            </h2>
                            <div className={cn(
                                "gap-8",
                                project.video_urls.length === 1 ? "max-w-4xl mx-auto" : "grid grid-cols-1 md:grid-cols-2"
                            )}>
                                {project.video_urls.map((url, index) => {
                                    const embedUrl = getEmbedUrl(url);
                                    if (!embedUrl) return null;
                                    return (
                                        <motion.div key={index} variants={itemVariants} className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-[#23231f] bg-black shadow-xl">
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

                    {allGalleryImages && allGalleryImages.length > 0 && (
                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mt-20">
                            <h2 className="text-4xl font-bold mb-8 text-center text-slate-900 dark:text-white">
                                Galeria de <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Imagens</span>
                            </h2>
                            <div className={cn("grid gap-4",
                                project.gallery_aspect_ratio === '16:9' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            )}>
                                {allGalleryImages.map((url, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className={cn("relative group overflow-hidden rounded-xl cursor-pointer border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] transition-all duration-300",
                                            aspectRatioClasses[project.gallery_aspect_ratio || '16:9'] || 'aspect-[4/5]'
                                        )}
                                        onClick={() => openModal(index)}
                                    >
                                        <img
                                            src={url}
                                            alt={`Galeria do projeto ${project.title} - ${index + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <p className="text-[#0a0a08] text-sm font-bold bg-[#bcf13b] px-4 py-2 rounded-full border border-[#bcf13b]/30 shadow-lg">
                                                Ver Imagem
                                            </p>
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
                        <div className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] inline-block p-8 rounded-2xl max-w-3xl mx-auto shadow-sm dark:shadow-none">
                            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                                Vamos criar algo <span className="text-[#4d7c0f] dark:text-[#bcf13b]">incrível</span>?
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 mb-8 font-medium text-sm md:text-base">
                                Transforme suas ideias em realidade ou nos conte como foi sua experiência.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contato">
                                    <Button size="lg" className="bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#bcf13b]/20 hover:scale-[1.02] transition-transform w-full sm:w-auto">
                                        Peça seu orçamento
                                    </Button>
                                </Link>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="lg" variant="outline" className="border border-slate-200 dark:border-[#23231f] bg-slate-100 dark:bg-[#181814] text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-[#23231f] hover:text-lime-600 dark:hover:text-[#bcf13b] hover:border-lime-500 dark:hover:border-[#bcf13b] w-full sm:w-auto font-bold shadow-sm transition-all duration-300">
                                            <Star className="mr-2 h-4 w-4 text-[#4d7c0f] dark:text-[#bcf13b] fill-current" /> Deixar Avaliação
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white">
                                        <DialogHeader>
                                             <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                                                Sua opinião é <span className="text-[#4d7c0f] dark:text-[#bcf13b]">importante</span>
                                            </DialogTitle>
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
                        className="flex justify-between items-center mt-20 pt-8 border-t border-slate-200 dark:border-[#23231f]"
                    >
                        {prevProject ? (
                            <Link to={`/portfolio/${prevProject.category?.slug || 'geral'}/${prevProject.slug}`}>
                                <Button variant="outline" className="border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#181814] hover:text-lime-600 dark:hover:text-[#bcf13b] hover:border-lime-500 dark:hover:border-[#bcf13b] font-bold transition-all shadow-sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Projeto Anterior
                                </Button>
                            </Link>
                        ) : <div />}
                        {nextProject ? (
                            <Link to={`/portfolio/${nextProject.category?.slug || 'geral'}/${nextProject.slug}`}>
                                <Button variant="outline" className="border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#181814] hover:text-lime-600 dark:hover:text-[#bcf13b] hover:border-lime-500 dark:hover:border-[#bcf13b] font-bold transition-all shadow-sm">
                                    Próximo Projeto <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : <div />}
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ProjectPage;