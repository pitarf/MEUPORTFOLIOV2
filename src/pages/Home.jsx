import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { supabase } from '@/lib/customSupabaseClient'; // Import supabase
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Zap, Star, Users, Award, TrendingUp, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCarousel from '@/components/ProjectCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import AnimatedStat from '@/components/AnimatedStat';

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
                    .order('created_at', { ascending: false })
                    .limit(35);

                // 2. Fetch Other projects (excluding "fotografia" and "desenvolvimento-web")
                const { data: otherProjects } = await supabase
                    .from('projects')
                    .select('main_image_url, category:categories!inner(slug)')
                    .neq('category.slug', 'fotografia')
                    .neq('category.slug', 'desenvolvimento-web')
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
                const { data, error } = await supabase.rpc('get_average_rating');
                if (!error && data) {
                    setStats(prev => prev.map(s => s.label === 'Avaliação Média' ? { ...s, number: data } : s));
                }
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        }

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
            <Helmet>
                <title>Rafael Pita Solutions - Criatividade e tecnologia em um só lugar</title>
                <meta name="description" content="Transformamos suas ideias em realidade digital. Serviços completos de design, desenvolvimento, marketing digital e muito mais." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background text-foreground transition-colors duration-300">
                {/* Project Marquee Background */}
                <div className="absolute inset-0 z-0 opacity-10 grayscale overflow-hidden">
                    <div className="absolute top-10 left-0 w-full rotate-[-5deg]">
                        <div className="flex gap-4 animate-marquee whitespace-nowrap">
                            {bgProjects.map((proj, idx) => (
                                <div key={`row1-${idx}`} className="w-[600px] h-[400px] bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 opacity-80">
                                    <img src={proj.main_image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-0 w-full rotate-[5deg]">
                        <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap">
                            {bgProjects.map((proj, idx) => (
                                <div key={`row2-${idx}`} className="w-[600px] h-[400px] bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 opacity-80">
                                    <img src={proj.main_image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Aurora Background Overlay */}
                <div className="absolute inset-0 aurora-bg opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-color-dodge z-0 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-0 pointer-events-none"></div>

                {/* Central Spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-40 pulse-glow z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 sm:space-y-10"
                    >
                        <div className="space-y-4 sm:space-y-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                                className="w-28 h-28 sm:w-40 sm:h-40 mx-auto flex items-center justify-center mb-4 sm:mb-8"
                            >
                                {config?.logo_url ? (
                                    <img src={config.logo_url} alt={config.site_name} className="w-full h-full object-contain drop-shadow-2xl" />
                                ) : (
                                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <Zap className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold px-2">
                                <span className="gradient-text">{config?.hero_title || 'Rafael Pita Solutions'}</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4 font-medium">
                                {config?.hero_subtitle || 'Criatividade e tecnologia em um só lugar'}
                            </p>

                            <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4">
                                {config?.hero_description || 'Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas para o seu negócio.'}
                            </p>
                        </div>



                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                            <Link to="/contato">
                                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 neon-glow">
                                    Solicitar Orçamento
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>

                             <Link to="/portfolio">
                                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 w-full sm:w-auto">
                                    Ver Portfólio
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div >

                {/* Floating Elements */}
                < div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl floating-animation" ></div >
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl floating-animation" style={{ animationDelay: '4s' }}></div>
            </section >

            {/* Floating Stats Section */}
            <div className="relative z-20 px-4 -mt-10 sm:-mt-20 md:-mt-32">
                <div className="max-w-6xl mx-auto">
                    <div className="glass-effect rounded-3xl p-6 sm:p-8 border border-gray-200/50 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/60">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 divide-x-0 md:divide-x divide-gray-200 dark:divide-gray-700/50">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center px-4"
                                >
                                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-white/5">
                                        <stat.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                     <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                         <AnimatedStat to={stat.number} suffix={stat.suffix} />
                                     </div>
                                     <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">{stat.label}</div>
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
                            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                 Conhecer todos os projetos
                                 <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                         </Link>
                    </motion.div>
                </div>
            </section >

            {/* Photography Section - Only visible if there are projects */}
            < section className={`py-20 bg-gray-900/30 ${photographyCount === 0 ? 'hidden' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            <span className="gradient-text">Fotografia em Destaque</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            Capturando a essência de cada momento com olhar artístico e profissional.
                        </p>
                    </motion.div>
                    <ProjectCarousel categorySlug="fotografia" onDataLoaded={setPhotographyCount} />

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mt-12"
                    >
                        <Link to="/portfolio-fotografia/galeria">
                            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 text-lg px-8 py-4 font-semibold">
                                Ver Galeria de Fotografia
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section >

            {/* Services Section */}
            < section className="py-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            <span className="gradient-text">Nossos Serviços</span>
                        </h2>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
                            Oferecemos soluções completas para transformar sua presença digital e impulsionar seu negócio
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
                                     <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-r ${service.color || 'from-blue-500 to-purple-600'} flex items-center justify-center shadow-md`}>
                                         <IconComponent className="w-6 h-6 text-white" />
                                     </div>
                                     <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{service.title}</h3>
                                     <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
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
                            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5">
                                 Ver Todos os Serviços
                                 <ArrowRight className="ml-2 w-5 h-5" />
                             </Button>
                         </Link>
                    </motion.div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Pronto para transformar suas ideias?
                        </h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Entre em contato conosco e descubra como podemos ajudar seu negócio a alcançar o próximo nível
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contato">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                                    Falar Conosco
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/avaliacoes">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
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