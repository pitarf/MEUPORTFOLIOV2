import React from 'react';
import { ArrowRight } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * ModernNutritionCtaBanner: Banner panoramico azul degradê com prato saudavel.
 * Elemento de conversao final fiel a referencia NutriVida:
 * - Titulo: 'Vamos cuidar da sua saúde juntos?'
 * - Subtitulo: 'Agende sua consulta e dê o primeiro passo para uma vida mais saudável e equilibrada.'
 * - Botoes duplos: 'Agendar minha consulta' e 'Falar pelo WhatsApp'.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados da nutricionista e contato
 * @param {object} props.nutritionist - Alias de compatibilidade
 * @param {function} props.onBookingClick - Callback opcional para agendamento
 */
export default function ModernNutritionCtaBanner({ data, nutritionist, onBookingClick }) {
    const profile = data || nutritionist || {};
    const contact = profile.contact || profile;

    const rawPhone = contact.whatsapp || '5521999999999';
    const cleanPhone = String(rawPhone).replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Olá! Gostaria de agendar minha consulta nutricional.')}`;

    const handleBooking = () => {
        if (onBookingClick) {
            onBookingClick();
            return;
        }
        const element = document.getElementById('agendamento-rapido') || document.getElementById('inicio');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section className="py-10 md:py-16 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Banner Panoramico com Degrade e Detalhe Fotografico */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] shadow-2xl p-8 sm:p-12 lg:p-14 text-white">
                    {/* Imagem de Fundo Suave com Prato Saudavel */}
                    <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
                            alt="Alimentação equilibrada"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Circulos Luminosos Fluidos */}
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-900/30 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                        
                        {/* Textos Convidativos */}
                        <div className="max-w-2xl">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                Vamos cuidar da sua saúde juntos?
                            </h2>
                            <p className="text-sky-100 text-sm sm:text-base mt-3 leading-relaxed">
                                Agende sua consulta e dê o primeiro passo para uma vida mais saudável e equilibrada.
                            </p>
                        </div>

                        {/* Dupla de Botoes de Acao */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto shrink-0">
                            <button
                                type="button"
                                onClick={handleBooking}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-[#0284C7] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all group"
                            >
                                <span>Agendar minha consulta</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#0284C7]" />
                            </button>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/15 border-2 border-white text-white font-bold text-sm sm:text-base transition-all"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                                <span>Falar pelo WhatsApp</span>
                            </a>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
