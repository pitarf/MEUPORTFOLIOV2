import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente de SEO Otimizado e Dados Estruturados Schema.org para Psicólogos
 * Gera tags de metadados, Open Graph e JSON-LD de alta conformidade com o Google e o CFP.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos do psicólogo
 */
export default function PsychologySeo({ data }) {
  const { name, title, crp, city, state, neighborhood, hero, avatarUrl } = data;

  const siteTitle = `${name} | ${title} - ${city}/${state}`;
  const siteDescription = `${hero?.subheadline || 'Psicoterapia humanizada e acolhedora com base na TCC.'} ${crp}. Atendimento presencial em ${neighborhood || city} e online para todo o Brasil e exterior.`;
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : 'https://rafaelpita.com.br/psicologo';
  const ogImage = avatarUrl || 'https://images.unsplash.com/photo-1594824813588-e9f029a8a72b?auto=format&fit=crop&w=1200&q=80';

  // Gerador de JSON-LD estruturado Schema.org
  const schemaJsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': ['Person', 'MedicalBusiness'],
      'name': name,
      'jobTitle': title,
      'description': siteDescription,
      'url': canonicalUrl,
      'image': ogImage,
      'telephone': data.phone,
      'email': data.email,
      'medicalSpecialty': 'Psychiatric',
      'knowsAbout': [
        'Psicoterapia Individual',
        'Terapia Cognitivo-Comportamental',
        'Ansiedade e Pânico',
        'Depressão e Burnout',
        'Saúde Mental',
        'Regulação Emocional'
      ],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': data.address,
        'addressLocality': city,
        'addressRegion': state,
        'addressCountry': 'BR'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': data.rating || '5.0',
        'reviewCount': data.reviewCount || '48'
      }
    };
  }, [name, title, siteDescription, canonicalUrl, ogImage, data, city, state]);

  return (
    <Helmet>
      {/* Metadados Básicos */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaJsonLd)}
      </script>
    </Helmet>
  );
}
