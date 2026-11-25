import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Target, Eye, Heart, Award, Users, Lightbulb, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import teamImage from '@/Assets/team-work.webp';

/**
 * Página Sobre a RAMIELL (ramiell.com/sobre)
 * Narrativa institucional editorial, princípios da marca, equipe e visão de futuro.
 */
const About = () => {
    const values = [
        {
            icon: Lightbulb,
            title: 'Inovação & Autonomia',
            description: 'Utilizamos tecnologias contemporâneas e arquiteturas sólidas para construir soluções digitais duradouras.'
        },
        {
            icon: Award,
            title: 'Rigor Técnico & Design',
            description: 'Acreditamos que design refinado e engenharia de software de ponta são inseparáveis para um produto de valor.'
        },
        {
            icon: Users,
            title: 'Parceria Estratégica',
            description: 'Atuamos próximos de nossos parceiros com transparência, compromisso de entrega e acompanhamento contínuo.'
        },
        {
            icon: ShieldCheck,
            title: 'Confiabilidade',
            description: 'Sistemas seguros, código limpo e infraestrutura de alta disponibilidade para suportar operações reais.'
        }
    ];

    const teamMembers = [
        {
            name: 'Rafael Pita',
            role: 'Fundador & Head de Tecnologia',
            bio: 'Engenheiro de software e diretor criativo com mais de 10 anos desenvolvendo ecossistemas digitais, sistemas e experiências interativas.',
            image: 'https://horizons-cdn.hostinger.com/55810f13-6c54-4da4-a823-2e484d52677d/img_0208-aveV3.JPG'
        },
        {
            name: 'Design & UI/UX',
            role: 'Direção Visual Editorial',
            bio: 'Especialistas dedicados a identidades marcantes, tipografia refinada e interfaces digitais de alta usabilidade.',
            image: 'https://images.unsplash.com/photo-1495224814653-94f36c0a31ea'
        },
        {
            name: 'Engenharia Web & Cloud',
            role: 'Desenvolvimento & Infraestrutura',
            bio: 'Engenheiros focados em desenvolvimento Full Stack, automações avançadas e deploys resilientes em nuvem.',
            image: 'https://images.unsplash.com/photo-1634836023845-eddbfe9937da'
        }
    ];

    return (
        <div className="bg-[#070707] text-white min-h-screen selection:bg-[#C9A227]/30 selection:text-white">
            <SEO 
                title="Sobre a RAMIELL | Engenharia Digital & Design de Alto Padrão"
                description="Conheça a RAMIELL. Desenvolvimento de sites, sistemas sob medida e experiências digitais exclusivas. Vai de Ramiell."
                keywords="sobre ramiell, vai de ramiell, desenvolvimento web ramiell, sistemas corporativos, historia ramiell"
            />

            {/* Hero Section Editorial */}
            <section className="pt-32 pb-20 md:py-28 relative editorial-grid">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0B0B] border border-white/[0.08] text-xs font-mono text-[#9E9E9E]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                        <span className="text-[#ECBD57] font-semibold uppercase font-sans">RAMIELL</span>
                        <span className="text-white/20">•</span>
                        <span className="uppercase tracking-wider">Manifesto Institucional</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-tight text-white">
                        Construindo o futuro de marcas através de{' '}
                        <span className="gold-gradient-text">engenharia e design</span>.
                    </h1>

                    <p className="text-base sm:text-lg text-[#9E9E9E] max-w-2xl mx-auto font-normal leading-relaxed">
                        A RAMIELL desenvolve experiências digitais e sistemas pensados para negócios que buscam autoridade, estabilidade e elegância.
                    </p>
                </div>
            </section>

            {/* História / Posicionamento */}
            <section className="py-24 bg-[#0A0A0A] border-y border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                                ORIGEM & PROPÓSITO
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white leading-tight">
                                Mais que código, entregamos valor e autoridade digital.
                            </h2>
                            <div className="space-y-4 text-[#9E9E9E] text-sm sm:text-base font-normal leading-relaxed">
                                <p>
                                    A RAMIELL foi concebida para atender à demanda de clientes e empresas que precisam de soluções além do padrão. Em um ecossistema digital saturado de modelos genéricos, priorizamos arquitetura refinada, estética editorial e performance real.
                                </p>
                                <p>
                                    Cada projeto que entregamos une visual marcante, carregamento ultra-rápido, SEO estruturado e lógica operacional confiável, proporcionando a parceiros e clientes a segurança de uma plataforma premium.
                                </p>
                                <p className="text-white font-medium">
                                    Vai de Ramiell.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="p-3 rounded-[20px] bg-[#0B0B0B] border border-white/[0.06] shadow-2xl">
                                <img
                                    alt="Ambiente de desenvolvimento RAMIELL"
                                    src={teamImage}
                                    className="w-full h-auto rounded-[16px] object-cover filter brightness-90"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pilares Institucionais: Missão, Visão e Valores */}
            <section className="py-24 bg-[#070707]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="editorial-card p-8 space-y-4">
                            <div className="w-12 h-12 bg-[#121212] border border-white/[0.06] rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-[#C9A227]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">Missão</h3>
                            <p className="text-[#9E9E9E] text-sm leading-relaxed">
                                Desenvolver sites e sistemas que representem fielmente o mais alto padrão dos nossos clientes, unindo usabilidade, segurança e velocidade.
                            </p>
                        </div>

                        <div className="editorial-card p-8 space-y-4">
                            <div className="w-12 h-12 bg-[#121212] border border-white/[0.06] rounded-full flex items-center justify-center">
                                <Eye className="w-5 h-5 text-[#C9A227]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">Visão</h3>
                            <p className="text-[#9E9E9E] text-sm leading-relaxed">
                                Consolidar a RAMIELL como uma das principais referências em engenharia de software e experiências digitais premium no mercado nacional e internacional.
                            </p>
                        </div>

                        <div className="editorial-card p-8 space-y-4">
                            <div className="w-12 h-12 bg-[#121212] border border-white/[0.06] rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-[#C9A227]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">Valores</h3>
                            <p className="text-[#9E9E9E] text-sm leading-relaxed">
                                Excelência técnica, discrição, compromisso irrestrito com prazos e valorização do detalhe em cada linha de código e pixel entregue.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores Detalhados */}
            <section className="py-24 bg-[#0A0A0A] border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            DIRETRIZES
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
                            Princípios que guiam nossa <span className="gold-gradient-text">execução</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {values.map((val) => (
                            <div key={val.title} className="editorial-card p-8 flex items-start gap-5">
                                <div className="w-12 h-12 bg-[#121212] border border-white/[0.06] rounded-full flex items-center justify-center shrink-0">
                                    <val.icon className="w-5 h-5 text-[#C9A227]" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-white tracking-[-0.02em]">{val.title}</h3>
                                    <p className="text-[#9E9E9E] text-sm leading-relaxed">{val.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Equipe RAMIELL */}
            <section className="py-24 bg-[#070707] border-t border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
                            LIDERANÇA & TALENTO
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
                            Quem faz a <span className="gold-gradient-text">RAMIELL acontecer</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="editorial-card p-8 text-center space-y-5">
                                <div className="relative inline-block">
                                    <img
                                        alt={member.name}
                                        className="w-28 h-28 rounded-full mx-auto object-cover border border-white/[0.08] filter drop-shadow-[0_0_12px_rgba(201,162,39,0.15)]"
                                        src={member.image}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold text-white tracking-[-0.02em]">{member.name}</h3>
                                    <p className="text-xs font-mono text-[#C9A227] uppercase tracking-wider">{member.role}</p>
                                </div>
                                <p className="text-[#9E9E9E] text-xs sm:text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 bg-[#0A0A0A] border-t border-white/[0.06] text-center">
                <div className="max-w-3xl mx-auto px-4 space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
                        Vamos iniciar seu próximo projeto?
                    </h2>
                    <p className="text-[#9E9E9E] text-base leading-relaxed">
                        Converse conosco e entenda como a RAMIELL pode transformar sua presença digital.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link to="/contato">
                            <button className="bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] text-xs uppercase tracking-wider font-semibold px-8 py-4 rounded-full shadow-[0_0_24px_rgba(201,162,39,0.25)] transition-all">
                                Falar com a Equipe
                            </button>
                        </Link>
                        <Link to="/portfolio">
                            <button className="bg-[#0B0B0B] border border-white/[0.08] hover:border-[#C9A227]/40 text-white hover:text-[#ECBD57] text-xs uppercase tracking-wider font-semibold px-8 py-4 rounded-full transition-all">
                                Ver Portfólio
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
