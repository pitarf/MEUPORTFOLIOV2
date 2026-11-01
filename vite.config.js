import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import placesHandler from './api/places-search.js';
import propostasHandler from './api/propostas/gerar.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Carrega variáveis do arquivo .env
    const env = loadEnv(mode, process.cwd(), '');
    process.env.GOOGLE_PLACES_API_KEY = env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    process.env.VITE_GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    return {
        plugins: [
            react(),
            {
                name: 'places-and-propostas-api-dev-server',
                configureServer(server) {
                    server.middlewares.use(async (req, res, next) => {
                        if (req.url && req.url.startsWith('/api/places-search')) {
                            try {
                                const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                                req.query = Object.fromEntries(urlObj.searchParams.entries());

                                // Mock helpers para compatibilidade com o handler da Vercel
                                res.status = (code) => {
                                    res.statusCode = code;
                                    return res;
                                };
                                res.json = (data) => {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify(data));
                                    return res;
                                };

                                await placesHandler(req, res);
                            } catch (err) {
                                console.error('[Vite Places API Dev Error]:', err);
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: false, message: err.message }));
                            }
                            return;
                        }

                        if (req.url && (req.url.startsWith('/api/propostas') || req.url.startsWith('/api/propostas/gerar'))) {
                            try {
                                // Mock helpers para compatibilidade com o handler da Vercel
                                res.status = (code) => {
                                    res.statusCode = code;
                                    return res;
                                };
                                res.json = (data) => {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.end(JSON.stringify(data));
                                    return res;
                                };

                                await propostasHandler(req, res);
                            } catch (err) {
                                console.error('[Vite Propostas API Dev Error]:', err);
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ sucesso: false, mensagem: err.message }));
                            }
                            return;
                        }

                        next();
                    });
                }
            }
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            host: true, // Listen on all local IPs
            port: 3001,
        },
        assetsInclude: ['**/*.JPG'],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
                        'vendor-framer': ['framer-motion'],
                        'vendor-supabase': ['@supabase/supabase-js'],
                        'vendor-icons': ['lucide-react']
                    }
                }
            },
            chunkSizeWarningLimit: 900
        }
    };
});
