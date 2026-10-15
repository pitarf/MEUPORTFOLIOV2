import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import {
    fetchInvoices,
    confirmManualPayment,
    undoManualPayment,
    deleteInvoice
} from '@/services/maintenanceService';
import {
    formatCurrencyBRL,
    formatDateBR,
    maskCpfCnpj,
    maskPhone,
    getSubscriptionStatusMeta,
    getInvoiceStatusMeta,
    getTicketStatusMeta,
    parseCoveredWebsites,
    ensureUrlProtocol,
    extractDomain
} from '@/utils/maintenanceFormatters';
import {
    FileText,
    Receipt,
    LifeBuoy,
    QrCode,
    CheckCircle2,
    RotateCcw,
    Calendar,
    DollarSign,
    User,
    Building2,
    Clock,
    Loader2,
    Globe,
    ExternalLink,
    Trash2,
    Info,
    Copy,
    Check,
    Mail,
    Phone
} from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

/**
 * Modal com a visao 360 graus da assinatura: historico completo de faturas e chamados de suporte.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Visibilidade do modal
 * @param {Function} props.onClose Callback ao fechar
 * @param {Object|null} props.subscription Assinatura em exibicao
 * @param {Function} props.onOpenInvoicePix Callback para abrir modal de QR Code PIX de uma fatura
 * @param {Function} [props.onOpenInvoicePdf] Callback para abrir modal de PDF da fatura
 * @param {Function} props.onPaymentConfirmed Callback ao confirmar pagamento
 */
