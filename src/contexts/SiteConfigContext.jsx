import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext'; // Import Auth

const SiteConfigContext = createContext();

export const SiteConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dbError, setDbError] = useState(null); // Track connection errors
    const { user } = useAuth(); // Get current user

    const fetchConfig = async () => {
        try {
            let query = supabase.from('site_config').select('*');

            // If user is logged in (Admin mode), specific fetch
            if (user) {
                query = query.eq('user_id', user.id);
            }
            // If public, we nominally want 'limit(1)' or a specific filtering logic
            // providing a SaaS architecture requires a public 'username' or 'domain' filter here.

            const { data, error } = await query.limit(1);

            if (error) {
                console.error('Error fetching site config:', error);
                setDbError(error); // Store error
                setConfig(prev => ({ ...defaultConfig, ...prev, isFallback: true }));
            } else if (data && data.length > 0) {
                setDbError(null); // Clear error
                setConfig(data[0]);
            } else {
                console.warn('No site config found for this user/context.');
                setDbError(null); // Clear error because table exists, just no data
                setConfig(prev => ({ ...defaultConfig, ...prev, isFallback: true }));
            }
        } catch (err) {
            console.error('Unexpected error fetching config:', err);
            setConfig(defaultConfig);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();

        // Realtime Subscription
        const subscription = supabase
            .channel('site_config_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, (payload) => {
                // Ideally check if payload.new.user_id === user.id
                fetchConfig();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user]); // Re-fetch when user changes

    const refreshConfig = async () => {
        await fetchConfig();
    };

    return (
        <SiteConfigContext.Provider value={{ config, loading, dbError, refreshConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export const useSiteConfig = () => {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
};

// Fallback values in case DB is empty or fails
const defaultConfig = {
    isFallback: true, // Flag to indicate this is not from DB
    site_name: 'Rafael Pita Solutions',
    site_title: 'Rafael Pita Solutions - Criatividade e Tecnologia',
    site_description: 'Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas para o seu negócio.',
    site_keywords: 'portfólio, rafael pita, soluções digitais, desenvolvimento web, design gráfico, fotografia, power bi',
    favicon_url: '',
    og_image_url: '',
    contact_email: 'contato@rafaelpitaoficial.com.br',
    contact_phone: '(21) 96614-9077',
    contact_address: 'Rio de Janeiro, RJ - Brasil',
    hero_title: 'Rafael Pita Solutions',
    hero_subtitle: 'Criatividade e tecnologia em um só lugar',
    hero_description: 'Transformamos suas ideias em realidade digital com soluções inovadoras e personalizadas para o seu negócio.',
    footer_description: 'Criatividade e tecnologia em um só lugar. Transformamos suas ideias em realidade digital.',
    stats_projects_count: 500,
    stats_clients_count: 200,
    stats_success_rate: 98,
    social_links: {
        facebook: '#',
        instagram: '#',
        linkedin: '#',
        twitter: '#',
        whatsapp: 'https://wa.me/5521966149077'
    }
};
