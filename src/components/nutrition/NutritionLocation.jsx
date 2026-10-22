import React from 'react';
import { MapPin, Clock, Video, Building2, Phone } from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Secao de Localizacao e Modalidades de Atendimento (SEO Local)
 * Apresenta o endereco fisico (quando autorizado) e as opcoes de teleconsulta para todo o Brasil.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionLocation({ data }) {
    const { location, contact, professional } = data;

    const isOnlineOnly = location.serviceMode && location.serviceMode.length === 1 && location.serviceMode.includes('online');

    return (
        <section id="localizacao" className="py-16 md:py-24 bg-white border-b border-stone-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#557A61]">
                        Onde e Como Atendemos
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#252925] tracking-tight">
                        {isOnlineOnly ? 'Atendimento Online em Todo o Brasil' : `Consultório no ${location.city} & Teleconsulta`}
                    </h2>
                    <p className="text-sm sm:text-base text-stone-600">
                        Escolha a modalidade que melhor se adapta à sua conveniência e rotina.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Informações de Localização / Contato */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Atendimento Presencial */}
                        {!isOnlineOnly && location.address && (
                            <div className="bg-[#F8F7F2] p-6 rounded-2xl border border-stone-200 space-y-3">
                                <div className="flex items-center gap-2.5 text-[#244B3B] font-bold text-sm">
                                    <Building2 className="w-5 h-5 text-[#557A61]" />
                                    <span>Atendimento Presencial</span>
                                </div>
                                <p className="text-sm text-[#252925] font-semibold">
                                    {location.address}
                                </p>
                                <p className="text-xs text-stone-600">
                                    {location.neighborhood} • {location.city} • {location.state} • CEP {location.zipCode}
                                </p>
                                {location.reference && (
                                    <p className="text-xs text-stone-500 italic pt-1">
                                        Ponto de referência: {location.reference}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Teleconsulta Online */}
                        <div className="bg-[#F8F7F2] p-6 rounded-2xl border border-stone-200 space-y-3">
                            <div className="flex items-center gap-2.5 text-[#244B3B] font-bold text-sm">
                                <Video className="w-5 h-5 text-[#557A61]" />
                                <span>Consulta Online (Teleconsulta)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                                {location.onlineScope || 'Atendimento por videochamada privada em plataforma segura, com envio do plano alimentar e materiais diretamente no seu celular.'}
                            </p>
                        </div>

                        {/* Horários e Contato */}
                        <div className="bg-[#F8F7F2] p-6 rounded-2xl border border-stone-200 space-y-3">
                            <div className="flex items-center gap-2.5 text-[#244B3B] font-bold text-sm">
                                <Clock className="w-5 h-5 text-[#557A61]" />
                                <span>Horários de Atendimento</span>
                            </div>
                            <p className="text-xs sm:text-sm text-stone-600">
                                {location.hours}
                            </p>
                            <div className="pt-2">
                                <a
                                    href={contact.bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-[#244B3B] hover:text-[#557A61]"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Telefone / WhatsApp: {contact.phone}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Mapa Incorporado ou Card Informativo */}
                    <div className="lg:col-span-7">
                        {!isOnlineOnly && location.mapEmbedUrl ? (
                            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md h-[400px] bg-stone-100">
                                <iframe
                                    src={location.mapEmbedUrl}
                                    title={`Mapa de localização de ${professional.name}`}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen=""
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="rounded-2xl p-10 bg-[#244B3B] text-white flex flex-col justify-between h-[400px] shadow-md">
                                <div className="space-y-4">
                                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#F8F7F2]/70">
                                        Saúde Sem Fronteiras
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                        Acompanhamento Nutricional onde quer que você esteja.
                                    </h3>
                                    <p className="text-sm text-[#F8F7F2]/80 leading-relaxed max-w-md">
                                        Nossas consultas online proporcionam a mesma atenção detalhada, avaliação clínica e personalização que o atendimento presencial.
                                    </p>
                                </div>

                                <div>
                                    <a
                                        href={contact.bookingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#244B3B] font-bold text-xs hover:bg-stone-100 transition-all shadow-sm"
                                    >
                                        <WhatsAppIcon className="w-4 h-4 text-[#244B3B]" />
                                        <span>Agendar Teleconsulta</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
