import React from 'react';
import { Calendar, CreditCard, Monitor, MapPin } from 'lucide-react';

/**
 * ModernNutritionBenefitsBar: Faixa solida em azul marinho profundo (#0C4A6E)
 * com 4 facilidades operacionais de consulta que aumentam a conversao:
 * 1. Horarios flexiveis (Manha, tarde e noite)
 * 2. Pagamento facilitado (Pix, cartao e planos)
 * 3. Atendimento online (Em todo o Brasil)
 * 4. Consultorio local (Localizacao de facil acesso)
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados da nutricionista e localidade
 * @param {object} props.nutritionist - Alias de compatibilidade
 */
export default function ModernNutritionBenefitsBar({ data, nutritionist }) {
    const profile = data || nutritionist || {};
    const loc = profile.location || profile;
    const city = loc.city || 'Rio de Janeiro';
    const state = loc.state || 'RJ';

    const benefits = [
        {
            id: 'horarios',
            icon: Calendar,
            title: 'Horários flexíveis',
            subtitle: 'Manhã, tarde e noite'
        },
        {
            id: 'pagamento',
            icon: CreditCard,
            title: 'Pagamento facilitado',
            subtitle: 'Pix, cartão e planos'
        },
        {
            id: 'online',
            icon: Monitor,
            title: 'Atendimento online',
            subtitle: 'Em todo o Brasil'
        },
        {
            id: 'local',
            icon: MapPin,
            title: `Consultório em ${city}: ${state}`,
            subtitle: 'Localização de fácil acesso'
        }
    ];

    return (
        <section className="bg-[#0C4A6E] text-white py-6 md:py-8 border-y border-sky-900/40 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {benefits.map((item) => {
                        const IconComponent = item.icon;

                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-3.5 sm:gap-4 justify-start sm:justify-center lg:justify-start"
                            >
                                {/* Icone em Ciano Claro com Fundo Suave */}
                                <div className="w-11 h-11 rounded-xl bg-white/10 text-sky-300 flex items-center justify-center shrink-0 border border-white/10 shadow-xs">
                                    <IconComponent className="w-5 h-5 text-[#38BDF8]" />
                                </div>

                                {/* Textos com Contraste Acentuado */}
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-sky-200/90 mt-0.5">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
