import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Scale, Star, ArrowRight, MessageCircle } from 'lucide-react';

/**
 * Seção "Sobre Nós" no Estilo Exato da Summit Financial (Imagem de Referência)
 * Foto de Reunião Corporativa à esquerda + Texto com Checklist ao centro + 4 Métricas Verticais à direita.
 */
export default function LegalAbout({ lawyer, nicheInfo, theme }) {
  const honorific = theme?.honorific || 'Dr(a).';
  const roleLabel = theme?.roleLabel || 'Especialista';
  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, ${honorific} ${lawyer.name}, li sobre a história e os diferenciais do escritório e gostaria de conversar.`
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

  const isFemale = theme?.gender === 'female';
  const aboutImage = isFemale ? (theme?.aboutImg || '/images/legal/advogada_sobre.jpg') : '/images/legal/reuniao.jpg';

  return (
    <section id="sobre" className={`${isFemale ? 'bg-[#FCF9F7] text-stone-800 border-[#EEDCE7]' : 'bg-white text-slate-800 border-slate-100'} py-20 sm:py-24 border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Parte 1: Fotografia de Reunião com Clientes à Esquerda (5 Colunas) */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className={`rounded-3xl overflow-hidden shadow-2xl border ${isFemale ? 'border-[#EEDCE7] shadow-pink-950/10' : 'border-slate-200/80'} aspect-[4/3] sm:aspect-[16/11] bg-slate-900`}>
                <img
                  src={aboutImage}
                  alt="Reunião de consultoria jurídica com clientes"
                  className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
                  loading="lazy"
                />
              </div>

              {/* Card Flutuante de Credibilidade */}
              <div className={`absolute -bottom-6 right-4 sm:-right-4 ${isFemale ? 'bg-white/95 border-[#EEDCE7] shadow-[0_15px_30px_rgba(44,8,34,0.08)] rounded-2xl' : 'bg-white/95 border-slate-200 shadow-xl rounded-xl'} backdrop-blur-md border p-4 flex items-center gap-3.5 max-w-[270px]`}>
                <div className={`w-10 h-10 rounded-xl ${isFemale ? 'bg-[#D8A756]/15 border border-[#D8A756]/30 text-[#D8A756]' : 'bg-amber-500/10 border border-amber-400/40 text-[#C6923C]'} flex items-center justify-center flex-shrink-0`}>
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-xs ${isFemale ? 'font-serif font-medium text-[#2C0822]' : 'font-bold text-[#0A192F]'} block`}>Atendimento Dedicado</span>
                  <span className={`text-[11px] ${isFemale ? 'text-stone-500 font-light' : 'text-slate-500 font-light'} block leading-tight mt-0.5`}>
                    {lawyer.city && lawyer.state ? `Presencial em ${lawyer.city} (${lawyer.state}) e Online em todo o país` : 'Presencial ou Online em todo o território nacional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Parte 2: Textos Corporativos, Checklist & Grade de Métricas (7 Colunas) */}
          <div className="lg:col-span-7 space-y-6 text-left pt-6 lg:pt-0">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-8 h-[2px] ${isFemale ? 'bg-[#D8A756]' : 'bg-[#C6923C]'}`} />
                <span className={`text-xs font-semibold ${isFemale ? 'text-[#C89445] tracking-widest' : 'text-[#C6923C] uppercase tracking-widest'}`}>
                  SOBRE O ESCRITÓRIO
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl lg:text-[2.5rem] ${isFemale ? 'font-serif font-normal text-[#2C0822] leading-tight tracking-normal' : 'font-sans font-extrabold text-[#0A192F] leading-tight tracking-tight'}`}>
                Seus Direitos. Nossa Experiência. Um Futuro Seguro.
              </h2>
            </div>

            <p className={`text-sm sm:text-base ${isFemale ? 'text-stone-600 font-light' : 'text-slate-600 font-normal'} leading-relaxed`}>
              {lawyer.name ? (
                /^(dr\.|dra\.|doutor|doutora)/i.test(lawyer.name)
                  ? `No escritório liderado por ${lawyer.name}, acreditamos que o sucesso de uma demanda jurídica nasce da clareza técnica, do planejamento estratégico e de uma relação de absoluta confiança mútua entre cliente e ${theme?.gender === 'female' ? 'advogada' : 'advogado'}.`
                  : `Na ${/advocacia|consultoria|associad|sociedade/i.test(lawyer.name) ? lawyer.name : `${lawyer.name} Advocacia`}, acreditamos que o sucesso de uma demanda jurídica nasce da clareza técnica, do planejamento estratégico e de uma relação de absoluta confiança mútua entre cliente e ${theme?.gender === 'female' ? 'advogada' : 'advogado'}.`
              ) : `Em nossa advocacia, acreditamos que o sucesso de uma demanda jurídica nasce da clareza técnica, do planejamento estratégico e de uma relação de absoluta confiança mútua entre cliente e ${theme?.gender === 'female' ? 'advogada' : 'advogado'}.`}
            </p>

            {/* Checklist com Ícones Dourados em 2 Colunas Arejadas */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm ${isFemale ? 'text-stone-700 font-light' : 'text-slate-700 font-normal'} pt-1`}>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} flex-shrink-0 mt-0.5`} />
                <span>Mais de {lawyer.experienceYears || '14'} anos de prática forense ininterrupta</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} flex-shrink-0 mt-0.5`} />
                <span>Estratégias personalizadas para cada fase</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} flex-shrink-0 mt-0.5`} />
                <span>Comunicação transparente e sem juridiquês</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${isFemale ? 'text-[#D8A756]' : 'text-[#C6923C]'} flex-shrink-0 mt-0.5`} />
                <span>Comprometimento ético absoluto perante a OAB</span>
              </div>
            </div>

            {/* Grade de 4 Métricas Arejadas */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t ${isFemale ? 'border-[#EEDCE7]' : 'border-slate-200'}`}>
              {stats.map((s, idx) => {
                const IconComponent = s.icon;
                return (
                  <div key={idx} className={`${isFemale ? 'bg-white/90 border-[#EEDCE7] hover:border-[#D8A756]/60 rounded-2xl shadow-sm' : 'bg-[#FAFBFD] border-slate-200/80 hover:border-amber-400/80 rounded-xl'} p-4 border transition-colors`}>
                    <div className={`w-8 h-8 rounded-lg ${isFemale ? 'bg-[#D8A756]/15 border border-[#D8A756]/30 text-[#D8A756]' : 'bg-amber-500/10 border border-amber-400/30 text-[#C6923C]'} flex items-center justify-center mb-2`}>
                      <IconComponent className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <span className={`text-xl sm:text-2xl ${isFemale ? 'font-serif font-medium text-[#2C0822]' : 'font-sans font-extrabold text-[#0A192F]'} block leading-none`}>
                      {s.value}
                    </span>
                    <span className={`text-[11px] ${isFemale ? 'text-stone-500 font-light' : 'text-slate-500 font-medium'} block mt-1.5 leading-snug`}>
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
                className={`inline-flex items-center gap-2.5 px-8 py-4 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-semibold shadow-lg shadow-[#D8A756]/20 hover:shadow-[#D8A756]/35' : 'rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-lg shadow-emerald-500/20'} text-xs uppercase tracking-wider transition-all group`}
              >
                <MessageCircle className={`w-4 h-4 ${isFemale ? 'fill-[#1A0314] text-[#1A0314]' : 'fill-white text-white'} group-hover:scale-110 transition-transform`} />
                <span>Falar com {theme?.article === 'a' ? 'a Especialista' : 'o Especialista'} no WhatsApp</span>
                <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#1A0314]' : 'text-white'} group-hover:translate-x-1 transition-transform`} />
              </motion.a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
