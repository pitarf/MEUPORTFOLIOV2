import React from 'react';

/**
 * NutritionWaveDivider: Divisor de transição com ondas orgânicas suaves e assimétricas.
 * Fiel à referência visual do Consultas Brasil enviada pelo usuário:
 * - Desenha uma onda contínua com vale suave à esquerda e crista suave à direita.
 * - Totalmente livre de arcos/cúpulas/elipses ("não é pra ser oval... é ondulado").
 * - Sem linhas retas concorrentes nem gaps brancos.
 * 
 * @param {object} props - Propriedades do componente
 * @param {'top'|'bottom'} [props.position='bottom'] - Posição do divisor (topo ou base da seção)
 * @param {string} [props.toColor='#FFFFFF'] - Cor de preenchimento da onda (destino)
 * @param {boolean} [props.flipX=false] - Inverte horizontalmente a onda para alternar dinamismo entre seções
 * @param {string} [props.className=''] - Classes adicionais para customização
 */
export default function NutritionWaveDivider({
    position = 'bottom',
    toColor = '#FFFFFF',
    flipX = false,
    className = ''
}) {
    const flipClass = flipX ? '-scale-x-100' : '';

    if (position === 'top') {
        // Onda no TOPO de um bloco colorido: preenche o topo com a cor da seção anterior (ex: #FFFFFF)
        return (
            <div
                className={`w-full overflow-hidden leading-none pointer-events-none select-none z-10 relative -mt-px ${flipClass} ${className}`}
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 1440 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block"
                >
                    <path
                        d="M0,0 L1440,0 L1440,32 C1240,16 1020,20 760,46 C480,72 320,68 0,28 Z"
                        fill={toColor}
                    />
                </svg>
            </div>
        );
    }

    // Onda na BASE de um bloco colorido: preenche a base com a cor da seção seguinte (ex: #FFFFFF ou #1D211E)
    return (
        <div
            className={`w-full overflow-hidden leading-none pointer-events-none select-none z-10 relative -mb-px ${flipClass} ${className}`}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1440 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block"
            >
                <path
                    d="M0,28 C320,68 480,72 760,46 C1020,20 1240,16 1440,32 L1440,80 L0,80 Z"
                    fill={toColor}
                />
            </svg>
        </div>
    );
}

