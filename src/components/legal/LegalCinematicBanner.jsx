import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

/**
 * Banner de Chamada para Ação no Pré-Rodapé (Estilo Exato da Summit Financial)
 * Fundo Dark Navy panorâmico com skyline noturno, título serif e botão dourado alinhado à direita.
 */
export default function LegalCinematicBanner({ lawyer, theme }) {
  const honorific = theme?.honorific || 'Dr(a).';
  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, ${honorific} ${lawyer.name}, vi o site do escritório e gostaria de agendar uma consulta inicial sobre o meu caso.`
  )}`;

  return (
    <section className={`relative text-white py-16 sm:py-20 overflow-hidden ${theme?.bannerBgClass || 'bg-gradient-to-r from-[#071326] via-[#0A192F] to-[#071326]'} border-y border-white/10 transition-colors`}>
      {/* Luz ambiente suave */}
      <div className={`absolute -top-24 right-1/4 w-96 h-96 ${theme?.gender === 'female' ? 'bg-[#9A1E58]/10' : 'bg-amber-500/5'} rounded-full blur-[100px] pointer-events-none`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Lado Esquerdo: Texto de Chamada */}
          <div className="space-y-1.5 max-w-2xl">
            <h2 className={`text-2xl sm:text-3xl lg:text-[2.2rem] ${theme?.gender === 'female' ? 'font-serif font-normal tracking-normal' : 'font-sans font-extrabold tracking-tight'} text-white`}>
              Pronto para Assumir o Controle do Seu Caso Jurídico?
            </h2>
            <p className={`text-sm ${theme?.gender === 'female' ? 'text-stone-300 font-light' : 'text-slate-200 font-normal'}`}>
              Agende hoje mesmo uma consulta sem compromisso e receba orientação estratégica e humanizada.
            </p>
          </div>

          {/* Lado Direito: Botão Dourado de Ação Direta */}
          <div className="flex-shrink-0">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2.5 px-8 py-4 ${theme?.gender === 'female' ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-lg shadow-[#D8A756]/25 hover:shadow-[#D8A756]/40' : 'rounded-xl bg-[#C6923C] hover:bg-[#B5812B] text-white font-semibold shadow-lg shadow-amber-950/40'} text-xs sm:text-sm tracking-wide transition-all whitespace-nowrap`}
            >
              <MessageCircle className={`w-4 h-4 ${theme?.gender === 'female' ? 'fill-[#1A0314] text-[#1A0314]' : 'text-white'}`} />
              <span>Agendar uma Consulta</span>
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}
