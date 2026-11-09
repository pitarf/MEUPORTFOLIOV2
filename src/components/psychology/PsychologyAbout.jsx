import React from 'react';
import { Award, GraduationCap, CheckCircle2, Heart, Shield, BookOpen } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Seção Sobre a Profissional
 * Conecta a credibilidade técnica e acadêmica à empatia e postura humana.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyAbout({ data }) {
  const { name, title, crp, about, avatarUrl, yearsOfExperience, completedSessions } = data;
  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name);

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-[#FAF8F5] relative overflow-hidden">
      {/* Detalhe de fundo suave */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-100/40 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -left-20 w-80 h-80 bg-emerald-100/40 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Coluna da Imagem e Conquistas (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Moldura da Foto */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-[0_20px_45px_rgba(15,23,42,0.07)] border border-[#E8E3D8]">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Card Flutuante 1: Anos de Prática Clínica */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white rounded-2xl p-4 shadow-lg border border-[#E7E2D8] flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-serif text-xl font-bold shrink-0">
                  {yearsOfExperience || 11}+
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Anos de Prática</h4>
                  <p className="text-xs text-slate-500">Dedicação à escuta clínica</p>
                </div>
              </div>

              {/* Card Flutuante 2: Sessões Realizadas */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white rounded-2xl p-4 shadow-lg border border-purple-100 flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                  {completedSessions || '+3.500'}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Atendimentos</h4>
                  <p className="text-xs text-slate-500">Histórias acolhidas</p>
                </div>
              </div>

            </div>
          </div>

          {/* Coluna de Texto e Trajetória (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-medium">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>{about?.badge || 'Sobre a Profissional'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight leading-tight">
              {about?.greeting || `Olá, sou ${name.split(' ')[0]}.`}
            </h2>

            <p className="text-lg text-emerald-900 font-serif italic font-normal leading-relaxed border-l-2 border-emerald-600 pl-4 py-1">
              "{about?.lead || 'Acredito que a terapia não é sobre consertar quem você é, mas sobre criar um espaço seguro para que você possa se reencontrar.'}"
            </p>

            <div className="space-y-4 text-base text-slate-600 font-light leading-relaxed">
              {about?.bio ? (
                about.bio.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    Sou Psicóloga Clínica com formação continuada e foco em abordagens baseadas em evidências científicas. Meu compromisso é oferecer uma escuta acolhedora, isenta de julgamentos e focada no desenvolvimento de recursos emocionais práticos para o seu cotidiano.
                  </p>
                  <p>
                    Compreendo que buscar ajuda requer coragem. Por isso, prezo por uma relação terapêutica transparente, empática e pautada no sigilo incondicional, onde você é o protagonista da sua própria história.
                  </p>
                </>
              )}
            </div>

            {/* Credenciais e Formação Acadêmica */}
            <div className="pt-4 border-t border-[#EAE5DB]">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                Formação e Reconhecimento Profissional:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(about?.credentials || [
                  'Graduação em Psicologia (UFRJ)',
                  'Especialização em TCC pelo IPUB/UFRJ',
                  'Membro Ativo da FBTC',
                  `Inscrição Ativa: ${crp}`,
                  'Cadastro Nacional E-Psi para Atendimentos Online'
                ]).map((cred, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E9E4DC]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-slate-700 font-medium leading-snug">{cred}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de Contato Direto */}
            <div className="pt-4">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Conhecer Minha Linha de Cuidado</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
