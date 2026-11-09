import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPsychologistBySlug, getDefaultPsychologist } from '../../data/psychologyData';
import { applyPsychologyOverrides } from '../../utils/psychologyProspectUtils';

import PsychologySeo from '../../components/psychology/PsychologySeo';
import PsychologyHeader from '../../components/psychology/PsychologyHeader';
import PsychologyHero from '../../components/psychology/PsychologyHero';
import PsychologyTrustBar from '../../components/psychology/PsychologyTrustBar';
import PsychologySpecialties from '../../components/psychology/PsychologySpecialties';
import PsychologyHowItWorks from '../../components/psychology/PsychologyHowItWorks';
import PsychologyAbout from '../../components/psychology/PsychologyAbout';
import PsychologySpace from '../../components/psychology/PsychologySpace';
import PsychologyTestimonials from '../../components/psychology/PsychologyTestimonials';
import PsychologyFaq from '../../components/psychology/PsychologyFaq';
import PsychologyFinalCta from '../../components/psychology/PsychologyFinalCta';
import PsychologyFooter from '../../components/psychology/PsychologyFooter';
import PsychologyFloatingWhatsApp from '../../components/psychology/PsychologyFloatingWhatsApp';
import PsychologyProspectDrawer from '../../components/psychology/PsychologyProspectDrawer';

/**
 * Página Principal da Landing Page Ultra-Premium de Psicologia Clínica e Saúde Mental
 * Arquitetura flexível com suporte a slugs, query params em tempo real e simulador de prospecção.
 */
export default function PsychologyPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Estado para edições manuais feitas no drawer flutuante do operador
  const [manualOverrides, setManualOverrides] = useState(null);

  // 1. Recupera o profissional solicitado ou o perfil padrão demonstrativo
  const baseData = useMemo(() => {
    if (slug) {
      const found = getPsychologistBySlug(slug);
      if (found) return found;
    }
    return getDefaultPsychologist();
  }, [slug]);

  // 2. Aplica sobreposições vindas da URL e/ou do simulador de prospecção
  const activeData = useMemo(() => {
    if (!baseData) return null;

    // Primeiro aplica parâmetros de busca da URL (?nome=...&cidade=...&crp=...)
    let combined = applyPsychologyOverrides(baseData, searchParams);

    // Depois aplica edições manuais feitas em tempo real pelo operador
    if (manualOverrides) {
      combined = applyPsychologyOverrides(combined, manualOverrides);
    }

    return combined;
  }, [baseData, searchParams, manualOverrides]);

  if (!activeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-slate-700">
        <p className="text-sm font-medium">Carregando consultório de psicologia...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* 1. Metadados e SEO Estruturado */}
      <PsychologySeo data={activeData} />

      {/* 2. Barra de Navegação Superior */}
      <PsychologyHeader data={activeData} />

      {/* 3. Hero Section Humanizada */}
      <PsychologyHero data={activeData} />

      {/* 4. Barra de Pilares Éticos e Confiança */}
      <PsychologyTrustBar data={activeData} />

      {/* 5. Áreas de Atuação e Especialidades */}
      <PsychologySpecialties data={activeData} />

      {/* 6. Linha do Tempo: Como Iniciar a Terapia */}
      <PsychologyHowItWorks data={activeData} />

      {/* 7. Apresentação da Profissional */}
      <PsychologyAbout data={activeData} />

      {/* 8. Consultório Presencial e Teleconsulta Segura */}
      <PsychologySpace data={activeData} />

      {/* 9. Relatos e Depoimentos (Anonimato Ético CFP) */}
      <PsychologyTestimonials data={activeData} />

      {/* 10. Perguntas Frequentes (FAQ) */}
      <PsychologyFaq data={activeData} />

      {/* 11. Chamada Final Acolhedora */}
      <PsychologyFinalCta data={activeData} />

      {/* 12. Rodapé Institucional com Suporte CVV 188 */}
      <PsychologyFooter data={activeData} />

      {/* 13. Botão Flutuante de Atendimento WhatsApp */}
      <PsychologyFloatingWhatsApp data={activeData} />

      {/* 14. Simulador Flutuante de Prospecção */}
      <PsychologyProspectDrawer
        currentData={activeData}
        onApplyOverrides={(newValues) => setManualOverrides(newValues)}
        onReset={() => setManualOverrides(null)}
      />
    </div>
  );
}
