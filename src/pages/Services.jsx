import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Página de Serviços RAMIELL (ramiell.com/servicos)
 * Apresentação das áreas de atuação em engenharia de software, plataformas web,
 * sistemas corporativos e experiências digitais.
 */
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

    // Mapeamento de rotas dedicadas
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

    const iconMap = {
        Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield
    };

    return (
        <div className="min-h-screen bg-[#070707] text-white selection:bg-[#C9A227]/30 selection:text-white">
            <SEO 
                title="Serviços & Soluções Digitais | RAMIELL"
                description="Desenvolvimento de sites de alto padrão, sistemas personalizados, aplicações web e infraestrutura digital pela RAMIELL. Vai de Ramiell."
                keywords="servicos digitais, criacao de sites, sistemas sob medida, aplicacoes web, ramiell"
            />

            {/* Hero Section Editorial */}
            <section className="pt-32 pb-16 md:pt-36 md:pb-24 relative editorial-grid">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0B0B] border border-white/[0.08] text-xs font-mono text-[#9E9E9E]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                        <span className="text-[#ECBD57] font-semibold uppercase font-sans">RAMIELL</span>
                        <span className="text-white/20">•</span>
                        <span className="uppercase tracking-wider">Capacidades & Engenharia</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] text-white leading-tight">
                        Soluções sob medida para elevar a sua{' '}
                        <span className="gold-gradient-text">presença digital</span>.
                    </h1>

                    <p className="text-base sm:text-lg text-[#9E9E9E] max-w-2xl mx-auto font-normal leading-relaxed">
                        Combinamos precisão técnica, arquitetura de software e design refinado para construir ferramentas de alto impacto para o seu negócio.
                    </p>
                </div>
            </section>

            {/* Grade de Serviços */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || Palette;
                        return (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="editorial-card p-8 group relative overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start gap-5 mb-6">
                                        <div className="w-14 h-14 bg-[#121212] border border-white/[0.06] rounded-full flex items-center justify-center shrink-0 group-hover:border-[#C9A227]/40 transition-colors">
                                            <IconComponent className="w-6 h-6 text-[#C9A227]" strokeWidth={1.5} />
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-[#ECBD57] transition-colors tracking-[-0.02em]">
                                                {service.title}
                                            </h3>
                                            <p className="text-[#9E9E9E] text-sm leading-relaxed font-normal">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>

                                    {service.features && service.features.length > 0 && (
                                        <div className="space-y-2.5 pt-4 border-t border-white/[0.06] mb-6">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-2.5 text-xs text-[#9E9E9E]">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Link
                                        to={serviceSlugMap[service.slug] || `/portfolio#${service.slug}`}
                                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#ECBD57] hover:text-white transition-colors"
                                    >
                                        <span>Detalhes do serviço</span>
                                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Metodologia de Trabalho */}
            <section className="py-24 bg-[#0A0A0A] border-y border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            METODOLOGIA
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
                            Nosso processo de <span className="gold-gradient-text">execução</span>
                        </h2>
                        <p className="text-base text-[#9E9E9E] max-w-2xl mx-auto font-normal">
                            Uma jornada estruturada em quatro etapas para assegurar rigor técnico e entrega pontual.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Diagnóstico & Escopo', description: 'Mapeamento aprofundado dos requisitos, arquitetura e objetivos de negócio.' },
                            { step: '02', title: 'Design Editorial', description: 'Criação visual refinada, prototipação responsiva e definição de fluxos de usuário.' },
                            { step: '03', title: 'Engenharia & Código', description: 'Desenvolvimento ágil, integração com APIs, banco de dados e testes de usabilidade.' },
                            { step: '04', title: 'Deploy & Suporte', description: 'Publicação em servidores dedicados com SSL, SEO ativado e monitoramento contínuo.' }
                        ].map((item, index) => (
                            <div
                                key={item.step}
                                className="editorial-card p-6 text-center space-y-4"
                            >
                                <div className="w-12 h-12 mx-auto bg-[#121212] border border-white/[0.06] rounded-full flex items-center justify-center">
                                    <span className="text-sm font-mono font-bold text-[#C9A227]">{item.step}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-white tracking-[-0.02em]">{item.title}</h3>
                                <p className="text-xs text-[#9E9E9E] leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="editorial-card p-10 sm:p-14 border-[#C9A227]/20 bg-gradient-to-b from-[#0B0B0B] to-[#0A0A0A] space-y-6">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227] block">
                        VAI DE RAMIELL
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
                        Pronto para transformar sua ideia em realidade?
                    </h2>
                    <p className="text-[#9E9E9E] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Fale diretamente com nossa equipe e receba uma estimativa técnica detalhada para seu projeto.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link to="/contato">
                            <button className="bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] text-xs uppercase tracking-wider font-semibold px-8 py-4 rounded-full shadow-[0_0_24px_rgba(201,162,39,0.25)] transition-all">
                                Iniciar Atendimento
                            </button>
                        </Link>
                        <Link to="/portfolio">
                            <button className="bg-[#121212] border border-white/[0.08] hover:border-[#C9A227]/40 text-white hover:text-[#ECBD57] text-xs uppercase tracking-wider font-semibold px-8 py-4 rounded-full transition-all">
                                Explorar Portfólio
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
