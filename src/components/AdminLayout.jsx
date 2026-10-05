import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Repeat,
    Target,
    Compass,
    Scale,
    FolderKanban,
    Sparkles,
    MessageSquare,
    Camera,
    Headphones,
    Mail,
    LifeBuoy,
    Settings,
    HardDrive,
    User,
    ExternalLink,
    ChevronDown,
    ChevronLeft,
    LogOut,
    Sun,
    Moon,
    Menu,
    X,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Item de menu direto da barra lateral (sem subitens).
 */
const DirectNavItem = ({ icon: Icon, label, path, isActive, collapsed, onClick, isExternal = false }) => {
    const content = (
        <div
            className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200
                ${isActive
                    ? 'bg-primary/10 text-primary border-primary/30 font-semibold shadow-xs'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }
                ${collapsed ? 'justify-center px-2' : ''}
            `}
            title={collapsed ? label : undefined}
        >
            <Icon size={19} className="shrink-0" />
            {!collapsed && <span className="text-sm truncate">{label}</span>}
        </div>
    );

    if (isExternal) {
        return (
            <a
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="block"
            >
                {content}
            </a>
        );
    }

    return (
        <Link to={path} onClick={onClick} className="block">
            {content}
        </Link>
    );
};

/**
 * Subitem interno de um grupo da barra lateral.
 */
const SubNavItem = ({ icon: Icon, label, path, isActive, onClick }) => {
    return (
        <Link
            to={path}
            onClick={onClick}
            className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150
                ${isActive
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }
            `}
        >
            {Icon && <Icon size={15} className="shrink-0" />}
            <span className="truncate">{label}</span>
        </Link>
    );
};

/**
 * Grupo de menu com subníveis expansíveis (Acordeão / Dropdown).
 */
