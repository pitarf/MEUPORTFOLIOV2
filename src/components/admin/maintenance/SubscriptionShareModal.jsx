import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
    MessageCircle,
    Copy,
    Check,
    Send,
    ExternalLink,
    Sparkles,
    Calendar,
    Link2,
    ShieldCheck
} from 'lucide-react';
import {
    formatWhatsAppOnboardingMessage,
    formatWhatsAppMonthlyReminderMessage,
    generatePortalUrl,
    generateWhatsAppUrl
} from '@/utils/whatsappMessages';
import { maskPhone } from '@/utils/maintenanceFormatters';

/**
 * Modal de Compartilhamento e Notificacao de Assinaturas no WhatsApp.
 * Oferece 2 modelos de mensagem:
 * 1. Primeira Mensagem (Apresentacao do novo sistema, portal sem senha, historico de pagamentos e recibos).
 * 2. Lembrete Mensal Padrao (Cobranca recorrente com Pix Copia e Cola para os meses seguintes).
 * Alem de atalho para copiar apenas o link direto com login automatico do cliente.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Controle de abertura do modal
 * @param {Function} props.onClose Funcao para fechar o modal
 * @param {Object} props.subscription Dados do contrato da assinatura
 * @param {Object} [props.latestInvoice] Fatura mais recente com Pix (se houver)
 */
