import React from 'react';
import { ShieldCheck, Users, TrendingUp, Lock } from 'lucide-react';

/**
 * Barra de Pilares de Confiança (Logo Abaixo do Hero na Referência Summit)
 */
export default function LegalTrustBar({ theme }) {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Padrão Ético OAB',
      desc: 'Seus interesses e direitos resguardados com absoluto rigor legal.'
    },
    {
      icon: Users,
      title: 'Advocacia Independente',
      desc: 'Orientação jurídica sob medida e personalizada para os seus objetivos.'
    },
    {
      icon: TrendingUp,
      title: 'Estratégias Comprovadas',
      desc: 'Soluções fundamentadas em sólida jurisprudência dos tribunais superiores.'
    },
    {
      icon: Lock,
      title: 'Sigilo e Privacidade LGPD',
      desc: 'Seus dados e documentos protegidos com sigilo profissional incondicional.'
    }
  ];

  const isFemale = theme?.gender === 'female';

  return (
    <section className={`${isFemale ? 'bg-[#FAF4F7] border-y border-[#EEDCE7]' : 'bg-[#FAFBFD] border-y border-slate-200'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl ${isFemale ? 'bg-[#D8A756]/15 border border-[#D8A756]/40 text-[#D8A756]' : 'bg-amber-500/10 border border-amber-400/30 text-[#C6923C]'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <IconComp className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h4 className={`text-sm ${isFemale ? 'font-serif font-medium text-[#2C0822]' : 'font-bold text-[#0A192F]'} tracking-tight`}>
                    {item.title}
                  </h4>
                  <p className={`text-xs ${isFemale ? 'text-stone-500 font-light' : 'text-slate-500 font-normal'} mt-1 leading-relaxed`}>
                    {item.desc}
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
