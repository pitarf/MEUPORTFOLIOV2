import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { supabase } from '@/lib/customSupabaseClient'; // Import supabase
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ArrowRight, Zap, Star, Users, Award, TrendingUp, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCarousel from '@/components/ProjectCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import AnimatedStat from '@/components/AnimatedStat';
import BrandLogo from '@/components/common/BrandLogo';

const iconMap = {
    Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield
};

const Home = () => {
    const { config } = useSiteConfig();
    const [photographyCount, setPhotographyCount] = useState(0);
    const [avgRating, setAvgRating] = useState(5);

    const [stats, setStats] = useState([
        { label: 'Projetos Concluídos', number: config?.stats_projects_count || 500, suffix: '+', icon: Award },
        { label: 'Clientes Satisfeitos', number: config?.stats_clients_count || 200, suffix: '+', icon: Users },
        { label: 'Avaliação Média', number: 5, suffix: '★', icon: Star },
        { label: 'Taxa de Sucesso', number: config?.stats_success_rate || 98, suffix: '%', icon: TrendingUp },
    ]);
    const [bgProjects, setBgProjects] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('display_order', { ascending: true });
                if (!error && data) setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchBgProjects = async () => {
            try {
                // 1. Fetch "Desenvolvimento de Sites" projects (Priority ~70%)
                const { data: webProjects } = await supabase
                    .from('projects')
                    .select('main_image_url, category:categories!inner(slug)')
                    .eq('category.slug', 'desenvolvimento-web')
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: false })
                    .limit(35);

                // 2. Fetch Other projects (excluding "fotografia" and "desenvolvimento-web")
                const { data: otherProjects } = await supabase
                    .from('projects')
                    .select('main_image_url, category:categories!inner(slug)')
                    .neq('category.slug', 'fotografia')
                    .neq('category.slug', 'desenvolvimento-web')
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: false })
                    .limit(15);

                const webList = webProjects || [];
                const otherList = otherProjects || [];

                // Combine and Shuffle
                const combined = [...webList, ...otherList];
                const shuffled = combined.sort(() => 0.5 - Math.random());

                // Duplicate for seamless loop if needed
                setBgProjects([...shuffled, ...shuffled]);
            } catch (error) {
                console.error('Error fetching bg projects:', error);
            }
        };

        const fetchReviewsAvg = async () => {
            try {
                // Consulta direta e segura para os reviews aprovados, calculando a média real
                const { data: revs, error: revError } = await supabase
                    .from('reviews')
                    .select('rating')
                    .eq('is_approved', true);

                if (!revError && revs && revs.length > 0) {
                    const sum = revs.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
                    const avg = Number((sum / revs.length).toFixed(1));
                    setStats(prev => prev.map(s => s.label === 'Avaliação Média' ? { ...s, number: avg } : s));
                }
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        };

        if (config) {
            setStats(prev => prev.map(s => {
                if (s.label === 'Projetos Concluídos') return { ...s, number: config.stats_projects_count || 500 };
                if (s.label === 'Clientes Satisfeitos') return { ...s, number: config.stats_clients_count || 200 };
                if (s.label === 'Taxa de Sucesso') return { ...s, number: config.stats_success_rate || 98 };
                return s;
            }));
        }

        fetchServices();
        fetchBgProjects();
        fetchReviewsAvg();
    }, [config]);

    return (
        <>
            <SEO 
                title="Rafael Pita Solutions - Desenvolvimento Web e Fotografia Profissional"
                description="Desenvolvimento de sites profissionais, sistemas web sob medida, dashboards Power BI interativos e fotografia profissional no Rio de Janeiro. Criatividade e tecnologia para impulsionar seu negócio."
                keywords="desenvolvimento de sites rj, criacao de sites profissional, criacao de sistemas web, programador rio de janeiro, dashboards power bi rio de janeiro, fotografo rio de janeiro, fotos pre wedding rj, rafael pita solutions"
            />

            {/* Hero Section */}
            <section className="relative min-h-0 md:min-h-screen flex items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-300 pt-28 pb-12 md:py-0 -mt-20">
                {/* Project Marquee Background */}
                <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20 overflow-hidden transition-opacity duration-300 pointer-events-none">
                    <div className="absolute top-10 left-0 w-full rotate-[-5deg]">
                        <div className="flex gap-4 animate-marquee whitespace-nowrap">
                            {bgProjects.map((proj, idx) => (
                                <div key={`row1-${idx}`} className="w-[280px] h-[180px] md:w-[500px] md:h-[330px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-200/10 dark:border-white/5 bg-gray-100 dark:bg-gray-800 shadow-lg">
                                    <img src={proj.main_image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} className="w-full h-full object-cover opacity-80" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-0 w-full rotate-[5deg]">
                        <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
                            {bgProjects.map((proj, idx) => (
                                <div key={`row2-${idx}`} className="w-[280px] h-[180px] md:w-[500px] md:h-[330px] rounded-xl overflow-hidden flex-shrink-0 border border-gray-200/10 dark:border-white/5 bg-gray-100 dark:bg-gray-800 shadow-lg">
                                    <img src={proj.main_image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} className="w-full h-full object-cover opacity-80" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Aurora Background Overlay */}
                <div className="absolute inset-0 aurora-bg opacity-40 dark:opacity-50 z-0 pointer-events-none"></div>
                <div className="absolute inset-0 bg-background/55 dark:bg-background/80 z-0 pointer-events-none transition-colors duration-300"></div>

                {/* Central Spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[80px] opacity-40 pulse-glow z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 sm:pt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 sm:space-y-8"
                    >
                        <div className="space-y-4 sm:space-y-6">
                            {/* Badge da Marca */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121210] border border-[#23231f] text-xs font-semibold text-gray-300 shadow-sm hover:border-[#bcf13b]/50 transition-colors"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#bcf13b] animate-pulse"></span>
                                <span className="text-[#bcf13b] font-bold">rp .</span>
                                <span className="text-gray-600">|</span>
                                <span className="tracking-wider uppercase">Soluções Digitais & Tecnologia</span>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                                className="flex items-center justify-center my-2"
                            >
                                <BrandLogo size="xl" showSubtitle={false} />
                            </motion.div>

                            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black px-2 tracking-tight text-white leading-tight">
                                Transformamos Ideias em Resultados Digitais<span className="text-[#bcf13b]">.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 font-semibold leading-relaxed">
                                {config?.hero_subtitle || 'Criatividade e tecnologia em um so lugar'}
                            </p>

                            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-4 leading-relaxed font-medium">
                                {config?.hero_description || 'Transformamos suas ideias em realidade digital com solucoes inovadoras e personalizadas para o seu negocio.'}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 sm:pt-4">
                            <Link to="/contato" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] text-lg px-8 py-6 font-extrabold rounded-xl shadow-lg shadow-[#bcf13b]/20 hover:shadow-[#bcf13b]/40 hover:scale-[1.02] transition-all duration-300">
                                    Solicitar Orçamento
                                    <ArrowRight className="ml-2 w-5 h-5 text-[#0a0a08]" />
                                </Button>
                            </Link>

                             <Link to="/portfolio" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-[#23231f] hover:border-[#bcf13b] text-gray-200 hover:text-[#bcf13b] bg-[#121210]/80 hover:bg-[#121210] font-bold rounded-xl transition-all duration-300">
                                    Ver Portfólio
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div >

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-[#bcf13b]/10 rounded-full blur-xl floating-animation pointer-events-none" ></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#bcf13b]/5 rounded-full blur-xl floating-animation pointer-events-none" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#bcf13b]/10 rounded-full blur-xl floating-animation pointer-events-none" style={{ animationDelay: '4s' }}></div>
            </section>

            {/* Floating Stats Section */}
            <div className="relative z-20 px-4 -mt-20 sm:-mt-24 md:-mt-28">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-3xl p-6 sm:p-8 border border-[#23231f] shadow-2xl backdrop-blur-xl bg-[#121210]/95">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 divide-x-0 md:divide-x divide-[#23231f]">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center px-4"
                                >
                                    <div className="w-12 h-12 mx-auto mb-3 bg-[#181814] border border-[#23231f] rounded-xl flex items-center justify-center shadow-inner">
                                        <stat.icon className="w-6 h-6 text-[#bcf13b]" />
                                    </div>
                                     <div className="text-3xl font-extrabold text-white mb-1">
                                         <AnimatedStat to={stat.number} suffix={stat.suffix} />
                                     </div>
                                     <div className="text-xs text-gray-400 font-semibold tracking-wide uppercase">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Carousel Section */}
            < section className="py-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            <span className="gradient-text">Projetos em Destaque</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            Uma amostra do nosso trabalho, combinando criatividade e tecnologia para entregar resultados de impacto.
                        </p>
                    </motion.div>
                    <ProjectCarousel excludeCategorySlug="fotografia" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                         <Link to="/portfolio">
                            <Button size="lg" variant="outline" className="border-[#23231f] hover:border-[#bcf13b] text-gray-200 hover:text-[#bcf13b] bg-[#121210] hover:bg-[#181814] transition-all">
                                 Conhecer todos os projetos
                                 <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                         </Link>
                    </motion.div>
                </div>
            </section >

            {/* Photography Section - Only visible if there are projects */}
            <section className={`py-20 bg-[#0a0a08] border-y border-[#23231f] text-white ${photographyCount === 0 ? 'hidden' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                            <span>Fotografia em Destaque</span>
                            <span className="text-[#bcf13b]">.</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
                            Capturando a essencia de cada momento com olhar artistico e profissional.
                        </p>
                    </motion.div>
                    <ProjectCarousel categorySlug="fotografia" onDataLoaded={setPhotographyCount} />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <Link to="/portfolio-fotografia/galeria">
                            <Button size="lg" className="bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] text-lg px-8 py-4 font-bold shadow-lg shadow-[#bcf13b]/20 hover:scale-105 transition-all">
                                Ver Galeria de Fotografia
                                <ArrowRight className="ml-2 w-5 h-5 text-[#0a0a08]" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            < section className="py-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            <span>Nossos Serviços</span>
                            <span className="text-[#bcf13b]">.</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            Oferecemos solucoes completas para transformar sua presenca digital e impulsionar seu negocio
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Palette;
                            return (
                                <motion.div
                                    key={service.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="service-card p-6 rounded-xl"
                                >
                                     <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${service.color || 'from-[#bcf13b]/30 to-[#a8df2a]/20'} flex items-center justify-center shadow-md border border-[#23231f]`}>
                                         <IconComponent className="w-6 h-6 text-[#bcf13b]" />
                                     </div>
                                     <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{service.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <Link to="/servicos">
                            <Button size="lg" variant="outline" className="border-[#23231f] hover:border-[#bcf13b] text-gray-200 hover:text-[#bcf13b] bg-[#121210] hover:bg-[#181814] transition-all">
                                 Ver Todos os Serviços
                                 <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                         </Link>
                    </motion.div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-20 bg-gradient-to-b from-[#121210] to-[#0a0a08] border-y border-[#23231f]" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            Pronto para transformar suas ideias<span className="text-[#bcf13b]">?</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Entre em contato conosco e descubra como podemos ajudar seu negocio a alcancar o proximo nivel
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/contato" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-extrabold text-lg px-8 py-6 rounded-xl shadow-lg shadow-[#bcf13b]/20 hover:scale-[1.02] transition-all">
                                    Falar Conosco
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                             <Link to="/avaliacoes" className="w-full sm:w-auto">
                                 <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#23231f] hover:border-[#bcf13b] bg-transparent hover:bg-[#181814] text-white hover:text-[#bcf13b] text-lg px-8 py-6 font-bold rounded-xl transition-all">
                                     Ver Avaliações
                                 </Button>
                             </Link>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* Reviews Carousel Section */}
            < section className="py-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                             <span className="gradient-text">O que nossos clientes dizem</span>
                         </h2>
                    </motion.div>
                    <ReviewsCarousel />
                </div>
            </section >
        </>
    );
};

export default Home;