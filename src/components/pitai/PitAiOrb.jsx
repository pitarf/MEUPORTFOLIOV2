import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, Radio } from 'lucide-react';

/**
 * PIT.AI — Orbe Holográfico Reativo (Core Visual)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Reage visualmente com pulsações e ondas aos estados de escuta,
 * raciocínio e fala do assistente.
 */
export default function PitAiOrb({
  status = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  onToggleMic,
  isListening = false
}) {
  const getGlowColor = () => {
    switch (status) {
      case 'listening':
        return 'rgba(6, 182, 212, 0.45)'; // Cyan elétrico
      case 'thinking':
        return 'rgba(234, 179, 8, 0.45)'; // Âmbar / Ouro
      case 'speaking':
        return 'rgba(188, 241, 59, 0.55)'; // Neon Lime RP Solutions
      default:
        return 'rgba(59, 130, 246, 0.25)'; // Azul executivo suave
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'listening':
        return 'border-cyan-400';
      case 'thinking':
        return 'border-amber-400';
      case 'speaking':
        return 'border-[#bcf13b]';
      default:
        return 'border-blue-500/40';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6">
      
      {/* Ondas Expansivas Holográficas de Fundo */}
      {(status === 'listening' || status === 'speaking') && (
        <>
          <motion.div
            className="absolute rounded-full border border-cyan-500/30"
            style={{ width: '220px', height: '220px' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full border border-primary/20"
            style={{ width: '280px', height: '280px' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
        </>
      )}

      {/* Orbe Central com Reação ao Toque */}
      <motion.button
        type="button"
        onClick={onToggleMic}
        className={`relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center border-2 ${getBorderColor()} shadow-2xl transition-all cursor-pointer backdrop-blur-xl group focus:outline-none`}
        style={{
          background: 'radial-gradient(circle, rgba(10,19,40,0.95) 0%, rgba(5,10,20,0.98) 100%)',
          boxShadow: `0 0 50px ${getGlowColor()}, inset 0 0 30px ${getGlowColor()}`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Anéis Internos de Dados Rotativos */}
        <motion.div
          className="absolute inset-2 rounded-full border border-dashed border-white/20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: status === 'thinking' ? 4 : 24, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-dotted border-primary/30 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: status === 'thinking' ? 6 : 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ícone Dinâmico no Núcleo do Orbe */}
        <div className="relative z-20 flex flex-col items-center">
          {status === 'speaking' ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-[#bcf13b]"
            >
              <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>
          ) : status === 'listening' ? (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-cyan-400"
            >
              <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>
          ) : status === 'thinking' ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="text-amber-400"
            >
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />
            </motion.div>
          ) : (
            <div className="text-white/80 group-hover:text-white transition-colors">
              {isListening ? (
                <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              ) : (
                <Radio className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              )}
            </div>
          )}

          <span className="text-[10px] uppercase font-mono tracking-widest mt-1.5 font-bold text-white/90">
            {status === 'listening'
              ? 'OUVINDO'
              : status === 'speaking'
              ? 'FALANDO'
              : status === 'thinking'
              ? 'PROCESSANDO'
              : 'PIT.AI PRONTO'}
          </span>
        </div>
      </motion.button>

      {/* Legenda de Ação Rápida */}
      <span className="text-[11px] text-muted-foreground mt-3 font-mono">
        {isListening ? 'Fale normalmente...' : 'Toque no núcleo ou pressione [Espaço] para falar'}
      </span>
    </div>
  );
}
