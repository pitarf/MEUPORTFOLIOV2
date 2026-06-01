import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Camera, Heart, Users, Star, ArrowRight, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCarousel from '@/components/ProjectCarousel';
import { supabase } from '@/lib/customSupabaseClient';

const PhotographyLanding = () => {
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
                .limit(50); // Increased limit to 50 projects

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

                // Limit to say 20 images max to avoid memory issues if there are too many
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

    // Default niches if dynamic content is empty or not yet loaded
    const defaultNiches = [
        {
            title: 'Casamentos',
            description: 'Eternizando o "sim" com sensibilidade e arte.',
            image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821'
        },
        {
            title: 'Eventos',
            description: 'Cobertura completa para eventos corporativos e sociais.',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865'
        },
        {
            title: 'Ensaios',
            description: 'Retratos que capturam sua essência e personalidade.',
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

    return (
        <>
            <Helmet>
                <title>Fotografia Profissional - Rafael Pita Solutions</title>
                <meta name="description" content="Serviços de fotografia profissional para casamentos, eventos e ensaios. Capture seus melhores momentos com qualidade e arte." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {bgImages.length > 0 ? (
                        bgImages.map((img, index) => (
                            <div
                                key={img}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-55' : 'opacity-0'}`}
                            >
                                <img
                                    src={img}
                                    alt="Background Slideshow"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))
                    ) : (
                        <img
                            src={heroImage}
                            alt="Background Câmera"
                            className="w-full h-full object-cover opacity-70"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-gray-950" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-blue-400 font-medium tracking-wide uppercase mb-4">Rafael Pita Photography</h2>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            {typeof heroTitle === 'string' ? heroTitle : heroTitle}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                            {heroSubtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contato?service=fotografia">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full">
                                    Solicitar Orçamento
                                </Button>
                            </Link>
                            <Button
                                onClick={scrollToPortfolio}
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full"
                            >
                                Ver Portfólio
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Niches / Services */}
            <section className="py-20 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Especialidades</h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {niches.map((niche, index) => (
                            <motion.div
                                key={niche.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
                            >
                                <img
                                    src={niche.image}
                                    alt={niche.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{niche.title}</h3>
                                    <p className="text-gray-300 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        {niche.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Feed */}
            <section id="portfolio" className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Últimos Trabalhos</h2>
                            <p className="text-gray-400">
                                Explore nossa galeria selecionada com os melhores clicks.
                            </p>
                        </div>
                        <Link to="/portfolio-fotografia/galeria" className="hidden md:block">
                            <Button variant="link" className="text-blue-400 p-0 text-lg">
                                Ver galeria completa <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <ProjectCarousel categorySlug="fotografia" onDataLoaded={setProjectCount} />

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/portfolio-fotografia/galeria">
                            <Button variant="link" className="text-blue-400">
                                Ver galeria completa <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 bg-white text-black text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Vamos criar algo incrível juntos?
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Agenda aberta para {new Date().getFullYear()}. Garanta sua data e tenha registros inesquecíveis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://wa.me/5521966149077" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all border-none">
                                Falar no WhatsApp
                            </Button>
                        </a>
                        <a href="https://www.instagram.com/rp.digital_/" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="bg-gray-950 text-white hover:bg-black text-lg px-10 py-6 rounded-full font-semibold border-none shadow-lg">
                                <Instagram className="mr-2 w-5 h-5" />
                                Ver Instagram
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PhotographyLanding;
