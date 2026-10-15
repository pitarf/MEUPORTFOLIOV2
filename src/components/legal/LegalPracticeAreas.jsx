import React, { useEffect, useRef } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  ShieldAlert,
  Scale,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';

/**
 * Seção de Especialidades Jurídicas com Carrossel Vertical de Empilhamento
 * Arquitetura Stacking Cards (Sticky Scroll) a 60 FPS:
 * 1. Cabeçalho da seção permanece fixo (sticky) com efeito blur abaixo da navbar
 * 2. Cartões sobem verticalmente e se empilham com offsets escalonados
 * 3. Interpolação óptica leve em Vanilla JS (redução de escala e escurecimento tátil)
 * 4. Sem dependências pesadas, sem vácuos em branco e 100% responsivo
 */
export default function LegalPracticeAreas({ lawyer, nicheInfo, theme }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const isFemale = theme?.gender === 'female';
  const honorific = theme?.honorific || 'Dr(a).';
  const cleanLawyerName = lawyer?.name
    ? (/^dr[a]?\./i.test(lawyer.name.trim()) ? lawyer.name : `${honorific} ${lawyer.name}`)
    : honorific;

  // Ícones padrão para as especialidades
  const defaultIcons = [Briefcase, Building2, Users, ShieldAlert, Scale];

  // Badges e garantias técnicas para cada card
  const defaultBadges = [
    { tag: 'Conformidade & Contratos', compliance: '100% Conforme OAB' },
    { tag: 'Segurança Patrimonial', compliance: 'Respaldo Registral' },
    { tag: 'Compliance Preventivo', compliance: 'Mitigação de Riscos' },
    { tag: 'Defesa Rápida & Danos', compliance: 'Reparação Integral' },
    { tag: 'Governança & Sociedades', compliance: 'Blindagem Estratégica' }
  ];

  // Lista de especialidades dinâmicas do nicho ou padrão
  const areas = (nicheInfo?.practiceAreas && nicheInfo.practiceAreas.length > 0)
    ? nicheInfo.practiceAreas.map((pa, idx) => ({
        title: pa.title,
        desc: pa.summary || pa.desc || 'Atuação técnica focada em defender seus direitos com agilidade e respaldo legal.',
        icon: defaultIcons[idx % defaultIcons.length],
        badge: defaultBadges[idx % defaultBadges.length].tag,
        compliance: defaultBadges[idx % defaultBadges.length].compliance
      }))
    : [
        {
          title: 'Direito Civil & Contratos',
          desc: 'Elaboração e revisão minuciosa de instrumentos contratuais, recuperação de créditos, indenizações por perdas e danos e consultoria preventiva.',
          icon: Briefcase,
          badge: 'Conformidade & Contratos',
          compliance: '100% Conforme OAB'
        },
        {
          title: 'Direito Imobiliário & Sucessões',
          desc: 'Segurança absoluta para aquisição, locação e regularização de imóveis, além de inventários ágeis e planejamento sucessório.',
          icon: Building2,
          badge: 'Segurança Patrimonial',
          compliance: 'Respaldo Registral'
        },
        {
          title: 'Direito Trabalhista Estratégico',
          desc: 'Atuação incisiva na defesa de direitos do trabalhador e assessoria preventiva de compliance para empresas evitarem litígios.',
          icon: Users,
          badge: 'Compliance Trabalhista',
          compliance: 'Mitigação de Riscos'
        },
        {
          title: 'Direito do Consumidor Especializado',
          desc: 'Combate rigoroso a práticas abusivas cometidas por grandes corporações, concessionárias, bancos e companhias aéreas.',
          icon: ShieldAlert,
          badge: 'Defesa do Consumidor',
          compliance: 'Reparação Integral'
        },
        {
          title: 'Direito Empresarial & Contratos Societários',
          desc: 'Assessoria jurídica estratégica para empresas, blindagem do patrimônio dos sócios, elaboração de acordos societários e mitigação de riscos contratuais.',
          icon: Scale,
          badge: 'Governança & Sociedades',
          compliance: 'Blindagem Estratégica'
        }
      ];

  // Interpolação óptica nativa a 60 FPS com requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const updateCards = () => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0) return;

      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          if (!nextCard) return;

          const currentRect = card.getBoundingClientRect();
          const nextRect = nextCard.getBoundingClientRect();

          const overlap = currentRect.bottom - nextRect.top;
          const totalHeight = currentRect.height;

          if (overlap > 0) {
            const progress = Math.min(Math.max(overlap / (totalHeight * 0.85), 0), 1);
            const scale = 1 - (progress * 0.05);
            const brightness = 1 - (progress * 0.22);
            const translateY = progress * -4;

            card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            card.style.filter = `brightness(${brightness})`;
          } else {
            card.style.transform = 'scale(1) translateY(0px)';
            card.style.filter = 'brightness(1)';
          }
        } else {
          card.style.transform = 'scale(1) translateY(0px)';
          card.style.filter = 'brightness(1)';
        }
      });

      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateCards);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    updateCards();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [areas.length]);

  return (
    <section
      id="atuacao"
      ref={containerRef}
      className={`py-12 sm:py-16 lg:py-20 ${isFemale ? 'bg-[#FCF9F7] text-stone-800' : 'bg-[#FAFBFD] text-slate-800'} relative w-full overflow-x-clip`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. CABEÇALHO STICKY DA SEÇÃO (Fixa abaixo da Navbar com Blur) */}
        <div
          className={`services-sticky-header rounded-2xl px-5 sm:px-8 py-4 sm:py-5 mb-6 sm:mb-8 border shadow-sm ${
            isFemale
              ? 'bg-[#FCF9F7]/95 border-[#EEDCE7] text-[#2C0822]'
              : 'bg-[#FAFBFD]/95 border-slate-200 text-[#0A192F]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-6 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
                <span
                  className={`text-[11px] font-semibold tracking-[0.25em] uppercase ${
                    isFemale ? 'text-[#C89445]' : 'text-[#C6923C]'
                  }`}
                >
                  ÁREAS DE ATUAÇÃO
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold tracking-tight ${
                  isFemale ? 'text-[#2C0822]' : 'text-[#0A192F]'
                }`}
              >
                Nossos Serviços Especializados
              </h2>
            </div>
            <p
              className={`text-xs sm:text-sm max-w-md ${
                isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'
              } leading-relaxed`}
            >
              Soluções completas com condução técnica rigorosa, sigilo absoluto e segurança jurídica perante todos os tribunais.
            </p>
          </div>
        </div>

        {/* 2. CONTAINER DOS STACKING CARDS (Com offsets matematicamente escalonados) */}
        <div className="stacking-container relative">
          {areas.map((area, idx) => {
            const IconComponent = area.icon;
            const cardNum = `0${idx + 1}.`;

            // WhatsApp link contextualizado
            const areaWhatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
              `Olá, ${cleanLawyerName}, gostaria de consultar o escritório sobre a área de "${area.title}".`
            )}`;

            // Fórmulas de top escalonado por breakpoint (Regra 2)
            // Mobile (<640px): base 150px + idx * 16px
            // Tablet (640-1023px): base 195px + idx * 18px
            // Desktop (>=1024px): base 245px + idx * 20px
            const mobileTop = 150 + idx * 16;
            const tabletTop = 195 + idx * 18;
            const desktopTop = 245 + idx * 20;

            // Z-Index crescente (Regra 4)
            const zIndexVal = 10 + idx * 5;

            // Paleta nobre e refinada para alternância editorial dos cards
            const isDarkCard = idx % 2 === 0;

            // Estilos condicionais do Card
            let cardBgClasses = '';
            let cardBorderClasses = '';
            let cardTitleClasses = '';
            let cardDescClasses = '';
            let cardBadgeBoxClasses = '';
            let cardLinkClasses = '';

            if (isFemale) {
              if (isDarkCard) {
                // Card Vinho Nobre Escuro
                cardBgClasses = 'bg-[#22041B] text-white shadow-[0_20px_50px_rgba(34,4,27,0.35)]';
                cardBorderClasses = 'border-[#5A1448]';
                cardTitleClasses = 'text-white';
                cardDescClasses = 'text-stone-200/90';
                cardBadgeBoxClasses = 'bg-white/10 border-white/15 text-white';
                cardLinkClasses = 'text-[#D8A756] hover:text-white';
              } else {
                // Card Marfim Nobre Claro
                cardBgClasses = 'bg-white text-stone-800 shadow-[0_20px_50px_rgba(44,8,34,0.08)]';
                cardBorderClasses = 'border-[#EEDCE7] hover:border-[#D8A756]';
                cardTitleClasses = 'text-[#2C0822]';
                cardDescClasses = 'text-stone-600';
                cardBadgeBoxClasses = 'bg-[#FCF9F7] border-[#EEDCE7] text-[#2C0822]';
                cardLinkClasses = 'text-[#2C0822] hover:text-[#C89445]';
              }
            } else {
              if (isDarkCard) {
                // Card Navy Profundo Escuro
                cardBgClasses = 'bg-[#0A192F] text-white shadow-[0_20px_50px_rgba(10,25,47,0.38)]';
                cardBorderClasses = 'border-[#1E3A5F]';
                cardTitleClasses = 'text-white';
                cardDescClasses = 'text-slate-200/90';
                cardBadgeBoxClasses = 'bg-white/10 border-white/15 text-white';
                cardLinkClasses = 'text-[#C6923C] hover:text-amber-300';
              } else {
                // Card Branco Perolado Claro
                cardBgClasses = 'bg-white text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.08)]';
                cardBorderClasses = 'border-slate-200 hover:border-[#C6923C]';
                cardTitleClasses = 'text-[#0A192F]';
                cardDescClasses = 'text-slate-600';
                cardBadgeBoxClasses = 'bg-slate-50 border-slate-200 text-[#0A192F]';
                cardLinkClasses = 'text-[#0A192F] hover:text-[#C6923C]';
              }
            }

            return (
              <div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                style={{
                  top: `var(--card-top-${idx})`,
                  zIndex: zIndexVal
                }}
                className={`stack-card sticky w-full rounded-3xl ${cardBgClasses} p-6 sm:p-9 lg:p-10 border ${cardBorderClasses}`}
              >
                {/* Variáveis CSS embutidas para cálculo responsivo do top */}
                <style>{`
                  :root {
                    --card-top-${idx}: ${mobileTop}px;
                  }
                  @media (min-width: 640px) {
                    :root {
                      --card-top-${idx}: ${tabletTop}px;
                    }
                  }
                  @media (min-width: 1024px) {
                    :root {
                      --card-top-${idx}: ${desktopTop}px;
                    }
                  }
                `}</style>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                  
                  {/* Coluna Principal: Conteúdo da Especialidade */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xl sm:text-2xl font-mono font-bold ${isDarkCard ? 'text-[#D8A756]' : (isFemale ? 'text-[#C89445]' : 'text-[#C6923C]')}`}>
                        {cardNum}
                      </span>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                        isDarkCard
                          ? 'bg-white/10 text-[#D8A756] border border-white/10'
                          : (isFemale ? 'bg-[#D8A756]/15 text-[#D8A756] border border-[#D8A756]/30' : 'bg-amber-50 text-[#C6923C] border border-amber-200/80')
                      }`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isDarkCard ? 'bg-white/10 text-white/90' : (isFemale ? 'bg-[#F2E4ED] text-[#2C0822]' : 'bg-slate-100 text-slate-700')
                      }`}>
                        {area.badge}
                      </span>
                    </div>

                    <h3 className={`text-xl sm:text-2xl lg:text-3xl font-sans font-bold ${cardTitleClasses} leading-tight tracking-tight`}>
                      {area.title}
                    </h3>

                    <p className={`text-xs sm:text-sm lg:text-base font-light ${cardDescClasses} leading-relaxed`}>
                      {area.desc}
                    </p>

                    <div className="pt-2">
                      <a
                        href={areaWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider ${cardLinkClasses} transition-all group`}
                      >
                        <span>Consultar Especialidade</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  {/* Coluna Lateral: Box de Conformidade e Ação Rápida */}
                  <div className={`lg:col-span-5 rounded-2xl p-5 sm:p-6 border ${cardBadgeBoxClasses} space-y-4`}>
                    <div className="flex items-center justify-between pb-3 border-b border-current/10">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${isDarkCard ? 'text-[#D8A756]' : (isFemale ? 'text-[#C89445]' : 'text-[#C6923C]')}`} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          {area.compliance}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono opacity-80">
                        Atendimento Imediato
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs opacity-90">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkCard ? 'text-[#D8A756]' : 'text-emerald-500'}`} />
                        <span>Análise preliminar em até 24 horas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkCard ? 'text-[#D8A756]' : 'text-emerald-500'}`} />
                        <span>Sigilo profissional amparado pelo Estatuto da OAB</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkCard ? 'text-[#D8A756]' : 'text-emerald-500'}`} />
                        <span>Atuação contenciosa e preventiva estratégica</span>
                      </li>
                    </ul>

                    <a
                      href={areaWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                        isDarkCard
                          ? (isFemale ? 'bg-gradient-to-r from-[#D8A756] to-[#C79540] text-[#1A0314] hover:opacity-95' : 'bg-gradient-to-r from-[#C6923C] to-[#B58230] text-slate-950 hover:opacity-95')
                          : (isFemale ? 'bg-[#2C0822] text-[#D8A756] hover:bg-[#3D0A2F]' : 'bg-[#0A192F] text-white hover:bg-[#132A4A]')
                      }`}
                    >
                      {/* Logotipo Oficial do WhatsApp no Card */}
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Agendar Análise no WhatsApp</span>
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* 3. CTA CONCLUSIVO DA SEÇÃO (Imediatamente após os cards, sem abismos em branco) */}
        <div className={`mt-10 sm:mt-12 max-w-2xl mx-auto text-center pt-8 border-t ${isFemale ? 'border-[#EEDCE7]' : 'border-slate-200'}`}>
          <p className={`text-xs sm:text-sm ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} mb-4`}>
            Não encontrou a sua demanda específica listada acima? Avaliamos seu cenário com sigilo profissional.
          </p>
          <a
            href={`https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
              `Olá, ${honorific} ${lawyer?.name}, gostaria de saber se o escritório atende à minha demanda jurídica específica.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 ${
              isFemale
                ? 'rounded-full bg-gradient-to-r from-[#2D0A22] to-[#180313] hover:from-[#3B0E2D] hover:to-[#22051B] text-[#D8A756] border border-[#D8A756]/40 font-semibold shadow-lg shadow-[#2D0A22]/20'
                : 'rounded-xl bg-[#0A192F] hover:bg-[#132A4A] text-white font-bold shadow-md hover:shadow-xl'
            } text-xs uppercase tracking-wider transition-all group w-full sm:w-auto text-center`}
          >
            {/* Logotipo Oficial do WhatsApp no CTA Conclusivo */}
            <WhatsAppIcon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="truncate">Consultar Demanda Específica no WhatsApp</span>
            <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} group-hover:translate-x-1 transition-transform flex-shrink-0`} />
          </a>
        </div>

      </div>
    </section>
  );
}
