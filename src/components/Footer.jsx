import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const Footer = () => {
    const { config } = useSiteConfig();
    const location = useLocation();
    const isPhotography = location.pathname.startsWith('/portfolio-fotografia');

    const siteName = config?.site_name || 'Rafael Pita Solutions';
    const description = config?.footer_description || 'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital.';
    const contactEmail = config?.contact_email || 'contato@rafaelpitaoficial.com.br';
    const contactPhone = config?.contact_phone || '(21) 96614-9077';
    const contactAddress = config?.contact_address || 'Rio de Janeiro, RJ - Brasil';
    const social = config?.social_links || {};
    const quickLinks = [{
        name: 'Home',
        path: '/'
    }, {
        name: 'Serviços',
        path: '/servicos'
    }, {
        name: 'Portfólio',
        path: '/portfolio'
    }, {
        name: 'Contato',
        path: '/contato'
    }];
    const services = ['Design Gráfico', 'Fotografia', 'Desenvolvimento Web', 'Dashboards Power BI', 'Vídeos com IA', 'Tráfego Pago', 'Manutenção de PCs', 'Instalação CFTV'];

    // Dynamic Styles for Footer
    const footerBg = 'bg-slate-50 dark:bg-gray-900/90 border-slate-200 dark:border-white/10';
    const textHover = 'hover:text-blue-600 dark:hover:text-blue-400';
    const iconColor = 'text-blue-600 dark:text-blue-400';
    const socialBtnClass = (colorClass) => `w-10 h-10 ${colorClass} rounded-full flex items-center justify-center hover:opacity-90 transition-colors shadow-sm`;

    return <footer className={`${footerBg} border-t transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        {config?.logo_url ? (
                            <img src={config.logo_url} alt={siteName} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <span className="text-xl font-bold gradient-text">{siteName}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {description}
                    </p>
                    <div className="flex space-x-4">
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
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Links Rápidos</span>
                    <div className="space-y-2">
                        {quickLinks.map(link => <Link key={link.name} to={link.path} className={`block text-gray-600 dark:text-gray-400 transition-colors text-sm font-medium ${textHover}`}>
                            {link.name}
                        </Link>)}
                    </div>
                </div>

                {/* Services */}
                <div className="space-y-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Serviços</span>
                    <div className="space-y-2">
                        {services.map(service => <span key={service} className="block text-gray-600 dark:text-gray-400 text-sm font-medium">
                            {service}
                        </span>)}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Contato</span>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Mail className={`w-5 h-5 ${iconColor}`} />
                            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{contactEmail}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className={`w-5 h-5 ${iconColor}`} />
                            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{contactPhone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className={`w-5 h-5 ${iconColor}`} />
                            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{contactAddress}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center border-slate-200 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    © {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </footer>;
};
export default Footer;