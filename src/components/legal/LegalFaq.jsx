import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

/**
 * FAQ com Split Editorial de 2 Colunas no Estilo Corporativo Summit Financial
 * Acordeão fluido à direita e Card de Conversão Direta no WhatsApp à esquerda.
 */
export default function LegalFaq({ lawyer, nicheInfo }) {
  const faqList = nicheInfo?.faq || [];
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappFaqUrl = `https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
    `Olá, Dr(a). ${lawyer?.name}, consultei a seção de dúvidas do site mas gostaria de esclarecer uma situação pontual do meu caso.`
  )}`;

  return (
    <section id="duvidas" className="py-20 sm:py-24 bg-[#FAFBFD] text-slate-800 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          
          {/* Coluna da Esquerda: Chamada e Contato de Suporte no WhatsApp */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-[2px] bg-[#C6923C]" />
                <span className="text-xs font-semibold text-[#C6923C] uppercase tracking-widest">
                  ESCLARECIMENTOS & DÚVIDAS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-[#0A192F] tracking-tight leading-tight">
                Perguntas Frequentes & Prazos Forenses
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Respostas diretas e sem burocracia para as principais dúvidas sobre custos, documentos, prazos e a dinâmica de atuação judicial e extrajudicial.
            </p>

            {/* Card de Atendimento Direto no WhatsApp */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-5">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C6923C]">
                <HelpCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-sans font-bold text-[#0A192F] text-lg sm:text-xl leading-snug">
                  Ficou com alguma dúvida específica sobre o seu caso?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
                  O Dr(a). {lawyer?.name || 'nosso time'} presta esclarecimentos preliminares diretamente pelo canal oficial do WhatsApp com sigilo ético.
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappFaqUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all group"
              >
                <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>Tirar Dúvida no WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </div>

          {/* Coluna da Direita: Lista de Acordeões Linha a Linha */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqList.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden bg-white ${
                    isOpen
                      ? 'border-[#C6923C] shadow-md'
                      : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-sans font-bold text-sm sm:text-base text-[#0A192F] leading-snug">
                      {item.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#0A192F] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ChevronDown className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
