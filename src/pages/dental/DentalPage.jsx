import React, { useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getDentalClinicBySlug, getDefaultDentalClinic } from '../../data/dentalData';
import { applyDentalOverrides } from '../../utils/dentalProspectUtils';

import DentalSeo from '../../components/dental/DentalSeo';
import DentalHeader from '../../components/dental/DentalHeader';
import DentalHero from '../../components/dental/DentalHero';
import DentalTrustBar from '../../components/dental/DentalTrustBar';
import DentalTreatments from '../../components/dental/DentalTreatments';
import DentalTechnology from '../../components/dental/DentalTechnology';
import DentalSmileGallery from '../../components/dental/DentalSmileGallery';
import DentalLocation from '../../components/dental/DentalLocation';
import DentalTestimonials from '../../components/dental/DentalTestimonials';
import DentalFaq from '../../components/dental/DentalFaq';
import DentalFinalCta from '../../components/dental/DentalFinalCta';
import DentalFooter from '../../components/dental/DentalFooter';
import DentalFloatingWhatsApp from '../../components/dental/DentalFloatingWhatsApp';

/**
 * Página Mestra Dinâmica para Clínicas Odontológicas e Dentistas
 * Totalmente maleável: recupera dados pelo slug ou aplica sobreposições em tempo real
 * via URL query params (?nome=...&whatsapp=...&cidade=...&bairro=...)
 * perfeitamente compatível com CRM e Google Maps Scraper.
 */
export default function DentalPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // 1. Recupera os dados base pelo slug ou carrega o perfil demonstrativo principal
  const baseClinic = useMemo(() => {
    if (slug) {
      const found = getDentalClinicBySlug(slug);
      if (found) return found;
    }
    return getDefaultDentalClinic();
  }, [slug]);

  // 2. Aplica sobreposições dinâmicas vindas da URL se presentes
  const activeClinic = useMemo(() => {
    if (!baseClinic) return null;
    return applyDentalOverrides(baseClinic, searchParams);
  }, [baseClinic, searchParams]);

  // Se por alguma eventualidade não houver dados válidos
  if (!activeClinic) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Clínica Odontológica Não Encontrada
        </h1>
        <p className="text-slate-600 max-w-md mb-8">
          O perfil odontológico solicitado não está disponível ou o endereço foi digitado incorretamente.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-500 transition-colors"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-600 selection:text-white">
      {/* 0. Barra Informativa Superior de Demonstração / Maleabilidade */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-sky-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sky-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-medium">
              Ambiente de Demonstração Interativo de Odontologia &bull; Design Ultra-Premium
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-sky-300">
            <span className="hidden md:inline">Personalização ativa por parâmetros de URL</span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-800/80 text-white font-bold border border-sky-700">
              {activeClinic.location.city} - {activeClinic.location.state}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Injeção de Metadados e SEO Local com Schema.org */}
      <DentalSeo data={activeClinic} />

      {/* 2. Header Fixo com Navegação */}
      <DentalHeader data={activeClinic} />

      {/* 3. Hero Section de Alta Conversão */}
      <DentalHero data={activeClinic} />

      {/* 4. Barra de Selos de Confiança e Credenciais */}
      <DentalTrustBar data={activeClinic} />

      {/* 5. Grade de Tratamentos Modernos */}
      <DentalTreatments data={activeClinic} />

      {/* 6. Infraestrutura Tecnológica 3D & Biossegurança */}
      <DentalTechnology data={activeClinic} />

      {/* 7. Galeria de Sorrisos com Conformidade Ética CFO */}
      <DentalSmileGallery data={activeClinic} />

      {/* 8. Localização, Estrutura e Mapa Interativo */}
      <DentalLocation data={activeClinic} />

      {/* 9. Depoimentos e Avaliações Google 5.0 */}
      <DentalTestimonials data={activeClinic} />

      {/* 10. Perguntas Frequentes (FAQ) */}
      <DentalFaq data={activeClinic} />

      {/* 11. Chamada Final para Agendamento (CTA) */}
      <DentalFinalCta data={activeClinic} />

      {/* 12. Rodapé Completo */}
      <DentalFooter data={activeClinic} />

      {/* 13. Botão Flutuante de Atendimento WhatsApp */}
      <DentalFloatingWhatsApp data={activeClinic} />
    </div>
  );
}
