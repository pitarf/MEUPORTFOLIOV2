import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente de SEO Dinâmico e Dados Estruturados Schema.org para Clínicas Odontológicas
 * Injeta metadados, Open Graph, Twitter Cards e JSON-LD de alta fidelidade
 * compatível com as diretrizes do Google Search e Schema.org (Dentist / MedicalClinic).
 * 
 * @param {object} props
 * @param {object} props.data - Objeto completo de dados do dentista/clínica
 */
export default function DentalSeo({ data }) {
  const { professional, location, contact, seo, clinicName } = data;

  // Geração do JSON-LD estruturado compatível com Schema.org para Odontologia
  const schemaJsonLd = useMemo(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': ['Dentist', 'MedicalClinic'],
      'name': clinicName || professional.name,
      'legalName': clinicName || professional.name,
      'description': seo?.description || professional.shortBio,
      'url': seo?.canonicalUrl || 'https://rafaelpitaoficial.com.br/dentista',
      'image': professional.photo || seo?.ogImage,
      'telephone': contact.phone,
      'email': contact.email,
      'medicalSpecialty': [
        'Dentistry',
        'Implantology',
        'Orthodontics',
        'Prosthodontics',
        'CosmeticDentistry'
      ],
      'priceRange': '$$$',
      'openingHours': 'Mo-Fr 08:00-20:00, Sa 08:30-13:30'
    };

    if (location && location.address) {
      schema.address = {
        '@type': 'PostalAddress',
        'streetAddress': location.address,
        'addressLocality': location.city,
        'addressRegion': location.state,
        'postalCode': location.zipCode,
        'addressCountry': 'BR'
      };
    }

    if (location && location.neighborhood) {
      schema.areaServed = {
        '@type': 'AdministrativeArea',
        'name': `${location.neighborhood}, ${location.city} - ${location.state}`
      };
    }

    return schema;
  }, [professional, location, contact, seo, clinicName]);

  const robotsValue = seo?.indexable ? 'index, follow' : 'noindex, nofollow';

  return (
    <Helmet>
      {/* Metatags Primárias */}
      <title>{seo?.title || `${professional.name} | Clínica Odontológica`}</title>
      <meta name="description" content={seo?.description || professional.shortBio} />
      {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
      <meta name="robots" content={robotsValue} />
      <meta name="author" content={professional.name} />
      <meta name="theme-color" content="#0284C7" />

      {/* Canonical Link */}
      {seo?.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo?.title || `${professional.name} | Dentista`} />
      <meta property="og:description" content={seo?.description || professional.shortBio} />
      <meta property="og:image" content={seo?.ogImage || professional.photo} />
      {seo?.canonicalUrl && <meta property="og:url" content={seo.canonicalUrl} />}
      <meta property="og:site_name" content={clinicName || professional.name} />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo?.title || `${professional.name} | Dentista`} />
      <meta name="twitter:description" content={seo?.description || professional.shortBio} />
      <meta name="twitter:image" content={seo?.ogImage || professional.photo} />

      {/* Schema.org JSON-LD para Google Search Console e Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify(schemaJsonLd)}
      </script>
    </Helmet>
  );
}
