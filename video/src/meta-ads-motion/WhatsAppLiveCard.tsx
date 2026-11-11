import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface WhatsAppLiveCardProps {
  customerName?: string;
  messageText?: string;
  orderTotal?: string;
  nichePill?: string;
  theme?: 'light' | 'dark';
}

export const WhatsAppLiveCard: React.FC<WhatsAppLiveCardProps> = ({
  customerName = 'Novo Cliente (Google)',
  messageText = 'Olá! Achei o site de vocês no Google e quero fechar o serviço hoje mesmo!',
  orderTotal = 'R$ 297,00',
  nichePill = 'LEAD QUALIFICADO • VENDA DIRETA',
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const checkSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  return (
    <div
      style={{
        transform: `scale(${cardSpring})`,
        width: '100%',
        maxWidth: 880,
        background: isLight
          ? '#FFFFFF'
          : 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(2, 44, 34, 0.98) 100%)',
        border: '2px solid #10B981',
        borderRadius: 36,
        padding: '36px 40px',
        boxShadow: isLight
          ? '0 25px 60px rgba(16, 185, 129, 0.18), 0 10px 25px rgba(15, 23, 42, 0.08)'
          : '0 30px 70px rgba(0, 0, 0, 0.7), 0 0 50px rgba(16, 185, 129, 0.3)',
        color: isLight ? '#0F172A' : '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Luz ambiente verde */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: isLight ? 'rgba(16, 185, 129, 0.10)' : 'rgba(52, 211, 153, 0.2)',
          filter: 'blur(60px)',
        }}
      />

      {/* Topo do Card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              boxShadow: '0 0 20px rgba(37, 211, 102, 0.5)',
            }}
          >
            💬
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: isLight ? '#0F172A' : '#FFFFFF' }}>
              WhatsApp Business
            </div>
            <div style={{ fontSize: 16, color: isLight ? '#059669' : '#6EE7B7', fontWeight: 600 }}>
              Notificação Instantânea do Site
            </div>
          </div>
        </div>

        <span
          style={{
            background: isLight ? '#ECFDF5' : 'rgba(255, 255, 255, 0.15)',
            border: isLight ? '1px solid #A7F3D0' : 'none',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            color: isLight ? '#065F46' : '#A7F3D0',
          }}
        >
          {nichePill}
        </span>
      </div>

      {/* Balão da Mensagem */}
      <div
        style={{
          background: isLight ? '#F8FAFC' : 'rgba(15, 23, 42, 0.85)',
          border: isLight ? '1.5px solid #E2E8F0' : '1.5px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 24,
          padding: '24px 28px',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 16, color: isLight ? '#059669' : '#34D399', fontWeight: 700, marginBottom: 6 }}>
          {customerName}
        </div>
        <div style={{ fontSize: 24, color: isLight ? '#1E293B' : '#F1F5F9', lineHeight: 1.4, fontWeight: 600 }}>
          "{messageText}"
        </div>
      </div>

      {/* Rodapé com Economia e Checkmark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              transform: `scale(${checkSpring})`,
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            ✓
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
              Taxa de Intermediação: R$ 0,00
            </div>
            <div style={{ fontSize: 14, color: isLight ? '#059669' : '#6EE7B7', fontWeight: 600 }}>
              Sem comissões de 27% para aplicativos terceiros
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#10B981',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 16,
            fontSize: 18,
            fontWeight: 900,
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
          }}
        >
          {orderTotal}
        </div>
      </div>
    </div>
  );
};
