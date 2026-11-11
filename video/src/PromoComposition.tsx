import React from 'react';
import { Series } from 'remotion';
import { HookScene } from './scenes/HookScene';
import { BrandScene } from './scenes/BrandScene';
import { FeaturesScene } from './scenes/FeaturesScene';
import { CtaScene } from './scenes/CtaScene';

interface PromoCompositionProps {
  isVertical?: boolean;
}

export const PromoComposition: React.FC<PromoCompositionProps> = ({ isVertical = false }) => {
  return (
    <Series>
      {/* Cena 1: Gancho / Dor (Frames 0 a 180 = 6s) */}
      <Series.Sequence durationInFrames={180}>
        <HookScene isVertical={isVertical} />
      </Series.Sequence>

      {/* Cena 2: Marca RP Solutions (Frames 180 a 360 = 6s) */}
      <Series.Sequence durationInFrames={180}>
        <BrandScene isVertical={isVertical} />
      </Series.Sequence>

      {/* Cena 3: Demonstração de 3 Produtos / Diferenciais (Frames 360 a 720 = 12s) */}
      <Series.Sequence durationInFrames={360}>
        <FeaturesScene isVertical={isVertical} />
      </Series.Sequence>

      {/* Cena 4: Chamada para Ação CTA (Frames 720 a 900 = 6s) */}
      <Series.Sequence durationInFrames={180}>
        <CtaScene isVertical={isVertical} />
      </Series.Sequence>
    </Series>
  );
};