const SubscriptionShareModal = ({
    isOpen,
    onClose,
    subscription,
    latestInvoice = null
}) => {
    const { toast } = useToast();

    // Estado da aba selecionada ('onboarding' | 'reminder' | 'direct_link')
    const [activeTab, setActiveTab] = useState('onboarding');

    // Textos editaveis de cada modelo
    const [onboardingText, setOnboardingText] = useState('');
    const [reminderText, setReminderText] = useState('');

    // Estados de feedback de copia
    const [copiedMessage, setCopiedMessage] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // Link publico personalizado com auto-login do assinante
    const clientIdentifier = subscription?.client_email || subscription?.client_document || '';
    const portalUrl = generatePortalUrl(clientIdentifier);

    // Atualiza os modelos sempre que o contrato ou fatura mudar
    useEffect(() => {
        if (!subscription) return;

        const clientName = subscription.client_name || 'Cliente';
        const planTitle = subscription.plan_title || 'Manutenção Contínua';
        const amount = latestInvoice?.amount !== undefined ? latestInvoice.amount : subscription.current_price;
        const billingDay = subscription.billing_day || 10;
        const dueDate = latestInvoice?.due_date || subscription.next_due_date || '';
        const pixCode = latestInvoice?.pix_qr_code || '';
        const invoiceCode = latestInvoice?.invoice_code || '';
        const clientEmail = subscription.client_email || '';

        // 1. Mensagem de Onboarding / Apresentacao do Sistema
        const initialOnboarding = formatWhatsAppOnboardingMessage({
            clientName,
            planTitle,
            amount,
            billingDay,
            dueDate,
            pixCode,
            clientEmail,
            portalUrl
        });
        setOnboardingText(initialOnboarding);

        // 2. Mensagem de Lembrete Mensal Padrao
        const initialReminder = formatWhatsAppMonthlyReminderMessage({
            clientName,
            planTitle,
            amount,
            billingDay,
            dueDate,
            pixCode,
            invoiceCode,
            clientEmail,
            portalUrl
        });
        setReminderText(initialReminder);

        setCopiedMessage(false);
        setCopiedLink(false);
    }, [subscription, latestInvoice, portalUrl, isOpen]);

    if (!subscription) return null;

    /**
     * Copia texto da mensagem atual para a area de transferencia
     */
    const handleCopyCurrentMessage = async () => {
        const textToCopy = activeTab === 'onboarding' ? onboardingText : reminderText;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopiedMessage(true);
            toast({
                title: 'Mensagem copiada!',
                description: 'O texto formatado foi copiado para a sua área de transferência.'
            });
            setTimeout(() => setCopiedMessage(false), 3000);
        } catch (err) {
            console.error('Falha ao copiar mensagem:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao copiar',
                description: 'Não foi possível copiar o texto automaticamente.'
            });
        }
    };

    /**
     * Copia apenas a URL direta do portal
     */
    const handleCopyPortalLink = async () => {
        try {
            await navigator.clipboard.writeText(portalUrl);
            setCopiedLink(true);
            toast({
                title: 'Link do portal copiado!',
                description: 'O link de acesso direto do cliente está pronto para ser enviado.'
            });
            setTimeout(() => setCopiedLink(false), 3000);
        } catch (err) {
            console.error('Falha ao copiar link:', err);
        }
    };

    /**
     * Abre a conversa no WhatsApp Web com a mensagem selecionada
     */
    const handleOpenWhatsAppWeb = () => {
        const textToSend = activeTab === 'onboarding' ? onboardingText : reminderText;
        const targetPhone = subscription.client_phone || '';
        const url = generateWhatsAppUrl(targetPhone, textToSend);
        window.open(url, '_blank', 'noopener,noreferrer');

        toast({
            title: 'WhatsApp iniciado!',
            description: targetPhone
                ? `Abrindo conversa com ${maskPhone(targetPhone)}.`
                : 'Abrindo o WhatsApp Web com a mensagem pré-carregada.'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <MessageCircle className="w-5 h-5 text-emerald-500" />
                        Notificações & Compartilhamento no WhatsApp
                    </DialogTitle>
                    <DialogDescription>
                        Envie os dados da assinatura de <span className="font-semibold text-foreground">{subscription.client_name}</span> com modelos formatados e link direto para o portal.
                    </DialogDescription>
                </DialogHeader>

                {/* Resumo Rapido do Contrato */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                        <div>
                            <span className="font-semibold text-foreground">{subscription.plan_title}</span>
                            <span className="text-muted-foreground ml-2">({subscription.subscription_code})</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <span>Vencimento: Dia {subscription.billing_day}</span>
                        <span>•</span>
                        <span>WhatsApp: {subscription.client_phone ? maskPhone(subscription.client_phone) : 'Não informado'}</span>
                    </div>
                </div>

                {/* Abas com as 2 Mensagens e Link Direto */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-1">
                    <TabsList className="grid grid-cols-3 w-full bg-muted/70 p-1 rounded-xl">
                        <TabsTrigger value="onboarding" className="text-xs font-semibold gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            1ª Mensagem : Novo Sistema
                        </TabsTrigger>
                        <TabsTrigger value="reminder" className="text-xs font-semibold gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            Lembrete Mensal Padrão
                        </TabsTrigger>
                        <TabsTrigger value="direct_link" className="text-xs font-semibold gap-1.5">
                            <Link2 className="w-3.5 h-3.5 text-emerald-500" />
                            Link do Portal
                        </TabsTrigger>
                    </TabsList>

                    {/* Aba 1: Primeira Mensagem (Onboarding & Explicacao do Sistema) */}
                    <TabsContent value="onboarding" className="space-y-3 pt-3">
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                            <strong>Quando usar:</strong> Ideal para enviar na primeira vez ao cliente. Explica que a assinatura agora é gerenciada oficialmente pelo sistema, apresenta o portal sem senha, histórico de recibos e suporte.
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground flex items-center justify-between">
                                <span>Texto da Mensagem (Você pode editar antes de enviar):</span>
                                <span className="text-[11px] text-muted-foreground font-normal">Formatação compatível com WhatsApp</span>
                            </label>
                            <Textarea
                                rows={11}
                                value={onboardingText}
                                onChange={(e) => setOnboardingText(e.target.value)}
                                className="font-mono text-xs bg-muted/20 resize-none leading-relaxed"
                            />
                        </div>
                    </TabsContent>

                    {/* Aba 2: Lembrete Mensal Padrao (Cobranca Recorrente) */}
                    <TabsContent value="reminder" className="space-y-3 pt-3">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                            <strong>Quando usar:</strong> Mensagem recorrente para os meses seguintes, lembrando sobre a fatura do mês, chave Pix Copia e Cola e consulta ao histórico no portal.
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground flex items-center justify-between">
                                <span>Texto da Mensagem (Você pode editar antes de enviar):</span>
                                <span className="text-[11px] text-muted-foreground font-normal">Formatação compatível com WhatsApp</span>
                            </label>
                            <Textarea
                                rows={11}
                                value={reminderText}
                                onChange={(e) => setReminderText(e.target.value)}
                                className="font-mono text-xs bg-muted/20 resize-none leading-relaxed"
                            />
                        </div>
                    </TabsContent>

                    {/* Aba 3: Link Direto do Portal */}
                    <TabsContent value="direct_link" className="space-y-4 pt-3">
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                            <strong>Acesso Direto:</strong> Este link já inclui o e-mail ou documento do cliente como parâmetro, abrindo o portal diretamente autenticado sem precisar digitar nada.
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                                Link do Portal do Assinante:
                            </label>
                            <div className="p-3 rounded-xl bg-muted/30 border border-border flex items-center justify-between gap-2">
                                <span className="font-mono text-xs text-foreground truncate select-all">
                                    {portalUrl}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCopyPortalLink}
                                    className="shrink-0 gap-1.5 text-xs"
                                >
                                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedLink ? 'Copiado!' : 'Copiar Link'}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(portalUrl, '_blank')}
                                className="w-full gap-1.5 text-xs"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Abrir Portal do Cliente no Navegador
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-border/70">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCopyPortalLink}
                        className="text-xs gap-1.5 w-full sm:w-auto"
                    >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
                        {copiedLink ? 'Link Copiado' : 'Copiar Apenas o Link'}
                    </Button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {activeTab !== 'direct_link' && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCopyCurrentMessage}
                                className="text-xs gap-1.5 flex-1 sm:flex-initial"
                            >
                                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                {copiedMessage ? 'Copiado!' : 'Copiar Mensagem'}
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={handleOpenWhatsAppWeb}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 flex-1 sm:flex-initial shadow-sm"
                        >
                            <Send className="w-3.5 h-3.5" />
                            Abrir no WhatsApp Web
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionShareModal;
