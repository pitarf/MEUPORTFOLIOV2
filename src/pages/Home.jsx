import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { ArrowRight, Star, Users, Award, TrendingUp, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCarousel from '@/components/ProjectCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import AnimatedStat from '@/components/AnimatedStat';
import BrandLogo from '@/components/common/BrandLogo';

const iconMap = {
    Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield
};

/**
 * Página Inicial da RAMIELL (ramiell.com)
 * Estética editorial minimalista com suporte aos temas Claro (#F7F7F6) e Escuro (#070707),
 * cards adaptativos com cantos de 20px, acento dourado #C9A227 e botões em pílula.
 */
const Home = () => {
    const { config } = useSiteConfig();
    const [photographyCount, setPhotographyCount] = useState(0);

    const [stats, setStats] = useState([
        { label: 'Projetos Entregues', number: config?.stats_projects_count || 500, suffix: '+', icon: Award },
        { label: 'Clientes Atendidos', number: config?.stats_clients_count || 200, suffix: '+', icon: Users },
        { label: 'Avaliação Média', number: 5, suffix: '★', icon: Star },
        { label: 'Taxa de Satisfação', number: config?.stats_success_rate || 98, suffix: '%', icon: TrendingUp },
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
                const { data: webProjects } = await supabase
                    .from('projects')
                    .select('main_image_url, category:categories!inner(slug)')
                    .eq('category.slug', 'desenvolvimento-web')
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: false })
                    .limit(30);

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
                const combined = [...webList, ...otherList].sort(() => 0.5 - Math.random());
                setBgProjects([...combined, ...combined]);
            } catch (error) {
                console.error('Error fetching bg projects:', error);
            }
        };

        const fetchReviewsAvg = async () => {
            try {
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

        fetchServices();
        fetchBgProjects();
        fetchReviewsAvg();
    }, []);

    useEffect(() => {
        if (config) {
            setStats(prev => [
                { ...prev[0], number: config.stats_projects_count || prev[0].number },
                { ...prev[1], number: config.stats_clients_count || prev[1].number },
                prev[2],
                { ...prev[3], number: config.stats_success_rate || prev[3].number }
            ]);
        }
    }, [config]);

    return (
        <div className="min-h-screen bg-[#F7F7F6] dark:bg-[#070707] text-[#0C0C0C] dark:text-white transition-colors duration-300 overflow-x-hidden font-sans">
            <SEO
                title="RAMIELL | Engenharia de Software, Sistemas e Experiências Digitais"
                description="Desenvolvimento de sites de alta conversão, sistemas corporativos e plataformas digitais com estética editorial de alto padrão."
                canonical="https://ramiell.com"
            />

            {/* Hero Section Editorial */}
            <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* Marquee de Projetos ao Fundo com Opacidade Reduzida */}
                <div className="absolute inset-0 z-0 opacity-10 dark:opacity-15 overflow-hidden pointer-events-none">
                    <div className="absolute top-12 left-0 w-full rotate-[-3deg]">
                        <div className="flex gap-5 animate-marquee whitespace-nowrap">
                            {bgProjects.map((proj, idx) => (
                                <div key={`row1-${idx}`} className="w-[300px] h-[190px] md:w-[480px] md:h-[300px] rounded-[20px] overflow-hidden flex-shrink-0 border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-[#0B0B0B]">
                                    <img src={proj.main_image_url || "https://images.unsplash.com/photo-1550745165-9bc0b252726f"} className="w-full h-full object-cover opacity-60" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Camada de Gradiente Suave Adaptativo ao Tema */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7F6]/90 via-[#F7F7F6]/80 to-[#F7F7F6] dark:from-[#070707]/90 dark:via-[#070707]/80 dark:to-[#070707] z-0 pointer-events-none transition-colors duration-300" />

                {/* Glow Central Dourado Sutil */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C9A227]/[0.08] dark:bg-[#C9A227]/[0.06] rounded-full blur-[140px] pointer-events-none z-0" />

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {/* Badge Editorial de Marca */}
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-[#0B0B0B] border border-black/[0.08] dark:border-white/[0.08] text-xs font-mono text-[#666666] dark:text-[#9E9E9E] shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                                <span className="text-[#A88218] dark:text-[#ECBD57] font-semibold tracking-wider uppercase font-sans">RAMIELL</span>
                                <span className="text-black/20 dark:text-white/20">•</span>
                                <span className="tracking-widest uppercase text-[#0C0C0C]/80 dark:text-white/80">Digital Experiences</span>
                            </motion.div>
                        </div>

                        {/* Monograma Dourado Hero */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 20 }}
                            className="flex items-center justify-center my-2"
                        >
                            <BrandLogo size="hero" showSubtitle={false} />
                        </motion.div>

                        {/* Título Principal Editorial */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-[#0C0C0C] dark:text-white leading-[1.1] max-w-4xl mx-auto">
                            Engenharia e design de alto padrão para marcas que exigem{' '}
                            <span className="gold-gradient-text">excelência</span>.
                        </h1>

                        {/* Subtítulos */}
                        <p className="text-base sm:text-lg md:text-xl text-[#666666] dark:text-[#9E9E9E] max-w-2xl mx-auto font-normal leading-relaxed">
                            Desenvolvimento de sites de alta conversão, sistemas corporativos robustos e experiências digitais sob medida.
                        </p>

                        {/* CTAs em Pílula */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link to="/contato" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] text-sm uppercase tracking-wider px-8 py-4 font-semibold rounded-full shadow-[0_0_24px_rgba(201,162,39,0.25)] hover:shadow-[0_0_32px_rgba(201,162,39,0.4)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                                    <span>Iniciar Projeto</span>
                                    <ArrowRight className="w-4 h-4 text-[#070707]" strokeWidth={2} />
                                </button>
                            </Link>

                            <Link to="/portfolio" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto text-sm uppercase tracking-wider px-8 py-4 bg-white dark:bg-[#0B0B0B] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#C9A227]/40 text-[#0C0C0C] dark:text-white hover:text-[#A88218] dark:hover:text-[#ECBD57] font-semibold rounded-full shadow-sm transition-all duration-300">
                                    Explorar Portfólio
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Seção de Métricas Minimalista */}
            <div className="relative z-20 px-4 -mt-10 sm:-mt-14 max-w-5xl mx-auto">
                <div className="rounded-[20px] p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.06] bg-white/95 dark:bg-[#0B0B0B]/95 backdrop-blur-xl shadow-xl dark:shadow-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-x-0 md:divide-x divide-black/[0.06] dark:divide-white/[0.06]">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center px-2 sm:px-4"
                            >
                                <div className="w-10 h-10 mx-auto mb-3 bg-[#F0F0EE] dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.06] rounded-full flex items-center justify-center">
                                    <stat.icon className="w-4 h-4 text-[#C9A227]" strokeWidth={1.5} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-semibold text-[#0C0C0C] dark:text-white mb-1 font-mono tracking-tight">
                                    <AnimatedStat to={stat.number} suffix={stat.suffix} />
                                </div>
                                <div className="text-[11px] text-[#666666] dark:text-[#9E9E9E] font-mono tracking-widest uppercase">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carrossel de Projetos */}
            <section className="py-28 bg-[#F7F7F6] dark:bg-[#070707] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-3"
                    >
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            PORTFÓLIO SELECIONADO
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#0C0C0C] dark:text-white">
                            Projetos em <span className="gold-gradient-text">evidência</span>
                        </h2>
                        <p className="text-base text-[#666666] dark:text-[#9E9E9E] max-w-2xl mx-auto font-normal">
                            Aplicações web, sistemas customizados e plataformas digitais com foco em performance e elegância.
                        </p>
                    </motion.div>

                    <ProjectCarousel excludeCategorySlug="fotografia" />

                    <div className="text-center mt-12">
                        <Link to="/portfolio">
                            <button className="bg-white dark:bg-[#0B0B0B] hover:bg-[#F0F0EE] dark:hover:bg-[#121212] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#C9A227]/40 text-[#0C0C0C] dark:text-white hover:text-[#A88218] dark:hover:text-[#ECBD57] text-xs uppercase tracking-wider px-8 py-3.5 font-semibold rounded-full shadow-sm transition-all inline-flex items-center gap-2">
                                <span>Ver Todos os Projetos</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Fotografia em Destaque (se houver) */}
            {photographyCount > 0 && (
                <section className="py-24 bg-white dark:bg-[#0A0A0A] border-y border-black/[0.08] dark:border-white/[0.06] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 space-y-3">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                                ARTES VISUAIS
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#0C0C0C] dark:text-white">
                                Fotografia <span className="gold-gradient-text">Autoral</span>
                            </h2>
                            <p className="text-base text-[#666666] dark:text-[#9E9E9E] max-w-xl mx-auto">
                                Olhares artísticos e composições para marcas, eventos e retratos corporativos.
                            </p>
                        </div>

                        <ProjectCarousel categorySlug="fotografia" onDataLoaded={setPhotographyCount} />

                        <div className="text-center mt-12">
                            <Link to="/portfolio-fotografia/galeria">
                                <button className="bg-white dark:bg-[#0B0B0B] hover:bg-[#F0F0EE] dark:hover:bg-[#121212] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#C9A227]/40 text-[#0C0C0C] dark:text-white hover:text-[#A88218] dark:hover:text-[#ECBD57] text-xs uppercase tracking-wider px-8 py-3.5 font-semibold rounded-full shadow-sm transition-all inline-flex items-center gap-2">
                                    <span>Acessar Galeria Fotográfica</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Grade de Serviços RAMIELL */}
            <section className="py-28 bg-white dark:bg-[#0A0A0A] border-t border-black/[0.08] dark:border-white/[0.06] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-3"
                    >
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            ESPECIALIDADES
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#0C0C0C] dark:text-white">
                            Nossos <span className="gold-gradient-text">Serviços</span>
                        </h2>
                        <p className="text-base text-[#666666] dark:text-[#9E9E9E] max-w-2xl mx-auto font-normal">
                            Soluções integradas de tecnologia para consolidar a presença digital do seu negócio.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Palette;
                            return (
                                <motion.div
                                    key={service.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                    className="editorial-card p-8 group"
                                >
                                    <div className="w-12 h-12 mb-5 rounded-full bg-[#F0F0EE] dark:bg-[#121212] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center group-hover:border-[#C9A227]/40 transition-colors">
                                        <IconComponent className="w-5 h-5 text-[#C9A227]" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-[#0C0C0C] dark:text-white group-hover:text-[#A88218] dark:group-hover:text-[#ECBD57] transition-colors tracking-[-0.02em]">
                                        {service.title}
                                    </h3>
                                    <p className="text-[#666666] dark:text-[#9E9E9E] text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/servicos">
                            <button className="bg-white dark:bg-[#0B0B0B] hover:bg-[#F0F0EE] dark:hover:bg-[#121212] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#C9A227]/40 text-[#0C0C0C] dark:text-white hover:text-[#A88218] dark:hover:text-[#ECBD57] text-xs uppercase tracking-wider px-8 py-3.5 font-semibold rounded-full shadow-sm transition-all inline-flex items-center gap-2">
                                <span>Ver Todas as Soluções</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Avaliações de Clientes */}
            <section className="py-28 bg-[#F7F7F6] dark:bg-[#070707] border-t border-black/[0.08] dark:border-white/[0.06] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 space-y-3"
                    >
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            DEPOIMENTOS
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#0C0C0C] dark:text-white">
                            A confiança de quem <span className="gold-gradient-text">escolheu a RAMIELL</span>
                        </h2>
                    </motion.div>
                    <ReviewsCarousel />
                </div>
            </section>

            {/* CTA Final Editorial */}
            <section className="py-24 bg-white dark:bg-[#0A0A0A] border-t border-black/[0.08] dark:border-white/[0.06] text-center transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            VAI DE RAMIELL
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-[#0C0C0C] dark:text-white leading-tight">
                            Pronto para desenvolver o seu próximo projeto?
                        </h2>
                        <p className="text-base sm:text-lg text-[#666666] dark:text-[#9E9E9E] max-w-xl mx-auto font-normal leading-relaxed">
                            Fale diretamente com nossa equipe e receba uma proposta detalhada para seu sistema ou site.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link to="/contato" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] text-xs uppercase tracking-wider px-8 py-4 font-semibold rounded-full shadow-[0_0_24px_rgba(201,162,39,0.25)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                    <span>Solicitar Proposta</span>
                                    <ArrowRight className="w-4 h-4 text-[#070707]" strokeWidth={2} />
                                </button>
                            </Link>

                            <Link to="/store" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-white dark:bg-[#0B0B0B] border border-black/[0.08] dark:border-white/[0.08] hover:border-[#C9A227]/40 text-[#0C0C0C] dark:text-white hover:text-[#A88218] dark:hover:text-[#ECBD57] text-xs uppercase tracking-wider px-8 py-4 font-semibold rounded-full shadow-sm transition-all inline-flex items-center justify-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-[#C9A227]" strokeWidth={1.5} />
                                    <span>Conhecer a Store</span>
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
