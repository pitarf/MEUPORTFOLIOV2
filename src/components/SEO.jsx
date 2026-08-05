import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

/**
 * Componente SEO para gerenciamento dinâmico e centralizado de metadados
 * Melhora drasticamente a indexação no Google com tags robustas, links canônicos e proteção de áreas restritas.
 * 
 * @param {Object} props
 * @param {string} props.title - Título personalizado para a página
 * @param {string} props.description - Descrição personalizada para a página
 * @param {string} props.keywords - Palavras-chave personalizadas para a página
 * @param {string} props.image - Imagem Open Graph de compartilhamento personalizada
 * @param {string} props.url - URL canônica personalizada
 */
const SEO = ({ title, description, keywords, image, url }) => {
    const { config } = useSiteConfig();
    const location = useLocation();
    const [photoMetadata, setPhotoMetadata] = useState(null);

    const isPhotography = location.pathname.startsWith('/portfolio-fotografia');
    const currentUrl = url || window.location.href;

    // Detectar rotas privadas/administrativas que NÃO devem ser indexadas pelo Google (Proteção de Dados)
    const noIndexPaths = ['/admin', '/dashboard', '/area-clientes', '/support', '/track-ticket'];
    const isNoIndex = noIndexPaths.some(path => 
        location.pathname === path || location.pathname.startsWith(`${path}/`)
    );

    // Carregar metadados específicos para a área de fotografia se necessário
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

    // Função utilitária para garantir que URLs de imagem e favicon sejam absolutas
    const makeAbsoluteUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        const origin = window.location.origin || 'https://rafaelpitaoficial.com.br';
        return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
    };

    // ----------------------------------------------------
    // Definição dos Metadados Principais (Hierarquia de Prioridade)
    // ----------------------------------------------------

    // 1. TÍTULO DO SITE / PÁGINA
    let finalTitle = title;
    if (!finalTitle) {
        if (isPhotography && photoMetadata?.nav_site_name) {
            finalTitle = `${photoMetadata.nav_site_name} - Portfólio de Fotografia`;
        } else {
            // Prioridade: SEO site_title do DB -> site_name do DB -> Fallback Padrão
            finalTitle = config?.site_title || config?.site_name || 'Rafael Pita Solutions - Criatividade e Tecnologia';
        }
    } else {
        // Se a página passar um título específico, anexa o nome global do site para branding premium
        const siteSuffix = config?.site_name || 'Rafael Pita Solutions';
        if (!finalTitle.includes(siteSuffix)) {
            finalTitle = `${finalTitle} | ${siteSuffix}`;
        }
    }

    // 2. DESCRIÇÃO
    let finalDesc = description;
    if (!finalDesc) {
        if (isPhotography && photoMetadata?.hero_subtitle) {
            finalDesc = photoMetadata.hero_subtitle;
        } else {
            // Prioridade: SEO site_description do DB -> hero_description do DB -> Fallback Padrão
            finalDesc = config?.site_description || config?.hero_description || 'Rafael Pita Solutions oferece serviços completos de design gráfico, fotografia, desenvolvimento web e muito mais.';
        }
    }

    // 3. PALAVRAS-CHAVE
    let finalKeywords = keywords;
    if (!finalKeywords) {
        finalKeywords = config?.site_keywords || 'portfólio, rafael pita, soluções digitais, desenvolvimento web, design gráfico, fotografia, power bi';
    }

    // 4. IMAGEM OPEN GRAPH (COMPARTILHAMENTO)
    let finalImage = image;
    if (!finalImage) {
        if (isPhotography && photoMetadata?.nav_logo_url) {
            finalImage = photoMetadata.nav_logo_url;
        } else {
            // Prioridade: SEO og_image_url do DB -> logo_url do DB -> Fallback de imagem tech
            finalImage = config?.og_image_url || config?.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
        }
    }
    const absoluteImage = makeAbsoluteUrl(finalImage);

    // 5. FAVICON DINÂMICO
    let rawFavicon = '/vite.svg'; // Fallback absoluto
    if (isPhotography && photoMetadata?.nav_logo_url) {
        rawFavicon = photoMetadata.nav_logo_url;
    } else if (config?.favicon_url) {
        rawFavicon = config.favicon_url;
    } else if (config?.logo_url) {
        rawFavicon = config.logo_url;
    }
    const absoluteFavicon = makeAbsoluteUrl(rawFavicon);

    return (
        <Helmet>
            {/* Metadados Básicos */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDesc} />
            <meta name="keywords" content={finalKeywords} />

            {/* Configuração de Indexação Dinâmica (SEO / Segurança) */}
            {isNoIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Tag Canônica para evitar conteúdo duplicado no Google */}
            <link rel="canonical" href={currentUrl} />

            {/* Favicons Dinâmicos baseados no painel */}
            <link rel="icon" type="image/png" href={absoluteFavicon} />
            <link rel="apple-touch-icon" href={absoluteFavicon} />

            {/* Open Graph / Facebook (URLs Obrigatórias como Absolutas) */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:site_name" content={config?.site_name || 'Rafael Pita Solutions'} />

            {/* Twitter Card */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDesc} />
            <meta property="twitter:image" content={absoluteImage} />
        </Helmet>
    );
};

export default SEO;

