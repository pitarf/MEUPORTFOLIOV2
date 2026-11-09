import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, Calendar, Phone, Sparkles } from 'lucide-react';

/**
 * Header e Navbar de Navegação da Clínica Odontológica
 * Fixa no topo com blur clínico, responsiva e com selo de verificação CRO.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalHeader({ data }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { clinicName, professional, contact, location } = data;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '#inicio' },
    { name: 'Tratamentos', href: '#tratamentos' },
    { name: 'Tecnologia 3D', href: '#tecnologia' },
    { name: 'Sorrisos', href: '#sorrisos' },
    { name: 'A Clínica', href: '#clinica' },
    { name: 'Dúvidas', href: '#faq' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-sky-100/80 py-3'
          : 'bg-white/80 backdrop-blur-xs border-b border-sky-100/40 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo e Nome da Clínica / Doutor */}
          <a
            href="#inicio"
            className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-sky-500 rounded-lg p-1"
            aria-label="Ir para a página inicial"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                {clinicName || professional.name}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-sky-700/80 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {professional.cro || 'CRO Verificado'}
              </span>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navegação principal">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors py-2 relative group focus:outline-hidden focus:text-sky-600"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Contato Rápido & CTA Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${contact.whatsapp || contact.phone}`}
              className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-sky-700 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors"
              aria-label={`Ligar para ${contact.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
              <span>{contact.phone}</span>
            </a>

            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:shadow-lg hover:shadow-sky-600/30 active:scale-95 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 min-h-[44px]"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Agendar Avaliação</span>
            </a>
          </div>

          {/* Botão Hambúrguer Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-xl bg-sky-600 text-white shadow-xs min-h-[44px] min-w-[44px]"
              aria-label="Agendar via WhatsApp"
            >
              <Calendar className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors focus:outline-hidden focus:ring-2 focus:ring-sky-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-sky-100 bg-white/95 rounded-2xl shadow-xl px-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors min-h-[44px] flex items-center"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-sky-100 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{professional.cro || 'CRO Verificado'}</span>
              </div>
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all min-h-[44px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Avaliação WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
