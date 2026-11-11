import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const HookAgitationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const alertScale = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.96, 1.04]
  );

  const subFade = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardsFade = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const niches = [
    { label: 'Delivery & Restaurante', icon: '🍔', color: '#F59E0B' },
    { label: 'Barbearia & Estética', icon: '💈', color: '#3B82F6' },
    { label: 'Consultório & Saúde', icon: '🩺', color: '#10B981' },
    { label: 'Escritórios & Serviços', icon: '⚖️', color: '#8B5CF6' },
  ];

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 30%, #171F38 0%, #060814 100%)',
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
      {/* Luz ambiente de fundo */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge de Alerta */}
      <div
        style={{
          transform: `scale(${alertScale})`,
          background: 'rgba(239, 68, 68, 0.15)',
          border: '2px solid rgba(239, 68, 68, 0.5)',
          padding: '12px 28px',
          borderRadius: 40,
          fontSize: 22,
          fontWeight: 800,
          color: '#F87171',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 36,
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
        }}
      >
        ⚠️ OPORTUNIDADE PERDIDA
      </div>

      {/* Título Principal */}
      <h1
        style={{
          transform: `scale(${titleSpring})`,
          fontSize: 64,
          fontWeight: 900,
          lineHeight: 1.15,
          textTransform: 'uppercase',
          letterSpacing: -1,
          maxWidth: 900,
          margin: '0 0 24px 0',
        }}
      >
        Você tem um <span style={{ color: '#60A5FA' }}>Negócio</span>, mas ainda{' '}
        <span style={{ color: '#EF4444', textDecoration: 'underline' }}>
          não tem seu site?
        </span>
      </h1>

      {/* Subtítulo Agitador */}
      <p
        style={{
          opacity: subFade,
          fontSize: 32,
          fontWeight: 500,
          lineHeight: 1.4,
          color: '#CBD5E1',
          maxWidth: 820,
          margin: '0 0 48px 0',
        }}
      >
        Você está perdendo dezenas de clientes todos os dias que procuram por
        você na sua região e encontram o seu concorrente.
      </p>

      {/* Grid de Nichos Chamados */}
      <div
        style={{
          opacity: cardsFade,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          width: '100%',
          maxWidth: 840,
        }}
      >
        {niches.map((n, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: `1.5px solid ${n.color}55`,
              borderRadius: 20,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: 36 }}>{n.icon}</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#F1F5F9',
                textAlign: 'left',
              }}
            >
              {n.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
