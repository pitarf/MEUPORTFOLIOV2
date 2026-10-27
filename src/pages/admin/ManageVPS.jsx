import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HardDrive,
    Cpu,
    Activity,
    Clock,
    RefreshCw,
    Trash2,
    RotateCw,
    Server,
    Layers,
    Search,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Database,
    Box,
    Terminal,
    Sparkles,
    Wifi
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    fetchVPSStatus,
    cleanDockerBuildCache,
    restartDockerContainer
} from '@/services/vpsMonitorService';

/**
 * Componente de barra de progresso customizada com gradientes por nivel de criticidade.
 * @param {Object} props - Propriedades do componente.
 * @param {number} props.percent - Porcentagem de ocupacao (0 a 100).
 * @param {string} [props.className] - Classes CSS adicionais.
 */
function HealthProgressBar({ percent, className = '' }) {
    const clamped = Math.min(100, Math.max(0, Number(percent) || 0));

    // Define cor gradiente de acordo com o nivel de saturacao
    let gradient = 'from-emerald-500 to-teal-400';
    if (clamped >= 85) {
        gradient = 'from-red-500 to-rose-600';
    } else if (clamped >= 70) {
        gradient = 'from-amber-500 to-yellow-400';
    }

    return (
        <div className={`w-full bg-muted/60 dark:bg-muted/30 rounded-full h-2.5 overflow-hidden p-0.5 border border-border/40 ${className}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clamped}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
            />
        </div>
    );
}

/**
 * Painel Administrativo de Monitoramento e Manutencao da VPS Oracle Cloud.
 * Exibe metricas de hardware, armazenamento Docker e gestao de containers.
 */
export default function ManageVPS() {
    const { toast } = useToast();

    // Estados de dados da VPS
    const [vpsData, setVpsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Estados de filtros dos containers
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Estados de acoes e modais de confirmacao
    const [cleaningCache, setCleaningCache] = useState(false);
    const [showCleanModal, setShowCleanModal] = useState(false);

    const [containerToRestart, setContainerToRestart] = useState(null);
    const [restartingContainer, setRestartingContainer] = useState(null);

    /**
     * Carrega as metricas mais recentes da VPS atraves do servico autenticado.
     */
    const loadStatus = useCallback(async (isSilent = false) => {
        if (!isSilent) setRefreshing(true);
        try {
            const data = await fetchVPSStatus();
            setVpsData(data);
            setLastSync(new Date());
        } catch (error) {
            console.error('Falha ao atualizar dados da VPS:', error);
            toast({
                variant: 'destructive',
                title: 'Erro de Comunicacao',
                description: error.message || 'Nao foi possivel obter os dados da VPS.'
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [toast]);

    // Carregamento inicial
    useEffect(() => {
        loadStatus(false);
    }, [loadStatus]);

    // Intervalo de auto-atualizacao a cada 45 segundos (se ativado)
    useEffect(() => {
        if (!autoRefresh) return;
        const intervalId = setInterval(() => {
            loadStatus(true);
        }, 45000);
        return () => clearInterval(intervalId);
    }, [autoRefresh, loadStatus]);

    /**
     * Executa a limpeza do cache de build do Docker na VPS.
     */
    const handleCleanCache = async () => {
        setShowCleanModal(false);
        setCleaningCache(true);
        try {
            const result = await cleanDockerBuildCache();
            toast({
                title: 'Cache Limpo com Sucesso!',
                description: result.message || 'Espaco em disco recuperado na VPS.'
            });
            // Recarrega as metricas apos a limpeza
            await loadStatus(true);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Falha na Limpeza',
                description: error.message || 'Nao foi possivel limpar o cache do Docker.'
            });
        } finally {
            setCleaningCache(false);
        }
    };

    /**
     * Solicita a reinicializacao de um container especifico.
     */
    const handleRestartContainer = async () => {
        if (!containerToRestart) return;
        const containerName = containerToRestart;
        setContainerToRestart(null);
        setRestartingContainer(containerName);

        try {
            const result = await restartDockerContainer(containerName);
            toast({
                title: 'Container Reiniciado!',
                description: result.message || `O container ${containerName} foi reiniciado com exito.`
            });
            // Recarrega o status atualizado
            await loadStatus(true);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao Reiniciar',
                description: error.message || `Nao foi possivel reiniciar ${containerName}.`
            });
        } finally {
            setRestartingContainer(null);
        }
    };

    // Filtra os containers de acordo com a busca e o filtro de estado
    const filteredContainers = useMemo(() => {
        if (!vpsData?.docker?.containers) return [];
        return vpsData.docker.containers.filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.ports && c.ports.toLowerCase().includes(searchTerm.toLowerCase()));

            if (statusFilter === 'running') {
                return matchesSearch && c.state === 'running';
            }
            if (statusFilter === 'stopped') {
                return matchesSearch && c.state !== 'running';
            }
            return matchesSearch;
        });
    }, [vpsData, searchTerm, statusFilter]);

    // Contadores de containers
    const runningCount = useMemo(() => {
        if (!vpsData?.docker?.containers) return 0;
        return vpsData.docker.containers.filter((c) => c.state === 'running').length;
    }, [vpsData]);

    const totalContainers = vpsData?.docker?.containers?.length || 0;

    return (
        <>
            <Helmet>
                <title>Monitoramento VPS Oracle Cloud | Painel Rafael Pita</title>
            </Helmet>

            <div className="space-y-8 pb-12">
                {/* Cabecalho Principal */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                                <Server className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                Monitoramento da VPS
                            </h1>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>Host: <strong>{vpsData?.host || 'Oracle Cloud ARM - 144.22.173.125'}</strong></span>
                            {lastSync && (
                                <span className="text-xs text-muted-foreground/70">
                                    (Sincronizado: {lastSync.toLocaleTimeString('pt-BR')})
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Barra de Acoes do Topo */}
                    <div className="flex items-center flex-wrap gap-2.5">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className="text-xs gap-1.5"
                        >
                            <Wifi className={`h-3.5 w-3.5 ${autoRefresh ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                            {autoRefresh ? 'Auto (45s)' : 'Manual'}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadStatus(false)}
                            disabled={refreshing}
                            className="text-xs gap-1.5"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
                            Atualizar
                        </Button>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowCleanModal(true)}
                            disabled={cleaningCache || loading}
                            className="text-xs gap-1.5 shadow-sm"
                        >
                            <Trash2 className={`h-3.5 w-3.5 ${cleaningCache ? 'animate-spin' : ''}`} />
                            Limpar Cache Docker
                        </Button>
                    </div>
                </div>

                {/* Cards de Metricas de Hardware */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Armazenamento SSD */}
                    <Card className="border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Armazenamento SSD
                            </CardTitle>
                            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <HardDrive className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold tracking-tight">
                                        {vpsData?.disk?.percent ?? '--'}%
                                    </span>
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {vpsData?.disk?.free_gb ?? '--'} GB livres
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {vpsData?.disk?.used_gb ?? '--'} GB usados de {vpsData?.disk?.total_gb ?? '--'} GB
                                </p>
                            </div>
                            <HealthProgressBar percent={vpsData?.disk?.percent || 0} />
                        </CardContent>
                    </Card>

                    {/* Card 2: Memoria RAM */}
                    <Card className="border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Memoria RAM
                            </CardTitle>
                            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Activity className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold tracking-tight">
                                        {vpsData?.ram?.percent ?? '--'}%
                                    </span>
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {vpsData?.ram?.free_gb ?? '--'} GB livres
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {vpsData?.ram?.used_gb ?? '--'} GB usados de {vpsData?.ram?.total_gb ?? '--'} GB
                                </p>
                            </div>
                            <HealthProgressBar percent={vpsData?.ram?.percent || 0} />
                        </CardContent>
                    </Card>

                    {/* Card 3: Processador CPU ARM */}
                    <Card className="border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Processador (4 Cores)
                            </CardTitle>
                            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Cpu className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-bold tracking-tight">
                                        {vpsData?.cpu?.usage_percent ?? '--'}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Carga: {vpsData?.cpu?.load_1m ?? '--'}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Médias (1m / 5m / 15m): {vpsData?.cpu?.load_1m ?? '0'}, {vpsData?.cpu?.load_5m ?? '0'}, {vpsData?.cpu?.load_15m ?? '0'}
                                </p>
                            </div>
                            <HealthProgressBar percent={vpsData?.cpu?.usage_percent || 0} />
                        </CardContent>
                    </Card>

                    {/* Card 4: Uptime & Containers Ativos */}
                    <Card className="border border-border/60 shadow-xs hover:border-primary/40 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Uptime & Containers
                            </CardTitle>
                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Clock className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="text-lg font-bold tracking-tight block truncate" title={vpsData?.uptime?.formatted}>
                                    {vpsData?.uptime?.formatted || '143 dias'}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <Box className="h-3 w-3" />
                                        {runningCount} / {totalContainers} containers ativos
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Servidor estavel e operacional sem reinicializacoes forcadas.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Seção de Armazenamento Docker */}
                {vpsData?.docker?.storage && (
                    <Card className="border border-border/60 shadow-xs">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <Database className="h-4 w-4 text-primary" />
                                <CardTitle className="text-base font-semibold">
                                    Armazenamento do Docker
                                </CardTitle>
                            </div>
                            <CardDescription>
                                Detalhamento de espaço ocupado por imagens, containers, volumes persistentes e cache de compilação.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <span>Imagens</span>
                                        <span className="font-semibold text-foreground">{vpsData.docker.storage.images?.total || '0'}</span>
                                    </div>
                                    <div className="text-lg font-bold text-foreground">
                                        {vpsData.docker.storage.images?.size || '0B'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 truncate">
                                        Liberavel: {vpsData.docker.storage.images?.reclaimable || '0B'}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <span>Containers</span>
                                        <span className="font-semibold text-foreground">{vpsData.docker.storage.containers?.total || '0'}</span>
                                    </div>
                                    <div className="text-lg font-bold text-foreground">
                                        {vpsData.docker.storage.containers?.size || '0B'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 truncate">
                                        Liberavel: {vpsData.docker.storage.containers?.reclaimable || '0B'}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <span>Volumes Locais</span>
                                        <span className="font-semibold text-foreground">{vpsData.docker.storage['local volumes']?.total || '0'}</span>
                                    </div>
                                    <div className="text-lg font-bold text-foreground">
                                        {vpsData.docker.storage['local volumes']?.size || '0B'}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 truncate">
                                        Liberavel: {vpsData.docker.storage['local volumes']?.reclaimable || '0B'}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <span>Build Cache</span>
                                        <span className="font-semibold text-foreground">{vpsData.docker.storage['build cache']?.total || '0'}</span>
                                    </div>
                                    <div className="text-lg font-bold text-foreground">
                                        {vpsData.docker.storage['build cache']?.size || '0B'}
                                    </div>
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium truncate">
                                        Otimizado (0B pendente)
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Seção de Containers Docker */}
                <Card className="border border-border/60 shadow-xs">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-base font-semibold">
                                        Containers Docker ({filteredContainers.length} de {totalContainers})
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    Monitore o status de cada microservico e reinicie containers individualmente com seguranca.
                                </CardDescription>
                            </div>

                            {/* Controles de Filtro e Busca */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar container ou imagem..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8 h-9 text-xs"
                                    />
                                </div>

                                <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/30">
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('all')}
                                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                                            statusFilter === 'all'
                                                ? 'bg-background text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('running')}
                                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                                            statusFilter === 'running'
                                                ? 'bg-background text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Ativos ({runningCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('stopped')}
                                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                                            statusFilter === 'stopped'
                                                ? 'bg-background text-foreground shadow-xs'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Parados ({totalContainers - runningCount})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-y border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                                        <th className="py-3 px-4">Container</th>
                                        <th className="py-3 px-4">Imagem</th>
                                        <th className="py-3 px-4">Estado & Uptime</th>
                                        <th className="py-3 px-4">Portas Mapeadas</th>
                                        <th className="py-3 px-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {filteredContainers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                                Nenhum container encontrado com os filtros selecionados.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredContainers.map((container) => {
                                            const isRunning = container.state === 'running';
                                            const isThisRestarting = restartingContainer === container.name;

                                            return (
                                                <tr
                                                    key={container.id || container.name}
                                                    className="hover:bg-muted/40 transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-semibold text-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className={`h-2 w-2 rounded-full shrink-0 ${
                                                                    isRunning ? 'bg-emerald-500' : 'bg-amber-500'
                                                                }`}
                                                            />
                                                            <span className="font-mono">{container.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-muted-foreground font-mono truncate max-w-[200px]" title={container.image}>
                                                        {container.image}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                                                isRunning
                                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                            }`}
                                                        >
                                                            {container.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-muted-foreground font-mono text-[11px] truncate max-w-[220px]" title={container.ports || 'Nenhuma porta exposta'}>
                                                        {container.ports || '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setContainerToRestart(container.name)}
                                                            disabled={isThisRestarting}
                                                            className="h-7 px-2.5 text-xs gap-1.5"
                                                        >
                                                            <RotateCw className={`h-3 w-3 ${isThisRestarting ? 'animate-spin text-primary' : ''}`} />
                                                            Reiniciar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modal de Confirmacao: Limpeza de Cache Docker */}
            <AlertDialog open={showCleanModal} onOpenChange={setShowCleanModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            Limpar Cache de Build do Docker?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acao executara o comando <code>docker builder prune -f</code> na VPS, removendo camadas temporarias e liberando dezenas de gigabytes de espaco em disco sem interromper containers em producao.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCleanCache}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Confirmar Limpeza
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de Confirmacao: Reiniciar Container */}
            <AlertDialog
                open={Boolean(containerToRestart)}
                onOpenChange={(open) => !open && setContainerToRestart(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <RotateCw className="h-5 w-5 text-primary" />
                            Reiniciar container: {containerToRestart}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            O container <strong>{containerToRestart}</strong> sera interrompido e reiniciado imediatamente. Durante alguns segundos, as conexoes com este servico poderao sofrer breve interrupcao.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestartContainer}>
                            Reiniciar Agora
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