const SubscriptionDetailsModal = ({
    isOpen,
    onClose,
    subscription = null,
    onOpenInvoicePix,
    onOpenInvoicePdf,
    onPaymentConfirmed
}) => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'tickets'
    const [invoices, setInvoices] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        if (!isOpen || !subscription?.id) return;

        const loadDetails = async () => {
            setLoadingData(true);
            try {
                // 1. Carrega todas as faturas desta assinatura
                const invData = await fetchInvoices({ subscriptionId: subscription.id });
                setInvoices(invData || []);

                // 2. Carrega chamados vinculados
                const { data: ticketData, error: ticketErr } = await supabase
                    .from('support_tickets')
                    .select('*')
                    .or(`subscription_id.eq.${subscription.id},client_email.ilike.${subscription.client_email}`)
                    .order('created_at', { ascending: false });

                if (!ticketErr && ticketData) {
                    setTickets(ticketData);
                }
            } catch (err) {
                console.error('Erro ao carregar faturas ou chamados:', err);
                toast({
                    variant: 'destructive',
                    title: 'Falha ao carregar histórico',
                    description: 'Não foi possível buscar as faturas da assinatura.'
                });
            } finally {
                setLoadingData(false);
            }
        };

        loadDetails();
    }, [isOpen, subscription, toast]);

    if (!subscription) return null;

    const statusMeta = getSubscriptionStatusMeta(subscription.status);

    const handleConfirmPaymentInvoice = async (invoiceId) => {
        setActionLoading(true);
        try {
            await confirmManualPayment(invoiceId, {
                notes: 'Pagamento confirmado manualmente via painel administrativo'
            });

            toast({
                title: 'Pagamento registrado!',
                description: 'A fatura foi baixada e o ciclo da assinatura avançado.'
            });

            // Atualiza lista local
            setInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === invoiceId
                        ? { ...inv, status: 'pago', paid_at: new Date().toISOString() }
                        : inv
                )
            );

            if (onPaymentConfirmed) {
                onPaymentConfirmed();
            }
        } catch (err) {
            console.error('Erro ao confirmar pagamento:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao confirmar',
                description: err.message || 'Falha ao processar confirmação manual.'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUndoPaymentInvoice = async (invoiceId) => {
        setActionLoading(true);
        try {
            await undoManualPayment(invoiceId, {
                reason: 'Baixa desfeita manualmente pelo painel administrativo'
            });

            toast({
                title: 'Baixa desfeita com sucesso!',
                description: 'A fatura retornou para pendente e o vencimento da assinatura foi restaurado.'
            });

            // Atualiza lista local
            setInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === invoiceId
                        ? { ...inv, status: 'pendente', paid_at: null }
                        : inv
                )
            );

            if (onPaymentConfirmed) {
                onPaymentConfirmed();
            }
        } catch (err) {
            console.error('Erro ao desfazer baixa:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao desfazer baixa',
                description: err.message || 'Falha ao reverter pagamento da fatura.'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteInvoice = async (invoiceId) => {
        if (!window.confirm('Tem certeza de que deseja excluir esta fatura pendente?')) return;
        setActionLoading(true);
        try {
            await deleteInvoice(invoiceId);
            toast({
                title: 'Fatura excluída!',
                description: 'A fatura pendente foi removida com sucesso.'
            });
            setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
            if (onPaymentConfirmed) {
                onPaymentConfirmed();
            }
        } catch (err) {
            console.error('Erro ao excluir fatura:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir fatura',
                description: err.message || 'Falha ao remover a fatura.'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCopyText = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
        toast({
            title: 'Copiado para a área de transferência',
            description: `${text}`
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between gap-3">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Info className="w-5 h-5 text-primary" />
                            {subscription.client_name}
                        </DialogTitle>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusMeta.badgeClass}`}>
                            {statusMeta.label}
                        </span>
                    </div>
                    <DialogDescription className="flex items-center gap-2 pt-1">
                        <span className="font-medium text-foreground">{subscription.plan_title}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-mono text-xs text-muted-foreground">{subscription.subscription_code}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Painel Completo de Informações do Cliente & Contrato */}
                    <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-4">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-primary" />
                                Informações Cadastrais & Contratuais
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">
                                Categoria: <strong className="text-foreground">{subscription.category?.name || 'Geral'}</strong>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {/* Documento (CPF / CNPJ) com Botão Copiar */}
                            <div className="p-2.5 rounded-lg bg-card border border-border/60">
                                <span className="text-muted-foreground block text-[11px] font-medium">CPF / CNPJ:</span>
                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                    <span className="font-semibold text-foreground font-mono">
                                        {maskCpfCnpj(subscription.client_document)}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopyText(subscription.client_document, 'doc')}
                                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                                        title="Copiar documento"
                                    >
                                        {copiedField === 'doc' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    </Button>
                                </div>
                            </div>

                            {/* WhatsApp com Link Direto */}
                            <div className="p-2.5 rounded-lg bg-card border border-border/60">
                                <span className="text-muted-foreground block text-[11px] font-medium">WhatsApp / Telefone:</span>
                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                    <span className="font-semibold text-foreground">
                                        {maskPhone(subscription.client_phone)}
                                    </span>
                                    {subscription.client_phone && (
                                        <a
                                            href={`https://wa.me/${subscription.client_phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-500 hover:text-emerald-600 p-1 rounded-md hover:bg-emerald-500/10 transition-colors"
                                            title="Conversar no WhatsApp"
                                        >
                                            <WhatsAppIcon className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Valor Mensal e Ciclo */}
                            <div className="p-2.5 rounded-lg bg-card border border-border/60">
                                <span className="text-muted-foreground block text-[11px] font-medium">Valor Contratado:</span>
                                <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    {formatCurrencyBRL(subscription.current_price)}
                                </div>
                                <span className="text-[10px] text-muted-foreground capitalize">
                                    Ciclo {subscription.billing_cycle || 'mensal'}
                                </span>
                            </div>

                            {/* Vencimento e Dia Fixo */}
                            <div className="p-2.5 rounded-lg bg-card border border-border/60">
                                <span className="text-muted-foreground block text-[11px] font-medium">Próximo Vencimento:</span>
                                <div className="font-semibold text-foreground mt-0.5">
                                    {formatDateBR(subscription.next_due_date)}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                    Dia fixo de cobrança: {subscription.billing_day}
                                </span>
                            </div>
                        </div>

                        {/* Linha Adicional: Empresa e E-mail */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                            {subscription.client_company && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border/60">
                                    <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <span className="text-muted-foreground text-[10px] block">Razão Social / Empresa:</span>
                                        <span className="font-medium text-foreground">{subscription.client_company}</span>
                                    </div>
                                </div>
                            )}

                            {subscription.client_email && (
                                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border/60">
                                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-muted-foreground text-[10px] block">E-mail de Contato:</span>
                                        <a
                                            href={`mailto:${subscription.client_email}`}
                                            className="font-medium text-foreground hover:text-primary truncate block"
                                            title="Enviar e-mail"
                                        >
                                            {subscription.client_email}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Observações do Contrato se houver */}
                        {subscription.notes && (
                            <div className="p-2.5 rounded-lg bg-card border border-border/60 text-xs">
                                <span className="text-muted-foreground text-[10px] block font-medium">Notas & Observações:</span>
                                <p className="text-foreground mt-0.5 leading-relaxed">{subscription.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Sites Cobertos pela Manutenção */}
                    {parseCoveredWebsites(subscription.covered_websites).length > 0 && (
                        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                            <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                <Globe className="w-4 h-4" />
                                Sites & Aplicações Cobertos ({parseCoveredWebsites(subscription.covered_websites).length}):
                            </span>
                            <div className="flex flex-wrap gap-2 pt-0.5">
                                {parseCoveredWebsites(subscription.covered_websites).map((siteUrl, sIdx) => {
                                    const safeUrl = ensureUrlProtocol(siteUrl);
                                    return (
                                        <a
                                            key={sIdx}
                                            href={safeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-card hover:bg-muted text-foreground border border-border shadow-xs hover:border-primary/50 transition-colors"
                                            title={`Abrir ${siteUrl} em nova aba`}
                                        >
                                            <Globe className="w-3.5 h-3.5 text-primary" />
                                            {siteUrl}
                                            <ExternalLink className="w-3 h-3 text-muted-foreground ml-0.5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Alternador de Abas */}
                    <div className="flex items-center border-b border-border gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('invoices')}
                            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                                activeTab === 'invoices'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Receipt className="w-4 h-4" />
                            Histórico de Faturas ({invoices.length})
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('tickets')}
                            className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                                activeTab === 'tickets'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <LifeBuoy className="w-4 h-4" />
                            Chamados de Suporte ({tickets.length})
                        </button>
                    </div>

                    {/* Conteudo das Abas */}
                    {loadingData ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="text-xs">Carregando dados da assinatura...</span>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'invoices' && (
                                <div className="space-y-3">
                                    {invoices.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border text-sm">
                                            Nenhuma fatura gerada para esta assinatura até o momento.
                                        </div>
                                    ) : (
                                        invoices.map((inv) => {
                                            const invStatusMeta = getInvoiceStatusMeta(inv.status);
                                            const isPaid = inv.status === 'pago';

                                            return (
                                                <div
                                                    key={inv.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors gap-3"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm text-foreground">
                                                                {inv.invoice_code}
                                                            </span>
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${invStatusMeta.badgeClass}`}>
                                                                {invStatusMeta.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span>Vencimento: {formatDateBR(inv.due_date)}</span>
                                                            {isPaid && inv.paid_at && (
                                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                                    Pago em: {formatDateBR(inv.paid_at)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-3">
                                                        <span className="text-sm font-bold text-foreground">
                                                            {formatCurrencyBRL(inv.amount)}
                                                        </span>

                                                        <div className="flex items-center gap-1.5">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => onOpenInvoicePdf && onOpenInvoicePdf({ ...inv, subscription })}
                                                                title="Visualizar e Baixar Fatura em PDF"
                                                                className="text-xs text-primary border-primary/30 hover:bg-primary/10"
                                                            >
                                                                <FileText className="w-3.5 h-3.5 mr-1" />
                                                                PDF
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => onOpenInvoicePix && onOpenInvoicePix({ ...inv, subscription })}
                                                                title="Visualizar QR Code PIX"
                                                            >
                                                                <QrCode className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                                                PIX
                                                            </Button>

                                                            {!isPaid ? (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled={actionLoading}
                                                                        onClick={() => handleConfirmPaymentInvoice(inv.id)}
                                                                        className="text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30 text-xs"
                                                                        title="Confirmar pagamento manualmente"
                                                                    >
                                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                                                        Baixar
                                                                    </Button>

                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        disabled={actionLoading}
                                                                        onClick={() => handleDeleteInvoice(inv.id)}
                                                                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs px-2"
                                                                        title="Excluir fatura pendente"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={actionLoading}
                                                                    onClick={() => handleUndoPaymentInvoice(inv.id)}
                                                                    className="text-amber-600 hover:bg-amber-500/10 border-amber-500/30 text-xs"
                                                                    title="Desfazer baixa e reabrir cobrança"
                                                                >
                                                                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                                                    Desfazer Baixa
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {activeTab === 'tickets' && (
                                <div className="space-y-3">
                                    {tickets.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border text-sm">
                                            Nenhum chamado de suporte registrado para este cliente.
                                        </div>
                                    ) : (
                                        tickets.map((t) => {
                                            const ticketMeta = getTicketStatusMeta(t.status);
                                            return (
                                                <div
                                                    key={t.id}
                                                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/20 transition-colors space-y-2"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono font-bold text-primary">
                                                                {t.ticket_code}
                                                            </span>
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {t.subject}
                                                            </span>
                                                        </div>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ticketMeta.badgeClass}`}>
                                                            {ticketMeta.label}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                                        {t.message}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                                                        <span>Prioridade: <strong className="capitalize">{t.priority || 'normal'}</strong></span>
                                                        <span>Criado em: {formatDateBR(t.created_at)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionDetailsModal;
