import React, { useState } from 'react';
import { MapPin, ShieldCheck, Wifi, Sparkles, VolumeX, Sun, Coffee, Headphones } from 'lucide-react';
import { buildPsychologyMapEmbedUrl, buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Seção do Espaço Terapêutico e Atendimento Online
 * Mostra as fotos do consultório acolhedor e instruções tranquilizadoras para sessões remotas.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologySpace({ data }) {
  const { address, addressComplement, city, state, neighborhood, spaceImages, workingHours } = data;
  const [activeTab, setActiveTab] = useState('presencial'); // 'presencial' | 'online'

  const mapEmbedUrl = buildPsychologyMapEmbedUrl(address, city);
  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  const images = spaceImages || [
    {
      url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1000&q=80',
      title: 'Sala de Acolhimento Individual',
      description: 'Poltrona ergonômica, luz suave e isolamento acústico para você se sentir seguro e acolhido.'
    },
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      title: 'Recepção Discreta e Tranquila',
      description: 'Espaço com climatização suave e intervalo generoso entre sessões para preservar seu sigilo.'
    },
    {
      url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80',
      title: 'Estrutura para Teleconsulta Segura',
      description: 'Conexão dedicada de fibra óptica e transmissão de vídeo criptografada de ponta a ponta.'
    }
  ];

  return (
    <section id="espaco" className="py-20 sm:py-28 bg-white border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
            Ambiente Planejado
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight">
            Um ambiente pensado para o seu repouso mental
          </h2>
          <p className="text-base text-slate-600 font-light leading-relaxed">
            Seja no consultório presencial ou através da teleconsulta no conforto da sua casa, cada detalhe foi estruturado para garantir serenidade, silêncio e confidencialidade.
          </p>

          {/* Abas Alternadoras (Presencial vs Online) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#F4F1EA] border border-[#E7E2D8] mt-4">
            <button
              onClick={() => setActiveTab('presencial')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'presencial'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consultório Presencial
            </button>
            <button
              onClick={() => setActiveTab('online')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 'online'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Atendimento Online (Teleconsulta)
            </button>
          </div>
        </div>

        {/* Conteúdo Aba Presencial */}
        {activeTab === 'presencial' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            
            {/* Galeria de Fotos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="group relative rounded-3xl overflow-hidden bg-slate-100 border border-[#E7E2D8] shadow-xs text-left"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 bg-white">
                    <h4 className="font-serif text-lg font-medium text-slate-800 mb-1">
                      {img.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      {img.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Diferenciais de Conforto Físico & Localização */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#E8E3D8]">
              
              <div className="lg:col-span-6 text-left space-y-6">
                <div className="flex items-center gap-2 text-emerald-800 font-medium text-xs tracking-wider uppercase">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Localização e Acesso</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-slate-800">
                  {neighborhood ? `${neighborhood}, ${city}` : city} - {state}
                </h3>

                <p className="text-sm text-slate-600 font-light leading-relaxed">
                  <strong className="font-semibold text-slate-700">{address}</strong>
                  {addressComplement && <span className="block text-slate-500 text-xs mt-1">{addressComplement}</span>}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-[#E7E2D8]">
                    <VolumeX className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Isolamento acústico duplo</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-[#E7E2D8]">
                    <Sun className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Luz natural regulável</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-[#E7E2D8]">
                    <Coffee className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chás calmantes e água</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-[#E7E2D8]">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Higienização constante</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 pt-1">
                  Horário de Atendimento: {workingHours}
                </p>
              </div>

              {/* Mapa Google Maps Interativo */}
              <div className="lg:col-span-6 h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#E0DBD0] shadow-sm">
                <iframe
                  title="Localização do Consultório de Psicologia"
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>

          </div>
        )}

        {/* Conteúdo Aba Online */}
        {activeTab === 'online' && (
          <div className="max-w-4xl mx-auto bg-[#FAF5FF]/50 rounded-3xl p-8 sm:p-12 border border-purple-100 text-left animate-in fade-in duration-300">
            <div className="space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                <Wifi className="w-3.5 h-3.5 text-purple-700" />
                <span>Atendimento Online com Autorização CFP / E-Psi</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-slate-800">
                Como funciona a psicoterapia online segura?
              </h3>

              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                As sessões online são realizadas através de salas virtuais criptografadas de alta estabilidade (Google Meet ou Zoom Pro), garantindo que a sua confidencialidade seja protegida com o mesmo rigor de uma consulta presencial.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">Privacidade</h4>
                  <p className="text-xs text-slate-500 font-light">
                    Escolha um cômodo tranquilo e use fones de ouvido para total isolamento.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">Conexão Estável</h4>
                  <p className="text-xs text-slate-500 font-light">
                    Computador, tablet ou smartphone conectado ao Wi-Fi ou 4G/5G.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800">Criptografia Total</h4>
                  <p className="text-xs text-slate-500 font-light">
                    Sessões protegidas de ponta a ponta, sem nenhuma gravação de áudio ou vídeo.
                  </p>
                </div>
              </div>

              <div className="pt-4 text-center sm:text-left">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-medium text-sm shadow-sm transition-all duration-200"
                >
                  <span>Agendar Consulta Online</span>
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
