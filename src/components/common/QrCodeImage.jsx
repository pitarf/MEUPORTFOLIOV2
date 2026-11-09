import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode as QrCodeIcon } from 'lucide-react';

/**
 * QrCodeImage: Componente de altíssima confiabilidade para renderização de QR Code PIX 100% Client-Side.
 * Utiliza geração vetorial SVG nativa via `qrcode.react`, garantindo que o QR Code seja exibido
 * instantaneamente em qualquer dispositivo, tela de alta densidade (Retina) ou impressão PDF,
 * sem requisições a APIs externas e com fallback automático caso uma imagem base64 pré-gerada falhe.
 *
 * @param {object} props
 * @param {string} [props.value] - Código Copia e Cola / Payload PIX a ser convertido
 * @param {string} [props.imageBase64] - Imagem pré-gerada em base64 vinda do gateway
 * @param {number} [props.size=220] - Tamanho em pixels (largura e altura)
 * @param {string} [props.className=''] - Classes Tailwind adicionais
 * @param {string} [props.alt='QR Code PIX'] - Texto alternativo de acessibilidade
 * @param {string} [props.crossOrigin] - Propriedade crossOrigin para geração de PDFs
 */
export default function QrCodeImage({
    value = '',
    imageBase64 = null,
    size = 220,
    className = '',
    alt = 'QR Code PIX',
    crossOrigin = undefined
}) {
    const [imageLoadError, setImageLoadError] = useState(false);

    const cleanValue = typeof value === 'string' ? value.trim() : '';

    // 1. Se recebemos uma imagem pré-gerada em base64 e ela não falhou ao carregar
    const hasValidBase64 = Boolean(
        !imageLoadError &&
        imageBase64 &&
        typeof imageBase64 === 'string' &&
        imageBase64.trim().length > 30 &&
        (imageBase64.startsWith('data:image') || !imageBase64.startsWith('http'))
    );

    if (hasValidBase64) {
        const formattedSrc = imageBase64.startsWith('data:')
            ? imageBase64
            : `data:image/png;base64,${imageBase64.trim()}`;

        return (
            <img
                src={formattedSrc}
                alt={alt}
                crossOrigin={crossOrigin}
                onError={() => {
                    console.warn('[QrCodeImage] Imagem Base64 falhou, acionando fallback SVG do payload.');
                    setImageLoadError(true);
                }}
                style={{ width: size, height: size }}
                className={`object-contain bg-white rounded-lg ${className}`}
            />
        );
    }

    // 2. Renderização direta em SVG vetorial puro a partir do código Copia e Cola (100% confiável e instantâneo)
    if (cleanValue && cleanValue.length > 5) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`bg-white p-2 rounded-lg flex items-center justify-center shadow-xs ${className}`}
            >
                <QRCodeSVG
                    value={cleanValue}
                    size={Math.max(32, size - 16)}
                    level="M"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    className="w-full h-full max-w-full max-h-full"
                />
            </div>
        );
    }

    // 3. Fallback visual caso nem o payload nem a imagem estejam disponíveis
    return (
        <div
            style={{ width: size, height: size }}
            className={`flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 text-slate-400 p-2 text-center ${className}`}
        >
            <QrCodeIcon className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-xs">QR Code indisponível</span>
        </div>
    );
}
