import React, { useState } from 'react';
import { Clock, Scissors, Sparkles, Check, Phone } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Cardápio de Serviços & Combos da Barbearia
 * Layout elegante com filtros de categoria, tempo estimado, preço dourado destacado
 * e botão de agendamento que envia o serviço escolhido direto no WhatsApp.
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopServices({ data }) {
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', label: 'Todos os Serviços' },
    { id: 'cortes', label: 'Cortes & Cabelo' },
    { id: 'barba', label: 'Barba & Terapia' },
    { id: 'combos', label: 'Combos Exclusivos' }
  ];

  const services = data.services || [];

  const filteredServices = selectedCategory === 'todos'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <section id="servicos" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Luz sutil de fundo */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Scissors className="w-3.5 h-3.5" />
            <span>Cardápio de Serviços</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-4">
            Precisão, Tradição e Cuidado Impecável
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Selecione o serviço ideal para o seu estilo. Todos os atendimentos incluem lavagem premium, produtos importados e chopp artesanal cortesia.
          </p>
        </div>

        {/* Abas de Filtro de Categoria */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-950/30 scale-105'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Cards de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const bookingUrl = formatBarbershopWhatsappUrl(
              data.contact?.whatsapp,
              data.name,
              service.name
            );

            return (
              <div
                key={service.id}
                className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border transition-all duration-300 hover:-translate-y-1 ${
                  service.popular
                    ? 'border-amber-500/50 shadow-xl shadow-amber-950/20 bg-zinc-900/90'
                    : 'border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Badge Dourado de Destaque */}
                {service.badge && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    {service.badge}
                  </div>
                )}

                <div>
                  {/* Cabeçalho do Card: Nome e Duração */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-4">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tempo estimado: {service.duration}</span>
                  </div>

                  {/* Preço Dourado em Destaque */}
                  <div className="mb-4 pb-4 border-b border-zinc-800/80">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif tracking-tight">
                      {service.price}
                    </span>
                  </div>

                  {/* Descrição dos Passos */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Botão de Agendamento Rápido com Mensagem Personalizada */}
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                    service.popular
                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-900/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Agendar este Serviço</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Rodapé do Cardápio: Atendimento Personalizado */}
        <div className="mt-14 text-center p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-zinc-300">
            Deseja um pacote exclusivo para eventos, casamentos ou Dia do Noivo?{' '}
            <a
              href={formatBarbershopWhatsappUrl(data.contact?.whatsapp, data.name, 'Pacote Personalizado / Dia do Noivo')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold underline ml-1"
            >
              Fale diretamente com nossa gerência no WhatsApp
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
