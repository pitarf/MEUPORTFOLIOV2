import React from 'react';
import { MessageCircle, Heart, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Seção de Encerramento e Chamada Final Acolhedora
 * Incentiva o paciente a priorizar seu cuidado emocional em um tom sereno e não-invasivo.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyFinalCta({ data }) {
  const { finalCta, name, crp } = data;
  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#FAF8F5] via-[#F3EFE7] to-[#FAF8F5] relative overflow-hidden text-center">
      
      {/* Círculos de luz orgânicos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-emerald-200/25 to-purple-200/30 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Ícone de Acolhimento */}
        <div className="w-14 h-14 rounded-3xl bg-white text-emerald-700 shadow-md border border-[#E8E3D8] flex items-center justify-center mx-auto mb-6">
          <Heart className="w-7 h-7 text-emerald-600 fill-emerald-100" />
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight leading-tight mb-5">
          {finalCta?.title || 'Você não precisa carregar o peso do mundo sozinho.'}
        </h2>

        {/* Subtítulo */}
        <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-2xl mx-auto mb-8">
          {finalCta?.subtitle || 'Dar o primeiro passo pode parecer desafiador, mas cuidar da sua saúde mental é o maior ato de gentileza que você pode ter consigo mesmo.'}
        </p>

        {/* Botão de Agendamento */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-base shadow-[0_8px_25px_rgba(5,150,105,0.3)] hover:shadow-[0_12px_30px_rgba(5,150,105,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <MessageCircle className="w-5 h-5 text-emerald-200" />
            <span>{finalCta?.buttonText || 'Conversar com a Psicóloga no WhatsApp'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Nota Ética de Rodapé do Bloco */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-light">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{finalCta?.helpNote || `Atendimento ético e em conformidade estrita com o Conselho Federal de Psicologia (${crp})`}</span>
        </div>

      </div>
    </section>
  );
}
