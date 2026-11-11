import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const MetaAdsCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const buttonSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, mass: 0.7 },
  });

  const pulse = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [0.96, 1.04]
  );

  const arrowY = interpolate(
    Math.sin(frame * 0.25),
    [-1, 1],
    [-6, 6]
  );

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 40%, #06261A 0%, #020A07 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 48px',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Luz verde esmeralda */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.25)',
          filter: 'blur(160px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          transform: `scale(${titleSpring})`,
          fontSize: 24,
          fontWeight: 800,
          color: '#34D399',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        ✨ NÃO PERCA MAIS CLIENTES PARA O CONCORRENTE
      </div>

      <h1
        style={{
          transform: `scale(${titleSpring})`,
          fontSize: 60,
          fontWeight: 900,
          lineHeight: 1.15,
          textTransform: 'uppercase',
          maxWidth: 900,
          margin: '0 0 48px 0',
        }}
      >
        Transforme seu negócio com um{' '}
        <span style={{ color: '#10B981' }}>site profissional</span>
      </h1>

      {/* Botão de WhatsApp Pulsante */}
      <div
        style={{
          transform: `scale(${buttonSpring * pulse})`,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          padding: '28px 48px',
          borderRadius: 40,
          fontSize: 32,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 1,
          boxShadow: '0 20px 50px rgba(16, 185, 129, 0.6), 0 0 35px rgba(16, 185, 129, 0.4)',
          marginBottom: 40,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span>💬</span>
        <span>Falar no WhatsApp</span>
      </div>

      {/* Telefone e Domínio */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          (21) 96614-9077
        </div>
        <div style={{ fontSize: 24, color: '#94A3B8', fontWeight: 600 }}>
          rafaelpitaoficial.com.br
        </div>
      </div>

      {/* Indicador para Toque no Botão do Meta Ads */}
      <div
        style={{
          transform: `translateY(${arrowY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#6EE7B7',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}
        >
          Toque em "Saiba Mais" abaixo 👇
        </span>
      </div>
    </div>
  );
};
