import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Calendar, ChevronDown, Stethoscope, ClipboardCheck, Sparkles, MapPin, HelpCircle, User, Heart } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Cabecalho Responsivo Editorial em Azul Saúde para Landing Page de Nutricionistas
 * Estrutura arejada com submenu suspenso para Especialidades, Como Funciona e Diferenciais,
 * eliminando a sobrecarga de informações e adotando a paleta de alta conversão em tons de azul.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionHeader({ data }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    const { professional, contact, theme } = data;

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setServicesDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Controle com delay suave ao passar o mouse para nao fechar bruscamente
    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setServicesDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setServicesDropdownOpen(false);
        }, 180);
    };

    const closeAllMenus = () => {
        setMobileMenuOpen(false);
        setServicesDropdownOpen(false);
        setMobileServicesOpen(false);
    };

    // Sub-itens do menu Atendimento / Servicos
    const serviceSubmenu = [
        {
            label: 'Especialidades & Tratamentos',
            desc: 'Nutrição clínica, esportiva e reeducação',
            href: '#servicos',
            icon: Stethoscope
        },
        {
            label: 'Como Funciona a Consulta',
            desc: 'Passo a passo, bioimpedância e plano no app',
            href: '#como-funciona',
            icon: ClipboardCheck
        },
        {
            label: 'Nossos Diferenciais',
            desc: 'Acompanhamento contínuo sem dietas malucas',
            href: '#diferenciais',
            icon: Sparkles
        }
    ];

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logotipo / Nome da Profissional com Identidade Azul Saúde */}
                <a href="#inicio" className="flex items-center gap-3 group focus:outline-none flex-shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-[#0369A1] group-hover:text-[#0284C7] transition-colors leading-tight">
                                {professional.name}
                            </span>
                            {professional.crn && (
                                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 text-[10px] font-bold text-[#0284C7] tracking-wider uppercase">
                                    {professional.crn.replace(/\(.*?\)/g, '').trim()}
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] font-medium tracking-wide text-slate-500 block leading-tight mt-0.5">
                            {professional.title}
                        </span>
                    </div>
                </a>

                {/* Navegação Desktop Arejada com Submenu Dropdown */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <a
                        href="#inicio"
                        className="hover:text-[#0284C7] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0284C7] hover:after:w-full after:transition-all"
                    >
                        Início
                    </a>

                    <a
                        href="#sobre"
                        className="hover:text-[#0284C7] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0284C7] hover:after:w-full after:transition-all"
                    >
                        Sobre
                    </a>

                    {/* Submenu Dropdown "Atendimento & Serviços" */}
                    <div
                        ref={dropdownRef}
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                            className={`flex items-center gap-1.5 py-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all ${
                                servicesDropdownOpen
                                    ? 'text-[#0284C7] after:w-full after:bg-[#0284C7]'
                                    : 'text-slate-600 hover:text-[#0284C7] after:w-0 hover:after:w-full after:bg-[#0284C7]'
                            }`}
                            aria-expanded={servicesDropdownOpen}
                            aria-haspopup="true"
                        >
                            <span>Atendimento</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#0284C7]' : 'text-slate-400'}`} />
                        </button>

                        {/* Painel Flutuante do Submenu */}
                        {servicesDropdownOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80 z-50 animate-in fade-in zoom-in-95 duration-150">
                                <div className="bg-white rounded-2xl shadow-xl shadow-sky-950/10 border border-sky-100 p-2.5 space-y-1">
                                    {serviceSubmenu.map((item, idx) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <a
                                                key={idx}
                                                href={item.href}
                                                onClick={() => setServicesDropdownOpen(false)}
                                                className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-sky-50/80 transition-all group"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-sky-100/70 text-[#0284C7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 group-hover:text-[#0284C7] transition-colors leading-tight">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-normal leading-relaxed mt-0.5">
                                                        {item.desc}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <a
                        href="#faq"
                        className="hover:text-[#0284C7] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0284C7] hover:after:w-full after:transition-all"
                    >
                        Dúvidas
                    </a>

                    <a
                        href="#localizacao"
                        className="hover:text-[#0284C7] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0284C7] hover:after:w-full after:transition-all"
                    >
                        Consultório
                    </a>
                </nav>

                {/* CTA Desktop em Azul Saúde */}
                <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                        <Calendar className="w-4 h-4 text-white" />
                        <span>Agendar consulta</span>
                    </a>
                </div>

                {/* Botão Menu Mobile */}
                <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0284C7] text-white shadow-sm"
                        aria-label="Agendar consulta no WhatsApp"
                    >
                        <Calendar className="w-4 h-4 text-white" />
                    </a>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl focus:outline-none transition-colors"
                        aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Menu Mobile Retrátil com Submenu em Accordion */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-sky-100 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
                    <div className="flex flex-col space-y-1">
                        <a
                            href="#inicio"
                            onClick={closeAllMenus}
                            className="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-colors"
                        >
                            Início
                        </a>

                        <a
                            href="#sobre"
                            onClick={closeAllMenus}
                            className="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-colors"
                        >
                            Sobre a Nutricionista
                        </a>

                        {/* Accordion Mobile para Atendimento */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-colors"
                            >
                                <span>Atendimento & Especialidades</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#0284C7]' : 'text-slate-400'}`} />
                            </button>

                            {mobileServicesOpen && (
                                <div className="pl-4 pr-2 py-1 space-y-1 bg-sky-50/50 rounded-xl mt-1 border border-sky-100/60">
                                    {serviceSubmenu.map((sub, sIdx) => (
                                        <a
                                            key={sIdx}
                                            href={sub.href}
                                            onClick={closeAllMenus}
                                            className="block px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#0284C7] hover:bg-white rounded-lg transition-colors"
                                        >
                                            {sub.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a
                            href="#faq"
                            onClick={closeAllMenus}
                            className="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-colors"
                        >
                            Dúvidas Frequentes
                        </a>

                        <a
                            href="#localizacao"
                            onClick={closeAllMenus}
                            className="px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-colors"
                        >
                            Consultório & Localização
                        </a>
                    </div>

                    <div className="pt-3 border-t border-sky-100 flex flex-col gap-2">
                        <a
                            href={contact.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeAllMenus}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white text-sm font-bold shadow-md shadow-sky-500/20"
                        >
                            <Calendar className="w-4 h-4 text-white" />
                            <span>Agendar consulta agora</span>
                        </a>

                        <a
                            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.initialWhatsappMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeAllMenus}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-sky-200 text-slate-700 text-xs font-semibold hover:bg-sky-50 transition-colors"
                        >
                            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                            <span>Tirar dúvidas no WhatsApp ({contact.phone})</span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
