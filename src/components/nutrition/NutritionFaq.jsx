import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Perguntas Frequentes em Azul Saúde com Acordeao Acessivel
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
        <section id="faq" className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center space-y-3 mb-14">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 border border-sky-200/80 text-[#0284C7]">
                        <HelpCircle className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Tire Suas Dúvidas</span>
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                        Entenda como funciona o acompanhamento nutricional e prepare-se para sua primeira consulta.
                    </p>
                </div>

                <div className="space-y-3">
                    {faq.map((item, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div
                                key={idx}
                                className={`bg-white rounded-2xl border transition-all shadow-xs ${isOpen ? 'border-[#0284C7] shadow-md shadow-sky-500/5' : 'border-sky-100 hover:border-sky-200'}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                    aria-expanded={isOpen}
                                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#0284C7] transition-colors focus:outline-none"
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0284C7]' : ''}`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-sky-50 animate-in fade-in-50 duration-200">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center p-6 bg-white rounded-2xl border border-sky-100 shadow-xs">
                    <p className="text-xs sm:text-sm text-slate-600">
                        Ainda tem dúvidas sobre o acompanhamento com {professional.displayName}?
                    </p>
                    <a
                        href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Olá! Tenho uma dúvida sobre a consulta nutricional.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors"
                    >
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        <span>Fale diretamente com a equipe no WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
