import React, { useMemo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, Sparkles, Radio, Activity, Target } from 'lucide-react';
import { pitaiAudioVisualizerService } from '@/services/pitai/pitaiAudioVisualizerService';

/**
 * PIT.AI — Arc Reactor Holográfico Reativo (Stark Industries HUD)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Reator de fusão holográfico tático com anéis rotativos concêntricos graduados
 * em graus (0°, 90°, 180°, 270°), retículo de mira central, espectrograma de
 * áudio sincronizado e aceleração quântica conforme o estado do assistente.
 */
export default function PitAiOrb({
  status = 'idle', // 'idle' | 'listening' | 'thinking' | 'speaking'
  onToggleMic,
  isListening = false
}) {
  // Configurações de cores dinâmicas baseadas no estado Stark Arc Reactor
  const theme = useMemo(() => {
    switch (status) {
      case 'listening':
        return {
          primaryHex: '#00f0ff',
          glowRgba: 'rgba(0, 240, 255, 0.55)',
          borderClass: 'border-cyan-400',
          textClass: 'text-cyan-400',
          accentBg: 'bg-cyan-500/10',
          label: 'OUVINDO // CAPTURA ATIVA',
          subLabel: 'SENSORES ACÚSTICOS EM ALTA FIDELIDADE',
          pulseDuration: 1.4,
          spinDurationOuter: 10,
          spinDurationInner: 8
        };
      case 'thinking':
        return {
          primaryHex: '#f59e0b',
          glowRgba: 'rgba(245, 158, 11, 0.6)',
          borderClass: 'border-amber-400',
          textClass: 'text-amber-400',
          accentBg: 'bg-amber-500/10',
          label: 'PROCESSANDO // CÁLCULO QUÂNTICO',
          subLabel: 'SÍNTESE DE TELEMETRIA & INTELIGÊNCIA',
          pulseDuration: 0.8,
          spinDurationOuter: 2.2, // Aceleração quântica veloz
          spinDurationInner: 1.6
        };
      case 'speaking':
        return {
          primaryHex: '#bcf13b',
          glowRgba: 'rgba(188, 241, 59, 0.65)',
          borderClass: 'border-[#bcf13b]',
          textClass: 'text-[#bcf13b]',
          accentBg: 'bg-[#bcf13b]/10',
          label: 'FALANDO // RESPOSTA EXECUTIVA',
          subLabel: 'TRANSMISSÃO VOCAL J.A.R.V.I.S.',
          pulseDuration: 1.0,
          spinDurationOuter: 14,
          spinDurationInner: 12
        };
      default:
        return {
          primaryHex: '#38bdf8',
          glowRgba: 'rgba(56, 189, 248, 0.3)',
          borderClass: 'border-cyan-500/40',
          textClass: 'text-cyan-400',
          accentBg: 'bg-cyan-500/5',
          label: 'PIT.AI // ARC REACTOR ONLINE',
          subLabel: 'STANDBY TÁTICO • CLIQUE OU ESPAÇO',
          pulseDuration: 3.2,
          spinDurationOuter: 28,
          spinDurationInner: 22
        };
    }
  }, [status]);

  // Barras do espectrograma circular de áudio ao redor do núcleo
  const spectrogramBars = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      angle: i * (360 / 24),
      delay: (i % 6) * 0.1
    }));
  }, []);

  // Referências DOM para atualização direta do espectro a 60fps sem sobrecarga no React
  const barRefs = useRef([]);
  const coreRef = useRef(null);
  const [liveAudioMetrics, setLiveAudioMetrics] = useState({ isActive: false, rawVolume: 0 });

  useEffect(() => {
    let lastActive = false;

    const unsubscribe = pitaiAudioVisualizerService.subscribe((data) => {
      const { volume, bass, frequencyData, isActive, rawVolume } = data;

      if (isActive !== lastActive) {
        lastActive = isActive;
        setLiveAudioMetrics({ isActive, rawVolume: Math.round(rawVolume) });
      }

      // Modula a amplitude dos 24 segmentos circulares de espectro a 60fps
      if (isActive && frequencyData && frequencyData.length > 0) {
        const step = Math.floor(frequencyData.length / 24) || 1;

        barRefs.current.forEach((el, idx) => {
          if (!el) return;
          const freqVal = frequencyData[idx * step] || 0;
          const normalized = freqVal / 255;
          const heightPx = Math.max(4, Math.min(32, 4 + normalized * 24 + volume * 10));
          const opacity = Math.max(0.35, Math.min(1, 0.45 + normalized * 0.55));

          el.style.height = `${heightPx}px`;
          el.style.opacity = `${opacity}`;
          el.style.boxShadow = `0 0 ${Math.max(4, normalized * 12)}px ${theme.primaryHex}`;
        });

        if (coreRef.current) {
          const coreScale = 1 + bass * 0.08 + volume * 0.05;
          coreRef.current.style.transform = `scale(${coreScale.toFixed(3)})`;
        }
      } else {
        // Retorno suave ao repouso
        barRefs.current.forEach((el) => {
          if (!el) return;
          el.style.height = '';
          el.style.opacity = '';
          el.style.boxShadow = '';
        });
        if (coreRef.current) {
          coreRef.current.style.transform = '';
        }
      }
    });

    return () => unsubscribe();
  }, [theme.primaryHex]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-4 sm:py-6">
      
      {/* 1. Ondas Expansivas Holográficas de Captura Acústica e Radar */}
      {(status === 'listening' || status === 'speaking') && (
        <>
          <motion.div
            className="absolute rounded-full border border-cyan-400/40 pointer-events-none"
            style={{ width: '280px', height: '280px' }}
            animate={{ scale: [0.95, 1.35, 0.95], opacity: [0.7, 0.1, 0.7] }}
            transition={{ duration: theme.pulseDuration * 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full border border-dashed border-primary/30 pointer-events-none"
            style={{ width: '340px', height: '340px' }}
            animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: theme.pulseDuration * 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}

      {/* 2. Container Central do Arc Reactor */}
      <div className="relative flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64">
        
        {/* Camada SVG dos Anéis Táticos, Graus e Retículo de Mira */}
        <svg
          viewBox="0 0 260 260"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        >
          <defs>
            <radialGradient id="reactorCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={theme.primaryHex} stopOpacity="0.4" />
              <stop offset="60%" stopColor={theme.primaryHex} stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            
            <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Fundo com Brilho do Reator */}
          <circle cx="130" cy="130" r="115" fill="url(#reactorCoreGlow)" />

          {/* Anel Externo Fixo com Graduação em Graus (0°, 90°, 180°, 270°) */}
          <circle
            cx="130"
            cy="130"
            r="124"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <circle
            cx="130"
            cy="130"
            r="118"
            fill="none"
            stroke={theme.primaryHex}
            strokeOpacity="0.4"
            strokeWidth="1.2"
          />

          {/* Marcadores de Coordenadas em Graus nos 4 Quadrantes */}
          <g className="font-mono text-[8px] font-bold" fill={theme.primaryHex} opacity="0.85">
            {/* 0° (Topo) */}
            <text x="130" y="10" textAnchor="middle">000°</text>
            <line x1="130" y1="12" x2="130" y2="18" stroke={theme.primaryHex} strokeWidth="1.5" />

            {/* 90° (Direita) */}
            <text x="250" y="133" textAnchor="start">090°</text>
            <line x1="242" y1="130" x2="248" y2="130" stroke={theme.primaryHex} strokeWidth="1.5" />

            {/* 180° (Base) */}
            <text x="130" y="256" textAnchor="middle">180°</text>
            <line x1="130" y1="242" x2="130" y2="248" stroke={theme.primaryHex} strokeWidth="1.5" />

            {/* 270° (Esquerda) */}
            <text x="10" y="133" textAnchor="end">270°</text>
            <line x1="12" y1="130" x2="18" y2="130" stroke={theme.primaryHex} strokeWidth="1.5" />
          </g>

          {/* Retículo Tático de Mira Central (Crosshair de Alta Precisão) */}
          <g stroke={theme.primaryHex} strokeOpacity={status === 'listening' ? '0.6' : '0.35'} strokeWidth="0.8">
            {/* Eixo Vertical com folga central para o núcleo */}
            <line x1="130" y1="22" x2="130" y2="78" />
            <line x1="130" y1="182" x2="130" y2="238" />
            
            {/* Eixo Horizontal com folga central */}
            <line x1="22" y1="130" x2="78" y2="130" />
            <line x1="182" y1="130" x2="238" y2="130" />

            {/* Marcadores de Calibração Angular (45°, 135°, 225°, 315°) */}
            <line x1="56" y1="56" x2="68" y2="68" strokeDasharray="2 2" />
            <line x1="204" y1="56" x2="192" y2="68" strokeDasharray="2 2" />
            <line x1="56" y1="204" x2="68" y2="192" strokeDasharray="2 2" />
            <line x1="204" y1="204" x2="192" y2="192" strokeDasharray="2 2" />
          </g>
        </svg>

        {/* 3. Anel Rotativo Tático Externo (Bobinas e Segmentos de Energia) */}
        <motion.div
          className="absolute inset-1 rounded-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{
            duration: theme.spinDurationOuter,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 260 260" className="w-full h-full">
            {/* Bobinas do Reator Arc Reactor - Segmentos circulares */}
            <circle
              cx="130"
              cy="130"
              r="106"
              fill="none"
              stroke={theme.primaryHex}
              strokeOpacity="0.55"
              strokeWidth="4"
              strokeDasharray="18 16"
              strokeLinecap="round"
            />
            <circle
              cx="130"
              cy="130"
              r="98"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
            />
          </svg>
        </motion.div>

        {/* 4. Anel Rotativo Tático Intermediário (Sentido Anti-Horário / Aceleração Quântica) */}
        <motion.div
          className="absolute inset-5 rounded-full pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{
            duration: theme.spinDurationInner,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg viewBox="0 0 220 220" className="w-full h-full">
            <circle
              cx="110"
              cy="110"
              r="84"
              fill="none"
              stroke={theme.primaryHex}
              strokeOpacity="0.4"
              strokeWidth="2"
              strokeDasharray="28 12"
            />
            <circle
              cx="110"
              cy="110"
              r="74"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              strokeDasharray="2 10"
            />
          </svg>
        </motion.div>

        {/* 5. Espectrograma Circular de Áudio ao Redor do Núcleo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {spectrogramBars.map((bar) => {
            const isSpeaking = status === 'speaking';
            const isListeningState = status === 'listening';
            const isThinking = status === 'thinking';

            return (
              <div
                key={bar.id}
                className="absolute origin-bottom flex flex-col items-center justify-end"
                style={{
                  height: '84px',
                  transform: `rotate(${bar.angle}deg)`
                }}
              >
                <motion.div
                  ref={(el) => (barRefs.current[bar.id] = el)}
                  className="w-[2.5px] rounded-full transition-[box-shadow,opacity] duration-75"
                  style={{
                    backgroundColor: theme.primaryHex,
                    boxShadow: `0 0 6px ${theme.primaryHex}`
                  }}
                  animate={
                    isSpeaking
                      ? {
                          height: ['4px', `${12 + ((bar.id * 7) % 18)}px`, '6px', `${8 + ((bar.id * 5) % 16)}px`, '4px'],
                          opacity: [0.5, 1, 0.6, 0.9, 0.5]
                        }
                      : isListeningState
                      ? {
                          height: ['4px', '10px', '4px'],
                          opacity: [0.4, 0.8, 0.4]
                        }
                      : isThinking
                      ? {
                          height: ['4px', '8px', '4px'],
                          opacity: [0.3, 0.7, 0.3]
                        }
                      : {
                          height: '3px',
                          opacity: 0.25
                        }
                  }
                  transition={{
                    duration: isSpeaking ? 0.6 : isThinking ? 0.8 : 1.4,
                    repeat: Infinity,
                    delay: bar.delay,
                    ease: 'easeInOut'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 6. Núcleo Central de Fusão do Arc Reactor (Botão Interativo) */}
        <motion.button
          ref={coreRef}
          type="button"
          onClick={onToggleMic}
          aria-label={isListening ? 'Desativar microfone' : 'Ativar microfone'}
          className={`relative z-20 w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center border-2 ${theme.borderClass} shadow-2xl transition-all cursor-pointer backdrop-blur-2xl group focus:outline-none`}
          style={{
            background: 'radial-gradient(circle, rgba(12,28,52,0.96) 0%, rgba(5,14,28,0.98) 65%, rgba(2,6,14,1) 100%)',
            boxShadow: `0 0 45px ${theme.glowRgba}, inset 0 0 25px ${theme.glowRgba}`
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Anéis Internos de Titânio do Núcleo */}
          <div className="absolute inset-1.5 rounded-full border border-white/15 pointer-events-none" />
          <div className="absolute inset-3 rounded-full border border-dashed border-cyan-400/20 pointer-events-none" />

          {/* Triângulo Central do Arc Reactor (Stark Tribute) em marca d'água */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none" stroke={theme.primaryHex} strokeWidth="1.5">
              <polygon points="50,18 82,74 18,74" />
              <circle cx="50" cy="55" r="14" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Ícone Dinâmico Central com Efeitos */}
          <div className="relative z-30 flex flex-col items-center">
            {status === 'speaking' ? (
              <motion.div
                animate={{ scale: [1, 1.25, 0.95, 1.15, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                className={theme.textClass}
              >
                <Volume2 className="w-8 h-8 sm:w-9 sm:h-9 filter drop-shadow-[0_0_8px_currentColor]" />
              </motion.div>
            ) : status === 'listening' ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                className="text-cyan-300"
              >
                <Mic className="w-8 h-8 sm:w-9 sm:h-9 filter drop-shadow-[0_0_10px_#00f0ff]" />
              </motion.div>
            ) : status === 'thinking' ? (
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="text-amber-400"
              >
                <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 filter drop-shadow-[0_0_10px_#f59e0b]" />
              </motion.div>
            ) : (
              <div className="text-cyan-400/90 group-hover:text-cyan-300 transition-colors">
                {isListening ? (
                  <Mic className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-400" />
                ) : (
                  <Radio className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-400/80 group-hover:scale-110 transition-transform" />
                )}
              </div>
            )}

            {/* Readout de Telemetria no Núcleo */}
            <span className={`text-[9px] uppercase font-mono tracking-widest mt-1.5 font-bold ${theme.textClass}`}>
              {status === 'listening'
                ? 'LISTENING'
                : status === 'speaking'
                ? 'TRANSMITTING'
                : status === 'thinking'
                ? 'COMPUTING'
                : 'ARC REACTOR'}
            </span>
          </div>

          {/* Foco de Luz Central */}
          <div
            className="absolute w-10 h-10 rounded-full blur-md opacity-60 pointer-events-none"
            style={{ backgroundColor: theme.primaryHex }}
          />
        </motion.button>
      </div>

      {/* 7. Barra de Status Tático Stark Industries */}
      <div className="flex flex-col items-center mt-3 text-center space-y-1">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-border/80 backdrop-blur-md">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: theme.primaryHex }}
          />
          <span className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-wider ${theme.textClass}`}>
            {theme.label}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          {liveAudioMetrics.isActive
            ? `TELEMETRIA // SÍNTESE ACÚSTICA REALTIME (${liveAudioMetrics.rawVolume} dB)`
            : theme.subLabel}
        </span>
      </div>
    </div>
  );
}
