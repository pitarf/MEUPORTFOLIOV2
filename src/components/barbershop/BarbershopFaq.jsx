import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

/**
 * Seção de Dúvidas Frequentes (FAQ) em formato de Acordeão Interativo
 * Responde às perguntas mais comuns de agendamento, cortesia, formas de pagamento e serviços.
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopFaq({ data }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = data.faq || [
    {
      question: 'Preciso agendar com antecedência ou posso ir direto?',
      answer: 'Recomendamos o agendamento prévio via WhatsApp para garantir sua poltrona no horário pontual sem espera. Atendimentos por ordem de chegada dependem da disponibilidade dos barbeiros no momento.'
    },
    {
      question: 'O chopp artesanal e o café são realmente cortesia?',
      answer: 'Sim, absolutamente! Todos os nossos clientes têm direito a um chopp artesanal gelado ou espresso moído na hora como cortesia durante o atendimento.'
    },
    {
      question: 'Como funciona a Barboterapia com Toalha Quente?',
      answer: 'É um ritual relaxante que utiliza vapor térmico, óleos essenciais e toalhas quentes para dilatar os poros, amaciar os fios e proporcionar um barbear impecável sem irritações.'
    },
    {
      question: 'Vocês atendem crianças?',
      answer: 'Sim! Realizamos cortes infantis com todo o cuidado, paciência e atenção que os pequenos merecem.'
    },
    {
      question: 'Quais formas de pagamento são aceitas?',
      answer: 'Aceitamos Pix, cartões de crédito e débito de todas as bandeiras e dinheiro em espécie.'
    },
    {
      question: 'Possui estacionamento no local?',
      answer: 'Sim, contamos com estacionamento privativo e gratuito com segurança para nossos clientes.'
    }
  ];

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-zinc-900/30 relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Tudo o que você precisa saber antes de nos visitar pela primeira vez.
          </p>
        </div>

        {/* Lista de Itens do FAQ */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden transition-colors duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white pr-4">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-300' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-900 animate-in fade-in-50 duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
