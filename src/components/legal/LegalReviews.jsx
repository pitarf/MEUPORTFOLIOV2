import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ShieldCheck,
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
 * Seção de Depoimentos / Avaliações no Estilo Summit Financial
 * Versão responsiva de alta conversão:
 * - Mobile: Carrossel touch-first exibindo cards individuais com swipe, setas e indicadores
 * - Desktop: Grade horizontal equilibrada de 3 colunas com aspas em ouro
 */
export default function LegalReviews({ lawyer, nicheInfo, theme }) {
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

  const isFemale = theme?.gender === 'female';
  const honorific = theme?.honorific || 'Dr(a).';
  const lawyerShortName = lawyer?.name ? `${honorific} ${lawyer.name}` : 'O escritório';
  const lawyerCity = lawyer?.city || 'São Paulo';
  const lawyerState = lawyer?.state || 'SP';
  const regionLocation = `${lawyerCity} - ${lawyerState}`;

  const reviews = useMemo(() => {
    const nicheKey = nicheInfo?.id || 'geral';

    if (nicheKey === 'trabalhista') {
      return [
        {
          quote: `${lawyerShortName} e sua equipe conduziram minha ação trabalhista com extrema agilidade e precisão. Todas as verbas rescisórias e horas devidas foram calculadas e recebidas com segurança.`,
          name: 'Carlos Eduardo M.',
          city: regionLocation
        },
        {
          quote: 'Atendimento impecável! Fui orientado sobre cada etapa pelo WhatsApp, sem rodeios e com total transparência nos honorários. Excelente atuação na audiência.',
          name: 'Mariana Siqueira',
          city: regionLocation
        },
        {
          quote: `A clareza técnica e a firmeza de ${lawyerShortName} me deram total tranquilidade durante o processo de rescisão indireta. Recomendo de olhos fechados.`,
          name: 'Roberto Tavares',
          city: regionLocation
        }
      ];
    }

    if (nicheKey === 'consumidor') {
      return [
        {
          quote: `${lawyerShortName} resolveu uma cobrança abusiva e negativação indevida no meu nome em tempo recorde. Consegui a exclusão dos órgãos de proteção e a indenização devida.`,
          name: 'Carlos Eduardo M.',
          city: regionLocation
        },
        {
          quote: 'Tive um problema grave de cancelamento de voo e estorno negado. O escritório acolheu meu caso de imediato e resolveu tudo com total profissionalismo.',
          name: 'Juliana Cavalcanti',
          city: regionLocation
        },
        {
          quote: `A equipe de ${lawyerShortName} foi extremamente competente na revisão do meu contrato bancário. Transparência do início ao fim.`,
          name: 'Roberto Tavares',
          city: regionLocation
        }
      ];
    }

    if (nicheKey === 'familia') {
      return [
        {
          quote: `${lawyerShortName} conduziu meu divórcio e partilha com absoluta sensibilidade e discrição. O acordo foi homologado com rapidez e sem desgastes emocionais.`,
          name: 'Patrícia Alencar',
          city: regionLocation
        },
        {
          quote: 'Excelente suporte na regularização de inventário e partilha de bens. Comunicação direta, humana e muito segura em todas as reuniões.',
          name: 'Marcos Vinícius',
          city: regionLocation
        },
        {
          quote: `A condução do processo de guarda e pensão por ${lawyerShortName} assegurou a melhor proteção aos meus filhos. Gratidão pelo trabalho impecável.`,
          name: 'Fernanda Rocha',
          city: regionLocation
        }
      ];
    }

    // Modelo Geral
    return [
      {
        quote: `${lawyerShortName} e sua equipe conduziram minha demanda com extrema rapidez e profissionalismo. Fui acolhido com clareza técnica e transparência absoluta.`,
        name: 'Carlos Eduardo M.',
        city: regionLocation
      },
      {
        quote: 'Excelente atendimento estratégico. Informações claras sobre cada andamento pelo WhatsApp com total segurança jurídica e honestidade.',
        name: 'Mariana Siqueira',
        city: regionLocation
      },
      {
        quote: `A seriedade e a dedicação de ${lawyerShortName} me deram total tranquilidade durante todo o processo. Recomendo a todos que buscam advocacia de alto nível.`,
        name: 'Roberto Tavares',
        city: regionLocation
      }
    ];
  }, [lawyerShortName, regionLocation, nicheInfo]);

  // Renderiza o card individual de depoimento
  const renderReviewCard = (r, idx) => (
    <div
      key={idx}
      className={`${
        isFemale
          ? 'bg-white/95 rounded-3xl border border-[#EEDCE7] shadow-[0_10px_30px_rgba(44,8,34,0.04)] hover:border-[#D8A756]/60'
          : 'bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/50'
      } p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between h-full`}
    >
      <div>
        {/* Aspas em Ouro */}
        <span className={`text-4xl font-serif font-bold ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} block leading-none mb-3`}>
          “
        </span>

        <p className={`text-sm ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} leading-relaxed italic`}>
          {r.quote}
        </p>
      </div>

      <div className={`mt-6 sm:mt-8 pt-4 border-t ${isFemale ? 'border-[#F2E4ED]' : 'border-slate-100'} flex items-center justify-between`}>
        <div>
          <span className={`text-sm ${isFemale ? 'font-serif font-medium text-[#2C0822]' : 'font-bold text-[#0A192F]'} block`}>
            {r.name}
          </span>
          <span className={`text-[11px] ${isFemale ? 'text-stone-500 font-light' : 'text-slate-500 font-mono'}`}>
            {r.city}
          </span>
        </div>

        {/* 5 Estrelas Douradas */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${isFemale ? 'fill-[#D8A756] text-[#D8A756]' : 'fill-[#C6923C] text-[#C6923C]'}`} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="depoimentos" className={`${isFemale ? 'bg-[#FCF9F7] border-[#EEDCE7] text-stone-800' : 'bg-white border-slate-100 text-slate-800'} py-16 sm:py-24 border-t overflow-hidden w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
            <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445] tracking-widest' : 'text-[#C6923C] uppercase tracking-widest'}`}>
              DEPOIMENTOS DOS CLIENTES
            </span>
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-[2.5rem] ${isFemale ? 'font-serif font-normal text-[#2C0822] tracking-normal' : 'font-sans font-extrabold text-[#0A192F] tracking-tight'}`}>
            A Confiança de Quem Teve Seus Direitos Defendidos
          </h2>
          <p className={`text-sm sm:text-base ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} mt-3 leading-relaxed`}>
            A satisfação dos nossos clientes é o maior testemunho do nosso rigor técnico e comprometimento ético.
          </p>
        </div>

        {/* 1. CARROSSEL MOBILE EXCLUSIVO (< md) */}
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
              {reviews.map((r, idx) => (
                <CarouselItem key={idx} className="pl-3 basis-[90%] sm:basis-[82%]">
                  <div className="h-full py-1">
                    {renderReviewCard(r, idx)}
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
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => mobileApi?.scrollNext()}
                  className={`w-9 h-9 rounded-full border ${isFemale ? 'border-[#D8A756]/40 text-[#2C0822] bg-white' : 'border-slate-300 text-slate-800 bg-white'} flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all`}
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Indicadores de bolinhas (Dots interativos) */}
              <div className="flex items-center gap-1.5">
                {reviews.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => mobileApi?.scrollTo(dotIdx)}
                    aria-label={`Ir para depoimento ${dotIdx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      dotIdx === currentMobileIndex
                        ? `w-6 h-2 ${isFemale ? 'bg-gradient-to-r from-[#D8A756] to-[#C79540]' : 'bg-[#C6923C]'}`
                        : `w-2 h-2 ${isFemale ? 'bg-[#EEDCE7]' : 'bg-slate-300'}`
                    }`}
                  />
                ))}
              </div>

              {/* Contador de depoimentos */}
              <span className="text-xs font-mono font-semibold text-slate-500">
                0{currentMobileIndex + 1} / 0{reviews.length}
              </span>
            </div>
          </Carousel>
        </div>

        {/* 2. GRADE TRADICIONAL PARA TABLETS E DESKTOPS (md:) */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {reviews.map((r, idx) => renderReviewCard(r, idx))}
        </div>

        {/* Bloco de CTA Pós-Depoimentos */}
        <div className="mt-12 sm:mt-14 max-w-2xl mx-auto text-center">
          <div className={`inline-flex flex-col sm:flex-row items-center justify-between gap-5 w-full ${isFemale ? 'bg-[#FAF4F7] border border-[#D8A756]/40 rounded-3xl shadow-[0_10px_30px_rgba(44,8,34,0.06)]' : 'bg-[#FAFBFD] border border-amber-300/70 rounded-2xl shadow-md'} p-6 sm:p-7`}>
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              <div className={`w-11 h-11 rounded-xl ${isFemale ? 'bg-[#D8A756]/15 border border-[#D8A756]/30 text-[#D8A756]' : 'bg-amber-500/10 border border-amber-400/40 text-[#C6923C]'} flex items-center justify-center flex-shrink-0`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-sm ${isFemale ? 'font-serif font-medium text-[#2C0822]' : 'font-bold text-[#0A192F]'} block leading-tight`}>
                  Deseja a mesma tranquilidade para o seu caso?
                </span>
                <span className={`text-xs ${isFemale ? 'text-stone-500 font-light' : 'text-slate-500 font-normal'} block mt-0.5`}>
                  Inicie sua consulta estratégica com {theme?.article === 'a' ? 'a Dra.' : 'o Dr.'} {lawyer?.name || 'nosso escritório'}.
                </span>
              </div>
            </div>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
                `Olá, ${honorific} ${lawyer?.name}, vi os depoimentos de clientes no site e gostaria de agendar uma consulta para o meu caso.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-lg shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35' : 'rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-md hover:shadow-emerald-500/25'} text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 group text-center`}
            >
              <MessageCircle className={`w-4 h-4 ${isFemale ? 'fill-[#1A0314] text-[#1A0314]' : 'fill-white text-white'} group-hover:scale-110 transition-transform`} />
              <span>Consultar no WhatsApp</span>
              <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#1A0314]' : 'text-white'} group-hover:translate-x-1 transition-transform`} />
            </motion.a>
          </div>
        </div>

      </div>
    </section>
  );
}
