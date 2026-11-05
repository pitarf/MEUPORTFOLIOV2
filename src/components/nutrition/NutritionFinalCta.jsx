import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import NutritionWaveDivider from './NutritionWaveDivider';

/**
 * Secao de Conversao Final da Landing Page de Nutricionistas em Azul Saúde
 * Convite acolhedor para agendamento presencial ou teleconsulta com divisores de forma modernos.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionFinalCta({ data }) {
    const { finalCta, contact, professional, location } = data;

    const whatsappDirectUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.initialWhatsappMessage)}`;

    return (
        <section className="relative bg-gradient-to-br from-[#0284C7] via-[#0369A1] to-[#0C4A6E] text-white text-center overflow-hidden">
            {/* Divisor de Onda Orgânica no Topo (Transição Suave do FAQ Branco para o Azul) */}
            <NutritionWaveDivider
                position="top"
                toColor="#FFFFFF"
            />

            {/* Elemento de Fundo Texturizado Sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs border border-white/20">
                    Seu Próximo Passo
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {finalCta?.title || 'Vamos conversar sobre seus objetivos nutricionais?'}
                </h2>

                <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                    {finalCta?.description || 'Entre em contato para conhecer as opções de atendimento e verificar a disponibilidade de horários com a nossa equipe.'}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#0284C7] hover:bg-sky-50 text-sm sm:text-base font-extrabold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group"
                    >
                        <Calendar className="w-4 h-4 text-[#0284C7]" />
                        <span>{finalCta?.primaryText || 'Agendar consulta'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href={whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm sm:text-base font-bold backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                    >
                        <WhatsAppIcon className="w-5 h-5 text-white" />
                        <span>{finalCta?.secondaryText || 'Falar pelo WhatsApp'}</span>
                    </a>
                </div>

                <div className="pt-6 text-xs text-white/70">
                    Atendimento em conformidade com as diretrizes do Conselho Federal de Nutricionistas (CFN).
                </div>
            </div>

            {/* Divisor de Onda Orgânica na Base (Transição Suave para o Rodapé) */}
            <NutritionWaveDivider
                position="bottom"
                toColor="#1D211E"
            />
        </section>
    );
}
