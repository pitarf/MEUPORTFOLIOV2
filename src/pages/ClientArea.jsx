import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
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
                            <p className="text-gray-400">Acesse sua área exclusiva</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                                        placeholder="seu@email.com"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                                        placeholder="••••••••"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                                Esqueceu sua senha?{' '}
                                <button
                                    onClick={() => toast({
                                        title: "🚧 Funcionalidade em desenvolvimento",
                                        description: "A recuperação de senha será implementada em breve!",
                                    })}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Clique aqui
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ClientArea;