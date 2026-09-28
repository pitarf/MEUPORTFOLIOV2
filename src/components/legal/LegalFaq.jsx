import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

/**
 * FAQ com Split Editorial de 2 Colunas, Glassmorphism e Acordeão Fluido
 */
export default function LegalFaq({ lawyer, nicheInfo }) {
  const faqList = nicheInfo.faq || [];
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="duvidas" className="py-24 sm:py-32 bg-[#050B14] text-white border-t border-white/5 relative overflow-hidden">
      
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Coluna da Esquerda: Chamada e Contato de Suporte em Glass */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-white/[0.05] border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Esclarecimentos Jurídicos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Perguntas Frequentes &{' '}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Prazos Processuais
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
              Respostas transparentes e objetivas para as principais dúvidas sobre custos, documentos, prazos e a dinâmica de atuação forense.
            </p>

            {/* Card de Atendimento Direto em Glassmorphism */}
            <div className="p-8 rounded-3xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-amber-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-amber-400" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-white text-lg sm:text-xl">
                  Ficou com alguma dúvida específica sobre o seu caso?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-2 font-light leading-relaxed">
                  O Dr(a). {lawyer.name} e equipe jurídica prestam esclarecimentos preliminares sem burocracia diretamente pelo canal oficial do WhatsApp.
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
                  `Olá, Dr(a). ${lawyer.name}, consultei a seção de dúvidas mas gostaria de esclarecer uma situação pontual do meu caso.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Conversar no WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </motion.a>
            </div>
          </div>

          {/* Coluna da Direita: Lista de Acordeões Linha a Linha em Glass */}
          <div className="lg:col-span-7 space-y-4">
            {faqList.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-2xl ${
                    isOpen
                      ? 'bg-gradient-to-r from-amber-500/[0.1] via-white/[0.06] to-transparent border-amber-400/50 shadow-[0_10px_35px_rgba(245,158,11,0.15)]'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
                      {item.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-amber-400 text-black rotate-180' : 'bg-white/10 text-amber-300'
                    }`}>
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-gray-300 leading-relaxed font-light border-t border-white/10 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
