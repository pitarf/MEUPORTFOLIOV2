import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Repeat,
    PlusCircle,
    Settings,
    Search,
    Filter,
    DollarSign,
    Calendar,
    Users,
    AlertTriangle,
    CheckCircle2,
    RotateCcw,
    Clock,
    RefreshCw,
    QrCode,
    TrendingUp,
    FileText,
    MoreVertical,
    Trash2,
    Edit,
    MessageCircle,
    Building2,
    Eye,
    Loader2,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { useToast } from '@/components/ui/use-toast';
import {
    fetchSubscriptions,
    fetchMaintenanceCategories,
    deleteSubscription,
    generateInvoiceForSubscription,
    ensureInvoicePix,
    confirmManualPayment,
    undoManualPayment,
    fetchInvoices
} from '@/services/maintenanceService';
import {
    formatCurrencyBRL,
    formatDateBR,
    maskCpfCnpj,
    maskPhone,
    getCleanWhatsappNumber,
    getSubscriptionStatusMeta,
    parseCoveredWebsites,
    extractDomain
} from '@/utils/maintenanceFormatters';

import SubscriptionFormModal from '@/components/admin/maintenance/SubscriptionFormModal';
import PushinPayConfigModal from '@/components/admin/maintenance/PushinPayConfigModal';
import PriceAdjustmentModal from '@/components/admin/maintenance/PriceAdjustmentModal';
import InvoicePixModal from '@/components/admin/maintenance/InvoicePixModal';
import SubscriptionDetailsModal from '@/components/admin/maintenance/SubscriptionDetailsModal';
import SubscriptionShareModal from '@/components/admin/maintenance/SubscriptionShareModal';
import InvoicePdfModal from '@/components/admin/maintenance/InvoicePdfModal';

/**
 * Painel Administrativo de Assinaturas de Manutencao Recorrente
 * Rota: /admin/assinaturas
 *
 * Gerencia ciclo de vida dos contratos de manutencao continua, faturamento MRR,
 * emissao e liquidacao de faturas PIX via PushinPay e atalhos de WhatsApp.
 */
