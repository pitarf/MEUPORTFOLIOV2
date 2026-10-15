import React from 'react';

/**
 * Componente do Logotipo Oficial do WhatsApp
 * Suporta modo imagem oficial (fidelidade 100% ao ativo fornecido)
 * e modo SVG vetorial ultra leve escalável.
 * 
 * Props:
 * - className: classes Tailwind para dimensões e estilos
 * - useImage: boolean para renderizar a imagem PNG oficial de alta resolução
 * - alt: texto alternativo para acessibilidade
 */
export default function WhatsAppIcon({
  className = 'w-6 h-6',
  useImage = true,
  alt = 'WhatsApp'
}) {
  if (useImage) {
    return (
      <img
        src="/whatsapp-official.png"
        alt={alt}
        className={`object-contain flex-shrink-0 select-none pointer-events-none ${className}`}
        loading="lazy"
        draggable={false}
      />
    );
  }

  // SVG vetorial da Logo Oficial do WhatsApp
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 175.216 175.552"
      className={`fill-current flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M87.184 0C39.027 0 0 39.043 0 87.216c0 15.398 4.024 30.437 11.666 43.688L.471 175.552l45.748-11.996c12.756 6.953 27.126 10.634 40.965 10.634 48.157 0 87.184-39.043 87.184-87.216C174.368 39.043 135.341 0 87.184 0zm0 159.516c-13.069 0-25.864-3.515-37.009-10.158l-2.654-1.577-27.525 7.218 7.346-26.837-1.731-2.755c-7.29-11.6-11.139-25.074-11.139-38.191 0-40.007 32.55-72.57 72.712-72.57 19.435 0 37.702 7.575 51.442 21.325 13.739 13.75 21.309 32.03 21.303 51.464-.002 40.015-32.554 72.581-72.745 72.581zm39.882-54.492c-2.186-1.094-12.932-6.38-14.938-7.109-2.006-.729-3.468-1.094-4.93 1.094s-5.669 7.109-6.945 8.568c-1.277 1.459-2.554 1.641-4.74 0-2.186-1.094-9.227-3.401-17.576-10.844-6.497-5.792-10.884-12.946-12.16-15.132s-.136-3.374.957-4.461c.983-.98 2.186-2.554 3.28-3.831s1.459-2.186 2.186-3.645.365-2.734-.182-3.831c-.547-1.094-4.93-11.879-6.755-16.27-1.776-4.275-3.585-3.695-4.93-3.763-1.277-.065-2.734-.078-4.193-.078s-3.831.547-5.837 2.734c-2.006 2.186-7.662 7.487-7.662 18.254s7.844 21.171 8.938 22.63c1.094 1.459 15.438 23.575 37.404 33.064 5.225 2.257 9.305 3.605 12.486 4.615 5.247 1.666 10.021 1.431 13.796.868 4.208-.627 12.932-5.289 14.757-10.393 1.824-5.104 1.824-9.48 1.277-10.393-.547-.913-2.006-1.459-4.193-2.554z"
      />
    </svg>
  );
}
