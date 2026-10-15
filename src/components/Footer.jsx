import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useLanguage } from '@/contexts/LanguageContext';
import BrandLogo from '@/components/common/BrandLogo';

const Footer = () => {
    const { config } = useSiteConfig();
    const { t } = useLanguage();
    const location = useLocation();
    const isPhotography = location.pathname.startsWith('/portfolio-fotografia');

    const siteName = config?.site_name || 'rp .';
    const description = config?.footer_description || t('footer_description', 'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital.');
    const contactEmail = config?.contact_email || 'contato@rafaelpitaoficial.com.br';
    const contactPhone = config?.contact_phone || '(21) 96614-9077';
    const contactAddress = config?.contact_address || 'Rio de Janeiro, RJ / Brasil';
    const social = config?.social_links || {};
    const quickLinks = [{
        name: t('nav_home', 'Home'),
        path: '/'
    }, {
        name: t('nav_services', 'Serviços'),
        path: '/servicos'
    }, {
        name: t('nav_portfolio', 'Portfólio'),
        path: '/portfolio'
    }, {
        name: t('nav_contact', 'Contato'),
        path: '/contato'
    }];
    const services = ['Desenvolvimento Web', 'Dashboards Power BI', 'Automações & Sistemas', 'Landing Pages', 'Fotografia Profissional', 'Tráfego Pago', 'Design Gráfico', 'Consultoria Tech'];

    // Dynamic Styles for Footer
    const footerBg = 'bg-[#0a0a08] border-[#23231f] text-gray-300';
    const textHover = 'hover:text-[#bcf13b]';
    const iconColor = 'text-[#bcf13b]';
    const socialBtnClass = (colorClass) => `w-10 h-10 ${colorClass} rounded-full flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all shadow-md`;

    return <footer className={`${footerBg} border-t transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <BrandLogo
                            asLink={true}
                            size="md"
                            subtitle={isPhotography ? "FOTOGRAFIA" : "DADOS & TECNOLOGIA"}
                            showSubtitle={true}
                        />
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {description}
                    </p>
                    <div className="flex space-x-3 pt-2">
                        {social.facebook && <motion.a whileHover={{
                            scale: 1.1
                        }} href={social.facebook} target="_blank" rel="noopener noreferrer" className={socialBtnClass('bg-blue-600')}>
                            <Facebook className="w-5 h-5" />
                        </motion.a>}
                        {social.instagram && <motion.a whileHover={{
                            scale: 1.1
                        }} href={social.instagram} target="_blank" rel="noopener noreferrer" className={socialBtnClass('bg-pink-600')}>
                            <Instagram className="w-5 h-5" />
                        </motion.a>}
                        {social.linkedin && <motion.a whileHover={{
                            scale: 1.1
                        }} href={social.linkedin} target="_blank" rel="noopener noreferrer" className={socialBtnClass('bg-blue-700')}>
                            <Linkedin className="w-5 h-5" />
                        </motion.a>}
                        {social.twitter && <motion.a whileHover={{
                            scale: 1.1
                        }} href={social.twitter} target="_blank" rel="noopener noreferrer" className={socialBtnClass('bg-blue-400')}>
                            <Twitter className="w-5 h-5" />
                        </motion.a>}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                    <span className="text-base font-bold text-white tracking-wide uppercase">{t('footer_quick_links', 'Links Rápidos')}</span>
                    <div className="space-y-2">
                        {quickLinks.map(link => <Link key={link.name} to={link.path} className={`block text-gray-400 transition-colors text-sm font-medium ${textHover}`}>
                            {link.name}
                        </Link>)}
                    </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                    <span className="text-base font-bold text-white tracking-wide uppercase">{t('footer_services', 'Serviços')}</span>
                    <div className="space-y-2">
                        {services.map(service => <span key={service} className="block text-gray-400 text-sm font-medium hover:text-[#bcf13b] transition-colors cursor-pointer">
                            {service}
                        </span>)}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <span className="text-base font-bold text-white tracking-wide uppercase">{t('footer_contact', 'Contato & Suporte')}</span>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Mail className={`w-5 h-5 ${iconColor}`} />
                            <span className="text-gray-400 text-sm font-medium">{contactEmail}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className={`w-5 h-5 ${iconColor}`} />
                            <span className="text-gray-400 text-sm font-medium">{contactPhone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className={`w-5 h-5 ${iconColor}`} />
                            <span className="text-gray-400 text-sm font-medium">{contactAddress}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t mt-12 pt-8 text-center border-[#23231f]">
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                    © {new Date().getFullYear()} rp . {t('footer_rights', 'Todos os direitos reservados.')}
                </p>
            </div>
        </div>
    </footer>;
};
export default Footer;