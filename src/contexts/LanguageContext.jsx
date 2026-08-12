import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

/**
 * Provedor de Idiomas (LanguageProvider)
 * Gerencia a alternância de idioma entre PT (Português BR) e EN (Inglês),
 * persistindo no localStorage e provendo traduções reativas.
 */
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved === 'en' ? 'en' : 'pt';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
    }, [language]);

    const toggleLanguage = useCallback(() => {
        setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
    }, []);

    // Função auxiliar para tradução rápida
    const t = useCallback((key, fallback) => {
        if (translations[language] && translations[language][key]) {
            return translations[language][key];
        }
        if (translations['pt'] && translations['pt'][key]) {
            return translations['pt'][key];
        }
        return fallback || key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

/**
 * Hook customizado para usar idiomas em qualquer componente React
 */
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
