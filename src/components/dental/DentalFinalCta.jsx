import React from 'react';
import { Calendar, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Banner Final de Conversão & Chamada para Ação (CTA)
 * Convite acolhedor e seguro para a primeira avaliação do sorriso.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalFinalCta({ data }) {
  const { contact, professional, location, clinicName } = data;

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner com Gradiente Azul e Ciano */}
        <div className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl border border-sky-800/40">
          
          {/* Efeitos de Luz de Fundo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Sua Nova Experiência ao Sorrir Começa Aqui</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              Pronto para Conquistar o Sorriso dos Seus Sonhos com Conforto Total?
            </h2>

            <p className="text-base sm:text-lg text-sky-100/80 leading-relaxed mb-8 max-w-2xl">
              Agende agora sua primeira consulta no {clinicName}. Faça seu escaneamento digital 3D e receba um planejamento detalhado, ético e feito sob medida para você.
            </p>

            {/* Selos de Garantia Rápida */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-sky-200 mb-8">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Sem filas e com hora marcada
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Anestesia computadorizada indolor
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {location.neighborhood}, {location.city}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-extrabold text-base shadow-xl shadow-sky-500/25 active:scale-95 transition-all duration-200 min-h-[50px]"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar Minha Avaliação pelo WhatsApp</span>
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all min-h-[50px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ligar: {contact.phone}</span>
              </a>
            </div>

            <p className="text-[11px] text-sky-200/60 mt-6">
              Responsável Técnico: {professional.name} - {professional.cro}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
