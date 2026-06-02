import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCarousel from '@/components/ProjectCarousel';
import { supabase } from '@/lib/customSupabaseClient';
import { useTheme } from '@/contexts/ThemeContext';


/**
 * Mapeamento e classificação dinâmica inteligente de nichos
 */
const getProjectNiche = (project) => {
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
 * NicheSlideshow Component
 * Apresenta uma transição suave e automática de fotos para uma determinada especialidade.
 * Se não houver fotos personalizadas, faz o fallback para uma imagem padrão.
 */
const NicheSlideshow = ({ images, defaultImage, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);

    useEffect(() => {
        if (images && images.length > 0) {
            setLoadedImages(images);
        } else {
            setLoadedImages([defaultImage]);
        }
    }, [images, defaultImage]);

    useEffect(() => {
        if (loadedImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % loadedImages.length);
        }, 4000); // Suavidade a cada 4s
        return () => clearInterval(interval);
    }, [loadedImages]);

    return (
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl bg-slate-100 dark:bg-gray-800 group">
            {loadedImages.map((img, index) => (
                <div
                    key={img + '-' + index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                        index === currentIndex 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                >
                    <img
                        src={img}
                        alt={`${title} - Slide ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-110"
                        loading="lazy"
                    />
                </div>
            ))}
            {/* Cortina escura sutil */}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none" />
        </div>
    );
};

/**
 * PhotographyLanding Page
 * Landing page de fotografia profissional de alto nível, adaptável para os temas Claro e Escuro.
 * Apresenta uma estética clássica/editorial de estúdios artísticos modernos.
 */
const PhotographyLanding = () => {
    const { theme } = useTheme();
    const [projectCount, setProjectCount] = useState(0);
    const [content, setContent] = useState(null);

    const isPhotoSubdomain = typeof window !== 'undefined' && window.location.hostname.includes('fotografia');
    const galleryPath = isPhotoSubdomain ? "/galeria" : "/portfolio-fotografia/galeria";

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bgImages, setBgImages] = useState([]);
    const [nicheImages, setNicheImages] = useState({
        casamentos: [],
        eventos: [],
        ensaios: []
    });

    useEffect(() => {
        const fetchContent = async () => {
            // Fetch Landing Page Content
            const { data: lpData } = await supabase
                .from('landing_page_content')
                .select('*')
                .eq('page_slug', 'fotografia')
                .single();

            if (lpData) setContent(lpData);

            // Fetch Photography Projects for Background & Niches
            const { data: projectsData } = await supabase
                .from('projects')
                .select('title, services, main_image_url, gallery_urls, category:categories!inner(slug)')
                .eq('category.slug', 'fotografia')
                .limit(50);

            if (projectsData && projectsData.length > 0) {
                // Collect ALL images (main + gallery)
                let allImages = [];
                let grouped = {
                    casamentos: [],
                    eventos: [],
                    ensaios: []
                };

                projectsData.forEach(p => {
                    const niche = getProjectNiche(p);
                    let pImages = [];
                    if (p.main_image_url) pImages.push(p.main_image_url);
                    if (p.gallery_urls && Array.isArray(p.gallery_urls)) {
                        pImages.push(...p.gallery_urls);
                    }

                    allImages.push(...pImages);
                    if (grouped[niche]) {
                        grouped[niche].push(...pImages);
                    }
                });

                // Shuffle images for randomness
                const shuffled = allImages.sort(() => 0.5 - Math.random());

                // Limit to say 50 images max
                setBgImages(shuffled.slice(0, 50));

                // Shuffle each niche group images
                Object.keys(grouped).forEach(k => {
                    grouped[k] = grouped[k].sort(() => 0.5 - Math.random());
                });
                setNicheImages(grouped);
            };
        };
        fetchContent();
    }, []);

    // Slideshow Timer
    useEffect(() => {
        if (bgImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
        }, 4000); // Change every 4 seconds
        return () => clearInterval(interval);
    }, [bgImages]);

    const heroTitle = content?.hero_title || (
        <>
            Capturando Momentos <br />
            <span className="gradient-text">Eternos</span>
        </>
    );

    const heroSubtitle = content?.hero_subtitle || "Mais do que fotos, entregamos memórias. Um olhar artístico para os momentos mais importantes da sua vida e do seu negócio.";
    const heroImage = content?.hero_image_url || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4";

    // Default niches
    const defaultNiches = [
        {
            title: 'Casamentos',
            description: 'Eternizando o "sim" com sensibilidade, emoção e arte espontânea.',
            image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821'
        },
        {
            title: 'Eventos',
            description: 'Cobertura dinâmica e completa para congressos corporativos e celebrações sociais.',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865'
        },
        {
            title: 'Ensaios',
            description: 'Retratos artísticos e corporativos que valorizam sua autoridade, essência e presença.',
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
        }
    ];

    const niches = (content?.specialties && content.specialties.length > 0) ? content.specialties : defaultNiches;


    // Classes dinâmicas baseadas no tema para controle de contraste impecável do slideshow
    const overlayClass = theme === 'light'
        ? 'bg-gradient-to-b from-background/40 via-background/20 to-background'
        : 'bg-gradient-to-b from-black/60 via-black/30 to-background';

    const imageOpacityClass = theme === 'light' ? 'opacity-50' : 'opacity-70';

    return (
        <>
            <Helmet>
                <title>Fotografia Profissional - Rafael Pita Solutions</title>
                <meta name="description" content="Serviços de fotografia profissional para casamentos, eventos e ensaios. Capture seus melhores momentos com qualidade e arte." />
            </Helmet>

            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20">
                    <div className="absolute inset-0 z-0">
                        {bgImages.length > 0 ? (
                            bgImages.map((img, index) => (
                                <div
                                    key={img}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? imageOpacityClass : 'opacity-0'}`}
                                >
                                    <img
                                        src={img}
                                        alt="Background Slideshow"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className={imageOpacityClass + " w-full h-full"}>
                                <img
                                    src={heroImage}
                                    alt="Background Câmera"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className={`absolute inset-0 transition-all duration-300 ${overlayClass}`} />
                        <div className="absolute inset-0 bg-background/10 dark:bg-transparent pointer-events-none" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs md:text-sm">
                                Rafael Pita Photography
                            </h2>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight px-2">
                                {heroTitle}
                            </h1>
                            <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-semibold leading-relaxed px-4">
                                {heroSubtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 items-center">
                                <Link to="/contato?service=fotografia" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 text-lg px-8 py-6 rounded-full font-bold text-white shadow-lg transition-transform">
                                        Solicitar Orçamento
                                    </Button>
                                </Link>
                                <Link to={galleryPath} className="w-full sm:w-auto">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-lg px-8 py-6 rounded-full font-semibold shadow-sm transition-all"
                                    >
                                        Ver Portfólio
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Niches / Specialties */}
                <section className="py-32 bg-background transition-colors duration-300 border-y border-slate-200/50 dark:border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-24 space-y-4"
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Especialidades
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Diferentes olhares para registrar e eternizar cada história com excelência
                            </p>
                        </motion.div>

                        <div className="space-y-32">
                            {niches.map((niche, index) => {
                                const nicheKey = niche.title.toLowerCase() === 'casamentos' 
                                    ? 'casamentos' 
                                    : niche.title.toLowerCase() === 'eventos' 
                                        ? 'eventos' 
                                        : 'ensaios';

                                return (
                                    <motion.div
                                        key={niche.title}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                        className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="w-full md:w-1/2">
                                            <NicheSlideshow 
                                                images={nicheImages[nicheKey]} 
                                                defaultImage={niche.image} 
                                                title={niche.title} 
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                                {niche.title}
                                            </h3>
                                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                                                {niche.description}
                                            </p>
                                            <div className="pt-8">
                                                <Link to={galleryPath}>
                                                    <Button variant="outline" className="rounded-full px-10 py-7 text-lg border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-semibold">
                                                        Ver Trabalhos
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Portfolio Feed / Últimos Trabalhos */}
                <section id="portfolio" className="py-32 bg-slate-50 dark:bg-gray-900/30 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl space-y-4">
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                    Últimos Trabalhos
                                </h2>
                                <p className="text-slate-600 dark:text-gray-400 font-medium text-lg md:text-xl leading-relaxed">
                                    Explore nossa galeria selecionada com os melhores cliques corporativos e artísticos.
                                </p>
                            </div>
                            <Link to={galleryPath} className="hidden md:block">
                                <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 text-xl font-bold">
                                    Ver galeria completa <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                            </Link>
                        </div>

                        <ProjectCarousel excludeCategorySlug="" categorySlug="fotografia" onDataLoaded={setProjectCount} />

                        <div className="mt-16 text-center md:hidden">
                            <Link to={galleryPath}>
                                <Button variant="link" className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                    Ver galeria completa <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Final Premium */}
                <section className="py-32 relative overflow-hidden bg-slate-900 dark:bg-black transition-colors duration-300">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1511285560982-1351cdeb9821')] bg-cover bg-center mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 dark:from-black dark:via-black/90 dark:to-black/60"></div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                                Prontos para eternizar sua história?
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                                Agenda aberta para {new Date().getFullYear()}. Garanta sua data e tenha registros de extrema notoriedade.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                                <a href="https://wa.me/5521966149077" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 py-8 rounded-full font-bold shadow-2xl transition-transform hover:scale-105">
                                        Falar no WhatsApp
                                    </Button>
                                </a>
                                <a href="https://www.instagram.com/rp.digital_/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white text-lg px-10 py-8 rounded-full font-bold transition-all">
                                        <Instagram className="mr-2 w-6 h-6" />
                                        Ver Instagram
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default PhotographyLanding;
