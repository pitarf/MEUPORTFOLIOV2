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
import {
    formatCurrencyBRL,
    formatDateBR,
    getCleanWhatsappNumber,
    getInvoiceStatusMeta
} from '@/utils/maintenanceFormatters';
import {
    QrCode,
    Copy,
    Check,
    MessageCircle,
    Calendar,
    DollarSign,
    CheckCircle2,
    RotateCcw,
    Loader2,
    FileText,
    RefreshCw
} from 'lucide-react';
import { generatePortalUrl } from '@/utils/whatsappMessages';
import { ensureInvoicePix } from '@/services/maintenanceService';

/**
 * Modal para exibicao e compartilhamento do QR Code PIX e chave Copia e Cola.
 * Possui botao de 1 clique para envio ao WhatsApp e feedback de copia para a area de transferencia.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Visibilidade do modal
 * @param {Function} props.onClose Callback ao fechar
 * @param {Object|null} props.invoice Dados da fatura gerada
 * @param {Function} [props.onConfirmPayment] Callback opcional para liquidar na tela
 * @param {Function} [props.onUndoPayment] Callback opcional para desfazer pagamento/baixa
 * @param {Function} [props.onOpenPdfModal] Callback opcional para abrir modal de visualizacao e download em PDF
 */
const InvoicePixModal = ({
    isOpen,
    onClose,
    invoice = null,
    onConfirmPayment = null,
    onUndoPayment = null,
    onOpenPdfModal = null
}) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [undoing, setUndoing] = useState(false);
    const [localInvoice, setLocalInvoice] = useState(invoice);
    const [loadingPix, setLoadingPix] = useState(false);

    // Sincroniza estado quando a prop invoice mudar
    useEffect(() => {
        setLocalInvoice(invoice);
    }, [invoice]);

    // Auto-recupera ou emite PIX automaticamente caso a fatura esteja pendente e sem codigo
    useEffect(() => {
        if (!isOpen || !localInvoice) return;

        const needsPix = (!localInvoice.pix_qr_code || localInvoice.pix_qr_code.trim() === '' || localInvoice.pushinpay_id?.startsWith('err_fallback_')) && localInvoice.status !== 'cancelado';

        if (needsPix && !loadingPix) {
            let active = true;
            const autoGenerate = async () => {
                setLoadingPix(true);
                try {
                    const updated = await ensureInvoicePix(localInvoice.id);
                    if (active && updated) {
                        setLocalInvoice(updated);
                        toast({
                            title: 'PIX Gerado com Sucesso',
                            description: 'O QR Code e a chave Copia e Cola foram preparados para esta fatura.'
                        });
                    }
                } catch (err) {
                    console.error('Falha ao auto-gerar PIX:', err);
                } finally {
                    if (active) setLoadingPix(false);
                }
            };
            autoGenerate();
            return () => { active = false; };
        }
    }, [isOpen, localInvoice?.id, localInvoice?.pix_qr_code]);

    if (!invoice && !localInvoice) return null;

    const activeInvoice = localInvoice || invoice;
    const subscription = activeInvoice.subscription || {};
    const pixCode = activeInvoice.pix_qr_code || '';
    const qrImageBase64 = activeInvoice.pix_qr_code_base64;
    const statusMeta = getInvoiceStatusMeta(activeInvoice.status);

    /**
     * Sincroniza ou regenera manualmente os dados do PIX
     */
    const handleManualRegeneratePix = async () => {
        if (!activeInvoice) return;
        setLoadingPix(true);
        try {
            const updated = await ensureInvoicePix(activeInvoice.id);
            if (updated) {
                setLocalInvoice(updated);
                toast({
                    title: 'PIX Sincronizado!',
                    description: 'QR Code e chave Copia e Cola atualizados com sucesso.'
                });
            }
        } catch (err) {
            console.error('Erro ao sincronizar PIX:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao gerar PIX',
                description: err.message || 'Não foi possível emitir a cobrança.'
            });
        } finally {
            setLoadingPix(false);
        }
    };

    /**
     * Copia o codigo Pix Copia e Cola para a area de transferencia do usuario
     */
    const handleCopyPix = async () => {
        if (!pixCode) return;
        try {
            await navigator.clipboard.writeText(pixCode);
            setCopied(true);
            toast({
                title: 'Código PIX copiado!',
                description: 'A chave Copia e Cola foi transferida para a sua área de transferência.'
            });
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Falha ao copiar:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao copiar',
                description: 'Não foi possível copiar automaticamente. Selecione e copie manualmente.'
            });
        }
    };

    /**
     * Envia os dados da cobranca PIX para o WhatsApp do cliente
     */
    const handleSendWhatsapp = () => {
        const clientPhone = getCleanWhatsappNumber(subscription.client_phone);
        if (!clientPhone) {
            toast({
                variant: 'destructive',
                title: 'WhatsApp não informado',
                description: 'O cliente não possui WhatsApp cadastrado para envio direto.'
            });
            return;
        }

        const clientFirstName = (subscription.client_name || 'Cliente').split(' ')[0];
        const planName = subscription.plan_title || 'Manutenção';
        const formattedAmount = formatCurrencyBRL(activeInvoice.amount);
        const formattedDate = formatDateBR(activeInvoice.due_date);
        const invoiceCode = activeInvoice.invoice_code || 'FAT-PIX';

        const portalUrl = generatePortalUrl(subscription.client_email || subscription.client_document);

        const text = `Olá ${clientFirstName}, tudo bem?\n\nSegue a fatura de manutenção mensal (${planName}) referente ao ciclo atual:\n\n*Fatura:* ${invoiceCode}\n*Valor:* ${formattedAmount}\n*Vencimento:* ${formattedDate}\n\n*Chave PIX Copia e Cola:*\n\`${pixCode}\`\n\nVocê também pode visualizar o QR Code e recibos no seu Portal do Assinante:\n${portalUrl}\n\nApós o pagamento, a baixa é processada automaticamente. Agradecemos pela parceria!`;

        const url = `https://wa.me/${clientPhone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener,noreferrer');

        toast({
            title: 'WhatsApp aberto!',
            description: 'Mensagem com dados do PIX preparada no WhatsApp Web.'
        });
    };

    const handleConfirmPaymentClick = async () => {
        if (!onConfirmPayment) return;
        setConfirming(true);
        try {
            await onConfirmPayment(activeInvoice.id);
            toast({
                title: 'Pagamento confirmado!',
                description: `Fatura ${activeInvoice.invoice_code} liquidada com sucesso.`
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setConfirming(false);
        }
    };

    const handleUndoPaymentClick = async () => {
        if (!onUndoPayment) return;
        setUndoing(true);
        try {
            await onUndoPayment(activeInvoice.id);
            toast({
                title: 'Baixa desfeita!',
                description: `Fatura ${activeInvoice.invoice_code} reaberta e ciclo da assinatura restaurado.`
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setUndoing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center sm:text-left">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <QrCode className="w-5 h-5 text-emerald-500" />
                            Fatura PIX & Pagamento
                        </DialogTitle>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusMeta.badgeClass}`}>
                            {statusMeta.label}
                        </span>
                    </div>
                    <DialogDescription className="flex items-center justify-between">
                        <span>
                            Fatura <strong>{activeInvoice.invoice_code}</strong> para {subscription.client_name || 'Cliente'}
                        </span>
                        {activeInvoice.status !== 'pago' && (
                            <button
                                type="button"
                                onClick={handleManualRegeneratePix}
                                disabled={loadingPix}
                                title="Sincronizar QR Code PIX"
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors p-1 rounded hover:bg-muted"
                            >
                                <RefreshCw className={`w-3 h-3 ${loadingPix ? 'animate-spin text-emerald-500' : ''}`} />
                            </button>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {/* Bloco de Valor e Vencimento */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
                        <div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Valor da Fatura
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {formatCurrencyBRL(activeInvoice.amount)}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-primary" /> Vencimento
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {formatDateBR(activeInvoice.due_date)}
                            </span>
                        </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-white dark:bg-zinc-950 min-h-[260px] relative">
                        {loadingPix ? (
                            <div className="w-52 h-52 flex flex-col items-center justify-center text-primary text-center p-4">
                                <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-500" />
                                <span className="text-xs font-semibold text-foreground">Gerando QR Code PIX oficial...</span>
                                <span className="text-[11px] text-muted-foreground mt-1">Conectando aos servidores de pagamento</span>
                            </div>
                        ) : qrImageBase64 ? (
                            <img
                                src={qrImageBase64.startsWith('data:') ? qrImageBase64 : `data:image/png;base64,${qrImageBase64}`}
                                alt="QR Code PIX para pagamento"
                                className="w-52 h-52 object-contain rounded-lg shadow-sm border border-border/40"
                            />
                        ) : pixCode ? (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixCode)}`}
                                alt="QR Code PIX"
                                className="w-52 h-52 object-contain rounded-lg shadow-sm"
                            />
                        ) : (
                            <div className="w-52 h-52 flex flex-col items-center justify-center text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
                                <QrCode className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-xs">QR Code não disponível para esta fatura</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={handleManualRegeneratePix}
                                    className="mt-3 text-xs gap-1.5"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Gerar Agora
                                </Button>
                            </div>
                        )}
                        <span className="text-xs text-muted-foreground mt-2 text-center">
                            Abra o aplicativo do banco e aponte a câmera para ler o QR Code
                        </span>
                    </div>

                    {/* Copia e Cola */}
                    {pixCode && (
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold text-muted-foreground">
                                Código PIX Copia e Cola:
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={pixCode}
                                    className="w-full text-xs font-mono p-2.5 rounded-lg border border-border bg-muted/30 text-foreground truncate select-all"
                                />
                                <Button
                                    type="button"
                                    onClick={handleCopyPix}
                                    variant="outline"
                                    className={`flex-shrink-0 transition-colors ${copied ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' : ''}`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 mr-1 text-emerald-600" />
                                            Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copiar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Botao Enviar no WhatsApp e Visualizar PDF */}
                    <div className="flex flex-col gap-2 pt-1">
                        {onOpenPdfModal && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onOpenPdfModal(activeInvoice);
                                }}
                                className="w-full border-primary/30 text-primary hover:bg-primary/10 font-semibold py-2.5 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <FileText className="w-4 h-4" />
                                Visualizar / Baixar Fatura em PDF
                            </Button>
                        )}

                        <Button
                            type="button"
                            onClick={handleSendWhatsapp}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Enviar PIX no WhatsApp
                        </Button>

                        {activeInvoice.status !== 'pago' && onConfirmPayment && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleConfirmPaymentClick}
                                disabled={confirming}
                                className="w-full border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 font-medium"
                            >
                                {confirming ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                )}
                                Confirmar Pagamento Manualmente
                            </Button>
                        )}

                        {activeInvoice.status === 'pago' && onUndoPayment && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleUndoPaymentClick}
                                disabled={undoing}
                                className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10 font-medium"
                            >
                                {undoing ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <RotateCcw className="w-4 h-4 mr-2 text-amber-500" />
                                )}
                                Desfazer Baixa (Reabrir Fatura)
                            </Button>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} className="w-full">
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InvoicePixModal;
