import React from 'react';
import { MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * ModernNutritionDarkLocation: Secao elegante de atendimento em fundo azul marinho profundo (#0C4A6E).
 * Disposicao fiel a imagem de referencia NutriVida:
 * - Card esquerdo: Endereco presencial com link direto para o Google Maps.
 * - Card central: Mapa Google Maps interativo ou estilizado.
 * - Card direito: Horarios de atendimento detalhados com botao de agendamento.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos de localizacao e contato
 * @param {object} props.nutritionist - Alias de compatibilidade
 * @param {function} props.onBookingClick - Callback opcional para agendamento
 */
export default function ModernNutritionDarkLocation({ data, nutritionist, onBookingClick }) {
    const profile = data || nutritionist || {};
    const loc = profile.location || profile;
    const contact = profile.contact || profile;

    const city = loc.city || 'Rio de Janeiro';
    const state = loc.state || 'RJ';
    const neighborhood = loc.neighborhood || 'Barra da Tijuca';
    const address = loc.address || 'Av. das Américas, 500: Barra da Tijuca';

    // Mapa Embed com fallback confiavel
    const defaultMapEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.1166348625943!2d-43.20845342378942!3d-22.98270104085444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9b10707797b5e5%3A0xa193d5fbf9303d2b!2sR.%20Visc.%20de%20Piraj%C3%A1%2C%20550%20-%20Ipanema%2C%20Rio%20de%20Janeiro%20-%20RJ!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr';
    const mapEmbedUrl = loc.mapEmbedUrl || defaultMapEmbed;

    // Link externo para navegacao GPS no Google Maps
    const mapsNavigationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}, ${state}`)}`;

    const handleBooking = () => {
        if (onBookingClick) {
            onBookingClick();
            return;
        }
        const element = document.getElementById('agendamento-rapido') || document.getElementById('inicio');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            const rawPhone = contact.whatsapp || '5521999999999';
            const cleanPhone = String(rawPhone).replace(/\D/g, '');
            window.open(`https://wa.me/${cleanPhone}?text=Olá! Gostaria de agendar uma consulta no consultório.`, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section id="locais-atendimento" className="py-16 md:py-20 bg-[#0C4A6E] text-white relative overflow-hidden">
            {/* Efeitos luminosos de fundo em azul profundo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Cabecalho da Secao Escura */}
                <div className="max-w-3xl mb-10 text-left">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Atendimento no {city}
                    </h2>
                    <p className="text-sky-200/90 text-sm sm:text-base mt-2 leading-relaxed">
                        Consultório em localização estratégica, de fácil acesso, além de atendimento online para todo o Brasil.
                    </p>
                </div>

                {/* Grade dos 3 Cards: Endereco, Mapa e Horarios */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Card 1: Endereco e Bairro (3 colunas) */}
                    <div className="lg:col-span-3 flex flex-col">
                        <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl border border-sky-200/50 h-full flex flex-col justify-between text-left">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-[#0284C7]" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {city} : {state}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Bairro: {neighborhood}
                                </p>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    {address}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-6">
                                <a
                                    href={mapsNavigationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors group"
                                >
                                    <span>Ver no Google Maps</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Mapa Centralizado (6 colunas) */}
                    <div className="lg:col-span-6 flex flex-col min-h-[260px] sm:min-h-[300px]">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-sky-300/30 bg-slate-900">
                            <iframe
                                title={`Mapa de localização em ${city}`}
                                src={mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '260px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>

                    {/* Card 3: Horarios de Atendimento e Acao (3 colunas) */}
                    <div className="lg:col-span-3 flex flex-col">
                        <div className="bg-white text-slate-800 rounded-2xl p-6 shadow-xl border border-sky-200/50 h-full flex flex-col justify-between text-left">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-[#0284C7]" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                                        Horários de atendimento
                                    </h3>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                                        <span className="text-slate-500 font-medium">Segunda a Sexta</span>
                                        <span className="font-bold text-slate-800">08h às 20h</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5">
                                        <span className="text-slate-500 font-medium">Sábado</span>
                                        <span className="font-bold text-slate-800">08h às 12h</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleBooking}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
                                >
                                    <span>Agendar consulta</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
