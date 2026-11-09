import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, MapPin, Video, ArrowRight, MessageCircle, Heart, Lock } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Hero Section Ultra-Premium para Psicologia Clínica
 * Transmite serenidade, escuta empática e total segurança ética desde o primeiro olhar.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyHero({ data }) {
  const { name, title, crp, hero, avatarUrl, modalities, rating, reviewCount, city, neighborhood } = data;
  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  return (
    <section id="inicio" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FAF5FF]/30 to-[#FAF8F5]">
      {/* Elementos Orgânicos de Fundo Sutis (Sem poluição visual) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-200/20 to-purple-200/25 blur-3xl pointer-events-none rounded-full -z-10" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-emerald-100/30 blur-2xl pointer-events-none rounded-full -z-10" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-purple-100/30 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Coluna de Texto e Apresentação (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 text-left space-y-6"
          >
            
            {/* Badge de Rigor e Acolhimento */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs sm:text-sm font-medium shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{hero?.badge || 'Atendimento Humanizado & Baseado em Evidências'}</span>
            </motion.div>

            {/* Headline Acolhedora */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-slate-800 leading-[1.2]">
              {hero?.headline || 'Um Espaço Seguro, Acolhedor e Livre de Julgamentos para Cuidar de Você'}
            </h1>

            {/* Subtítulo Empático */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-light">
              {hero?.subheadline || 'Psicoterapia individual para adultos e jovens. Auxílio clínico especializado para desatar nós emocionais, superar a ansiedade e construir uma vida com significado real.'}
            </p>

            {/* Modalidades de Atendimento (Presencial & Online) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#EBE7DF] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Atendimento Presencial</h4>
                  <p className="text-xs text-slate-500">{neighborhood ? `${neighborhood}, ${city}` : city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#EBE7DF] shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sessões Online</h4>
                  <p className="text-xs text-slate-500">Brasil e Brasileiros no Exterior</p>
                </div>
              </div>
            </div>

            {/* Ações / Call-to-Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-base shadow-[0_6px_20px_rgba(5,150,105,0.25)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.35)] transition-all duration-300 group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-200" />
                <span>{hero?.ctaText || 'Agendar Primeira Sessão'}</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#sobre"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-800 font-medium text-base border border-[#E2DDD5] shadow-xs hover:border-emerald-300 transition-all duration-200"
              >
                <span>Conhecer Abordagem</span>
              </motion.a>
            </div>

            {/* Aviso de Sigilo e Ética */}
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{hero?.confidentialityBadge || `Sigilo Profissional Absoluto (${crp})`}</span>
            </div>
          </motion.div>

          {/* Coluna Visual: Foto Acolhedora da Psicóloga (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Moldura Aveludada Acolhedora */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white to-[#F5F2EB] p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-[#E8E3D8]">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                  
                  {/* Legenda sobre a imagem */}
                  <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                    <p className="font-serif text-lg font-medium drop-shadow-sm">{name}</p>
                    <p className="text-xs text-white/90 drop-shadow-sm">{title}</p>
                  </div>
                </div>
              </div>

              {/* Card Flutuante 1: Avaliações Google com Movimento de Mola Suave */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#EBE7DF] text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-800">{rating || '5.0'}</span>
                    <div className="flex text-amber-400 text-xs">★★★★★</div>
                  </div>
                  <span className="text-xs text-slate-500 font-normal">
                    {reviewCount || 48} avaliações acolhedoras
                  </span>
                </div>
              </motion.div>

              {/* Card Flutuante 2: Selo do CFP */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-emerald-100 text-left flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-emerald-900">Registro Regular</span>
                  <span className="text-xs font-mono font-medium text-emerald-700">{crp}</span>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
