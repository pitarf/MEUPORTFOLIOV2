import React from 'react';
import { MapPin, Clock, Navigation, Check, ShieldCheck, Car, Wifi, Beer, Coffee } from 'lucide-react';
import { buildMapEmbedUrl } from '@/utils/barbershopProspectUtils';

/**
 * Seção de Localização, Horários e Mapa Interativo
 * Informações completas de endereço, horários de funcionamento, comodidades da barbearia
 * e link para abrir a rota diretamente no Waze ou Google Maps.
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopLocation({ data }) {
  const address = data.location?.address || 'Av. das Américas, 3500';
  const city = data.location?.city || 'Rio de Janeiro';
  const neighborhood = data.location?.neighborhood || 'Barra da Tijuca';
  const mapEmbedUrl = buildMapEmbedUrl(address, `${neighborhood} ${city}`);
  const mapsRouteUrl = data.location?.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${neighborhood}, ${city}`)}`;

  const schedule = data.hours?.schedule || [
    { day: 'Segunda a Quarta', time: '09:00 - 20:00' },
    { day: 'Quinta e Sexta', time: '09:00 - 21:00' },
    { day: 'Sábado', time: '08:30 - 20:00' },
    { day: 'Domingo', time: 'Fechado' }
  ];

  const amenities = [
    { icon: Car, label: 'Estacionamento Privativo Gratuito' },
    { icon: Beer, label: 'Chopp Artesanal On Tap' },
    { icon: Coffee, label: 'Café Espresso Gourmet Moído na Hora' },
    { icon: Wifi, label: 'Wi-Fi de Alta Velocidade & Climatização' }
  ];

  return (
    <section id="localizacao" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Localização & Horários</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-4">
            Venha Viver a Experiência
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Localização privilegiada com fácil acesso, segurança e estacionamento cortesia para você relaxar sem preocupações.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card de Informações e Horários */}
          <div className="lg:col-span-5 flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div>
              {/* Endereço */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Nosso Endereço
                  </h3>
                  <p className="text-sm text-zinc-300 font-medium">
                    {address}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {neighborhood} • {city} - {data.location?.state || 'RJ'}
                  </p>
                  {data.location?.reference && (
                    <p className="text-xs text-amber-400/90 mt-2 font-medium">
                      Ponto de referência: {data.location.reference}
                    </p>
                  )}
                </div>
              </div>

              {/* Horários de Funcionamento */}
              <div className="pt-6 border-t border-zinc-800/80 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-4">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Horário de Atendimento</span>
                </div>
                <div className="space-y-2.5">
                  {schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/50"
                    >
                      <span className="text-zinc-300 font-medium">{item.day}</span>
                      <span className="text-amber-400 font-bold">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comodidades Inclusas */}
              <div className="pt-6 border-t border-zinc-800/80 mb-6">
                <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-3">
                  Comodidades para o Seu Conforto
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {amenities.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs text-zinc-300">
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Botão de Traçar Rota no Waze / Maps */}
            <a
              href={mapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-950/20 transition-all duration-200 mt-4"
            >
              <Navigation className="w-4 h-4" />
              <span>Traçar Rota no Google Maps / Waze</span>
            </a>
          </div>

          {/* Iframe Interativo do Google Maps */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl min-h-[380px] lg:min-h-full">
            <iframe
              title={`Mapa de Localização - ${data.name}`}
              src={mapEmbedUrl}
              className="w-full h-full min-h-[380px] lg:min-h-[500px] border-0 filter grayscale contrast-125 hover:filter-none transition-all duration-500"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
