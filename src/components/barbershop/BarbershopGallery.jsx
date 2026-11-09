import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

/**
 * Galeria Fotográfica do Ambiente ("O Nosso Refúgio")
 * Apresenta o espaço clássico, cadeiras de couro legítimo, chopeira e acabamentos de luxo
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopGallery({ data }) {
  const gallery = data.gallery || [];

  return (
    <section id="espaco" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>O Nosso Espaço</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-4">
            Um Verdadeiro Refúgio Masculino
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Desenvolvido para oferecer o máximo de conforto, privacidade e relaxamento. Poltronas originais de barbeiro, iluminação vintage e climatização de ponta.
          </p>
        </div>

        {/* Grid de Imagens com Estética Dark Luxury */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 shadow-xl"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                loading="lazy"
              />

              {/* Gradiente Escuro de Sobreposição */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Informações da Foto */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white font-serif">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
