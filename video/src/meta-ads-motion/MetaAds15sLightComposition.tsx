import React from 'react';
import { Series, Audio, staticFile } from 'remotion';
import { BackgroundScrollWebsitesLight } from './BackgroundScrollWebsitesLight';
import { GoogleSearchSim } from './GoogleSearchSim';
import { WhatsAppLiveCard } from './WhatsAppLiveCard';
import { PromoBadge3D } from './PromoBadge3D';
import { MetaAdsActionCta } from './MetaAdsActionCta';

export const MetaAds15sLightComposition: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Trilha Sonora e Narração Thalita 15s */}
      <Audio src={staticFile('audio/audio_meta_ads_15s.mp3')} />

      {/* Fundo Vivo com as Landing Pages Reais Claras Rolando em 3D */}
      <BackgroundScrollWebsitesLight totalDurationFrames={450} opacity={0.90} />

      {/* Luz ambiente de destaque corporativa */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.08)',
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
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: 36,
                  padding: '48px 36px 54px',
                  border: '1.5px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12), 0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 940,
                }}
              >
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1.5px solid #FCA5A5',
                    color: '#DC2626',
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
                    color: '#0F172A',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 36,
                    maxWidth: 840,
                  }}
                >
                  Tem um Negócio, mas <span style={{ color: '#2563EB' }}>não tem site?</span>
                </h1>
                <GoogleSearchSim
                  theme="light"
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
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: 36,
                  padding: '48px 36px 54px',
                  border: '1.5px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12), 0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 940,
                }}
              >
                <div
                  style={{
                    background: '#ECFDF5',
                    border: '1.5px solid #A7F3D0',
                    color: '#059669',
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
                    color: '#0F172A',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 36,
                    maxWidth: 840,
                  }}
                >
                  Receba Pedidos e Agendamentos no{' '}
                  <span style={{ color: '#059669' }}>WhatsApp</span>
                </h1>
                <WhatsAppLiveCard
                  theme="light"
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
                padding: '60px 40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: 36,
                  padding: '40px 36px 44px',
                  border: '1.5px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12), 0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 940,
                }}
              >
                <PromoBadge3D theme="light" />
                <div style={{ marginTop: 28, width: '100%' }}>
                  <MetaAdsActionCta theme="light" />
                </div>
              </div>
            </div>
          </Series.Sequence>
        </Series>
      </div>
    </div>
  );
};
