import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Lock, Save, Loader2 } from 'lucide-react';

const Profile = () => {
    const { user, updateUser, updatePassword } = useAuth();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');

    // Password State
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser({ full_name: fullName });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            // Toast handled by context or we could add specific toast here
            return;
        }
        setLoading(true);
        try {
            await updatePassword(password);
            setPassword('');
            setConfirmPassword('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Helmet>
                <title>Minha Conta - Admin</title>
            </Helmet>

            <div>
                <h1 className="text-3xl font-bold mb-2">Minha Conta</h1>
                <p className="text-muted-foreground font-medium">Gerencie suas informações pessoais e segurança.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Profile Information */}
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Informações Pessoais
                        </CardTitle>
                        <CardDescription>Atualize seu nome e informações públicas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <Input disabled value={user?.email || ''} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Seu nome"
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-purple-400" />
                            Segurança
                        </CardTitle>
                        <CardDescription>Alterar sua senha de acesso.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Nova Senha</label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Confirmar Senha</label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <Button type="submit" disabled={loading || !password || password !== confirmPassword} className="w-full bg-purple-600 hover:bg-purple-700">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Atualizar Senha
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
