import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente oficial de logotipo da nova identidade visual: 'rp .'
 * Letras 'rp' em branco (#ffffff) e ponto final '.' em verde neon (#bcf13b).
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - subtitle: string opcional (ex: 'DADOS & TECNOLOGIA' ou 'SOLUÇÕES DIGITAIS')
 * - showSubtitle: boolean opcional
 * - asLink: boolean (se true, engloba em um Link para '/')
 * - className: string para estilização adicional do container
 */
const BrandLogo = ({
    size = 'md',
    subtitle,
    showSubtitle = false,
    asLink = false,
    className = ''
}) => {
    // Escalas de tamanho tipográfico e proporção do separador
    const sizeMap = {
        sm: {
            text: 'text-xl',
            dot: 'text-xl',
            sub: 'text-[9px] tracking-widest',
            sep: 'text-xs mx-1.5',
            symbolBox: 'h-6',
        },
        md: {
            text: 'text-2xl sm:text-3xl',
            dot: 'text-2xl sm:text-3xl',
            sub: 'text-[10px] sm:text-xs tracking-widest',
            sep: 'text-sm mx-2',
            symbolBox: 'h-8 sm:h-9',
        },
        lg: {
            text: 'text-4xl sm:text-5xl md:text-6xl',
            dot: 'text-4xl sm:text-5xl md:text-6xl',
            sub: 'text-xs sm:text-sm tracking-widest',
            sep: 'text-base sm:text-lg mx-3',
            symbolBox: 'h-14 sm:h-16',
        },
        xl: {
            text: 'text-5xl sm:text-6xl md:text-7xl',
            dot: 'text-5xl sm:text-6xl md:text-7xl',
            sub: 'text-sm sm:text-base tracking-widest',
            sep: 'text-xl mx-4',
            symbolBox: 'h-20',
        }
    };

    const currentSize = sizeMap[size] || sizeMap.md;
    const finalSubtitle = subtitle || (showSubtitle ? 'DADOS & TECNOLOGIA' : null);

    const logoContent = (
        <div className={`inline-flex items-center select-none font-sans ${className}`}>
            <div className="flex items-baseline font-black leading-none tracking-tight">
                <span className="text-white font-extrabold hover:opacity-95 transition-opacity">
                    rp
                </span>
                <span className="text-[#bcf13b] font-black inline-block transform hover:scale-110 transition-transform">
                    .
                </span>
            </div>

            {finalSubtitle && (
                <div className="flex items-center">
                    <span className={`text-[#23231f] font-light ${currentSize.sep}`}>
                        |
                    </span>
                    <span className={`font-semibold uppercase text-[#9da3af] ${currentSize.sub}`}>
                        {finalSubtitle}
                    </span>
                </div>
            )}
        </div>
    );

    if (asLink) {
        return (
            <Link to="/" className="inline-flex items-center group focus:outline-none">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default BrandLogo;
