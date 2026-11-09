import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Globe } from 'lucide-react';

/**
 * Barra de Pilares de Confiança e Rigor Ético
 * Reforça a credibilidade profissional e o compromisso inegociável com o sigilo.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyTrustBar({ data }) {
  const { trustPillars, crp } = data;

  const defaultPillars = [
    {
      icon: ShieldCheck,
      title: 'Sigilo Profissional Absoluto',
      description: 'Art. 9º do Código de Ética do Psicólogo. Confidencialidade irrestrita para sua total segurança.',
      color: 'emerald'
    },
    {
      icon: Award,
      title: 'Prática Baseada em Evidências',
      description: 'Protocolos clínicos comprovados cientificamente da Terapia Cognitivo-Comportamental.',
      color: 'purple'
    },
    {
      icon: HeartHandshake,
      title: 'Acolhimento Sem Julgamentos',
      description: 'Escuta empática e atenta para compreender sua história com respeito e serenidade.',
      color: 'emerald'
    },
    {
      icon: Globe,
      title: 'Atendimento Global (E-Psi)',
      description: 'Plataforma criptografada para brasileiros em qualquer cidade ou país do mundo.',
      color: 'purple'
    }
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-[#E7E2D8]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {defaultPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isEmerald = pillar.color === 'emerald';

            return (
              <div key={idx} className="flex items-start gap-4 text-left group">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    isEmerald
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-purple-50 text-purple-700 border border-purple-100'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-800 tracking-tight">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
