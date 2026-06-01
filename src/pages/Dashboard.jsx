import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { LifeBuoy, FolderKanban, Mail, Star, Loader2, Briefcase, MessageSquare, CheckCircle, AlertCircle, Clock, Inbox, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard = () => {
    const { user, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        projects: 0,
        newContacts: 0,
        pendingReviews: 0,
        supportOpen: 0,
        supportInProgress: 0,
        supportClosed: 0,
    });
    const [loading, setLoading] = useState(true);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const projectsPromise = supabase.from('projects').select('*', { count: 'exact', head: true });
                const contactsPromise = supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'novo');
                const reviewsPromise = supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false);
                const supportPromise = supabase.from('support_tickets').select('status', { count: 'exact' });

                const [
                    { count: projectsCount },
                    { count: contactsCount },
                    { count: reviewsCount },
                    { data: supportData, error: supportError }
                ] = await Promise.all([projectsPromise, contactsPromise, reviewsPromise, supportPromise]);

                if (supportError) throw supportError;

                const supportStats = supportData.reduce((acc, ticket) => {
                    if (ticket.status === 'aberto') acc.open++;
                    if (ticket.status === 'em andamento') acc.inProgress++;
                    if (ticket.status === 'concluído') acc.closed++;
                    return acc;
                }, { open: 0, inProgress: 0, closed: 0 });

                setStats({
                    projects: projectsCount,
                    newContacts: contactsCount,
                    pendingReviews: reviewsCount,
                    supportOpen: supportStats.open,
                    supportInProgress: supportStats.inProgress,
                    supportClosed: supportStats.closed,
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const mainChartData = [
        { name: 'Projetos', value: stats.projects, color: '#3b82f6' },
        { name: 'Contatos', value: stats.newContacts, color: '#8b5cf6' },
        { name: 'Avaliações', value: stats.pendingReviews, color: '#10b981' },
        { name: 'Suporte Aberto', value: stats.supportOpen, color: '#f59e0b' },
    ];

    const supportChartData = [
        { name: 'Abertos', value: stats.supportOpen, fill: '#3b82f6' },
        { name: 'Em Andamento', value: stats.supportInProgress, fill: '#f59e0b' },
        { name: 'Concluídos', value: stats.supportClosed, fill: '#10b981' },
    ];

    if (loading && isAdmin) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Dashboard - Área de Clientes</title>
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="gradient-text">Bem-vindo, {user?.user_metadata?.full_name || user?.email}!</span>
                        </h1>
                        <p className="text-lg text-gray-400">Aqui está um resumo da sua atividade.</p>
                    </div>
                </motion.div>

                {isAdmin ? (
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Projetos</CardTitle><Briefcase className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.projects}</div></CardContent></Card>
                                <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Contatos</CardTitle><Inbox className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.newContacts}</div></CardContent></Card>
                                <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Avaliações</CardTitle><Star className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.pendingReviews}</div></CardContent></Card>
                                <Card className="glass-effect"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-400">Suporte Aberto</CardTitle><AlertCircle className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.supportOpen}</div></CardContent></Card>
                            </div>
                            <Card className="glass-effect">
                                <CardHeader><CardTitle>Visão Geral</CardTitle></CardHeader>
                                <CardContent className="pl-2 h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={mainChartData}><XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', borderRadius: '0.5rem' }} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }} /><Bar dataKey="value" radius={[4, 4, 0, 0]}>{mainChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar></BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div className="space-y-8" variants={itemVariants}>
                            <Card className="glass-effect">
                                <CardHeader><CardTitle>Status do Suporte</CardTitle></CardHeader>
                                <CardContent className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={supportChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(props) => `${props.name}: ${props.value}`} />
                                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', borderRadius: '0.5rem' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div className="mt-12" variants={itemVariants} initial="hidden" animate="visible">
                        <Card className="glass-effect">
                            <CardHeader><CardTitle>Sua Área de Cliente</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-400">Bem-vindo à sua área de cliente. Em breve, você poderá acompanhar seus projetos e abrir chamados de suporte por aqui.</p>
                                <Link to="/contato"><Button className="bg-gradient-to-r from-blue-500 to-purple-600"><LifeBuoy className="mr-2 h-4 w-4" />Abrir Chamado de Suporte</Button></Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default Dashboard;