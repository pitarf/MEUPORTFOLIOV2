import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

/**
 * Botão Flutuante de WhatsApp para Agendamento Imediato
 * Permite contato direto com a recepção da clínica odontológica.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalFloatingWhatsApp({ data }) {
  const { contact, professional, clinicName } = data;
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      
      {/* Balãozinho de Mensagem Proativa */}
      {showTooltip && (
        <div className="relative bg-white rounded-2xl p-3.5 shadow-2xl border border-sky-100 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs hover:bg-slate-300 transition-colors"
            aria-label="Fechar balão"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800">Recepção Online</span>
          </div>

          <p className="text-xs text-slate-600 leading-snug">
            Olá! Deseja agendar sua avaliação ou tirar dúvidas sobre alinhadores e implantes?
          </p>
        </div>
      )}

      {/* Botão de Ação Flutuante */}
      <a
        href={contact.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a clínica pelo WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-emerald-400"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        
        {/* Ponto indicador de status */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full" />
      </a>

    </div>
  );
}
