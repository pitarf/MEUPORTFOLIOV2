import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppLink, buildGeneralOrderMessage } from '../../utils/burgerProspectUtils';

/**
 * BurgerFloatingWhatsApp - Botão Flutuante Anti-Slop
 * Elegante, discreto, com feedback tátil suave no clique.
 */
export default function BurgerFloatingWhatsApp({ data }) {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = buildWhatsAppLink(
    data.contact.whatsapp,
    buildGeneralOrderMessage(data.name, data.discountDirectOrder)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
      
      {/* Tooltip de Balão Discreto */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="relative mb-3 max-w-[260px] bg-[#171513] border border-stone-800 rounded-xl p-3 shadow-2xl text-left"
          >
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-stone-500 hover:text-white p-0.5 rounded"
              aria-label="Fechar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                Cozinha Aberta
              </span>
            </div>

            <p className="text-xs text-stone-300 font-normal leading-relaxed">
              Atendimento em tempo real pelo WhatsApp. Peça direto sem taxas.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante */}
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fazer pedido pelo WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-950/50 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.a>
    </div>
  );
}
