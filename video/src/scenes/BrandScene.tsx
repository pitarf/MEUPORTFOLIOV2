import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface BrandSceneProps {
  isVertical?: boolean;
}

export const BrandScene: React.FC<BrandSceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
    },
  });

  const opacity = interpolate(frame, [0, 15, 160, 180], [0, 1, 1, 0]);
  const glow = interpolate(frame, [0, 60, 120], [0.3, 0.7, 0.4]);

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
      {/* Luz ambiente azul eletrico */}
      <div
        style={{
          position: 'absolute',
          width: isVertical ? 700 : 1000,
          height: isVertical ? 700 : 1000,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(90px)',
          opacity: glow,
          pointerEvents: 'none',
        }}
      />

      {/* Selo de Autoridade */}
      <div
        style={{
          transform: `scale(${entrance})`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: 999,
          padding: isVertical ? '12px 28px' : '10px 24px',
          marginBottom: isVertical ? 35 : 24,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#38BDF8',
            boxShadow: '0 0 12px #38BDF8',
          }}
        />
        <span
          style={{
            color: '#BAE6FD',
            fontSize: isVertical ? 22 : 16,
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          Engenharia Digital de Alto Padrão
        </span>
      </div>

      {/* Marca Principal */}
      <div style={{ transform: `scale(${entrance})`, zIndex: 1 }}>
        <h1
          style={{
            fontSize: isVertical ? 80 : 68,
            fontWeight: 900,
            lineHeight: 1.1,
            margin: '0 0 16px 0',
            letterSpacing: '-2px',
          }}
        >
          RAFAEL PITA{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #38BDF8, #3B82F6, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SOLUTIONS
          </span>
        </h1>
        <p
          style={{
            fontSize: isVertical ? 34 : 26,
            fontWeight: 600,
            color: '#E2E8F0',
            lineHeight: 1.35,
            maxWidth: isVertical ? 850 : 1000,
            margin: '0 auto',
          }}
        >
          Construímos ecossistemas digitais proprietários com velocidade instantânea, design de autoridade e conversão direta no WhatsApp.
        </p>
      </div>

      {/* Pílulas de Tecnologias */}
      <div
        style={{
          display: 'flex',
          gap: isVertical ? 16 : 14,
          justifyContent: 'center',
          marginTop: isVertical ? 50 : 36,
          flexWrap: 'wrap',
          maxWidth: isVertical ? 800 : 900,
        }}
      >
        {['React & Vite', 'Supabase Cloud', 'PIX Automatizado', 'Design Anti-Slop'].map((tech) => (
          <div
            key={tech}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 14,
              padding: isVertical ? '14px 24px' : '10px 20px',
              color: '#CBD5E1',
              fontSize: isVertical ? 22 : 17,
              fontWeight: 700,
              backdropFilter: 'blur(10px)',
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};
