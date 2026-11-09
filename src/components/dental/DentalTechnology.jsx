import React from 'react';
import { Cpu, Feather, Activity, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Seção de Tecnologia 3D e Biossegurança Odontológica
 * Apresenta a infraestrutura digital que elimina o desconforto e potencializa a precisão.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalTechnology({ data }) {
  const { technologies } = data;

  const getTechIcon = (iconName) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-sky-600" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-cyan-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <section id="tecnologia" className="py-20 sm:py-28 bg-gradient-to-b from-sky-50/50 via-sky-50/20 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Infraestrutura Odontológica Digital</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tecnologia de Ponta a Serviço do Seu Conforto
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Investimos em equipamentos de padrão internacional para que seus procedimentos sejam mais rápidos, precisos, confortáveis e com previsibilidade absoluta.
          </p>
        </div>

        {/* Grade de Tecnologias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
            >
              {/* Imagem do Equipamento / Procedimento */}
              <div className="sm:w-2/5 relative h-52 sm:h-auto overflow-hidden shrink-0">
                <img
                  src={tech.image}
                  alt={tech.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width="400"
                  height="300"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/40 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-sky-900 shadow-xs">
                  {tech.badge}
                </span>
              </div>

              {/* Conteúdo Textual */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4">
                    {getTechIcon(tech.icon)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Procedimento 100% validado clinicamente</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Box Especial de Biossegurança Hospitalar */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-sky-900/50 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Rigor Máximo em Biossegurança & Controle de Infecção
              </h4>
              <p className="text-xs sm:text-sm text-sky-100/80 mt-1 max-w-2xl leading-relaxed">
                Nossos consultórios contam com fluxo contínuo de esterilização em autoclave com monitoramento biológico semanal, barreira de proteção descartável em todos os pontos de contato e ar purificado. Sua saúde é tratada com padrão hospitalar.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600/30 border border-sky-400/40 text-cyan-200 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Selo Grau Hospitalar
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
