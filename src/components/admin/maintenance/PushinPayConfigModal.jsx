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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
    fetchPushinPaySettings,
    updatePushinPaySettings
} from '@/services/pushinPayService';
import { Loader2, CreditCard, ShieldCheck, Key, HelpCircle } from 'lucide-react';

/**
 * Modal de configuracoes do gateway PushinPay e cobrancas PIX.
 * Permite cadastrar o token Bearer, segredo de webhook, chave PIX e templates de aviso.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Estado de visibilidade
 * @param {Function} props.onClose Callback ao fechar
 */
const PushinPayConfigModal = ({ isOpen, onClose }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        pushinpay_token: '',
        pushinpay_webhook_token: '',
        default_pix_key: '',
        default_pix_key_type: 'chave_aleatoria',
        webhook_url: '',
        whatsapp_notification_template: ''
    });

    useEffect(() => {
        if (!isOpen) return;

        const loadSettings = async () => {
            setLoading(true);
            try {
                const data = await fetchPushinPaySettings();
                setSettings({
                    pushinpay_token: data.pushinpay_token || '',
                    pushinpay_webhook_token: data.pushinpay_webhook_token || '',
                    default_pix_key: data.default_pix_key || '',
                    default_pix_key_type: data.default_pix_key_type || 'chave_aleatoria',
                    webhook_url: data.webhook_url || '',
                    whatsapp_notification_template: data.whatsapp_notification_template || ''
                });
            } catch (err) {
                console.error('Erro ao buscar configuracoes da PushinPay:', err);
                toast({
                    variant: 'destructive',
                    title: 'Erro ao carregar configurações',
                    description: 'Não foi possível carregar as credenciais da PushinPay.'
                });
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [isOpen, toast]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updatePushinPaySettings({
                pushinpay_token: settings.pushinpay_token.trim(),
                pushinpay_webhook_token: settings.pushinpay_webhook_token.trim(),
                default_pix_key: settings.default_pix_key.trim(),
                default_pix_key_type: settings.default_pix_key_type,
                webhook_url: settings.webhook_url.trim(),
                whatsapp_notification_template: settings.whatsapp_notification_template.trim()
            });

            toast({
                title: 'Configurações salvas!',
                description: 'As credenciais da PushinPay e chave Pix foram atualizadas com sucesso.'
            });
            onClose();
        } catch (err) {
            console.error('Erro ao atualizar configuracoes:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar configurações',
                description: err.message || 'Falha ao gravar configurações no banco de dados.'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                        Configurações PushinPay & PIX
                    </DialogTitle>
                    <DialogDescription>
                        Credenciais da API Cash-In da PushinPay para geração automática de QR Codes PIX e recebimento direto.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm">Carregando configurações...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-5 pt-2">
                        {/* Token PushinPay */}
                        <div className="space-y-1.5">
                            <Label htmlFor="pushinpay_token" className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Key className="w-4 h-4 text-primary" />
                                    Token de Produção PushinPay (Bearer)
                                </span>
                            </Label>
                            <Input
                                id="pushinpay_token"
                                type="password"
                                placeholder="Insira seu token oficial da PushinPay..."
                                value={settings.pushinpay_token}
                                onChange={(e) => setSettings({ ...settings, pushinpay_token: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Caso este token esteja vazio, o sistema operará no modo de simulação e contingência PIX seguro.
                            </p>
                        </div>

                        {/* Token de Webhook */}
                        <div className="space-y-1.5">
                            <Label htmlFor="pushinpay_webhook_token" className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Token do Webhook (Segredo de Validação)
                            </Label>
                            <Input
                                id="pushinpay_webhook_token"
                                placeholder="whsec_..."
                                value={settings.pushinpay_webhook_token}
                                onChange={(e) => setSettings({ ...settings, pushinpay_webhook_token: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Token enviado na query string para autenticar os disparos de confirmação de pagamento.
                            </p>
                        </div>

                        {/* Chave PIX Padrão e Tipo */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label htmlFor="default_pix_key">Chave PIX Padrão (Fallback)</Label>
                                <Input
                                    id="default_pix_key"
                                    placeholder="ex: contato@rafaelpitaoficial.com.br"
                                    value={settings.default_pix_key}
                                    onChange={(e) => setSettings({ ...settings, default_pix_key: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="default_pix_key_type">Tipo de Chave</Label>
                                <Select
                                    value={settings.default_pix_key_type}
                                    onValueChange={(val) => setSettings({ ...settings, default_pix_key_type: val })}
                                >
                                    <SelectTrigger id="default_pix_key_type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="chave_aleatoria">Aleatória</SelectItem>
                                        <SelectItem value="email">E-mail</SelectItem>
                                        <SelectItem value="telefone">Telefone</SelectItem>
                                        <SelectItem value="cpf_cnpj">CPF/CNPJ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Webhook URL */}
                        <div className="space-y-1.5">
                            <Label htmlFor="webhook_url">URL de Notificação do Webhook</Label>
                            <Input
                                id="webhook_url"
                                placeholder="https://seudominio.com.br/api/pushinpay-webhook"
                                value={settings.webhook_url}
                                onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Endpoint HTTPS cadastrado no painel da PushinPay para receber os callbacks em tempo real.
                            </p>
                        </div>

                        {/* Template WhatsApp */}
                        <div className="space-y-1.5">
                            <Label htmlFor="whatsapp_template">Mensagem Padrão para Cobrança via WhatsApp</Label>
                            <Textarea
                                id="whatsapp_template"
                                rows={3}
                                placeholder="Olá {{cliente}}, sua fatura {{fatura}} no valor de R$ {{valor}} vence em {{vencimento}}. Link PIX: {{link_pix}}"
                                value={settings.whatsapp_notification_template}
                                onChange={(e) => setSettings({ ...settings, whatsapp_notification_template: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Variáveis disponíveis: {'{{cliente}}'}, {'{{fatura}}'}, {'{{valor}}'}, {'{{vencimento}}'}, {'{{link_pix}}'}.
                            </p>
                        </div>

                        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                                Os valores enviados para o Cash-In da PushinPay são convertidos estritamente em números inteiros de centavos para garantir total precisão contábil.
                            </span>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Salvar Configurações
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PushinPayConfigModal;
