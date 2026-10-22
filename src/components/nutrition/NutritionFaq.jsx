import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Perguntas Frequentes com Acordeao Acessivel
 * Responde as principais duvidas dos pacientes sobre consultas, planos e retornos.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionFaq({ data }) {
    const [openIdx, setOpenIdx] = useState(0);
    const { faq, contact, professional } = data;

    if (!faq || faq.length === 0) return null;

    return (
        <section id="faq" className="py-16 md:py-24 bg-[#F8F7F2] border-b border-stone-200/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center space-y-3 mb-14">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#244B3B]/10 text-[#244B3B]">
                        <HelpCircle className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Tire Suas Dúvidas</span>
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-sm sm:text-base text-stone-600">
                        Entenda como funciona o acompanhamento nutricional e prepare-se para sua primeira consulta.
                    </p>
                </div>

                <div className="space-y-3">
                    {faq.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition-colors"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                    aria-expanded={isOpen}
                                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#252925] hover:text-[#244B3B] transition-colors focus:outline-none"
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#244B3B]' : ''}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in-50 duration-200">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bloco de Contato Direto */}
                <div className="mt-12 text-center bg-white border border-stone-200 p-8 rounded-2xl shadow-xs space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#252925]">
                        Ficou com alguma dúvida específica sobre o seu caso?
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                        Fale diretamente com a equipe da {professional.displayName} pelo WhatsApp e receba orientações antes de agendar.
                    </p>
                    <div className="pt-2">
                        <a
                            href={contact.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#244B3B] hover:bg-[#1a382b] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
                        >
                            <WhatsAppIcon className="w-4 h-4 text-white" />
                            <span>Conversar com a Nutricionista</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
