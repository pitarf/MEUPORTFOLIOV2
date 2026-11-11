import React from 'react';
import { Img, staticFile } from 'remotion';

export interface StoryArtProps {
  nicheTag: string;
  nicheTagColor?: string;
  headlineNiche: string;
  headlineHighlight: string;
  painText: string;
  imageSrc: string;
  imageOffsetY?: number;
  pill1: { icon: string; title: string; subtitle: string };
  pill2: { icon: string; title: string; subtitle: string };
  pill3: { icon: string; title: string; subtitle: string };
  accentColor?: string;
}

export const StoryArt: React.FC<StoryArtProps> = ({
  nicheTag,
  headlineNiche,
  headlineHighlight,
  painText,
  imageSrc,
  imageOffsetY = 0,
  pill1,
  pill2,
  pill3,
  accentColor = '#bcf13b',
}) => {
  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#0a0a08',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '70px 48px 56px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
      }}
    >
      {/* Luz ambiente Neon Lime (#bcf13b) assinatura RP Solutions */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(188, 241, 59, 0.16) 0%, rgba(188, 241, 59, 0) 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
      />

      {/* Luz secundária no rodapé */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(188, 241, 59, 0.12) 0%, rgba(188, 241, 59, 0) 70%)',
          filter: 'blur(140px)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid 3D de perspectiva tech oficial RP Solutions */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          opacity: 0.75,
          pointerEvents: 'none',
        }}
      />

      {/* Formas 3D sutis de vidro translúcido orgânico (liquid glass) */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 40,
          width: 140,
          height: 140,
          borderRadius: '45% 55% 63% 37% / 42% 44% 56% 58%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12), rgba(188, 241, 59, 0.04) 60%, transparent)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          filter: 'blur(1px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 180,
          right: 30,
          width: 180,
          height: 180,
          borderRadius: '58% 42% 38% 62% / 54% 58% 42% 46%',
          background: 'radial-gradient(circle at 70% 30%, rgba(188, 241, 59, 0.14), rgba(255, 255, 255, 0.06) 50%, transparent)',
          border: '1px solid rgba(188, 241, 59, 0.25)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }}
      />

      {/* ============================================================== */}
      {/* 1. TOPO OFICIAL RP SOLUTIONS (Logo 'rp.' + Pílula Neon) */}
      {/* ============================================================== */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            padding: '0 8px',
          }}
        >
          {/* Logotipo Oficial 'rp.' */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                fontWeight: 900,
                fontSize: 44,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              }}
            >
              <span style={{ color: '#FFFFFF' }}>rp</span>
              <span
                style={{
                  color: '#bcf13b',
                  marginLeft: 2,
                  textShadow: '0 0 16px rgba(188, 241, 59, 0.95)',
                }}
              >
                .
              </span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#9da3af',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                marginTop: 6,
              }}
            >
              SOLUÇÕES DIGITAIS
            </span>
          </div>

          {/* Badge Neon 'OPORTUNIDADE EXCLUSIVA' */}
          <div
            style={{
              backgroundColor: '#bcf13b',
              color: '#0a0a08',
              padding: '8px 22px',
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              boxShadow: '0 0 25px rgba(188, 241, 59, 0.55)',
            }}
          >
            OPORTUNIDADE EXCLUSIVA
          </div>
        </div>

        {/* Tag do Nicho */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(188, 241, 59, 0.08)',
            border: '1.5px solid rgba(188, 241, 59, 0.45)',
            color: '#bcf13b',
            padding: '6px 20px',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 16,
            boxShadow: '0 0 20px rgba(188, 241, 59, 0.15)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#bcf13b', boxShadow: '0 0 10px #bcf13b' }} />
          <span>{nicheTag}</span>
        </div>

        {/* Título Principal Brutalista / Cyber */}
        <h1
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
          }}
        >
          {headlineNiche}{' '}
          <span
            style={{
              color: '#bcf13b',
              textShadow: '0 0 35px rgba(188, 241, 59, 0.8)',
            }}
          >
            {headlineHighlight}
          </span>
          ?
        </h1>

        {/* Subtítulo de dor */}
        <p
          style={{
            fontSize: 21,
            fontWeight: 500,
            color: '#9da3af',
            margin: '0 auto',
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          {painText}
        </p>
      </div>

      {/* ============================================================== */}
      {/* 2. ÁREA CENTRAL: CELULAR MOCKUP COM OS CALLOUTS FLUTUANTES */}
      {/* ============================================================== */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '4px 0',
        }}
      >
        {/* Callout Esquerda Superior */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 50,
            background: 'rgba(18, 18, 16, 0.88)',
            backdropFilter: 'blur(24px)',
            border: '1.5px solid #23231f',
            borderRadius: 22,
            padding: '16px 20px',
            maxWidth: 290,
            textAlign: 'left',
            boxShadow: '0 20px 45px rgba(0,0,0,0.85)',
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>{pill1.icon}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
            {pill1.title}
          </div>
          <div style={{ fontSize: 13, color: '#9da3af', fontWeight: 500, lineHeight: 1.3 }}>
            {pill1.subtitle}
          </div>
        </div>

        {/* Callout Direita Centro */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 230,
            background: 'rgba(18, 18, 16, 0.92)',
            backdropFilter: 'blur(24px)',
            border: '1.5px solid #bcf13b',
            borderRadius: 22,
            padding: '16px 20px',
            maxWidth: 290,
            textAlign: 'left',
            boxShadow: '0 20px 45px rgba(0,0,0,0.9), 0 0 30px rgba(188, 241, 59, 0.25)',
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>{pill2.icon}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#bcf13b', marginBottom: 2 }}>
            {pill2.title}
          </div>
          <div style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 500, lineHeight: 1.3 }}>
            {pill2.subtitle}
          </div>
        </div>

        {/* Callout Esquerda Inferior */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 50,
            background: 'rgba(18, 18, 16, 0.88)',
            backdropFilter: 'blur(24px)',
            border: '1.5px solid #23231f',
            borderRadius: 22,
            padding: '16px 20px',
            maxWidth: 290,
            textAlign: 'left',
            boxShadow: '0 20px 45px rgba(0,0,0,0.85)',
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 4 }}>{pill3.icon}</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>
            {pill3.title}
          </div>
          <div style={{ fontSize: 13, color: '#9da3af', fontWeight: 500, lineHeight: 1.3 }}>
            {pill3.subtitle}
          </div>
        </div>

        {/* Moldura do Smartphone Dark Tech com Glow Neon Lime */}
        <div
          style={{
            width: 370,
            height: 720,
            borderRadius: 48,
            background: '#121210',
            padding: 12,
            boxShadow:
              '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(188, 241, 59, 0.3), inset 0 0 0 2px #23231f',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 105,
              height: 22,
              borderRadius: 20,
              background: '#0a0a08',
              zIndex: 30,
              boxShadow: 'inset 0 0 4px rgba(255,255,255,0.1)',
            }}
          />

          {/* Tela interna com a captura real */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 38,
              overflow: 'hidden',
              position: 'relative',
              background: '#0a0a08',
            }}
          >
            <Img
              src={staticFile(imageSrc)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                transform: `translateY(${imageOffsetY}px)`,
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. ÁREA INFERIOR: CARD MONUMENTAL DE OFERTA RP + CTA */}
      {/* ============================================================== */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Card Escuro Obsidiana com Acabamento Neon Lime */}
        <div
          style={{
            background: 'linear-gradient(135deg, #181814 0%, #10100d 100%)',
            border: '2px solid #bcf13b',
            borderRadius: 28,
            padding: '22px 32px',
            boxShadow:
              '0 25px 60px rgba(0,0,0,0.9), 0 0 45px rgba(188, 241, 59, 0.3), inset 0 0 20px rgba(188, 241, 59, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: '#bcf13b',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              🔥 CONDIÇÃO ESPECIAL DE NOVEMBRO
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
              Faça sua Landing Page com
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                marginTop: 2,
                textShadow: '0 0 35px rgba(188, 241, 59, 0.8)',
              }}
            >
              15% OFF
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'flex-end',
            }}
          >
            {/* Tag PIX */}
            <div
              style={{
                backgroundColor: '#bcf13b',
                color: '#0a0a08',
                padding: '8px 18px',
                borderRadius: 14,
                textAlign: 'center',
                boxShadow: '0 0 20px rgba(188, 241, 59, 0.5)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.08em' }}>PAGAMENTO NO PIX</div>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.1 }}>+5% OFF EXTRA</div>
            </div>

            {/* Tag Cartão */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid #23231f',
                padding: '6px 14px',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 700 }}>
                💳 Até 5x Sem Juros
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Ação Estilo Story / Arrasta para Cima */}
        <div
          style={{
            background: 'rgba(18, 18, 16, 0.95)',
            border: '2px solid #bcf13b',
            color: '#FFFFFF',
            padding: '18px 28px',
            borderRadius: 24,
            fontSize: 22,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.9), 0 0 35px rgba(188, 241, 59, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 10,
          }}
        >
          <span style={{ color: '#bcf13b', fontSize: 24 }}>↑</span>
          <span>Arraste para cima ou responda esse story</span>
        </div>

        {/* Rodapé com Telefone e Site */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            fontSize: 17,
            color: '#9da3af',
            fontWeight: 700,
          }}
        >
          <span style={{ color: '#FFFFFF' }}>(21) 96614-9077</span>
          <span>•</span>
          <span style={{ color: '#bcf13b' }}>rafaelpitaoficial.com.br</span>
        </div>
      </div>
    </div>
  );
};
