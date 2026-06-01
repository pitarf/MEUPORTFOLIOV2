import React, { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto de tema
const ThemeContext = createContext();

/**
 * Provedor de Tema (ThemeProvider)
 * Gerencia o estado de temas Claro e Escuro, persistindo no localStorage e controlando o Tailwind.
 * O tema padrão do projeto é o Tema Claro ('light') para um ar comercial e corporativo.
 */
export const ThemeProvider = ({ children }) => {
    // Busca do localStorage ou inicia no padrão 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'light';
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

    // Função reativa para alternar o tema
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook customizado para fácil utilização do tema em componentes React
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
