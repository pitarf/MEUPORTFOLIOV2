import React from 'react';
import { Scissors, Phone, Beer, Clock, ShieldCheck } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Chamada de Ação Final (Final CTA)
 * Banner de alto impacto visual convidando para o agendamento da semana ou atendimento VIP
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopFinalCta({ data }) {
  const whatsappUrl = formatBarbershopWhatsappUrl(data.contact?.whatsapp, data.name);

  return (
    <section className="py-20 bg-zinc-950 relative overflow-hidden">
      {/* Brilho Dourado de Fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-amber-500/30 p-8 sm:p-12 lg:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Elementos Decorativos Sutis */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase mb-6">
            <Scissors className="w-3.5 h-3.5" />
            <span>Garanta o Seu Horário</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif tracking-tight mb-6 max-w-2xl mx-auto">
            Pronto para Elevar Seu Estilo ao Padrão que Você Merece?
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10">
            Cadeira reservada, toalha quente, navalha afiada e seu chopp artesanal esperando. Sem filas e com pontualidade garantida.
          </p>

          {/* Botão Principal de Agendamento */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-zinc-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-950/40 hover:shadow-amber-500/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 text-zinc-950" />
              <span>Agendar Atendimento no WhatsApp</span>
            </a>
          </div>

          {/* Destaques Rápidos */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-zinc-800/80 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Beer className="w-4 h-4 text-amber-400" />
              <span>Chopp Artesanal On Tap</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{data.hours?.display || 'Seg a Sáb 09h às 20h'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Estacionamento Privativo</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
