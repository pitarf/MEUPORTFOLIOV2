import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppIcon from '../common/WhatsAppIcon';

/**
 * Componente: NutritionFloatingWhatsApp
 * Botao flutuante moderno e acolhedor de WhatsApp com indicador online e tooltip informativo.
 */
export default function NutritionFloatingWhatsApp({ data, nutritionist }) {
  const [isHovered, setIsHovered] = useState(false);

  const profile = data || nutritionist || {};
  const prof = profile.professional || profile;
  const contact = profile.contact || profile;

  const rawPhone = contact.whatsapp || prof.whatsapp || '';
  if (!rawPhone) {
    return null;
  }

  const name = prof.name || prof.displayName || 'Nutricionista';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const defaultText = encodeURIComponent(
    `Ola, ${name}, vi o seu site e gostaria de saber mais informacoes sobre a consulta nutricional.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultText}`;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Editorial em Frosted Glass */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 max-w-xs backdrop-blur-xl bg-[#244B3B]/95 border border-white/20 text-white p-4 rounded-2xl shadow-[0_15px_35px_rgba(36,75,59,0.35)] relative pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-[11px] font-mono text-emerald-200 uppercase tracking-wider font-semibold">
                Atendimento Disponivel
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed font-light">
              Tire suas duvidas sobre consultas presenciais ou online diretamente pelo WhatsApp.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botao de Contato com Pilula e Botao Circular */}
      <div className="flex items-center gap-3">
        {/* Pilula de Chamada para Acao */}
        <motion.a
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-white/95 backdrop-blur-md border border-[#244B3B]/10 shadow-lg shadow-black/5 text-[#244B3B] hover:text-[#557A61] text-xs font-bold transition-all hover:scale-105"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>Tirar duvidas no WhatsApp</span>
        </motion.a>

        {/* Botao Circular Oficial */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 transition-all duration-300"
          aria-label="Falar com o profissional pelo WhatsApp"
        >
          {/* Circulo de pulso sutil */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping group-hover:opacity-100 opacity-60" />

          {/* Icone SVG do WhatsApp */}
          <div className="relative z-10">
            <WhatsAppIcon className="w-7 h-7" />
          </div>
        </motion.a>
      </div>
    </div>
  );
}
