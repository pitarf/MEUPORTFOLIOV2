import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, ShieldCheck, Scale } from 'lucide-react';

/**
 * Barra Inferior de Métricas Forenses no Estilo Stratech Golden Luxury
 * 4 colunas em Glassmorphism translúcido com gradientes metálicos dourados e micro-animações.
 */
export default function LegalMetricsBar({ lawyer, nicheInfo }) {
  const metrics = [
    {
      icon: Award,
      value: '+1.800',
      label: 'Demandas & Casos Conduzidos',
      sub: 'Atuação estratégica perante tribunais'
    },
    {
      icon: Users,
      value: '98%',
      label: 'Satisfação & Confiança',
      sub: 'Avaliações comprovadas de clientes'
    },
    {
      icon: Scale,
      value: lawyer.experienceYears ? `+${lawyer.experienceYears} Anos` : '+14 Anos',
      label: 'Prática Forense Dedicada',
      sub: 'Tradição e aperfeiçoamento contínuo'
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Sigilo e Respaldo Ético',
      sub: 'Provimento CFOAB nº 205/2021'
    }
  ];

  return (
    <section className="bg-[#040812] border-y border-white/10 py-16 text-white relative overflow-hidden">
      
      {/* Glow sutil central */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-amber-500/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const IconComp = m.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-4 p-5 rounded-2xl backdrop-blur-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.15)] transition-all duration-300 group"
              >
                {/* Ícone em Círculo Dourado Suave */}
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:border-amber-400/60 transition-all">
                  <IconComp className="w-7 h-7 text-amber-400 stroke-[1.5]" />
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono block bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    {m.value}
                  </span>
                  <p className="text-xs font-semibold text-gray-200 uppercase tracking-wider mt-0.5">
                    {m.label}
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {m.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
