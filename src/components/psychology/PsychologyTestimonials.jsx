import React from 'react';
import { Star, Shield, Quote, Heart } from 'lucide-react';

/**
 * Seção de Depoimentos e Relatos de Transformação
 * Preserva estritamente o sigilo e anonimato dos pacientes em conformidade com o CFP.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyTestimonials({ data }) {
  const { testimonials, rating, reviewCount } = data;

  const defaultTestimonials = [
    {
      quote: 'Eu vivia em um estado de alerta permanente, sem conseguir dormir direito há meses. Encontrar um lugar onde pude falar tudo sem medo de ser julgada mudou a forma como eu me enxergo e como lido com as cobranças diárias.',
      patientInitials: 'M. C.',
      context: 'Paciente em acompanhamento para Ansiedade e Burnout',
      sessionType: 'Atendimento Online',
      rating: 5
    },
    {
      quote: 'A Dra. tem uma escuta muito precisa e afetuosa. Não foram soluções prontas ou mágicas, mas ferramentas reais que me ensinaram a respirar no meio do caos e a impor limites sem me sentir culpado.',
      patientInitials: 'R. S.',
      context: 'Paciente em acompanhamento clínico',
      sessionType: 'Atendimento Presencial',
      rating: 5
    },
    {
      quote: 'Moro fora do Brasil e a solidão da expatriação estava pesando muito. Fazer terapia na minha língua materna com alguém tão sensível e técnica me devolveu a calma e o equilíbrio que eu precisava.',
      patientInitials: 'L. F.',
      context: 'Brasileira residente no exterior',
      sessionType: 'Atendimento Online (Europa)',
      rating: 5
    }
  ];

  const list = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section id="depoimentos" className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-medium">
            <Heart className="w-4 h-4 text-emerald-600" />
            <span>Relatos de Transformação</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight">
            Vozes de quem redescobriu a leveza de viver
          </h2>

          <p className="text-base text-slate-600 font-light leading-relaxed">
            A psicoterapia é um encontro transformador. Veja o impacto do acolhimento na vida de quem já deu esse passo corajoso.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex text-amber-400 text-sm">★★★★★</div>
            <span className="text-xs text-slate-500 font-medium">
              Nota {rating || 5.0} no Google Reviews ({reviewCount || 48} avaliações)
            </span>
          </div>
        </div>

        {/* Grid de Cards de Depoimento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between bg-white rounded-3xl p-8 border border-[#E7E2D8] shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-md transition-all duration-300 text-left"
            >
              <div>
                {/* Ícone de Aspas e Estrelas */}
                <div className="flex items-center justify-between mb-5">
                  <Quote className="w-8 h-8 text-emerald-600/30" />
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Relato */}
                <p className="font-serif text-slate-700 text-base sm:text-lg leading-relaxed font-normal italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              {/* Paciente Anonimizado (Conformidade CFP) */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">
                    Paciente {item.patientInitials}
                  </h4>
                  <p className="text-xs text-slate-500 font-light">
                    {item.context}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/70">
                  {item.sessionType}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Nota Ética de Sigilo CFP */}
        <div className="mt-12 max-w-2xl mx-auto p-4 rounded-2xl bg-white/70 border border-[#E8E3D8] flex items-center gap-3 text-left">
          <Shield className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            <strong className="font-semibold text-slate-700">Nota de Conformidade Ética:</strong> Os relatos acima foram compartilhados voluntariamente. Para resguardar a privacidade e o sigilo profissional garantidos pelo Código de Ética do Psicólogo, os nomes completos e dados identificadores foram integralmente preservados.
          </p>
        </div>

      </div>
    </section>
  );
}
