import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop: Gerenciador de rolagem de rotas da aplicacao.
 * Rola para o topo ao trocar de rota (pathname), mas respeita âncoras (hash)
 * como #localizacao, #servicos, #sobre etc., rolando suavemente ate o elemento alvo.
 */
function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // Timeout de seguranca para componentes assincronos ou sob demanda
            const timer = setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);

            return () => clearTimeout(timer);
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;
