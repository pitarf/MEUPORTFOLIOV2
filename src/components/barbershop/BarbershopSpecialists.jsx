import React from 'react';
import { Award, Scissors, Calendar } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Seção Mestres da Navalha (Equipe de Barbeiros Especialistas)
 * Exibe fotos em alta qualidade, credenciais, anos de experiência e agendamento direto com o profissional
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopSpecialists({ data }) {
  const specialists = data.specialists || [];

  return (
    <section id="equipe" className="py-24 bg-zinc-900/50 relative overflow-hidden border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Mestres da Navalha</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-4">
            Profissionais Dedicados à Arte da Barbearia Clássica
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Nossa equipe reúne anos de aperfeiçoamento contínuo nas melhores academias internacionais. Conheça os mestres prontos para elevar o seu visual.
          </p>
        </div>

        {/* Grid dos Especialistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialists.map((barber) => {
            const barberBookingUrl = formatBarbershopWhatsappUrl(
              data.contact?.whatsapp,
              data.name,
              `Horário com o barbeiro ${barber.name}`
            );

            return (
              <div
                key={barber.id}
                className="group relative rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Foto do Barbeiro com Efeito Hover */}
                  <div className="relative h-80 overflow-hidden bg-zinc-900">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Badge de Anos de Experiência */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zinc-950/85 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                      {barber.experience}
                    </div>
                  </div>

                  {/* Informações Textuais */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white font-serif mb-1 group-hover:text-amber-400 transition-colors">
                      {barber.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-amber-500 font-semibold mb-3">
                      {barber.role}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {barber.specialty}
                    </p>
                  </div>
                </div>

                {/* Botão de Agendar com o Barbeiro */}
                <div className="px-6 pb-6 pt-2">
                  <a
                    href={barberBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 font-bold text-xs uppercase tracking-wider border border-zinc-700/80 hover:border-amber-500 transition-all duration-200"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar com {barber.name.split(' ')[0]}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