const ManageMaintenanceSubscriptions = () => {
    const { toast } = useToast();

    // Estados de dados
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [categories, setCategories] = useState([]);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [categoryFilter, setCategoryFilter] = useState('todas');

    // Modais
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);

    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const [priceSubscription, setPriceSubscription] = useState(null);

    const [pixModalOpen, setPixModalOpen] = useState(false);
    const [currentInvoicePix, setCurrentInvoicePix] = useState(null);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [detailsSubscription, setDetailsSubscription] = useState(null);

    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareSubscription, setShareSubscription] = useState(null);
    const [shareLatestInvoice, setShareLatestInvoice] = useState(null);

    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [currentInvoicePdf, setCurrentInvoicePdf] = useState(null);

    const [deleteDialogState, setDeleteDialogState] = useState({
        isOpen: false,
        subscriptionId: null,
        clientName: ''
    });

    /**
     * Carrega as assinaturas e categorias do banco de dados
     */
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [subsData, catsData] = await Promise.all([
                fetchSubscriptions(),
                fetchMaintenanceCategories()
            ]);
            setSubscriptions(subsData || []);
            setCategories(catsData || []);
        } catch (err) {
            console.error('Erro ao carregar assinaturas:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar dados',
                description: 'Não foi possível carregar a lista de assinaturas do servidor.'
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /**
     * Metricas rapidas de desempenho (KPIs)
     */
    const kpis = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const in7Days = new Date();
        in7Days.setDate(in7Days.getDate() + 7);
        const in7DaysStr = in7Days.toISOString().split('T')[0];

        let activeCount = 0;
        let mrrTotal = 0;
        let dueSoonCount = 0;
        let overdueCount = 0;

        subscriptions.forEach((sub) => {
            const isSubActive = sub.status === 'ativo';
            const price = Number(sub.current_price) || 0;

            if (isSubActive) {
                activeCount += 1;
                mrrTotal += price;
            }

            if (sub.status === 'atrasado') {
                overdueCount += 1;
            } else if (sub.next_due_date && sub.next_due_date < todayStr && sub.status !== 'cancelado') {
                overdueCount += 1;
            }

            if (
                sub.next_due_date &&
                sub.next_due_date >= todayStr &&
                sub.next_due_date <= in7DaysStr &&
                isSubActive
            ) {
                dueSoonCount += 1;
            }
        });

        return {
            activeCount,
            mrrTotal,
            dueSoonCount,
            overdueCount
        };
    }, [subscriptions]);

    /**
     * Assinaturas filtradas na tela
     */
    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter((sub) => {
            // Filtro por Status
            if (statusFilter !== 'todos' && sub.status !== statusFilter) {
                return false;
            }

            // Filtro por Categoria
            if (categoryFilter !== 'todas' && sub.category_id !== categoryFilter) {
                return false;
            }

            // Filtro por Texto
            if (searchTerm.trim() !== '') {
                const term = searchTerm.toLowerCase().trim();
                const name = (sub.client_name || '').toLowerCase();
                const code = (sub.subscription_code || '').toLowerCase();
                const doc = (sub.client_document || '').toLowerCase();
                const email = (sub.client_email || '').toLowerCase();
                const company = (sub.client_company || '').toLowerCase();
                const plan = (sub.plan_title || '').toLowerCase();

                if (
                    !name.includes(term) &&
                    !code.includes(term) &&
                    !doc.includes(term) &&
                    !email.includes(term) &&
                    !company.includes(term) &&
                    !plan.includes(term)
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [subscriptions, statusFilter, categoryFilter, searchTerm]);

    /**
     * Abre o modal de compartilhamento e notificacao no WhatsApp com mensagens formatadas
     */
    const handleOpenShareModal = async (subscription) => {
        setShareSubscription(subscription);
        try {
            const invoices = await fetchInvoices({ subscriptionId: subscription.id });
            const pending = invoices?.find((inv) => inv.status !== 'pago' && inv.status !== 'cancelado') || invoices?.[0] || null;
            setShareLatestInvoice(pending);
        } catch (err) {
            console.warn('Aviso ao buscar fatura para compartilhamento:', err.message);
            setShareLatestInvoice(null);
        }
        setShareModalOpen(true);
    };

    /**
     * Abre a fatura da assinatura no modal de visualizacao e download em PDF
     */
    const handleOpenSubscriptionPdf = async (subscription) => {
        setActionLoadingId(subscription.id);
        try {
            const invoices = await fetchInvoices({ subscriptionId: subscription.id });
            const targetInvoice = invoices?.find((inv) => inv.status !== 'cancelado') || invoices?.[0] || null;
            if (!targetInvoice) {
                toast({
                    title: 'Gerando fatura do ciclo...',
                    description: 'Nenhuma fatura encontrada. Gerando cobrança para visualização...'
                });
                const generated = await generateInvoiceForSubscription(subscription.id);
                setCurrentInvoicePdf({
                    ...generated,
                    subscription
                });
            } else {
                setCurrentInvoicePdf({
                    ...targetInvoice,
                    subscription
                });
            }
            setPdfModalOpen(true);
        } catch (err) {
            console.error('Erro ao abrir PDF da fatura:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao abrir fatura',
                description: err.message || 'Não foi possível carregar a fatura para o PDF.'
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    /**
     * Abre a fatura pendente da assinatura ou gera uma nova, garantindo QR Code PIX
     */
    const handleGeneratePixInvoice = async (subscription) => {
        setActionLoadingId(subscription.id);
        try {
            // 1. Verifica se ja existe fatura pendente para esta assinatura
            const invoices = await fetchInvoices({
                subscriptionId: subscription.id,
                status: 'pendente'
            });

            let targetInvoice = null;
            if (invoices && invoices.length > 0) {
                // Ja existe fatura pendente: garante que ela possua QR Code PIX ativo
                targetInvoice = await ensureInvoicePix(invoices[0].id);
            } else {
                // Nao existe pendente: gera nova fatura para o ciclo atual
                targetInvoice = await generateInvoiceForSubscription(subscription.id);
                toast({
                    title: 'Fatura PIX gerada!',
                    description: `Código: ${targetInvoice.invoice_code} no valor de ${formatCurrencyBRL(targetInvoice.amount)}.`
                });
            }

            setCurrentInvoicePix({
                ...targetInvoice,
                subscription
            });
            setPixModalOpen(true);
        } catch (err) {
            console.error('Erro ao gerar fatura PIX:', err);
            toast({
                variant: 'destructive',
                title: 'Falha na emissão da fatura',
                description: err.message || 'Não foi possível gerar a fatura PIX para esta assinatura.'
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    /**
     * Confirma o pagamento manual da fatura mais recente pendente
     */
    const handleConfirmManualPaymentQuick = async (subscription) => {
        setActionLoadingId(subscription.id);
        try {
            // Busca faturas da assinatura para identificar a pendente
            const invoices = await fetchInvoices({
                subscriptionId: subscription.id,
                status: 'pendente'
            });

            let targetInvoiceId = null;
            if (invoices && invoices.length > 0) {
                targetInvoiceId = invoices[0].id;
            } else {
                // Se nao havia fatura emitida, gera e quita em sequencia
                const newInv = await generateInvoiceForSubscription(subscription.id);
                targetInvoiceId = newInv.id;
            }

            await confirmManualPayment(targetInvoiceId, {
                notes: 'Pagamento confirmado manualmente pelo painel'
            });

            toast({
                title: 'Pagamento confirmado com sucesso!',
                description: `Vencimento da assinatura de ${subscription.client_name} avançado para o próximo ciclo.`
            });

            await loadData();
        } catch (err) {
            console.error('Erro ao confirmar pagamento:', err);
            toast({
                variant: 'destructive',
                title: 'Erro na confirmação',
                description: err.message || 'Falha ao confirmar o pagamento manual.'
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    /**
     * Desfaz o pagamento da fatura paga mais recente, restaurando o vencimento
     */
    const handleUndoLastPaymentQuick = async (subscription) => {
        setActionLoadingId(subscription.id);
        try {
            const invoices = await fetchInvoices({
                subscriptionId: subscription.id,
                status: 'pago'
            });

            if (!invoices || invoices.length === 0) {
                toast({
                    variant: 'destructive',
                    title: 'Nenhuma fatura paga',
                    description: 'Não há faturas quitadas para ter o pagamento desfeito nesta assinatura.'
                });
                return;
            }

            const latestPaidInvoice = invoices[0];
            await undoManualPayment(latestPaidInvoice.id, {
                reason: 'Baixa desfeita manualmente pelo painel administrativo'
            });

            toast({
                title: 'Baixa desfeita com sucesso!',
                description: `Fatura ${latestPaidInvoice.invoice_code} reaberta e vencimento restaurado para ${formatDateBR(latestPaidInvoice.due_date)}.`
            });

            await loadData();
        } catch (err) {
            console.error('Erro ao desfazer pagamento:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao desfazer baixa',
                description: err.message || 'Falha ao reverter o pagamento da assinatura.'
            });
        } finally {
            setActionLoadingId(null);
        }
    };

    /**
     * Exclui a assinatura selecionada
     */
    const handleConfirmDelete = async () => {
        if (!deleteDialogState.subscriptionId) return;

        try {
            await deleteSubscription(deleteDialogState.subscriptionId);
            toast({
                title: 'Assinatura excluída!',
                description: `A assinatura de ${deleteDialogState.clientName} foi removida com sucesso.`
            });
            setDeleteDialogState({ isOpen: false, subscriptionId: null, clientName: '' });
            await loadData();
        } catch (err) {
            console.error('Erro ao excluir:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir',
                description: err.message || 'Não foi possível excluir a assinatura.'
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Assinaturas & Manutenção Contínua : Rafael Pita Solutions</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="space-y-6 pb-12">
                {/* Cabecalho da Pagina */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                            <Repeat className="w-7 h-7 text-primary" />
                            Assinaturas & Manutenção
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Controle de contratos mensais, faturamento recorrente, faturas PIX e atendimento a clientes.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSettingsModalOpen(true)}
                            className="flex items-center gap-1.5"
                        >
                            <Settings className="w-4 h-4" />
                            Configurações & PushinPay
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => {
                                setEditingSubscription(null);
                                setFormModalOpen(true);
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Nova Assinatura
                        </Button>
                    </div>
                </div>

                {/* Cards de Metricas Rapidas (KPIs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1: Ativas */}
                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-center justify-between text-muted-foreground mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Assinaturas Ativas</span>
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {kpis.activeCount}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                            Contratos vigentes no momento
                        </span>
                    </div>

                    {/* KPI 2: MRR Estimado */}
                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-center justify-between text-muted-foreground mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Receita Mensal (MRR)</span>
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrencyBRL(kpis.mrrTotal)}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                            Faturamento recorrente mensal
                        </span>
                    </div>

                    {/* KPI 3: Vencimento Proximo */}
                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-center justify-between text-muted-foreground mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Vencendo em 7 Dias</span>
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Calendar className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {kpis.dueSoonCount}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                            Ciclos com renovação iminente
                        </span>
                    </div>

                    {/* KPI 4: Atrasados */}
                    <div className="p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-center justify-between text-muted-foreground mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Inadimplentes / Atrasados</span>
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                            {kpis.overdueCount}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                            Assinaturas com pendência em aberto
                        </span>
                    </div>
                </div>

                {/* Barra de Ferramentas & Filtros */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card shadow-sm">
                    {/* Busca Textual */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente, documento, e-mail, plano ou código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                    </div>

                    {/* Filtros em Linha */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Filtro de Status */}
                        <div className="w-36">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos Status</SelectItem>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="atrasado">Atrasado</SelectItem>
                                    <SelectItem value="pausado">Pausado</SelectItem>
                                    <SelectItem value="cancelado">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro de Categoria */}
                        <div className="w-44">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas Categorias</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Botao de Recarregar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={loadData}
                            disabled={loading}
                            className="h-9 w-9 text-muted-foreground hover:text-foreground"
                            title="Atualizar dados"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Lista / Tabela Responsiva de Assinaturas */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm">Carregando assinaturas cadastradas...</span>
                    </div>
                ) : filteredSubscriptions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border space-y-3">
                        <Repeat className="w-10 h-10 mx-auto text-muted-foreground/60" />
                        <h3 className="font-semibold text-base text-foreground">Nenhuma assinatura localizada</h3>
                        <p className="text-xs max-w-md mx-auto">
                            Tente ajustar seus filtros de busca ou cadastre uma nova assinatura para começar o monitoramento recorrente.
                        </p>
                        <Button
                            size="sm"
                            onClick={() => {
                                setEditingSubscription(null);
                                setFormModalOpen(true);
                            }}
                            className="mt-2"
                        >
                            <PlusCircle className="w-4 h-4 mr-1.5" />
                            Cadastrar Primeira Assinatura
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Visao em Cards Mobile (visivel em telas pequenas) */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {filteredSubscriptions.map((sub) => {
                                const statusMeta = getSubscriptionStatusMeta(sub.status);
                                const isActionBusy = actionLoadingId === sub.id;

                                return (
                                    <div
                                        key={sub.id}
                                        className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`} />
                                                    <h3 className="font-bold text-base text-foreground">
                                                        {sub.client_name}
                                                    </h3>
                                                </div>
                                                {sub.client_company && (
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <Building2 className="w-3 h-3" />
                                                        {sub.client_company}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusMeta.badgeClass}`}>
                                                {statusMeta.label}
                                            </span>
                                        </div>

                                        <div className="p-2.5 rounded-lg bg-muted/40 text-xs space-y-1">
                                            <div className="font-semibold text-foreground">
                                                {sub.plan_title}
                                            </div>

                                            {sub.covered_websites && parseCoveredWebsites(sub.covered_websites).length > 0 && (
                                                <div className="flex flex-wrap gap-1 pt-1 pb-0.5">
                                                    {parseCoveredWebsites(sub.covered_websites).map((site, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                                                        >
                                                            <Globe className="w-2.5 h-2.5" />
                                                            {extractDomain(site)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Mensal: <strong>{formatCurrencyBRL(sub.current_price)}</strong></span>
                                                <span>Vencimento: <strong>{formatDateBR(sub.next_due_date)}</strong> (Dia {sub.billing_day})</span>
                                            </div>
                                            {sub.next_price && (
                                                <div className="text-amber-600 dark:text-amber-400 font-medium pt-1 border-t border-border/50">
                                                    Reajuste: {formatCurrencyBRL(sub.next_price)} a partir de {formatDateBR(sub.next_price_effective_date)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Acoes Mobile */}
                                        <div className="grid grid-cols-2 gap-2 pt-1">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={isActionBusy}
                                                onClick={() => handleGeneratePixInvoice(sub)}
                                                className="text-xs flex items-center justify-center gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                                            >
                                                {isActionBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                                                Gerar PIX
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={isActionBusy}
                                                onClick={() => handleConfirmManualPaymentQuick(sub)}
                                                className="text-xs flex items-center justify-center gap-1 text-blue-600 border-blue-500/30 hover:bg-blue-500/10"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Dar Baixa
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setPriceSubscription(sub);
                                                    setPriceModalOpen(true);
                                                }}
                                                className="text-xs flex items-center justify-center gap-1"
                                            >
                                                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                                                Reajuste
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setDetailsSubscription(sub);
                                                    setDetailsModalOpen(true);
                                                }}
                                                className="text-xs flex items-center justify-center gap-1"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-primary" />
                                                Detalhes
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                disabled={isActionBusy}
                                                onClick={() => handleOpenSubscriptionPdf(sub)}
                                                className="col-span-2 text-xs flex items-center justify-center gap-1 text-primary border-primary/30 hover:bg-primary/10 font-medium"
                                                title="Visualizar e Baixar Fatura em PDF"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                Visualizar Fatura (PDF)
                                            </Button>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleOpenShareModal(sub)}
                                                className="col-span-2 text-xs flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 font-bold"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                WhatsApp (Apresentação / Lembretes)
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Visao em Tabela Elegante Desktop */}
                        <div className="hidden md:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                                            <th className="py-3 px-4">Cliente / Empresa</th>
                                            <th className="py-3 px-4">Plano & Categoria</th>
                                            <th className="py-3 px-4">Valor Mensal</th>
                                            <th className="py-3 px-4">Vencimento</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Ações Rápidas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredSubscriptions.map((sub) => {
                                            const statusMeta = getSubscriptionStatusMeta(sub.status);
                                            const isActionBusy = actionLoadingId === sub.id;
                                            const categoryName = sub.category?.name || 'Geral';
                                            const cleanPhone = getCleanWhatsappNumber(sub.client_phone);

                                            return (
                                                <tr
                                                    key={sub.id}
                                                    className="hover:bg-muted/20 transition-colors"
                                                >
                                                    {/* Cliente */}
                                                    <td className="py-3.5 px-4 align-top">
                                                        <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                                                            {sub.client_name}
                                                        </div>
                                                        {sub.client_company && (
                                                            <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                                                <Building2 className="w-3 h-3 text-muted-foreground" />
                                                                {sub.client_company}
                                                            </div>
                                                        )}
                                                        <div className="text-muted-foreground text-xs mt-1 flex items-center gap-2">
                                                            <span>{maskCpfCnpj(sub.client_document)}</span>
                                                            {cleanPhone && (
                                                                <a
                                                                    href={`https://wa.me/${cleanPhone}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-0.5"
                                                                    title="Abrir WhatsApp direto"
                                                                >
                                                                    <MessageCircle className="w-3 h-3" />
                                                                    {maskPhone(sub.client_phone)}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Plano & Categoria */}
                                                    <td className="py-3.5 px-4 align-top">
                                                        <div className="font-semibold text-foreground">
                                                            {sub.plan_title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                            <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-medium border border-border/40">
                                                                {categoryName}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] font-mono text-muted-foreground/80 mt-1 block">
                                                            {sub.subscription_code}
                                                        </span>

                                                        {sub.covered_websites && parseCoveredWebsites(sub.covered_websites).length > 0 && (
                                                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                                                                {parseCoveredWebsites(sub.covered_websites).map((site, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                                                                        title={site}
                                                                    >
                                                                        <Globe className="w-2.5 h-2.5" />
                                                                        {extractDomain(site)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Valor Mensal */}
                                                    <td className="py-3.5 px-4 align-top">
                                                        <div className="text-sm font-bold text-foreground">
                                                            {formatCurrencyBRL(sub.current_price)}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground block capitalize">
                                                            Ciclo {sub.billing_cycle || 'mensal'}
                                                        </span>
                                                        {sub.next_price && (
                                                            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                                                                Reajuste: {formatCurrencyBRL(sub.next_price)}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Vencimento */}
                                                    <td className="py-3.5 px-4 align-top">
                                                        <div className="font-medium text-foreground">
                                                            {formatDateBR(sub.next_due_date)}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground block">
                                                            Dia fixo: {sub.billing_day}
                                                        </span>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-3.5 px-4 align-top">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`w-2 h-2 rounded-full ${statusMeta.dotClass}`} />
                                                            <span className={`px-2 py-0.5 rounded-full font-semibold ${statusMeta.badgeClass}`}>
                                                                {statusMeta.label}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Acoes Rapidas */}
                                                    <td className="py-3.5 px-4 align-top text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {/* Botao PIX */}
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isActionBusy}
                                                                onClick={() => handleGeneratePixInvoice(sub)}
                                                                className="h-8 px-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30"
                                                                title="Gerar Fatura PIX agora"
                                                            >
                                                                {isActionBusy ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                ) : (
                                                                    <QrCode className="w-3.5 h-3.5 mr-1" />
                                                                )}
                                                                PIX
                                                            </Button>

                                                            {/* Botao Dar Baixa */}
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isActionBusy}
                                                                onClick={() => handleConfirmManualPaymentQuick(sub)}
                                                                className="h-8 px-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 border-blue-500/30"
                                                                title="Confirmar pagamento e avançar ciclo"
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                                Baixar
                                                            </Button>

                                                            {/* Botao Notificar WhatsApp */}
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleOpenShareModal(sub)}
                                                                className="h-8 px-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30 font-medium"
                                                                title="Compartilhar no WhatsApp: Apresentação do sistema ou lembrete mensal"
                                                            >
                                                                <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                                                WhatsApp
                                                            </Button>

                                                            {/* Dropdown com mais acoes */}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-52">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleOpenShareModal(sub)}
                                                                        className="cursor-pointer text-emerald-600 dark:text-emerald-400 font-semibold"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                                                        Notificar no WhatsApp
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setPriceSubscription(sub);
                                                                            setPriceModalOpen(true);
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <TrendingUp className="w-4 h-4 mr-2 text-amber-500" />
                                                                        Reajuste de Preço
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        onClick={() => handleOpenSubscriptionPdf(sub)}
                                                                        className="cursor-pointer text-primary focus:text-primary focus:bg-primary/10 font-semibold"
                                                                    >
                                                                        <FileText className="w-4 h-4 mr-2" />
                                                                        Visualizar Fatura (PDF)
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setDetailsSubscription(sub);
                                                                            setDetailsModalOpen(true);
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <FileText className="w-4 h-4 mr-2 text-primary" />
                                                                        Faturas & Chamados
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        onClick={() => handleUndoLastPaymentQuick(sub)}
                                                                        className="cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-500/10"
                                                                    >
                                                                        <RotateCcw className="w-4 h-4 mr-2 text-amber-500" />
                                                                        Desfazer Última Baixa
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setEditingSubscription(sub);
                                                                            setFormModalOpen(true);
                                                                        }}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                                                                        Editar Dados
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuSeparator />

                                                                    <DropdownMenuItem
                                                                        onClick={() => setDeleteDialogState({
                                                                            isOpen: true,
                                                                            subscriptionId: sub.id,
                                                                            clientName: sub.client_name
                                                                        })}
                                                                        className="cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-500/10"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Excluir Assinatura
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modais Administrativos */}
            <SubscriptionFormModal
                isOpen={formModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSuccess={loadData}
                subscription={editingSubscription}
                categories={categories}
            />

            <PushinPayConfigModal
                isOpen={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
            />

            <PriceAdjustmentModal
                isOpen={priceModalOpen}
                onClose={() => setPriceModalOpen(false)}
                onSuccess={loadData}
                subscription={priceSubscription}
            />

            <InvoicePixModal
                isOpen={pixModalOpen}
                onClose={() => setPixModalOpen(false)}
                invoice={currentInvoicePix}
                onConfirmPayment={async (invId) => {
                    await confirmManualPayment(invId);
                    await loadData();
                }}
                onUndoPayment={async (invId) => {
                    await undoManualPayment(invId);
                    await loadData();
                }}
                onOpenPdfModal={(inv) => {
                    setCurrentInvoicePdf(inv);
                    setPdfModalOpen(true);
                }}
            />

            <SubscriptionDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                subscription={detailsSubscription}
                onOpenInvoicePix={(inv) => {
                    setCurrentInvoicePix(inv);
                    setPixModalOpen(true);
                }}
                onOpenInvoicePdf={(inv) => {
                    setCurrentInvoicePdf(inv);
                    setPdfModalOpen(true);
                }}
                onPaymentConfirmed={loadData}
            />

            <SubscriptionShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                subscription={shareSubscription}
                latestInvoice={shareLatestInvoice}
            />

            <InvoicePdfModal
                isOpen={pdfModalOpen}
                onClose={() => setPdfModalOpen(false)}
                invoice={currentInvoicePdf}
            />

            {/* Dialogo de Confirmacao de Exclusao */}
            <AlertDialog
                open={deleteDialogState.isOpen}
                onOpenChange={(open) => !open && setDeleteDialogState({ isOpen: false, subscriptionId: null, clientName: '' })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Assinatura?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a assinatura de <strong>{deleteDialogState.clientName}</strong>? Esta ação removerá o contrato de manutenção e o histórico de cobranças associado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            Confirmar Exclusão
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ManageMaintenanceSubscriptions;
