import React, { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto de tema RAMIELL
const ThemeContext = createContext();

/**
 * Provedor de Tema RAMIELL (ThemeProvider)
 * Gerencia os temas Claro e Escuro com estética editorial minimalista,
 * persistindo a preferência no localStorage e aplicando as classes no elemento raiz HTML.
 */
export const ThemeProvider = ({ children }) => {
    // Inicia no tema salvo no localStorage ou adota 'dark' como padrão de marca
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Limpa classes anteriores do Tailwind
        root.classList.remove('light', 'dark');

        // Aplica o tema ativo
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.add('light');
        }

        // Salva a preferência
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Função para alternar entre Claro e Escuro
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook customizado para consulta e alternância de tema
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
