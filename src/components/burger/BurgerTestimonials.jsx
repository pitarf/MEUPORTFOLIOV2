import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

/**
 * BurgerTestimonials - Avaliações Verificadas Anti-Slop
 * Prova social autêntica, tipografia elegante e sem excessos visuais.
 */
export default function BurgerTestimonials({ data }) {
  return (
    <section className="bg-[#12100E] py-16 sm:py-24 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            Prova Social
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            Nota {data.rating} no Google Maps ({data.reviewsCount} avaliações).
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed mt-3">
            Comentários reais de clientes que frequentam o balcão ou pedem pelo delivery todo fim de semana.
          </p>
        </div>

        {/* Grade de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-[#171513] rounded-xl p-6 sm:p-7 border border-stone-800 flex flex-col justify-between text-left space-y-6 hover:border-stone-700 transition-colors"
            >
              <div>
                {/* Estrelas */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comentário */}
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed italic">
                  "{test.comment}"
                </p>
              </div>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-800/80">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {test.name}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 block">
                    {test.role}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
