import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Users, ShieldAlert, Scale, ArrowRight, MessageCircle } from 'lucide-react';

/**
 * Seção de Especialidades Forenses no Estilo Exato da Summit Financial (Imagem de Referência)
 * Fundo branco limpo, cabeçalho serif elegante e 5 cards verticais com ícones finos em ouro.
 */
export default function LegalPracticeAreas({ lawyer, nicheInfo, theme }) {
  // Especialidades Estruturadas (Adaptadas dinamicamente ao nicho do advogado)
  const defaultIcons = [Briefcase, Building2, Users, ShieldAlert, Scale];

  const areas = (nicheInfo?.practiceAreas && nicheInfo.practiceAreas.length > 0)
    ? nicheInfo.practiceAreas.map((pa, idx) => ({
        title: pa.title,
        desc: pa.summary || pa.desc || 'Atuação técnica focada em defender seus direitos com agilidade e respaldo legal.',
        icon: defaultIcons[idx % defaultIcons.length]
      }))
    : [
        {
          title: 'Direito do Trabalho',
          desc: 'Atuação especializada em horas extras, rescisões indiretas, assédio moral e equiparação salarial.',
          icon: Briefcase
        },
        {
          title: 'Direito Imobiliário & Lotes',
          desc: 'Segurança jurídica em distratos de lotes, atraso na entrega de imóveis, usucapião e inventários.',
          icon: Building2
        },
        {
          title: 'Direito de Família & Sucessões',
          desc: 'Condução discreta e humanizada de divórcios, partilha de bens, guarda de filhos e inventários.',
          icon: Users
        },
        {
          title: 'Defesa do Consumidor',
          desc: 'Ações contra negativações indevidas no SPC/Serasa, fraudes do Pix, golpes bancários e planos de saúde.',
          icon: ShieldAlert
        },
        {
          title: 'Direito Empresarial',
          desc: 'Assessoria societária contínua, blindagem de patrimônio e defesa em associações de proteção veicular.',
          icon: Scale
        }
      ];

  const topAreas = areas.slice(0, 3);
  const bottomAreas = areas.slice(3);

  const renderCard = (area, idx) => {
    const IconComponent = area.icon;
    const honorific = theme?.honorific || 'Dr(a).';
    const cleanLawyerName = lawyer?.name ? (/^dr[a]?\./i.test(lawyer.name.trim()) ? lawyer.name : `${honorific} ${lawyer.name}`) : honorific;
    const areaWhatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encodeURIComponent(
      `Olá, ${cleanLawyerName}, gostaria de consultar o escritório sobre a área de "${area.title}".`
    )}`;

    return (
      <motion.div
        key={idx}
        whileHover={{ y: -6 }}
        className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 p-8 flex flex-col justify-between text-left group relative"
      >
        <div>
          {/* Ícone Fino em Ouro com Fundo Suave */}
          <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#C6923C] mb-6 group-hover:bg-[#C6923C] group-hover:text-white transition-colors duration-300 shadow-sm">
            <IconComponent className="w-7 h-7 stroke-[1.8]" />
          </div>

          <h3 className="font-sans font-bold text-xl text-[#0A192F] mb-2.5 leading-snug tracking-tight">
            {area.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {area.desc}
          </p>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <a
            href={areaWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#0A192F] group-hover:text-[#C6923C] transition-colors uppercase tracking-wider"
          >
            <span>Consultar Especialidade</span>
            <ArrowRight className="w-4 h-4 text-[#C6923C] group-hover:translate-x-1.5 transition-transform" />
          </a>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="atuacao" className="bg-[#FAFBFD] py-20 sm:py-24 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho Centralizado Elegante */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-[#C6923C]" />
            <span className="text-xs font-semibold text-[#C6923C] uppercase tracking-widest">
              NOSSAS ESPECIALIDADES
            </span>
            <span className="w-8 h-[2px] bg-[#C6923C]" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-sans font-extrabold text-[#0A192F] tracking-tight">
            Soluções Jurídicas Abrangentes
          </h2>
          <p className="text-base text-slate-600 mt-3 font-light leading-relaxed max-w-2xl mx-auto">
            Atendimento estratégico perante a Justiça Estadual e os Tribunais Superiores, com foco no seu respaldo patrimonial e tranquilidade familiar.
          </p>
        </div>

        {/* Grade Superior: 3 Cards Respirados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topAreas.map((area, idx) => renderCard(area, idx))}
        </div>

        {/* Grade Inferior: 2 Cards Centralizados com o mesmo Respiro */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {bottomAreas.map((area, idx) => renderCard(area, idx + 3))}
        </div>

        {/* CTA Conclusivo da Seção de Especialidades */}
        <div className="mt-14 max-w-2xl mx-auto text-center pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4 font-normal">
            Não encontrou a sua demanda específica listada acima? Avaliamos seu cenário com sigilo profissional.
          </p>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={`https://wa.me/${lawyer?.whatsapp}?text=${encodeURIComponent(
              `Olá, Dr(a). ${lawyer?.name}, gostaria de saber se o escritório atende à minha demanda jurídica específica.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0A192F] hover:bg-[#132A4A] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl transition-all group"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Consultar Demanda Específica no WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-[#C6923C] group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

      </div>
    </section>
  );
}
