import React from 'react';
import { Series, Audio, staticFile } from 'remotion';
import { BackgroundScrollWebsitesLight } from './BackgroundScrollWebsitesLight';
import { GoogleSearchSim } from './GoogleSearchSim';
import { BeforeAfterCard } from './BeforeAfterCard';
import { WhatsAppLiveCard } from './WhatsAppLiveCard';
import { PromoBadge3D } from './PromoBadge3D';
import { MetaAdsActionCta } from './MetaAdsActionCta';

export const MetaAds30sLightComposition: React.FC = () => {
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
      {/* Trilha Sonora e Narração Thalita 30s */}
      <Audio src={staticFile('audio/audio_meta_ads_30s.mp3')} />

      {/* Fundo Vivo com as Landing Pages Reais Claras Rolando em 3D */}
      <BackgroundScrollWebsitesLight totalDurationFrames={900} opacity={0.90} />

      {/* Luz ambiente de fundo corporativa */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '30%',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.08)',
          filter: 'blur(170px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Cenas em Primeiro Plano */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        <Series>
          {/* Cena 1 (0 a 180 frames / 6s): Dado Real 46% do Google + Busca */}
          <Series.Sequence durationInFrames={180}>
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
                    background: '#EFF6FF',
                    border: '1.5px solid #BFDBFE',
                    color: '#1D4ED8',
                    padding: '8px 24px',
                    borderRadius: 30,
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 20,
                  }}
                >
                  📊 DADOS OFICIAIS DO GOOGLE
                </div>
                <h1
                  style={{
                    fontSize: 50,
                    fontWeight: 900,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 36,
                    maxWidth: 840,
                  }}
                >
                  <span style={{ color: '#2563EB' }}>46% das buscas</span> no Google procuram negócios locais
                </h1>
                <GoogleSearchSim
                  theme="light"
                  queryText="delivery perto de mim"
                  businessName="Iron Burger & Gastrobar"
                />
              </div>
            </div>
          </Series.Sequence>

          {/* Cena 2 (180 a 360 frames / 6s): Comparativo Sem Site vs Com Site */}
          <Series.Sequence durationInFrames={180}>
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
                  padding: '44px 32px 50px',
                  border: '1.5px solid rgba(226, 232, 240, 0.95)',
                  boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12), 0 10px 25px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 960,
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
                  ⚔️ NÃO PERCA PARA A CONCORRÊNCIA
                </div>
                <h1
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 32,
                    maxWidth: 840,
                  }}
                >
                  Pare de depender só de rede social e <span style={{ color: '#DC2626' }}>taxas de app</span>
                </h1>
                <BeforeAfterCard theme="light" />
              </div>
            </div>
          </Series.Sequence>

          {/* Cena 3 (360 a 540 frames / 6s): WhatsApp Live Card + Velocidade */}
          <Series.Sequence durationInFrames={180}>
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
                  ⚡ CONVERSÃO IMEDIATA
                </div>
                <h1
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    marginBottom: 32,
                    maxWidth: 840,
                  }}
                >
                  Landing Pages Rápidas com <span style={{ color: '#059669' }}>Botão de WhatsApp</span>
                </h1>
                <WhatsAppLiveCard
                  theme="light"
                  customerName="Dra. Camila (Paciente Novo)"
                  messageText="Olá! Gostaria de agendar uma consulta particular para esta semana."
                  orderTotal="R$ 350,00 • Consulta"
                  nichePill="AGENDA PARTICULAR • 100% DIRETO"
                />
              </div>
            </div>
          </Series.Sequence>

          {/* Cena 4 (540 a 720 frames / 6s): Oferta Black Novembro 15% OFF */}
          <Series.Sequence durationInFrames={180}>
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
                <PromoBadge3D theme="light" />
              </div>
            </div>
          </Series.Sequence>

          {/* Cena 5 (720 a 900 frames / 6s): Super CTA WhatsApp */}
          <Series.Sequence durationInFrames={180}>
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
                <MetaAdsActionCta theme="light" />
              </div>
            </div>
          </Series.Sequence>
        </Series>
      </div>
    </div>
  );
};
