import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Beer, Sparkles, Scissors, ArrowDown } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Seção Principal (Hero) da Barbearia
 * Estética Dark Luxury Vintage com headline marcante, badges de experiência exclusiva
 * (Chopp artesanal, Toalha Quente, Navalha clássica) e chamadas de ação diretas.
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopHero({ data }) {
  const whatsappUrl = formatBarbershopWhatsappUrl(data.contact?.whatsapp, data.name);
  const heroImage = data.heroCustomImage || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=85';

  return (
    <section id="inicio" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-zinc-950 overflow-hidden">
      {/* Luz ambiente vintage suave de fundo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Coluna de Texto e Proposta de Valor */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            
            {/* Tag Vintage de Boas-Vindas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Experiência Masculina de Alto Padrão</span>
            </motion.div>

            {/* Headline de Alto Impacto */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-serif mb-6">
              {data.headline || 'Estilo, Precisão e Tradição para o Homem Moderno'}
            </h1>

            {/* Subtítulo Convidativo */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
              {data.subheadline || 'Mais do que um corte, um momento de desaceleração e alinhamento. Desfrute de toalha quente, navalha precisa e um chopp artesanal gelado cortesia em um ambiente vintage refinado.'}
            </p>

            {/* Selos de Qualidade da Experiência */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-9">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
                  <Beer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Chopp Gelado</div>
                  <div className="text-[11px] text-zinc-400">Cortesia da casa</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Toalha Quente</div>
                  <div className="text-[11px] text-zinc-400">Vapor e ozônio</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Navalha Clássica</div>
                  <div className="text-[11px] text-zinc-400">Linhas milimétricas</div>
                </div>
              </div>
            </div>

            {/* Botões de Ação (CTAs) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-zinc-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-950/40 hover:shadow-amber-500/20 transition-all duration-200"
              >
                <span>Agendar Horário no WhatsApp</span>
                <Scissors className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 font-semibold text-sm transition-all duration-200"
              >
                <span>Cardápio de Serviços</span>
                <ArrowDown className="w-4 h-4 text-zinc-400" />
              </motion.a>
            </div>

            {/* Garantia de Pontualidade */}
            <div className="flex items-center gap-2 mt-5 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Sem filas de espera • Horário marcado com pontualidade garantida</span>
            </div>

          </motion.div>

          {/* Coluna Visual: Fotografia de Alta Fidelidade com Moldura e Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Moldura Dourada com Sombra */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/25 shadow-2xl shadow-black/80 bg-zinc-900 group">
                <img
                  src={heroImage}
                  alt={`Corte e Barba na ${data.name}`}
                  className="w-full h-[430px] sm:h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  loading="eager"
                />

                {/* Gradiente Interno para contraste visual */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                {/* Informações de Localização no Rodapé da Imagem */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800/80 text-left">
                  <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-0.5">
                    {data.location?.neighborhood ? `${data.location.neighborhood} • ${data.location.city}` : 'Atendimento com Excelência'}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {data.location?.address || 'Cadeiras vintage de couro legítimo e estacionamento cortesia'}
                  </div>
                </div>
              </div>

              {/* Badge Flutuante: Google Review 4.9 */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-3 sm:-left-6 px-4 py-3 rounded-xl bg-zinc-950/95 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold text-sm">4.9 / 5.0</span>
                    <span className="text-zinc-400 text-xs">no Google</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    +{data.stats?.reviewsCount || 480} avaliações 5 estrelas
                  </div>
                </div>
              </motion.div>

              {/* Badge Flutuante Inferior: Chopp Cortesia */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden sm:flex absolute -bottom-4 -right-4 px-4 py-2.5 rounded-xl bg-zinc-900/95 border border-zinc-700/80 shadow-xl items-center gap-2 text-xs text-zinc-200"
              >
                <Beer className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Chopp Artesanal On Tap</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
