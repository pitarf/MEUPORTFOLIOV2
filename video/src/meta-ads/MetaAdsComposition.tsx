import React from 'react';
import { Series, Audio, staticFile } from 'remotion';
import { HookAgitationScene } from './scenes/HookAgitationScene';
import { ResearchDataScene } from './scenes/ResearchDataScene';
import { NicheShowcaseScene } from './scenes/NicheShowcaseScene';
import { DesktopAuthorityScene } from './scenes/DesktopAuthorityScene';
import { NovemberOfferScene } from './scenes/NovemberOfferScene';
import { MetaAdsCtaScene } from './scenes/MetaAdsCtaScene';

export const MetaAdsComposition: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
      }}
    >
      {/* Trilha Sonora e Narração Sincronizada com voz da Thalita Multilingual */}
      <Audio src={staticFile('audio/audio_meta_ads_final.mp3')} />

      {/* Sequência Sequencial de Cenas (Total: 1532 frames / 51.06s) */}
      <Series>
        {/* Cena 1: Gancho e Agitação (5.8s) */}
        <Series.Sequence durationInFrames={175}>
          <HookAgitationScene />
        </Series.Sequence>

        {/* Cena 2: Pesquisa Real do Google (8.7s) */}
        <Series.Sequence durationInFrames={260}>
          <ResearchDataScene />
        </Series.Sequence>

        {/* Cena 3: Vitrine dos Nichos com Mockups Celular (11.7s) */}
        <Series.Sequence durationInFrames={350}>
          <NicheShowcaseScene />
        </Series.Sequence>

        {/* Cena 4: Autoridade Desktop, SEO e Performance (9.7s) */}
        <Series.Sequence durationInFrames={290}>
          <DesktopAuthorityScene />
        </Series.Sequence>

        {/* Cena 5: Oferta de Novembro (15% OFF + Condições) (10.5s) */}
        <Series.Sequence durationInFrames={315}>
          <NovemberOfferScene />
        </Series.Sequence>

        {/* Cena 6: CTA Final com WhatsApp e Saiba Mais (4.7s) */}
        <Series.Sequence durationInFrames={142}>
          <MetaAdsCtaScene />
        </Series.Sequence>
      </Series>
    </div>
  );
};
