import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Calendar, Heart, Phone, Sparkles } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Navbar Serena e Acolhedora para Consultório de Psicologia
 * Apresenta navegação fluida, selo ético do CRP e CTA de agendamento seguro.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyHeader({ data }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Efeito de sombra sutil na rolagem
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Especialidades', href: '#especialidades' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Sobre Mim', href: '#sobre' },
    { label: 'Consultório', href: '#espaco' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(5,150,105,0.06)] border-b border-[#E7E2D9]'
          : 'bg-[#FAF8F5]/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo e Identificação Profissional */}
          <a href="#inicio" className="flex items-center gap-3 group text-left">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 text-emerald-100 fill-emerald-100/30" />
            </div>
            <div>
              <span className="block font-serif text-lg sm:text-xl font-medium tracking-tight text-slate-800 group-hover:text-emerald-700 transition-colors">
                {data.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/80">
                  {data.crp}
                </span>
                <span className="hidden sm:inline-block text-slate-400">•</span>
                <span className="hidden sm:inline-block">Psicoterapia Clínica</span>
              </div>
            </div>
          </a>

          {/* Links de Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Botão de Agendamento Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium shadow-[0_4px_14px_rgba(5,150,105,0.25)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Sessão</span>
            </a>
          </div>

          {/* Botão Hambúrguer Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700 text-white shadow-sm"
              aria-label="Agendar via WhatsApp"
            >
              <Calendar className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Retrátil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E7E2D9] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-emerald-800 block">Atendimento Ético e Seguro</span>
                Inscrição ativa no CFP: {data.crp}
              </div>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-slate-200">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white font-medium text-base shadow-md active:bg-emerald-800 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Primeira Sessão</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
