import React from 'react';
import { CalendarCheck, FileText, HeartPulse } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao Como Funciona o Atendimento Nutricional
 * Divide o processo do paciente em 3 etapas transparentes e claras.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionHowItWorks({ data }) {
    const { howItWorks, contact, professional } = data;

    if (!howItWorks || howItWorks.length === 0) return null;

    const stepIcons = [
        <CalendarCheck className="w-6 h-6 text-[#244B3B]" />,
        <FileText className="w-6 h-6 text-[#244B3B]" />,
        <HeartPulse className="w-6 h-6 text-[#244B3B]" />
    ];

    return (
        <section id="como-funciona" className="py-16 md:py-24 bg-white border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#557A61]">
                        Passo a Passo Transparente
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight">
                        Como Funciona o Seu Acompanhamento
                    </h2>
                    <p className="text-sm sm:text-base text-stone-600">
                        Um processo simples, estruturado e com acompanhamento constante desde o primeiro contato.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {howItWorks.map((step, idx) => (
                        <div
                            key={idx}
                            className="relative bg-[#F8F7F2] rounded-2xl p-8 border border-stone-200/80 flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-xs">
                                        {stepIcons[idx % stepIcons.length]}
                                    </div>
                                    <span className="text-3xl font-black text-stone-300 font-mono">
                                        {step.step || `0${idx + 1}`}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-[#252925] pt-2">
                                    {step.title}
                                </h3>

                                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#244B3B] hover:bg-[#1a382b] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                    >
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                        <span>Agendar Minha Consulta Agora</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
