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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { updateSubscriptionPrice } from '@/services/maintenanceService';
import {
    formatCurrencyBRL,
    formatDateBR,
    getCleanWhatsappNumber
} from '@/utils/maintenanceFormatters';
import { Loader2, TrendingUp, MessageCircle, DollarSign, Calendar } from 'lucide-react';

/**
 * Modal de edicao de valor da assinatura e programacao de reajuste futuro.
 * Inclui integracao em 1 clique para avisar o cliente via WhatsApp com texto formatado.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Visibilidade do modal
 * @param {Function} props.onClose Callback ao fechar
 * @param {Function} props.onSuccess Callback apos salvar
 * @param {Object|null} props.subscription Assinatura selecionada
 */
const PriceAdjustmentModal = ({
    isOpen,
    onClose,
    onSuccess,
    subscription = null
}) => {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    const [currentPrice, setCurrentPrice] = useState('');
    const [scheduleNextPrice, setScheduleNextPrice] = useState(false);
    const [nextPrice, setNextPrice] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');

    useEffect(() => {
        if (subscription) {
            setCurrentPrice(subscription.current_price !== undefined ? String(subscription.current_price) : '');
            if (subscription.next_price) {
                setScheduleNextPrice(true);
                setNextPrice(String(subscription.next_price));
                setEffectiveDate(subscription.next_price_effective_date || '');
            } else {
                setScheduleNextPrice(false);
                setNextPrice('');
                // Data sugerida: vencimento seguinte
                setEffectiveDate(subscription.next_due_date || '');
            }
        }
    }, [subscription, isOpen]);

    if (!subscription) return null;

    const handleSave = async (e) => {
        e.preventDefault();

        const numCurrent = Number(String(currentPrice).replace(',', '.'));
        if (isNaN(numCurrent) || numCurrent <= 0) {
            toast({
                variant: 'destructive',
                title: 'Valor inválido',
                description: 'Informe um valor mensal válido.'
            });
            return;
        }

        let numNext = null;
        let dateNext = null;

        if (scheduleNextPrice) {
            numNext = Number(String(nextPrice).replace(',', '.'));
            if (isNaN(numNext) || numNext <= 0) {
                toast({
                    variant: 'destructive',
                    title: 'Novo valor inválido',
                    description: 'Informe o novo valor programado para o reajuste.'
                });
                return;
            }
            if (!effectiveDate) {
                toast({
                    variant: 'destructive',
                    title: 'Data de vigência obrigatória',
                    description: 'Informe a data a partir da qual o novo valor entrará em vigor.'
                });
                return;
            }
            dateNext = effectiveDate;
        }

        setSaving(true);

        try {
            await updateSubscriptionPrice(subscription.id, {
                currentPrice: numCurrent,
                nextPrice: numNext,
                nextPriceEffectiveDate: dateNext
            });

            toast({
                title: 'Valores atualizados!',
                description: `O plano de ${subscription.client_name} foi reajustado com sucesso.`
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erro ao atualizar preco:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao atualizar',
                description: err.message || 'Falha ao gravar novo valor no banco.'
            });
        } finally {
            setSaving(false);
        }
    };

    /**
     * Monta o texto de aviso e abre o WhatsApp Web diretamente
     */
    const handleNotifyWhatsapp = () => {
        const clientPhone = getCleanWhatsappNumber(subscription.client_phone);
        if (!clientPhone) {
            toast({
                variant: 'destructive',
                title: 'WhatsApp não cadastrado',
                description: 'Esta assinatura não possui telefone ou WhatsApp válido cadastrado.'
            });
            return;
        }

        const clientFirstName = subscription.client_name.split(' ')[0] || 'Cliente';
        const planName = subscription.plan_title || 'Manutenção Contínua';

        let message = '';
        if (scheduleNextPrice && nextPrice) {
            const formattedNext = formatCurrencyBRL(nextPrice);
            const formattedDate = formatDateBR(effectiveDate);
            message = `Olá ${clientFirstName}, tudo bem? Passando para comunicar uma atualização na sua assinatura do plano ${planName}.\n\nA partir de ${formattedDate}, o valor mensal será reajustado para ${formattedNext}.\n\nSeguimos dedicados à máxima performance, estabilidade e segurança técnica dos seus serviços. Qualquer dúvida, estou à total disposição!`;
        } else {
            const formattedCurrent = formatCurrencyBRL(currentPrice);
            message = `Olá ${clientFirstName}, tudo bem? Confirmamos a atualização do valor da sua assinatura de manutenção (${planName}) para ${formattedCurrent}.\n\nCaso tenha qualquer dúvida ou necessite de algum alinhamento, estou à disposição!`;
        }

        const whatsappUrl = `https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        toast({
            title: 'WhatsApp aberto!',
            description: 'A mensagem de aviso foi montada e aberta no seu WhatsApp Web.'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        Reajuste de Valor & Cobrança
                    </DialogTitle>
                    <DialogDescription>
                        Cliente: <strong>{subscription.client_name}</strong> ({subscription.plan_title})
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-5 pt-2">
                    {/* Valor Atual */}
                    <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border border-border">
                        <Label htmlFor="currentPrice" className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            Valor Atual Vigente (R$)
                        </Label>
                        <Input
                            id="currentPrice"
                            type="number"
                            step="0.01"
                            min="1"
                            value={currentPrice}
                            onChange={(e) => setCurrentPrice(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Valor cobrado nas faturas atuais deste cliente.
                        </p>
                    </div>

                    {/* Programar Novo Preco Futuro */}
                    <div className="space-y-3 p-4 rounded-xl border border-border/80 bg-card">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold cursor-pointer" htmlFor="toggle_schedule">
                                    Programar Reajuste Futuro
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    O novo valor passará a ser cobrado automaticamente a partir da data de vigência.
                                </p>
                            </div>
                            <input
                                id="toggle_schedule"
                                type="checkbox"
                                checked={scheduleNextPrice}
                                onChange={(e) => setScheduleNextPrice(e.target.checked)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                            />
                        </div>

                        {scheduleNextPrice && (
                            <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="nextPrice">Novo Valor (R$)</Label>
                                    <Input
                                        id="nextPrice"
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        placeholder="Ex: 320.00"
                                        value={nextPrice}
                                        onChange={(e) => setNextPrice(e.target.value)}
                                        required={scheduleNextPrice}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="effectiveDate">Vigência a partir de</Label>
                                    <Input
                                        id="effectiveDate"
                                        type="date"
                                        value={effectiveDate}
                                        onChange={(e) => setEffectiveDate(e.target.value)}
                                        required={scheduleNextPrice}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botao de Aviso WhatsApp */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-xs text-emerald-800 dark:text-emerald-300">
                            <strong>1 Clique:</strong> Notifique o cliente com uma mensagem formal e educada.
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleNotifyWhatsapp}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Avisar no WhatsApp
                        </Button>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Fechar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Reajuste
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PriceAdjustmentModal;
