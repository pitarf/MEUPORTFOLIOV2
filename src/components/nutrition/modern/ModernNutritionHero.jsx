import React, { useState } from 'react';
import { ArrowRight, Video, Heart, Activity, User, Phone, Target, Lock, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * ModernNutritionHero: Secao Hero de Alta Conversao inspirada no layout NutriVida.
 * Possui distribuicao em 3 blocos:
 * 1. Proposta de valor com micro-beneficios e CTAs principais.
 * 2. Fotografia humanizada da nutricionista em jaleco branco.
 * 3. Card embutido com formulario rapido de agendamento via WhatsApp.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista (perfil, contato, etc.)
 * @param {object} props.nutritionist - Alias de compatibilidade para os dados
 * @param {function} props.onBookingClick - Callback opcional para acao de agendamento
 */
export default function ModernNutritionHero({ data, nutritionist, onBookingClick }) {
    const profile = data || nutritionist || {};
    const prof = profile.professional || profile;
    const contact = profile.contact || profile;
    const location = profile.location || profile;
    const hero = profile.hero || {};

    // Estados do formulario rapido de agendamento
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [objective, setObjective] = useState('');

    // Formatacao de telefone com mascara brasileira (DDD + numero)
    const handlePhoneChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
        let formatted = raw;
        if (raw.length > 2) {
            formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
        }
        if (raw.length > 7) {
            formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
        }
        setPhone(formatted);
    };

    // Submissao do formulario: redireciona ao WhatsApp com mensagem estruturada
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const rawPhone = contact.whatsapp || '5521999999999';
        const cleanPhone = rawPhone.replace(/\D/g, '');
        const clientName = name.trim() || 'Olá';
        const clientObjective = objective || 'Melhorar minha saúde e qualidade de vida';

        const messageText = `Olá! Meu nome é ${clientName}. Meu objetivo é: ${clientObjective}. Gostaria de agendar uma consulta nutricional!`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    // WhatsApp geral para o botao secundario
    const defaultWhatsappUrl = (() => {
        const rawPhone = contact.whatsapp || '5521999999999';
        const cleanPhone = rawPhone.replace(/\D/g, '');
        const message = contact.initialWhatsappMessage || 'Olá! Gostaria de saber mais sobre as consultas nutricionais.';
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    })();

    // Imagem da nutricionista com fallback de qualidade médica
    const heroImage = prof.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80';
    const cityText = location.city ? location.city.toUpperCase() : 'RIO DE JANEIRO';

    return (
        <section id="inicio" className="relative bg-gradient-to-b from-[#F0F9FF] via-[#F8FAFC] to-white pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-sky-100">
            {/* Elementos visuais de fundo sutis em azul ciano */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 right-10 w-80 h-80 bg-cyan-100/40 rounded-full blur-2xl pointer-events-none -z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                    
                    {/* COLUNA ESQUERDA: Proposta de Valor e Micro-beneficios (5 colunas desktop) */}
                    <div className="lg:col-span-5 text-center lg:text-left space-y-6">
                        {/* Badge da Cidade */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-bold tracking-wide uppercase shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                            <span>NUTRICIONISTA NO {cityText}</span>
                        </div>

                        {/* Titulo Principal de Alta Conversao */}
                        <h1 className="text-3xl sm:text-4xl xl:text-[42px] font-extrabold tracking-tight text-slate-900 leading-[1.18]">
                            Mais saúde para a sua rotina,{' '}
                            <span className="text-[#0284C7]">
                                com um plano alimentar real e personalizado.
                            </span>
                        </h1>

                        {/* Subtitulo Explicativo */}
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Acompanhamento nutricional individualizado, respeitando suas preferências, objetivos e estilo de vida.
                        </p>

                        {/* 3 Micro-beneficios com Icones Tematicos */}
                        <div className="space-y-3 pt-1 text-left max-w-md mx-auto lg:mx-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                                    <Video className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    Atendimento presencial e online
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    Planos personalizados para seus objetivos
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    Acompanhamento contínuo e humanizado
                                </span>
                            </div>
                        </div>

                        {/* Botoes de Acao (Agendamento e WhatsApp) */}
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
                            <button
                                type="button"
                                onClick={onBookingClick || (() => {
                                    const element = document.getElementById('agendamento-rapido') || document.getElementById('locais-atendimento');
                                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                                })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all group"
                            >
                                <span>Agendar minha consulta</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <a
                                href={defaultWhatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-300 text-slate-800 font-semibold text-sm sm:text-base shadow-xs transition-all"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-[#0284C7]" />
                                <span>Falar pelo WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* COLUNA CENTRAL: Fotografia da Nutricionista (4 colunas desktop) */}
                    <div className="lg:col-span-4 flex justify-center items-end relative min-h-[380px] lg:min-h-[460px]">
                        {/* Circulo de realce estético ao fundo da foto */}
                        <div className="absolute inset-x-4 bottom-0 top-12 bg-gradient-to-t from-sky-200/60 to-transparent rounded-t-[40px] -z-0" />

                        <div className="relative z-10 w-full max-w-sm flex justify-center">
                            <img
                                src={heroImage}
                                alt={`Nutricionista ${prof.name || 'Especialista em Nutrição'}`}
                                className="w-full max-h-[460px] object-cover object-top rounded-2xl drop-shadow-xl"
                                loading="eager"
                            />
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Card Embutido de Agendamento Rapido (3 colunas desktop) */}
                    <div id="agendamento-rapido" className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-sky-100 relative">
                            {/* Cabecalho do Card */}
                            <div className="mb-5 text-left">
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                    Agende sua consulta
                                </h2>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Preencha os dados e fale diretamente com a nutricionista pelo WhatsApp ou agende seu horário.
                                </p>
                            </div>

                            {/* Formulario Integrado */}
                            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                                {/* Campo Nome */}
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Nome completo"
                                            className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Campo WhatsApp com DDD */}
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            placeholder="WhatsApp (com DDD)"
                                            className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                {/* Select Objetivo */}
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Target className="w-4 h-4" />
                                        </div>
                                        <select
                                            required
                                            value={objective}
                                            onChange={(e) => setObjective(e.target.value)}
                                            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent transition-all text-slate-700 appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Qual o seu objetivo?</option>
                                            <option value="Emagrecimento Saudável">Emagrecimento Saudável</option>
                                            <option value="Nutrição Esportiva e Performance">Nutrição Esportiva e Performance</option>
                                            <option value="Reeducação Alimentar">Reeducação Alimentar</option>
                                            <option value="Saúde e Controle de Exames">Saúde e Controle de Exames</option>
                                            <option value="Outro objetivo">Outro objetivo</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Botao de Envio */}
                                <button
                                    type="submit"
                                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                                >
                                    <WhatsAppIcon className="w-4 h-4" />
                                    <span>Enviar mensagem</span>
                                </button>
                            </form>

                            {/* Aviso de Privacidade */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Seus dados estão seguros e não serão compartilhados.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
