import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star, Clock, ShieldCheck } from 'lucide-react';
import { buildWhatsAppLink, buildGeneralOrderMessage } from '../../utils/burgerProspectUtils';

/**
 * BurgerHero - Arquitetura Anti-Slop (Tasteskill 2.5 & Frontend-Design)
 * Estética de gastrobar contemporâneo e hamburgueria artesanal de alto padrão.
 * Tipografia sóbria e direta, fotografia gastronômica em primeiro plano, zero emojis clichês.
 */
export default function BurgerHero({ data }) {
  const whatsappUrl = buildWhatsAppLink(
    data.contact.whatsapp,
    buildGeneralOrderMessage(data.name, data.discountDirectOrder)
  );

  return (
    <section id="inicio" className="relative bg-[#0C0A09] text-stone-100 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-800/80 overflow-hidden">
      {/* Luz ambiente quente e discreta de bistrô */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Coluna Editorial de Conteúdo (7 colunas) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Tag Editorial Sóbria */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-900 border border-stone-800 text-amber-400 text-xs font-mono tracking-wider uppercase">
              <span>Hambúrguer Artesanal • Chapa a 260°C</span>
            </div>

            {/* Headline Direta e de Impacto Real (Sem slogans vazios de IA) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] uppercase">
              Carne fresca moída todo dia, crosta perfeita e pão na manteiga.
            </h1>

            {/* Descrição Concisa */}
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Sem carne congelada, sem molho industrial. Trabalhamos exclusivamente com blend Angus selecionado, queijo derretido no vapor e pão brioche de fermentação natural. Peça direto no WhatsApp e receba quentinho em <strong className="text-white font-semibold">{data.avgDeliveryTime}</strong>.
            </p>

            {/* Ficha Técnica Gastronômica (Substituindo emojis por dados técnicos limpos) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-1">
              <div className="p-3 rounded-lg bg-stone-900/90 border border-stone-800/90">
                <span className="block text-xs font-mono text-amber-400 uppercase tracking-wider">Corte</span>
                <span className="text-sm font-bold text-white block mt-0.5">Blend Angus 180g</span>
                <span className="text-[11px] text-stone-400 block">Moído no dia</span>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/90 border border-stone-800/90">
                <span className="block text-xs font-mono text-amber-400 uppercase tracking-wider">Pão</span>
                <span className="text-sm font-bold text-white block mt-0.5">Brioche de Garrafa</span>
                <span className="text-[11px] text-stone-400 block">Fermentação 36h</span>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/90 border border-stone-800/90">
                <span className="block text-xs font-mono text-amber-400 uppercase tracking-wider">Queijo</span>
                <span className="text-sm font-bold text-white block mt-0.5">Cheddar Inglês</span>
                <span className="text-[11px] text-stone-400 block">Melt no vapor</span>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/90 border border-stone-800/90">
                <span className="block text-xs font-mono text-amber-400 uppercase tracking-wider">Preparo</span>
                <span className="text-sm font-bold text-white block mt-0.5">Crosta Smash</span>
                <span className="text-[11px] text-stone-400 block">Reação de Maillard</span>
              </div>
            </div>

            {/* CTAs de Ação com Microinterações de Mola */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-stone-950" />
                <span>Pedir no WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#cardapio"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/80 text-stone-200 hover:text-white font-semibold text-sm transition-colors"
              >
                <span>Ver Cardápio Completo</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </motion.a>
            </div>

            {/* Prova Operacional e Entrega */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-400 border-t border-stone-900 w-full">
              <span className="inline-flex items-center gap-1.5 text-stone-300">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <strong className="text-white font-semibold">{data.rating}</strong> ({data.reviewsCount} avaliações no Google)
              </span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Entrega média em {data.avgDeliveryTime}
              </span>
              <span className="opacity-30">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Sem taxas de marketplace
              </span>
            </div>

          </motion.div>

          {/* Coluna da Fotografia em Alta Resolução (5 colunas) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl group">
              <div className="overflow-hidden aspect-4/5 max-h-[500px]">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85"
                  alt="Hambúrguer artesanal Angus grelhado com queijo cheddar inglês derretido e pão brioche dourado"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="eager"
                  width="1200"
                  height="1500"
                />
              </div>

              {/* Faixa Técnica Inferior Integrada (Sem caixas soltas flutuando) */}
              <div className="p-4 bg-stone-950 border-t border-stone-800/80 flex items-center justify-between text-left">
                <div>
                  <span className="text-[11px] font-mono uppercase text-amber-400 tracking-wider block">
                    Carro-Chefe da Casa
                  </span>
                  <span className="text-base font-bold text-white tracking-tight block">
                    Iron Monster Double Angus
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 block line-through">R$ 49,90 no app</span>
                  <span className="text-lg font-black text-amber-400 block">R$ 44,90 direto</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
