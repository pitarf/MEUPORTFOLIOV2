import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Search, X, ArrowUp, Code } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * Componente PortfolioBottomNav (NavBottom Fixa do Filtro)
 * 
 * Barra de navegacao e filtro inferior que surge suavemente ao rolar a pagina
 * permitindo ao usuario alternar categorias, pesquisar projetos e retornar
 * ao topo de forma ergonomica tanto no Desktop quanto no Mobile.
 * 
 * @param {boolean} show - Controla a visibilidade da barra com base no scroll
 * @param {Array} allCategories - Lista de categorias ativas
 * @param {Array} projects - Lista completa de projetos para calculo dos contadores
 * @param {string} activeTab - Slug da categoria atualmente selecionada
 * @param {Function} setActiveTab - Atualiza a categoria ativa
 * @param {string} searchQuery - Termo de busca digitado
 * @param {Function} setSearchQuery - Atualiza o termo de busca
 * @param {Object} icons - Mapeamento de icones Lucide por categoria
 * @param {Function} t - Funcao de traducao i18n
 */
const PortfolioBottomNav = ({
    show,
    allCategories = [],
    projects = [],
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    icons = {},
    t = (k, fallback) => fallback
}) => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);

    // Foca o campo de busca automaticamente ao expandir
    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // Funcao para alternar categoria e garantir visibilidade confortavel dos resultados
    const handleCategoryClick = (slug) => {
        setActiveTab(slug);
        // Se estiver muito abaixo na pagina, ajusta o scroll suavemente para o inicio dos cards
        const cardsAnchor = document.getElementById('portfolio-grid-top');
        if (cardsAnchor) {
            const rect = cardsAnchor.getBoundingClientRect();
            if (rect.top < -100) {
                cardsAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Rola suavemente para o topo absoluto da pagina
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 80, opacity: 0, scale: 0.94 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 80, opacity: 0, scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[96vw] sm:w-auto max-w-4xl pointer-events-auto px-1"
                >
                    <div className="bg-white/95 dark:bg-[#121210]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-[#23231f] shadow-[0_12px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.75)] rounded-2xl sm:rounded-full p-1.5 sm:px-3 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-2.5">
                        
                        {/* Se a busca estiver expandida na barra inferior */}
                        {isSearchExpanded ? (
                            <div className="flex items-center gap-2 w-full py-0.5 px-1 animate-in fade-in duration-200">
                                <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 flex-shrink-0 ml-1" />
                                <Input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={t('portfolio_search_placeholder', 'Buscar projetos...')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 w-full bg-slate-100 dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 rounded-xl text-xs sm:text-sm font-semibold focus:border-lime-500 dark:focus:border-[#bcf13b]"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        title="Limpar busca"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsSearchExpanded(false)}
                                    className="px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-[#181814] flex-shrink-0"
                                >
                                    Fechar
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Carrossel horizontal de pilulas de categoria */}
                                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5 flex-1 min-w-0 scroll-smooth">
                                    
                                    {/* Botao Todos */}
                                    <button
                                        onClick={() => handleCategoryClick('all')}
                                        className={`relative px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 flex-shrink-0 border ${
                                            activeTab === 'all'
                                                ? 'bg-[#bcf13b] text-[#0a0a08] font-bold border-[#bcf13b] shadow-sm shadow-[#bcf13b]/30 scale-[1.02]'
                                                : 'bg-slate-100/90 dark:bg-[#181814] border-slate-200/80 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#20201a]'
                                        }`}
                                    >
                                        <Cpu className="w-3.5 h-3.5" />
                                        <span>{t('portfolio_all_categories', 'Todos')}</span>
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md sm:rounded-full font-bold ${
                                            activeTab === 'all'
                                                ? 'bg-[#0a0a08]/20 text-[#0a0a08]'
                                                : 'bg-white/80 dark:bg-[#121210] text-slate-600 dark:text-gray-400'
                                        }`}>
                                            {projects.length}
                                        </span>
                                    </button>

                                    {/* Botões das Categorias Corporativas */}
                                    {allCategories.map((cat) => {
                                        const IconComp = icons[cat.icon] || Code;
                                        const catCount = projects.filter(p => p.category_id === cat.id).length;
                                        const isActive = activeTab === cat.slug;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategoryClick(cat.slug)}
                                                className={`relative px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 flex-shrink-0 border ${
                                                    isActive
                                                        ? 'bg-[#bcf13b] text-[#0a0a08] font-bold border-[#bcf13b] shadow-sm shadow-[#bcf13b]/30 scale-[1.02]'
                                                        : 'bg-slate-100/90 dark:bg-[#181814] border-slate-200/80 dark:border-[#23231f] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#20201a]'
                                                }`}
                                            >
                                                <IconComp className="w-3.5 h-3.5" />
                                                <span className="whitespace-nowrap">{cat.title}</span>
                                                <span className={`text-[10px] px-1.5 py-0.2 rounded-md sm:rounded-full font-bold ${
                                                    isActive
                                                        ? 'bg-[#0a0a08]/20 text-[#0a0a08]'
                                                        : 'bg-white/80 dark:bg-[#121210] text-slate-600 dark:text-gray-400'
                                                }`}>
                                                    {catCount}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Acoes da Direita: Busca Rapida e Subir ao Topo */}
                                <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-[#23231f] flex-shrink-0">
                                    <button
                                        onClick={() => setIsSearchExpanded(true)}
                                        className={`p-2 rounded-xl sm:rounded-full transition-colors relative ${
                                            searchQuery
                                                ? 'bg-[#bcf13b] text-[#0a0a08]'
                                                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181814]'
                                        }`}
                                        title={searchQuery ? `Busca ativa: ${searchQuery}` : 'Buscar projetos'}
                                    >
                                        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        {searchQuery && (
                                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        )}
                                    </button>

                                    <button
                                        onClick={handleScrollToTop}
                                        className="p-2 rounded-xl sm:rounded-full text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#181814] transition-colors"
                                        title="Voltar ao topo da pagina"
                                    >
                                        <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PortfolioBottomNav;
