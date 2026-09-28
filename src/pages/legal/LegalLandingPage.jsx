import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LEGAL_NICHES } from '../../data/legalTemplates';
import { legalProspectService } from '../../services/legalProspectService';

import LegalTopBar from '../../components/legal/LegalTopBar';
import LegalNavbar from '../../components/legal/LegalNavbar';
import LegalHero from '../../components/legal/LegalHero';
import LegalTrustBar from '../../components/legal/LegalTrustBar';
import LegalPracticeAreas from '../../components/legal/LegalPracticeAreas';
import LegalAbout from '../../components/legal/LegalAbout';
import LegalMethodology from '../../components/legal/LegalMethodology';
import LegalReviews from '../../components/legal/LegalReviews';
import LegalDiagnosisCalculator from '../../components/legal/LegalDiagnosisCalculator';
import LegalCinematicBanner from '../../components/legal/LegalCinematicBanner';
import LegalFooter from '../../components/legal/LegalFooter';
import LegalFloatingWhatsApp from '../../components/legal/LegalFloatingWhatsApp';

/**
 * Página Principal da Landing Page Jurídica de Alta Conversão
 * Construída rigorosamente na arquitetura visual de referência Summit Financial Partners.
 */
export default function LegalLandingPage() {
  const { slug, niche } = useParams();

  // Determina se é por prospect cadastrado ou por nicho direto
  const { lawyerData, nicheInfo, heroImage } = useMemo(() => {
    // 1. Caso seja rota de nicho direto (ex: /modelo-advocacia/trabalhista)
    if (niche && LEGAL_NICHES[niche]) {
      const info = LEGAL_NICHES[niche];
      return {
        lawyerData: info.defaultLawyer,
        nicheInfo: info,
        heroImage: info.heroImage
      };
    }

    // 2. Caso seja por slug de prospect (ex: /advocacia/dr-jorge-santos-aracaju)
    if (slug) {
      // Se o slug for o próprio nome do nicho
      if (LEGAL_NICHES[slug]) {
        const info = LEGAL_NICHES[slug];
        return {
          lawyerData: info.defaultLawyer,
          nicheInfo: info,
          heroImage: info.heroImage
        };
      }

      // Procura prospect cadastrado
      const prospect = legalProspectService.getBySlug(slug);
      if (prospect) {
        const targetNiche = prospect.niche || 'geral';
        const info = LEGAL_NICHES[targetNiche] || LEGAL_NICHES.geral;
        
        return {
          lawyerData: {
            name: prospect.lawyer_name || info.defaultLawyer.name,
            oab: prospect.oab_number || info.defaultLawyer.oab,
            role: info.badge,
            city: prospect.city || info.defaultLawyer.city,
            state: prospect.state || info.defaultLawyer.state,
            address: prospect.address || info.defaultLawyer.address,
            phone: prospect.phone || prospect.whatsapp || info.defaultLawyer.phone,
            whatsapp: (prospect.whatsapp || '').replace(/\D/g, '') || info.defaultLawyer.whatsapp,
            email: prospect.email || info.defaultLawyer.email,
            instagram: info.defaultLawyer.instagram,
            experienceYears: info.defaultLawyer.experienceYears
          },
          nicheInfo: info,
          heroImage: prospect.custom_hero_url || info.heroImage
        };
      }
    }

    // Fallback padrão: Modelo Geral
    const defaultInfo = LEGAL_NICHES.geral;
    return {
      lawyerData: defaultInfo.defaultLawyer,
      nicheInfo: defaultInfo,
      heroImage: defaultInfo.heroImage
    };
  }, [slug, niche]);

  // Atualização dinâmica de Título e Proteção NoIndex (SEO off para páginas demo de prospecção)
  useEffect(() => {
    document.title = `${lawyerData.name} | ${nicheInfo.badge} - Atendimento Especializado`;

    // Injeta meta tag robots noindex para não poluir os motores de busca com demonstrações
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      // Limpeza ao sair da página
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, [lawyerData, nicheInfo]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#C6923C] selection:text-white">
      
      {/* 1. Barra Utilitária Superior (Topo Escuro com Endereço, Horário e Telefone) */}
      <LegalTopBar lawyer={lawyerData} />

      {/* 2. Navbar Branca Corporativa com Links e Botão de Agendamento */}
      <LegalNavbar lawyer={lawyerData} nicheInfo={nicheInfo} />

      {/* 3. Hero Section em Dark Navy com Foto Executiva na Mesa e Botões Duplos */}
      <LegalHero lawyer={lawyerData} nicheInfo={nicheInfo} heroImage={heroImage} />

      {/* 4. Barra de 4 Pilares de Confiança (Fiduciary, Independent, Strategies, Privacy) */}
      <LegalTrustBar />

      {/* 5. Especialidades Forenses (Grade com 5 Cards Limpos e Ícones em Ouro) */}
      <LegalPracticeAreas lawyer={lawyerData} nicheInfo={nicheInfo} />

      {/* 6. Sobre Nós (Foto de Reunião com Clientes + Checklist + 4 Métricas Verticais) */}
      <LegalAbout lawyer={lawyerData} nicheInfo={nicheInfo} />

      {/* 7. Nosso Processo (4 Círculos Conectados com Badges Numéricas Douradas) */}
      <LegalMethodology lawyer={lawyerData} nicheInfo={nicheInfo} />

      {/* 8. Depoimentos de Clientes (3 Cards Limpos com 5 Estrelas) */}
      <LegalReviews lawyer={lawyerData} />

      {/* 9. Diagnóstico Jurídico Interativo de 60 Segundos */}
      <LegalDiagnosisCalculator lawyer={lawyerData} nicheInfo={nicheInfo} />

      {/* 10. Banner de Pré-Rodapé (Chamada à Ação Panorâmica com Skyline e Botão Dourado) */}
      <LegalCinematicBanner lawyer={lawyerData} />

      {/* 11. Rodapé Corporativo Completo de 4 Colunas */}
      <LegalFooter lawyer={lawyerData} nicheInfo={nicheInfo} />

      {/* 12. Botão Flutuante de Contato Rápido no WhatsApp */}
      <LegalFloatingWhatsApp lawyer={lawyerData} />

    </div>
  );
}
