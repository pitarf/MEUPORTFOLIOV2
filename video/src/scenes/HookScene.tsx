import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface HookSceneProps {
  isVertical?: boolean;
}

export const HookScene: React.FC<HookSceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animação de entrada rápida e impactante
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
    },
  });

  const opacity = interpolate(frame, [0, 15, 160, 180], [0, 1, 1, 0]);
  const textY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(frame / 6) * 0.04 + 1;

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
      {/* Luz ambiente de fundo neon */}
      <div
        style={{
          position: 'absolute',
          width: isVertical ? 600 : 900,
          height: isVertical ? 600 : 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid de fundo sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.7,
        }}
      />

      {/* Badge Alerta */}
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 999,
          padding: isVertical ? '12px 28px' : '10px 24px',
          marginBottom: isVertical ? 40 : 28,
          zIndex: 1,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#EF4444',
            boxShadow: '0 0 12px #EF4444',
          }}
        />
        <span
          style={{
            color: '#FCA5A5',
            fontSize: isVertical ? 22 : 16,
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Diagnóstico Digital
        </span>
      </div>

      {/* Headline de Choque */}
      <div
        style={{
          transform: `translateY(${textY}px) scale(${pulse})`,
          zIndex: 1,
          maxWidth: isVertical ? 900 : 1200,
        }}
      >
        <h1
          style={{
            fontSize: isVertical ? 64 : 54,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 24px 0',
            letterSpacing: '-1.5px',
          }}
        >
          SEU SITE ESTÁ{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #EF4444, #F97316)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(239, 68, 68, 0.4)',
            }}
          >
            PERDENDO CLIENTES
          </span>{' '}
          TODOS OS DIAS?
        </h1>
        <p
          style={{
            fontSize: isVertical ? 32 : 24,
            fontWeight: 500,
            color: '#94A3B8',
            lineHeight: 1.4,
            margin: 0,
            maxWidth: isVertical ? 750 : 900,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Layouts genéricos, lentos e dependentes de taxas de até 27% estão drenando o seu lucro.
        </p>
      </div>
    </div>
  );
};
