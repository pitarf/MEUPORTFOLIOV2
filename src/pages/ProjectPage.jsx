import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, ArrowLeft, ArrowRight, ExternalLink, User, Calendar, Tag, Star, Play, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
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

const ProjectPage = ({ cleanMode: propCleanMode, basePath: propBasePath }) => {
    const { projectSlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Detecta se a página está no modo limpo para propostas externas
    const isCleanMode = Boolean(
        propCleanMode ||
        location.pathname.startsWith('/portfolio-v3') ||
        location.pathname.startsWith('/portfolio/v3') ||
        location.pathname.startsWith('/projetos-v3')
    );
    const effectiveBasePath = propBasePath || (isCleanMode ? '/portfolio-v3' : '/portfolio');

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allProjects, setAllProjects] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStartIndex, setModalStartIndex] = useState(0);
    const [mediaMode, setMediaMode] = useState('auto');

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
            navigate(effectiveBasePath);
        } else {
            // Mapeamento dinâmico de títulos corporativos compactos e refinados
            if (data.category) {
                const slug = (data.category.slug || '').toLowerCase();
                const title = (data.category.title || '').toLowerCase();

                if (slug === 'desenvolvimento-de-sites' || title === 'desenvolvimento de sites') {
                    data.category.title = 'Desenvolvedor';
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
    }, [projectSlug, navigate, effectiveBasePath]);

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
            <div className="flex justify-center items-center h-screen bg-[#070707]">
                <Loader2 className="h-16 w-16 animate-spin text-[#ECBD57] dark:text-[#C9A227]" />
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
        '3:2': 'aspect-[3/2]',
    };
    const mainImageAspectRatio = project.main_image_aspect_ratio || '16:9';

    // Identificação amigável de pranchas de personagens e mídias
    const getPhotoLabel = (url) => {
        if (typeof url !== 'string') return null;
        const lower = url.toLowerCase();
        if (lower.includes('capa-o-nascimento-da-moda') || lower.includes('capa')) return 'Cena Principal : Diálogo com Gilles Lipovetsky';
        if (lower.includes('estudante')) return 'Prancha de Consistência : A Estudante';
        if (lower.includes('joao-braga')) return 'Prancha de Consistência : Prof. João Braga';
        if (lower.includes('lipovetsky')) return 'Prancha de Consistência : Gilles Lipovetsky';
        if (lower.includes('simmel')) return 'Prancha de Consistência : Georg Simmel';
        if (lower.includes('youtube.com') || lower.includes('maxresdefault')) return 'Cena de Abertura / Encontro na Biblioteca';
        return null;
    };

    // Normalização defensiva de galerias e vídeos
    const normalizedGalleryUrls = Array.isArray(project.gallery_urls)
        ? project.gallery_urls
        : (typeof project.gallery_urls === 'string' && project.gallery_urls.trim()
            ? (project.gallery_urls.startsWith('[') ? JSON.parse(project.gallery_urls) : project.gallery_urls.split(',').map(u => u.trim()))
            : []);

    const allGalleryImages = Array.from(new Set([
        ...(project.main_image_url ? [project.main_image_url] : []),
        ...normalizedGalleryUrls
    ]));

    const normalizedVideoUrls = Array.isArray(project.video_urls)
        ? project.video_urls
        : (typeof project.video_urls === 'string' && project.video_urls.trim()
            ? (project.video_urls.startsWith('[') ? JSON.parse(project.video_urls) : project.video_urls.split(',').map(u => u.trim()))
            : []);

    const firstVideoUrl = (normalizedVideoUrls && normalizedVideoUrls.length > 0) ? normalizedVideoUrls[0] : null;
    const primaryVideoEmbed = firstVideoUrl ? getEmbedUrl(firstVideoUrl) : null;
    const isShowingVideo = primaryVideoEmbed && (mediaMode === 'video' || mediaMode === 'auto');

    return (
        <>
            <SEO 
                title={project.title}
                description={project.description ? (project.description.length > 160 ? `${project.description.substring(0, 157)}...` : project.description) : `Detalhes do projeto ${project.title} desenvolvido por RAMIELL.`}
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

            <div className="min-h-screen bg-[#070707] text-white transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link
                            to={project.category && project.category.slug === 'fotografia' ? '/portfolio-fotografia/galeria' : effectiveBasePath}
                            className="inline-flex items-center text-[#9E9E9E] hover:text-lime-600 dark:hover:text-[#C9A227] mb-8 transition-colors font-semibold"
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" /> {project.category && project.category.slug === 'fotografia' ? 'Voltar para Galeria' : (isCleanMode ? 'Voltar à Vitrine' : 'Voltar ao Portfólio')}
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-white">
                            {project.title}
                        </h1>
                        {project.category && (
                            <div className="flex flex-wrap items-center gap-x-4 text-[#9E9E9E] mb-8 font-semibold">
                                <Link to={`${effectiveBasePath}?category=${project.category.slug || ''}`} className="text-[#ECBD57] dark:text-[#C9A227] hover:underline transition-colors">
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
                                        ? "bg-[#C9A227] text-[#0a0a08] shadow-lime-500/20"
                                        : "bg-[#0B0B0B] border border-white/[0.06] text-[#9E9E9E] hover:border-lime-500"
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
                                        ? "bg-[#C9A227] text-[#0a0a08] shadow-lime-500/20"
                                        : "bg-[#0B0B0B] border border-white/[0.06] text-[#9E9E9E] hover:border-lime-500"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span>Ver Imagem de Capa</span>
                            </button>
                        </div>
                    )}

                    <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                        {isShowingVideo ? (
                            <div className="w-full aspect-video rounded-2xl mb-12 shadow-xl dark:shadow-2xl overflow-hidden border border-white/[0.06] bg-black">
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
                                className={cn("w-full rounded-2xl mb-12 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden cursor-pointer group relative border border-white/[0.06] hover:border-lime-500 dark:hover:border-[#C9A227] transition-all duration-300", aspectRatioClasses[mainImageAspectRatio])}
                                onClick={() => openModal(0)}
                            >
                                <img
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    alt={`Imagem principal do projeto ${project.title}`}
                                    src={project.main_image_url || "https://images.unsplash.com/photo-1572177812156-58036aae439c"}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <p className="text-[#0a0a08] text-sm font-bold bg-[#C9A227] px-4 py-2 rounded-full border border-[#C9A227]/30 backdrop-blur-sm shadow-lg">
                                        Ver Capa Completa
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
                            {project.description && (
                                <motion.div variants={itemVariants} className="bg-[#0B0B0B] border border-white/[0.06] p-8 rounded-2xl shadow-sm dark:shadow-none">
                                    <h2 className="text-3xl font-bold mb-4 text-white">
                                        Sobre o <span className="text-[#ECBD57] dark:text-[#C9A227]">Projeto</span>
                                    </h2>
                                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{project.description}</p>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {project.challenge && (
                                    <motion.div variants={itemVariants} className="bg-[#0B0B0B] border border-white/[0.06] p-6 rounded-2xl shadow-sm dark:shadow-none">
                                        <h2 className="text-2xl font-bold mb-3 text-white">
                                            O <span className="text-[#ECBD57] dark:text-[#C9A227]">Desafio</span>
                                        </h2>
                                        <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-medium">{project.challenge}</p>
                                    </motion.div>
                                )}
                                {project.solution && (
                                    <motion.div variants={itemVariants} className="bg-[#0B0B0B] border border-white/[0.06] p-6 rounded-2xl shadow-sm dark:shadow-none">
                                        <h2 className="text-2xl font-bold mb-3 text-white">
                                            A <span className="text-[#ECBD57] dark:text-[#C9A227]">Solução</span>
                                        </h2>
                                        <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-medium">{project.solution}</p>
                                    </motion.div>
                                )}
                            </div>

                            {project.results && (
                                <motion.div variants={itemVariants} className="bg-[#0B0B0B] border border-white/[0.06] p-8 rounded-2xl shadow-sm dark:shadow-none">
                                    <h2 className="text-3xl font-bold mb-4 text-white">
                                        <span className="text-[#ECBD57] dark:text-[#C9A227]">Resultados</span>
                                    </h2>
                                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{project.results}</p>
                                </motion.div>
                            )}
                        </motion.div>

                        <aside className="lg:sticky top-24 self-start">
                            <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-[#0B0B0B] border border-white/[0.06] p-8 rounded-2xl shadow-sm dark:shadow-none space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-white">Detalhes do Projeto</h3>
                                    <ul className="space-y-3 text-slate-600 dark:text-gray-300 font-semibold text-sm">
                                        <li className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-[#ECBD57] dark:text-[#C9A227]" /> 
                                            <span>{project.client}</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-[#ECBD57] dark:text-[#C9A227]" /> 
                                            <span>{project.year}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-white">Serviços Prestados</h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {(Array.isArray(project.services)
                                            ? project.services
                                            : (typeof project.services === 'string' && project.services.trim()
                                                ? (project.services.startsWith('[') ? JSON.parse(project.services) : project.services.split(',').map(s => s.trim()))
                                                : []))
                                            .filter(service => typeof service === 'string' && !service.startsWith('subcategoria:') && !service.startsWith('nicho:'))
                                            .map((service, index) => (
                                                <li key={index} className="bg-slate-100 dark:bg-[#181814] text-slate-700 dark:text-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2 border border-white/[0.06] font-bold">
                                                    <Tag className="w-3 h-3 text-[#ECBD57] dark:text-[#C9A227]" />
                                                    {service}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                {project.project_url && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-white">
                                            {project.project_url.includes('youtu') ? 'Assistir no YouTube' : 'Link do Projeto'}
                                        </h3>
                                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                            <Button className="w-full bg-[#C9A227] hover:bg-[#ECBD57] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#C9A227]/20 hover:scale-[1.02] transition-transform">
                                                {project.project_url.includes('youtu') ? 'Assistir no YouTube Oficial' : 'Visitar Site'} <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        </aside>
                    </div>

                    {normalizedVideoUrls && normalizedVideoUrls.length > 0 && (
                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="mt-20">
                            <h2 className="text-4xl font-bold mb-8 text-center text-white">
                                {normalizedVideoUrls.length === 1 ? 'Vídeo Completo' : 'Galeria de'} <span className="text-[#ECBD57] dark:text-[#C9A227]">{normalizedVideoUrls.length === 1 ? 'em Alta Definição' : 'Vídeos'}</span>
                            </h2>
                            <div className={cn(
                                "gap-8",
                                normalizedVideoUrls.length === 1 ? "max-w-4xl mx-auto" : "grid grid-cols-1 md:grid-cols-2"
                            )}>
                                {normalizedVideoUrls.map((url, index) => {
                                    const embedUrl = getEmbedUrl(url);
                                    if (!embedUrl) return null;
                                    return (
                                        <motion.div key={index} variants={itemVariants} className="aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-black shadow-xl">
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
                            <h2 className="text-4xl font-bold mb-8 text-center text-white">
                                {project.category && (project.category.slug === 'videos-com-ia' || project.category.slug === 'producao-com-ia')
                                    ? <span>Pranchas de <span className="text-[#ECBD57] dark:text-[#C9A227]">Personagens & Mídia</span></span>
                                    : <span>Galeria de <span className="text-[#ECBD57] dark:text-[#C9A227]">Imagens</span></span>}
                            </h2>
                            <div className={cn("grid gap-6",
                                (project.gallery_aspect_ratio === '16:9' || project.gallery_aspect_ratio === '3:2')
                                    ? "grid-cols-1 md:grid-cols-2"
                                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            )}>
                                {allGalleryImages.map((url, index) => {
                                    const photoLabel = getPhotoLabel(url);
                                    return (
                                        <motion.div
                                            key={index}
                                            variants={itemVariants}
                                            className={cn("relative group overflow-hidden rounded-2xl cursor-pointer border border-white/[0.06] bg-[#0B0B0B] hover:border-lime-500 dark:hover:border-[#C9A227] transition-all duration-300 shadow-md",
                                                aspectRatioClasses[project.gallery_aspect_ratio || '16:9'] || 'aspect-[4/5]'
                                            )}
                                            onClick={() => openModal(index)}
                                        >
                                            <img
                                                src={url}
                                                alt={photoLabel || `Galeria do projeto ${project.title} - ${index + 1}`}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* Rótulo permanente de identificação do personagem */}
                                            {photoLabel && (
                                                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white shadow-lg pointer-events-none">
                                                    <span className="text-[#C9A227] mr-1.5 font-black">●</span>
                                                    {photoLabel}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <p className="text-[#0a0a08] text-sm font-bold bg-[#C9A227] px-4 py-2 rounded-full border border-[#C9A227]/30 shadow-lg">
                                                    Ampliar Imagem
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-20 text-center"
                    >
                        <div className="bg-[#0B0B0B] border border-white/[0.06] inline-block p-8 rounded-2xl max-w-3xl mx-auto shadow-sm dark:shadow-none">
                            <h3 className="text-2xl font-bold mb-4 text-white">
                                Vamos criar algo <span className="text-[#ECBD57] dark:text-[#C9A227]">incrível</span>?
                            </h3>
                            <p className="text-[#9E9E9E] mb-8 font-medium text-sm md:text-base">
                                Transforme suas ideias em realidade ou nos conte como foi sua experiência.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {isCleanMode ? (
                                    <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-lime-500/10 text-lime-700 dark:text-[#C9A227] border border-lime-500/20 text-sm font-bold shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-lime-600 dark:text-[#C9A227]" />
                                        <span>Responda à nossa proposta diretamente no 99freelas para alinharmos seu projeto!</span>
                                    </div>
                                ) : (
                                    <Link to="/contato">
                                        <Button size="lg" className="bg-[#C9A227] hover:bg-[#ECBD57] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#C9A227]/20 hover:scale-[1.02] transition-transform w-full sm:w-auto">
                                            Peça seu orçamento
                                        </Button>
                                    </Link>
                                )}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="lg" variant="outline" className="border border-white/[0.06] bg-slate-100 dark:bg-[#181814] text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-[#23231f] hover:text-lime-600 dark:hover:text-[#C9A227] hover:border-lime-500 dark:hover:border-[#C9A227] w-full sm:w-auto font-bold shadow-sm transition-all duration-300">
                                            <Star className="mr-2 h-4 w-4 text-[#ECBD57] dark:text-[#C9A227] fill-current" /> Deixar Avaliação
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl bg-[#0B0B0B] border-white/[0.06] text-white">
                                        <DialogHeader>
                                             <DialogTitle className="text-2xl font-bold text-white">
                                                Sua opinião é <span className="text-[#ECBD57] dark:text-[#C9A227]">importante</span>
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
                        className="flex justify-between items-center mt-20 pt-8 border-t border-white/[0.06]"
                    >
                        {prevProject ? (
                            <Link to={`${effectiveBasePath}/${prevProject.category?.slug || 'geral'}/${prevProject.slug}`}>
                                <Button variant="outline" className="border border-white/[0.06] bg-[#0B0B0B] text-[#9E9E9E] hover:bg-slate-100 dark:hover:bg-[#181814] hover:text-lime-600 dark:hover:text-[#C9A227] hover:border-lime-500 dark:hover:border-[#C9A227] font-bold transition-all shadow-sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Projeto Anterior
                                </Button>
                            </Link>
                        ) : <div />}
                        {nextProject ? (
                            <Link to={`${effectiveBasePath}/${nextProject.category?.slug || 'geral'}/${nextProject.slug}`}>
                                <Button variant="outline" className="border border-white/[0.06] bg-[#0B0B0B] text-[#9E9E9E] hover:bg-slate-100 dark:hover:bg-[#181814] hover:text-lime-600 dark:hover:text-[#C9A227] hover:border-lime-500 dark:hover:border-[#C9A227] font-bold transition-all shadow-sm">
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