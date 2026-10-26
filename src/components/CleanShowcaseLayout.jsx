import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, ShieldCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/common/BrandLogo';

/**
 * Layout Limpo para Apresentação em Propostas (99freelas / Freelance)
 * 
 * Remove intencionalmente:
 * 1. O Rodapé geral (Footer) que continha contatos, e-mails e links externos.
 * 2. O Botão flutuante do WhatsApp (WhatsAppFloat).
 * 3. Menus e links que levem para canais externos de comunicação direta.
 * 
 * Mantém foco 100% no mostruário técnico e conformidade com os termos de moderação.
 */
const CleanShowcaseLayout = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
            {/* Header / Navbar Blindada contra Contatos Externos */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-[#0a0a08]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#23231f] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logotipo da Marca com link interno para a própria vitrine v2 */}
                    <div className="flex items-center gap-3">
                        <Link to="/portfolio-v2" className="flex items-center">
                            <BrandLogo
                                asLink={false}
                                size="md"
                                subtitle="Vitrine de Projetos"
                                showSubtitle={true}
                            />
                        </Link>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-lime-500/10 text-lime-700 dark:text-[#bcf13b] border border-lime-500/20">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Versão Portfólio Comercial
                        </span>
                    </div>

                    {/* Controles do Topo: Informação Neutra & Alternador de Tema */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 font-semibold">
                            <Briefcase className="w-3.5 h-3.5 text-primary" />
                            <span>Propostas & Demonstrações Técnicas</span>
                        </div>

                        {/* Alternador de Tema Claro e Escuro */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:text-lime-700 dark:hover:text-[#bcf13b]"
                            title="Alternar modo visual"
                            aria-label="Alternar modo visual"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-[#bcf13b]" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-700" />
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal (Sem rodapé e sem WhatsApp flutuante) */}
            <main className="flex-1 pt-16">
                <Outlet />
            </main>

            {/* Rodapé Minimalista Estrito : Apenas Copyright Sem Links Externos */}
            <footer className="border-t border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] py-6 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500 dark:text-gray-400 font-medium">
                    <p>
                        Vitrine de Casos Técnicos &copy; {new Date().getFullYear()} Rafael Pita Solutions.
                    </p>
                    <p className="flex items-center gap-1.5 justify-center text-[11px] text-slate-500 dark:text-gray-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-[#bcf13b]" />
                        <span>Comunicação e contratação realizadas exclusivamente via plataforma oficial.</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CleanShowcaseLayout;
