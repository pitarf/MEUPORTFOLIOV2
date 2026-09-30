import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

/**
 * FAQ com Split Editorial de 2 Colunas no Estilo Corporativo Summit Financial
 * Acordeão fluido à direita e Card de Conversão Direta no WhatsApp à esquerda.
 */
export default function LegalFaq({ lawyer, nicheInfo, theme }) {
  const faqList = nicheInfo?.faq || [];
  const [openIndex, setOpenIndex] = useState(0);
  const honorific = theme?.honorific || 'Dr(a).';
  const articleCap = theme?.articleCap || 'O';

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappFaqUrl = `https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
    `Olá, ${honorific} ${lawyer?.name}, consultei a seção de dúvidas do site mas gostaria de esclarecer uma situação pontual do meu caso.`
  )}`;

  const isFemale = theme?.gender === 'female';

  return (
    <section id="duvidas" className={`py-20 sm:py-24 ${isFemale ? 'bg-[#FAF4F7] border-[#EEDCE7] text-stone-800' : 'bg-[#FAFBFD] border-slate-200 text-slate-800'} border-t relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          
          {/* Coluna da Esquerda: Chamada e Contato de Suporte no WhatsApp */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
                <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445] tracking-widest' : 'text-[#C6923C] uppercase tracking-widest'}`}>
                  ESCLARECIMENTOS & DÚVIDAS
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl lg:text-[2.5rem] ${isFemale ? 'font-serif font-normal text-[#2C0822] tracking-normal' : 'font-sans font-extrabold text-[#0A192F] tracking-tight'} leading-tight`}>
                Perguntas Frequentes & Prazos Forenses
              </h2>
            </div>

            <p className={`${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} text-sm sm:text-base leading-relaxed`}>
              Respostas diretas e sem burocracia para as principais dúvidas sobre custos, documentos, prazos e a dinâmica de atuação judicial e extrajudicial.
            </p>

            {/* Card de Atendimento Direto no WhatsApp */}
            <div className={`p-7 sm:p-8 ${isFemale ? 'rounded-3xl bg-white/95 border-[#EEDCE7] shadow-[0_15px_35px_rgba(44,8,34,0.06)]' : 'rounded-2xl bg-white border-slate-200/90 shadow-xl shadow-slate-200/50'} border space-y-5`}>
              <div className={`w-12 h-12 rounded-xl ${isFemale ? 'bg-[#D8A756]/15 border border-[#D8A756]/30 text-[#D8A756]' : 'bg-amber-50 border border-amber-200 text-[#C6923C]'} flex items-center justify-center`}>
                <HelpCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className={`${isFemale ? 'font-serif font-medium text-xl text-[#2C0822]' : 'font-sans font-bold text-lg sm:text-xl text-[#0A192F]'} leading-snug`}>
                  Ficou com alguma dúvida específica sobre o seu caso?
                </h3>
                <p className={`text-xs sm:text-sm ${isFemale ? 'text-stone-500 font-light' : 'text-slate-600 font-normal'} mt-2 leading-relaxed`}>
                  {articleCap} {honorific} {lawyer?.name || 'nosso time'} presta esclarecimentos preliminares diretamente pelo canal oficial do WhatsApp com sigilo ético.
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappFaqUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-lg shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35' : 'rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-lg shadow-emerald-500/20'} text-xs uppercase tracking-wider transition-all group`}
              >
                <MessageCircle className={`w-4 h-4 ${isFemale ? 'fill-[#1A0314] text-[#1A0314]' : 'fill-white text-white'} group-hover:scale-110 transition-transform`} />
                <span>Tirar Dúvida no WhatsApp</span>
                <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#1A0314]' : 'text-white'} group-hover:translate-x-1 transition-transform`} />
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
                  className={`${isFemale ? 'rounded-2xl' : 'rounded-xl'} border transition-all duration-200 overflow-hidden bg-white ${
                    isOpen
                      ? (isFemale ? 'border-[#D8A756] shadow-md shadow-pink-950/5' : 'border-[#C6923C] shadow-md')
                      : (isFemale ? 'border-[#EEDCE7] hover:border-[#D8A756]/50 shadow-sm' : 'border-slate-200/90 hover:border-slate-300 shadow-sm')
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className={`${isFemale ? 'font-serif font-medium text-base text-[#2C0822]' : 'font-sans font-bold text-sm sm:text-base text-[#0A192F]'} leading-snug`}>
                      {item.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? (isFemale ? 'bg-[#2D0A22] text-[#D8A756] rotate-180' : 'bg-[#0A192F] text-white rotate-180')
                        : (isFemale ? 'bg-[#FAF4F7] text-stone-500' : 'bg-slate-100 text-slate-600')
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
                        <div className={`px-5 sm:px-6 pb-6 text-sm ${isFemale ? 'text-stone-600 font-light border-[#F2E4ED]' : 'text-slate-600 font-normal border-slate-100'} leading-relaxed border-t pt-4`}>
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
