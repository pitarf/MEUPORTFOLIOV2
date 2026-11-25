import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

/**
 * Página Oficial da Store RAMIELL (ramiell.com/store)
 * Apresenta o catálogo exclusivo de soluções digitais, templates e sistemas prontos
 * sob a estética editorial minimalista e acentos dourados.
 */
const Store = () => {
    const products = [
        {
            id: 'site-institucional-pro',
            title: 'Website Institucional Editorial',
            category: 'Web & Presença Digital',
            description: 'Estrutura completa com estética moderna, tipografia Geist, SEO técnico impecável e painel integrado.',
            features: ['Design exclusivo sob medida', 'SEO nativo e indexação Google', 'Otimização mobile-first', 'Painel administrativo'],
            badge: 'Mais Procurado',
        },
        {
            id: 'sistema-saas-core',
            title: 'Sistemas Web & Aplicações',
            category: 'Engenharia de Software',
            description: 'Arquitetura escalável para plataformas web, gestão de clientes, pagamentos automáticos e fluxos operacionais.',
            features: ['Autenticação segura', 'Integração de pagamentos (Pix / Cartão)', 'Banco de dados relacional', 'Deploy em nuvem de alta disponibilidade'],
            badge: 'Sob Medida',
        },
        {
            id: 'landing-high-conversion',
            title: 'Landing Pages de Alta Conversão',
            category: 'Prospecção & Vendas',
            description: 'Páginas estratégicas projetadas para tráfego pago, máxima velocidade e conversão imediata de leads.',
            features: ['Carregamento ultra-rápido (< 1s)', 'Copywriting orientado a ação', 'Integração direta com WhatsApp', 'Rastreamento avançado de métricas'],
            badge: 'Conversão',
        },
    ];

    return (
        <>
            <SEO
                title="Store RAMIELL | Soluções Digitais e Engenharia Web"
                description="Conheça a Store RAMIELL. Soluções digitais de alto padrão, sistemas sob medida e experiências web exclusivas. Vai de Ramiell."
                keywords="store ramiell, templates web, desenvolvimento de sites, sistemas sob medida, landing pages, vai de ramiell"
            />

            <div className="min-h-screen bg-[#070707] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 editorial-grid">
                <div className="max-w-7xl mx-auto">
                    {/* Cabeçalho da Store */}
                    <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-white/[0.06] text-xs font-mono text-[#C9A227]"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>RAMIELL STORE</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white font-sans uppercase tracking-wider">Soluções Exclusivas</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-tight"
                        >
                            Elevando o padrão dos seus{' '}
                            <span className="gold-gradient-text">ativos digitais</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-[#9E9E9E] text-base sm:text-lg leading-relaxed font-normal"
                        >
                            Projetos pensados para quem valoriza sofisticação, performance técnica e diferenciação real no mercado.
                        </motion.p>
                    </div>

                    {/* Grade de Produtos / Soluções */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {products.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="editorial-card p-8 flex flex-col justify-between hover:border-[#C9A227]/40 transition-all duration-300 group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-mono uppercase tracking-wider text-[#9E9E9E]">
                                            {item.category}
                                        </span>
                                        <span className="text-[11px] font-mono font-medium px-3 py-1 rounded-full bg-[#C9A227]/10 text-[#ECBD57] border border-[#C9A227]/20">
                                            {item.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-semibold text-white tracking-[-0.03em] mb-3 group-hover:text-[#ECBD57] transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-[#9E9E9E] text-sm leading-relaxed mb-6">
                                        {item.description}
                                    </p>

                                    <div className="space-y-2.5 pt-4 border-t border-white/[0.06] mb-8">
                                        {item.features.map((feat) => (
                                            <div key={feat} className="flex items-center text-xs text-[#9E9E9E]">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] mr-2 shrink-0" strokeWidth={1.5} />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/5521966149077?text=${encodeURIComponent(`Olá! Gostaria de encomendar a solução "${item.title}" pela Store RAMIELL.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button className="w-full h-12 rounded-full border border-white/[0.08] bg-[#121212] hover:bg-[#C9A227] text-white hover:text-[#070707] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.2)]">
                                        <span>Solicitar Solução</span>
                                        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                                    </button>
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* Banner de Encomenda Personalizada */}
                    <div className="editorial-card p-10 sm:p-14 text-center max-w-4xl mx-auto border-[#C9A227]/20 bg-gradient-to-b from-[#0B0B0B] to-[#0A0A0A]">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227] block mb-3">
                            PROJETOS SOB MEDIDA
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] mb-4">
                            Precisa de uma engenharia digital única para o seu negócio?
                        </h2>
                        <p className="text-[#9E9E9E] text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                            Desenvolvemos sistemas, aplicações e experiências digitais customizadas de ponta a ponta.
                        </p>
                        <a
                            href="https://wa.me/5521966149077?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto%20digital%20personalizado%20com%20a%20RAMIELL."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button className="bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_0_24px_rgba(201,162,39,0.25)] transition-all">
                                Falar com a RAMIELL
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Store;
