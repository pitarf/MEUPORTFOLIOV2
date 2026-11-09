import React from 'react';
import { Star, Users, Award, ShieldCheck } from 'lucide-react';

/**
 * Faixa de Indicadores de Confiança (Trust Bar)
 * Apresenta métricas de autoridade e diferenciais exclusivos com estilo Dark Luxury
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopTrustBar({ data }) {
  const highlights = data.stats?.highlights || [
    {
      title: '4.9 no Google',
      description: 'Mais de 480 avaliações de clientes verificados'
    },
    {
      title: '+3.800 Homens Atendidos',
      description: 'Padrão consistente de satisfação e fidelidade'
    },
    {
      title: '8 Anos de Excelência',
      description: 'Barbeiros premiados e formados em escolas clássicas'
    },
    {
      title: 'Garagem & Chopp Cortesia',
      description: 'Vaga privativa e cerveja artesanal na sua chegada'
    }
  ];

  const icons = [Star, Users, Award, ShieldCheck];

  return (
    <section className="bg-zinc-900/90 border-y border-zinc-800/90 py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/70 hover:border-amber-500/40 transition-colors duration-200"
              >
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
