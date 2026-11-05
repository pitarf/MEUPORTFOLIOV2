import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import NutritionWaveDivider from './NutritionWaveDivider';

/**
 * Secao de Especialidades e Servicos Nutricionais em Azul Saúde
 * Apresenta as areas de atuacao confirmadas, publico-alvo e modalidade de consulta,
 * envolvida por divisores curvos organicos modernos.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionServices({ data }) {
    const { services, contact, professional } = data;

    if (!services || services.length === 0) return null;

    return (
        <section id="servicos" className="relative bg-[#F0F9FF] pt-0 pb-0 overflow-hidden">
            {/* Divisor de Onda Orgânica no Topo (Transição da Seção Sobre Branca para o Azul Suave) */}
            <NutritionWaveDivider
                position="top"
                toColor="#FFFFFF"
                flipX={true}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 py-12 md:py-16">
                {/* Cabecalho da Secao */}
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-sky-200/80 text-[#0284C7] shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>Áreas de Atuação</span>
                    </span>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Acompanhamento Nutricional Focado na Sua Realidade
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Cada plano é formulado a partir de evidências científicas sólidas, ajustado para seu estilo de vida e objetivos individuais.
                    </p>
                </div>

                {/* Grade de Cards Editoriais de Servicos em Azul Saúde */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => {
                        const serviceWhatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
                            `Olá, ${professional.displayName}! Gostaria de saber mais sobre o atendimento de ${service.name}.`
                        )}`;

                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-2xl p-7 border border-sky-100 shadow-xs hover:border-[#0284C7] hover:shadow-lg hover:shadow-sky-500/10 transition-all flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200/60">
                                            {service.mode}
                                        </span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]/30 group-hover:bg-[#0284C7] transition-colors" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                                        {service.name}
                                    </h3>

                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {service.target && (
                                        <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs text-slate-600">
                                            <span className="font-bold text-[#0369A1] block mb-1">Para quem é indicado:</span>
                                            {service.target}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 mt-6 border-t border-sky-100 flex items-center justify-between">
                                    <a
                                        href={serviceWhatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1.5 transition-colors group-hover:translate-x-1 transition-transform"
                                    >
                                        <span>{service.ctaText || 'Consultar Disponibilidade'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Divisor de Onda Orgânica na Base (Transição Fluida para Como Funciona Branco) */}
            <NutritionWaveDivider
                position="bottom"
                toColor="#FFFFFF"
            />
        </section>
    );
}
