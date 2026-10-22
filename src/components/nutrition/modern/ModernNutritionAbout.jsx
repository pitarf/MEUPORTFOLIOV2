import React from 'react';
import { CheckCircle2, ArrowRight, Heart, FileText, MessageSquare, Headphones, Sparkles, Award } from 'lucide-react';

/**
 * ModernNutritionAbout: Secao institucional 'Sobre a nutricionista'.
 * Estrutura visual fiel a referencia NutriVida:
 * - Foto com selo flutuante de registro profissional (CRN).
 * - Apresentacao com checklist de autoridade (ticks azuis).
 * - Botao 'Conheca minha historia'.
 * - Card destacado 'Meus diferenciais' com 5 itens de acolhimento e escuta ativa.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados da nutricionista
 * @param {object} props.nutritionist - Alias de compatibilidade
 * @param {function} props.onStoryClick - Callback opcional para abrir historia/bio
 */
export default function ModernNutritionAbout({ data, nutritionist, onStoryClick }) {
    const profile = data || nutritionist || {};
    const prof = profile.professional || profile;
    const crn = prof.crn || 'CRN-4 12345';
    const photo = prof.photo || 'https://images.unsplash.com/photo-1594824813572-8869b0e271eb?auto=format&fit=crop&w=800&q=80';

    // Lista de qualificacoes em checklist
    const qualifications = [
        'Formação em Nutrição',
        'Especialização em Nutrição Clínica e Esportiva',
        'Atendimento presencial e online',
        'Foco em resultados reais e sustentáveis'
    ];

    // 5 Diferenciais de acolhimento
    const differentials = [
        { icon: Heart, label: 'Atendimento humanizado' },
        { icon: FileText, label: 'Planos personalizados' },
        { icon: MessageSquare, label: 'Acompanhamento contínuo' },
        { icon: Headphones, label: 'Suporte entre as consultas' },
        { icon: Sparkles, label: 'Orientação prática e realista' }
    ];

    return (
        <section id="sobre" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    
                    {/* COLUNA ESQUERDA: Foto da Profissional com Selo de CRN (4 colunas) */}
                    <div className="lg:col-span-4 flex justify-center">
                        <div className="relative w-full max-w-sm">
                            {/* Moldura Suave com Borda */}
                            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-sky-100 bg-slate-50">
                                <img
                                    src={photo}
                                    alt={`Foto de ${prof.name || 'Nutricionista'}`}
                                    className="w-full h-[400px] sm:h-[440px] object-cover object-top"
                                    loading="lazy"
                                />

                                {/* Selo Flutuante de CRN */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-sky-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                                        <Award className="w-5 h-5 text-[#0284C7]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-slate-900 leading-tight">
                                            {crn}
                                        </p>
                                        <p className="text-[11px] text-[#0284C7] font-semibold">
                                            Nutricionista
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Registro Profissional Ativo
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA CENTRAL: Apresentacao Institucional e Checklist (5 colunas) */}
                    <div className="lg:col-span-5 space-y-6 text-center sm:text-left">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Sobre a nutricionista
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                                {prof.shortBio || 'Profissional dedicada a ajudar pessoas a construírem uma relação mais saudável com a alimentação, com planos personalizados, baseados em ciência e na sua realidade.'}
                            </p>
                        </div>

                        {/* Checklist com Ticks Azuis */}
                        <div className="space-y-3 pt-2 text-left">
                            {qualifications.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Botao de Acao Historia */}
                        <div className="pt-2 flex justify-center sm:justify-start">
                            <button
                                type="button"
                                onClick={onStoryClick || (() => {
                                    const locElement = document.getElementById('locais-atendimento') || document.getElementById('agendamento-rapido');
                                    if (locElement) locElement.scrollIntoView({ behavior: 'smooth' });
                                })}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-sky-300 hover:border-sky-400 bg-sky-50/60 hover:bg-sky-100/70 text-[#0284C7] font-bold text-sm transition-all group"
                            >
                                <span>Conheça minha história</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Card Destacado 'Meus diferenciais' (3 colunas) */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#F0F9FF] border border-sky-200/80 rounded-3xl p-6 shadow-sm text-left">
                            <h3 className="text-lg font-bold text-slate-900 mb-5 tracking-tight">
                                Meus diferenciais
                            </h3>

                            <div className="space-y-4">
                                {differentials.map((diff, index) => {
                                    const DiffIcon = diff.icon;

                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100">
                                                <DiffIcon className="w-4 h-4 text-[#0284C7]" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-semibold text-slate-800">
                                                {diff.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
