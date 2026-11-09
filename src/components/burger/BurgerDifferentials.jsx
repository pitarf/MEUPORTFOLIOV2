import React from 'react';

/**
 * BurgerDifferentials - Padrão Editorial Gastronômico
 * Foco nos processos de cozinha, sem clichês gráficos.
 */
export default function BurgerDifferentials({ data }) {
  const steps = [
    {
      num: '01',
      title: 'Moagem Diária',
      desc: 'Trabalhamos exclusivamente com dianteiro e costela bovina fresca. A carne é limpa, cortada e moída no mesmo dia em que vai para a chapa.'
    },
    {
      num: '02',
      title: 'Pão de Fermentação Natural',
      desc: 'Massa brioche desenvolvida em parceria com padaria artesanal. 36 horas de fermentação lenta para garantir leveza e selagem perfeita na manteiga.'
    },
    {
      num: '03',
      title: 'Crosta na Chapa de Aço a 260°C',
      desc: 'Técnica de prensagem rápida para criar a crosta crocante da Reação de Maillard, retendo todos os sucos da carne no interior do burguer.'
    },
    {
      num: '04',
      title: 'Queijo Cheddar Inglês Legitimo',
      desc: 'Nada de fatias plásticas processadas. Usamos queijo de verdade com derretimento controlado em abafador a vapor sobre a carne quente.'
    },
    {
      num: '05',
      title: 'Molhos & Picles da Casa',
      desc: 'Maionese verde emulsionada com ervas frescas, picles crocante de pepino japonês com sementes de mostarda e cebola caramelizada em fogo baixo.'
    },
    {
      num: '06',
      title: 'Embalagem Térmica Respirável',
      desc: 'Caixas de papel kraft ondulado com respiros estratégicos. O vapor sai para o pão não amolecer, mas o calor permanece até a sua mesa.'
    }
  ];

  return (
    <section id="diferenciais" className="bg-[#12100E] py-16 sm:py-24 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            Processo de Cozinha
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            O que faz a diferença na primeira mordida.
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed mt-3">
            Hambúrguer artesanal não é segredo mágico: é rigor no corte, precisão na temperatura da chapa e ingredientes reais.
          </p>
        </div>

        {/* Grade de Processos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#171513] border border-stone-800 text-left flex flex-col justify-between space-y-4 hover:border-stone-700 transition-colors"
            >
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block mb-2">
                  {item.num}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mt-2">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
