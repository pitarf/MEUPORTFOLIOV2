import React from 'react';
import { Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

interface BackgroundScrollWebsitesProps {
  totalDurationFrames?: number;
  opacity?: number;
}

export const BackgroundScrollWebsites: React.FC<BackgroundScrollWebsitesProps> = ({
  totalDurationFrames = 450,
  opacity = 0.92,
}) => {
  const frame = useCurrentFrame();

  // Scroll vertical suave e contínuo calculado em pixels para 4 colunas distintas
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
        backgroundColor: '#070b19',
      }}
    >
      {/* Container 3D em perspectiva com as 4 colunas de sites reais rolando bem visíveis e iluminados */}
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
          filter: 'contrast(1.10) saturate(1.25) brightness(1.25)',
        }}
      >
        {/* Coluna 1: Hamburgueria Artesanal */}
        <div
          style={{
            transform: `translateY(${scrollY1}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
            border: '2px solid rgba(255,255,255,0.18)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_burger.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Coluna 2: Portfólio Institucional & Soluções */}
        <div
          style={{
            transform: `translateY(${scrollY2}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
            border: '2px solid rgba(59,130,246,0.3)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_portfolio.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Coluna 3: Barbearia Moderna Vintage Club */}
        <div
          style={{
            transform: `translateY(${scrollY3}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
            border: '2px solid rgba(245,158,11,0.3)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_barber.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Coluna 4: Clínica Odontológica Dra. Camila */}
        <div
          style={{
            transform: `translateY(${scrollY4}px)`,
            willChange: 'transform',
            borderRadius: 22,
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
            border: '2px solid rgba(16,185,129,0.3)',
          }}
        >
          <Img
            src={staticFile('bg-scroll/full_odonto.png')}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>

      {/* Camada de Gradiente cinematográfica sutil (não apaga os sites) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(2, 5, 14, 0.20) 0%, rgba(2, 4, 10, 0.55) 100%)',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)',
        }}
      />

      {/* Gradiente vertical bem suave para proteger os extremos */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(2, 4, 10, 0.45) 0%, transparent 22%, transparent 78%, rgba(2, 4, 10, 0.60) 100%)',
        }}
      />
    </div>
  );
};
