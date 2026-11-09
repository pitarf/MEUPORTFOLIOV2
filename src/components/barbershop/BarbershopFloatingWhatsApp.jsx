import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Botão Flutuante de WhatsApp com Badge Pulsante e Balão de Boas-Vindas
 * Posicionado no canto inferior direito para conversão imediata de visitantes
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopFloatingWhatsApp({ data }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappUrl = formatBarbershopWhatsappUrl(data.contact?.whatsapp, data.name);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      
      {/* Balão de Notificação Convidativo (Tooltip) */}
      {showTooltip && (
        <div className="relative max-w-xs bg-zinc-900 border border-amber-500/40 text-white p-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-zinc-400 hover:text-white p-0.5 rounded-full"
            aria-label="Fechar mensagem de WhatsApp"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              {data.name}
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed pr-3">
            Olá! Deseja agendar seu corte ou barboterapia para hoje?
          </p>
        </div>
      )}

      {/* Botão Principal Pulsante */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-2xl shadow-emerald-950/50 hover:scale-105 transition-all duration-200 focus:outline-none"
        aria-label={`Agendar no WhatsApp com ${data.name}`}
      >
        {/* Anel de Pulso */}
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>

        {/* Ícone de Mensagem */}
        <MessageCircle className="w-7 h-7 fill-white/20 text-white transform group-hover:scale-110 transition-transform duration-200" />
      </a>
    </div>
  );
}
