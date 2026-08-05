import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente silencioso para rastrear mudanças de rotas (SPA) no React Router e enviá-las ao Google Tag Manager (GTM).
 * Garante que a transição de páginas no React seja contabilizada como novas visualizações no dataLayer do Google.
 */
const GTMRouteTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Inicializa o dataLayer se necessário
        window.dataLayer = window.dataLayer || [];

        // Dispara o evento de pageview customizado para SPA
        window.dataLayer.push({
            event: 'pageview',
            page: location.pathname + location.search,
            title: document.title
        });
    }, [location]);

    return null;
};

export default GTMRouteTracker;
