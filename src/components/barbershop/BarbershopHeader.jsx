import React, { useState, useEffect } from 'react';
import { Scissors, Menu, X, Phone, Clock, ChevronRight } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Navbar Ultra-Premium da Barbearia
 * Contém logo vintage com ícone de tesoura, indicador de status ao vivo ("Aberto Hoje"),
 * navegação de âncoras suaves e CTA de agendamento via WhatsApp.
 * 
 * @param {object} props.data - Dados completos da barbearia
 */
export default function BarbershopHeader({ data }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitora a rolagem para aplicar efeito de desfoque sutil no topo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = formatBarbershopWhatsappUrl(data.contact?.whatsapp, data.name);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços & Combos', href: '#servicos' },
    { label: 'Mestres Barbeiros', href: '#equipe' },
    { label: 'O Espaço', href: '#espaco' },
    { label: 'Avaliações', href: '#depoimentos' },
    { label: 'Localização', href: '#localizacao' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-zinc-950/95 via-zinc-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo e Nome da Marca */}
          <a
            href="#inicio"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label={`${data.name} - Página Inicial`}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-950/30 group-hover:scale-105 transition-transform duration-200">
              <Scissors className="w-5 h-5 text-zinc-950 transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif uppercase">
                {data.name}
              </span>
              <span className="text-[10px] tracking-widest text-amber-400/90 uppercase font-medium">
                {data.tagline || 'Barbearia Clássica'}
              </span>
            </div>
          </a>

          {/* Links para Desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-wider font-medium text-zinc-300 hover:text-amber-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Status ao Vivo + Botão de Ação (Desktop) */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
              <span>{data.hours?.badge || 'Aberto Hoje'}</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/20 hover:shadow-amber-600/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5 text-zinc-950" />
              <span>Agendar Horário</span>
            </a>
          </div>

          {/* Botão Hambúrguer Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden px-3 py-1.5 rounded-md bg-amber-500 text-zinc-950 text-xs font-bold uppercase tracking-wider"
            >
              Agendar
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 focus:outline-none"
              aria-label="Alternar menu de navegação"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile Gaveta Suave */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 border-b border-zinc-800/90 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{data.hours?.badge || 'Aberto Hoje'}</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:text-amber-400 hover:bg-zinc-900 transition-colors"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </a>
          ))}

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-500 text-zinc-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-900/30"
            >
              <Phone className="w-4 h-4" />
              <span>Agendar no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
