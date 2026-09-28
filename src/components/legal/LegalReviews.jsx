import React from 'react';
import { Star, Quote } from 'lucide-react';

/**
 * Seção de Depoimentos no Estilo Exato da Summit Financial (Imagem de Referência)
 * 3 cards brancos limpos com aspas douradas, depoimento, identificação do cliente e 5 estrelas.
 */
export default function LegalReviews({ lawyer }) {
  const reviews = [
    {
      quote:
        'O Dr. Jorge Santos e sua equipe conduziram meu caso com extrema rapidez e profissionalismo. Consegui a reversão da negativação indevida e a indenização em tempo recorde.',
      name: 'Carlos Eduardo M.',
      city: 'Aracaju - SE'
    },
    {
      quote:
        'Excelente atendimento no processo de distrato imobiliário do meu lote. Fui informado de cada andamento pelo WhatsApp com total transparência e segurança jurídica.',
      name: 'Mariana Siqueira',
      city: 'Nossa Senhora do Socorro - SE'
    },
    {
      quote:
        'A clareza técnica e a honestidade do Dr. Jorge me deram total tranquilidade durante uma ação trabalhista complexa. Recomendo o escritório a todos que buscam advogados sérios.',
      name: 'Roberto Tavares',
      city: 'Lagarto - SE'
    }
  ];

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

      </div>
    </section>
  );
}
