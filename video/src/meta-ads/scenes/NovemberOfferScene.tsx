import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const NovemberOfferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 10, mass: 0.7 },
  });

  const discountSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const cardsSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  const pulse = interpolate(
    Math.sin(frame * 0.18),
    [-1, 1],
    [0.97, 1.03]
  );

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 30%, #261608 0%, #080503 100%)',
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
      {/* Luz âmbar / dourada de fundo */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.22)',
          filter: 'blur(150px)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge Black Novembro */}
      <div
        style={{
          transform: `scale(${badgeSpring})`,
          background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
          color: '#000000',
          padding: '14px 34px',
          borderRadius: 40,
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 36,
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.5)',
        }}
      >
        🔥 SÓ NESTE MÊS DE NOVEMBRO
      </div>

      {/* Caixa de Desconto Principal */}
      <div
        style={{
          transform: `scale(${discountSpring * pulse})`,
          width: '100%',
          maxWidth: 880,
          background: 'linear-gradient(135deg, rgba(30, 20, 10, 0.9) 0%, rgba(15, 10, 5, 0.95) 100%)',
          border: '3px solid #F59E0B',
          borderRadius: 36,
          padding: '44px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 50px rgba(245, 158, 11, 0.3)',
          marginBottom: 36,
        }}
      >
        <div
          style={{
            fontSize: 98,
            fontWeight: 900,
            lineHeight: 1,
            color: '#FBBF24',
            letterSpacing: -3,
            textShadow: '0 0 35px rgba(245, 158, 11, 0.6)',
            marginBottom: 12,
          }}
        >
          15% OFF
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          Em Qualquer Landing Page ou CRM
        </div>
      </div>

      {/* Métodos de Pagamento Facilitados */}
      <div
        style={{
          transform: `scale(${cardsSpring})`,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          width: '100%',
          maxWidth: 880,
        }}
      >
        {/* Cartão */}
        <div
          style={{
            background: 'rgba(24, 24, 27, 0.85)',
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 24,
            padding: '28px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>💳</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
            Cartão de Crédito
          </div>
          <div style={{ fontSize: 20, color: '#FCD34D', fontWeight: 700 }}>
            Em até 5x Sem Juros
          </div>
        </div>

        {/* PIX */}
        <div
          style={{
            background: 'rgba(24, 24, 27, 0.85)',
            border: '2px solid #10B981',
            borderRadius: 24,
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginBottom: 6 }}>
            Pagamento no PIX
          </div>
          <div style={{ fontSize: 20, color: '#34D399', fontWeight: 800 }}>
            +5% de Desconto Extra!
          </div>
        </div>
      </div>
    </div>
  );
};
