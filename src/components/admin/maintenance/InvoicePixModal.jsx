import React, { useState } from 'react';
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
    Loader2
} from 'lucide-react';
import { generatePortalUrl } from '@/utils/whatsappMessages';

/**
 * Modal para exibicao e compartilhamento do QR Code PIX e chave Copia e Cola.
 * Possui botao de 1 clique para envio ao WhatsApp e feedback de copia para a area de transferencia.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Visibilidade do modal
 * @param {Function} props.onClose Callback ao fechar
 * @param {Object|null} props.invoice Dados da fatura gerada
 * @param {Function} [props.onConfirmPayment] Callback opcional para liquidar na tela
 */
const InvoicePixModal = ({
    isOpen,
    onClose,
    invoice = null,
    onConfirmPayment = null
}) => {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);

    if (!invoice) return null;

    const subscription = invoice.subscription || {};
    const pixCode = invoice.pix_qr_code || '';
    const qrImageBase64 = invoice.pix_qr_code_base64;
    const statusMeta = getInvoiceStatusMeta(invoice.status);

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
        const formattedAmount = formatCurrencyBRL(invoice.amount);
        const formattedDate = formatDateBR(invoice.due_date);
        const invoiceCode = invoice.invoice_code || 'FAT-PIX';

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
            await onConfirmPayment(invoice.id);
            toast({
                title: 'Pagamento confirmado!',
                description: `Fatura ${invoice.invoice_code} liquidada com sucesso.`
            });
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setConfirming(false);
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
                    <DialogDescription>
                        Fatura <strong>{invoice.invoice_code}</strong> para {subscription.client_name || 'Cliente'}
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
                                {formatCurrencyBRL(invoice.amount)}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-primary" /> Vencimento
                            </span>
                            <span className="text-lg font-bold text-foreground">
                                {formatDateBR(invoice.due_date)}
                            </span>
                        </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/80 bg-white dark:bg-zinc-950">
                        {qrImageBase64 ? (
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

                    {/* Botao Enviar no WhatsApp */}
                    <div className="flex flex-col gap-2 pt-1">
                        <Button
                            type="button"
                            onClick={handleSendWhatsapp}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Enviar PIX no WhatsApp
                        </Button>

                        {invoice.status !== 'pago' && onConfirmPayment && (
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
