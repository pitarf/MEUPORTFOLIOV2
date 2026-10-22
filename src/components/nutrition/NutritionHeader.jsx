import React, { useState } from 'react';
import { Menu, X, Calendar, Phone } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Cabecalho Responsivo Editorial para Landing Page de Nutricionistas
 * Apresenta navegacao discreta, identificacao profissional com CRN e CTA de agendamento.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionHeader({ data }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { professional, contact, theme } = data;

    const navLinks = [
        { label: 'Apresentação', href: '#sobre' },
        { label: 'Especialidades', href: '#servicos' },
        { label: 'Como Funciona', href: '#como-funciona' },
        { label: 'Diferenciais', href: '#diferenciais' },
        { label: 'Dúvidas', href: '#faq' },
        { label: 'Atendimento', href: '#localizacao' }
    ];

    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                {/* Logotipo / Nome do Profissional */}
                <a href="#inicio" className="flex flex-col group focus:outline-none">
                    <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-[#244B3B] group-hover:text-[#557A61] transition-colors">
                        {professional.name}
                    </span>
                    <span className="text-[11px] font-medium tracking-wide text-stone-500 uppercase">
                        {professional.title} {professional.crn ? `• ${professional.crn}` : ''}
                    </span>
                </a>

                {/* Navegação Desktop */}
                <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
                    {navLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.href}
                            className="hover:text-[#244B3B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#244B3B] hover:after:w-full after:transition-all"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* CTA Desktop */}
                <div className="hidden sm:flex items-center gap-3">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#244B3B] hover:bg-[#1a382b] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow-md"
                    >
                        <Calendar className="w-4 h-4 text-white" />
                        <span>Agendar consulta</span>
                    </a>
                </div>

                {/* Botão Menu Mobile */}
                <div className="flex items-center gap-2 lg:hidden">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#244B3B] text-white"
                        aria-label="Agendar consulta no WhatsApp"
                    >
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                    </a>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-stone-700 hover:text-[#244B3B] rounded-lg focus:outline-none"
                        aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Menu Mobile Retrátil */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.href}
                                onClick={closeMenu}
                                className="px-3 py-2 text-sm font-semibold text-stone-700 hover:text-[#244B3B] hover:bg-stone-50 rounded-lg transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                        <a
                            href={contact.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#244B3B] text-white text-sm font-bold shadow-md"
                        >
                            <Calendar className="w-4 h-4 text-white" />
                            <span>Agendar consulta</span>
                        </a>

                        <a
                            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.initialWhatsappMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            <span>Falar no WhatsApp ({contact.phone})</span>
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
