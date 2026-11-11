import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface GoogleSearchSimProps {
  queryText?: string;
  businessName?: string;
  category?: string;
  theme?: 'light' | 'dark';
}

export const GoogleSearchSim: React.FC<GoogleSearchSimProps> = ({
  queryText = 'melhor serviço perto de mim',
  businessName = 'Seu Negócio em Destaque',
  category = 'Restaurante • Barbearia • Consultório',
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada suave da barra com mola
  const barSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  // Efeito de digitação letra por letra
  const typingProgress = interpolate(frame, [15, 55], [0, queryText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentChars = queryText.slice(0, Math.floor(typingProgress));

  // O card de resultado aparece logo após a digitação
  const resultSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 880,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Barra de Pesquisa Estilo Google */}
      <div
        style={{
          transform: `scale(${barSpring})`,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 40,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(66, 133, 244, 0.25)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        {/* Ícone Google colorido */}
        <div style={{ display: 'flex', gap: 3, fontSize: 32, fontWeight: 900 }}>
          <span style={{ color: '#4285F4' }}>G</span>
          <span style={{ color: '#EA4335' }}>o</span>
          <span style={{ color: '#FBBC05' }}>o</span>
          <span style={{ color: '#4285F4' }}>g</span>
          <span style={{ color: '#34A853' }}>l</span>
          <span style={{ color: '#EA4335' }}>e</span>
        </div>

        {/* Input simulado com cursor piscante */}
        <div
          style={{
            flex: 1,
            fontSize: 26,
            fontWeight: 600,
            color: '#1E293B',
            textAlign: 'left',
            paddingLeft: 10,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>{currentChars}</span>
          <span
            style={{
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
              color: '#3B82F6',
              fontWeight: 300,
              marginLeft: 4,
            }}
          >
            |
          </span>
        </div>

        {/* Lupa */}
        <div
          style={{
            background: '#3B82F6',
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: '#FFFFFF',
          }}
        >
          🔍
        </div>
      </div>

      {/* Card de Resultado Topo do Google (#1) */}
      <div
        style={{
          transform: `scale(${resultSpring}) translateY(20px)`,
          width: '100%',
          background: isLight
            ? '#FFFFFF'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          border: isLight ? '2px solid #2563EB' : '2px solid #3B82F6',
          borderRadius: 28,
          padding: '28px 36px',
          marginTop: 24,
          boxShadow: isLight
            ? '0 20px 45px rgba(37, 99, 235, 0.15), 0 10px 25px rgba(15, 23, 42, 0.08)'
            : '0 25px 60px rgba(0,0,0,0.6), 0 0 35px rgba(59, 130, 246, 0.3)',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                background: '#10B981',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 20,
                letterSpacing: 1,
              }}
            >
              #1 NO GOOGLE
            </span>
            <span style={{ color: isLight ? '#2563EB' : '#38BDF8', fontSize: 16, fontWeight: 700 }}>
              seunegocio.com.br
            </span>
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: isLight ? '#0F172A' : '#FFFFFF',
              marginBottom: 6,
            }}
          >
            {businessName}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 18,
              color: isLight ? '#475569' : '#94A3B8',
            }}
          >
            <span style={{ color: '#F59E0B', fontSize: 20 }}>★★★★★</span>
            <strong style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>5.0</strong>
            <span>(280+ avaliações)</span>
            <span>•</span>
            <span style={{ color: '#059669', fontWeight: 700 }}>Aberto Agora</span>
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            padding: '16px 28px',
            borderRadius: 20,
            fontSize: 20,
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
          }}
        >
          Visitar Site ↗
        </div>
      </div>
    </div>
  );
};
