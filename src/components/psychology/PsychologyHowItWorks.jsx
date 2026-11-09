import React from 'react';
import { MessageSquare, Ear, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Seção de Como Funciona o Início da Terapia
 * Desmistifica as etapas de agendamento e acolhimento para diminuir a ansiedade do primeiro passo.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyHowItWorks({ data }) {
  const { howItWorks } = data;
  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  const stepsConfig = [
    {
      icon: MessageSquare,
      badge: 'Passo 1',
      title: 'Primeiro Contato Sem Julgamentos',
      description: 'Envie uma mensagem pelo WhatsApp. Conversamos de forma breve e gentil sobre o que você está vivenciando e encontramos o melhor dia e horário na agenda.',
      note: 'Sem formulários frios ou perguntas invasivas'
    },
    {
      icon: Ear,
      badge: 'Passo 2',
      title: 'A Primeira Sessão de Escuta Ativa',
      description: 'Um encontro inicial de 50 minutos dedicado exclusivamente a ouvir suas angústias e história com acolhimento pleno e sigilo absoluto garantido por lei.',
      note: 'Você fala apenas o que se sentir confortável'
    },
    {
      icon: Compass,
      badge: 'Passo 3',
      title: 'Construção do Plano Terapêutico',
      description: 'Alinhamos os objetivos centrais, combinamos a frequência e aplicamos ferramentas práticas para que você desenvolva autonomia e alívio emocional sustentável.',
      note: 'Respeito irrestrito ao seu tempo interior'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-white border-y border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
            Passo a Passo Transparente
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight">
            Como dar o primeiro passo em direção ao seu bem-estar?
          </h2>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            Iniciar a terapia não precisa ser assustador ou burocrático. O processo foi pensado para ser acolhedor e simples desde a primeira mensagem.
          </p>
        </div>

        {/* Linha do Tempo em 3 Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {stepsConfig.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className="relative bg-[#FAF8F5] rounded-3xl p-8 border border-[#E7E2D8] text-left flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Número e Ícone */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white text-emerald-700 shadow-xs border border-emerald-100 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif text-3xl font-light text-slate-300">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Título do Passo */}
                  <h3 className="font-serif text-xl font-medium text-slate-800 mb-3">
                    {step.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Nota de Conforto */}
                <div className="pt-4 border-t border-[#EBE6DD] flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{step.note}</span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Chamada para o Primeiro Contato */}
        <div className="mt-14 text-center">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm sm:text-base shadow-[0_6px_20px_rgba(5,150,105,0.2)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.3)] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Iniciar Contato Sem Compromisso</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-slate-500 mt-3">
            Tire suas dúvidas diretamente com a psicóloga antes de agendar.
          </p>
        </div>

      </div>
    </section>
  );
}
