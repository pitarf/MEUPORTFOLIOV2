import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';

/**
 * Seção de Depoimentos & Avaliações Google
 * Exibe avaliações verificadas de clientes com notas 5 estrelas e comentários detalhados
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopTestimonials({ data }) {
  const testimonials = data.testimonials || [];

  return (
    <section id="depoimentos" className="py-24 bg-zinc-900/40 relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Avaliações Verificadas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-4">
            A Opinião de Quem Confia no Nosso Padrão
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Consistência, respeito ao seu tempo e precisão técnica. Veja o que nossos clientes dizem no Google Meu Negócio.
          </p>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="p-7 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-colors duration-200"
            >
              <div>
                {/* Estrelas Google & Badge Verificado */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verificado no Google</span>
                  </div>
                </div>

                {/* Comentário do Cliente */}
                <p className="text-sm text-zinc-300 leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Informações do Autor */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-11 h-11 rounded-full object-cover border border-amber-500/30"
                  loading="lazy"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {review.author}
                  </h3>
                  <div className="text-[11px] text-zinc-400">
                    {review.role} • <span className="text-zinc-400">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Card Resumo do Google Maps */}
        <div className="mt-14 max-w-xl mx-auto p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-extrabold text-lg">
              {data.stats?.rating || '4.9'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">Classificação Excelente</div>
              <div className="text-xs text-zinc-400">Baseado em {data.stats?.reviewsCount || 480} avaliações reais no Google</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
