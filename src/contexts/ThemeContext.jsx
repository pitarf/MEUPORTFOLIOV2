import React, { createContext, useContext, useEffect } from 'react';

// Criação do contexto de tema para a marca RAMIELL
const ThemeContext = createContext();

/**
 * Provedor de Tema RAMIELL (ThemeProvider)
 * Mantém exclusivamente o tema escuro (Dark Only) de acordo com o design editorial minimalista.
 * Bloqueia qualquer transição para tema claro e garante a classe 'dark' no documento HTML.
 */
export const ThemeProvider = ({ children }) => {
    const theme = 'dark';

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light');
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    // Função de alternância neutralizada para compatibilidade sem efeito
    const toggleTheme = () => {
        // RAMIELL adota identidade exclusivamente dark
    };

    return (
        <ThemeContext.Provider value={{ theme: 'dark', toggleTheme, setTheme: () => {} }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook customizado para consulta de tema
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
