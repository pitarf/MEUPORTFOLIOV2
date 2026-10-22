import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Especialidades e Servicos Nutricionais
 * Apresenta as areas de atuacao confirmadas, publico-alvo e modalidade de consulta.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionServices({ data }) {
    const { services, contact, professional } = data;

    if (!services || services.length === 0) return null;

    return (
        <section id="servicos" className="py-16 md:py-24 bg-[#F8F7F2] border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Cabecalho da Secao */}
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#244B3B]/10 text-[#244B3B]">
                        <Sparkles className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Áreas de Atuação</span>
                    </span>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight">
                        Acompanhamento Nutricional Focado na Sua Realidade
                    </h2>

                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                        Cada plano é formulado a partir de evidências científicas sólidas, ajustado para seu estilo de vida e objetivos individuais.
                    </p>
                </div>

                {/* Grade de Cards Editoriais de Servicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => {
                        const serviceWhatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                            `Olá, ${professional.displayName}! Gostaria de saber mais sobre o atendimento de ${service.name}.`
                        )}`;

                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-xs hover:border-[#557A61] hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#557A61]/10 text-[#244B3B]">
                                            {service.mode || 'Presencial ou Online'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#252925] group-hover:text-[#244B3B] transition-colors">
                                        {service.name}
                                    </h3>

                                    <p className="text-sm text-stone-600 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {service.target && (
                                        <div className="pt-3 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-500">
                                            <CheckCircle2 className="w-4 h-4 text-[#557A61] shrink-0 mt-0.5" />
                                            <span><strong>Indicado para:</strong> {service.target}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 mt-6 border-t border-stone-100">
                                    <a
                                        href={serviceWhatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-[#244B3B] text-stone-700 hover:text-white text-xs font-bold transition-all group/btn"
                                    >
                                        <span className="flex items-center gap-2">
                                            <WhatsAppIcon className="w-4 h-4 text-stone-600 group-hover/btn:text-white" />
                                            <span>{service.ctaText || 'Consultar Disponibilidade'}</span>
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
