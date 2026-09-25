import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
    Search,
    CheckCircle2,
    Clock,
    Lock,
    ExternalLink,
    FileText,
    MessageCircle,
    Copy,
    Check,
    ShieldCheck,
    Layers,
    DollarSign,
    Calendar,
    Building2,
    Sparkles,
    AlertCircle,
    Loader2,
    Briefcase,
    ArrowRight,
    QrCode,
    CreditCard
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { fetchBudgetByCode, fetchPricingSettings } from '@/services/budgetService';
import BudgetPdfModal from '@/components/admin/BudgetPdfModal';
import { detectPaymentMode } from '@/components/admin/BudgetModal';

/**
 * Portal Exclusivo do Cliente para Acompanhamento em Tempo Real do Projeto
 * Visualização de Sub-sprints, Marcos de Entrega, Condições Comerciais e Status
 * Protegido contra indexação de motores de busca (noindex, nofollow)
 */
const ClientProjectTrack = () => {
    const { budgetCode: urlCode } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [searchCode, setSearchCode] = useState(urlCode || '');
    const [projectData, setProjectData] = useState(null);
    const [pricingSettings, setPricingSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);

    // Carrega dados institucionais (chaves PIX, suporte)
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await fetchPricingSettings();
                if (settings) setPricingSettings(settings);
            } catch (err) {
                console.error('Erro ao carregar dados institucionais:', err);
            }
        };
        loadSettings();
    }, []);

    // Busca o projeto pelo código informado
    const loadProject = useCallback(async (code) => {
        if (!code || !code.trim()) return;
        setLoading(true);
        setSearched(true);
        setProjectData(null);

        try {
            const data = await fetchBudgetByCode(code);
            if (!data) {
                toast({
                    variant: 'destructive',
                    title: 'Projeto não encontrado',
                    description: 'Verifique o código do pedido informado e tente novamente.'
                });
                setProjectData(null);
            } else {
                setProjectData(data);
            }
        } catch (err) {
            console.error('Erro ao carregar projeto:', err);
            toast({
                variant: 'destructive',
                title: 'Erro na busca',
                description: 'Não foi possível localizar este pedido. Confirme o código com nossa equipe.'
            });
            setProjectData(null);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    // Dispara busca se o código veio diretamente pela URL
    useEffect(() => {
        if (urlCode) {
            setSearchCode(urlCode);
            loadProject(urlCode);
        }
    }, [urlCode, loadProject]);

    // Submissão do formulário de busca
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchCode.trim()) return;
        const clean = searchCode.trim().replace(/^#/, '');
        navigate(`/projeto/${clean}`);
        loadProject(clean);
    };

    // Copiar código do pedido
    const handleCopyCode = (code) => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
        toast({
            title: 'Código copiado!',
            description: 'Código do pedido copiado para a área de transferência.'
        });
    };

    // Mapeamento visual de status geral do projeto
    const getStatusBadge = (status) => {
        switch (status) {
            case 'em_andamento':
                return {
                    label: 'Em Desenvolvimento Ativo',
                    color: 'text-blue-700 dark:text-blue-300',
                    bg: 'bg-blue-500/10 border-blue-500/30',
                    dot: 'bg-blue-500 animate-pulse'
                };
            case 'entregue':
                return {
                    label: 'Entregue / Em Homologação',
                    color: 'text-purple-700 dark:text-purple-300',
                    bg: 'bg-purple-500/10 border-purple-500/30',
                    dot: 'bg-purple-500'
                };
            case 'concluido':
                return {
                    label: 'Concluído & Aprovado',
                    color: 'text-emerald-700 dark:text-emerald-300',
                    bg: 'bg-emerald-500/10 border-emerald-500/30',
                    dot: 'bg-emerald-500'
                };
            case 'pendente_pagamento':
                return {
                    label: 'Aguardando Pagamento',
                    color: 'text-amber-700 dark:text-amber-300',
                    bg: 'bg-amber-500/10 border-amber-500/30',
                    dot: 'bg-amber-500'
                };
            case 'em_analise':
                return {
                    label: 'Alinhamento de Escopo',
                    color: 'text-sky-700 dark:text-sky-300',
                    bg: 'bg-sky-500/10 border-sky-500/30',
                    dot: 'bg-sky-500'
                };
            default:
                return {
                    label: 'Proposta Comercial / Planejamento',
                    color: 'text-slate-700 dark:text-slate-300',
                    bg: 'bg-slate-500/10 border-slate-500/30',
                    dot: 'bg-slate-400'
                };
        }
    };

    // Cálculo das métricas de sub-sprints
    const deliverables = Array.isArray(projectData?.deliverables) ? projectData.deliverables : [];
    const totalSprints = deliverables.length;
    const completedSprints = deliverables.filter(d => d.status === 'concluido').length;
    const inProgressSprints = deliverables.filter(d => d.status === 'em_andamento').length;

    // Percentual geral de conclusão
    const progressPercent = totalSprints > 0
        ? Math.round((completedSprints / totalSprints) * 100)
        : (projectData?.status === 'concluido' ? 100 : projectData?.status === 'em_andamento' ? 50 : 20);

    const statusBadge = projectData ? getStatusBadge(projectData.status) : null;
    const paymentMode = projectData ? detectPaymentMode(projectData.payment_terms || '') : '50_50';
    const finalPrice = Number(projectData?.final_price || 0);

    // Contato WhatsApp do suporte do projeto
    const supportPhone = pricingSettings?.company_phone?.replace(/\D/g, '') || '5521999999999';
    const whatsappLink = projectData
        ? `https://wa.me/${supportPhone.length <= 11 ? `55${supportPhone}` : supportPhone}?text=${encodeURIComponent(
            `Olá Rafael! Gostaria de conversar sobre o andamento do meu projeto "${projectData.title}" (Código do Pedido: ${projectData.budget_code || projectData.id}).`
        )}`
        : '#';

    return (
        <>
            <Helmet>
                <title>
                    {projectData ? `${projectData.title} | Acompanhamento do Projeto` : 'Acompanhar Projeto | Rafael Pita Solutions'}
                </title>
                {/* Proteção Absoluta contra Indexação de Motores de Busca */}
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Cabeçalho Institucional de Boas-Vindas */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-3"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide border border-primary/20">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Portal Exclusivo do Contratante • Acompanhamento em Tempo Real
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                            Acompanhamento de <span className="gradient-text">Projetos & Sprints</span>
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                            Acompanhe cada marco entregável, o cronograma das sub-sprints e as condições da sua proposta com total transparência e segurança.
                        </p>
                    </motion.div>

                    {/* Barra de Pesquisa de Pedido / Código */}
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSearchSubmit}
                        className="max-w-xl mx-auto flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border shadow-sm focus-within:ring-2 focus-within:ring-primary/40 transition-all"
                    >
                        <div className="pl-3 text-muted-foreground">
                            <Search className="w-5 h-5" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Digite o código do seu pedido (ex: #ORC-2026-001)"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            className="border-0 shadow-none focus-visible:ring-0 text-sm font-medium bg-transparent h-11"
                        />
                        <Button
                            type="submit"
                            disabled={loading || !searchCode.trim()}
                            className="h-11 px-5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rastrear'}
                        </Button>
                    </motion.form>

                    {/* Estado: Carregando */}
                    {loading && (
                        <div className="p-12 text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                            <p className="text-sm text-muted-foreground">Localizando informações do seu pedido...</p>
                        </div>
                    )}

                    {/* Estado: Não Encontrado */}
                    {!loading && searched && !projectData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 sm:p-12 rounded-2xl bg-card border border-border text-center max-w-lg mx-auto space-y-4 shadow-sm"
                        >
                            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-foreground">Pedido não localizado</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Não encontramos nenhum projeto com o código informado. Certifique-se de incluir a identificação completa ou fale diretamente conosco pelo WhatsApp.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => window.open(whatsappLink, '_blank')}
                                className="gap-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                            >
                                <MessageCircle className="w-4 h-4" /> Falar com Suporte Técnico
                            </Button>
                        </motion.div>
                    )}

                    {/* Estado: Projeto Carregado com Sucesso */}
                    {projectData && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            {/* Card Principal: Identificação do Projeto e Status */}
                            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {projectData.category?.title && (
                                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                                                    {projectData.category.title}
                                                </span>
                                            )}
                                            {statusBadge && (
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.color}`}>
                                                    <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                                                    {statusBadge.label}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                            {projectData.title}
                                        </h2>

                                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Building2 className="w-4 h-4 text-primary" />
                                            <span>
                                                Contratante: <b>{projectData.client_company || projectData.client_name}</b>
                                            </span>
                                        </p>
                                    </div>

                                    {/* Código do Pedido com Cópia Rápida */}
                                    <div className="p-3 rounded-2xl bg-muted/30 border border-border flex items-center justify-between sm:flex-col sm:items-end gap-2">
                                        <div className="text-left sm:text-right">
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                                                Código do Pedido
                                            </span>
                                            <span className="font-mono font-black text-base text-foreground">
                                                {projectData.budget_code || `#ORC-${projectData.id?.slice(0, 8)}`}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopyCode(projectData.budget_code || projectData.id)}
                                            className="h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
                                        >
                                            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            {copiedCode ? 'Copiado!' : 'Copiar'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Barra de Progresso Geral das Sub-sprints */}
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center text-xs font-semibold">
                                        <span className="text-foreground flex items-center gap-1.5">
                                            <Layers className="w-4 h-4 text-primary" />
                                            Progresso Geral das Entregas
                                        </span>
                                        <span className="font-mono text-primary font-bold">
                                            {progressPercent}% Concluído ({completedSprints} de {totalSprints || 1} sub-sprints)
                                        </span>
                                    </div>

                                    <div className="w-full h-3 rounded-full bg-muted overflow-hidden p-0.5 border border-border/60">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Prazo Estimado: <b>{projectData.deadline_days || 15} dias úteis</b>
                                        </span>
                                        <span>
                                            {inProgressSprints > 0 ? `${inProgressSprints} sub-sprint em produção agora` : 'Cronograma regular'}
                                        </span>
                                    </div>
                                </div>

                                {/* Ações Rápidas: Ver PDF e WhatsApp */}
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setPdfModalOpen(true)}
                                        className="h-9 text-xs gap-2 border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Visualizar Proposta Comercial em PDF
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => window.open(whatsappLink, '_blank')}
                                        className="h-9 text-xs gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Falar com Rafael no WhatsApp
                                    </Button>
                                </div>
                            </div>

                            {/* Timeline de Sub-sprints e Entregáveis */}
                            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-primary" />
                                            Sub-sprints & Marcos de Entrega
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Acompanhe o status individual de cada etapa e acesse as prévias à medida que forem disponibilizadas.
                                        </p>
                                    </div>
                                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                                        {deliverables.length} Etapas
                                    </span>
                                </div>

                                {deliverables.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                                        O escopo detalhado deste projeto está em fase de estruturação. Em breve as sub-sprints estarão listadas aqui.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {deliverables.map((sprint, idx) => {
                                            const isDone = sprint.status === 'concluido';
                                            const isInProgress = sprint.status === 'em_andamento';

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                                                        isDone
                                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                                            : isInProgress
                                                            ? 'border-blue-500/40 bg-blue-500/5 shadow-sm'
                                                            : 'border-border bg-card/60'
                                                    }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                                                                    Sprint {idx + 1}
                                                                </span>

                                                                {isDone ? (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                        <CheckCircle2 className="w-3 h-3" /> Concluído
                                                                    </span>
                                                                ) : isInProgress ? (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                                                        <Clock className="w-3 h-3 animate-spin" /> Em Andamento
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                                                                        <Lock className="w-3 h-3" /> Aguardando Início
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h4 className="text-sm sm:text-base font-bold text-foreground">
                                                                {sprint.stage || sprint.title || `Etapa ${idx + 1}`}
                                                            </h4>

                                                            {sprint.description && (
                                                                <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                                                                    {sprint.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Link de Homologação / Prévia Externa se disponível */}
                                                        {sprint.link && (
                                                            <div className="shrink-0 pt-2 sm:pt-0">
                                                                <a
                                                                    href={sprint.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
                                                                >
                                                                    <span>Ver Prévia da Entrega</span>
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Bloco Comercial & Condições de Pagamento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Detalhamento Financeiro */}
                                <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
                                    <h3 className="text-sm font-bold uppercase text-foreground tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                        Condições Comerciais Acordadas
                                    </h3>

                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <span className="text-muted-foreground block">Modalidade Contratada:</span>
                                            <span className="font-bold text-foreground text-sm">
                                                {paymentMode === '50_50'
                                                    ? '50% na Entrada + 50% na Entrega Final'
                                                    : paymentMode === 'etapas_split'
                                                    ? 'Pagamento por Etapas (Splits)'
                                                    : paymentMode === 'cartao_credito'
                                                    ? 'Cartão de Crédito em até 12x'
                                                    : (projectData.payment_terms || 'Condição Personalizada')}
                                            </span>
                                        </div>

                                        {paymentMode === '50_50' && (
                                            <div className="grid grid-cols-2 gap-2 pt-1">
                                                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                                        1º Sinal (50%)
                                                    </span>
                                                    <span className="font-mono font-bold text-sm text-foreground">
                                                        R$ {(finalPrice * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                        Início dos trabalhos
                                                    </span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                                        2º Saldo (50%)
                                                    </span>
                                                    <span className="font-mono font-bold text-sm text-foreground">
                                                        R$ {(finalPrice * 0.5).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                                                        Na aprovação final
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMode === 'etapas_split' && (
                                            <div className="space-y-1.5 pt-1">
                                                <span className="text-[11px] text-muted-foreground block">
                                                    Faturamento em splits conforme conclusão de cada marco:
                                                </span>
                                                <div className="space-y-1">
                                                    {deliverables.map((d, i) => (
                                                        <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border flex justify-between items-center text-xs">
                                                            <span className="font-medium text-foreground truncate pr-2">
                                                                Split {i + 1}: {d.stage || d.title || `Etapa ${i + 1}`}
                                                            </span>
                                                            <span className="font-mono font-bold text-primary whitespace-nowrap">
                                                                R$ {(finalPrice / (deliverables.length || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {paymentMode === 'cartao_credito' && (
                                            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs space-y-1">
                                                <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                                    <CreditCard className="w-3.5 h-3.5" /> Parcelamento em até 12x
                                                </span>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                    Cobrado via link ou maquininha com tarifas e juros da operadora por conta do contratante.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Chave PIX e Contato Oficial */}
                                <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold uppercase text-foreground tracking-wider flex items-center gap-2 border-b border-border pb-2">
                                            <QrCode className="w-4 h-4 text-emerald-500" />
                                            Liquidação & Chave PIX
                                        </h3>

                                        {pricingSettings?.pix_key ? (
                                            <div className="space-y-2">
                                                <p className="text-xs text-muted-foreground">
                                                    Chave PIX Oficial ({pricingSettings.pix_key_type || 'CNPJ'}):
                                                </p>
                                                <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between gap-2">
                                                    <span className="font-mono font-bold text-xs text-foreground select-all break-all">
                                                        {pricingSettings.pix_key}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(pricingSettings.pix_key);
                                                            toast({ title: 'Chave PIX copiada!', description: 'Cole no aplicativo do seu banco.' });
                                                        }}
                                                        className="h-7 text-xs text-primary shrink-0"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                Solicite os dados bancários ou link de pagamento diretamente pelo canal de suporte.
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-border flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Prestador Responsável:</span>
                                        <span className="font-bold text-foreground">
                                            {pricingSettings?.company_trade_name || 'Rafael Pita Solutions'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal de PDF Oficial para o Cliente */}
            {projectData && (
                <BudgetPdfModal
                    isOpen={pdfModalOpen}
                    onClose={() => setPdfModalOpen(false)}
                    budget={projectData}
                    pricingSettings={pricingSettings}
                    categoryTitle={projectData.category?.title || 'Tecnologia & Desenvolvimento'}
                />
            )}
        </>
    );
};

export default ClientProjectTrack;
