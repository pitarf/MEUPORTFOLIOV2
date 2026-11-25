import React from 'react';
import { Link } from 'react-router-dom';
import ramiellMonogram from '@/assets/brand/ramiell-monogram.png';

/**
 * Componente oficial de logotipo da marca RAMIELL
 * Composto por monograma 'R' dourado sem fundo + wordmark 'RAMIELL' em caixa alta com letter-spacing 0.2em.
 * Suporta perfeitamente temas Claro e Escuro com zero fundo preto.
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl' | 'hero' (default: 'md')
 * - subtitle: string opcional (ex: 'DIGITAL EXPERIENCES' ou 'SOLUÇÕES DIGITAIS')
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
    // Escalas de tamanho para o monograma e wordmark editorial
    const sizeMap = {
        sm: {
            mark: 'w-6 h-6',
            wordmark: 'text-sm tracking-[0.2em]',
            sub: 'text-[10px] tracking-widest text-[#666666] dark:text-[#9E9E9E]',
            gap: 'gap-2.5',
        },
        md: {
            mark: 'w-8 h-8',
            wordmark: 'text-base sm:text-lg tracking-[0.2em]',
            sub: 'text-xs tracking-widest text-[#666666] dark:text-[#9E9E9E]',
            gap: 'gap-3',
        },
        lg: {
            mark: 'w-12 h-12',
            wordmark: 'text-2xl sm:text-3xl tracking-[0.2em]',
            sub: 'text-xs sm:text-sm tracking-widest text-[#666666] dark:text-[#9E9E9E]',
            gap: 'gap-4',
        },
        xl: {
            mark: 'w-16 h-16',
            wordmark: 'text-4xl sm:text-5xl tracking-[0.2em]',
            sub: 'text-sm sm:text-base tracking-widest text-[#666666] dark:text-[#9E9E9E]',
            gap: 'gap-5',
        },
        hero: {
            mark: 'w-20 h-20 sm:w-28 sm:h-28',
            wordmark: 'text-4xl sm:text-6xl md:text-7xl tracking-[0.2em]',
            sub: 'text-xs sm:text-sm tracking-[0.25em] text-[#666666] dark:text-[#9E9E9E]',
            gap: 'gap-4 sm:gap-6',
        }
    };

    const currentSize = sizeMap[size] || sizeMap.md;
    const finalSubtitle = subtitle || (showSubtitle ? 'DIGITAL EXPERIENCES' : null);

    // Renderização visual da marca RAMIELL (fundo 100% transparente)
    const logoContent = (
        <div className={`inline-flex items-center select-none font-sans ${currentSize.gap} ${className}`}>
            {/* Monograma Dourado "R" com Fundo 100% Transparente */}
            <div className={`relative flex items-center justify-center shrink-0 ${currentSize.mark}`}>
                <img
                    src={ramiellMonogram}
                    alt="RAMIELL"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(201,162,39,0.25)]"
                />
            </div>

            {/* Wordmark Tipográfico em Caixa Alta Adaptativo ao Tema */}
            <div className="flex flex-col justify-center leading-none">
                <span className={`font-semibold uppercase text-[#0C0C0C] dark:text-white font-sans transition-colors duration-300 ${currentSize.wordmark}`}>
                    RAMIELL
                </span>
                {finalSubtitle && (
                    <span className={`uppercase font-mono mt-1 ${currentSize.sub}`}>
                        {finalSubtitle}
                    </span>
                )}
            </div>
        </div>
    );

    if (asLink) {
        return (
            <Link to="/" className="inline-flex items-center group focus:outline-none transition-opacity hover:opacity-90">
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

export default BrandLogo;
