import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getNutritionistBySlug, getDefaultNutritionist } from '../../data/nutritionistsData';
import { applyNutritionistOverrides } from '../../utils/nutritionProspectUtils';

import NutritionSeo from '../../components/nutrition/NutritionSeo';
import NutritionHeader from '../../components/nutrition/NutritionHeader';
import NutritionHero from '../../components/nutrition/NutritionHero';
import NutritionTrustBar from '../../components/nutrition/NutritionTrustBar';
import NutritionProfessional from '../../components/nutrition/NutritionProfessional';
import NutritionServices from '../../components/nutrition/NutritionServices';
import NutritionHowItWorks from '../../components/nutrition/NutritionHowItWorks';
import NutritionDifferentials from '../../components/nutrition/NutritionDifferentials';
import NutritionTestimonials from '../../components/nutrition/NutritionTestimonials';
import NutritionLocation from '../../components/nutrition/NutritionLocation';
import NutritionFaq from '../../components/nutrition/NutritionFaq';
import NutritionFinalCta from '../../components/nutrition/NutritionFinalCta';
import NutritionFooter from '../../components/nutrition/NutritionFooter';
import NutritionFloatingWhatsApp from '../../components/nutrition/NutritionFloatingWhatsApp';
import NutritionProspectDrawer from '../../components/nutrition/NutritionProspectDrawer';

/**
 * Pagina Principal Dinamica de Nutricionista
 * 100% maleavel: recupera dados pelo slug, permite sobreposicoes via URL (query params)
 * e oferece personalizacao manual em tempo real via simulador de prospeccao.
 */
export default function NutritionistPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Estado para edicoes manuais feitas no painel flutuante do operador
  const [manualOverrides, setManualOverrides] = useState(null);

  // 1. Recupera o profissional solicitado ou o perfil padrao do Rio de Janeiro
  const baseNutritionist = useMemo(() => {
    if (slug) {
      const found = getNutritionistBySlug(slug);
      if (found) return found;
    }
    return getDefaultNutritionist();
  }, [slug]);

  // 2. Aplica sobreposicoes vindas da URL (ex: ?nome=...&whatsapp=...&cidade=...) e edicoes manuais
  const activeNutritionist = useMemo(() => {
    if (!baseNutritionist) return null;

    // Primeiro aplica parametros de URL (se houver)
    let combined = applyNutritionistOverrides(baseNutritionist, searchParams);

    // Depois aplica edicoes manuais do operador (se houver)
    if (manualOverrides) {
      combined = applyNutritionistOverrides(combined, manualOverrides);
    }

    return combined;
  }, [baseNutritionist, searchParams, manualOverrides]);

  // Se nao encontrar nenhum dado
  if (!activeNutritionist) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-[#244B3B] mb-4">
          Perfil Nutricional Nao Encontrado
        </h1>
        <p className="text-[#252925]/70 max-w-md mb-8">
          O perfil de nutricionista solicitado nao esta disponivel no momento ou o endereco foi digitado incorretamente.
        </p>
        <Link
          to="/criacao-site-nutricionista"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#244B3B] text-white font-medium hover:bg-[#1b382c] transition-colors"
        >
          Conhecer Plataforma para Nutricionistas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#252925] font-sans selection:bg-[#244B3B] selection:text-white">
      {/* 1. Injecao de Metadados e Schema.org */}
      <NutritionSeo data={activeNutritionist} nutritionist={activeNutritionist} />

      {/* 2. Cabecalho Fixo Editorial */}
      <NutritionHeader data={activeNutritionist} nutritionist={activeNutritionist} />

      <main>
        {/* 3. Hero de Alta Conversao */}
        <NutritionHero data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 4. Faixa de Credibilidade com Dados Verificaveis */}
        <NutritionTrustBar data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 5. Apresentacao do Profissional e Formacao Academica */}
        <NutritionProfessional data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 6. Especialidades e Servicos Prestados */}
        <NutritionServices data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 7. Como Funciona o Atendimento em 3 Etapas */}
        <NutritionHowItWorks data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 8. Diferenciais Reais e Acolhimento */}
        <NutritionDifferentials data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 9. Prova Social e Avaliacoes com Consentimento */}
        <NutritionTestimonials data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 10. Localizacao, Consultorio e Teleconsulta */}
        <NutritionLocation data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 11. Perguntas Frequentes (FAQ Acordeon) */}
        <NutritionFaq data={activeNutritionist} nutritionist={activeNutritionist} />

        {/* 12. Chamada Final para Agendamento */}
        <NutritionFinalCta data={activeNutritionist} nutritionist={activeNutritionist} />
      </main>

      {/* 13. Rodape com Aviso Legal do CFN */}
      <NutritionFooter data={activeNutritionist} nutritionist={activeNutritionist} />

      {/* 14. Botao Flutuante Oficial de WhatsApp */}
      <NutritionFloatingWhatsApp data={activeNutritionist} nutritionist={activeNutritionist} />

      {/* 15. Gaveta de Prospeccao e Customizacao Manual em Tempo Real */}
      <NutritionProspectDrawer
        currentData={activeNutritionist}
        onApplyOverrides={(updatedFields) => setManualOverrides(updatedFields)}
        onReset={() => setManualOverrides(null)}
      />
    </div>
  );
}
