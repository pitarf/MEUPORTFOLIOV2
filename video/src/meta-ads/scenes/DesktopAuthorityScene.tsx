import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from 'remotion';

export const DesktopAuthorityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8 },
  });

  const desktopSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  const badgeFade = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 25%, #131E3D 0%, #040713 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '90px 48px',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div style={{ maxWidth: 900 }}>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1.5px solid rgba(59, 130, 246, 0.5)',
            padding: '8px 24px',
            borderRadius: 30,
            fontSize: 20,
            fontWeight: 800,
            color: '#60A5FA',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 16,
          }}
        >
          🚀 ALTO PADRÃO DE DESENVOLVIMENTO
        </div>
        <h2
          style={{
            transform: `scale(${titleSpring})`,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.2,
            margin: '0 0 12px 0',
            textTransform: 'uppercase',
          }}
        >
          Landing Pages Modernas & <span style={{ color: '#38BDF8' }}>Ultra-Rápidas</span>
        </h2>
        <p style={{ fontSize: 22, color: '#94A3B8', margin: 0 }}>
          Projetadas sob medida para transformar visitantes casuais em clientes pagantes.
        </p>
      </div>

      {/* Mockup Desktop com Navegador */}
      <div
        style={{
          transform: `scale(${desktopSpring})`,
          width: '100%',
          maxWidth: 960,
          borderRadius: 24,
          background: '#0F172A',
          border: '2px solid rgba(59, 130, 246, 0.4)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.8), 0 0 40px rgba(59, 130, 246, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Barra superior de navegador */}
        <div
          style={{
            height: 48,
            background: '#1E293B',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10B981' }} />
          <div
            style={{
              marginLeft: 20,
              background: '#0F172A',
              padding: '6px 24px',
              borderRadius: 20,
              fontSize: 16,
              color: '#94A3B8',
              fontFamily: 'monospace',
            }}
          >
            https://seunegocio.com.br
          </div>
        </div>

        {/* Print do Portfólio Desktop */}
        <div style={{ width: '100%', height: 480, overflow: 'hidden' }}>
          <Img
            src={staticFile('captures/portfolio_desktop.png')}
            style={{
              width: '100%',
              display: 'block',
              objectFit: 'cover',
              objectPosition: 'top center',
            }}
          />
        </div>
      </div>

      {/* Grid de 3 Diferenciais */}
      <div
        style={{
          opacity: badgeFade,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 18,
          width: '100%',
          maxWidth: 960,
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 18,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, color: '#38BDF8' }}>100/100</div>
          <div style={{ fontSize: 16, color: '#CBD5E1', fontWeight: 600 }}>Google Speed</div>
        </div>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: 18,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, color: '#34D399' }}>SEO Local</div>
          <div style={{ fontSize: 16, color: '#CBD5E1', fontWeight: 600 }}>Google Maps Ativo</div>
        </div>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 18,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, color: '#C084FC' }}>Entrega Rápida</div>
          <div style={{ fontSize: 16, color: '#CBD5E1', fontWeight: 600 }}>Em poucos dias</div>
        </div>
      </div>
    </div>
  );
};
