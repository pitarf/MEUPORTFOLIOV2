import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, ChevronDown, User, Ticket, FileText, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
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

    // Determine Logic
    const shouldUsePhotoBranding = isPhotography && photoBranding;
    const siteName = shouldUsePhotoBranding && photoBranding.nav_site_name ? photoBranding.nav_site_name : (config?.site_name || '');
    const logoUrl = shouldUsePhotoBranding && photoBranding.nav_logo_url ? photoBranding.nav_logo_url : config?.logo_url;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
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

    const mainNavItems = [
        { name: 'Home', path: '/' },
        { name: 'Portfólio', path: '/portfolio' },
        { name: 'Serviços', path: '/servicos' },
        { name: 'Fotografia', path: '/portfolio-fotografia' },
        { name: 'Contato', path: '/contato' },
    ];

    const studioNavItems = [
        { name: 'Sobre', path: '/sobre' },
        { name: 'Avaliações', path: '/avaliacoes' },
    ];

    const clientNavItems = [
        { name: 'Login / Projetos', path: '/area-clientes', icon: <User className="w-4 h-4 mr-2" /> },
        { name: 'Rastrear Chamado', path: '/track-ticket', icon: <Ticket className="w-4 h-4 mr-2" /> },
        // { name: 'Assinaturas', path: '/assinaturas', icon: <FileText className="w-4 h-4 mr-2" /> },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? (isPhotography ? 'bg-black/90 border-b border-white/10' : 'bg-white/80 dark:bg-black/20 backdrop-blur-lg border-b border-gray-200/50 dark:border-white/10')
                : 'bg-transparent border-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        )}
                        {!isPhotography && <span className="text-xl font-bold gradient-text">{siteName}</span>}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-sm font-medium transition-colors hover:text-blue-500 ${location.pathname === item.path ? 'text-blue-500 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 p-0 h-auto hover:bg-transparent">
                                    <span>O Estúdio</span>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-effect">
                                {studioNavItems.map((item) => (
                                    <DropdownMenuItem key={item.name} asChild>
                                        <Link to={item.path} className="cursor-pointer">{item.name}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-4 ml-2">
                            {/* Toggle de Tema Claro/Escuro */}
                            {!isPhotography && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/10"
                                    title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
                                >
                                    <motion.div
                                        key={theme}
                                        initial={{ rotate: -30, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                                    </motion.div>
                                </Button>
                            )}

                            {/* Client Area Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white">
                                        <User className="h-5 w-5" />
                                        <span className="hidden xl:inline">Área do Cliente</span>
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="glass-effect w-48" align="end">
                                    {clientNavItems.map((item) => (
                                        <DropdownMenuItem key={item.name} asChild>
                                            <Link to={item.path} className="cursor-pointer flex items-center">
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Link to="/contato">
                                <Button className={`${isPhotography ? 'bg-white text-black hover:bg-gray-200' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'} shadow-lg transition-all`}>
                                    Orçamento
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-2">
                        {/* Toggle de Tema Claro/Escuro Mobile */}
                        {!isPhotography && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-white/10"
                            >
                                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 dark:text-gray-300"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden glass-effect mt-2 rounded-lg p-4 overflow-hidden border border-gray-700/50"
                        >
                            <div className="flex flex-col space-y-4">
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-base font-medium transition-colors hover:text-blue-400 block text-center py-2 ${location.pathname === item.path ? 'text-blue-400' : 'text-gray-300'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                <div className="h-px bg-gray-700 my-2" />
                                <p className="text-xs uppercase text-gray-500 font-bold text-center">O Estúdio</p>

                                {studioNavItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium text-gray-400 hover:text-white block text-center py-2"
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                <div className="h-px bg-gray-700 my-2" />
                                <p className="text-xs uppercase text-gray-500 font-bold text-center">Área do Cliente</p>

                                {clientNavItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium text-gray-400 hover:text-white block text-center py-2 flex justify-center items-center"
                                    >
                                        {item.icon}
                                        <span className="ml-2">{item.name}</span>
                                    </Link>
                                ))}

                                <Link to="/contato" onClick={() => setIsOpen(false)}>
                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full mt-4 h-12 text-lg">
                                        Solicitar Orçamento
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >
        </nav >
    );
};

export default Navbar;