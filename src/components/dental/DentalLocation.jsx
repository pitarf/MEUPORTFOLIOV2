import React from 'react';
import { 
  MapPin, 
  Clock, 
  Car, 
  Accessibility, 
  Coffee, 
  Wifi, 
  ExternalLink, 
  Phone,
  Sparkles
} from 'lucide-react';

/**
 * Seção de Localização, Acessibilidade e Estrutura da Clínica Odontológica
 * Apresenta mapa, horários e detalhes de conveniência para os pacientes.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalLocation({ data }) {
  const { location, contact, clinicName } = data;

  const amenities = [
    { icon: <Car className="w-4 h-4 text-sky-600" />, text: location.parking || 'Estacionamento conveniado com manobrista' },
    { icon: <Accessibility className="w-4 h-4 text-sky-600" />, text: location.accessibility || 'Acesso 100% adaptado com elevadores' },
    { icon: <Wifi className="w-4 h-4 text-sky-600" />, text: 'Wi-Fi de alta velocidade para pacientes' },
    { icon: <Coffee className="w-4 h-4 text-sky-600" />, text: 'Espaço lounge com café e água mineral' }
  ];

  return (
    <section id="clinica" className="py-20 sm:py-28 bg-gradient-to-b from-white via-sky-50/40 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Consultório & Localização</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ambiente Acolhedor Projetado para o Seu Bem-Estar
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Localização nobre, fácil acesso e salas climatizadas preparadas com os mais altos padrões de conforto e esterilização.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Coluna Esquerda: Informações de Endereço, Horários e Estrutura */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-lg shadow-sky-950/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span>{clinicName}</span>
              </h3>

              {/* Endereço */}
              <div className="flex items-start gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Endereço</h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {location.address}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {location.neighborhood}, {location.city} - {location.state}
                  </p>
                  {location.reference && (
                    <p className="text-xs text-sky-700 bg-sky-50 rounded-lg p-2 mt-2 border border-sky-100">
                      📍 {location.reference}
                    </p>
                  )}
                </div>
              </div>

              {/* Horários */}
              <div className="flex items-start gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Horário de Atendimento</h4>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {location.hours}
                  </p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">
                    Atendimento com hora marcada e pontualidade
                  </p>
                </div>
              </div>

              {/* Comodidades da Clínica */}
              <div className="pt-5 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Comodidades do Espaço
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <div className="w-6 h-6 rounded-md bg-sky-50 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.address || ''} ${location.city || ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold text-xs border border-sky-200 transition-colors min-h-[44px]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Traçar Rota no Waze/Maps</span>
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Ligar</span>
              </a>
            </div>

          </div>

          {/* Coluna Direita: Mapa Interativo do Google Maps */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-lg shadow-sky-950/5 min-h-[380px] flex flex-col">
            <div className="p-4 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs text-slate-700">
              <span className="font-semibold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" />
                Localização no Mapa Interativo
              </span>
              <span className="text-[11px] text-slate-500">
                {location.city} - {location.state}
              </span>
            </div>
            
            <div className="relative flex-1 w-full min-h-[340px]">
              <iframe
                title={`Mapa de localização - ${clinicName}`}
                src={location.mapEmbedUrl}
                className="w-full h-full min-h-[340px] border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
