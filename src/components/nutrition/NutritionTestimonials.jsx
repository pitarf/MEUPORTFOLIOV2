import React from 'react';
import { Star, Quote } from 'lucide-react';

/**
 * Secao de Prova Social e Avaliacoes Autorizadas
 * Ocultada automaticamente se nao houver depoimentos devidamente autorizados cadastrados.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionTestimonials({ data }) {
    const { testimonials } = data;

    // Conforme diretriz etica: nao exibir avaliacoes ficticias. Oculta se vazio.
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section id="avaliacoes" className="py-16 md:py-24 bg-white border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#557A61]">
                        Depoimentos de Pacientes
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight">
                        Experiências Reais Compartilhadas com Autorização
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-[#F8F7F2] p-6 rounded-2xl border border-stone-200 space-y-4 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[...Array(5)].map((_, sIdx) => (
                                        <Star key={sIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <Quote className="w-6 h-6 text-[#557A61]/40" />
                                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                                    "{item.text}"
                                </p>
                            </div>

                            <div className="pt-3 border-t border-stone-200/60">
                                <span className="font-bold text-xs text-[#252925] block">{item.name}</span>
                                {item.source && <span className="text-[11px] text-stone-500">{item.source}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
