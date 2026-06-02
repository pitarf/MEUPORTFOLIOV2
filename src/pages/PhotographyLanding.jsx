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
 * PhotographyLanding Page
 * Landing page de fotografia profissional de alto nível, adaptável para os temas Claro e Escuro.
 * Apresenta uma estética clássica/editorial de estúdios artísticos modernos.
 */
const PhotographyLanding = () => {
    const { theme } = useTheme();
    const [projectCount, setProjectCount] = useState(0);
    const [content, setContent] = useState(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bgImages, setBgImages] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            // Fetch Landing Page Content
            const { data: lpData } = await supabase
                .from('landing_page_content')
                .select('*')
                .eq('page_slug', 'fotografia')
                .single();

            if (lpData) setContent(lpData);

            // Fetch Photography Projects for Background
            const { data: projectsData } = await supabase
                .from('projects')
                .select('main_image_url, gallery_urls, category:categories!inner(slug)')
                .eq('category.slug', 'fotografia')
                .limit(50);

            if (projectsData && projectsData.length > 0) {
                // Collect ALL images (main + gallery)
                let allImages = [];
                projectsData.forEach(p => {
                    if (p.main_image_url) allImages.push(p.main_image_url);
                    if (p.gallery_urls && Array.isArray(p.gallery_urls)) {
                        allImages.push(...p.gallery_urls);
                    }
                });

                // Shuffle images for randomness
                const shuffled = allImages.sort(() => 0.5 - Math.random());

                // Limit to say 50 images max
                setBgImages(shuffled.slice(0, 50));
            }
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

    const scrollToPortfolio = (e) => {
        e.preventDefault();
        const element = document.getElementById('portfolio');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                                <Button
                                    onClick={scrollToPortfolio}
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-lg px-8 py-6 rounded-full font-semibold shadow-sm transition-all"
                                >
                                    Ver Portfólio
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Niches / Specialties */}
                <section className="py-24 bg-slate-50 dark:bg-gray-900/40 border-y border-slate-200/50 dark:border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                                <span className="gradient-text">Especialidades</span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Diferentes olhares para registrar e eternizar cada história com excelência
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {niches.map((niche, index) => (
                                <motion.div
                                    key={niche.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer shadow-lg border border-slate-200/50 dark:border-white/5"
                                >
                                    <img
                                        src={niche.image}
                                        alt={niche.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    {/* Gradiente de Fusão Padrão */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

                                    {/* Cortina Desfocada no Hover (Efeito Revista Editorial) */}
                                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                    <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-10 w-full">
                                        <h3 className="text-2xl font-extrabold text-white mb-2">{niche.title}</h3>
                                        <p className="text-gray-250 text-sm transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 leading-relaxed font-semibold">
                                            {niche.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Portfolio Feed / Últimos Trabalhos */}
                <section id="portfolio" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-xl space-y-2">
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Últimos Trabalhos
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400 font-semibold text-base md:text-lg leading-relaxed">
                                Explore nossa galeria selecionada com os melhores cliques corporativos e artísticos.
                            </p>
                        </div>
                        <Link to="/portfolio-fotografia/galeria" className="hidden md:block">
                            <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 text-lg font-bold">
                                Ver galeria completa <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <ProjectCarousel excludeCategorySlug="" categorySlug="fotografia" onDataLoaded={setProjectCount} />

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/portfolio-fotografia/galeria">
                            <Button variant="link" className="text-blue-600 dark:text-blue-400 font-bold text-base">
                                Ver galeria completa <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* CTA Final Glassmorphism */}
                <section className="py-20 bg-slate-50 dark:bg-gray-900/40 border-t border-slate-200/50 dark:border-white/5 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center glass-effect p-8 sm:p-12 rounded-3xl border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/30 shadow-2xl"
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                                <span className="gradient-text">Vamos criar algo incrível juntos?</span>
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-slate-650 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                                Agenda aberta para {new Date().getFullYear()}. Garanta sua data e tenha registros inesquecíveis, corporativos ou espontâneos de extrema notoriedade.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a href="https://wa.me/5521966149077" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg px-8 py-5 rounded-full font-bold text-white shadow-lg shadow-blue-500/10 transition-transform hover:scale-105">
                                        Falar no WhatsApp
                                    </Button>
                                </a>
                                <a href="https://www.instagram.com/rp.digital_/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-slate-200 text-lg px-8 py-5 rounded-full font-bold shadow-md transition-transform hover:scale-105">
                                        <Instagram className="mr-2 w-5 h-5" />
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
