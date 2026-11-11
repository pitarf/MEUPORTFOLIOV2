import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';

/**
 * Barra Superior de Notificação de Demonstração Interativa
 * Informa com transparência que todos os textos, fotos e cores são 100% personalizáveis,
 * permitindo ao advogado garantir a condição especial de R$ 297 diretamente no WhatsApp oficial.
 */
export default function LegalDemoNoticeBar({ lawyer, theme }) {
  const lawyerName = lawyer?.name || 'Seu Escritório';
  const whatsappUrl = `https://wa.me/5521966149077?text=${encodeURIComponent(
    `Olá, Rafael! Gostei da demonstração do site para ${lawyerName} e quero garantir a condição de R$ 297 com a personalização dos meus dados.`
  )}`;

  return (
    <aside aria-label="Aviso de demonstração" className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-amber-500/30 sticky top-0 z-[70] shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Lado Esquerdo: Tag e Mensagem de Personalização */}
        <div className="flex items-center gap-2 text-center sm:text-left min-w-0">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Demonstração Interativa</span>
          </span>
          <p className="text-[11px] sm:text-xs text-slate-300 truncate">
            Estrutura sob medida para <strong className="text-white font-semibold">{lawyerName}</strong>. Textos, fotos, logotipo e áreas de atuação são 100% adaptáveis.
          </p>
        </div>

        {/* Lado Direito: Chamada com Preço Promocional e Botão de Aprovação */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline text-[11px] text-slate-300">
            De <span className="line-through text-slate-400">R$ 450</span> por <strong className="text-amber-300 font-bold">R$ 297</strong>
          </span>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all shadow-sm hover:scale-[1.02]"
            title="Aprovar e personalizar com meus dados"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>Garantir Meu Site</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </aside>
  );
}
