import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Calendar, ArrowRight, CheckCircle2, Sparkles, MapPin, Smile } from 'lucide-react';

/**
 * Seção Hero de Alto Impacto e Conversão para Odontologia
 * Combina autoridade médica, acolhimento humano e prova social 5.0 Google.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica/dentista
 */
export default function DentalHero({ data }) {
  const { hero, professional, contact, location, clinicName } = data;

  return (
    <section
      id="inicio"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-sky-50/30"
    >
      {/* Elementos Decorativos de Fundo (Glow Clínico Sutil) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-200/30 via-cyan-100/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Coluna Esquerda: Texto, Proposta de Valor e CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            
            {/* Badge de Biossegurança & CRO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-600" aria-hidden="true" />
              <span>{hero.badge || 'Odontologia de Alta Precisão & Atendimento Sem Dor'}</span>
            </motion.div>

            {/* Headline Principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-5">
              {hero.title || 'Seu Sorriso Perfeito com Conforto, Tecnologia 3D e Sem Dor.'}
            </h1>

            {/* Subtítulo Humanizado */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              {hero.subtitle ||
                'Unimos tecnologia de ponta, escaneamento digital 3D e atendimento humanizado para cuidar do seu sorriso sem medo e sem desconforto.'}
            </p>

            {/* Lista de Diferenciais Imediatos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Scanner 3D sem moldes de massa</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Anestesia computadorizada indolor</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Planejamento digital do sorriso</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Ambiente climatizado e humanizado</span>
              </div>
            </div>

            {/* CTAs de Ação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-600/25 hover:shadow-xl hover:shadow-sky-600/35 transition-all duration-200 min-h-[48px]"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span>{hero.primaryCtaText || 'Agendar Avaliação pelo WhatsApp'}</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#tratamentos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold text-sm sm:text-base border border-slate-200 hover:border-sky-300 shadow-xs transition-all duration-200 min-h-[48px]"
              >
                <span>{hero.secondaryCtaText || 'Conhecer Tratamentos'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </motion.a>
            </div>

            {/* Localização e Prova Social Expressa */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-600">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  {location.neighborhood}, {location.city} - {location.state}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-700 ml-1">5.0</span>
                <span className="text-slate-500">({hero.reviewsCount || 384} avaliações no Google)</span>
              </div>
            </div>

          </motion.div>

          {/* Coluna Direita: Foto Médica em Alta Resolução + Cards Flutuantes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center"
          >
            
            {/* Moldura da Imagem Principal */}
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Borda Iluminada e Efeito de Vidro */}
              <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-sky-900/10 border-4 border-white aspect-4/5 sm:aspect-3/4 max-h-[520px]">
                <img
                  src={professional.photo}
                  alt={`${professional.name} - ${clinicName}`}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  width="800"
                  height="1000"
                />
                
                {/* Gradiente sutil na base da foto */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Legenda Médica na Foto */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-bold text-base sm:text-lg leading-tight">{professional.name}</p>
                  <p className="text-xs text-sky-200 font-medium">{professional.title}</p>
                  <p className="text-[11px] text-white/80 mt-0.5">{professional.cro}</p>
                </div>
              </div>

              {/* Card Flutuante 1: Avaliação Google 5.0 (Superior Esquerdo) */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-sky-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-slate-900 text-sm">5.0</span>
                    <span className="text-[11px] text-slate-500">Google Reviews</span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Excelência Clínica
                  </p>
                </div>
              </motion.div>

              {/* Card Flutuante 2: Tecnologia Indolor 3D (Inferior Direito) */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-sky-100 items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Scanner 3D Digital</p>
                  <p className="text-[11px] text-slate-500">Zero dor & simulação em tempo real</p>
                </div>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
