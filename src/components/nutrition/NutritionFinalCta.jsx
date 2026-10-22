import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Conversao Final da Landing Page de Nutricionistas
 * Convite acolhedor para agendamento presencial ou teleconsulta.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionFinalCta({ data }) {
    const { finalCta, contact, professional, location } = data;

    const whatsappDirectUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.initialWhatsappMessage)}`;

    return (
        <section className="py-20 bg-gradient-to-br from-[#244B3B] via-[#1d3d30] to-[#162f25] text-white text-center relative overflow-hidden">
            {/* Elemento de Fundo Texturizado Sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-xs border border-white/15">
                    Seu Próximo Passo
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {finalCta?.title || 'Vamos conversar sobre seus objetivos nutricionais?'}
                </h2>

                <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
                    {finalCta?.description || 'Entre em contato para conhecer as opções de atendimento e verificar a disponibilidade de horários com a nossa equipe.'}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={contact.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-[#244B3B] hover:bg-stone-100 text-sm sm:text-base font-extrabold shadow-lg hover:shadow-xl transition-all group"
                    >
                        <Calendar className="w-4 h-4 text-[#244B3B]" />
                        <span>{finalCta?.primaryText || 'Agendar consulta'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href={whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm sm:text-base font-bold backdrop-blur-xs transition-all"
                    >
                        <WhatsAppIcon className="w-5 h-5 text-white" />
                        <span>{finalCta?.secondaryText || 'Falar pelo WhatsApp'}</span>
                    </a>
                </div>

                <div className="pt-6 text-xs text-white/60">
                    Atendimento em conformidade com as diretrizes do Conselho Federal de Nutricionistas (CFN).
                </div>
            </div>
        </section>
    );
}
