import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  FileText,
  Compass,
  Activity,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';

/**
 * Seção de Processo / Metodologia no Estilo Summit Financial
 * Versão responsiva de alta conversão:
 * - Mobile: Carrossel touch-first exibindo 1 etapa por vez com gestos de toque, setas e indicadores
 * - Desktop: 4 círculos conectados horizontalmente com conectores e numeração dourada
 */
export default function LegalMethodology({ lawyer, nicheInfo, theme }) {
  const [mobileApi, setMobileApi] = useState(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  // Monitora a troca de slide no carrossel mobile para sincronizar os dots e contador
  useEffect(() => {
    if (!mobileApi) return;

    setCurrentMobileIndex(mobileApi.selectedScrollSnap());
    mobileApi.on('select', () => {
      setCurrentMobileIndex(mobileApi.selectedScrollSnap());
    });
  }, [mobileApi]);

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

  // Renderiza o card individual de cada etapa para o carrossel mobile
  const renderStepCard = (step, idx) => {
    const IconComponent = step.icon;
    return (
      <div
        key={idx}
        className={`flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl ${
          isFemale
            ? 'bg-white/95 border border-[#EEDCE7] shadow-[0_10px_30px_rgba(44,8,34,0.04)]'
            : 'bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50'
        } h-full`}
      >
        {/* Badge Circular com Número Dourado e Círculo Temático */}
        <div className="relative mb-5">
          <span
            className={`absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${
              isFemale ? 'bg-[#D8A756] text-[#1A0314]' : 'bg-[#C6923C] text-white'
            } text-xs font-bold font-mono flex items-center justify-center shadow-md z-20 border-2 border-white`}
          >
            {step.num}
          </span>

          <div
            className={`w-20 h-20 rounded-full ${
              isFemale
                ? 'bg-gradient-to-br from-[#2D0A22] to-[#180313] shadow-lg shadow-[#2D0A22]/25'
                : 'bg-[#0A192F] shadow-xl'
            } border-4 border-white flex items-center justify-center text-white`}
          >
            <IconComponent className="w-8 h-8 stroke-[1.8] text-[#D8A756]" />
          </div>
        </div>

        <h3
          className={`font-sans ${
            isFemale ? 'font-semibold text-xl text-[#2C0822]' : 'font-bold text-lg text-[#0A192F]'
          } tracking-tight mb-2`}
        >
          {step.title}
        </h3>

        <p
          className={`text-sm ${
            isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'
          } leading-relaxed max-w-xs`}
        >
          {step.desc}
        </p>
      </div>
    );
  };

  return (
    <section id="metodologia" className={`${isFemale ? 'bg-[#FAF4F7] border-[#EEDCE7] text-stone-800' : 'bg-[#F8F9FB] border-slate-200 text-slate-800'} py-16 sm:py-24 border-y overflow-hidden w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
            <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445] tracking-widest' : 'text-[#C6923C] uppercase tracking-widest'}`}>
              NOSSO RITO DE ATENDIMENTO
            </span>
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-[2.5rem] ${isFemale ? 'font-sans font-bold text-[#2C0822] tracking-tight' : 'font-sans font-extrabold text-[#0A192F] tracking-tight'}`}>
            Um Processo Simples. Resultados Estratégicos.
          </h2>
          <p className={`text-sm sm:text-base ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} mt-3 leading-relaxed`}>
            Um fluxo transparente e acolhedor, sem burocracias e em estrito cumprimento das normas éticas da OAB.
          </p>
        </div>

        {/* 1. CARROSSEL MOBILE EXCLUSIVO (< md) MOSTRANDO 1 PASSO POR VEZ */}
        <div className="md:hidden relative">
          <Carousel
            setApi={setMobileApi}
            opts={{
              align: 'center',
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {steps.map((step, idx) => (
                <CarouselItem key={idx} className="pl-3 basis-[90%] sm:basis-[82%]">
                  <div className="h-full py-1">
                    {renderStepCard(step, idx)}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controles de Navegação, Indicadores de Bolinhas e Contador */}
            <div className="flex items-center justify-between mt-6 px-1">
              {/* Botões de seta anterior e próximo */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mobileApi?.scrollPrev()}
                  className={`w-9 h-9 rounded-full border ${isFemale ? 'border-[#D8A756]/40 text-[#2C0822] bg-white' : 'border-slate-300 text-slate-800 bg-white'} flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all`}
                  aria-label="Passo anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => mobileApi?.scrollNext()}
                  className={`w-9 h-9 rounded-full border ${isFemale ? 'border-[#D8A756]/40 text-[#2C0822] bg-white' : 'border-slate-300 text-slate-800 bg-white'} flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all`}
                  aria-label="Próximo passo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Indicadores de bolinhas (Dots interativos) */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => mobileApi?.scrollTo(dotIdx)}
                    aria-label={`Ir para etapa ${dotIdx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      dotIdx === currentMobileIndex
                        ? `w-6 h-2 ${isFemale ? 'bg-gradient-to-r from-[#D8A756] to-[#C79540]' : 'bg-[#C6923C]'}`
                        : `w-2 h-2 ${isFemale ? 'bg-[#EEDCE7]' : 'bg-slate-300'}`
                    }`}
                  />
                ))}
              </div>

              {/* Contador de etapas */}
              <span className="text-xs font-mono font-semibold text-slate-500">
                0{currentMobileIndex + 1} / 0{steps.length}
              </span>
            </div>
          </Carousel>
        </div>

        {/* 2. GRADE PADRÃO COM CONECTORES PARA TABLETS E DESKTOPS (md:) */}
        <div className="hidden md:block relative">
          {/* Linha conectora no desktop com gradiente suave */}
          <div className={`hidden lg:block absolute top-[52px] left-[14%] right-[14%] h-[2px] ${isFemale ? 'bg-gradient-to-r from-transparent via-[#D8A756]/40 to-transparent' : 'bg-gradient-to-r from-transparent via-[#C6923C]/40 to-transparent'} z-0`} />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative z-10">
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
                      <IconComponent className="w-8 h-8 stroke-[1.8] text-[#D8A756]" />
                    </div>
                  </div>

                  <h3 className={`font-sans ${isFemale ? 'font-semibold text-xl text-[#2C0822]' : 'font-bold text-lg text-[#0A192F]'} tracking-tight mb-2`}>
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
        <div className={`mt-12 sm:mt-14 max-w-3xl mx-auto ${isFemale ? 'bg-white/95 rounded-3xl border-[#EEDCE7] shadow-[0_15px_35px_rgba(44,8,34,0.06)]' : 'bg-white rounded-2xl border-slate-200/90 shadow-xl shadow-slate-200/50'} p-6 sm:p-8 border flex flex-col sm:flex-row items-center justify-between gap-6 text-left`}>
          <div className="space-y-1.5 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFemale ? 'bg-[#D8A756]' : 'bg-emerald-500'} animate-pulse`} />
              <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445]' : 'text-emerald-600'} uppercase tracking-wider font-mono`}>
                Atendimento Imediato Aberto
              </span>
            </div>
            <h4 className={`text-lg sm:text-xl ${isFemale ? 'font-sans font-semibold text-[#2C0822]' : 'font-bold text-[#0A192F]'} tracking-tight`}>
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
            className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-lg shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35' : 'rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-lg shadow-emerald-500/20'} text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 whitespace-nowrap flex-shrink-0 group text-center`}
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
