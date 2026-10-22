import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Componente de SEO Dinamico e Dados Estruturados Schema.org para Nutricionistas
 * Injeta metadados, Open Graph, Twitter Cards e JSON-LD de alta fidelidade
 * compativel com o Google Search Console e diretrizes de saude e bem-estar.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Objeto completo de dados do nutricionista
 */
export default function NutritionSeo({ data }) {
    const { professional, location, contact, seo, niche } = data;

    // Geracao do JSON-LD estruturado compativel com Schema.org para profisionais de saude e nutricao
    const schemaJsonLd = useMemo(() => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': ['Person', 'Physician'],
            'name': professional.name,
            'jobTitle': professional.title,
            'description': professional.shortBio,
            'url': seo.canonicalUrl,
            'image': professional.photo || seo.ogImage,
            'telephone': contact.phone,
            'email': contact.email,
            'medicalSpecialty': 'DietNutrition',
            'knowsAbout': [
                'Nutrição Clínica',
                'Reeducação Alimentar',
                'Comportamento Alimentar',
                'Nutrição Esportiva',
                'Saúde e Bem-estar'
            ]
        };

        // Adiciona dados de endereco fisico se disponiveis e confirmados
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

        // Formacao academica
        if (professional.academicBackground && professional.academicBackground.length > 0) {
            schema.alumniOf = professional.academicBackground.map((item) => ({
                '@type': 'EducationalOrganization',
                'name': item
            }));
        }

        return schema;
    }, [professional, location, contact, seo, niche]);

    const robotsValue = seo.indexable ? 'index, follow' : 'noindex, nofollow';

    return (
        <Helmet>
            {/* Metadados Primarios */}
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            {seo.keywords && <meta name="keywords" content={seo.keywords} />}
            <link rel="canonical" href={seo.canonicalUrl} />
            <meta name="robots" content={robotsValue} />

            {/* Metadados Geograficos para SEO Local */}
            {location && location.city && (
                <>
                    <meta name="geo.region" content={`BR-${location.state}`} />
                    <meta name="geo.placename" content={`${location.city}, ${location.neighborhood || ''}`} />
                </>
            )}

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content="profile" />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={seo.canonicalUrl} />
            {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
            <meta property="og:locale" content="pt_BR" />
            <meta property="og:site_name" content={`${professional.displayName} : Nutrição Personalizada`} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            {seo.ogImage && <meta name="twitter:image" content={seo.ogImage} />}

            {/* Injeção do Schema.org JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(schemaJsonLd)}
            </script>
        </Helmet>
    );
}
