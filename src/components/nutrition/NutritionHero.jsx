import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao Hero de Alta Conversao para Nutricionistas
 * Composicao assimetrica editorial, tipografia de alta legibilidade,
 * area fotografica profissional e CTAs diretos para agendamento e WhatsApp.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionHero({ data }) {
    const { professional, hero, contact, location } = data;

    const whatsappDirectUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.initialWhatsappMessage)}`;

    return (
        <section id="inicio" className="relative bg-[#F8F7F2] pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-stone-200/60">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Coluna de Texto e Conversão (7 colunas no desktop) */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        {/* Badge de Identificação */}
                        {hero.badge && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-300/80 text-xs font-semibold text-[#244B3B] shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-[#557A61] animate-pulse"></span>
                                <span>{hero.badge}</span>
                            </div>
                        )}

                        {/* H1 Principal Editorial Otimizado para SEO */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#252925] leading-[1.2]">
                            {hero.title}
                        </h1>

                        {/* Descrição Concisa e Humanizada */}
                        <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {hero.subtitle}
                        </p>

                        {/* CTAs Primário e Secundário */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a
                                href={contact.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#244B3B] hover:bg-[#1a382b] text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all group"
                            >
                                <span>{hero.primaryCtaText || 'Agendar minha consulta'}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                                href={whatsappDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-sm sm:text-base font-semibold shadow-xs transition-all"
                            >
                                <WhatsAppIcon className="w-5 h-5" />
                                <span>{hero.secondaryCtaText || 'Conversar pelo WhatsApp'}</span>
                            </a>
                        </div>

                        {/* Selos de Confiança Imediata */}
                        <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-stone-600 font-medium">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-[#557A61]" />
                                {professional.crn}
                            </span>
                            {location && location.city && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#557A61]" />
                                    {location.neighborhood ? `${location.neighborhood}, ${location.city}` : location.city}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#557A61]" />
                                Presencial e Teleconsulta
                            </span>
                        </div>
                    </div>

                    {/* Coluna Fotográfica (5 colunas no desktop) */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md">
                            {/* Moldura Editorial com Fundo Sutil */}
                            <div className="absolute -inset-2 bg-gradient-to-tr from-[#557A61]/20 to-[#244B3B]/10 rounded-3xl transform -rotate-1"></div>

                            <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-stone-200/80">
                                {professional.photo ? (
                                    <img
                                        src={professional.photo}
                                        alt={`Foto profissional de ${professional.name}`}
                                        className="w-full h-[400px] sm:h-[460px] object-cover object-top select-none"
                                        loading="eager"
                                        width="480"
                                        height="560"
                                    />
                                ) : (
                                    // Placeholder visual elegante quando não há foto
                                    <div className="w-full h-[400px] sm:h-[460px] bg-stone-100 flex flex-col items-center justify-center p-8 text-center text-stone-500">
                                        <div className="w-20 h-20 rounded-full bg-[#557A61]/10 text-[#244B3B] flex items-center justify-center font-bold text-2xl mb-4">
                                            {professional.avatarInitials || 'NP'}
                                        </div>
                                        <span className="font-semibold text-stone-800">{professional.name}</span>
                                        <span className="text-xs text-stone-500 mt-1">{professional.title}</span>
                                    </div>
                                )}

                                {/* Card Flutuante de Autoridade na Base da Foto */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-stone-200/80 shadow-md flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#244B3B] text-white flex items-center justify-center font-bold shrink-0 text-sm">
                                        CRN
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-[#252925] leading-tight">
                                            Atendimento Ético e Individualizado
                                        </p>
                                        <p className="text-[11px] text-stone-500">
                                            Sem dietas da moda ou promessas milagrosas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
