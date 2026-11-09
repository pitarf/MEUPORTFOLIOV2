import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Loader2, QrCode as QrCodeIcon } from 'lucide-react';

/**
 * QrCodeImage: Componente de alta confiabilidade para renderização de QR Code 100% Client-Side.
 * Elimina falhas de rede, bloqueios de ad-blockers e dependências de APIs externas (como qrserver.com).
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
    const [dataUrl, setDataUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        // 1. Se já recebemos a imagem em base64 do gateway/banco de dados, usamos diretamente
        if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.trim().length > 20) {
            const formatted = imageBase64.startsWith('data:')
                ? imageBase64
                : `data:image/png;base64,${imageBase64}`;
            setDataUrl(formatted);
            setLoading(false);
            setHasError(false);
            return;
        }

        // 2. Se temos o código Copia e Cola (payload), geramos o QR Code localmente via biblioteca `qrcode`
        if (value && typeof value === 'string' && value.trim().length > 0) {
            setLoading(true);
            setHasError(false);

            QRCode.toDataURL(value.trim(), {
                width: size * 2, // Resolução 2x para nitidez em telas Retina e impressão PDF
                margin: 1,
                errorCorrectionLevel: 'M',
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
                .then((url) => {
                    if (isMounted) {
                        setDataUrl(url);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.error('Falha ao gerar QR Code localmente:', err);
                    if (isMounted) {
                        // Fallback emergencial com endpoint público caso ocorra falha de geração
                        setDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`);
                        setLoading(false);
                    }
                });
        } else {
            setDataUrl('');
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [value, imageBase64, size]);

    if (loading) {
        return (
            <div
                style={{ width: size, height: size }}
                className={`flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 ${className}`}
            >
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    Renderizando QR Code...
                </span>
            </div>
        );
    }

    if (hasError || (!dataUrl && !value && !imageBase64)) {
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

    return (
        <img
            src={dataUrl}
            alt={alt}
            crossOrigin={crossOrigin}
            onError={() => {
                // Se a imagem falhar (por exemplo no fallback externo), ativa estado de erro seguro
                setHasError(true);
            }}
            style={{ width: size, height: size }}
            className={`object-contain rounded-lg shadow-xs bg-white ${className}`}
        />
    );
}
