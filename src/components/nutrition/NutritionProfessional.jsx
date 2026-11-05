import React from 'react';
import { GraduationCap, Sparkles, Check, ArrowRight } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Apresentacao Humana e Qualificacao do Nutricionista em Azul Saúde
 * Destaca a formacao academica real, filosofia de atendimento e credenciais.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionProfessional({ data }) {
    const { professional, contact } = data;

    return (
        <section id="sobre" className="py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Imagem do Consultório / Profissional */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="relative rounded-3xl overflow-hidden bg-sky-50/50 shadow-lg border border-sky-100">
                            {professional.secondaryPhoto ? (
                                <img
                                    src={professional.secondaryPhoto}
                                    alt={`Consultório e atendimento com ${professional.name}`}
                                    className="w-full h-[420px] object-cover"
                                    loading="lazy"
                                    width="460"
                                    height="420"
                                />
                            ) : (
                                <div className="w-full h-[360px] bg-sky-50 flex items-center justify-center p-8 text-center">
                                    <div className="space-y-2">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-sky-500/20">
                                            {professional.avatarInitials}
                                        </div>
                                        <p className="font-bold text-slate-800">{professional.name}</p>
                                        <p className="text-xs text-slate-500">{professional.title}</p>
                                    </div>
                                </div>
                            )}

                            {/* Citação Inspiradora */}
                            <div className="p-6 bg-gradient-to-r from-sky-50/70 to-white border-t border-sky-100">
                                <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed font-serif">
                                    "Comer bem não é sinônimo de comer pouco, mas sim de nutrir seu corpo com sabedoria, autonomia e alegria à mesa."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Texto Institucional e Formação Acadêmica */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 border border-sky-200/80 text-[#0284C7]">
                            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>Conheça a Profissional</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Saúde integral com base científica e acolhimento humano.
                        </h2>

                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            {professional.fullBio || professional.shortBio}
                        </p>

                        {/* Formação Acadêmica Comprovada */}
                        {professional.academicBackground && professional.academicBackground.length > 0 && (
                            <div className="pt-2 space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-[#0284C7]" />
                                    <span>Formação Acadêmica & Credenciais</span>
                                </h3>

                                <ul className="space-y-2.5">
                                    {professional.academicBackground.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                            <Check className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Botão de Ação em Azul Saúde */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href={contact.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-sm font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-white" />
                                <span>Agendar Consulta com {professional.displayName}</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
