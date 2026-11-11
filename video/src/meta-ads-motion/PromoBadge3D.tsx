import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface PromoBadge3DProps {
  theme?: 'light' | 'dark';
}

export const PromoBadge3D: React.FC<PromoBadge3DProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.7 },
  });

  // Rotação sutil e contínua em 3D
  const rotateX = interpolate(Math.sin(frame * 0.12), [-1, 1], [-4, 4]);
  const rotateY = interpolate(Math.cos(frame * 0.12), [-1, 1], [-6, 6]);

  const shimmer = interpolate(frame % 45, [0, 45], [-100, 200]);

  return (
    <div
      style={{
        transform: `scale(${cardSpring}) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        width: '100%',
        maxWidth: 880,
        background: isLight
          ? 'linear-gradient(135deg, #FFFFFF 0%, #FEF3C7 50%, #FDE68A 100%)'
          : 'linear-gradient(135deg, #1C1206 0%, #080502 100%)',
        border: '3px solid #F59E0B',
        borderRadius: 36,
        padding: '44px 40px',
        boxShadow: isLight
          ? '0 25px 60px rgba(245, 158, 11, 0.25), 0 10px 25px rgba(15, 23, 42, 0.08), inset 0 0 30px rgba(245, 158, 11, 0.15)'
          : '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(245, 158, 11, 0.35), inset 0 0 30px rgba(245, 158, 11, 0.15)',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Brilho reflexivo passando pelo card */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${shimmer}%`,
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
          transform: 'skewX(-25deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Selo Topo */}
      <div
        style={{
          display: 'inline-block',
          background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
          color: '#FFFFFF',
          padding: '10px 28px',
          borderRadius: 30,
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 20,
          boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
        }}
      >
        🔥 OFERTA BLACK NOVEMBRO
      </div>

      {/* Grande Desconto */}
      <div
        style={{
          fontSize: 104,
          fontWeight: 900,
          lineHeight: 1,
          color: isLight ? '#B45309' : '#FBBF24',
          letterSpacing: -4,
          textShadow: isLight
            ? '0 4px 20px rgba(245, 158, 11, 0.4)'
            : '0 0 40px rgba(245, 158, 11, 0.7)',
          marginBottom: 12,
        }}
      >
        15% OFF
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: isLight ? '#78350F' : '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 32,
        }}
      >
        Em Qualquer Landing Page ou CRM
      </div>

      {/* Condições de Pagamento */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
      >
        <div
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)',
            border: isLight ? '1.5px solid #FCD34D' : '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            padding: '18px 20px',
            boxShadow: isLight ? '0 5px 15px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>💳</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
            Cartão de Crédito
          </div>
          <div style={{ fontSize: 18, color: isLight ? '#B45309' : '#FCD34D', fontWeight: 800 }}>
            Até 5x Sem Juros
          </div>
        </div>

        <div
          style={{
            background: isLight ? '#ECFDF5' : 'rgba(16, 185, 129, 0.15)',
            border: '1.5px solid #10B981',
            borderRadius: 20,
            padding: '18px 20px',
            boxShadow: isLight ? '0 5px 15px rgba(16, 185, 129, 0.15)' : '0 0 20px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>⚡</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: isLight ? '#065F46' : '#FFFFFF' }}>
            Pagamento no PIX
          </div>
          <div style={{ fontSize: 18, color: isLight ? '#059669' : '#34D399', fontWeight: 900 }}>
            +5% OFF Extra
          </div>
        </div>
      </div>
    </div>
  );
};
