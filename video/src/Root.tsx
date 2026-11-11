import React from 'react';
import { Composition } from 'remotion';
import { MetaAds15sComposition } from './meta-ads-motion/MetaAds15sComposition';
import { MetaAds30sComposition } from './meta-ads-motion/MetaAds30sComposition';
import { MetaAds15sLightComposition } from './meta-ads-motion/MetaAds15sLightComposition';
import { MetaAds30sLightComposition } from './meta-ads-motion/MetaAds30sLightComposition';
import {
  StoryDelivery,
  StoryBarbearia,
  StoryClinica,
  StoryAdvocacia,
} from './stories/StoryCompositions';
import { PromoComposition } from './PromoComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* --- ARTES ESTÁTICAS PARA STORIES 9:16 (1080x1920) --- */}
      <Composition
        id="StoryDelivery"
        component={StoryDelivery}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryBarbearia"
        component={StoryBarbearia}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryClinica"
        component={StoryClinica}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryAdvocacia"
        component={StoryAdvocacia}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* --- VÍDEOS META ADS --- */}
      {/* Vídeo Meta Ads 15 Segundos - Escuro (Reels/Stories/TikTok) */}
      <Composition
        id="MetaAds15s"
        component={MetaAds15sComposition}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Vídeo Meta Ads 30 Segundos - Escuro (Reels/Feed) */}
      <Composition
        id="MetaAds30s"
        component={MetaAds30sComposition}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Vídeo Meta Ads 15 Segundos - Tema Claro Ultra-Premium (Reels/Stories/TikTok) */}
      <Composition
        id="MetaAds15sLight"
        component={MetaAds15sLightComposition}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Vídeo Meta Ads 30 Segundos - Tema Claro Ultra-Premium (Reels/Feed) */}
      <Composition
        id="MetaAds30sLight"
        component={MetaAds30sLightComposition}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Composição Institucional Vertical 30s */}
      <Composition
        id="PromoVertical"
        component={PromoComposition}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          isVertical: true,
        }}
      />

      {/* Composição Institucional Horizontal 30s */}
      <Composition
        id="PromoHorizontal"
        component={PromoComposition}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          isVertical: false,
        }}
      />
    </>
  );
};
