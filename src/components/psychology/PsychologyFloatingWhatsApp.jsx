import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Botão Flutuante de WhatsApp Acolhedor e Discreto
 * Facilita o contato imediato sem gerar poluição visual ou sobrecarregar a experiência de leitura.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyFloatingWhatsApp({ data }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      
      {/* Tooltip Acolhedor Flutuante (pode ser fechado pelo usuário) */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white rounded-2xl py-2 px-3.5 shadow-[0_8px_25px_rgba(15,23,42,0.12)] border border-[#E8E3D8] text-left animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-xs text-slate-700 font-light">
            Olá! Converse diretamente comigo para agendar ou tirar dúvidas.
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
            aria-label="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botão de Contato */}
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_8px_30px_rgba(5,150,105,0.35)] hover:shadow-[0_12px_35px_rgba(5,150,105,0.45)] transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Falar no WhatsApp com a psicóloga"
      >
        <MessageCircle className="w-6 h-6 text-emerald-100" />
        <span className="hidden sm:inline-block text-sm font-medium tracking-tight">
          Agendar Sessão
        </span>
      </a>

    </div>
  );
}
