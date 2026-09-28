import React from 'react';
import { MessageSquare, FileText, Compass, Activity } from 'lucide-react';

/**
 * Seção de Processo / Metodologia no Estilo Exato da Summit Financial (Imagem de Referência)
 * Fundo claro com 4 círculos conectados, badges numéricas douradas e textos explicativos.
 */
export default function LegalMethodology({ lawyer, nicheInfo }) {
  const steps = [
    {
      num: 1,
      title: 'DIAGNÓSTICO',
      desc: 'Iniciamos com uma conversa detalhada para compreender seus objetivos, fatos e prioridades.',
      icon: MessageSquare
    },
    {
      num: 2,
      title: 'PLANEJAMENTO',
      desc: 'Analisamos documentos e construímos um plano jurídico sob medida para a sua demanda.',
      icon: FileText
    },
    {
      num: 3,
      title: 'EXECUÇÃO',
      desc: 'Colocamos a estratégia em prática através de medidas judiciais céleres ou acordos eficazes.',
      icon: Compass
    },
    {
      num: 4,
      title: 'ACOMPANHAMENTO',
      desc: 'Monitoramos cada movimentação processual com relatórios claros e diretos pelo WhatsApp.',
      icon: Activity
    }
  ];

  return (
    <section id="metodologia" className="bg-[#F8F9FB] py-20 sm:py-24 border-y border-slate-200 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-[#C6923C]" />
            <span className="text-xs font-semibold text-[#C6923C] uppercase tracking-widest">
              NOSSO RITO DE ATENDIMENTO
            </span>
            <span className="w-8 h-[2px] bg-[#C6923C]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#0A192F] tracking-tight">
            Um Processo Simples. Resultados Estratégicos.
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal leading-relaxed">
            Um fluxo transparente e seguro, sem burocracias e em estrito cumprimento das normas éticas da OAB.
          </p>
        </div>

        {/* Linha do Tempo dos 4 Círculos Conectados */}
        <div className="relative">
          
          {/* Linha conectora no desktop com gradiente suave */}
          <div className="hidden lg:block absolute top-[52px] left-[14%] right-[14%] h-[2px] bg-gradient-to-r from-transparent via-[#C6923C]/40 to-transparent z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                  
                  {/* Badge Circular com Número Dourado e Círculo Navy */}
                  <div className="relative mb-6">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#C6923C] text-white text-xs font-bold font-mono flex items-center justify-center shadow-md z-20 border-2 border-white">
                      {step.num}
                    </span>

                    <div className="w-24 h-24 rounded-full bg-[#0A192F] border-4 border-white shadow-xl flex items-center justify-center text-white group hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 stroke-[1.8] text-[#D8A756]" />
                    </div>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#0A192F] tracking-wide mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-xs">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
