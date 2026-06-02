import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    Mail,
    MessageSquare, // Added
    HardDrive,     // Added
    LifeBuoy,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Home,
    User,
    Settings, // Added
    Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SidebarItem = ({ icon: Icon, label, path, isActive, collapsed, isExternal }) => {
    const Content = (
        <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200
            ${isActive
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
            }
        `}>
            <Icon size={20} />
            {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
        </div>
    );

    if (isExternal) {
        return (
            <a href={path} target="_blank" rel="noopener noreferrer">
                {Content}
            </a>
        );
    }

    return (
        <Link to={path}>
            {Content}
        </Link>
    );
};

const AdminLayout = () => {
    const { isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        ...(isAdmin ? [
            { icon: FolderKanban, label: 'Portfólio', path: '/admin/portfolio' },
            { icon: Mail, label: 'Contatos', path: '/admin/submissions' }, // Changed label from 'Submissões' to 'Contatos'
            { icon: MessageSquare, label: 'Depoimentos', path: '/admin/reviews' }, // Changed icon from Star and label from 'Avaliações' to 'Depoimentos'
            { icon: HardDrive, label: 'Otimização', path: '/admin/storage' },
            { icon: Settings, label: 'Serviços', path: '/admin/services' }, // New Item
            { icon: Image, label: 'Página Fotografia', path: '/admin/landing-page' },
            { icon: Settings, label: 'Configurações Gerais', path: '/admin/settings' },
            { icon: LifeBuoy, label: 'Suporte', path: '/admin/support' },
        ] : []),
        { icon: User, label: 'Minha Conta', path: '/admin/profile' },
        { icon: Home, label: 'Ver Site', path: '/', isExternal: true },
    ];

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
                    ${collapsed ? 'w-20' : 'w-64'}
                    bg-card border-r border-border
                    flex flex-col transition-all duration-300 ease-in-out
                `}
                initial={false}
                animate={{
                    x: isMobileMenuOpen ? 0 : window.innerWidth < 1024 ? -280 : 0,
                    width: collapsed ? 80 : 256
                }}
            >
                {/* Logo Area */}
                <div className={`h-16 flex items-center px-4 border-b border-border ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
                        {!collapsed && <span className="font-bold text-lg whitespace-nowrap">Painel Admin</span>}
                    </div>
                    {/* Desktop Collapse Button */}
                    <div className="hidden lg:block">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCollapsed(!collapsed)}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                    {/* Mobile Close Button */}
                    <div className="lg:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            isActive={location.pathname === item.path}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t border-border">
                    <button
                        onClick={handleSignOut}
                        className={`
                            flex items-center gap-3 w-full px-4 py-3 rounded-lg
                            text-red-400 hover:bg-red-500/10 hover:text-red-300
                            transition-colors
                            ${collapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Sair</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-background transition-colors duration-300">
                {/* Mobile Header */}
                <header className="h-16 lg:hidden flex items-center justify-between px-4 border-b border-border bg-card">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={20} />
                        </Button>
                        <span className="font-semibold text-lg">Menu</span>
                    </div>
                </header>

                {/* Content */}
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
