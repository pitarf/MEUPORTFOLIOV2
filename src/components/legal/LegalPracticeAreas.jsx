import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Users,
  ShieldAlert,
  Scale,
  ArrowRight,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';

/**
 * Seção de Especialidades Forenses no Estilo Summit Financial
 * Versão responsiva de alta conversão:
 * - Mobile: Carrossel com navegação fluida por toque, setas e indicadores
 * - Desktop: Grade balanceada 3 + 2 com espaçamento premium
 */
export default function LegalPracticeAreas({ lawyer, nicheInfo, theme }) {
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

  // Especialidades Estruturadas (Adaptadas dinamicamente ao nicho do advogado)
  const defaultIcons = [Briefcase, Building2, Users, ShieldAlert, Scale];

  const areas = (nicheInfo?.practiceAreas && nicheInfo.practiceAreas.length > 0)
    ? nicheInfo.practiceAreas.map((pa, idx) => ({
        title: pa.title,
        desc: pa.summary || pa.desc || 'Atuação técnica focada em defender seus direitos com agilidade e respaldo legal.',
        icon: defaultIcons[idx % defaultIcons.length]
      }))
    : [
        {
          title: 'Direito do Trabalho',
          desc: 'Atuação especializada em horas extras, rescisões indiretas, assédio moral e equiparação salarial.',
          icon: Briefcase
        },
        {
          title: 'Direito Imobiliário & Lotes',
          desc: 'Segurança jurídica em distratos de lotes, atraso na entrega de imóveis, usucapião e inventários.',
          icon: Building2
        },
        {
          title: 'Direito de Família & Sucessões',
          desc: 'Condução discreta e humanizada de divórcios, partilha de bens, guarda de filhos e inventários.',
          icon: Users
        },
        {
          title: 'Defesa do Consumidor',
          desc: 'Ações contra negativações indevidas no SPC/Serasa, fraudes do Pix, golpes bancários e planos de saúde.',
          icon: ShieldAlert
        },
        {
          title: 'Direito Empresarial',
          desc: 'Assessoria societária contínua, blindagem de patrimônio e defesa em associações de proteção veicular.',
          icon: Scale
        }
      ];

  const topAreas = areas.slice(0, 3);
  const bottomAreas = areas.slice(3);

  const isFemale = theme?.gender === 'female';

  const renderCard = (area, idx) => {
    const IconComponent = area.icon;
    const honorific = theme?.honorific || 'Dr(a).';
    const cleanLawyerName = lawyer?.name ? (/^dr[a]?\./i.test(lawyer.name.trim()) ? lawyer.name : `${honorific} ${lawyer.name}`) : honorific;
    const areaWhatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
      `Olá, ${cleanLawyerName}, gostaria de consultar o escritório sobre a área de "${area.title}".`
    )}`;

    return (
      <motion.div
        key={idx}
        whileHover={{ y: -6 }}
        className={`${isFemale ? 'bg-white/95 rounded-3xl border border-[#EEDCE7] hover:border-[#D8A756]/60 shadow-[0_10px_30px_rgba(44,8,34,0.04)] hover:shadow-[0_15px_35px_rgba(216,167,86,0.12)]' : 'bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10'} transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between text-left group relative h-full`}
      >
        <div>
          {/* Ícone Fino em Ouro com Fundo Suave */}
          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${isFemale ? 'rounded-2xl bg-[#D8A756]/15 border border-[#D8A756]/30 text-[#D8A756] group-hover:bg-[#D8A756] group-hover:text-[#1A0314]' : 'rounded-xl bg-amber-50 border border-amber-200/80 text-[#C6923C] group-hover:bg-[#C6923C] group-hover:text-white'} flex items-center justify-center mb-5 sm:mb-6 transition-colors duration-300 shadow-sm`}>
            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
          </div>

          <h3 className={`${isFemale ? 'font-sans font-bold text-xl sm:text-2xl text-[#2C0822]' : 'font-sans font-bold text-lg sm:text-xl text-[#0A192F]'} mb-2.5 leading-snug tracking-tight`}>
            {area.title}
          </h3>

          <p className={`text-xs sm:text-sm ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} leading-relaxed`}>
            {area.desc}
          </p>
        </div>

        <div className={`mt-6 sm:mt-8 pt-4 sm:pt-5 border-t ${isFemale ? 'border-[#F2E4ED]' : 'border-slate-100'} flex items-center justify-between`}>
          <a
            href={areaWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-xs font-semibold ${isFemale ? 'text-[#2C0822] group-hover:text-[#C89445]' : 'text-[#0A192F] group-hover:text-[#C6923C]'} transition-colors uppercase tracking-wider`}
          >
            <span>Consultar Especialidade</span>
            <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} group-hover:translate-x-1.5 transition-transform`} />
          </a>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="atuacao" className={`${isFemale ? 'bg-[#FCF9F7] text-stone-800' : 'bg-[#FAFBFD] text-slate-800'} py-16 sm:py-24 border-t ${isFemale ? 'border-[#EEDCE7]' : 'border-slate-100'} overflow-hidden w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado Elegante */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
            <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445] tracking-widest' : 'text-[#C6923C] uppercase tracking-widest'}`}>
              NOSSAS ESPECIALIDADES
            </span>
            <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
          </div>
          <h2 className={`text-2xl sm:text-4xl lg:text-[2.6rem] ${isFemale ? 'font-sans font-bold text-[#2C0822] tracking-tight' : 'font-sans font-extrabold text-[#0A192F] tracking-tight'}`}>
            Soluções Jurídicas Abrangentes
          </h2>
          <p className={`text-sm sm:text-base ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-light'} mt-3 leading-relaxed max-w-2xl mx-auto`}>
            Atendimento estratégico perante a Justiça Estadual e os Tribunais Superiores, com foco no seu respaldo patrimonial e tranquilidade familiar.
          </p>
        </div>

        {/* 1. VERSÃO CARROSSEL EXCLUSIVA PARA CELULAR (< md) */}
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
              {areas.map((area, idx) => (
                <CarouselItem key={idx} className="pl-3 basis-[88%] sm:basis-[80%]">
                  <div className="h-full py-1">
                    {renderCard(area, idx)}
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
                  aria-label="Especialidade anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => mobileApi?.scrollNext()}
                  className={`w-9 h-9 rounded-full border ${isFemale ? 'border-[#D8A756]/40 text-[#2C0822] bg-white' : 'border-slate-300 text-slate-800 bg-white'} flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all`}
                  aria-label="Próxima especialidade"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Indicadores de bolinhas (Dots interativos) */}
              <div className="flex items-center gap-1.5">
                {areas.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => mobileApi?.scrollTo(dotIdx)}
                    aria-label={`Ir para especialidade ${dotIdx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      dotIdx === currentMobileIndex
                        ? `w-6 h-2 ${isFemale ? 'bg-gradient-to-r from-[#D8A756] to-[#C79540]' : 'bg-[#C6923C]'}`
                        : `w-2 h-2 ${isFemale ? 'bg-[#EEDCE7]' : 'bg-slate-300'}`
                    }`}
                  />
                ))}
              </div>

              {/* Contador numérico de slides */}
              <span className="text-xs font-mono font-semibold text-slate-500">
                0{currentMobileIndex + 1} / 0{areas.length}
              </span>
            </div>
          </Carousel>
        </div>

        {/* 2. VERSÃO GRADE TRADICIONAL PARA TABLETS E DESKTOPS (md:) */}
        <div className="hidden md:block">
          {/* Grade Superior: 3 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {topAreas.map((area, idx) => renderCard(area, idx))}
          </div>

          {/* Grade Inferior: 2 Cards Centralizados */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 mt-8">
            {bottomAreas.map((area, idx) => renderCard(area, idx + 3))}
          </div>
        </div>

        {/* CTA Conclusivo da Seção de Especialidades */}
        <div className={`mt-12 sm:mt-14 max-w-2xl mx-auto text-center pt-8 border-t ${isFemale ? 'border-[#EEDCE7]' : 'border-slate-200'}`}>
          <p className={`text-xs sm:text-sm ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} mb-4`}>
            Não encontrou a sua demanda específica listada acima? Avaliamos seu cenário com sigilo profissional.
          </p>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={`https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
              `Olá, ${theme?.honorific || 'Dr(a).'} ${lawyer?.name}, gostaria de saber se o escritório atende à minha demanda jurídica específica.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#2D0A22] to-[#180313] hover:from-[#3B0E2D] hover:to-[#22051B] text-[#D8A756] border border-[#D8A756]/40 font-semibold shadow-lg shadow-[#2D0A22]/20' : 'rounded-xl bg-[#0A192F] hover:bg-[#132A4A] text-white font-bold shadow-md hover:shadow-xl'} text-xs uppercase tracking-wider transition-all group w-full sm:w-auto text-center`}
          >
            <MessageCircle className={`w-4 h-4 ${isFemale ? 'text-[#D8A756] fill-[#D8A756]' : 'text-emerald-400 fill-emerald-400'} group-hover:scale-110 transition-transform flex-shrink-0`} />
            <span className="truncate">Consultar Demanda Específica no WhatsApp</span>
            <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} group-hover:translate-x-1 transition-transform flex-shrink-0`} />
          </motion.a>
        </div>

      </div>
    </section>
  );
}
