import React, { useState } from 'react';
import { 
  Smile, 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  HeartHandshake, 
  Eye, 
  ArrowRight, 
  Check, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';

/**
 * Grade Interativa de Tratamentos Odontológicos Modernos
 * Apresenta procedimentos com foco em benefícios reais, segurança e estética.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalTreatments({ data }) {
  const { treatments, contact, professional } = data;
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  // Mapeamento dinâmico de ícones Lucide
  const getTreatmentIcon = (iconName) => {
    const props = { className: 'w-6 h-6 text-sky-600' };
    switch (iconName) {
      case 'Smile':
        return <Smile {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const categories = [
    { id: 'todos', label: 'Todos os Tratamentos' },
    { id: 'estetica', label: 'Estética & Alinhamento' },
    { id: 'reabilitacao', label: 'Implantes & Reabilitação' },
    { id: 'prevencao', label: 'Prevenção & Cuidado' }
  ];

  // Filtragem dos tratamentos
  const filteredTreatments = treatments.filter((item) => {
    if (activeCategory === 'todos') return true;
    if (activeCategory === 'estetica') {
      return ['alinhadores', 'lentes', 'clareamento', 'harmonizacao'].includes(item.id);
    }
    if (activeCategory === 'reabilitacao') {
      return ['implantes', 'lentes'].includes(item.id);
    }
    if (activeCategory === 'prevencao') {
      return ['checkup', 'alinhadores'].includes(item.id);
    }
    return true;
  });

  // Link personalizado no WhatsApp para o tratamento selecionado
  const getTreatmentWhatsappUrl = (treatmentTitle) => {
    const message = encodeURIComponent(
      `Olá, ${professional.name}! Gostaria de saber mais informações e valores sobre o tratamento de ${treatmentTitle}.`
    );
    return `https://wa.me/${contact.whatsapp}?text=${message}`;
  };

  return (
    <section id="tratamentos" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Especialidades Odontológicas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tratamentos Modernos com Foco no Seu Conforto
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Eliminamos o desconforto e o receio tradicional do consultório através de tecnologia digital 3D e métodos minimamente invasivos.
          </p>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                  activeCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Cards de Tratamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="group bg-slate-50/70 hover:bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-sky-300 shadow-xs hover:shadow-xl hover:shadow-sky-950/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Topo do Card: Ícone e Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-sky-50 group-hover:border-sky-200 transition-all duration-300">
                    {getTreatmentIcon(treatment.iconName)}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-100/80 text-sky-800">
                    {treatment.badge}
                  </span>
                </div>

                {/* Tag de Nicho */}
                <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider">
                  {treatment.tag}
                </span>

                {/* Título */}
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2.5 group-hover:text-sky-700 transition-colors">
                  {treatment.title}
                </h3>

                {/* Descrição Curta */}
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {treatment.shortDesc}
                </p>

                {/* Highlights do Tratamento */}
                <ul className="space-y-2 mb-6 pt-4 border-t border-slate-200/60">
                  {treatment.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botões de Ação do Card */}
              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTreatment(treatment)}
                  className="text-xs font-semibold text-slate-600 hover:text-sky-700 inline-flex items-center gap-1 py-2 focus:outline-hidden min-h-[44px]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ver Detalhes</span>
                </button>

                <a
                  href={getTreatmentWhatsappUrl(treatment.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all min-h-[44px]"
                  aria-label={`Agendar avaliação de ${treatment.title}`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Agendar</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Modal Interativo de Detalhes do Tratamento */}
      {selectedTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 relative animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center">
                  {getTreatmentIcon(selectedTreatment.iconName)}
                </div>
                <div>
                  <span className="text-xs font-semibold text-sky-600">{selectedTreatment.tag}</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedTreatment.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTreatment(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {selectedTreatment.fullDesc}
            </p>

            <div className="bg-sky-50/60 rounded-2xl p-4 mb-6 border border-sky-100">
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-2">
                Principais Vantagens Clínicas:
              </h4>
              <ul className="space-y-2">
                {selectedTreatment.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={getTreatmentWhatsappUrl(selectedTreatment.title)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedTreatment(null)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold text-sm shadow-md active:scale-95 transition-all min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar Sobre Este Tratamento</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedTreatment(null)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors min-h-[44px]"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
