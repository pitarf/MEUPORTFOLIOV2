import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface MetaAdsActionCtaProps {
  theme?: 'light' | 'dark';
}

export const MetaAdsActionCta: React.FC<MetaAdsActionCtaProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const btnSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.7 },
  });

  const arrowY = interpolate(Math.sin(frame * 0.3), [-1, 1], [-8, 8]);
  const btnPulse = interpolate(Math.sin(frame * 0.25), [-1, 1], [0.97, 1.03]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${titleSpring})`,
          fontSize: 22,
          fontWeight: 800,
          color: isLight ? '#059669' : '#34D399',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 16,
        }}
      >
        🚀 SEU NEGÓCIO NO PRÓXIMO NÍVEL
      </div>

      <h1
        style={{
          transform: `scale(${titleSpring})`,
          fontSize: 54,
          fontWeight: 900,
          lineHeight: 1.2,
          textTransform: 'uppercase',
          color: isLight ? '#0F172A' : '#FFFFFF',
          marginBottom: 36,
          maxWidth: 850,
          textShadow: isLight ? '0 2px 10px rgba(0,0,0,0.06)' : '0 4px 24px rgba(0,0,0,0.95)',
        }}
      >
        Garanta sua <span style={{ color: '#059669' }}>Landing Page</span> com{' '}
        <span style={{ color: isLight ? '#D97706' : '#FBBF24' }}>15% de Desconto</span>
      </h1>

      {/* Botão de WhatsApp */}
      <div
        style={{
          transform: `scale(${btnSpring * btnPulse})`,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          padding: '24px 44px',
          borderRadius: 36,
          fontSize: 30,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 1,
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.4), 0 0 35px rgba(16, 185, 129, 0.3)',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        <span>💬</span>
        <span>Chamar no WhatsApp</span>
      </div>

      {/* Telefone e Domínio */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: isLight ? '#0F172A' : '#FFFFFF',
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          (21) 96614-9077
        </div>
        <div style={{ fontSize: 22, color: isLight ? '#2563EB' : '#94A3B8', fontWeight: 700 }}>
          rafaelpitaoficial.com.br
        </div>
      </div>

      {/* Indicador de Ação Meta Ads */}
      <div
        style={{
          transform: `translateY(${arrowY}px)`,
          fontSize: 22,
          fontWeight: 800,
          color: isLight ? '#059669' : '#6EE7B7',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
        }}
      >
        Toque em "Saiba Mais" abaixo 👇
      </div>
    </div>
  );
};
