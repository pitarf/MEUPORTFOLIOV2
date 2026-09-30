import React, { useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { LEGAL_NICHES } from '../../data/legalTemplates';
import { legalProspectService } from '../../services/legalProspectService';
import { googleMapsProspectService, buildGoogleMapsUrl } from '../../services/googleMapsProspectService';
import { detectLawyerGender, LEGAL_THEMES } from '../../utils/genderDetection';

import LegalTopBar from '../../components/legal/LegalTopBar';
import LegalNavbar from '../../components/legal/LegalNavbar';
import LegalHero from '../../components/legal/LegalHero';
import LegalTrustBar from '../../components/legal/LegalTrustBar';
import LegalPracticeAreas from '../../components/legal/LegalPracticeAreas';
import LegalAbout from '../../components/legal/LegalAbout';
import LegalMethodology from '../../components/legal/LegalMethodology';
import LegalReviews from '../../components/legal/LegalReviews';
import LegalDiagnosisCalculator from '../../components/legal/LegalDiagnosisCalculator';
import LegalFaq from '../../components/legal/LegalFaq';
import LegalCinematicBanner from '../../components/legal/LegalCinematicBanner';
import LegalFooter from '../../components/legal/LegalFooter';
import LegalFloatingWhatsApp from '../../components/legal/LegalFloatingWhatsApp';

/**
 * Página Principal da Landing Page Jurídica de Alta Conversão
 * Construída rigorosamente na arquitetura visual de referência Summit Financial Partners.
 */
export default function LegalLandingPage() {
  const { slug, niche } = useParams();
  const [searchParams] = useSearchParams();
  const [cloudData, setCloudData] = React.useState(null);

  // Busca demonstração salva na nuvem pelo slug caso o visitante abra em dispositivo externo
  useEffect(() => {
    if (slug && !LEGAL_NICHES[slug]) {
      googleMapsProspectService.getCloudDemo(slug).then((res) => {
        if (res) {
          setCloudData(res);
        }
      });
    }
  }, [slug]);

  // Determina se é por prospect cadastrado, nuvem Supabase, parâmetros portáteis ou por nicho direto
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

    // 2. Prioridade 1: Dados recuperados da nuvem (Supabase VPS)
    if (cloudData) {
      const targetNiche = cloudData.niche || 'geral';
      const info = LEGAL_NICHES[targetNiche] || LEGAL_NICHES.geral;
      const cleanPhone = (cloudData.whatsapp || cloudData.phone || '').toString().replace(/\D/g, '');
      const rawAddress = cloudData.address || (cloudData.city ? `${cloudData.city} - ${cloudData.state || 'SP'}` : info.defaultLawyer.address);

      return {
        lawyerData: {
          name: cloudData.name || cloudData.lawyer_name || info.defaultLawyer.name,
          oab: cloudData.state ? `Inscrição Regular OAB/${cloudData.state}` : 'Inscrição Regular OAB',
          role: info.badge,
          city: cloudData.city || info.defaultLawyer.city,
          state: cloudData.state || info.defaultLawyer.state,
          address: rawAddress,
          phone: cloudData.phone || info.defaultLawyer.phone,
          whatsapp: cleanPhone || info.defaultLawyer.whatsapp,
          email: cloudData.email || '',
          instagram: cloudData.instagram || '',
          experienceYears: info.defaultLawyer.experienceYears,
          google_maps_url: cloudData.google_maps_url || '',
          rating: Number(cloudData.rating || 5.0),
          reviews_count: Number(cloudData.reviews_count || 48),
          isExpired: cloudData.isExpired
        },
        nicheInfo: info,
        heroImage: cloudData.custom_hero_url || info.heroImage
      };
    }

    // 3. Prioridade 2: Dados passados via query string (Permite que a demo funcione via parâmetros curtos)
    const paramNome = searchParams.get('nome') || searchParams.get('name') || searchParams.get('n');
    const paramTel = searchParams.get('tel') || searchParams.get('whatsapp') || searchParams.get('w');
    const paramCidade = searchParams.get('cidade') || searchParams.get('city') || searchParams.get('c');
    const paramUf = searchParams.get('uf') || searchParams.get('state');
    const paramEnd = searchParams.get('end') || searchParams.get('address');
    const paramNicho = searchParams.get('nicho') || searchParams.get('niche');
    const paramNota = searchParams.get('nota') || searchParams.get('rating');
    const paramReviews = searchParams.get('rev') || searchParams.get('reviews');

    if (paramNome) {
      const targetNiche = paramNicho || 'geral';
      const info = LEGAL_NICHES[targetNiche] || LEGAL_NICHES.geral;
      const cleanPhone = (paramTel || '').toString().replace(/\D/g, '');
      const rawWhatsapp = cleanPhone.length >= 10 && !cleanPhone.startsWith('55') ? `55${cleanPhone}` : cleanPhone;
      
      const syntheticLead = {
        lawyer_name: paramNome,
        name: paramNome,
        address: paramEnd || (paramCidade ? `${paramCidade} - ${paramUf || 'SP'}` : info.defaultLawyer.address),
        city: paramCidade || info.defaultLawyer.city,
        state: paramUf || info.defaultLawyer.state,
        phone: paramTel || info.defaultLawyer.phone,
        whatsapp: rawWhatsapp || info.defaultLawyer.whatsapp,
        rating: Number(paramNota || 5.0),
        reviews_count: Number(paramReviews || 48)
      };

      const mapsUrl = buildGoogleMapsUrl(syntheticLead);

      return {
        lawyerData: {
          name: paramNome,
          oab: paramUf ? `Inscrição Regular OAB/${paramUf}` : 'Inscrição Regular OAB',
          role: info.badge,
          city: paramCidade || info.defaultLawyer.city,
          state: paramUf || info.defaultLawyer.state,
          address: paramEnd || (paramCidade ? `${paramCidade} - ${paramUf || 'SP'}` : info.defaultLawyer.address),
          phone: paramTel || info.defaultLawyer.phone,
          whatsapp: rawWhatsapp || info.defaultLawyer.whatsapp,
          email: '',
          instagram: '',
          experienceYears: info.defaultLawyer.experienceYears,
          google_maps_url: mapsUrl,
          rating: Number(paramNota || 5.0),
          reviews_count: Number(paramReviews || 48)
        },
        nicheInfo: info,
        heroImage: info.heroImage
      };
    }

    // 4. Prioridade 3: Caso seja por slug de prospect local ou Smart Slug Parsing
    if (slug) {
      if (LEGAL_NICHES[slug]) {
        const info = LEGAL_NICHES[slug];
        return {
          lawyerData: info.defaultLawyer,
          nicheInfo: info,
          heroImage: info.heroImage
        };
      }

      // Procura prospect cadastrado no CRM local ou no Radar
      const prospect = legalProspectService.getBySlug(slug) || googleMapsProspectService.getBySlug(slug);
      if (prospect) {
        const targetNiche = prospect.niche || 'geral';
        const info = LEGAL_NICHES[targetNiche] || LEGAL_NICHES.geral;
        
        const rawName = prospect.lawyer_name || prospect.name || info.defaultLawyer.name;
        const rawAddress = prospect.address || (prospect.city && prospect.state ? `${prospect.city} - ${prospect.state}` : info.defaultLawyer.address);
        const rawPhone = prospect.phone || prospect.whatsapp || info.defaultLawyer.phone;
        const rawWhatsapp = (prospect.whatsapp || prospect.phone || '').toString().replace(/\D/g, '') || info.defaultLawyer.whatsapp;
        const rawInstagram = prospect.instagram && prospect.instagram.trim() !== '' ? prospect.instagram.trim() : '';

        const rawOab = prospect.oab_number || prospect.oab || (prospect.state ? `Inscrição Regular OAB/${prospect.state}` : 'Inscrição Regular OAB');
        const mapsUrl = buildGoogleMapsUrl(prospect);

        return {
          lawyerData: {
            name: rawName,
            oab: rawOab,
            role: info.badge,
            city: prospect.city || info.defaultLawyer.city,
            state: prospect.state || info.defaultLawyer.state,
            address: rawAddress,
            phone: rawPhone,
            whatsapp: rawWhatsapp,
            email: prospect.email || '',
            instagram: rawInstagram,
            experienceYears: prospect.experienceYears || info.defaultLawyer.experienceYears,
            google_maps_url: mapsUrl,
            rating: prospect.rating || 4.9,
            reviews_count: prospect.reviews_count || 48
          },
          nicheInfo: info,
          heroImage: prospect.custom_hero_url || info.heroImage
        };
      }

      // Smart Slug Parsing de Fallback (Extrai nome formatado diretamente da URL limpa)
      const parsedName = slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');

      const info = LEGAL_NICHES.geral;
      const shortCity = paramCidade || info.defaultLawyer.city;
      const shortUf = paramUf || info.defaultLawyer.state;

      return {
        lawyerData: {
          name: parsedName,
          oab: shortUf ? `Inscrição Regular OAB/${shortUf}` : 'Inscrição Regular OAB',
          role: info.badge,
          city: shortCity,
          state: shortUf,
          address: `${shortCity} - ${shortUf}`,
          phone: paramTel || info.defaultLawyer.phone,
          whatsapp: paramTel ? paramTel.replace(/\D/g, '') : info.defaultLawyer.whatsapp,
          email: '',
          instagram: '',
          experienceYears: info.defaultLawyer.experienceYears,
          google_maps_url: '',
          rating: 5.0,
          reviews_count: 48
        },
        nicheInfo: info,
        heroImage: info.heroImage
      };
    }

    // Fallback padrão: Modelo Geral
    const defaultInfo = LEGAL_NICHES.geral;
    return {
      lawyerData: defaultInfo.defaultLawyer,
      nicheInfo: defaultInfo,
      heroImage: defaultInfo.heroImage
    };
  }, [slug, niche, cloudData, searchParams]);

  // Detecção automática de gênero (Dra. / Vinho Nobre vs Dr. / Navy Clássico)
  const gender = lawyerData.gender || detectLawyerGender(lawyerData.name);
  const theme = LEGAL_THEMES[gender] || LEGAL_THEMES.male;

  // Imagem de Hero adaptada à estética e gênero do profissional
  const activeHeroImage = (heroImage && !heroImage.includes('hero_desk.jpg'))
    ? heroImage
    : theme.heroDefaultImg;

  // Atualização dinâmica de Título e Proteção NoIndex (SEO off para páginas demo de prospecção)
  useEffect(() => {
    const hasPrefix = /^(dr\.|dra\.|doutor|doutora)/i.test(lawyerData.name.trim());
    const displayTitleName = hasPrefix ? lawyerData.name : `${theme.honorific} ${lawyerData.name}`;
    document.title = `${displayTitleName} | ${nicheInfo.badge} - Atendimento Especializado`;

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
  }, [lawyerData, nicheInfo, theme]);

  return (
    <div className={`min-h-screen bg-white text-slate-800 font-sans ${theme.gender === 'female' ? 'selection:bg-[#9A1E58]' : 'selection:bg-[#C6923C]'} selection:text-white`}>
      
      {/* 1. Barra Utilitária Superior (Topo Escuro com Endereço, Horário e Telefone) */}
      <LegalTopBar lawyer={lawyerData} theme={theme} />

      {/* 2. Navbar Branca Corporativa com Links e Botão de Agendamento */}
      <LegalNavbar lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 3. Hero Section em Dark Navy / Vinho Nobre com Foto Executiva na Mesa e Botões Duplos */}
      <LegalHero lawyer={lawyerData} nicheInfo={nicheInfo} heroImage={activeHeroImage} theme={theme} />

      {/* 4. Barra de 4 Pilares de Confiança (Fiduciary, Independent, Strategies, Privacy) */}
      <LegalTrustBar theme={theme} />

      {/* 5. Especialidades Forenses (Grade com 5 Cards Limpos e Ícones em Ouro) */}
      <LegalPracticeAreas lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 6. Sobre Nós (Foto de Reunião com Clientes + Checklist + 4 Métricas Verticais) */}
      <LegalAbout lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 7. Nosso Processo (4 Círculos Conectados com Badges Numéricas Douradas) */}
      <LegalMethodology lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 8. Depoimentos de Clientes (3 Cards Limpos com 5 Estrelas) */}
      <LegalReviews lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 9. Diagnóstico Jurídico Interativo de 60 Segundos */}
      <LegalDiagnosisCalculator lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 10. Esclarecimentos & Perguntas Frequentes (Com Card de Suporte no WhatsApp) */}
      <LegalFaq lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 11. Banner de Pré-Rodapé (Chamada à Ação Panorâmica com Skyline e Botão Dourado) */}
      <LegalCinematicBanner lawyer={lawyerData} theme={theme} />

      {/* 12. Rodapé Corporativo Completo de 4 Colunas */}
      <LegalFooter lawyer={lawyerData} nicheInfo={nicheInfo} theme={theme} />

      {/* 13. Botão Flutuante de Contato Rápido no WhatsApp */}
      <LegalFloatingWhatsApp lawyer={lawyerData} theme={theme} />

    </div>
  );
}
