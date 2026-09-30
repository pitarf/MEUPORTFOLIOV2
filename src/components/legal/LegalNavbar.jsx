import React from 'react';
import { motion } from 'framer-motion';
import { Scale, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';

/**
 * Navbar Branca Corporativa de Alta Autoridade no Estilo Summit Financial (Imagem de Referência)
 */
export default function LegalNavbar({ lawyer, nicheInfo }) {
  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, Dr(a). ${lawyer.name}, vi o site do escritório e gostaria de agendar uma consulta jurídica.`
  )}`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Corporativa Moderna com Balança Dourada Estilizada */}
          <a href="#inicio" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8A756] to-[#C6923C] flex items-center justify-center shadow-md shadow-amber-500/10">
              <Scale className="w-5 h-5 text-white" />
            </div>

            <div>
              <span className="font-sans text-base sm:text-lg font-bold tracking-tight text-[#0A192F] block leading-tight">
                {lawyer.name}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#C6923C] uppercase font-semibold block">
                {lawyer.oab || 'Advocacia & Consultoria'}
              </span>
            </div>
          </a>

          {/* Links Centrais de Navegação Amigável e sem Quebras */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-[13px] xl:text-sm font-medium text-slate-600">
            <a href="#inicio" className="text-[#C6923C] font-semibold transition-colors whitespace-nowrap py-1">
              Início
            </a>
            <a href="#sobre" className="hover:text-[#C6923C] transition-colors whitespace-nowrap py-1">
              Sobre Nós
            </a>
            <a href="#atuacao" className="hover:text-[#C6923C] transition-colors whitespace-nowrap py-1">
              Especialidades
            </a>
            <a href="#metodologia" className="hover:text-[#C6923C] transition-colors whitespace-nowrap py-1">
              Como Funciona
            </a>
            <a href="#diagnostico" className="hover:text-[#C6923C] transition-colors flex items-center gap-1.5 whitespace-nowrap py-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C6923C]" />
              <span>Diagnóstico (60s)</span>
            </a>
            <a href="#depoimentos" className="hover:text-[#C6923C] transition-colors whitespace-nowrap py-1">
              Depoimentos
            </a>
            <a href="#contato" className="hover:text-[#C6923C] transition-colors whitespace-nowrap py-1">
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
            className="flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs xl:text-sm shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center gap-2 whitespace-nowrap group"
          >
            <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>Agendar no WhatsApp</span>
          </motion.a>

        </div>
      </div>
    </header>
  );
}
