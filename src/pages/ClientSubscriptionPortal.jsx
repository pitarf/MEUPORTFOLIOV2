import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Search,
    CreditCard,
    QrCode,
    Copy,
    Check,
    LifeBuoy,
    PlusCircle,
    MessageCircle,
    Receipt,
    CheckCircle2,
    Calendar,
    Clock,
    User,
    Building2,
    LogOut,
    Loader2,
    AlertCircle,
    Sparkles,
    FileText,
    ArrowRight,
    ExternalLink,
    Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
    fetchClientPortalData,
    createClientTicket,
    updateClientProfile
} from '@/services/maintenanceService';
import {
    formatCurrencyBRL,
    formatDateBR,
    maskCpfCnpj,
    maskPhone,
    getSubscriptionStatusMeta,
    getInvoiceStatusMeta,
    getTicketStatusMeta
} from '@/utils/maintenanceFormatters';

/**
 * Portal Publico do Assinante : Acesso sem senha para clientes de manutencao continua.
 * Permite consulta instantanea por e-mail ou CPF/CNPJ, emissao de Pix, recibos e abertura de chamados.
 */
const ClientSubscriptionPortal = () => {
    const { toast } = useToast();

    // Estados de autenticacao sem senha
    const [lookupInput, setLookupInput] = useState('');
    const [authenticating, setAuthenticating] = useState(false);
    const [portalData, setPortalData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Estados de acoes e modais
    const [selectedPixInvoice, setSelectedPixInvoice] = useState(null);
    const [copiedPix, setCopiedPix] = useState(false);

    // Modal de recibo de fatura paga
    const [receiptInvoice, setReceiptInvoice] = useState(null);

    // Modal de abertura de chamado
    const [ticketModalOpen, setTicketModalOpen] = useState(false);
    const [ticketSaving, setTicketSaving] = useState(false);
    const [ticketForm, setTicketForm] = useState({
        subscriptionId: '',
        subject: '',
        priority: 'normal',
        message: ''
    });

    // Modal de conclusao/edicao de cadastro do cliente (CPF/CNPJ, WhatsApp, etc.)
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileForm, setProfileForm] = useState({
        document: '',
        name: '',
        phone: '',
        company: ''
    });

    /**
     * Tenta carregar credencial a partir de parametros da URL ou do localStorage
     */
    useEffect(() => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const queryLookup = urlParams.get('lookup') || urlParams.get('email') || urlParams.get('doc');

            if (queryLookup && queryLookup.trim()) {
                const cleanLookup = queryLookup.trim();
                setLookupInput(cleanLookup);
                handlePerformLookup(cleanLookup, false);
                return;
            }

            const savedLookup = localStorage.getItem('rp_maintenance_client_lookup');
            if (savedLookup) {
                setLookupInput(savedLookup);
                handlePerformLookup(savedLookup, false);
            }
        } catch (err) {
            console.warn('Nao foi possivel recuperar sessao ou parametro de URL:', err);
        }
    }, []);

    /**
     * Executa a busca consolidada no servico de manutencao
     */
    const handlePerformLookup = async (identifier, showFeedback = true) => {
        if (!identifier || !identifier.trim()) {
            if (showFeedback) {
                toast({
                    variant: 'destructive',
                    title: 'Campo obrigatório',
                    description: 'Por favor, informe seu e-mail ou CPF/CNPJ cadastrado.'
                });
            }
            return;
        }

        setAuthenticating(true);
        try {
            const data = await fetchClientPortalData(identifier.trim());

            if (data.notFound || !data.client) {
                if (showFeedback) {
                    toast({
                        variant: 'destructive',
                        title: 'Cadastro não localizado',
                        description: 'Nenhuma assinatura de manutenção encontrada para este e-mail ou documento.'
                    });
                }
                setPortalData(null);
                setIsLoggedIn(false);
                return;
            }

            // Sucesso
            setPortalData(data);
            setIsLoggedIn(true);

            // Salva para persistencia amigavel
            try {
                localStorage.setItem('rp_maintenance_client_lookup', identifier.trim());
            } catch (storageErr) {
                console.warn(storageErr);
            }

            if (showFeedback) {
                toast({
                    title: `Bem-vindo(a), ${data.client.name}!`,
                    description: 'Dados da sua assinatura carregados com sucesso.'
                });
            }
        } catch (err) {
            console.error('Falha ao autenticar no portal:', err);
            if (showFeedback) {
                toast({
                    variant: 'destructive',
                    title: 'Erro de conexão',
                    description: err.message || 'Falha ao consultar seus dados. Tente novamente mais tarde.'
                });
            }
        } finally {
            setAuthenticating(false);
        }
    };

    /**
     * Desconecta a visao do cliente e limpa o armazenamento local
     */
    const handleLogout = () => {
        try {
            localStorage.removeItem('rp_maintenance_client_lookup');
        } catch (e) {
            console.warn(e);
        }
        setPortalData(null);
        setIsLoggedIn(false);
        setLookupInput('');
        toast({
            title: 'Sessão encerrada',
            description: 'Você saiu da sua área do assinante com sucesso.'
        });
    };

    /**
     * Copia a chave Copia e Cola do PIX com feedback visual
     */
    const handleCopyPixCode = async (code) => {
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopiedPix(true);
            toast({
                title: 'Código PIX copiado!',
                description: 'Cole o código no aplicativo do seu banco para concluir o pagamento.'
            });
            setTimeout(() => setCopiedPix(false), 3000);
        } catch (err) {
            console.error('Erro ao copiar código PIX:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao copiar',
                description: 'Por favor, selecione e copie o código manualmente.'
            });
        }
    };

    /**
     * Submete o chamado de suporte do cliente
     */
    const handleCreateTicket = async (e) => {
        e.preventDefault();

        if (!ticketForm.subject.trim()) {
            toast({
                variant: 'destructive',
                title: 'Assunto obrigatório',
                description: 'Por favor, resuma o assunto do seu chamado.'
            });
            return;
        }

        if (!ticketForm.message.trim()) {
            toast({
                variant: 'destructive',
                title: 'Mensagem obrigatória',
                description: 'Por favor, descreva detalhadamente sua solicitação ou necessidade.'
            });
            return;
        }

        setTicketSaving(true);
        try {
            const newTicket = await createClientTicket({
                subscriptionId: ticketForm.subscriptionId || null,
                clientName: portalData.client.name,
                clientEmail: portalData.client.email,
                clientDocument: portalData.client.document,
                subject: ticketForm.subject,
                message: ticketForm.message,
                priority: ticketForm.priority
            });

            toast({
                title: 'Chamado aberto com sucesso!',
                description: `Protocolo registrado: ${newTicket.ticket_code}. Nossa equipe responderá em breve.`
            });

            // Adiciona o novo chamado a lista local
            setPortalData((prev) => ({
                ...prev,
                supportTickets: [newTicket, ...(prev?.supportTickets || [])]
            }));

            setTicketModalOpen(false);
            setTicketForm({
                subscriptionId: '',
                subject: '',
                priority: 'normal',
                message: ''
            });
        } catch (err) {
            console.error('Erro ao cadastrar chamado:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao registrar chamado',
                description: err.message || 'Ocorreu um erro ao enviar sua solicitação.'
            });
        } finally {
            setTicketSaving(false);
        }
    };

    /**
     * Atualiza dados cadastrais do cliente (CPF/CNPJ, WhatsApp, Nome, Empresa)
     */
    const handleSaveProfile = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!portalData?.client?.email) return;

        setProfileSaving(true);
        try {
            await updateClientProfile(portalData.client.email, profileForm);
            toast({
                title: 'Cadastro salvo com sucesso!',
                description: 'Seus dados de faturamento foram atualizados.'
            });
            setProfileModalOpen(false);
            // Recarrega os dados do portal silenciosamente
            await handlePerformLookup(portalData.client.email, false);
        } catch (err) {
            console.error('Erro ao atualizar cadastro:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao salvar cadastro',
                description: err.message || 'Nao foi possivel atualizar seus dados no momento.'
            });
        } finally {
            setProfileSaving(false);
        }
    };

    /**
     * Abre conversa com Rafael no WhatsApp
     */
    const handleOpenWhatsappSupport = () => {
        const clientName = portalData?.client?.name || 'Cliente';
        const phone = '5521966149077';
        const text = `Olá Rafael, tudo bem? Sou o cliente ${clientName} e gostaria de tirar uma dúvida sobre a minha assinatura de manutenção.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Helmet>
                <title>Portal do Assinante : Rafael Pita Solutions</title>
                <meta
                    name="description"
                    content="Área exclusiva de assinantes para consulta de faturas PIX, comprovantes de manutenção e abertura de chamados técnicos."
                />
            </Helmet>

            <div className="min-h-screen py-10 px-4 md:px-8 bg-gradient-to-b from-background via-background/95 to-muted/20">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Caso NAO esteja logado: Tela de Acesso sem senha */}
                    {!isLoggedIn ? (
                        <div className="min-h-[75vh] flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-border/80 bg-card/90 backdrop-blur shadow-xl space-y-6"
                            >
                                <div className="text-center space-y-2">
                                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-3">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                        Portal do Assinante
                                    </h1>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Acesso rápido sem senha: digite seu e-mail ou CPF/CNPJ cadastrado no plano de manutenção.
                                    </p>
                                </div>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handlePerformLookup(lookupInput, true);
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <Label htmlFor="client_identifier" className="text-xs font-semibold">
                                            E-mail ou Documento (CPF / CNPJ)
                                        </Label>
                                        <div className="relative">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="client_identifier"
                                                type="text"
                                                placeholder="ex: seu@email.com ou 123.456.789-00"
                                                value={lookupInput}
                                                onChange={(e) => setLookupInput(e.target.value)}
                                                disabled={authenticating}
                                                className="pl-9 h-11 text-sm bg-background"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={authenticating}
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md flex items-center justify-center gap-2"
                                    >
                                        {authenticating ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Localizando dados...
                                            </>
                                        ) : (
                                            <>
                                                Acessar Minhas Assinaturas
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="pt-2 border-t border-border/60 text-center">
                                    <p className="text-[11px] text-muted-foreground">
                                        Dúvidas sobre sua contratação?{' '}
                                        <a
                                            href="https://wa.me/5521966149077"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
                                        >
                                            <MessageCircle className="w-3 h-3 text-emerald-500" />
                                            Fale no WhatsApp
                                        </a>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        /* Caso ESTEJA logado: Dashboard Completo do Assinante */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Cabecalho de Boas-Vindas */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-2xl font-bold text-foreground">
                                            Olá, {portalData.client.name}!
                                        </h1>
                                        {portalData.client.company && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                                {portalData.client.company}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                        {portalData.client.document ? (
                                            <span className="flex items-center gap-1.5">
                                                <span>Doc: {maskCpfCnpj(portalData.client.document)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProfileForm({
                                                            document: portalData.client.document || '',
                                                            name: portalData.client.name || '',
                                                            phone: portalData.client.phone || '',
                                                            company: portalData.client.company || ''
                                                        });
                                                        setProfileModalOpen(true);
                                                    }}
                                                    title="Editar dados cadastrais"
                                                    className="text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileForm({
                                                        document: '',
                                                        name: portalData.client.name || '',
                                                        phone: portalData.client.phone || '',
                                                        company: portalData.client.company || ''
                                                    });
                                                    setProfileModalOpen(true);
                                                }}
                                                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                + Informar CPF ou CNPJ
                                            </button>
                                        )}
                                        <span>•</span>
                                        <span>E-mail: {portalData.client.email}</span>
                                        {portalData.client.phone && (
                                            <>
                                                <span>•</span>
                                                <span>WhatsApp: {maskPhone(portalData.client.phone)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start md:self-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Sair / Trocar Conta
                                    </Button>
                                </div>
                            </div>

                            {/* Banner de Aviso caso o cliente nao tenha CPF/CNPJ cadastrado */}
                            {!portalData.client.document && (
                                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                Complete seu cadastro com CPF ou CNPJ
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Adicione seu documento para emissão correta de faturas, recibos fiscais e facilidade de identificação.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                            setProfileForm({
                                                document: '',
                                                name: portalData.client.name || '',
                                                phone: portalData.client.phone || '',
                                                company: portalData.client.company || ''
                                            });
                                            setProfileModalOpen(true);
                                        }}
                                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 gap-1.5"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Informar CPF/CNPJ Agora
                                    </Button>
                                </div>
                            )}

                            {/* Seção 1: Minhas Assinaturas Ativas */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                        Planos de Manutenção Contratados
                                    </h2>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {portalData.subscriptions.length} {portalData.subscriptions.length === 1 ? 'plano' : 'planos'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {portalData.subscriptions.map((sub) => {
                                        const statusMeta = getSubscriptionStatusMeta(sub.status);
                                        const category = sub.category?.name || 'Manutenção Web';

                                        return (
                                            <div
                                                key={sub.id}
                                                className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors space-y-4"
                                            >
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 rounded-md bg-muted border border-border/50">
                                                            {category}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusMeta.badgeClass}`}>
                                                            {statusMeta.label}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold text-base text-foreground">
                                                            {sub.plan_title}
                                                        </h3>
                                                        {sub.plan_description && (
                                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                {sub.plan_description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Valor Mensal:</span>
                                                        <span className="font-bold text-sm text-foreground">
                                                            {formatCurrencyBRL(sub.current_price)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Vencimento Fixo:</span>
                                                        <span className="font-medium text-foreground">
                                                            Todo dia {sub.billing_day}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Próxima Cobrança:</span>
                                                        <span className="font-semibold text-primary">
                                                            {formatDateBR(sub.next_due_date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Seção 2: Faturas em Aberto (Cobrancas PIX) */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-amber-500" />
                                        Faturas Pendentes & Cobrança PIX
                                    </h2>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {portalData.pendingInvoices.length} em aberto
                                    </span>
                                </div>

                                {portalData.pendingInvoices.length === 0 ? (
                                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center text-xs space-y-1">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                                        <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm block">
                                            Tudo em dia!
                                        </span>
                                        <span className="text-muted-foreground">
                                            Não há faturas pendentes no momento para as suas assinaturas.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {portalData.pendingInvoices.map((inv) => {
                                            const isSelected = selectedPixInvoice?.id === inv.id;
                                            return (
                                                <div
                                                    key={inv.id}
                                                    className={`p-5 rounded-2xl border transition-all space-y-4 ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5 shadow-md'
                                                            : 'border-border bg-card shadow-sm'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <span className="text-xs font-mono font-bold text-foreground">
                                                                {inv.invoice_code}
                                                            </span>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                                Vencimento: <strong>{formatDateBR(inv.due_date)}</strong>
                                                            </div>
                                                        </div>
                                                        <span className="text-base font-bold text-foreground">
                                                            {formatCurrencyBRL(inv.amount)}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        onClick={() => setSelectedPixInvoice(isSelected ? null : inv)}
                                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        <QrCode className="w-4 h-4" />
                                                        {isSelected ? 'Ocultar QR Code PIX' : 'Pagar com PIX'}
                                                    </Button>

                                                    {/* Painel do QR Code e Copia e Cola Expansivel */}
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="pt-4 border-t border-border space-y-4 text-center overflow-hidden"
                                                            >
                                                                {/* Imagem do QR Code */}
                                                                <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-border inline-block mx-auto shadow-sm">
                                                                    {inv.pix_qr_code_base64 ? (
                                                                        <img
                                                                            src={
                                                                                inv.pix_qr_code_base64.startsWith('data:')
                                                                                    ? inv.pix_qr_code_base64
                                                                                    : `data:image/png;base64,${inv.pix_qr_code_base64}`
                                                                            }
                                                                            alt="QR Code PIX"
                                                                            className="w-44 h-44 object-contain rounded-lg"
                                                                        />
                                                                    ) : inv.pix_qr_code ? (
                                                                        <img
                                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(inv.pix_qr_code)}`}
                                                                            alt="QR Code PIX"
                                                                            className="w-44 h-44 object-contain rounded-lg"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-44 h-44 flex items-center justify-center text-xs text-muted-foreground">
                                                                            QR Code indisponível
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <p className="text-xs text-muted-foreground">
                                                                    Abra o app do seu banco, escolha <strong>Pix</strong> e aponte a câmera.
                                                                </p>

                                                                {/* Copia e Cola */}
                                                                {inv.pix_qr_code && (
                                                                    <div className="space-y-1.5 text-left">
                                                                        <Label className="text-xs font-semibold text-muted-foreground">
                                                                            Ou pague com o PIX Copia e Cola:
                                                                        </Label>
                                                                        <div className="flex items-center gap-2">
                                                                            <input
                                                                                readOnly
                                                                                value={inv.pix_qr_code}
                                                                                className="w-full text-xs font-mono p-2 rounded-lg border border-border bg-muted/40 truncate select-all"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                size="sm"
                                                                                onClick={() => handleCopyPixCode(inv.pix_qr_code)}
                                                                                className={`flex-shrink-0 transition-colors ${
                                                                                    copiedPix
                                                                                        ? 'bg-emerald-600 text-white'
                                                                                        : 'bg-primary text-primary-foreground'
                                                                                }`}
                                                                            >
                                                                                {copiedPix ? (
                                                                                    <>
                                                                                        <Check className="w-3.5 h-3.5 mr-1" />
                                                                                        Copiado!
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <Copy className="w-3.5 h-3.5 mr-1" />
                                                                                        Copiar
                                                                                    </>
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Seção 3: Historico de Faturas Pagas & Recibos */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <Receipt className="w-5 h-5 text-emerald-500" />
                                        Histórico de Pagamentos & Recibos
                                    </h2>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {portalData.paidInvoices.length} faturas quitadas
                                    </span>
                                </div>

                                {portalData.paidInvoices.length === 0 ? (
                                    <div className="p-6 rounded-2xl border border-border bg-card text-center text-xs text-muted-foreground">
                                        Ainda não há pagamentos anteriores registrados neste documento.
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs border-collapse">
                                                <thead>
                                                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                                                        <th className="py-3 px-4">Fatura</th>
                                                        <th className="py-3 px-4">Valor</th>
                                                        <th className="py-3 px-4">Pago Em</th>
                                                        <th className="py-3 px-4">Status</th>
                                                        <th className="py-3 px-4 text-right">Comprovante</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {portalData.paidInvoices.map((inv) => (
                                                        <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                                                            <td className="py-3 px-4 font-mono font-medium text-foreground">
                                                                {inv.invoice_code}
                                                            </td>
                                                            <td className="py-3 px-4 font-bold text-foreground">
                                                                {formatCurrencyBRL(inv.amount)}
                                                            </td>
                                                            <td className="py-3 px-4 text-muted-foreground">
                                                                {formatDateBR(inv.paid_at || inv.updated_at)}
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                    Quitado
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 text-right">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setReceiptInvoice(inv)}
                                                                    className="h-8 text-xs text-primary hover:text-primary font-medium"
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 mr-1" />
                                                                    Ver Recibo
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Seção 4: Chamados & Atendimento */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                            <LifeBuoy className="w-5 h-5 text-primary" />
                                            Suporte Técnico & Chamados
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            Abra solicitações de ajustes, melhorias ou suporte técnico para a sua assinatura.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => setTicketModalOpen(true)}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 shadow-sm text-xs"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            Abrir Novo Chamado
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleOpenWhatsappSupport}
                                            className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 font-semibold flex items-center gap-1.5 text-xs"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Falar com Rafael no WhatsApp
                                        </Button>
                                    </div>
                                </div>

                                {portalData.supportTickets.length === 0 ? (
                                    <div className="p-8 rounded-2xl border border-dashed border-border bg-card text-center space-y-2">
                                        <LifeBuoy className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                                        <span className="font-semibold text-foreground text-sm block">
                                            Nenhum chamado aberto
                                        </span>
                                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                            Precisa de alguma manutenção técnica ou atualização no seu site? Clique no botão acima para abrir um chamado.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {portalData.supportTickets.map((ticket) => {
                                            const meta = getTicketStatusMeta(ticket.status);
                                            return (
                                                <div
                                                    key={ticket.id}
                                                    className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2 hover:border-primary/40 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="space-y-0.5">
                                                            <span className="text-[11px] font-mono font-bold text-primary">
                                                                {ticket.ticket_code}
                                                            </span>
                                                            <h4 className="font-bold text-sm text-foreground">
                                                                {ticket.subject}
                                                            </h4>
                                                        </div>
                                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${meta.badgeClass}`}>
                                                            {meta.label}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                        {ticket.message}
                                                    </p>

                                                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                                                        <span>Prioridade: <strong className="capitalize">{ticket.priority || 'normal'}</strong></span>
                                                        <span>Registrado em: {formatDateBR(ticket.created_at)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal: Abertura de Novo Chamado */}
            <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <LifeBuoy className="w-5 h-5 text-primary" />
                            Abrir Novo Chamado de Suporte
                        </DialogTitle>
                        <DialogDescription>
                            Envie os detalhes da sua solicitação técnica para análise direta de Rafael Pita.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateTicket} className="space-y-4 pt-2">
                        {portalData?.subscriptions?.length > 1 && (
                            <div className="space-y-1.5">
                                <Label htmlFor="ticket_subscription">Assinatura Relacionada</Label>
                                <Select
                                    value={ticketForm.subscriptionId}
                                    onValueChange={(val) => setTicketForm({ ...ticketForm, subscriptionId: val })}
                                >
                                    <SelectTrigger id="ticket_subscription">
                                        <SelectValue placeholder="Selecione o plano..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {portalData.subscriptions.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.plan_title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="ticket_subject">Assunto da Solicitação *</Label>
                            <Input
                                id="ticket_subject"
                                placeholder="Ex: Ajuste no formulário de contato ou erro na página"
                                value={ticketForm.subject}
                                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="ticket_priority">Nível de Urgência / Prioridade</Label>
                            <Select
                                value={ticketForm.priority}
                                onValueChange={(val) => setTicketForm({ ...ticketForm, priority: val })}
                            >
                                <SelectTrigger id="ticket_priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="baixa">Baixa : Dúvida ou melhoria futura</SelectItem>
                                    <SelectItem value="normal">Normal : Solicitação de rotina</SelectItem>
                                    <SelectItem value="alta">Alta : Funcionalidade importante com instabilidade</SelectItem>
                                    <SelectItem value="urgente">Urgente : Sistema fora do ar ou crítico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="ticket_message">Descrição Detalhada *</Label>
                            <Textarea
                                id="ticket_message"
                                rows={4}
                                placeholder="Descreva os detalhes da alteração solicitada, links afetados ou o que precisa ser ajustado..."
                                value={ticketForm.message}
                                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                                required
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setTicketModalOpen(false)}
                                disabled={ticketSaving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={ticketSaving}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                {ticketSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Registrar Chamado
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Comprovante / Recibo de Pagamento */}
            <Dialog open={Boolean(receiptInvoice)} onOpenChange={() => setReceiptInvoice(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Receipt className="w-5 h-5 text-emerald-500" />
                            Recibo de Pagamento
                        </DialogTitle>
                        <DialogDescription>
                            Comprovante digital emitido por Rafael Pita Solutions.
                        </DialogDescription>
                    </DialogHeader>

                    {receiptInvoice && (
                        <div className="space-y-4 pt-2">
                            <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2.5">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fatura:</span>
                                    <span className="font-mono font-bold text-foreground">{receiptInvoice.invoice_code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <span className="font-semibold text-foreground">{portalData?.client?.name}</span>
                                </div>
                                {portalData?.client?.document && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Documento:</span>
                                        <span className="font-semibold text-foreground">{maskCpfCnpj(portalData.client.document)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Data da Liquidação:</span>
                                    <span className="font-semibold text-foreground">{formatDateBR(receiptInvoice.paid_at || receiptInvoice.updated_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Forma de Pagamento:</span>
                                    <span className="font-semibold text-foreground">PIX Cash-In / Gateway Seguro</span>
                                </div>
                                <div className="pt-2 border-t border-border/60 flex justify-between items-center text-sm">
                                    <span className="font-bold text-foreground">Valor Total Pago:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrencyBRL(receiptInvoice.amount)}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                Pagamento autenticado e ciclo de manutenção confirmado com sucesso.
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.print()}
                            className="w-full sm:w-auto"
                        >
                            Imprimir Recibo
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setReceiptInvoice(null)}
                            className="w-full sm:w-auto"
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Completar ou Atualizar Dados Cadastrais (CPF/CNPJ) */}
            <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            Dados Cadastrais do Assinante
                        </DialogTitle>
                        <DialogDescription>
                            Informe seu CPF ou CNPJ para emissão de recibos, faturas e identificação automática no portal.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label htmlFor="prof_document" className="text-xs font-bold text-foreground">
                                CPF ou CNPJ *
                            </Label>
                            <Input
                                id="prof_document"
                                type="text"
                                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                value={profileForm.document}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, document: e.target.value }))}
                                required
                                disabled={profileSaving}
                                className="bg-background"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Digite apenas números ou com pontuação.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prof_name" className="text-xs font-bold text-foreground">
                                Nome Completo ou Responsável
                            </Label>
                            <Input
                                id="prof_name"
                                type="text"
                                placeholder="Seu nome"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                disabled={profileSaving}
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prof_phone" className="text-xs font-bold text-foreground">
                                WhatsApp para Notificações
                            </Label>
                            <Input
                                id="prof_phone"
                                type="text"
                                placeholder="(21) 99999-9999"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                disabled={profileSaving}
                                className="bg-background"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prof_company" className="text-xs font-bold text-foreground">
                                Empresa / Razão Social (Opcional)
                            </Label>
                            <Input
                                id="prof_company"
                                type="text"
                                placeholder="Nome da empresa"
                                value={profileForm.company}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                                disabled={profileSaving}
                                className="bg-background"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setProfileModalOpen(false)}
                                disabled={profileSaving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={profileSaving}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                {profileSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar Cadastro
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientSubscriptionPortal;
