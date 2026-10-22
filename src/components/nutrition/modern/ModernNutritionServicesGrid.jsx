import React from 'react';
import { Apple, Dumbbell, Leaf, Users, ChevronRight } from 'lucide-react';

/**
 * ModernNutritionServicesGrid: Grade de 4 cards de servicos horizontais limpos.
 * Segue a disposicao da referencia NutriVida:
 * 1. Emagrecimento Saudavel
 * 2. Nutricao Esportiva
 * 3. Reeducacao Alimentar
 * 4. Nutricao Clinica
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista (opcional para customizacao)
 * @param {function} props.onSelectService - Callback disparado ao selecionar um servico
 */
export default function ModernNutritionServicesGrid({ data, onSelectService }) {
    const contact = data?.contact || {};
    const rawPhone = contact.whatsapp || '5521999999999';
    const cleanPhone = String(rawPhone).replace(/\D/g, '');

    // Definicao dos 4 servicos principais fieis a referencia visual
    const services = [
        {
            id: 'emagrecimento',
            title: 'Emagrecimento Saudável',
            description: 'Plano alimentar equilibrado e sem radicalismos.',
            icon: Apple,
            whatsappTopic: 'Emagrecimento Saudável'
        },
        {
            id: 'esportiva',
            title: 'Nutrição Esportiva',
            description: 'Performance, ganho de massa e mais disposição.',
            icon: Dumbbell,
            whatsappTopic: 'Nutrição Esportiva e Performance'
        },
        {
            id: 'reeducacao',
            title: 'Reeducação Alimentar',
            description: 'Mais saúde e qualidade de vida no seu dia a dia.',
            icon: Leaf,
            whatsappTopic: 'Reeducação Alimentar'
        },
        {
            id: 'clinica',
            title: 'Nutrição Clínica',
            description: 'Acompanhamento para diferentes fases da vida.',
            icon: Users,
            whatsappTopic: 'Nutrição Clínica e Exames'
        }
    ];

    // Trata o clique no card de servico
    const handleCardClick = (service) => {
        if (onSelectService) {
            onSelectService(service);
            return;
        }

        const message = `Olá! Gostaria de saber mais sobre o atendimento de ${service.whatsappTopic}.`;
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <section id="servicos" className="py-8 md:py-12 bg-white relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {services.map((service) => {
                        const IconComponent = service.icon;

                        return (
                            <div
                                key={service.id}
                                onClick={() => handleCardClick(service)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleCardClick(service);
                                    }
                                }}
                                className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-sky-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 text-left"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    {/* Icone Tematico em Circulo Azul Suave */}
                                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 group-hover:bg-[#0284C7] group-hover:text-white transition-colors duration-200">
                                        <IconComponent className="w-5 h-5" />
                                    </div>

                                    {/* Textos Informativos */}
                                    <div className="min-w-0">
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors truncate">
                                            {service.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Seta de Acao Direcional */}
                                <div className="text-slate-300 group-hover:text-[#0284C7] group-hover:translate-x-1 transition-all shrink-0">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
