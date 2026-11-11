import React from 'react';
import { Img, staticFile, interpolate, useCurrentFrame } from 'remotion';

interface PhoneMockupProps {
  imageSrc: string;
  badgeText?: string;
  badgeColor?: string;
  scrollAmount?: number; // porcentagem de scroll vertical
  scale?: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  imageSrc,
  badgeText,
  badgeColor = '#3B82F6',
  scrollAmount = 15,
  scale = 1,
}) => {
  const frame = useCurrentFrame();

  // Efeito suave de rolagem do conteúdo dentro da tela do celular
  const scrollY = interpolate(frame % 90, [0, 45, 90], [0, -scrollAmount, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        position: 'relative',
        width: 380,
        height: 720,
        borderRadius: 44,
        background: '#090D16',
        padding: 12,
        boxShadow:
          '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.25), inset 0 0 0 2px #2A364F',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Notch / Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 110,
          height: 22,
          borderRadius: 20,
          background: '#030712',
          zIndex: 30,
          boxShadow: 'inset 0 0 4px rgba(255,255,255,0.1)',
        }}
      />

      {/* Tela do Celular */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 34,
          overflow: 'hidden',
          position: 'relative',
          background: '#0F172A',
        }}
      >
        <div
          style={{
            width: '100%',
            transform: `translateY(${scrollY}%)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* Badge Flutuante de Categoria */}
      {badgeText && (
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: badgeColor,
            color: '#FFFFFF',
            padding: '8px 20px',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: 'uppercase',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 20px ' + badgeColor + '88',
            whiteSpace: 'nowrap',
            zIndex: 40,
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          {badgeText}
        </div>
      )}
    </div>
  );
};
