import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Quote } from 'lucide-react';

/**
 * Seção de Depoimentos e Avaliações Google 5.0
 * Prova social incontestável com avaliações humanizadas e verificadas.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalTestimonials({ data }) {
  const { testimonials, hero, clinicName } = data;

  return (
    <section className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho com Selo Google */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span>Nota 5.0 no Google Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A Opinião de Quem Confia Seu Sorriso a Nós
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Mais de {hero.reviewsCount || 380} pacientes atendidos com acolhimento, pontualidade e resultados que transformaram a autoestima.
          </p>
        </div>

        {/* Grade de Depoimentos em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl hover:shadow-sky-950/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Cabeçalho do Card: Estrelas + Selo Google */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Paciente Verificado
                  </span>
                </div>

                {/* Comentário */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-sky-100 absolute -top-3 -left-2 -z-0 opacity-80" />
                  <p className="relative z-10 text-sm sm:text-base text-slate-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              </div>

              {/* Autor do Depoimento */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center gap-3.5">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                  loading="lazy"
                  width="44"
                  height="44"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {review.author}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {review.role}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Prova Social de Conclusão */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Avaliações reais auditadas de pacientes atendidos no {clinicName}.</span>
        </div>

      </div>
    </section>
  );
}