const NavGroup = ({ group, currentPath, collapsed, isOpen, onToggle, onItemClick }) => {
    const isChildActive = group.items.some((item) => item.path === currentPath);
    const GroupIcon = group.icon;

    if (collapsed) {
        // No modo colapsado, exibe o icone do grupo com indicador ativo se alguma filha estiver ativa
        return (
            <div className="relative group/collapsed my-1">
                <button
                    type="button"
                    onClick={onToggle}
                    className={`
                        w-full flex items-center justify-center p-2.5 rounded-xl border transition-all
                        ${isChildActive
                            ? 'bg-primary/10 text-primary border-primary/30'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/70'
                        }
                    `}
                    title={`${group.title}: clique para expandir painel`}
                >
                    <GroupIcon size={19} />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-1 my-1">
            {/* Cabecalho do Grupo com Alternador de Expansao */}
            <button
                type="button"
                onClick={onToggle}
                className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200
                    ${isChildActive
                        ? 'bg-primary/5 text-primary border-primary/20 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    }
                `}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <GroupIcon size={19} className="shrink-0" />
                    <span className="truncate">{group.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {isChildActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 text-muted-foreground ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Subitens Animados com Linha Guia Vertical */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="border-l-2 border-primary/25 dark:border-primary/35 pl-2.5 ml-5 space-y-1 my-1.5">
                            {group.items.map((subItem) => (
                                <SubNavItem
                                    key={subItem.path}
                                    icon={subItem.icon}
                                    label={subItem.label}
                                    path={subItem.path}
                                    isActive={currentPath === subItem.path}
                                    onClick={onItemClick}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Layout Administrativo com Sidebar Reorganizada em Subniveis e Categorias Logicas.
 */
const AdminLayout = () => {
    const { isAdmin, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isEffectiveAdmin = isAdmin || import.meta.env.DEV;

    /**
     * Estrutura Organizada por Categorias e Subniveis
     */
    const navigationSections = [
        {
            sectionLabel: null,
            items: [
                {
                    type: 'direct',
                    id: 'dashboard',
                    label: 'Dashboard Geral',
                    path: '/dashboard',
                    icon: LayoutDashboard
                }
            ]
        },
        ...(isEffectiveAdmin ? [
            {
                sectionLabel: 'Vendas & Clientes',
                items: [
                    {
                        type: 'group',
                        id: 'commercial',
                        title: 'Comercial & Vendas',
                        icon: Briefcase,
                        items: [
                            {
                                label: 'Orçamentos & Propostas',
                                path: '/admin/orcamentos',
                                icon: FileText
                            },
                            {
                                label: 'Assinaturas & PIX',
                                path: '/admin/assinaturas',
                                icon: Repeat
                            }
                        ]
                    },
                    {
                        type: 'group',
                        id: 'prospecting',
                        title: 'Prospecção Ativa',
                        icon: Target,
                        items: [
                            {
                                label: 'Radar Google Maps',
                                path: '/admin/radar-google-maps',
                                icon: Compass
                            },
                            {
                                label: 'Prospecção Advogados',
                                path: '/admin/prospeccao-advogados',
                                icon: Scale
                            }
                        ]
                    }
                ]
            },
            {
                sectionLabel: 'Conteúdo & Portfólio',
                items: [
                    {
                        type: 'group',
                        id: 'content',
                        title: 'Gestão de Conteúdo',
                        icon: FolderKanban,
                        items: [
                            {
                                label: 'Projetos do Portfólio',
                                path: '/admin/portfolio',
                                icon: FolderKanban
                            },
                            {
                                label: 'Serviços Oferecidos',
                                path: '/admin/services',
                                icon: Sparkles
                            },
                            {
                                label: 'Depoimentos de Clientes',
                                path: '/admin/reviews',
                                icon: MessageSquare
                            },
                            {
                                label: 'Página Fotografia',
                                path: '/admin/landing-page',
                                icon: Camera
                            }
                        ]
                    }
                ]
            },
            {
                sectionLabel: 'Atendimento & Suporte',
                items: [
                    {
                        type: 'group',
                        id: 'support',
                        title: 'Atendimento',
                        icon: Headphones,
                        items: [
                            {
                                label: 'Mensagens & Contatos',
                                path: '/admin/submissions',
                                icon: Mail
                            },
                            {
                                label: 'Chamados Técnicos',
                                path: '/admin/support',
                                icon: LifeBuoy
                            }
                        ]
                    }
                ]
            },
            {
                sectionLabel: 'Configurações',
                items: [
                    {
                        type: 'group',
                        id: 'system',
                        title: 'Sistema & Ajustes',
                        icon: Settings,
                        items: [
                            {
                                label: 'Configurações Gerais',
                                path: '/admin/settings',
                                icon: Settings
                            },
                            {
                                label: 'Otimização & Storage',
                                path: '/admin/storage',
                                icon: HardDrive
                            },
                            {
                                label: 'Minha Conta',
                                path: '/admin/profile',
                                icon: User
                            }
                        ]
                    }
                ]
            }
        ] : [
            {
                sectionLabel: 'Conta',
                items: [
                    {
                        type: 'direct',
                        id: 'profile',
                        label: 'Minha Conta',
                        path: '/admin/profile',
                        icon: User
                    }
                ]
            }
        ])
    ];

    /**
     * Estado dos grupos abertos (auto-abre o grupo correspondente a rota atual)
     */
    const [openGroups, setOpenGroups] = useState(() => {
        const initial = {
            commercial: true,
            prospecting: false,
            content: false,
            support: false,
            system: false
        };
        // Abre automaticamente o grupo correspondente ao pathname atual
        navigationSections.forEach((section) => {
            section.items.forEach((item) => {
                if (item.type === 'group' && item.items.some((sub) => sub.path === location.pathname)) {
                    initial[item.id] = true;
                }
            });
        });
        return initial;
    });

    // Sincroniza abertura de grupo caso a rota mude
    useEffect(() => {
        navigationSections.forEach((section) => {
            section.items.forEach((item) => {
                if (item.type === 'group' && item.items.some((sub) => sub.path === location.pathname)) {
                    setOpenGroups((prev) => ({
                        ...prev,
                        [item.id]: true
                    }));
                }
            });
        });
    }, [location.pathname]);

    const toggleGroup = (groupId) => {
        if (collapsed) {
            setCollapsed(false);
            setOpenGroups((prev) => ({ ...prev, [groupId]: true }));
            return;
        }
        setOpenGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleItemClick = () => {
        if (window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex font-sans text-foreground transition-colors duration-300">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    ${collapsed ? 'w-20' : 'w-[272px]'}
                    bg-card border-r border-border
                    flex flex-col transition-all duration-300 ease-in-out
                `}
                initial={false}
                animate={{
                    x: isMobileMenuOpen ? 0 : window.innerWidth < 1024 ? -280 : 0,
                    width: collapsed ? 80 : 272
                }}
            >
                {/* Cabecalho da Sidebar */}
                <div className={`h-16 flex items-center px-4 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex-shrink-0 shadow-sm flex items-center justify-center text-white font-bold text-sm">
                            RP
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <span className="font-bold text-base whitespace-nowrap block leading-tight">
                                    Painel Admin
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                                    Rafael Pita Solutions
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Botao de Recolher/Expandir Desktop */}
                    <div className="hidden lg:block">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(!collapsed)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            title={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
                        >
                            <ChevronLeft className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>

                    {/* Botao Fechar Mobile */}
                    <div className="lg:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Navegacao Estruturada com Subniveis */}
                <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto overflow-x-hidden">
                    {navigationSections.map((section, sectionIdx) => (
                        <div key={section.sectionLabel || `sec-${sectionIdx}`} className="space-y-1">
                            {/* Titulo da Secao (apenas se nao estiver colapsado) */}
                            {section.sectionLabel && !collapsed && (
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-3 pt-2 pb-1">
                                    {section.sectionLabel}
                                </p>
                            )}

                            {/* Itens e Grupos da Secao */}
                            {section.items.map((item) => {
                                if (item.type === 'direct') {
                                    return (
                                        <DirectNavItem
                                            key={item.path}
                                            icon={item.icon}
                                            label={item.label}
                                            path={item.path}
                                            isActive={location.pathname === item.path}
                                            collapsed={collapsed}
                                            onClick={handleItemClick}
                                        />
                                    );
                                }

                                return (
                                    <NavGroup
                                        key={item.id}
                                        group={item}
                                        currentPath={location.pathname}
                                        collapsed={collapsed}
                                        isOpen={Boolean(openGroups[item.id])}
                                        onToggle={() => toggleGroup(item.id)}
                                        onItemClick={handleItemClick}
                                    />
                                );
                            })}
                        </div>
                    ))}

                    {/* Atalho Externo: Ver Site */}
                    <div className="pt-2 border-t border-border/60">
                        <DirectNavItem
                            icon={Home}
                            label="Ver Site Público"
                            path="/"
                            isActive={false}
                            collapsed={collapsed}
                            onClick={handleItemClick}
                            isExternal={true}
                        />
                    </div>
                </div>

                {/* Rodape de Acoes */}
                <div className="p-3 border-t border-border space-y-1">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`
                            flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl
                            text-muted-foreground hover:bg-muted hover:text-foreground
                            transition-colors text-sm
                            ${collapsed ? 'justify-center px-2' : ''}
                        `}
                        title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
                    >
                        {theme === 'light' ? <Moon size={19} /> : <Sun size={19} className="text-yellow-500" />}
                        {!collapsed && <span className="font-medium">{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>}
                    </button>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className={`
                            flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl
                            text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400
                            transition-colors text-sm font-medium
                            ${collapsed ? 'justify-center px-2' : ''}
                        `}
                        title="Sair do painel administrativo"
                    >
                        <LogOut size={19} />
                        {!collapsed && <span>Sair</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Conteudo Principal */}
            <main className="flex-1 flex flex-col min-w-0 bg-background transition-colors duration-300">
                {/* Cabecalho Mobile */}
                <header className="h-16 lg:hidden flex items-center justify-between px-4 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={20} />
                        </Button>
                        <span className="font-semibold text-lg">Painel Admin</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-muted-foreground hover:text-foreground"
                        title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-500" />}
                    </Button>
                </header>

                {/* Area de Visualizacao das Rotas Filhas */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
