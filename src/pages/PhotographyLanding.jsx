import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Instagram, CheckCircle2 } from 'lucide-react';
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
        }, 4000);
        return () => clearInterval(interval);
    }, [loadedImages]);

    return (
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all">
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
                        className="w-full h-full object-cover transition-transform ease-out hover:scale-110"
                        style={{ transitionDuration: '4000ms' }}
                        loading="lazy"
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none" />
        </div>
    );
};

/**
 * PhotographyLanding Page
 * Landing page de fotografia profissional com suporte aos temas Claro e Escuro.
 */
const PhotographyLanding = ({ cleanMode: propCleanMode, basePath: propBasePath }) => {
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

    const [projectCount, setProjectCount] = useState(0);
    const [content, setContent] = useState(null);

    const isPhotoSubdomain = typeof window !== 'undefined' && window.location.hostname.includes('fotografia');
    const galleryPath = isCleanMode 
        ? "/portfolio-fotografia-v2/galeria" 
        : (isPhotoSubdomain ? "/galeria" : "/portfolio-fotografia/galeria");

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bgImages, setBgImages] = useState([]);
    const [nicheImages, setNicheImages] = useState({
        casamentos: [],
        eventos: [],
        ensaios: []
    });

    useEffect(() => {
        const fetchContent = async () => {
            const { data: lpData } = await supabase
                .from('landing_page_content')
                .select('*')
                .eq('page_slug', 'fotografia')
                .single();

            if (lpData) setContent(lpData);

            const { data: projectsData } = await supabase
                .from('projects')
                .select('title, services, main_image_url, gallery_urls, category:categories!inner(slug)')
                .eq('category.slug', 'fotografia')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false })
                .limit(50);

            if (projectsData && projectsData.length > 0) {
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

                const shuffled = allImages.sort(() => 0.5 - Math.random());
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                setBgImages(shuffled.slice(0, isMobile ? 12 : 50));

                Object.keys(grouped).forEach(k => {
                    grouped[k] = grouped[k].sort(() => 0.5 - Math.random());
                });
                setNicheImages(grouped);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        if (bgImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % bgImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [bgImages]);

    const heroTitle = content?.hero_title || (
        <>
            Capturando Momentos <br />
            <span className="text-[#bcf13b]">Eternos</span>
        </>
    );

    const heroSubtitle = content?.hero_subtitle || "Mais do que fotos, entregamos memórias. Um olhar artístico para os momentos mais importantes da sua vida e do seu negócio.";
    const heroImage = content?.hero_image_url || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4";

    const defaultNiches = [
        {
            title: 'Casamentos',
            description: 'Eternizando o "sim" com sensibilidade, emoção e arte espontânea.',
            image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821'
        },
        {
            title: 'Ensaios',
            description: 'Retratos artísticos e corporativos que valorizam sua autoridade, essência e presença.',
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04'
        },
        {
            title: 'Eventos',
            description: 'Cobertura dinâmica e completa para congressos corporativos e celebrações sociais.',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865'
        }
    ];

    const orderMap = {
        'casamentos': 1,
        'ensaios': 2,
        'eventos': 3
    };

    const niches = [...((content?.specialties && content.specialties.length > 0) ? content.specialties : defaultNiches)].sort((a, b) => {
        const orderA = orderMap[a.title.toLowerCase()] || 99;
        const orderB = orderMap[b.title.toLowerCase()] || 99;
        return orderA - orderB;
    });

    const overlayClass = 'bg-gradient-to-b from-black/80 via-black/55 to-slate-50 dark:from-[#0a0a08]/80 dark:via-[#0a0a08]/50 dark:to-[#0a0a08]';
    const imageOpacityClass = 'opacity-60';

    return (
        <>
            <SEO 
                title="Fotografia Profissional RJ | Casamentos, Pre Wedding e Ensaios"
                description="Fotógrafo profissional no Rio de Janeiro especializado em casamentos, ensaios pre-wedding, retratos corporativos e cobertura de eventos no RJ. Eternize seus melhores momentos."
                keywords="fotos de pre wedding rio de janeiro, fotos casamento rio de janeiro, fotografo rio de janeiro, fotos pre wedding rj, ensaio pre wedding rj, fotografo de casamento rj, ensaio fotografico rj, fotografia rj, rafael pita photography"
            />

            <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">

                {/* Hero Section */}
                <section className="relative min-h-0 md:h-screen flex items-center justify-center overflow-hidden pt-24 pb-6 md:py-0 -mt-20">
                    <div className="absolute inset-0 z-0">
                        {bgImages.length > 0 ? (
                            bgImages.map((img, index) => (
                                <div
                                    key={img}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform-gpu will-change-[opacity] ${index === currentImageIndex ? imageOpacityClass : 'opacity-0'}`}
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
                        <div className="absolute inset-0 bg-transparent pointer-events-none" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 md:pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h2 className="text-[#bcf13b] font-bold tracking-widest uppercase text-xs md:text-sm drop-shadow">
                                Rafael Pita Photography
                            </h2>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight px-2 drop-shadow-md">
                                {heroTitle}
                            </h1>
                            <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed px-4 drop-shadow">
                                {heroSubtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 items-center">
                                {isCleanMode ? (
                                    <>
                                        <Link to={galleryPath} className="w-full sm:w-auto">
                                            <Button size="lg" className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-[#bcf13b]/20 hover:scale-105 transition-all">
                                                Conhecer Galeria Completa
                                            </Button>
                                        </Link>
                                        <a href="#portfolio" className="w-full sm:w-auto">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="w-full border-white/30 bg-black/40 hover:bg-black/60 text-white hover:border-[#bcf13b] hover:text-[#bcf13b] text-lg px-8 py-6 rounded-full font-semibold shadow-sm transition-all backdrop-blur-sm"
                                            >
                                                Ver Últimos Trabalhos
                                            </Button>
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/contato?service=fotografia" className="w-full sm:w-auto">
                                            <Button size="lg" className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-[#bcf13b]/20 hover:scale-105 transition-all">
                                                Solicitar Orçamento
                                            </Button>
                                        </Link>
                                        <Link to={galleryPath} className="w-full sm:w-auto">
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="w-full border-white/30 bg-black/40 hover:bg-black/60 text-white hover:border-[#bcf13b] hover:text-[#bcf13b] text-lg px-8 py-6 rounded-full font-semibold shadow-sm transition-all backdrop-blur-sm"
                                            >
                                                Ver Portfólio
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Niches / Specialties */}
                <section className="py-16 md:py-32 bg-slate-50 dark:bg-[#0a0a08] transition-colors duration-300 border-y border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-24 space-y-4"
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                Nossas <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Especialidades</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Diferentes olhares para registrar e eternizar cada história com excelência
                            </p>
                        </motion.div>

                        <div className="space-y-24 md:space-y-32">
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
                                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                {niche.title}
                                            </h3>
                                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                                                {niche.description}
                                            </p>
                                            <div className="pt-0 md:pt-2">
                                                <Link to={`${galleryPath}?nicho=${nicheKey}`}>
                                                    <Button variant="outline" className="rounded-full px-10 py-7 text-lg border border-slate-300 dark:border-[#23231f] bg-white dark:bg-[#121210] text-slate-800 dark:text-white hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] transition-all font-semibold shadow-sm">
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
                <section id="portfolio" className="py-16 md:py-32 bg-slate-100/60 dark:bg-[#0a0a08] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl space-y-4">
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Últimos <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Trabalhos</span>
                                </h2>
                                <p className="text-slate-600 dark:text-gray-400 font-medium text-lg md:text-xl leading-relaxed">
                                    Explore nossa galeria selecionada com os melhores cliques corporativos e artísticos.
                                </p>
                            </div>
                            <Link to={galleryPath} className="hidden md:block">
                                <Button variant="link" className="text-[#4d7c0f] dark:text-[#bcf13b] hover:text-lime-700 dark:hover:text-[#a8df2a] p-0 text-xl font-bold">
                                    Ver galeria completa <ArrowRight className="ml-2 w-6 h-6" />
                                </Button>
                            </Link>
                        </div>

                        <ProjectCarousel excludeCategorySlug="" categorySlug="fotografia" onDataLoaded={setProjectCount} basePath={effectiveBasePath} />

                        <div className="mt-16 text-center md:hidden">
                            <Link to={galleryPath}>
                                <Button variant="link" className="text-[#4d7c0f] dark:text-[#bcf13b] hover:text-lime-700 dark:hover:text-[#a8df2a] font-bold text-lg">
                                    Ver galeria completa <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Final Premium */}
                <section className="py-16 md:py-32 relative overflow-hidden bg-slate-900 dark:bg-[#0a0a08] border-t border-slate-200 dark:border-[#23231f] transition-colors duration-300">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511285560982-1351cdeb9821')] bg-cover bg-center mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/50 dark:from-[#0a0a08] dark:via-[#0a0a08]/80 dark:to-[#0a0a08]/40"></div>
                    <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                                Prontos para eternizar sua <span className="text-[#bcf13b]">história?</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
                                Agenda aberta para {new Date().getFullYear()}. Garanta sua data e tenha registros de extrema notoriedade.
                            </p>
                            {isCleanMode ? (
                                <div className="space-y-6 pt-6">
                                    <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-lime-500/10 text-[#bcf13b] border border-lime-500/20 text-sm font-bold shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-[#bcf13b]" />
                                        <span>Comunicação e contratação 100% integradas pela plataforma do 99freelas.</span>
                                    </div>
                                    <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
                                        Transformamos sua demanda em registros fotográficos de excelência. Responda diretamente na nossa proposta para combinarmos data, escopo e prazos de entrega!
                                    </p>
                                    <div>
                                        <Link to={galleryPath}>
                                            <Button size="lg" className="bg-[#bcf13b] text-[#0a0a08] hover:bg-[#a8df2a] text-lg px-10 py-7 rounded-full font-bold shadow-lg shadow-[#bcf13b]/20 hover:scale-105 transition-transform">
                                                Explorar Galeria de Fotos
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                                    <a href="https://wa.me/5521966149077" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                        <Button size="lg" className="w-full bg-[#bcf13b] text-[#0a0a08] hover:bg-[#a8df2a] text-lg px-10 py-8 rounded-full font-bold shadow-lg shadow-[#bcf13b]/20 transition-transform hover:scale-105">
                                            Falar no WhatsApp
                                        </Button>
                                    </a>
                                    <a href="https://www.instagram.com/rp.digital_/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                        <Button size="lg" variant="outline" className="w-full bg-[#121210] text-white border border-[#23231f] hover:border-[#bcf13b] hover:text-[#bcf13b] text-lg px-10 py-8 rounded-full font-bold transition-all">
                                            <Instagram className="mr-2 w-6 h-6" />
                                            Ver Instagram
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default PhotographyLanding;
