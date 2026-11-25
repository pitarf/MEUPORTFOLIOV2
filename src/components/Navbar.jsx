import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Ticket, ShieldCheck, ShoppingBag, Globe, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BrandLogo from '@/components/common/BrandLogo';

/**
 * Componente Navbar da marca RAMIELL
 * Estética editorial minimalista, suporte completo aos temas Claro e Escuro,
 * botão animado de alternância (Sol/Lua), botões em pílula e link oficial para /store.
 */
const Navbar = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { config } = useSiteConfig();
    const [scrolled, setScrolled] = useState(false);
    const [photoBranding, setPhotoBranding] = useState(null);

    const isPhotography = location.pathname.startsWith('/portfolio-fotografia');

    useEffect(() => {
        const fetchPhotoBranding = async () => {
            if (isPhotography && !photoBranding) {
                const { data } = await supabase
                    .from('landing_page_content')
                    .select('nav_logo_url, nav_site_name')
                    .eq('page_slug', 'fotografia')
                    .single();
                if (data) setPhotoBranding(data);
            }
        };
        fetchPhotoBranding();
    }, [isPhotography, photoBranding]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Itens principais de navegação RAMIELL
    const mainNavItems = [
        { name: t('nav_portfolio', 'Portfólio'), path: '/portfolio' },
        { name: t('nav_services', 'Serviços'), path: '/servicos' },
        { name: t('nav_store', 'Store'), path: '/store', isSpecial: true },
        { name: t('nav_photography', 'Fotografia'), path: '/portfolio-fotografia' },
        { name: t('nav_contact', 'Contato'), path: '/contato' },
    ];

    const studioNavItems = [
        { name: t('nav_about', 'Sobre a RAMIELL'), path: '/sobre' },
        { name: t('nav_reviews', 'Avaliações de Clientes'), path: '/avaliacoes' },
    ];

    const clientNavItems = [
        { name: t('nav_subscriptions', 'Minhas Assinaturas'), path: '/minha-assinatura', icon: <ShieldCheck className="w-4 h-4 mr-2 text-[#C9A227]" strokeWidth={1.5} /> },
        { name: t('nav_login', 'Área do Cliente'), path: '/area-clientes', icon: <User className="w-4 h-4 mr-2 text-[#C9A227]" strokeWidth={1.5} /> },
        { name: t('nav_track_ticket', 'Rastrear Chamado'), path: '/track-ticket', icon: <Ticket className="w-4 h-4 mr-2 text-[#C9A227]" strokeWidth={1.5} /> },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav
                className={`w-full transition-all duration-300 ${scrolled || isOpen
                    ? 'bg-white/90 dark:bg-[#070707]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3 sm:py-4'
                    : 'bg-transparent border-transparent py-5 sm:py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-12">
                        {/* Identidade / Monograma RAMIELL */}
                        <div className="flex items-center">
                            <BrandLogo
                                asLink={true}
                                size="md"
                                showSubtitle={false}
                            />
                        </div>

                        {/* Menu Desktop */}
                        <div className="hidden lg:flex items-center space-x-7">
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`text-sm tracking-wide transition-colors ${
                                        item.isSpecial
                                            ? 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 text-[#A88218] dark:text-[#ECBD57] hover:bg-[#C9A227]/20 font-medium'
                                            : location.pathname === item.path
                                                ? 'text-[#C9A227] font-semibold'
                                                : 'text-[#666666] hover:text-[#0C0C0C] dark:text-[#9E9E9E] dark:hover:text-white font-normal'
                                    }`}
                                >
                                    {item.isSpecial && <ShoppingBag className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />}
                                    {item.name}
                                    {item.isSpecial && <ArrowUpRight className="w-3 h-3 text-[#C9A227]" strokeWidth={1.5} />}
                                </Link>
                            ))}

                            {/* Dropdown Institucional */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center space-x-1.5 text-sm text-[#666666] hover:text-[#0C0C0C] dark:text-[#9E9E9E] dark:hover:text-white transition-colors focus:outline-none">
                                        <span>{t('nav_studio', 'Institucional')}</span>
                                        <ChevronDown className="w-3.5 h-3.5 opacity-60" strokeWidth={1.5} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white dark:bg-[#0B0B0B] border border-black/[0.08] dark:border-white/[0.06] text-[#0C0C0C] dark:text-white rounded-[18px] p-2 min-w-[200px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                                    {studioNavItems.map((item) => (
                                        <DropdownMenuItem key={item.name} asChild className="rounded-[12px] hover:text-[#C9A227] focus:text-[#C9A227] focus:bg-[#F2F2F0] dark:focus:bg-[#121212] cursor-pointer">
                                            <Link to={item.path} className="px-3 py-2 text-sm">{item.name}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex items-center gap-3 border-l border-black/[0.08] dark:border-white/[0.06] pl-5 ml-1">
                                {/* Seletor de Idioma PT / EN */}
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.06] bg-[#F0F0EE] dark:bg-[#0A0A0A] text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white hover:border-[#C9A227]/40 transition-all"
                                    title={language === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
                                >
                                    <Globe className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />
                                    <span>{language === 'pt' ? 'PT' : 'EN'}</span>
                                </button>

                                {/* Alternador de Tema Claro / Escuro (Sun / Moon) */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-8 h-8 rounded-full border border-black/[0.08] dark:border-white/[0.06] bg-[#F0F0EE] dark:bg-[#0A0A0A] text-[#0C0C0C] dark:text-white flex items-center justify-center hover:border-[#C9A227]/40 transition-all focus:outline-none"
                                    title={theme === 'dark' ? 'Ativar Tema Claro' : 'Ativar Tema Escuro'}
                                    aria-label="Alternar Tema Claro e Escuro"
                                >
                                    <motion.div
                                        key={theme}
                                        initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {theme === 'dark' ? (
                                            <Sun className="w-4 h-4 text-[#C9A227]" strokeWidth={1.5} />
                                        ) : (
                                            <Moon className="w-4 h-4 text-[#A88218]" strokeWidth={1.5} />
                                        )}
                                    </motion.div>
                                </button>

                                {/* Área do Cliente */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center space-x-1.5 text-xs font-mono text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.06] bg-[#F0F0EE] dark:bg-[#0A0A0A] transition-colors focus:outline-none">
                                            <User className="h-3.5 w-3.5 text-[#C9A227]" strokeWidth={1.5} />
                                            <span>{t('nav_client_area', 'Conta')}</span>
                                            <ChevronDown className="w-3 h-3 opacity-50" strokeWidth={1.5} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-white dark:bg-[#0B0B0B] border border-black/[0.08] dark:border-white/[0.06] text-[#0C0C0C] dark:text-white rounded-[18px] p-2 w-52 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)]" align="end">
                                        {clientNavItems.map((item) => (
                                            <DropdownMenuItem key={item.name} asChild className="rounded-[12px] hover:text-[#C9A227] focus:text-[#C9A227] focus:bg-[#F2F2F0] dark:focus:bg-[#121212] cursor-pointer">
                                                <Link to={item.path} className="flex items-center px-3 py-2 text-sm">
                                                    {item.icon}
                                                    {item.name}
                                                </Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Botão em Pílula Dourado */}
                                <Link to="/contato">
                                    <button className="bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:shadow-[0_0_28px_rgba(201,162,39,0.35)] transition-all duration-300">
                                        {t('nav_quote', 'Iniciar Projeto')}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Controles Mobile */}
                        <div className="lg:hidden flex items-center gap-2">
                            {/* Alternador de Tema Mobile */}
                            <button
                                onClick={toggleTheme}
                                className="w-8 h-8 rounded-full border border-black/[0.08] dark:border-white/[0.06] bg-[#F0F0EE] dark:bg-[#0A0A0A] text-[#0C0C0C] dark:text-white flex items-center justify-center transition-all focus:outline-none"
                                aria-label="Alternar Tema"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />
                                ) : (
                                    <Moon className="w-3.5 h-3.5 text-[#A88218]" strokeWidth={1.5} />
                                )}
                            </button>

                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-full border border-black/[0.08] dark:border-white/[0.06] text-[#666666] dark:text-[#9E9E9E]"
                            >
                                <Globe className="w-3 h-3 text-[#C9A227]" strokeWidth={1.5} />
                                <span>{language === 'pt' ? 'PT' : 'EN'}</span>
                            </button>

                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-[#0C0C0C] dark:text-white hover:text-[#C9A227] p-1.5 focus:outline-none transition-colors"
                                aria-label="Abrir Menu"
                            >
                                {isOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>

                    {/* Menu Gaveta Mobile */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="lg:hidden mt-3 rounded-[20px] p-5 overflow-hidden border border-black/[0.08] dark:border-white/[0.06] shadow-2xl bg-white/98 dark:bg-[#0B0B0B]/98 backdrop-blur-2xl text-[#0C0C0C] dark:text-white"
                            >
                                <div className="flex flex-col space-y-3">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`text-sm tracking-wide py-3 px-4 rounded-xl text-center transition-colors ${
                                                item.isSpecial
                                                    ? 'border border-[#C9A227]/40 bg-[#C9A227]/10 text-[#A88218] dark:text-[#ECBD57] font-semibold flex items-center justify-center gap-2'
                                                    : location.pathname === item.path
                                                        ? 'bg-black/[0.05] dark:bg-white/[0.06] text-[#C9A227] font-semibold'
                                                        : 'text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white'
                                            }`}
                                        >
                                            {item.isSpecial && <ShoppingBag className="w-4 h-4 text-[#C9A227]" strokeWidth={1.5} />}
                                            {item.name}
                                        </Link>
                                    ))}

                                    <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-2" />
                                    <p className="text-[11px] uppercase text-[#666666] dark:text-[#9E9E9E] font-mono font-medium text-center tracking-widest">{t('nav_studio', 'Institucional')}</p>

                                    {studioNavItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className="text-sm text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white text-center py-2 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-2" />
                                    <p className="text-[11px] uppercase text-[#666666] dark:text-[#9E9E9E] font-mono font-medium text-center tracking-widest">{t('nav_client_area', 'Área do Cliente')}</p>

                                    {clientNavItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className="text-sm text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white text-center py-2 flex justify-center items-center transition-colors"
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.name}</span>
                                        </Link>
                                    ))}

                                    <Link to="/contato" onClick={() => setIsOpen(false)} className="pt-2">
                                        <button className="bg-[#C9A227] hover:bg-[#ECBD57] text-[#070707] font-semibold w-full h-12 rounded-full text-xs uppercase tracking-wider shadow-[0_0_24px_rgba(201,162,39,0.25)] transition-all">
                                            {t('nav_quote', 'Iniciar Projeto')}
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
