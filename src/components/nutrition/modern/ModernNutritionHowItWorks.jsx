import React from 'react';
import { MessageSquare, Calendar, Users, ChevronRight, CheckCircle2 } from 'lucide-react';

/**
 * ModernNutritionHowItWorks: Secao 'Como funciona a consulta?'
 * Composicao dividida:
 * - Esquerda: Foto editorial de prato saudavel com selo flutuante 'Plano alimentar 100% personalizado'.
 * - Direita: 3 etapas claras e didaticas com marcadores circulares numerados e setas de conexao.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados da nutricionista
 * @param {object} props.nutritionist - Alias de compatibilidade
 */
export default function ModernNutritionHowItWorks({ data, nutritionist }) {
    const steps = [
        {
            number: '1',
            icon: MessageSquare,
            title: 'Entre em contato',
            description: 'Fale pelo WhatsApp ou preencha o formulário.'
        },
        {
            number: '2',
            icon: Calendar,
            title: 'Agende sua consulta',
            description: 'Escolha o melhor dia e horário.'
        },
        {
            number: '3',
            icon: Users,
            title: 'Inicie seu plano',
            description: 'Receba seu plano alimentar e acompanhamento contínuo.'
        }
    ];

    return (
        <section id="como-funciona" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Cabecalho Central da Secao */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Como funciona a consulta?
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                        Um processo simples, prático e focado em resultados reais.
                    </p>
                </div>

                {/* Grid Dividido: Foto Editorial a Esquerda e Etapas a Direita */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    
                    {/* Bloco Esquerdo: Foto de Prato Saudavel com Selo Flutuante */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-100 bg-white group">
                            <img
                                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                                alt="Prato saudável equilibrado e saboroso"
                                className="w-full h-[320px] sm:h-[380px] object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                            {/* Selo Flutuante 'Plano alimentar 100% personalizado' */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-sky-100 flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                        Plano alimentar 100% personalizado
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                        De acordo com seus objetivos, rotina e preferências.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloco Direito: 3 Etapas Conectadas */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-4 items-stretch relative">
                            {steps.map((step, index) => {
                                const IconComponent = step.icon;
                                const isLast = index === steps.length - 1;

                                return (
                                    <div key={step.number} className="relative flex flex-col justify-between">
                                        {/* Card da Etapa */}
                                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-sky-300 hover:shadow-md transition-all h-full text-center sm:text-left flex flex-col items-center sm:items-start">
                                            {/* Cabecalho da Etapa: Numero e Icone */}
                                            <div className="flex items-center gap-2.5 mb-4">
                                                <span className="w-7 h-7 rounded-full bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                                    {step.number}
                                                </span>
                                                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                            </div>

                                            {/* Conteudo Descritivo */}
                                            <h3 className="text-base font-bold text-slate-900 mb-1.5">
                                                {step.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Indicador de Proxima Etapa no Desktop */}
                                        {!isLast && (
                                            <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300 bg-white rounded-full p-0.5 border border-slate-200 shadow-xs">
                                                <ChevronRight className="w-4 h-4 text-[#0284C7]" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
