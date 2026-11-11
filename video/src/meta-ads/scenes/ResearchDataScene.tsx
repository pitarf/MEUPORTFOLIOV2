import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const ResearchDataScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1Spring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const card2Spring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const headerFade = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 20%, #0F1F38 0%, #050811 100%)',
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
      {/* Luz azul de autoridade */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.18)',
          filter: 'blur(140px)',
          pointerEvents: 'none',
        }}
      />

      {/* Selo de Pesquisa Real */}
      <div
        style={{
          opacity: headerFade,
          background: 'rgba(59, 130, 246, 0.15)',
          border: '1.5px solid rgba(96, 165, 250, 0.4)',
          padding: '10px 24px',
          borderRadius: 30,
          fontSize: 20,
          fontWeight: 700,
          color: '#93C5FD',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 32,
        }}
      >
        📊 DADOS REAIS DE MERCADO (GOOGLE & BRIGHTLOCAL)
      </div>

      <h2
        style={{
          opacity: headerFade,
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1.2,
          maxWidth: 900,
          margin: '0 0 54px 0',
          textTransform: 'uppercase',
        }}
      >
        O que as pesquisas revelam sobre o{' '}
        <span style={{ color: '#38BDF8' }}>comportamento do seu cliente:</span>
      </h2>

      {/* Métrica 1 */}
      <div
        style={{
          transform: `scale(${card1Spring})`,
          width: '100%',
          maxWidth: 860,
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 28,
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          marginBottom: 32,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(56, 189, 248, 0.15)',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: '#38BDF8',
            lineHeight: 1,
            letterSpacing: -2,
            minWidth: 200,
          }}
        >
          46%
        </div>
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: 8,
            }}
          >
            Das pesquisas no Google são locais
          </div>
          <div style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.4 }}>
            Pessoas procurando restaurantes, barbearias, clínicas e serviços
            diretamente no seu bairro ou cidade.
          </div>
        </div>
      </div>

      {/* Métrica 2 */}
      <div
        style={{
          transform: `scale(${card2Spring})`,
          width: '100%',
          maxWidth: 860,
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '2px solid rgba(52, 211, 153, 0.4)',
          borderRadius: 28,
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(52, 211, 153, 0.15)',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: '#34D399',
            lineHeight: 1,
            letterSpacing: -2,
            minWidth: 200,
          }}
        >
          84%
        </div>
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: 8,
            }}
          >
            Confiam muito mais em quem tem site
          </div>
          <div style={{ fontSize: 20, color: '#94A3B8', lineHeight: 1.4 }}>
            Consumidores consideram um negócio com site próprio infinitamente
            mais profissional do que perfis soltos em redes sociais.
          </div>
        </div>
      </div>
    </div>
  );
};
