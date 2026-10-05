import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const ClientArea = () => {
    const { user, signIn, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast({
                variant: "destructive",
                title: "Erro no login",
                description: "Por favor, preencha todos os campos.",
            });
            return;
        }
        setIsSubmitting(true);
        const { error } = await signIn(loginData.email, loginData.password);
        if (!error) {
            toast({
                title: "Login realizado com sucesso!",
                description: "Bem-vindo à sua área exclusiva.",
            });
            navigate('/dashboard');
        }
        setIsSubmitting(false);
    };

    if (loading) {
        return null;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Helmet>
                <title>Área de Clientes - Rafael Pita Solutions</title>
                <meta name="description" content="Acesse sua área exclusiva para acompanhar projetos, baixar arquivos e visualizar relatórios personalizados." />
            </Helmet>

            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="max-w-md w-full mx-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-effect p-8 rounded-2xl"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold gradient-text mb-2">Área de Clientes</h1>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Acesse sua área exclusiva</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all duration-300"
                                        placeholder="seu@email.com"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all duration-300"
                                        placeholder="••••••••"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 dark:hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 font-bold text-white shadow-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                Esqueceu sua senha?{' '}
                                <button
                                    onClick={() => toast({
                                        title: "🚧 Funcionalidade em desenvolvimento",
                                        description: "A recuperação de senha será implementada em breve!",
                                    })}
                                    className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 underline"
                                >
                                    Clique aqui
                                </button>
                            </p>
                        </div>

                        {/* Banner de Atalho para o Portal do Assinante Sem Senha */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/70 text-left">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    <span>Cliente de Manutenção Mensal?</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Acesse o Portal do Assinante sem precisar de senha para emitir QR Code PIX, consultar faturas e abrir chamados técnicos.
                                </p>
                                <Link
                                    to="/minha-assinatura"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
                                >
                                    Acessar Portal do Assinante
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ClientArea;