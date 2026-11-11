import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface CtaSceneProps {
  isVertical?: boolean;
}

export const CtaScene: React.FC<CtaSceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 130,
    },
  });

  const pulse = Math.sin(frame / 5) * 0.04 + 1;
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#07090E',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        opacity,
        position: 'relative',
        overflow: 'hidden',
        padding: isVertical ? '40px 60px' : '40px 120px',
        textAlign: 'center',
      }}
    >
      {/* Luz ambiente dourada/esmeralda */}
      <div
        style={{
          position: 'absolute',
          width: isVertical ? 700 : 1000,
          height: isVertical ? 700 : 1000,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge de Oferta */}
      <div
        style={{
          transform: `scale(${entrance})`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 999,
          padding: isVertical ? '12px 28px' : '10px 24px',
          marginBottom: isVertical ? 36 : 24,
        }}
      >
        <span
          style={{
            color: '#FBBF24',
            fontSize: isVertical ? 22 : 16,
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Condição Especial • 10% OFF
        </span>
      </div>

      {/* Chamada Principal */}
      <div style={{ transform: `scale(${entrance})`, zIndex: 1, maxWidth: isVertical ? 850 : 1100 }}>
        <h1
          style={{
            fontSize: isVertical ? 68 : 58,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 20px 0',
            letterSpacing: '-1.5px',
          }}
        >
          PRONTO PARA TER UM PROJETO QUE{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #10B981, #34D399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            REALMENTE VENDE?
          </span>
        </h1>
        <p
          style={{
            fontSize: isVertical ? 30 : 24,
            fontWeight: 500,
            color: '#94A3B8',
            lineHeight: 1.4,
            margin: '0 0 40px 0',
          }}
        >
          Projetos entregues em dias, com suporte direto, domínio próprio e sem mensalidades abusivas.
        </p>
      </div>

      {/* Botão de Ação Destacado */}
      <div
        style={{
          transform: `scale(${pulse})`,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            fontSize: isVertical ? 32 : 24,
            fontWeight: 900,
            padding: isVertical ? '22px 50px' : '18px 40px',
            borderRadius: 999,
            boxShadow: '0 12px 35px rgba(16, 185, 129, 0.45)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          rafaelpitaoficial.com.br
        </div>
        <span
          style={{
            color: '#6EE7B7',
            fontSize: isVertical ? 24 : 18,
            fontWeight: 700,
          }}
        >
          WhatsApp Comercial: (21) 96614-9077
        </span>
      </div>
    </div>
  );
};
