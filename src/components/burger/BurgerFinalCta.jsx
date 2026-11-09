import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { buildWhatsAppLink, buildGeneralOrderMessage } from '../../utils/burgerProspectUtils';

/**
 * BurgerFinalCta - Chamada Final Anti-Slop
 * Elegância visual, sem apelações cafonas, foco em velocidade de atendimento.
 */
export default function BurgerFinalCta({ data }) {
  const whatsappUrl = buildWhatsAppLink(
    data.contact.whatsapp,
    buildGeneralOrderMessage(data.name, data.discountDirectOrder)
  );

  return (
    <section className="bg-[#12100E] py-16 sm:py-24 border-b border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="p-8 sm:p-14 rounded-2xl bg-[#171513] border border-stone-800 shadow-2xl space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block">
            Atendimento Rápido
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            Seu próximo hambúrguer a um clique de distância.
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Envie sua mensagem pelo WhatsApp, escolha o ponto da carne e receba com embalagem térmica na sua porta em <strong className="text-white">{data.avgDeliveryTime}</strong>.
          </p>

          <div className="pt-2 flex justify-center">
            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-amber-950/40"
            >
              <ShoppingBag className="w-4 h-4 text-stone-950" />
              <span>Pedir Agora pelo WhatsApp</span>
            </motion.a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-400 border-t border-stone-800/60">
            <span className="inline-flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              {data.discountDirectOrder} direto
            </span>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Preparo imediato
            </span>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pagamento na entrega ou Pix
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
