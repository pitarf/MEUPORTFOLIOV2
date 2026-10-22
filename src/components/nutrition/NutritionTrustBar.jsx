import React from 'react';
import { ShieldCheck, Award, HeartHandshake, MapPin } from 'lucide-react';

/**
 * Faixa Discreta de Elementos de Confianca e Credibilidade
 * Exibe apenas informacoes confirmadas e verificaveis do profissional.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionTrustBar({ data }) {
    const { trustElements, professional, location } = data;

    if (!trustElements || trustElements.length === 0) return null;

    // Mapeamento semantico de icones discretos
    const getIcon = (idx) => {
        switch (idx % 4) {
            case 0: return <ShieldCheck className="w-5 h-5 text-[#557A61]" />;
            case 1: return <Award className="w-5 h-5 text-[#557A61]" />;
            case 2: return <MapPin className="w-5 h-5 text-[#557A61]" />;
            default: return <HeartHandshake className="w-5 h-5 text-[#557A61]" />;
        }
    };

    return (
        <section className="bg-white py-6 border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                    {trustElements.map((elem, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#557A61]/10 flex items-center justify-center shrink-0">
                                {getIcon(idx)}
                            </div>
                            <div>
                                <span className="block text-xs text-stone-500 font-medium uppercase tracking-wider">
                                    {elem.label}
                                </span>
                                <span className="block text-sm font-bold text-[#252925] mt-0.5">
                                    {elem.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
