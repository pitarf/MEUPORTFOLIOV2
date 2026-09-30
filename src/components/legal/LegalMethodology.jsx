import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, Compass, Activity, MessageCircle, ArrowRight } from 'lucide-react';

/**
 * Seção de Processo / Metodologia no Estilo Exato da Summit Financial (Imagem de Referência)
 * Fundo claro com 4 círculos conectados, badges numéricas douradas e textos explicativos.
 */
export default function LegalMethodology({ lawyer, nicheInfo, theme }) {
  const honorific = theme?.honorific || 'Dr(a).';
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

  const isFemale = theme?.gender === 'female';

  return (
    <section id="metodologia" className={`${isFemale ? 'bg-[#FAF4F7] border-[#EEDCE7] text-stone-800' : 'bg-[#F8F9FB] border-slate-200 text-slate-800'} py-20 sm:py-24 border-y`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
            <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445] tracking-widest' : 'text-[#C6923C] uppercase tracking-widest'}`}>
              NOSSO RITO DE ATENDIMENTO
            </span>
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-[2.5rem] ${isFemale ? 'font-serif font-normal text-[#2C0822] tracking-normal' : 'font-sans font-extrabold text-[#0A192F] tracking-tight'}`}>
            Um Processo Simples. Resultados Estratégicos.
          </h2>
          <p className={`text-base ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} mt-3 leading-relaxed`}>
            Um fluxo transparente e acolhedor, sem burocracias e em estrito cumprimento das normas éticas da OAB.
          </p>
        </div>

        {/* Linha do Tempo dos 4 Círculos Conectados */}
        <div className="relative">
          
          {/* Linha conectora no desktop com gradiente suave */}
          <div className={`hidden lg:block absolute top-[52px] left-[14%] right-[14%] h-[2px] ${isFemale ? 'bg-gradient-to-r from-transparent via-[#D8A756]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-[#C6923C]/40 to-transparent'} z-0`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-4">
                  
                  {/* Badge Circular com Número Dourado e Círculo Temático */}
                  <div className="relative mb-6">
                    <span className={`absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${isFemale ? 'bg-[#D8A756] text-[#1A0314]' : 'bg-[#C6923C] text-white'} text-xs font-bold font-mono flex items-center justify-center shadow-md z-20 border-2 border-white`}>
                      {step.num}
                    </span>

                    <div className={`w-24 h-24 rounded-full ${isFemale ? 'bg-gradient-to-br from-[#2D0A22] to-[#180313] shadow-lg shadow-[#2D0A22]/25' : 'bg-[#0A192F] shadow-xl'} border-4 border-white flex items-center justify-center text-white group hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 stroke-[1.8] ${isFemale ? 'text-[#D8A756]' : 'text-[#D8A756]'}`} />
                    </div>
                  </div>

                  <h3 className={`font-serif ${isFemale ? 'font-medium text-xl text-[#2C0822]' : 'font-sans font-bold text-lg text-[#0A192F]'} tracking-wide mb-2`}>
                    {step.title}
                  </h3>

                  <p className={`text-sm ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} leading-relaxed max-w-xs`}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bloco de CTA de Alta Conversão para o Passo 1 */}
        <div className={`mt-14 max-w-3xl mx-auto ${isFemale ? 'bg-white/95 rounded-3xl border-[#EEDCE7] shadow-[0_15px_35px_rgba(44,8,34,0.06)]' : 'bg-white rounded-2xl border-slate-200/90 shadow-xl shadow-slate-200/50'} p-6 sm:p-8 border flex flex-col sm:flex-row items-center justify-between gap-6 text-left`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFemale ? 'bg-[#D8A756]' : 'bg-emerald-500'} animate-pulse`} />
              <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445]' : 'text-emerald-600'} uppercase tracking-wider font-mono`}>
                Atendimento Imediato Aberto
              </span>
            </div>
            <h4 className={`text-lg sm:text-xl ${isFemale ? 'font-serif font-medium text-[#2C0822]' : 'font-bold text-[#0A192F]'} tracking-tight`}>
              Inicie o Passo 1 Agora: Agende seu Diagnóstico
            </h4>
            <p className={`text-xs sm:text-sm ${isFemale ? 'text-stone-500 font-light' : 'text-slate-500 font-normal'}`}>
              Triagem sigilosa diretamente com {theme?.article === 'a' ? 'a Dra.' : 'o Dr.'} {lawyer?.name || 'nosso escritório'} pelo WhatsApp oficial.
            </p>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={`https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
              `Olá, ${honorific} ${lawyer?.name}, li sobre o método de atendimento do escritório e gostaria de iniciar o Passo 1 (Diagnóstico).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-8 py-4 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-lg shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35' : 'rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-lg shadow-emerald-500/20'} text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap flex-shrink-0 group`}
          >
            <MessageCircle className={`w-4 h-4 ${isFemale ? 'fill-[#1A0314] text-[#1A0314]' : 'fill-white text-white'} group-hover:scale-110 transition-transform`} />
            <span>Falar no WhatsApp</span>
            <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#1A0314]' : 'text-white'} group-hover:translate-x-1 transition-transform`} />
          </motion.a>
        </div>

      </div>
    </section>
  );
}
