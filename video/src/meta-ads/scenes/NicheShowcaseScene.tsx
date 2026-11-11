import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { PhoneMockup } from '../components/PhoneMockup';

export const NicheShowcaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3 nichos rotacionando a cada 120 frames (4s cada)
  // Sub-cena 1: Hamburgueria (0-120)
  // Sub-cena 2: Barbearia (120-240)
  // Sub-cena 3: Consultório / Odonto (240-360)
  const activeIndex = Math.min(2, Math.floor(frame / 120));
  const subFrame = frame % 120;

  const mockupSpring = spring({
    frame: subFrame,
    fps,
    config: { damping: 14, mass: 0.9 },
  });

  const showcases = [
    {
      image: 'captures/burger_mobile.png',
      badge: 'Hamburgueria & Gastrobar',
      badgeColor: '#F59E0B',
      headline: 'Venda direto no WhatsApp',
      highlight: 'Livre-se dos 27% de taxas abusivas de aplicativos.',
      pillText: '💰 LUCRO 100% SEU',
    },
    {
      image: 'captures/barber_mobile.png',
      badge: 'Barbearia & Estética',
      badgeColor: '#3B82F6',
      headline: 'Agendamentos Rápidos',
      highlight: 'Tabela de serviços e horários sem filas ou espera.',
      pillText: '💈 AGENDA LOTADA',
    },
    {
      image: 'captures/dental_mobile.png',
      badge: 'Clínica & Consultório',
      badgeColor: '#10B981',
      headline: 'Consultas Particulares',
      highlight: 'Autoridade profissional e credibilidade imediata.',
      pillText: '🩺 PACIENTES PARTICULARES',
    },
  ];

  const current = showcases[activeIndex];

  const exitFade = interpolate(subFrame, [105, 120], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 30%, #111A2E 0%, #03060E 100%)',
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
        opacity: exitFade,
      }}
    >
      {/* Top Header */}
      <div style={{ maxWidth: 880 }}>
        <div
          style={{
            display: 'inline-block',
            background: `${current.badgeColor}22`,
            border: `1.5px solid ${current.badgeColor}77`,
            padding: '8px 22px',
            borderRadius: 30,
            fontSize: 20,
            fontWeight: 800,
            color: current.badgeColor,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 16,
          }}
        >
          {current.pillText}
        </div>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.2,
            margin: '0 0 10px 0',
            textTransform: 'uppercase',
          }}
        >
          {current.headline}
        </h2>
        <p style={{ fontSize: 22, color: '#94A3B8', margin: 0 }}>
          {current.highlight}
        </p>
      </div>

      {/* Mockup do Celular com a Landing Page Real */}
      <div
        style={{
          transform: `scale(${mockupSpring})`,
          margin: '20px 0 40px 0',
        }}
      >
        <PhoneMockup
          imageSrc={current.image}
          badgeText={current.badge}
          badgeColor={current.badgeColor}
          scale={1.22}
        />
      </div>

      {/* Rodapé explicativo */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 32px',
          borderRadius: 24,
          fontSize: 20,
          fontWeight: 600,
          color: '#E2E8F0',
          display: 'flex',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <span>⚡ Carregamento em 0.8s</span>
        <span>•</span>
        <span>📱 100% Responsivo</span>
        <span>•</span>
        <span>💬 Botão WhatsApp Direto</span>
      </div>
    </div>
  );
};
