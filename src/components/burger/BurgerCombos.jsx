import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { buildWhatsAppLink, buildComboOrderMessage } from '../../utils/burgerProspectUtils';

/**
 * BurgerCombos - Seção de Combos Promocionais Anti-Slop
 * Elegância editorial, comparativo honesto de economia e fotos em destaque.
 */
export default function BurgerCombos({ data }) {
  return (
    <section id="combos" className="bg-[#0C0A09] py-16 sm:py-24 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            Experiência Completa
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            Combos com burger, acompanhamento e bebida.
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed mt-3">
            Peça a combinação da casa com economia direta pelo WhatsApp, sem taxas inflacionadas de aplicativo de entrega.
          </p>
        </div>

        {/* Grade de Combos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {data.combos.map((combo, idx) => {
            const isFeatured = idx === 1;
            const comboWhatsappUrl = buildWhatsAppLink(
              data.contact.whatsapp,
              buildComboOrderMessage(combo, data.name)
            );

            const originalPriceFormatted = Number(combo.originalPrice).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

            const priceFormatted = Number(combo.price).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

            const saveFormatted = Number(combo.saveAmount).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

            return (
              <motion.div
                key={combo.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`rounded-xl overflow-hidden flex flex-col justify-between border ${
                  isFeatured
                    ? 'bg-[#141210] border-amber-500/80 shadow-2xl'
                    : 'bg-[#12100E] border-stone-800'
                }`}
              >
                {/* Banner de Destaque */}
                {combo.badge && (
                  <div className="bg-amber-500 text-stone-950 text-center py-1.5 text-xs font-mono font-bold uppercase tracking-wider">
                    {combo.badge}
                  </div>
                )}

                {/* Foto */}
                <div className="relative h-52 overflow-hidden bg-stone-950">
                  <img
                    src={combo.image}
                    alt={combo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-950/90 text-amber-400 border border-stone-800 text-[10px] font-mono font-bold">
                    Economia de {saveFormatted}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {combo.title}
                    </h3>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                      {combo.description}
                    </p>

                    {/* Itens Inclusos */}
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                        Composição do combo:
                      </span>
                      {combo.includes.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preços e Ação */}
                  <div className="pt-4 border-t border-stone-800/80 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-mono text-stone-500 line-through block">
                          No app: {originalPriceFormatted}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-mono uppercase text-amber-400">Direto:</span>
                          <span className="text-2xl font-black text-white font-mono">
                            {priceFormatted}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/60">
                        -{saveFormatted}
                      </span>
                    </div>

                    <motion.a
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      href={comboWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
                        isFeatured
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                          : 'bg-stone-900 hover:bg-amber-500 text-stone-200 hover:text-stone-950 border border-stone-800 hover:border-amber-500'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Pedir Este Combo</span>
                    </motion.a>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
