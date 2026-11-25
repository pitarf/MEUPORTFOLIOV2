import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Componente SEO centralizado para a marca RAMIELL
 * Injeta metadados essenciais, links canônicos, Open Graph e Twitter Cards
 * direcionados ao domínio oficial https://ramiell.com.
 * 
 * @param {Object} props
 * @param {string} props.title - Título personalizado para a página
 * @param {string} props.description - Descrição personalizada para a página
 * @param {string} props.keywords - Palavras-chave personalizadas para a página
 * @param {string} props.image - Imagem Open Graph de compartilhamento
 * @param {string} props.url - URL canônica da rota atual
 */
const SEO = ({ title, description, keywords, image, url }) => {
    const { config } = useSiteConfig();
    const location = useLocation();
    const [photoMetadata, setPhotoMetadata] = useState(null);

    const isPhotography = location.pathname.startsWith('/portfolio-fotografia');
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://ramiell.com');

    // Rotas restritas que não devem ser indexadas
    const noIndexPaths = ['/admin', '/dashboard', '/area-clientes', '/support', '/track-ticket', '/pit-ai', '/pitai', '/jarvis'];
    const isNoIndex = noIndexPaths.some(path => 
        location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

    useEffect(() => {
        const fetchPhotoMeta = async () => {
            if (isPhotography && !photoMetadata) {
                const { data } = await supabase
                    .from('landing_page_content')
                    .select('nav_site_name, nav_logo_url, hero_subtitle')
                    .eq('page_slug', 'fotografia')
                    .single();
                if (data) setPhotoMetadata(data);
            }
        };
        fetchPhotoMeta();
    }, [isPhotography, photoMetadata]);

    const makeAbsoluteUrl = (path) => {
        if (!path) return 'https://ramiell.com/brand/ramiell-logo.png';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        return `https://ramiell.com${path.startsWith('/') ? '' : '/'}${path}`;
    };

    // Título Oficial RAMIELL
    let finalTitle = title;
    if (!finalTitle) {
        if (isPhotography && photoMetadata?.nav_site_name) {
            finalTitle = `${photoMetadata.nav_site_name} | Fotografia Profissional`;
        } else {
            finalTitle = 'RAMIELL | Desenvolvimento de Sites, Sistemas & Experiências Digitais';
        }
    } else {
        const siteSuffix = 'RAMIELL';
        if (!finalTitle.includes(siteSuffix)) {
            finalTitle = `${finalTitle} | ${siteSuffix}`;
        }
    }

    // Descrição
    let finalDesc = description;
    if (!finalDesc) {
        finalDesc = 'Desenvolvimento de sites de alto padrão, sistemas sob medida, aplicações web e experiências digitais. Vai de Ramiell.';
    }

    // Palavras-chave
    let finalKeywords = keywords;
    if (!finalKeywords) {
        finalKeywords = 'ramiell, vai de ramiell, desenvolvimento de sites, criacao de sistemas web, aplicacoes web, experiencias digitais, design editorial, ui ux';
    }

    // Imagem Open Graph
    const finalImage = image || '/brand/ramiell-logo.png';
    const absoluteImage = makeAbsoluteUrl(finalImage);
    const absoluteFavicon = makeAbsoluteUrl('/brand/ramiell-logo.png');

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDesc} />
            <meta name="keywords" content={finalKeywords} />

            {isNoIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            <link rel="canonical" href={currentUrl} />

            <link rel="icon" type="image/png" href={absoluteFavicon} />
            <link rel="apple-touch-icon" href={absoluteFavicon} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:site_name" content="RAMIELL" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDesc} />
            <meta property="twitter:image" content={absoluteImage} />
        </Helmet>
    );
};

export default SEO;
