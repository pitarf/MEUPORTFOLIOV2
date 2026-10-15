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
            text: 'text-2xl',
            dot: 'text-2xl',
            sub: 'text-xs tracking-tight sm:tracking-normal',
            sep: 'text-xs mx-1.5',
            symbolBox: 'h-6',
        },
        md: {
            text: 'text-3xl sm:text-4xl',
            dot: 'text-3xl sm:text-4xl',
            sub: 'text-xs sm:text-sm md:text-base tracking-tight sm:tracking-normal',
            sep: 'text-sm sm:text-base mx-2 sm:mx-2.5',
            symbolBox: 'h-8 sm:h-9',
        },
        lg: {
            text: 'text-5xl sm:text-6xl md:text-7xl',
            dot: 'text-5xl sm:text-6xl md:text-7xl',
            sub: 'text-sm sm:text-lg tracking-tight',
            sep: 'text-base sm:text-lg mx-3',
            symbolBox: 'h-14 sm:h-16',
        },
        xl: {
            text: 'text-6xl sm:text-7xl md:text-8xl',
            dot: 'text-6xl sm:text-7xl md:text-8xl',
            sub: 'text-base sm:text-xl tracking-tight',
            sep: 'text-xl mx-4',
            symbolBox: 'h-24',
        },
        hero: {
            text: 'text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]',
            dot: 'text-7xl sm:text-8xl md:text-9xl lg:text-[10rem]',
            sub: 'text-base sm:text-xl tracking-tight',
            sep: 'text-xl mx-4',
            symbolBox: 'h-32',
        }
    };

    const currentSize = sizeMap[size] || sizeMap.md;
    const finalSubtitle = subtitle || (showSubtitle ? 'Rafael Pita Solutions' : null);

    const logoContent = (
        <div className={`inline-flex items-center select-none font-sans ${className}`}>
            <div className={`flex items-baseline font-black leading-none tracking-tight ${currentSize.text}`}>
                <span className="text-slate-950 dark:text-white font-black hover:opacity-95 transition-opacity">
                    rp
                </span>
                <span className="text-[#bcf13b] font-black inline-block transform hover:scale-110 transition-transform">
                    .
                </span>
            </div>

            {finalSubtitle && (
                <div className="flex items-center min-w-0">
                    <span className={`text-slate-300 dark:text-[#33332d] font-light ${currentSize.sep}`}>
                        |
                    </span>
                    <span className={`font-bold tracking-tight text-slate-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate ${currentSize.sub}`}>
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
