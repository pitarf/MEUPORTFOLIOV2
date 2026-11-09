import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Dados base e utilitários de parametrização dinâmica
import { defaultBarbershopData } from '@/data/barbershopData';
import { applyBarbershopOverrides } from '@/utils/barbershopProspectUtils';

// Componentes modulares da barbearia
import BarbershopHeader from '@/components/barbershop/BarbershopHeader';
import BarbershopHero from '@/components/barbershop/BarbershopHero';
import BarbershopTrustBar from '@/components/barbershop/BarbershopTrustBar';
import BarbershopServices from '@/components/barbershop/BarbershopServices';
import BarbershopSpecialists from '@/components/barbershop/BarbershopSpecialists';
import BarbershopGallery from '@/components/barbershop/BarbershopGallery';
import BarbershopTestimonials from '@/components/barbershop/BarbershopTestimonials';
import BarbershopLocation from '@/components/barbershop/BarbershopLocation';
import BarbershopFaq from '@/components/barbershop/BarbershopFaq';
import BarbershopFinalCta from '@/components/barbershop/BarbershopFinalCta';
import BarbershopFooter from '@/components/barbershop/BarbershopFooter';
import BarbershopFloatingWhatsApp from '@/components/barbershop/BarbershopFloatingWhatsApp';

/**
 * Página Principal da Barbearia Ultra-Premium
 * Suporta parametrização dinâmica via slug de URL ou query parameters
 * (ex: ?nome=Barbearia+Imperial&whatsapp=21999999999&cidade=Niteroi&bairro=Icarai)
 * permitindo o uso direto em prospecção ativa e campanhas de CRM.
 */
export default function BarbershopPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Aplica as sobreposições dinâmicas aos dados base
  const barbershopData = useMemo(() => {
    // Caso houvesse um banco com múltiplos slugs, buscaríamos aqui; usamos defaultBarbershopData como base
    let base = defaultBarbershopData;
    
    // Se vier um slug com nome legível (ex: barbearia-do-ze), pode ser formatado
    if (slug && slug !== 'default' && slug !== 'modelo' && !searchParams.get('nome')) {
      const slugName = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      base = {
        ...base,
        name: slugName,
        headline: `Estilo, Precisão e Tradição na ${slugName}`,
      };
    }

    return applyBarbershopOverrides(base, searchParams);
  }, [slug, searchParams]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950 font-sans antialiased scroll-smooth">
      
      {/* Otimização de SEO e Metadados Sociais */}
      <Helmet>
        <title>{barbershopData.seo?.title || `${barbershopData.name} | Barbearia Ultra-Premium`}</title>
        <meta
          name="description"
          content={barbershopData.seo?.description || `Agende seu corte e barboterapia na ${barbershopData.name}. Chopp artesanal cortesia e atendimento pontual.`}
        />
        <meta name="keywords" content={barbershopData.seo?.keywords || 'barbearia, corte masculino, barboterapia, navalha'} />
        <meta property="og:title" content={barbershopData.seo?.title || barbershopData.name} />
        <meta property="og:description" content={barbershopData.seo?.description} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* 1. Header Fixo com Status e CTA */}
      <BarbershopHeader data={barbershopData} />

      {/* 2. Hero Section com Headline, Badges de Experiência e Visual Clássico */}
      <main>
        <BarbershopHero data={barbershopData} />

        {/* 3. Barra de Indicadores de Confiança (Google 4.9, Tradição, Clientes) */}
        <BarbershopTrustBar data={barbershopData} />

        {/* 4. Cardápio de Serviços & Combos VIP */}
        <BarbershopServices data={barbershopData} />

        {/* 5. Equipe de Mestres Barbeiros */}
        <BarbershopSpecialists data={barbershopData} />

        {/* 6. Galeria Fotográfica do Espaço */}
        <BarbershopGallery data={barbershopData} />

        {/* 7. Depoimentos e Avaliações Verificadas */}
        <BarbershopTestimonials data={barbershopData} />

        {/* 8. Localização, Horários e Mapa Interativo */}
        <BarbershopLocation data={barbershopData} />

        {/* 9. Perguntas Frequentes (FAQ) */}
        <BarbershopFaq data={barbershopData} />

        {/* 10. Chamada de Ação Final (Final CTA) */}
        <BarbershopFinalCta data={barbershopData} />
      </main>

      {/* 11. Rodapé Institucional Vintage */}
      <BarbershopFooter data={barbershopData} />

      {/* 12. Botão Flutuante Pulsante do WhatsApp */}
      <BarbershopFloatingWhatsApp data={barbershopData} />

    </div>
  );
}
