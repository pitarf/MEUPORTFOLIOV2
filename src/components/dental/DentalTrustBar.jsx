import React from 'react';
import { ShieldCheck, Cpu, Feather, Smile, CheckCircle } from 'lucide-react';

/**
 * Barra de Credibilidade e Selos de Confiança Odontológica
 * Destaca autoridade técnica, segurança biológica e tranquilidade do paciente.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalTrustBar({ data }) {
  const { trustElements } = data;

  // Mapeamento dinâmico de ícones Lucide
  const getIcon = (id) => {
    switch (id) {
      case 'cro':
        return <ShieldCheck className="w-6 h-6 text-sky-600" />;
      case 'scanner':
        return <Cpu className="w-6 h-6 text-cyan-600" />;
      case 'anestesia':
        return <Feather className="w-6 h-6 text-emerald-600" />;
      case 'pacientes':
        return <Smile className="w-6 h-6 text-amber-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl shadow-sky-950/5 border border-sky-100/90 p-5 sm:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-sky-100">
          {trustElements.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`flex items-start gap-4 ${idx !== 0 ? 'pt-5 sm:pt-0 sm:pl-6' : ''}`}
            >
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                {getIcon(item.id)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100/70 text-sky-800">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {item.title}
                </h3>
                <p className="text-xs text-sky-700 font-semibold mt-0.5">
                  {item.subtitle}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
