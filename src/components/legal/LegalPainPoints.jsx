import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
  HeartHandshake,
  ShieldAlert,
  AlertTriangle,
  Plane,
  Activity,
  Users,
  Scale,
  FolderCheck,
  Clock,
  Banknote,
  AlertOctagon,
  FileWarning,
  ArrowRight,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  FileText,
  Briefcase,
  HeartHandshake,
  ShieldAlert,
  AlertTriangle,
  Plane,
  Activity,
  Users,
  Scale,
  FolderCheck,
  Clock,
  Banknote,
  AlertOctagon,
  FileWarning
};

/**
 * Seção de Dores em Formato Bento Grid Moderno
 * Elimina o visual datado de 4 caixas idênticas e adota hierarquia visual assimétrica.
 */
export default function LegalPainPoints({ lawyer, nicheInfo }) {
  const painPoints = nicheInfo.painPoints;
  const items = painPoints.items || [];

  return (
    <section className="py-20 sm:py-28 bg-[#080D1A] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Editorial com Alinhamento à Esquerda */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-semibold text-[#C5A880] uppercase tracking-widest block">
              Triagem de Conflitos & Direitos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
              {painPoints.title}
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            {painPoints.subtitle}
          </p>
        </div>

        {/* Bento Grid Assimétrico de Alta Densidade */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Card 1: Destaque Amplo (Ocupa 7 colunas) */}
          {items[0] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A1020] border border-white/10 hover:border-[#C5A880]/40 p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-[#C5A880] tracking-wider uppercase">
                    01 • Situação Crítica
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-[#C5A880]" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 group-hover:text-[#E2D4BE] transition-colors">
                  {items[0].title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                  {items[0].description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <a
                  href={`https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
                    `Olá, Dr(a). ${lawyer.name}, estou enfrentando: "${items[0].title}". Gostaria de orientação.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C5A880] hover:text-white transition-colors group-hover:translate-x-1"
                >
                  <span>Analisar viabilidade desta situação</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Card 2: Formato Vertical Elegante (Ocupa 5 colunas) */}
          {items[1] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-5 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#C5A880]/40 p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-[#C5A880] tracking-wider uppercase">
                    02 • Incidência Frequente
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-300 group-hover:text-[#C5A880] transition-colors" />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-[#E2D4BE] transition-colors">
                  {items[1].title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {items[1].description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <a
                  href={`https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
                    `Olá, Dr(a). ${lawyer.name}, preciso de auxílio sobre: "${items[1].title}".`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A880] hover:text-white transition-colors"
                >
                  <span>Consultar detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Card 3: Formato Lateral (Ocupa 5 colunas) */}
          {items[2] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-5 rounded-2xl bg-[#0F172A] border border-white/10 hover:border-[#C5A880]/40 p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-[#C5A880] tracking-wider uppercase">
                    03 • Prevenção e Solução
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-gray-300 group-hover:text-[#C5A880] transition-colors" />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-[#E2D4BE] transition-colors">
                  {items[2].title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {items[2].description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <a
                  href={`https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
                    `Olá, Dr(a). ${lawyer.name}, gostaria de saber sobre: "${items[2].title}".`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A880] hover:text-white transition-colors"
                >
                  <span>Verificar direitos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Card 4: Destaque Estruturado com Chamada (Ocupa 7 colunas) */}
          {items[3] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-7 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#141C30] border border-white/10 hover:border-[#C5A880]/40 p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-[#C5A880] tracking-wider uppercase">
                    04 • Amparo Jurídico Imediato
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5 text-[#C5A880]" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3 group-hover:text-[#E2D4BE] transition-colors">
                  {items[3].title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
                  {items[3].description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <a
                  href={`https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
                    `Olá, Dr(a). ${lawyer.name}, me identifiquei com o cenário: "${items[3].title}". Gostaria de auxílio.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#C5A880] hover:text-white transition-colors group-hover:translate-x-1"
                >
                  <span>Solicitar orientação estratégica</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
