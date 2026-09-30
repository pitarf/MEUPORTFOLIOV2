import React from 'react';
import { motion } from 'framer-motion';
import { Scale, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';

/**
 * Navbar Branca Corporativa de Alta Autoridade no Estilo Summit Financial (Imagem de Referência)
 */
export default function LegalNavbar({ lawyer, nicheInfo, theme }) {
  const honorific = theme?.honorific || 'Dr(a).';
  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, ${honorific} ${lawyer.name}, vi o site do escritório e gostaria de agendar uma consulta jurídica.`
  )}`;

  const isFemale = theme?.gender === 'female';

  return (
    <header className={`${isFemale ? 'bg-white/95 backdrop-blur-md border-b border-[#EEDCE7] shadow-[0_4px_20px_rgba(44,8,34,0.03)]' : 'bg-white border-b border-slate-200 shadow-sm'} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Corporativa Moderna com Balança Dourada Estilizada (Clique leva ao Início) */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group flex-shrink-0 cursor-pointer pr-4 hover:opacity-90 transition-opacity"
            title="Ir para o início"
          >
            <div className={`w-10 h-10 ${isFemale ? 'rounded-2xl shadow-pink-950/10' : 'rounded-xl shadow-amber-500/10'} bg-gradient-to-br ${theme?.logoGradient || 'from-[#D8A756] to-[#C6923C]'} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
              <Scale className={`w-5 h-5 ${isFemale ? 'text-[#1A0314]' : 'text-white'}`} />
            </div>

            <div>
              <span className={`${isFemale ? 'font-serif text-lg font-medium text-[#2C0822] tracking-normal' : 'font-sans text-base sm:text-lg font-bold tracking-tight text-[#0A192F]'} block leading-tight`}>
                {lawyer.name}
              </span>
              <span className={`text-[10px] font-mono tracking-wider ${isFemale ? 'text-[#C89445]' : 'text-[#C6923C]'} uppercase font-semibold block mt-0.5`}>
                {lawyer.oab || theme?.roleTag || 'Advocacia & Consultoria'}
              </span>
            </div>
          </a>

          {/* Links Centrais de Navegação Arejados e Elegantes */}
          <nav className={`hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium ${isFemale ? 'text-stone-600' : 'text-slate-600'}`}>
            <a href="#sobre" className={`hover:text-[#C89445] transition-colors whitespace-nowrap py-1`}>
              Sobre Nós
            </a>
            <a href="#atuacao" className={`hover:text-[#C89445] transition-colors whitespace-nowrap py-1`}>
              Especialidades
            </a>
            <a href="#metodologia" className={`hover:text-[#C89445] transition-colors whitespace-nowrap py-1`}>
              Como Funciona
            </a>
            <a href="#diagnostico" className={`hover:text-[#C89445] transition-colors flex items-center gap-1.5 whitespace-nowrap py-1`}>
              <Sparkles className={`w-3.5 h-3.5 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'}`} />
              <span>Diagnóstico</span>
            </a>
            <a href="#depoimentos" className={`hover:text-[#C89445] transition-colors whitespace-nowrap py-1`}>
              Depoimentos
            </a>
            <a href="#contato" className={`hover:text-[#C89445] transition-colors whitespace-nowrap py-1`}>
              Contato
            </a>
          </nav>

          {/* Botão de Agendamento Moderno e Elegante no WhatsApp */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-shrink-0 px-5 sm:px-6 py-2.5 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-md shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35' : 'rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-md shadow-emerald-500/20'} text-xs xl:text-sm transition-all flex items-center gap-2 whitespace-nowrap group`}
          >
            <MessageCircle className={`w-4 h-4 ${isFemale ? 'fill-[#1A0314] text-[#1A0314]' : 'fill-white text-white'} group-hover:scale-110 transition-transform`} />
            <span>Agendar no WhatsApp</span>
          </motion.a>

        </div>
      </div>
    </header>
  );
}
