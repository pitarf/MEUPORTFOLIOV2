import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../../utils/burgerProspectUtils';

/**
 * BurgerFaq - Acordeão de Perguntas Frequentes Anti-Slop
 * Respostas práticas para tempo de entrega, pontos da carne e pagamento.
 */
export default function BurgerFaq({ data }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const whatsappUrl = buildWhatsAppLink(
    data.contact.whatsapp,
    'Olá! Gostaria de tirar uma dúvida sobre o cardápio ou entrega.'
  );

  return (
    <section id="faq" className="bg-[#0C0A09] py-16 sm:py-24 border-b border-stone-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            Perguntas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            Tudo o que você precisa saber antes de pedir.
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed mt-3">
            Informações sobre tempo de entrega, embalagem, pontos de carne e pedidos para grupos.
          </p>
        </div>

        {/* Acordeão */}
        <div className="space-y-3">
          {data.faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#12100E] rounded-xl border border-stone-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#171513] transition-colors"
                >
                  <span className="font-bold text-white text-sm sm:text-base tracking-tight">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-md bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-stone-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 text-stone-400 text-xs sm:text-sm leading-relaxed border-t border-stone-800/60 pt-3 text-left"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Link direto de dúvida no WhatsApp */}
        <div className="mt-8 text-left">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ficou com outra dúvida? Fale com a equipe no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
