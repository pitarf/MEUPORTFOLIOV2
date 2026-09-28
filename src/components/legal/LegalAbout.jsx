import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Scale, Star, ArrowRight } from 'lucide-react';

/**
 * Seção "Sobre Nós" no Estilo Exato da Summit Financial (Imagem de Referência)
 * Foto de Reunião Corporativa à esquerda + Texto com Checklist ao centro + 4 Métricas Verticais à direita.
 */
export default function LegalAbout({ lawyer, nicheInfo }) {
  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, Dr(a). ${lawyer.name}, li sobre a história e os diferenciais do escritório e gostaria de conversar.`
  )}`;

  const stats = [
    {
      icon: Award,
      value: lawyer.experienceYears ? `+${lawyer.experienceYears}` : '+14 Anos',
      label: 'De Prática Forense Dedicada'
    },
    {
      icon: Users,
      value: '+1.800',
      label: 'Casos e Demandas Conduzidos'
    },
    {
      icon: Scale,
      value: '100%',
      label: 'Conformidade Ética OAB'
    },
    {
      icon: Star,
      value: '98%',
      label: 'Índice de Satisfação dos Clientes'
    }
  ];

  return (
    <section id="sobre" className="bg-white py-20 sm:py-24 border-t border-slate-100 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Parte 1: Fotografia de Reunião com Clientes à Esquerda (5 Colunas) */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-[4/3] sm:aspect-[16/11] bg-slate-900">
                <img
                  src="/images/legal/reuniao.jpg"
                  alt="Reunião de consultoria jurídica com clientes"
                  className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
                  loading="lazy"
                />
              </div>

              {/* Card Flutuante de Credibilidade */}
              <div className="absolute -bottom-6 right-4 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-xl p-4 flex items-center gap-3.5 max-w-[260px]">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-[#C6923C] flex-shrink-0">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A192F] block">Atendimento Dedicado</span>
                  <span className="text-[11px] text-slate-500 font-light block leading-tight">Presencial ou Online em todo o território nacional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parte 2: Textos Corporativos, Checklist & Grade de Métricas (7 Colunas) */}
          <div className="lg:col-span-7 space-y-6 text-left pt-6 lg:pt-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-[2px] bg-[#C6923C]" />
                <span className="text-xs font-semibold text-[#C6923C] uppercase tracking-widest">
                  SOBRE O ESCRITÓRIO
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-extrabold text-[#0A192F] leading-tight tracking-tight">
                Seus Direitos. Nossa Experiência. Um Futuro Seguro.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Na {lawyer.name ? `${lawyer.name} Advocacia` : 'nossa advocacia'}, acreditamos que o sucesso de uma demanda jurídica nasce da clareza técnica, do planejamento estratégico e de uma relação de absoluta confiança mútua entre cliente e advogado.
            </p>

            {/* Checklist com Ícones Dourados em 2 Colunas Arejadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 pt-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C6923C] flex-shrink-0 mt-0.5" />
                <span>Mais de 14 anos de prática forense ininterrupta</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C6923C] flex-shrink-0 mt-0.5" />
                <span>Estratégias personalizadas para cada fase</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C6923C] flex-shrink-0 mt-0.5" />
                <span>Comunicação transparente e sem juridiquês</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C6923C] flex-shrink-0 mt-0.5" />
                <span>Comprometimento ético absoluto perante a OAB</span>
              </div>
            </div>

            {/* Grade de 4 Métricas Arejadas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              {stats.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div key={idx} className="bg-[#FAFBFD] rounded-xl p-3.5 border border-slate-200/80 hover:border-amber-400/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-[#C6923C] mb-2">
                      <IconComponent className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xl sm:text-2xl font-sans font-extrabold text-[#0A192F] block leading-none">
                      {s.value}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block mt-1 leading-snug">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md bg-[#0A192F] hover:bg-[#132A4A] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Conheça Nossa Equipe</span>
                <ArrowRight className="w-4 h-4 text-[#C6923C]" />
              </motion.a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
