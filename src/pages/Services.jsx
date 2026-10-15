import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setServices(data || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Mapeamento estático de cores para evitar a purga do Tailwind CSS
    const serviceColors = {
        'design-grafico': 'from-pink-500 to-rose-600',
        'fotografia': 'from-blue-500 to-cyan-600',
        'desenvolvimento-web': 'from-green-500 to-emerald-600',
        'dashboards-power-bi': 'from-yellow-500 to-orange-600',
        'videos-com-ia': 'from-purple-500 to-violet-600',
        'trafego-pago': 'from-red-500 to-pink-600',
        'manutencao-de-computadores': 'from-gray-500 to-slate-600',
        'instalacao-cftv': 'from-indigo-500 to-blue-600'
    };

    // Mapeamento de slugs do banco para as novas URLs focadas em SEO de serviços
    const serviceSlugMap = {
        'desenvolvimento-web': '/criacao-de-sites',
        'dashboards-power-bi': '/dashboards-power-bi',
        'fotografia': '/fotografia-corporativa',
        'videos-com-ia': '/automacoes',
        'trafego-pago': '/landing-pages',
        'design-grafico': '/portfolio#design-grafico',
        'manutencao-de-computadores': '/portfolio#manutencao-de-computadores',
        'instalacao-cftv': '/portfolio#instalacao-cftv'
    };

    // Icon mapping
    const iconMap = {
        Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield
    };

    return (
        <>
            <SEO 
                title="Serviços Digitais e Tecnologia - Rafael Pita Solutions"
                description="Serviços premium de desenvolvimento web, criação de sites profissionais, sistemas comerciais, dashboards Power BI, tráfego pago e fotografia artística no RJ."
                keywords="servicos de tecnologia rj, criacao de sites profissional rj, programador rio de janeiro, desenvolvimento de sites rj, fotografo rio de janeiro, dashboards power bi rio de janeiro"
            />

            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                {/* Hero Section */}
                <section className="relative pt-24 pb-14 md:pt-28 md:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/20 via-transparent to-transparent dark:from-blue-950/10 z-0">
                    <div className="absolute inset-0 aurora-bg opacity-30 dark:opacity-40 z-0 pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
                                <span>Nossos Serviços</span>
                                <span className="text-[#bcf13b]">.</span>
                            </h1>
                            <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-semibold leading-relaxed px-4">
                                Soluções completas e personalizadas para transformar sua presença digital e impulsionar seu negócio
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-16 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Palette;
                            const gradientColor = serviceColors[service.slug] || service.color || 'from-[#bcf13b]/20 to-[#a8df2a]/10';
                            return (
                                <motion.div
                                    key={service.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="service-card p-8 rounded-xl group relative overflow-hidden bg-[#121210] border border-[#23231f] hover:border-[#bcf13b]"
                                >
                                    <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                                        <div className={`w-16 h-16 bg-[#181814] border border-[#23231f] group-hover:border-[#bcf13b] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all shadow-md`}>
                                            <IconComponent className="w-8 h-8 text-[#bcf13b]" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#bcf13b] transition-colors">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-400 mb-6 leading-relaxed text-sm font-medium">
                                                {service.description}
                                            </p>

                                            <div className="space-y-2.5 mb-6">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2.5">
                                                        <div className="w-2 h-2 bg-[#bcf13b] rounded-full flex-shrink-0"></div>
                                                        <span className="text-gray-300 text-sm font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Link to={serviceSlugMap[service.slug] || `/portfolio#${service.slug}`} className="inline-flex items-center text-[#bcf13b] hover:text-[#a8df2a] transition-colors font-bold text-sm group-hover:translate-x-1">
                                                <span>Saiba mais</span>
                                                <ArrowRight className="w-4 h-4 ml-1.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-20 bg-[#0a0a08] border-y border-[#23231f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                                <span>Como Trabalhamos</span>
                                <span className="text-[#bcf13b]">.</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-medium">
                                Nosso processo e estruturado para garantir resultados excepcionais em cada projeto
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { step: '01', title: 'Análise', description: 'Entendemos suas necessidades e objetivos de mercado' },
                                { step: '02', title: 'Planejamento', description: 'Criamos uma estratégia personalizada de alto impacto' },
                                { step: '03', title: 'Execução', description: 'Desenvolvemos com extrema qualidade e precisão técnica' },
                                { step: '04', title: 'Entrega', description: 'Apresentamos resultados excepcionais para sua validação' }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="service-card p-6 rounded-2xl border border-[#23231f] hover:border-[#bcf13b] bg-[#121210] flex flex-col justify-between text-center"
                                >
                                    <div>
                                        <div className="w-14 h-14 mx-auto mb-4 bg-[#181814] border border-[#23231f] rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-lg font-bold text-[#bcf13b]">{item.step}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{item.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-center p-12 rounded-2xl border border-[#23231f] bg-[#121210] shadow-2xl"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">
                            <span>Pronto para começar seu projeto</span>
                            <span className="text-[#bcf13b]">?</span>
                        </h2>
                        <p className="text-base md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
                            Entre em contato conosco e descubra como podemos transformar suas ideias em realidade digital premium
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/contato" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-extrabold text-lg px-8 py-6 rounded-xl shadow-lg shadow-[#bcf13b]/20 hover:scale-[1.02] transition-all">
                                    Solicitar Orçamento
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/portfolio" className="w-full sm:w-auto">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#23231f] hover:border-[#bcf13b] bg-transparent hover:bg-[#181814] text-white hover:text-[#bcf13b] text-lg px-8 py-6 font-bold rounded-xl transition-all">
                                    Ver Portfólio
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </div>
        </>
    );
};

export default Services;