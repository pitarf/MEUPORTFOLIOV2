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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
    fetchPushinPaySettings,
    updatePushinPaySettings
} from '@/services/pushinPayService';
import {
    fetchAsaasSettings,
    updateAsaasSettings,
    getAccountBalance
} from '@/services/asaasService';
import {
    Loader2,
    CreditCard,
    ShieldCheck,
    Key,
    HelpCircle,
    Zap,
    CheckCircle2,
    Globe,
    Server
} from 'lucide-react';

/**
 * Modal executivo de configuracoes de gateways de pagamento (PushinPay e Asaas v3).
 * Permite cadastrar credenciais, ambiente Sandbox/Producao, chave PIX e definir gateway ativo.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Estado de visibilidade
 * @param {Function} props.onClose Callback ao fechar
 */
const PushinPayConfigModal = ({ isOpen, onClose }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testingAsaas, setTestingAsaas] = useState(false);
    const [asaasStatusInfo, setAsaasStatusInfo] = useState(null);

    const [settings, setSettings] = useState({
        active_gateway: 'pushinpay',
        // PushinPay
        pushinpay_token: '',
        pushinpay_webhook_token: '',
        default_pix_key: '',
        default_pix_key_type: 'chave_aleatoria',
        webhook_url: '',
        whatsapp_notification_template: '',
        // Asaas
        asaas_token: '',
        asaas_environment: 'sandbox'
    });

    useEffect(() => {
        if (!isOpen) return;

        const loadSettings = async () => {
            setLoading(true);
            setAsaasStatusInfo(null);
            try {
                const pushinData = await fetchPushinPaySettings();
                const asaasData = await fetchAsaasSettings();

                setSettings({
                    active_gateway: asaasData.active_gateway || 'pushinpay',
                    pushinpay_token: pushinData.pushinpay_token || '',
                    pushinpay_webhook_token: pushinData.pushinpay_webhook_token || '',
                    default_pix_key: pushinData.default_pix_key || '',
                    default_pix_key_type: pushinData.default_pix_key_type || 'chave_aleatoria',
                    webhook_url: pushinData.webhook_url || '',
                    whatsapp_notification_template: pushinData.whatsapp_notification_template || '',
                    asaas_token: asaasData.asaas_token || '',
                    asaas_environment: asaasData.asaas_environment || 'sandbox'
                });
            } catch (err) {
                console.error('Erro ao buscar configuracoes de gateways:', err);
                toast({
                    variant: 'destructive',
                    title: 'Erro ao carregar configurações',
                    description: 'Não foi possível carregar as credenciais dos gateways de pagamento.'
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
            // Salva PushinPay
            await updatePushinPaySettings({
                pushinpay_token: settings.pushinpay_token.trim(),
                pushinpay_webhook_token: settings.pushinpay_webhook_token.trim(),
                default_pix_key: settings.default_pix_key.trim(),
                default_pix_key_type: settings.default_pix_key_type,
                webhook_url: settings.webhook_url.trim(),
                whatsapp_notification_template: settings.whatsapp_notification_template.trim()
            });

            // Salva Asaas e Gateway Ativo
            await updateAsaasSettings({
                asaas_token: settings.asaas_token.trim(),
                asaas_environment: settings.asaas_environment,
                active_gateway: settings.active_gateway
            });

            toast({
                title: 'Configurações salvas!',
                description: 'As credenciais do Asaas e PushinPay foram atualizadas com sucesso no banco de dados.'
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

    const handleTestAsaasConnection = async () => {
        setTestingAsaas(true);
        setAsaasStatusInfo(null);
        try {
            const balanceData = await getAccountBalance();
            setAsaasStatusInfo({
                success: true,
                message: `Conexão bem-sucedida! Saldo disponível na conta Asaas: R$ ${Number(balanceData?.balance || 0).toFixed(2).replace('.', ',')}`
            });
            toast({
                title: 'Conexão Asaas Validada!',
                description: `API respondeu com sucesso. Ambiente: ${settings.asaas_environment.toUpperCase()}.`
            });
        } catch (err) {
            console.error('Falha ao testar conexao com Asaas:', err);
            setAsaasStatusInfo({
                success: false,
                message: err.message || 'Falha na comunicação com o Asaas.'
            });
            toast({
                variant: 'destructive',
                title: 'Falha na Conexão com Asaas',
                description: err.message || 'Verifique se o token de acesso e o ambiente estão corretos.'
            });
        } finally {
            setTestingAsaas(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                        Gateways de Pagamento (Asaas & PushinPay)
                    </DialogTitle>
                    <DialogDescription>
                        Configure as credenciais da API do Asaas v3 e PushinPay para geração de faturas PIX e assinaturas.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm">Carregando configurações de pagamento...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6 pt-2">
                        {/* Seletor de Gateway Ativo */}
                        <div className="p-4 rounded-xl border bg-muted/30 space-y-2">
                            <Label htmlFor="active_gateway" className="text-sm font-semibold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                Gateway Ativo Padrão para Novas Faturas
                            </Label>
                            <Select
                                value={settings.active_gateway}
                                onValueChange={(val) => setSettings({ ...settings, active_gateway: val })}
                            >
                                <SelectTrigger id="active_gateway" className="font-medium bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asaas">Asaas v3 (PIX Oficial, Boleto e Gestão Completa)</SelectItem>
                                    <SelectItem value="pushinpay">PushinPay (PIX Direto Cash-In)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Define qual provedor processará automaticamente a emissão dos QR Codes PIX no painel e na área do cliente.
                            </p>
                        </div>

                        {/* Abas para cada Gateway */}
                        <Tabs defaultValue={settings.active_gateway === 'asaas' ? 'asaas' : 'asaas'} className="w-full">
                            <TabsList className="grid grid-cols-2 w-full">
                                <TabsTrigger value="asaas" className="flex items-center gap-2">
                                    <Server className="w-4 h-4 text-primary" />
                                    Asaas (API v3)
                                </TabsTrigger>
                                <TabsTrigger value="pushinpay" className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-500" />
                                    PushinPay (Cash-In)
                                </TabsTrigger>
                            </TabsList>

                            {/* ABA ASAAS */}
                            <TabsContent value="asaas" className="space-y-4 pt-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="asaas_environment" className="flex items-center gap-1.5">
                                        <Globe className="w-4 h-4 text-primary" />
                                        Ambiente da API Asaas
                                    </Label>
                                    <Select
                                        value={settings.asaas_environment}
                                        onValueChange={(val) => setSettings({ ...settings, asaas_environment: val })}
                                    >
                                        <SelectTrigger id="asaas_environment" className="bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sandbox">Sandbox: Homologação e Testes (https://sandbox.asaas.com/api/v3)</SelectItem>
                                            <SelectItem value="production">Produção Oficial (https://api.asaas.com/v3)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        No modo Sandbox, cobranças são geradas para teste sem débito real.
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="asaas_token" className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Key className="w-4 h-4 text-primary" />
                                            Token de Acesso Asaas (API Key / access_token)
                                        </span>
                                    </Label>
                                    <Input
                                        id="asaas_token"
                                        type="password"
                                        placeholder="$aact_YTU5YTE0M2M6N2Zl..."
                                        value={settings.asaas_token}
                                        onChange={(e) => setSettings({ ...settings, asaas_token: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Chave gerada no menu Integrações / Chaves de API do painel Asaas.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleTestAsaasConnection}
                                        disabled={testingAsaas}
                                        className="gap-2"
                                    >
                                        {testingAsaas ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        )}
                                        Testar Conexão com Asaas
                                    </Button>

                                    {asaasStatusInfo && (
                                        <span className={`text-xs font-medium ${asaasStatusInfo.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                            {asaasStatusInfo.message}
                                        </span>
                                    )}
                                </div>

                                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-primary dark:text-primary-foreground/80 flex items-start gap-2">
                                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>
                                        O serviço Asaas gerencia clientes automaticamente por CPF/CNPJ ou e-mail, gera o QR Code PIX oficial com prazo de expiração e sincroniza o link de pagamento da fatura.
                                    </span>
                                </div>
                            </TabsContent>

                            {/* ABA PUSHINPAY */}
                            <TabsContent value="pushinpay" className="space-y-4 pt-3">
                                {/* Token PushinPay */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="pushinpay_token" className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <Key className="w-4 h-4 text-emerald-500" />
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
                                </div>
                            </TabsContent>
                        </Tabs>

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
