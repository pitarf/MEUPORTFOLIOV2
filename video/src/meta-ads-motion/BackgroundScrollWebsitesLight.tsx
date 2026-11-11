import React from 'react';
import { Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

interface BackgroundScrollWebsitesLightProps {
  totalDurationFrames?: number;
  opacity?: number;
}

export const BackgroundScrollWebsitesLight: React.FC<BackgroundScrollWebsitesLightProps> = ({
  totalDurationFrames = 450,
  opacity = 0.90,
}) => {
  const frame = useCurrentFrame();

  // Scroll vertical suave e contínuo calculado em pixels para 4 colunas em tema claro
  const scrollY1 = interpolate(frame, [0, totalDurationFrames], [0, totalDurationFrames > 600 ? -2400 : -1300], {
    extrapolateRight: 'clamp',
  });

  const scrollY2 = interpolate(frame, [0, totalDurationFrames], [-350, totalDurationFrames > 600 ? -2900 : -1700], {
    extrapolateRight: 'clamp',
  });

  const scrollY3 = interpolate(frame, [0, totalDurationFrames], [-700, totalDurationFrames > 600 ? -3400 : -2000], {
    extrapolateRight: 'clamp',
  });

  const scrollY4 = interpolate(frame, [0, totalDurationFrames], [-200, totalDurationFrames > 600 ? -2600 : -1450], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#F1F5F9',
      }}
    >
      {/* Container 3D em perspectiva com as 4 colunas de sites claros rolando */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-16%',
          width: '132%',
          height: '125%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          transform: 'perspective(1300px) rotateX(10deg) rotateY(-5deg) rotateZ(-1.5deg) scale(1.06)',
          opacity,
          filter: 'contrast(1.05) saturate(1.15) brightness(1.02)',
        }}
      >
        {/* Coluna 1: Portfólio Institucional Rafael Pita Solutions (Tema Claro) */}
        <div
          style={{
            transform: `translateY(${scrollY1}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
            border: '2px solid rgba(255,255,255,0.95)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_portfolio_light.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Coluna 2: Clínica Odontológica Dra. Camila */}
        <div
          style={{
            transform: `translateY(${scrollY2}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
            border: '2px solid rgba(255,255,255,0.95)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_odonto_light.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Coluna 3: Clínica de Psicologia Dr. Marcos */}
        <div
          style={{
            transform: `translateY(${scrollY3}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
            border: '2px solid rgba(255,255,255,0.95)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_psicologia_light.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Coluna 4: Nutrição Integrada NutriVida */}
        <div
          style={{
            transform: `translateY(${scrollY4}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
            border: '2px solid rgba(255,255,255,0.95)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_nutrivida_light.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>

      {/* Camada de Gradiente suave para preservar a leitura dos textos da frente em tema claro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(248, 250, 252, 0.25) 0%, rgba(226, 232, 240, 0.60) 100%)',
          boxShadow: 'inset 0 0 100px rgba(15, 23, 42, 0.08)',
        }}
      />

      {/* Gradiente vertical suave para cabeçalho e rodapé */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(241, 245, 249, 0.55) 0%, transparent 22%, transparent 78%, rgba(241, 245, 249, 0.65) 100%)',
        }}
      />

      {/* Grade azul corporativa bem suave */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          opacity: 0.8,
        }}
      />
    </div>
  );
};
