import React from 'react';
import { Smile, Clock, Sparkles, AlertCircle, Calendar } from 'lucide-react';

/**
 * Galeria de Sorrisos e Casos Clínicos
 * Em estrita conformidade com as diretrizes éticas do Conselho Federal de Odontologia (CFO).
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalSmileGallery({ data }) {
  const { smileCases, contact } = data;

  return (
    <section id="sorrisos" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Harmonia & Função Mastigatória</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transformações Reais que Iluminam o Olhar
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Cada sorriso é único. Desenvolvemos planejamentos personalizados que respeitam a harmonia do seu rosto, a proporção dentária e a naturalidade biológica.
          </p>
        </div>

        {/* Grade de Casos Clínicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {smileCases.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Foto do Sorriso / Caso */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width="600"
                  height="450"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/95 text-sky-900 shadow-xs">
                  {item.tag}
                </span>
              </div>

              {/* Detalhes do Caso */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>{item.duration}</span>
                  </div>
                  <span className="text-sky-600 font-semibold group-hover:underline">
                    Caso Clínico
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aviso Ético Conforme Resolução do CFO */}
        <div className="mt-10 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3 text-xs text-slate-600 max-w-4xl mx-auto">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Nota de Esclarecimento Ético (CFO/CRO):</strong> As imagens apresentadas têm finalidade exclusivamente educativa e ilustrativa de procedimentos odontológicos. Em virtude das particularidades anatômicas e biológicas individuais de cada paciente, os resultados podem variar e não configuram garantia estrita de resultado idêntico.
          </p>
        </div>

        {/* CTA Intermediário */}
        <div className="mt-12 text-center">
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all min-h-[44px]"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Consulta de Avaliação do Sorriso</span>
          </a>
        </div>

      </div>
    </section>
  );
}
