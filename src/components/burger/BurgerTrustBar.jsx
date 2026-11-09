import React from 'react';
import { Award, Star, Clock, PackageCheck, ShieldCheck } from 'lucide-react';

/**
 * BurgerTrustBar - Barra de Autoridade & Operação Real
 * Design contemporâneo, métricas sólidas, tipografia alinhada sem caixas infantis.
 */
export default function BurgerTrustBar({ data }) {
  const highlights = [
    {
      icon: Award,
      title: data.ordersCount || '+18.000 burgers',
      subtitle: 'Entregues no ponto da casa'
    },
    {
      icon: Star,
      title: `${data.rating || '4.9'} no Google`,
      subtitle: `Mais de ${data.reviewsCount || '500'} avaliações reais`
    },
    {
      icon: Clock,
      title: `${data.avgDeliveryTime || '35 min'} de média`,
      subtitle: 'Entrega com rota própria direta'
    },
    {
      icon: PackageCheck,
      title: 'Embalagem Térmica',
      subtitle: 'Mantém crocância e temperatura'
    },
    {
      icon: ShieldCheck,
      title: 'Pedido Direto',
      subtitle: 'Sem intermediários nem taxas de app'
    }
  ];

  return (
    <section className="bg-[#12100E] border-y border-stone-800 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-800/80">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-start text-left ${
                  idx > 0 ? 'pt-4 sm:pt-0 sm:pl-5' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold text-white text-sm sm:text-base tracking-tight font-sans">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-normal">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
