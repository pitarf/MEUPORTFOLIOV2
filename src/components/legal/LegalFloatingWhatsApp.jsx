import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';

/**
 * Botão Flutuante de WhatsApp em Glassmorphism & Gradiente Dourado
 */
export default function LegalFloatingWhatsApp({ lawyer, theme }) {
  const [isHovered, setIsHovered] = useState(false);
  const honorific = theme?.honorific || 'Dr(a).';

  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, ${honorific} ${lawyer.name}, vi o seu site e gostaria de esclarecer uma dúvida com o escritório.`
  )}`;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Editorial em Frosted Glass (visível ao passar o mouse) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 max-w-xs backdrop-blur-2xl ${theme?.gender === 'female' ? 'bg-[#1C0515]/95 border-amber-400/50' : 'bg-[#070D1A]/95 border-amber-400/50'} text-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.15)] relative pointer-events-none`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
                Canal Oficial Aberto
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Precisa de orientação jurídica preliminar? Converse diretamente com {theme?.article === 'a' ? 'a Dra.' : 'o Dr.'} {lawyer.name}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de Contato com Efeito de Pulso Suave e Pílula Mobile */}
      <div className="flex items-center gap-3">
        {/* Pílula de Chamada para Ação no Mobile e Desktop */}
        <motion.a
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg shadow-black/5 text-[#0A192F] hover:text-[#C6923C] text-xs font-bold transition-all hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Falar no WhatsApp</span>
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] flex items-center justify-center group relative overflow-visible"
          aria-label="Falar no WhatsApp"
        >
          {/* Badge de Atendimento Ativo */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 border-2 border-white" />
          </span>

          <MessageCircle className="w-7 h-7 fill-white text-white stroke-[2.2] transition-transform group-hover:scale-110" />
        </motion.a>
      </div>
    </div>
  );
}
