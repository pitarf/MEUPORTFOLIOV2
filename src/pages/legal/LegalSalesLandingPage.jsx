import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
    Shield,
    CheckCircle2,
    Star,
    ArrowRight,
    Clock,
    Flame,
    ExternalLink,
    Palette,
    Search,
    Smartphone,
    ChevronDown,
    Users,
    Check,
    Sun,
    Moon
} from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import SEO from '@/components/SEO';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Landing Page de Alta Conversao para Venda de Criacao de Sites Juridicos
 * Focada no ranqueamento organico no Google e captacao ativa de advogados.
 * Configurada com Tema Claro por padrão para alta autoridade institucional.
 * Rota: /criacao-site-advogado e /sites-para-advogados
 */
export default function LegalSalesLandingPage() {
    // FAQ Accordion Estado
    const [openFaq, setOpenFaq] = useState(0);

    // Controle de Tema via ThemeContext: Tema Claro ('light') preferencial nesta Landing Page
    const { theme, toggleTheme, setTheme } = useTheme();

    useEffect(() => {
        // Armazena o tema prévio que o visitante estava usando no sistema
        const previousTheme = localStorage.getItem('theme') || 'dark';

        // Ativa o Tema Claro como padrão prioritário ao carregar a página
        if (setTheme) {
            setTheme('light');
        }

        return () => {
            // Ao sair da landing page para o portfólio geral, restaura a preferência anterior
            if (setTheme) {
                setTheme(previousTheme);
            }
        };
    }, []);

    // Contador regressivo de 48 horas persistido no localStorage
    const [timeLeft, setTimeLeft] = useState(() => {
        try {
            const storedExpiry = localStorage.getItem('legal_sales_timer_expiry');
            let targetExpiry;
            if (storedExpiry && !isNaN(Number(storedExpiry))) {
                targetExpiry = Number(storedExpiry);
            } else {
                targetExpiry = Date.now() + 48 * 3600 * 1000;
                localStorage.setItem('legal_sales_timer_expiry', targetExpiry.toString());
            }

            const remainingMs = Math.max(0, targetExpiry - Date.now());
            const totalSeconds = Math.floor(remainingMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return { hours, minutes, seconds };
        } catch {
            return { hours: 47, minutes: 58, seconds: 42 };
        }
    });

    useEffect(() => {
        const timer = setInterval(() => {
            try {
                const storedExpiry = localStorage.getItem('legal_sales_timer_expiry');
                let targetExpiry = storedExpiry ? Number(storedExpiry) : Date.now() + 48 * 3600 * 1000;
                if (Date.now() >= targetExpiry) {
                    targetExpiry = Date.now() + 48 * 3600 * 1000;
                    localStorage.setItem('legal_sales_timer_expiry', targetExpiry.toString());
                }

                const remainingMs = Math.max(0, targetExpiry - Date.now());
                const totalSeconds = Math.floor(remainingMs / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                setTimeLeft({ hours, minutes, seconds });
            } catch {
                setTimeLeft((prev) => (prev.seconds > 0 ? { ...prev, seconds: prev.seconds - 1 } : { hours: 47, minutes: 59, seconds: 59 }));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Link oficial de conversao no WhatsApp
    const defaultWhatsAppNumber = '5521966149077';
    const createWhatsAppUrl = (customText) => {
        const message = customText || 'Olá, Rafael! Vi a oferta da landing page para advogados de R$ 450 por R$ 297 e gostaria de ver um modelo para o meu escritório.';
        return `https://wa.me/${defaultWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    };

    // Vitrine de Modelos Prontos para Demonstracao
    const showcaseTemplates = [
        {
            id: 'trabalhista',
            title: 'Direito Trabalhista & Bancário',
            badge: 'Alta Conversão',
            color: 'from-amber-600 to-amber-800',
            borderColor: 'border-amber-500/30',
            desc: 'Estrutura desenhada para captação ética de reclamatórias trabalhistas, horas extras e rescisões contratuais.',
            demoPath: '/modelo-advocacia/trabalhista',
            features: ['Calculadora preliminar integrada', 'Depoimentos em destaque', 'Botão direto de WhatsApp']
        },
        {
            id: 'familia',
            title: 'Família, Sucessões & Inventários',
            badge: 'Boutique Jurídica',
            color: 'from-rose-700 to-rose-900',
            borderColor: 'border-rose-500/30',
            desc: 'Visual nobre em vinho executivo para divórcios, partilhas e planejamento sucessório com discrição total.',
            demoPath: '/modelo-advocacia/familia',
            features: ['Paleta Vinho & Champagne', 'Rito de atendimento acolhedor', 'Respeito estrito à OAB']
        },
        {
            id: 'consumidor',
            title: 'Direito do Consumidor & Golpes Digitais',
            badge: 'Ágil e Direto',
            color: 'from-emerald-600 to-emerald-800',
            borderColor: 'border-emerald-500/30',
            desc: 'Foco em negativação indevida, cancelamentos de voos, fraudes bancárias e abusos com triagem rápida.',
            demoPath: '/modelo-advocacia/consumidor',
            features: ['FAQ de dúvidas rápidas', 'Avaliações com 5.0 estrelas', 'Botão flutuante WhatsApp']
        },
        {
            id: 'geral',
            title: 'Full-Service & Banca Corporativa',
            badge: 'Institucional de Luxo',
            color: 'from-slate-800 to-slate-950',
            borderColor: 'border-slate-500/30',
            desc: 'Ideal para escritórios com múltiplas especialidades que necessitam de presença imponente e corporativa.',
            demoPath: '/modelo-advocacia/geral',
            features: ['Carrossel editorial de áreas', 'Linha do tempo da banca', 'Conexão com Google Maps']
        }
    ];

    // Perguntas Frequentes
    const faqItems = [
        {
            q: 'Em quanto tempo o meu site fica pronto para uso?',
            a: 'Após o envio das suas informações básicas (nome, foto ou logotipo, áreas de atuação e WhatsApp), sua landing page é totalmente configurada e colocada no ar no período de 24 a 48 horas úteis.'
        },
        {
            q: 'Como funciona a taxa de R$ 297? Há mensalidades obrigatórias?',
            a: 'Não cobramos nenhuma mensalidade forçada! Os R$ 297 são uma taxa única de implementação completa (com desconto promocional de R$ 450). O único custo externo recorrente é a anuidade do seu próprio domínio (ex: seunome.adv.br no Registro.br, que custa em média R$ 40 a R$ 60 ao ano pago diretamente ao órgão oficial).'
        },
        {
            q: 'O site respeita o Código de Ética e as normas do CFOAB?',
            a: 'Sim, com 100% de conformidade! Nossa arquitetura foi projetada rigorosamente dentro do Provimento 205/2021 da OAB. A comunicação tem caráter exclusivamente informativo, sóbrio e de validação de autoridade profissional, sem promessas de resultado ou mercantilização indevida.'
        },
        {
            q: 'Eu consigo colocar minha foto, meu logotipo e minhas cores?',
            a: 'Com certeza! Nós personalizamos o site inteiro com a sua identidade oficial: sua foto executiva, seu logotipo oficial, a paleta de cores da sua banca, a lista das suas especialidades reais, endereço físico e inscrição na OAB.'
        },
        {
            q: 'O site já vem otimizado para o Google (SEO)?',
            a: 'Sim! A estrutura técnica possui marcação semântica de ponta, tags Open Graph para prévia profissional no WhatsApp, dados estruturados Schema.org, metadados canônicos e SEO local configurado para ranquear seu escritório nas buscas da sua cidade e região.'
        },
        {
            q: 'E se eu não tiver logotipo profissional ainda?',
            a: 'Não se preocupe! Nós criamos uma tipografia institucional nobre e moderna para o nome do seu escritório, com padrão visual de alta sofisticação, sem nenhum custo adicional.'
        }
    ];

    // Schema.org estruturado em JSON-LD para o Google
    const schemaData = useMemo(() => ({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        'name': 'Criação de Sites para Advogados : Rafael Pita Solutions',
        'image': 'https://rafaelpitaoficial.com.br/favicon.svg',
        'url': 'https://rafaelpitaoficial.com.br/criacao-site-advogado',
        'telephone': '+5521966149077',
        'priceRange': 'R$ 297',
        'description': 'Desenvolvimento de landing pages e sites exclusivos para advogados e escritórios de advocacia com SEO de alto padrão, conformidade com a OAB e integração com WhatsApp.',
        'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'BR'
        },
        'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Serviços de Desenvolvimento Jurídico',
            'itemListElement': [
                {
                    '@type': 'Offer',
                    'itemOffered': {
                        '@type': 'Service',
                        'name': 'Criação e Configuração de Landing Page para Advogado'
                    },
                    'price': '297.00',
                    'priceCurrency': 'BRL',
                    'availability': 'https://schema.org/InStock',
                    'validThrough': new Date(Date.now() + 48 * 3600 * 1000).toISOString()
                }
            ]
        }
    }), []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-200">
            {/* Metadados e SEO Otimizados para Ranquear no Google */}
            <SEO
                title="Criação de Site para Advogado | De R$ 450 por R$ 297"
                description="Criador e desenvolvedor de site de advogado com SEO de alto padrão. Tenha uma landing page jurídica sob medida com sua logo, fotos e botão de WhatsApp. De R$ 450 por apenas R$ 297."
                keywords="criar site para advogado, criacao de site para advogado, desenvolvedor de site de advogado, onde comprar site de advogado, como comprar site de advogado, site de advogado com seo, landing page para advogados, site juridico pronto, site responsivo oab, marketing juridico site"
                url="https://rafaelpitaoficial.com.br/criacao-site-advogado"
            />

            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            {/* FAIXA SUPERIOR DE ESCASSEZ : OFERTA 48 HORAS */}
            <header className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 text-white py-2.5 px-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-white">
                        <Flame className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                        <span>
                            Oferta Exclusiva de Lançamento: De <span className="line-through text-emerald-200">R$ 450</span> por apenas <strong className="text-amber-300 text-sm font-black">R$ 297</strong> (+ domínio)
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Botão de Alternância de Tema */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Alternar para Tema Claro (Padrão Recomendado)' : 'Alternar para Tema Escuro'}
                            className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white px-2.5 py-1 rounded-md text-[11px] transition-all border border-white/20"
                        >
                            {theme === 'dark' ? (
                                <>
                                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                                    <span className="hidden md:inline">Tema Claro</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-3.5 h-3.5 text-slate-100" />
                                    <span className="hidden md:inline">Tema Escuro</span>
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-black/40 px-2.5 py-1 rounded-full border border-white/20 text-white">
                            <Clock className="w-3.5 h-3.5 text-amber-300" />
                            <span>Expira em:</span>
                            <span className="font-bold text-amber-300">
                                {String(timeLeft.hours).padStart(2, '0')}:
                                {String(timeLeft.minutes).padStart(2, '0')}:
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </span>
                        </div>

                        <a
                            href={createWhatsAppUrl('Olá, Rafael! Gostaria de garantir a condição de R$ 297 da landing page jurídica antes do término das 48h.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-emerald-950 hover:bg-slate-100 font-extrabold px-3 py-1 rounded-md text-[11px] transition-all shrink-0 shadow"
                        >
                            Garantir Vaga
                        </a>
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL (LANDMARK MAIN PARA ACESSIBILIDADE WCAG E LIGHTHOUSE) */}
            <main id="main-content" role="main">
                {/* SEÇÃO 1: HERO MONUMENTAL */}
                <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-[#bcf13b] border border-emerald-500/20">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Conforme Provimento 205/2021 CFOAB</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                            Criação de Site para Advogado com{' '}
                            <span className="text-emerald-700 dark:text-[#bcf13b]">
                                SEO e Alta Conversão
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-700 dark:text-gray-200 leading-relaxed max-w-2xl mx-auto">
                            Pare de perder clientes que procuram advogados na sua cidade e não encontram o seu escritório.
                            Tenha uma <strong>Landing Page Jurídica completa</strong>, configurada com seu logotipo, suas fotos, suas áreas de atuação e botão direto para o seu WhatsApp oficial.
                        </p>

                        {/* Preço de Destaque no Hero */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] rounded-2xl p-4 shadow-sm inline-flex items-center gap-4">
                                <div className="text-left">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 line-through block font-medium">De R$ 450,00</span>
                                    <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-[#bcf13b]">
                                        R$ 297,00
                                    </div>
                                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                                        Taxa única de implementação (+ domínio)
                                    </span>
                                </div>

                                <a
                                    href={createWhatsAppUrl('Olá, Rafael! Quero solicitar a criação do site do meu escritório de advocacia por R$ 297.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 group"
                                >
                                    <WhatsAppIcon className="w-5 h-5 text-white" />
                                    <span>Quero Meu Site Pronto</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* Benefícios Rápidos */}
                        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 dark:text-gray-300">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-[#bcf13b]" />
                                Entrega rápida em 24h a 48h
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-[#bcf13b]" />
                                100% responsivo para celulares
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-[#bcf13b]" />
                                Sem mensalidade obrigatória
                            </span>
                        </div>
                    </div>
                </section>

            {/* SEÇÃO 2: VITRINE DE MODELOS JURÍDICOS REAIS */}
            <section id="modelos" className="py-16 bg-white dark:bg-[#121210] border-y border-slate-200 dark:border-[#23231f]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-[#bcf13b]">
                            Demonstrações Reais ao Vivo
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                            Modelos de Sites Criados para o Ramo Jurídico
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                            Clique para abrir a demonstração interativa completa de cada especialidade. Todos os textos, cores e fotos serão adaptados para a sua marca.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {showcaseTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="border border-slate-200 dark:border-[#23231f] rounded-2xl p-6 bg-slate-50 dark:bg-[#181814] flex flex-col justify-between hover:border-emerald-500 dark:hover:border-[#bcf13b] transition-all shadow-sm group"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                                            {template.badge}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                                            <span className="font-bold">5.0</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#bcf13b] transition-colors">
                                        {template.title}
                                    </h3>

                                    <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                                        {template.desc}
                                    </p>

                                    <ul className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-[#23231f]">
                                        {template.features.map((feat, fIdx) => (
                                            <li key={fIdx} className="text-xs text-slate-700 dark:text-gray-300 flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#bcf13b] shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-6 flex items-center gap-3">
                                    <Link
                                        to={template.demoPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#33332d] text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#23231f] text-slate-800 dark:text-gray-200 transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-[#bcf13b]" />
                                        <span>Testar Modelo ao Vivo</span>
                                    </Link>

                                    <a
                                        href={createWhatsAppUrl(`Olá, Rafael! Gostei muito do modelo jurídico de ${template.title}. Gostaria de solicitar este modelo com meus dados.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                                    >
                                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                                        <span>Escolher Este</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

                {/* SEÇÃO 3: PERSONALIZAÇÃO COMPLETA ("COM A CARA DO SEU ESCRITÓRIO") */}
                <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#bcf13b]">
                            Personalização Rigorosa
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                            Deixamos o Site 100% com a Cara da Sua Banca
                        </h2>
                        <p className="text-sm text-slate-700 dark:text-gray-300">
                            Você não recebe um modelo genérico. Adaptamos cada detalhe para transmitir a autoridade real da sua atuação.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-5 rounded-2xl space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-[#bcf13b] flex items-center justify-center">
                                <Palette className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Suas Cores & Logotipo</h3>
                            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                                Ajustamos a identidade cromática: Vinho Nobre, Navy Profundo, Verde Esmeralda ou Dourado Real, alinhados com o seu logotipo oficial.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-5 rounded-2xl space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Suas Fotos & Biografia</h3>
                            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                                Inserimos sua foto profissional, histórico acadêmico, tempo de experiência e número de inscrição na OAB.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-5 rounded-2xl space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                                <Search className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">SEO & Google Maps</h3>
                            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                                Otimização de palavras-chave para quem pesquisa por advogados na sua cidade e bairro encontre o seu contato em primeiro lugar.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-5 rounded-2xl space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-[#bcf13b] flex items-center justify-center">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">WhatsApp de Atendimento</h3>
                            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                                Botão flutuante e chamadas ao longo de toda a página direcionando contatos diretamente para a conversa privada do seu escritório.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SEÇÃO 4: TABELA DE PREÇO TRANSPARENTE E ESCASSEZ */}
                <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                        <div className="text-center space-y-3 mb-10">
                            <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                                Condição Comercial Transparente
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                                Investimento Acessível sem Mensalidades Ocultas
                            </h2>
                            <p className="text-sm text-slate-300 max-w-xl mx-auto">
                                Tudo o que seu escritório precisa para se posicionar com alto padrão visual e captar clientes sem surpresas no orçamento.
                            </p>
                        </div>

                        <div className="bg-slate-800/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
                            <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                                Desconto de 34% : 48h
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-slate-300 line-through font-medium">De R$ 450,00</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl sm:text-5xl font-black text-white">
                                                R$ 297
                                            </span>
                                            <span className="text-xs text-slate-200 font-semibold">
                                                taxa única de implementação
                                            </span>
                                        </div>
                                        <p className="text-xs text-emerald-400 mt-1">
                                            Ou em até 12x no cartão de crédito
                                        </p>
                                    </div>

                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        + Domínio oficial registrado diretamente no seu CPF ou CNPJ (média de R$ 40 a R$ 60 ao ano no Registro.br, pago diretamente ao órgão gestor).
                                    </p>

                                    <div className="pt-2">
                                        <a
                                            href={createWhatsAppUrl('Olá, Rafael! Quero aproveitar a oferta de R$ 297 e colocar o site do meu escritório de advocacia no ar.')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg group"
                                        >
                                            <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                                            <span>Contratar via WhatsApp</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-slate-900/60 p-6 rounded-2xl border border-slate-700/60">
                                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
                                        Tudo o que está incluso no pacote:
                                    </h3>

                                    <div className="space-y-2 text-xs text-slate-200">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Landing Page de 1 Página (Single Page de Alta Conversão)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Personalização com seu Logotipo, Fotos e Cores</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Conformidade estrita com o Provimento 205/2021 da OAB</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Configuração do Botão Oficial do WhatsApp</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Otimização técnica para o Google (SEO Local e Metatags)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            <span>Hospedagem segura com Certificado SSL (Cadeado Verde)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEÇÃO 5: PERGUNTAS FREQUENTES (FAQ) */}
                <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center space-y-3 mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-[#bcf13b]">
                            Tire Suas Dúvidas
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                            Perguntas Frequentes
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqItems.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="border border-slate-200 dark:border-[#23231f] rounded-2xl overflow-hidden bg-white dark:bg-[#121210] transition-colors"
                                >
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-[#bcf13b] transition-colors"
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 text-xs text-slate-700 dark:text-gray-200 leading-relaxed border-t border-slate-100 dark:border-[#1d1d18] pt-3">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Final abaixo do FAQ */}
                    <div className="mt-12 text-center bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-8 rounded-3xl space-y-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Ainda ficou com alguma dúvida sobre a estrutura?
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-gray-300 max-w-md mx-auto">
                            Fale diretamente com o desenvolvedor responsável no WhatsApp. Demonstramos o layout na prática para o seu escritório.
                        </p>
                        <a
                            href={createWhatsAppUrl('Olá, Rafael! Gostaria de tirar algumas dúvidas sobre a criação de site para advogados.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
                        >
                            <WhatsAppIcon className="w-4 h-4 text-white" />
                            <span>Conversar no WhatsApp com Rafael</span>
                        </a>
                    </div>
                </section>
            </main>

            {/* RODAPÉ INSTITUCIONAL */}
            <footer className="border-t border-slate-200 dark:border-[#23231f] py-8 px-4 text-center text-xs text-slate-600 dark:text-slate-400">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <strong>Rafael Pita Solutions</strong> : Soluções Digitais & Inteligência Web
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <Link to="/" className="hover:underline">Home</Link>
                        <span>•</span>
                        <Link to="/portfolio" className="hover:underline">Portfólio</Link>
                        <span>•</span>
                        <Link to="/contato" className="hover:underline">Contato</Link>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}
