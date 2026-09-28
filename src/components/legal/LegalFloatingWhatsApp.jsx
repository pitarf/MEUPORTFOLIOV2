import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles } from 'lucide-react';

/**
 * Botão Flutuante de WhatsApp em Glassmorphism & Gradiente Dourado
 */
export default function LegalFloatingWhatsApp({ lawyer }) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, Dr(a). ${lawyer.name}, vi o seu site e gostaria de esclarecer uma dúvida com o escritório.`
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
            className="mb-3 max-w-xs backdrop-blur-2xl bg-[#070D1A]/95 border border-amber-400/50 text-white p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(245,158,11,0.15)] relative pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
                Canal Oficial Aberto
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-light">
              Precisa de orientação jurídica preliminar? Converse diretamente com o Dr(a). {lawyer.name}.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de Contato com Efeito de Pulso Suave */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 text-black shadow-[0_10px_30px_rgba(245,158,11,0.35)] flex items-center justify-center group relative overflow-hidden"
        aria-label="Falar no WhatsApp"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageCircle className="w-7 h-7 text-black stroke-[2.2] transition-transform group-hover:scale-110" />
      </motion.a>
    </div>
  );
}
