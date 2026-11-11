import React from 'react';
import { Series, Audio, staticFile } from 'remotion';
import { BackgroundScrollWebsites } from './BackgroundScrollWebsites';
import { GoogleSearchSim } from './GoogleSearchSim';
import { WhatsAppLiveCard } from './WhatsAppLiveCard';
import { PromoBadge3D } from './PromoBadge3D';
import { MetaAdsActionCta } from './MetaAdsActionCta';

export const MetaAds15sComposition: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#040711',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Trilha Sonora e Narração Thalita 15s */}
      <Audio src={staticFile('audio/audio_meta_ads_15s.mp3')} />

      {/* Fundo Vivo com as Landing Pages Reais Rolando em 3D */}
      <BackgroundScrollWebsites totalDurationFrames={450} opacity={0.92} />

      {/* Luz ambiente de destaque */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.16)',
          filter: 'blur(160px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Cenas em Primeiro Plano */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        <Series>
          {/* Cena 1 (0 a 140 frames / 4.6s): Gancho + Busca Google Simulada */}
          <Series.Sequence durationInFrames={140}>
            <div
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  background: 'rgba(4, 9, 22, 0.72)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 36,
                  padding: '48px 36px 54px',
                  border: '1.5px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 940,
                }}
              >
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1.5px solid rgba(239, 68, 68, 0.6)',
                    color: '#FCA5A5',
                    padding: '8px 24px',
                    borderRadius: 30,
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 20,
                  }}
                >
                  ⚠️ VOCÊ ESTÁ PERDENDO CLIENTES
                </div>
                <h1
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 36,
                    maxWidth: 840,
                    textShadow: '0 4px 24px rgba(0,0,0,0.95)',
                  }}
                >
                  Tem um Negócio, mas <span style={{ color: '#38BDF8' }}>não tem site?</span>
                </h1>
                <GoogleSearchSim
                  queryText="melhor profissional perto de mim"
                  businessName="Seu Negócio no Topo do Google"
                />
              </div>
            </div>
          </Series.Sequence>

          {/* Cena 2 (140 a 300 frames / 5.3s): Solução + WhatsApp Notification */}
          <Series.Sequence durationInFrames={160}>
            <div
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  background: 'rgba(4, 9, 22, 0.72)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 36,
                  padding: '48px 36px 54px',
                  border: '1.5px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 940,
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1.5px solid #10B981',
                    color: '#34D399',
                    padding: '8px 24px',
                    borderRadius: 30,
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 20,
                  }}
                >
                  💰 VENDA DIRETA SEM TAXAS
                </div>
                <h1
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 36,
                    maxWidth: 840,
                    textShadow: '0 4px 24px rgba(0,0,0,0.95)',
                  }}
                >
                  Receba Pedidos e Agendamentos no{' '}
                  <span style={{ color: '#10B981' }}>WhatsApp</span>
                </h1>
                <WhatsAppLiveCard
                  customerName="Cliente Local (Google)"
                  messageText="Olá! Vi o site de vocês e quero fechar o serviço agora!"
                  orderTotal="R$ 0 em Taxas"
                />
              </div>
            </div>
          </Series.Sequence>

          {/* Cena 3 (300 a 450 frames / 5.1s): Oferta Novembro 15% OFF + CTA */}
          <Series.Sequence durationInFrames={150}>
            <div
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 48px',
                textAlign: 'center',
              }}
            >
              <PromoBadge3D />
              <div style={{ marginTop: 36, width: '100%' }}>
                <MetaAdsActionCta />
              </div>
            </div>
          </Series.Sequence>
        </Series>
      </div>
    </div>
  );
};
