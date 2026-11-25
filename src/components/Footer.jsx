import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandLogo from '@/components/common/BrandLogo';

/**
 * Componente Footer da marca RAMIELL
 * Visual minimalista editorial com suporte completo a Claro (#FFFFFF) e Escuro (#0A0A0A),
 * tipografia Geist, detalhes em dourado #C9A227, assinatura "Vai de Ramiell." e redes oficiais.
 */
const Footer = () => {
    const { config } = useSiteConfig();
    const { t } = useLanguage();
    const location = useLocation();
    const isPhotography = location.pathname.startsWith('/portfolio-fotografia');

    const contactEmail = config?.contact_email || 'contato@ramiell.com';
    const contactPhone = config?.contact_phone || '(21) 96614-9077';
    const contactAddress = config?.contact_address || 'Rio de Janeiro, RJ / Brasil';

    const quickLinks = [
        { name: t('nav_home', 'Home'), path: '/' },
        { name: t('nav_services', 'Serviços'), path: '/servicos' },
        { name: t('nav_portfolio', 'Portfólio'), path: '/portfolio' },
        { name: t('nav_store', 'Store'), path: '/store' },
        { name: t('nav_about', 'Sobre'), path: '/sobre' },
        { name: t('nav_contact', 'Contato'), path: '/contato' },
    ];

    const services = [
        'Desenvolvimento de Sites',
        'Sistemas Web Personalizados',
        'Aplicações & Experiências Digitais',
        'Dashboards Interativos & BI',
        'Automações e Integrações',
        'Design Editorial & UI/UX'
    ];

    return (
        <footer className="bg-white dark:bg-[#0A0A0A] border-t border-black/[0.08] dark:border-white/[0.06] text-[#666666] dark:text-[#9E9E9E] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Marca & Assinatura */}
                    <div className="flex flex-col space-y-5">
                        <BrandLogo
                            asLink={true}
                            size="md"
                            subtitle={isPhotography ? "Fotografia" : "Digital Experiences"}
                            showSubtitle={true}
                        />
                        <p className="text-[#666666] dark:text-[#9E9E9E] text-sm leading-relaxed max-w-sm">
                            Desenvolvimento de sites de alto padrão, sistemas personalizados e experiências digitais sob medida.
                        </p>
                        <p className="text-[#0C0C0C] dark:text-white font-medium text-sm tracking-wide">
                            Vai de Ramiell.
                        </p>

                        <div className="flex space-x-3 pt-2">
                            {/* Instagram Oficial @vaideramiell */}
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                href="https://instagram.com/vaideramiell"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-[#F0F0EE] dark:bg-[#121212] border border-black/[0.08] dark:border-white/[0.06] text-[#C9A227] flex items-center justify-center hover:border-[#C9A227]/40 hover:text-[#0C0C0C] dark:hover:text-white transition-all shadow-sm"
                                aria-label="Instagram @vaideramiell"
                            >
                                <Instagram className="w-4 h-4" strokeWidth={1.5} />
                            </motion.a>

                            {/* LinkedIn */}
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                href="https://linkedin.com/in/rafaelpita"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-[#F0F0EE] dark:bg-[#121212] border border-black/[0.08] dark:border-white/[0.06] text-[#C9A227] flex items-center justify-center hover:border-[#C9A227]/40 hover:text-[#0C0C0C] dark:hover:text-white transition-all shadow-sm"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                            </motion.a>
                        </div>
                    </div>

                    {/* Links Rápidos */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono font-semibold text-[#0C0C0C] dark:text-white tracking-widest uppercase">
                            {t('footer_quick_links', 'Navegação')}
                        </span>
                        <div className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block text-sm text-[#666666] hover:text-[#C9A227] dark:text-[#9E9E9E] dark:hover:text-[#ECBD57] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Serviços */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono font-semibold text-[#0C0C0C] dark:text-white tracking-widest uppercase">
                            {t('footer_services', 'Soluções')}
                        </span>
                        <div className="space-y-2.5">
                            {services.map((service) => (
                                <span
                                    key={service}
                                    className="block text-sm text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white transition-colors"
                                >
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contatos Preservados */}
                    <div className="space-y-4">
                        <span className="text-xs font-mono font-semibold text-[#0C0C0C] dark:text-white tracking-widest uppercase">
                            {t('footer_contact', 'Contato Direto')}
                        </span>
                        <div className="space-y-3.5">
                            <div className="flex items-center space-x-3 text-sm">
                                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                                <span className="text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white transition-colors">{contactEmail}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <Phone className="w-4 h-4 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                                <span className="text-[#666666] dark:text-[#9E9E9E] hover:text-[#0C0C0C] dark:hover:text-white transition-colors">{contactPhone}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" strokeWidth={1.5} />
                                <span className="text-[#666666] dark:text-[#9E9E9E]">{contactAddress}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Linha de Copyright */}
                <div className="border-t mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#888888] dark:text-[#9E9E9E] font-mono border-black/[0.08] dark:border-white/[0.06] gap-4">
                    <p>
                        © {new Date().getFullYear()} RAMIELL. {t('footer_rights', 'Todos os direitos reservados.')}
                    </p>
                    <p className="flex items-center gap-1.5 text-[#0C0C0C] dark:text-white">
                        <span>ramiell.com</span>
                        <span className="text-[#C9A227]">•</span>
                        <span>Vai de Ramiell.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
