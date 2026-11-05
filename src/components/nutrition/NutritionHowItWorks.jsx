import React from 'react';
import { CalendarCheck, FileText, HeartPulse } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao Como Funciona o Atendimento Nutricional em Azul Saúde
 * Divide o processo do paciente em 3 etapas transparentes e claras.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionHowItWorks({ data }) {
    const { howItWorks, contact, professional } = data;

    if (!howItWorks || howItWorks.length === 0) return null;

    const stepIcons = [
        <CalendarCheck className="w-6 h-6 text-[#0284C7]" />,
        <FileText className="w-6 h-6 text-[#0284C7]" />,
        <HeartPulse className="w-6 h-6 text-[#0284C7]" />
    ];

    return (
        <section id="como-funciona" className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200/60 inline-block">
                        Passo a Passo Transparente
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Como Funciona o Seu Acompanhamento
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600">
                        Um processo simples, estruturado e com acompanhamento constante desde o primeiro contato.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {howItWorks.map((step, idx) => (
                        <div
                            key={idx}
                            className="relative bg-gradient-to-b from-sky-50/40 to-white rounded-2xl p-8 border border-sky-100 flex flex-col justify-between shadow-xs hover:border-[#0284C7] hover:shadow-md transition-all"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-sky-100 flex items-center justify-center shadow-sm">
                                        {stepIcons[idx % stepIcons.length]}
                                    </div>
                                    <span className="text-3xl font-black text-sky-200 font-mono">
                                        {step.step || `0${idx + 1}`}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 pt-2">
                                    {step.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-sm font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                        <CalendarCheck className="w-4 h-4 text-white" />
                        <span>Agendar Minha Primeira Consulta</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
