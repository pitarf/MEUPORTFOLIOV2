import React from 'react';
import { MapPin, Clock, Bike, CreditCard } from 'lucide-react';

/**
 * BurgerLocation - Informações de Balcão e Raio de Entrega
 * Layout limpo, horários organizados e mapa de referência.
 */
export default function BurgerLocation({ data }) {
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    `${data.location.address}, ${data.location.neighborhood}, ${data.location.city} - ${data.location.state}`
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="localizacao" className="bg-[#0C0A09] py-16 sm:py-24 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            Salão & Delivery
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            Coma no balcão ou receba em casa.
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed mt-3">
            Mesas internas com chopp artesanal na torneira, ou entrega rápida com rotas monitoradas para o pão chegar crocante.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Informações Práticas (5 cols) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* Endereço */}
            <div className="p-6 rounded-xl bg-[#12100E] border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Endereço Físico</span>
              </div>
              <h3 className="text-base font-bold text-white">
                {data.location.address}
              </h3>
              <p className="text-xs text-stone-400">
                {data.location.neighborhood} • {data.location.city} - {data.location.state}
              </p>
              {data.location.referencePoint && (
                <p className="text-[11px] text-stone-500 pt-1">
                  Ponto de ref.: {data.location.referencePoint}
                </p>
              )}
            </div>

            {/* Horários */}
            <div className="p-6 rounded-xl bg-[#12100E] border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Horários de Funcionamento</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-stone-800/80 pb-2">
                  <span className="text-stone-400">Salão & Balcão:</span>
                  <span className="font-mono font-medium text-white">{data.schedules.openHours}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800/80 pb-2">
                  <span className="text-stone-400">Delivery Noturno:</span>
                  <span className="font-mono font-medium text-amber-400">{data.schedules.deliveryHours}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-400">Folga da Cozinha:</span>
                  <span className="font-mono text-stone-400">{data.schedules.closedDays}</span>
                </div>
              </div>
            </div>

            {/* Bairros de Entrega */}
            <div className="p-6 rounded-xl bg-[#12100E] border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider">
                <Bike className="w-4 h-4" />
                <span>Área de Entrega Rápida</span>
              </div>
              <p className="text-xs text-stone-400">
                Tempo médio de entrega: <strong className="text-white">{data.avgDeliveryTime}</strong>
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.deliveryNeighborhoods.map((nb, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300"
                  >
                    {nb}
                  </span>
                ))}
              </div>
            </div>

            {/* Pagamentos */}
            <div className="p-4 rounded-xl bg-[#12100E] border border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Formas de Pagamento</span>
              </span>
              <span className="font-mono text-stone-300">
                Pix • Cartão • VR/VA
              </span>
            </div>

          </div>

          {/* Mapa do Google (7 cols) */}
          <div className="lg:col-span-7 h-full min-h-[420px] rounded-xl overflow-hidden border border-stone-800 bg-[#12100E]">
            <iframe
              title={`Mapa de localização de ${data.name}`}
              src={mapEmbedUrl}
              className="w-full h-full min-h-[420px] border-0 grayscale invert opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
