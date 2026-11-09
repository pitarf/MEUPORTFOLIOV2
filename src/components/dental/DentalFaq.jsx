import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

/**
 * Acordeão de Perguntas Frequentes (FAQ) da Clínica Odontológica
 * Esclarece dúvidas técnicas e tranquiliza o paciente de forma empática.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalFaq({ data }) {
  const { faq, contact, professional } = data;
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const getDoubtWhatsappUrl = () => {
    const msg = encodeURIComponent(
      `Olá, ${professional.name}! Tenho uma dúvida sobre os tratamentos e gostaria de uma orientação.`
    );
    return `https://wa.me/${contact.whatsapp}?text=${msg}`;
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-gradient-to-b from-white via-sky-50/30 to-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Respostas claras e transparentes para você se sentir 100% seguro antes de iniciar qualquer procedimento.
          </p>
        </div>

        {/* Acordeão */}
        <div className="space-y-3.5">
          {faq.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-sky-300 shadow-md shadow-sky-950/5'
                    : 'bg-white/80 border-slate-200 hover:border-sky-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-hidden min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {item.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-sky-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-sky-50 pt-3 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Box de Apoio com CTA de WhatsApp */}
        <div className="mt-12 text-center p-6 sm:p-8 rounded-3xl bg-sky-50 border border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base font-bold text-slate-900">
              Ainda tem alguma dúvida específica?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Nossa equipe de atendimento está pronta para orientar você com carinho.
            </p>
          </div>
          <a
            href={getDoubtWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all shrink-0 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar com a Recepção no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
}
