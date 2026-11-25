/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
        './index.html',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontFamily: {
                sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
                geist: ['Geist', 'sans-serif'],
            },
            letterSpacing: {
                'title-tight': '-0.03em',
                'wordmark': '0.2em',
            },
            colors: {
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',

                // Identidade de Cores RAMIELL
                page: '#070707',
                section: '#0A0A0A',
                card: {
                    DEFAULT: '#0B0B0B',
                    foreground: '#FFFFFF',
                },
                surface: {
                    DEFAULT: '#0A0A0A',
                    secondary: '#121212',
                    elevated: '#121212',
                },
                gold: {
                    DEFAULT: '#C9A227',
                    light: '#ECBD57',
                    dark: '#C8942D',
                    glow: 'rgba(201, 162, 39, 0.15)',
                },
                brand: {
                    bg: '#070707',
                    section: '#0A0A0A',
                    card: '#0B0B0B',
                    surface: '#121212',
                    gold: '#C9A227',
                    'gold-light': '#ECBD57',
                    'gold-dark': '#C8942D',
                    text: '#FFFFFF',
                    muted: '#9E9E9E',
                    border: 'rgba(255, 255, 255, 0.06)',
                },

                // Tokens semânticos Shadcn compatíveis
                primary: {
                    DEFAULT: '#C9A227',
                    foreground: '#070707',
                },
                secondary: {
                    DEFAULT: '#121212',
                    foreground: '#FFFFFF',
                },
                destructive: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: '#121212',
                    foreground: '#9E9E9E',
                },
                accent: {
                    DEFAULT: '#C9A227',
                    foreground: '#070707',
                },
                popover: {
                    DEFAULT: '#0B0B0B',
                    foreground: '#FFFFFF',
                },
            },
            boxShadow: {
                'gold-glow': '0 0 24px rgba(201, 162, 39, 0.15)',
                'gold-glow-subtle': '0 0 16px rgba(201, 162, 39, 0.08)',
                'gold-glow-strong': '0 0 36px rgba(201, 162, 39, 0.25)',
                'card-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
            },
            borderRadius: {
                'card-sm': '18px',
                'card': '20px',
                'pill': '9999px',
                lg: '20px',
                md: '16px',
                sm: '12px',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
