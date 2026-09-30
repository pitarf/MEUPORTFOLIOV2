import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';

/**
 * Seção de Depoimentos no Estilo Exato da Summit Financial (Imagem de Referência)
 * 3 cards brancos limpos com aspas douradas, depoimento contextualizado por nicho e cidade do advogado.
 */
export default function LegalReviews({ lawyer, nicheInfo }) {
  const lawyerShortName = lawyer?.name || 'O escritório';
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

  return (
    <section id="depoimentos" className="bg-white py-20 sm:py-24 text-slate-800 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-[#C6923C]" />
            <span className="text-xs font-semibold text-[#C6923C] uppercase tracking-widest">
              DEPOIMENTOS DOS CLIENTES
            </span>
            <span className="w-8 h-[2px] bg-[#C6923C]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold text-[#0A192F] tracking-tight">
            A Confiança de Quem Teve Seus Direitos Defendidos
          </h2>
          <p className="text-base text-slate-600 mt-3 font-normal leading-relaxed">
            A satisfação dos nossos clientes é o maior testemunho do nosso rigor técnico e comprometimento ético.
          </p>
        </div>

        {/* Grade de 3 Cards de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Aspas em Ouro */}
                <span className="text-4xl font-serif font-bold text-[#C6923C] block leading-none mb-3">
                  “
                </span>

                <p className="text-sm text-slate-600 leading-relaxed font-normal italic">
                  {r.quote}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#0A192F] block">
                    — {r.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {r.city}
                  </span>
                </div>

                {/* 5 Estrelas Douradas */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C6923C] text-[#C6923C]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bloco de CTA Pós-Depoimentos */}
        <div className="mt-14 max-w-2xl mx-auto text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-5 w-full bg-[#FAFBFD] border border-amber-300/70 rounded-2xl p-6 sm:p-7 shadow-md">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-[#C6923C] flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#0A192F] block leading-tight">
                  Deseja a mesma tranquilidade para o seu caso?
                </span>
                <span className="text-xs text-slate-500 block mt-0.5 font-normal">
                  Inicie sua consulta estratégica com o Dr(a). {lawyer?.name || 'nosso escritório'}.
                </span>
              </div>
            </div>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
                `Olá, Dr(a). ${lawyer?.name}, vi os depoimentos de clientes no site e gostaria de agendar uma consulta para o meu caso.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-emerald-500/25 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 group"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span>Consultar no WhatsApp</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>

      </div>
    </section>
  );
}
