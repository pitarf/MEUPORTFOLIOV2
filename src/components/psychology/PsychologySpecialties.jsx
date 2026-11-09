import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Seção de Especialidades e Áreas de Atuação Clínica
 * Cards detalhados, humanos e empáticos para ajudar o paciente a se identificar e buscar apoio.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologySpecialties({ data }) {
  const { specialties } = data;

  return (
    <section id="especialidades" className="py-20 sm:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Áreas de Cuidado e Acolhimento</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight">
            Em quais momentos da vida posso caminhar ao seu lado?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Cada pessoa traz consigo uma bagagem única. O acompanhamento terapêutico é desenhado de forma individualizada para respeitar a sua história e atender às suas necessidades presentes.
          </p>
        </div>

        {/* Grid de Especialidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((item) => {
            const isEmerald = item.color === 'emerald';
            const contextUrl = buildWhatsAppBookingUrl(data.phone, data.name, item.title);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between bg-white rounded-3xl p-7 sm:p-8 border border-[#E7E2D8] hover:border-emerald-300 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_35px_rgba(5,150,105,0.08)] transition-all duration-300 hover:-translate-y-1 text-left"
              >
                <div>
                  {/* Badge de Cor */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isEmerald
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          : 'bg-purple-50 text-purple-800 border border-purple-100'
                      }`}
                    >
                      {item.title.split(' e ')[0]}
                    </span>

                    <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-700 group-hover:bg-emerald-50 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Título da Especialidade */}
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-slate-800 mb-3 group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>

                  {/* Descrição Acolhedora */}
                  <p className="text-sm text-slate-600 leading-relaxed font-light mb-6">
                    {item.fullDescription || item.shortDescription}
                  </p>

                  {/* Sinais Comuns / Sintomas */}
                  {item.symptoms && item.symptoms.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 mb-6">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Sinais frequentes no dia a dia:
                      </p>
                      <ul className="space-y-2">
                        {item.symptoms.map((symptom, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isEmerald ? 'text-emerald-600' : 'text-purple-600'}`} />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Link Direto para Consulta */}
                <a
                  href={contextUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 hover:bg-emerald-700 text-slate-700 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200 border border-slate-200/80 hover:border-transparent group-hover:shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 opacity-70" />
                  <span>Conversar sobre este tema</span>
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
