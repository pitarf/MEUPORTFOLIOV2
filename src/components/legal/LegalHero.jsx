import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, ShieldCheck, Scale, Award, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Hero Section com Carrossel Cinematográfico Full Width em Background
 * Imagens em tela cheia com crossfade suave, overlay de alto contraste e tipografia moderna.
 */
export default function LegalHero({ lawyer, nicheInfo, heroImage }) {
  const slides = [
    {
      image: '/images/legal/hero_desk.jpg',
      tag: 'ORIENTAÇÃO JURÍDICA ESTRATÉGICA',
      title: 'Decisões Jurídicas Estratégicas para o seu',
      highlight: 'Futuro Seguro',
      desc: 'Apoiamos pessoas físicas e empresas com estratégias sob medida para resguardar direitos, blindar patrimônio e alcançar soluções céleres e eficazes perante os tribunais.',
      badge: 'Atendimento Executivo e Personalizado'
    },
    {
      image: '/images/legal/reuniao.jpg',
      tag: 'ADVOCACIA CONSULTIVA & CONTENCIOSA',
      title: 'Assessoria Especializada perante os',
      highlight: 'Tribunais Superiores',
      desc: 'Conduzimos cada caso com rigor técnico multidisciplinar, transparência absoluta e foco intransigente na obtenção dos melhores resultados.',
      badge: 'Reuniões Presenciais e Online'
    },
    {
      image: '/images/legal/tribunal.jpg',
      tag: 'DEFESA E SEGURANÇA PATRIMONIAL',
      title: 'Solidez e Firmeza na Proteção dos',
      highlight: 'Seus Interesses',
      desc: 'Atuação combativa em causas cíveis, trabalhistas, imobiliárias e empresariais, com estratégia fundamentada na mais recente jurisprudência.',
      badge: 'Prática Forense Dedicada'
    },
    {
      image: '/images/legal/sede.jpg',
      tag: 'COMPROMISSO ÉTICO E TRANSPARÊNCIA',
      title: 'Estrutura Completa a Serviço da',
      highlight: 'Sua Tranquilidade',
      desc: 'Uma advocacia moderna, ágil e focada em antecipar riscos para que você e sua empresa tomem decisões com total amparo legal.',
      badge: 'Sigilo Absoluto e Rigor OAB'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Transição 100% automática e contínua a cada 4.5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
    `Olá, Dr(a). ${lawyer.name}, gostaria de agendar uma consulta jurídica estratégica.`
  )}`;

  return (
    <section
      id="inicio"
      className="relative text-white py-24 sm:py-28 lg:py-36 overflow-hidden min-h-[640px] lg:min-h-[720px] flex items-center justify-center"
    >
      {/* 1. CARROSSEL DE IMAGENS FULL WIDTH EM BACKGROUND (CROSSFADE CONTÍNUO) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.08] transition-transform duration-[4500ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Gradientes de Alto Contraste para Legibilidade Perfeita */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070F1E]/95 via-[#070F1E]/80 to-[#070F1E]/50 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-[#070F1E]/60 z-20 pointer-events-none" />
      </div>

      {/* 2. CONTEÚDO PRINCIPAL SOBRE O CARROSSEL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Coluna de Textos e Ação */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Tag Dourada com Linha de Destaque */}
            <div className="space-y-2">
              <span className="w-12 h-[2px] bg-[#C6923C] block mb-2" />
              <span className="text-xs font-semibold tracking-widest text-[#D8A756] uppercase block">
                {currentSlide.tag}
              </span>
            </div>

            {/* Headline Monumental Sans Moderna, Limpa e Amigável */}
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-sans font-extrabold text-white leading-[1.18] tracking-tight max-w-3xl"
            >
              {currentSlide.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-[#C6923C]">
                {currentSlide.highlight}
              </span>
            </motion.h1>

            {/* Subtítulo Claro e Confiante */}
            <motion.p
              key={`desc-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl"
            >
              {currentSlide.desc}
            </motion.p>

            {/* Botões Duplos com Estilo Premium Arejado */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#D8A756] via-[#C6923C] to-[#B5812B] hover:from-[#C6923C] hover:to-[#A37020] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap group"
              >
                <MessageCircle className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>Agendar Consulta no WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#atuacao"
                className="px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/25 hover:border-white transition-all flex items-center justify-center gap-2 whitespace-nowrap backdrop-blur-md"
              >
                <span>Nossas Especialidades</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.a>
            </div>

            {/* Selos de Confiança em Linha */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#D8A756]" />
                <span className="font-medium text-white">{lawyer.oab || 'Inscrição Regular OAB'}</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg">
                <Scale className="w-4 h-4 text-[#D8A756]" />
                <span className="font-medium text-white">{currentSlide.badge}</span>
              </div>
            </div>

          </div>

          {/* Coluna da Direita: Card Flutuante de Destaque Executivo */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="backdrop-blur-2xl bg-[#070F1E]/80 border border-white/15 p-6 rounded-2xl shadow-2xl max-w-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D8A756] to-[#C6923C] flex items-center justify-center text-white shadow-md">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">{lawyer.name}</h3>
                  <span className="text-[11px] text-[#D8A756] font-mono uppercase tracking-wider block">
                    Advocacia Estratégica
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Atuação orientada por dados jurídicos e precedentes qualificados para blindar seus direitos e viabilizar soluções eficientes.
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>{lawyer.city && lawyer.state ? `${lawyer.city} - ${lawyer.state}` : 'Atendimento Nacional'}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Plantão Ativo
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. NAVEGAÇÃO E INDICADORES DO CARROSSEL */}
      <div className="absolute bottom-6 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Indicadores com Barra de Progresso Animada Contínua */}
          <div className="flex items-center gap-2.5">
            {slides.map((_, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full overflow-hidden transition-all duration-300 relative ${
                    isActive ? 'w-10 bg-white/20' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                >
                  {isActive && (
                    <motion.div
                      key={`progress-${currentIndex}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4.5, ease: 'linear' }}
                      className="absolute inset-0 bg-[#C6923C]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Setas Anterior / Próximo */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
