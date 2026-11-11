import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface BeforeAfterCardProps {
  theme?: 'light' | 'dark';
}

export const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const goodSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Lado Ruim: Sem Site */}
      <div
        style={{
          transform: `scale(${badSpring})`,
          background: isLight
            ? '#FFF5F5'
            : 'linear-gradient(135deg, rgba(38, 15, 15, 0.9) 0%, rgba(20, 8, 8, 0.95) 100%)',
          border: isLight ? '2px solid #FECACA' : '2px solid rgba(239, 68, 68, 0.5)',
          borderRadius: 28,
          padding: '28px 36px',
          boxShadow: isLight
            ? '0 15px 35px rgba(239, 68, 68, 0.08), 0 5px 15px rgba(0,0,0,0.04)'
            : '0 20px 40px rgba(0, 0, 0, 0.5)',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: isLight ? '#FEE2E2' : 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: '#DC2626',
            minWidth: 60,
          }}
        >
          ✕
        </div>
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: isLight ? '#DC2626' : '#F87171',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Sem Site Oficial
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: isLight ? '#991B1B' : '#FFFFFF',
              marginBottom: 4,
            }}
          >
            Invisível no Google & Refém de Taxas
          </div>
          <div style={{ fontSize: 18, color: isLight ? '#7F1D1D' : '#94A3B8', fontWeight: 500 }}>
            Perde até 27% do faturamento para plataformas e clientes vão para o concorrente.
          </div>
        </div>
      </div>

      {/* Lado Bom: Com Site RP Solutions */}
      <div
        style={{
          transform: `scale(${goodSpring})`,
          background: isLight
            ? '#F0F9FF'
            : 'linear-gradient(135deg, rgba(8, 47, 73, 0.95) 0%, rgba(3, 24, 40, 0.98) 100%)',
          border: isLight ? '2.5px solid #0284C7' : '2.5px solid #38BDF8',
          borderRadius: 28,
          padding: '28px 36px',
          boxShadow: isLight
            ? '0 20px 45px rgba(2, 132, 199, 0.15), 0 8px 20px rgba(15, 23, 42, 0.06)'
            : '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.3)',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            color: '#FFFFFF',
            minWidth: 60,
            boxShadow: '0 0 20px rgba(2, 132, 199, 0.6)',
          }}
        >
          ✓
        </div>
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: isLight ? '#0284C7' : '#38BDF8',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Com Landing Page Profissional
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: isLight ? '#0C4A6E' : '#FFFFFF',
              marginBottom: 4,
            }}
          >
            No Topo das Buscas com Pedido Direto
          </div>
          <div style={{ fontSize: 18, color: isLight ? '#0369A1' : '#BAE6FD', fontWeight: 500 }}>
            100% do lucro no seu bolso, agendamentos rápidos e autoridade de marca.
          </div>
        </div>
      </div>
    </div>
  );
};
