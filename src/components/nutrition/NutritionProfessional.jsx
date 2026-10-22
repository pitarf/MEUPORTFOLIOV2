import React from 'react';
import { GraduationCap, Sparkles, Check, ArrowRight } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Apresentacao Humana e Qualificacao do Nutricionista
 * Destaca a formacao academica real, filosofia de atendimento e credenciais.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionProfessional({ data }) {
    const { professional, contact } = data;

    return (
        <section id="sobre" className="py-16 md:py-24 bg-white border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Imagem do Consultório / Profissional */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="relative rounded-3xl overflow-hidden bg-stone-100 shadow-lg border border-stone-200">
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
                                <div className="w-full h-[360px] bg-[#244B3B]/5 flex items-center justify-center p-8 text-center">
                                    <div className="space-y-2">
                                        <div className="w-16 h-16 rounded-full bg-[#244B3B] text-white flex items-center justify-center mx-auto text-xl font-bold">
                                            {professional.avatarInitials}
                                        </div>
                                        <p className="font-bold text-[#252925]">{professional.name}</p>
                                        <p className="text-xs text-stone-500">{professional.title}</p>
                                    </div>
                                </div>
                            )}

                            {/* Citação Inspiradora */}
                            <div className="p-6 bg-[#F8F7F2] border-t border-stone-200/80">
                                <p className="text-xs sm:text-sm italic text-stone-700 leading-relaxed font-serif">
                                    "Comer bem não é sinônimo de comer pouco, mas sim de nutrir seu corpo com sabedoria, autonomia e alegria à mesa."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Texto Institucional e Formação Acadêmica */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#557A61]/10 text-[#244B3B]">
                            <Sparkles className="w-3.5 h-3.5 text-[#557A61]" />
                            <span>Conheça a Profissional</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight leading-tight">
                            Saúde integral com base científica e acolhimento humano.
                        </h2>

                        <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                            {professional.fullBio || professional.shortBio}
                        </p>

                        {/* Formação Acadêmica Comprovada */}
                        {professional.academicBackground && professional.academicBackground.length > 0 && (
                            <div className="pt-2 space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-[#244B3B]" />
                                    <span>Formação Acadêmica & Credenciais</span>
                                </h3>

                                <ul className="space-y-2.5">
                                    {professional.academicBackground.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                                            <Check className="w-4 h-4 text-[#557A61] shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Botão de Ação */}
                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href={contact.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#244B3B] hover:bg-[#1a382b] text-white text-sm font-bold shadow-md transition-all"
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
