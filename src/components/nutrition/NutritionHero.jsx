import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import NutritionWaveDivider from './NutritionWaveDivider';

/**
 * Secao Hero de Alta Conversao para Nutricionistas
 * Composicao assimetrica editorial, tipografia de alta legibilidade,
 * area fotografica profissional e CTAs diretos para agendamento e WhatsApp em Azul Saúde.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionHero({ data }) {
    const { professional, hero, contact, location } = data;
    const [imgSrc, setImgSrc] = useState(professional.photo || '/images/nutrition/dra-camila-rocha.jpg');

    const whatsappDirectUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.initialWhatsappMessage)}`;

    return (
        <section id="inicio" className="relative bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE]/60 pt-8 pb-0 md:pt-14 md:pb-0 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 md:pb-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Coluna de Texto e Conversão (7 colunas no desktop) */}
                    <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                        {/* Badge de Identificação */}
                        {hero.badge && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200/80 text-xs font-semibold text-[#0369A1] shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse"></span>
                                <span>{hero.badge}</span>
                            </div>
                        )}

                        {/* H1 Principal Editorial Otimizado para SEO */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">
                            {hero.title}
                        </h1>

                        {/* Descrição Concisa e Humanizada */}
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {hero.subtitle}
                        </p>

                        {/* CTAs Primário e Secundário em Azul Saúde */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a
                                href={contact.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-sm sm:text-base font-bold shadow-md shadow-sky-500/25 hover:shadow-lg transition-all hover:scale-105 active:scale-95 group"
                            >
                                <span>{hero.primaryCtaText || 'Agendar minha consulta'}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                                href={whatsappDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-sky-50/50 border border-slate-300 text-slate-800 text-sm sm:text-base font-semibold shadow-xs transition-all hover:border-[#0284C7]"
                            >
                                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                                <span>{hero.secondaryCtaText || 'Conversar pelo WhatsApp'}</span>
                            </a>
                        </div>

                        {/* Selos de Confiança Imediata */}
                        <div className="pt-4 border-t border-sky-100 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                                {professional.crn}
                            </span>
                            {location && location.city && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#0284C7]" />
                                    {location.neighborhood ? `${location.neighborhood}, ${location.city}` : location.city}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                                Presencial e Teleconsulta
                            </span>
                        </div>
                    </div>

                    {/* Coluna Fotográfica (5 colunas no desktop) */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md">
                            {/* Moldura Editorial com Fundo Sutil Azul */}
                            <div className="absolute -inset-2 bg-gradient-to-tr from-sky-400/20 to-[#0284C7]/15 rounded-3xl transform -rotate-1"></div>

                            <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-sky-100">
                                <img
                                    src={imgSrc}
                                    alt={`Foto profissional de ${professional.name}`}
                                    className="w-full h-[400px] sm:h-[460px] object-cover object-top select-none"
                                    loading="eager"
                                    width="480"
                                    height="560"
                                    onError={() => {
                                        if (imgSrc !== '/images/nutrition/dra-camila-rocha.jpg') {
                                            setImgSrc('/images/nutrition/dra-camila-rocha.jpg');
                                        }
                                    }}
                                />

                                {/* Card Flutuante de Autoridade na Base da Foto */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-sky-100 shadow-md flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-center font-bold shrink-0 text-sm shadow-xs">
                                        CRN
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-slate-800 leading-tight">
                                            Atendimento Ético e Individualizado
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Em conformidade com as normas do CFN
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divisor de Onda Orgânica na Base do Hero (Transição Fluida para a Barra de Confiança) */}
            <NutritionWaveDivider
                position="bottom"
                toColor="#FFFFFF"
            />
        </section>
    );
}
