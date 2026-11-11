import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface FeaturesSceneProps {
  isVertical?: boolean;
}

export const FeaturesScene: React.FC<FeaturesSceneProps> = ({ isVertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3 blocos de 120 frames (4 segundos cada)
  const activeIndex = Math.min(2, Math.floor(frame / 120));
  const subFrame = frame % 120;

  const cardSpring = spring({
    frame: subFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 130,
    },
  });

  const features = [
    {
      badge: 'PRODUTO 01',
      badgeColor: '#F59E0B',
      title: 'Landing Pages Ultra-Rápidas',
      subtitle: 'Estruturas de altíssima conversão para Odontologia, Hamburguerias, Barbearias, Psicologia e Advocacia.',
      highlight: 'Livre das taxas de 27% dos apps • Pedidos direto no WhatsApp',
      metric: '0.8s carregamento',
    },
    {
      badge: 'PRODUTO 02',
      badgeColor: '#10B981',
      title: 'Radar Google Maps B2B',
      subtitle: 'Minere empresas locais bem avaliadas sem site oficial e dispare propostas comerciais com 1 clique.',
      highlight: 'Geração instantânea de protótipo de R$ 297 por nicho',
      metric: '100% Leads Reais',
    },
    {
      badge: 'PRODUTO 03',
      badgeColor: '#38BDF8',
      title: 'Assinaturas & Cobrança PIX',
      subtitle: 'Portal do cliente sem senha com geração de QR Code nativo em SVG e confirmação instantânea de pagamento.',
      highlight: 'Gestão completa de faturas, recibos em PDF e tickets',
      metric: 'Automação Total',
    },
  ];

  const current = features[activeIndex];

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
        position: 'relative',
        overflow: 'hidden',
        padding: isVertical ? '40px 60px' : '40px 120px',
        textAlign: 'center',
      }}
    >
      {/* Luz ambiente de fundo reativa ao nicho */}
      <div
        style={{
          position: 'absolute',
          width: isVertical ? 650 : 900,
          height: isVertical ? 650 : 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${current.badgeColor}33 0%, rgba(0, 0, 0, 0) 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Indicador de Etapas */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: isVertical ? 40 : 25,
          zIndex: 1,
        }}
      >
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            style={{
              width: idx === activeIndex ? (isVertical ? 60 : 45) : (isVertical ? 20 : 15),
              height: isVertical ? 8 : 6,
              borderRadius: 999,
              backgroundColor: idx === activeIndex ? current.badgeColor : 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Card da Funcionalidade */}
      <div
        style={{
          transform: `scale(${cardSpring})`,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          border: `1.5px solid ${current.badgeColor}55`,
          borderRadius: isVertical ? 36 : 28,
          padding: isVertical ? '60px 48px' : '48px 56px',
          maxWidth: isVertical ? 850 : 1050,
          width: '100%',
          boxShadow: `0 20px 50px -10px ${current.badgeColor}22`,
          backdropFilter: 'blur(20px)',
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: isVertical ? '10px 22px' : '8px 18px',
            backgroundColor: `${current.badgeColor}22`,
            border: `1px solid ${current.badgeColor}66`,
            color: current.badgeColor,
            borderRadius: 999,
            fontSize: isVertical ? 20 : 15,
            fontWeight: 800,
            letterSpacing: '2px',
            marginBottom: isVertical ? 24 : 16,
          }}
        >
          {current.badge}
        </span>

        <h2
          style={{
            fontSize: isVertical ? 56 : 46,
            fontWeight: 900,
            lineHeight: 1.15,
            margin: '0 0 16px 0',
            letterSpacing: '-1px',
          }}
        >
          {current.title}
        </h2>

        <p
          style={{
            fontSize: isVertical ? 28 : 22,
            color: '#CBD5E1',
            lineHeight: 1.45,
            margin: '0 0 28px 0',
          }}
        >
          {current.subtitle}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 18,
            padding: isVertical ? '22px 24px' : '16px 28px',
          }}
        >
          <span
            style={{
              fontSize: isVertical ? 22 : 18,
              fontWeight: 700,
              color: '#F8FAFC',
            }}
          >
            {current.highlight}
          </span>
          <span
            style={{
              fontSize: isVertical ? 20 : 16,
              fontWeight: 800,
              color: current.badgeColor,
              backgroundColor: `${current.badgeColor}1A`,
              padding: '6px 16px',
              borderRadius: 999,
              border: `1px solid ${current.badgeColor}44`,
            }}
          >
            {current.metric}
          </span>
        </div>
      </div>
    </div>
  );
};
