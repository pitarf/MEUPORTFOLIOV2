import React from 'react';
import { CheckCircle2, HeartHandshake, ShieldCheck, MessageCircle } from 'lucide-react';

/**
 * Secao de Diferenciais do Atendimento Nutricional
 * Destaca o cuidado individualizado, ausencia de restricoes extremas e suporte continuo.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionDifferentials({ data }) {
    const { differentials } = data;

    if (!differentials || differentials.length === 0) return null;

    const icons = [
        <CheckCircle2 className="w-5 h-5 text-[#244B3B]" />,
        <HeartHandshake className="w-5 h-5 text-[#244B3B]" />,
        <MessageCircle className="w-5 h-5 text-[#244B3B]" />,
        <ShieldCheck className="w-5 h-5 text-[#244B3B]" />
    ];

    return (
        <section id="diferenciais" className="py-16 md:py-24 bg-[#F8F7F2] border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#557A61]">
                        Por Que Escolher Nosso Acompanhamento
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight">
                        Diferenciais Focados no Seu Sucesso e Bem-Estar
                    </h2>
                    <p className="text-sm sm:text-base text-stone-600">
                        Uma conduta profissional pautada pelo respeito ao seu estilo de vida e pela construção de autonomia.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {differentials.map((diff, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-[#557A61] transition-all space-y-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#557A61]/10 flex items-center justify-center">
                                {icons[idx % icons.length]}
                            </div>
                            <h3 className="text-base font-bold text-[#252925]">
                                {diff.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                                {diff.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
