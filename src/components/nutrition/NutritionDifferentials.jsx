import React from 'react';
import { CheckCircle2, HeartHandshake, ShieldCheck, MessageCircle } from 'lucide-react';

/**
 * Secao de Diferenciais do Atendimento Nutricional em Azul Saúde
 * Destaca o cuidado individualizado, ausencia de restricoes extremas e suporte continuo.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionDifferentials({ data }) {
    const { differentials } = data;

    if (!differentials || differentials.length === 0) return null;

    const icons = [
        <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />,
        <HeartHandshake className="w-5 h-5 text-[#0284C7]" />,
        <MessageCircle className="w-5 h-5 text-[#0284C7]" />,
        <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
    ];

    return (
        <section id="diferenciais" className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200/60 inline-block">
                        Por Que Escolher Nosso Acompanhamento
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Diferenciais Focados no Seu Sucesso e Bem-Estar
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                        Uma conduta profissional pautada pelo respeito ao seu estilo de vida e pela construção de autonomia.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {differentials.map((diff, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-6 border border-sky-100 shadow-xs hover:border-[#0284C7] hover:shadow-md transition-all space-y-3 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                                {React.cloneElement(icons[idx % icons.length], {
                                    className: "w-5 h-5 text-[#0284C7] group-hover:text-white transition-colors"
                                })}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                                {diff.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {diff.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
