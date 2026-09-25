import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, DollarSign, Percent, ShieldCheck, Building2, Save, FileText, QrCode } from 'lucide-react';
import { fetchPricingSettings, updatePricingSettings } from '@/services/budgetService';

/**
 * Modal de Configuração de Precificação (HH) e Dados Corporativos do Emissor
 * Permite ao profissional ajustar valores de hora técnica, CNPJ, dados de contato e termos para o PDF.
 */
const PricingSettingsModal = ({ isOpen, onClose, onSaved }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('precificacao');
    const [formData, setFormData] = useState({
        id: null,
        hourly_rate: 120,
        profit_margin_percent: 20,
        contingency_margin_percent: 15,
        fixed_costs_monthly: 0,
        min_project_value: 500,
        notes: '',
        company_name: 'Rafael Pita Solutions',
        company_trade_name: 'Rafael Pita',
        company_cnpj: '',
        company_cpf: '',
        company_email: 'contato@rafaelpitaoficial.com.br',
        company_phone: '(21) 96614-9077',
        company_address: 'Rio de Janeiro, RJ - Brasil',
        company_logo_url: '',
        company_website: 'https://rafaelpitaoficial.com.br',
        pix_key: '',
        pix_key_type: 'CNPJ',
        proposal_validity_days: 15,
        proposal_terms: '1. Esta proposta tem validade pelo período estipulado.\n2. O início dos trabalhos ocorre após a confirmação do sinal/primeira parcela.\n3. Alterações de escopo não previstas serão orçadas separadamente.\n4. Garantia técnica de 30 dias após a entrega final para suporte e ajustes.'
    });

    useEffect(() => {
        if (!isOpen) return;

        const loadSettings = async () => {
            setLoading(true);
            try {
                const settings = await fetchPricingSettings();
                if (settings) {
                    setFormData({
                        id: settings.id || null,
                        hourly_rate: settings.hourly_rate ?? 120,
                        profit_margin_percent: settings.profit_margin_percent ?? 20,
                        contingency_margin_percent: settings.contingency_margin_percent ?? 15,
                        fixed_costs_monthly: settings.fixed_costs_monthly ?? 0,
                        min_project_value: settings.min_project_value ?? 500,
                        notes: settings.notes || '',
                        company_name: settings.company_name || 'Rafael Pita Solutions',
                        company_trade_name: settings.company_trade_name || 'Rafael Pita',
                        company_cnpj: settings.company_cnpj || '',
                        company_cpf: settings.company_cpf || '',
                        company_email: settings.company_email || 'contato@rafaelpitaoficial.com.br',
                        company_phone: settings.company_phone || '(21) 96614-9077',
                        company_address: settings.company_address || 'Rio de Janeiro, RJ - Brasil',
                        company_logo_url: settings.company_logo_url || '',
                        company_website: settings.company_website || 'https://rafaelpitaoficial.com.br',
                        pix_key: settings.pix_key || '',
                        pix_key_type: settings.pix_key_type || 'CNPJ',
                        proposal_validity_days: settings.proposal_validity_days || 15,
                        proposal_terms: settings.proposal_terms || '1. Esta proposta tem validade pelo período estipulado.\n2. O início dos trabalhos ocorre após a confirmação do sinal/primeira parcela.\n3. Alterações de escopo não previstas serão orçadas separadamente.\n4. Garantia técnica de 30 dias após a entrega final para suporte e ajustes.'
                    });
                }
            } catch (err) {
                console.error(err);
                toast({
                    variant: 'destructive',
                    title: 'Falha ao carregar configurações',
                    description: 'Não foi possível carregar suas configurações comerciais.'
                });
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [isOpen, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await updatePricingSettings(formData);
            toast({
                title: 'Configurações salvas com sucesso!',
                description: 'Taxa de HH e dados da empresa atualizados para a emissão de PDF.'
            });
            if (onSaved) onSaved(updated);
            onClose();
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar',
                description: err.message || 'Verifique sua conexão e tente novamente.'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground p-0">
                <DialogHeader className="p-6 pb-2 border-b border-border bg-muted/20">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Building2 className="text-primary w-5 h-5" />
                        Configurações Comerciais & Dados para PDF
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm">Carregando parâmetros comerciais...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="px-6 pt-3 border-b border-border bg-background">
                                <TabsList className="grid grid-cols-2 w-full">
                                    <TabsTrigger value="precificacao" className="text-xs py-2 gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                        1. Hora-Homem & Margens
                                    </TabsTrigger>
                                    <TabsTrigger value="empresa" className="text-xs py-2 gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-primary" />
                                        2. Minha Empresa & PDF (CNPJ/PIX)
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* ABA 1: PRECIFICACAO */}
                                <TabsContent value="precificacao" className="m-0 space-y-4">
                                    {/* Valor da Hora */}
                                    <div className="space-y-1.5 p-3 rounded-lg border border-border bg-muted/40">
                                        <Label htmlFor="hourly_rate" className="text-sm font-semibold flex items-center justify-between">
                                            <span>Valor da Sua Hora de Trabalho (R$/h)</span>
                                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">Base de Cálculo</span>
                                        </Label>
                                        <div className="relative mt-1">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">R$</span>
                                            <Input
                                                id="hourly_rate"
                                                type="number"
                                                step="0.01"
                                                min="10"
                                                className="pl-10 text-base font-semibold"
                                                value={formData.hourly_rate}
                                                onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Quanto você deseja ganhar por hora dedicada ao projeto. Usado pelo estimador de IA.
                                        </p>
                                    </div>

                                    {/* Margens de Lucro e Contingência */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5 p-3 rounded-lg border border-border bg-muted/20">
                                            <Label htmlFor="profit_margin_percent" className="text-xs font-semibold flex items-center gap-1">
                                                <Percent className="w-3.5 h-3.5 text-blue-500" />
                                                Margem de Lucro (%)
                                            </Label>
                                            <Input
                                                id="profit_margin_percent"
                                                type="number"
                                                step="1"
                                                min="0"
                                                max="200"
                                                value={formData.profit_margin_percent}
                                                onChange={(e) => setFormData({ ...formData, profit_margin_percent: parseFloat(e.target.value) || 0 })}
                                                className="font-mono text-sm"
                                                required
                                            />
                                            <p className="text-[11px] text-muted-foreground">Lucro líquido da sua empresa.</p>
                                        </div>

                                        <div className="space-y-1.5 p-3 rounded-lg border border-border bg-muted/20">
                                            <Label htmlFor="contingency_margin_percent" className="text-xs font-semibold flex items-center gap-1">
                                                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                                                Reserva Técnica (%)
                                            </Label>
                                            <Input
                                                id="contingency_margin_percent"
                                                type="number"
                                                step="1"
                                                min="0"
                                                max="100"
                                                value={formData.contingency_margin_percent}
                                                onChange={(e) => setFormData({ ...formData, contingency_margin_percent: parseFloat(e.target.value) || 0 })}
                                                className="font-mono text-sm"
                                                required
                                            />
                                            <p className="text-[11px] text-muted-foreground">Proteção contra retrabalho e ajustes.</p>
                                        </div>
                                    </div>

                                    {/* Piso Mínimo de Projeto */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="min_project_value" className="text-xs font-semibold">
                                            Valor Mínimo de Entrada para Qualquer Projeto (R$)
                                        </Label>
                                        <Input
                                            id="min_project_value"
                                            type="number"
                                            step="10"
                                            min="0"
                                            value={formData.min_project_value}
                                            onChange={(e) => setFormData({ ...formData, min_project_value: parseFloat(e.target.value) || 0 })}
                                            className="font-mono text-sm"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Evita fechar contratos pequenos que não cobrem os custos de atendimento e onboarding.
                                        </p>
                                    </div>

                                    {/* Observações Internas */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="notes" className="text-xs font-semibold">
                                            Notas e Metas Estratégicas Pessoais
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            rows={2}
                                            placeholder="Ex: Meta de faturamento mensal: R$ 15.000. Foco em clientes corporativos no RJ."
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="text-xs"
                                        />
                                    </div>
                                </TabsContent>

                                {/* ABA 2: DADOS DA EMPRESA & PDF */}
                                <TabsContent value="empresa" className="m-0 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Razão Social / Nome da Empresa *</Label>
                                            <Input
                                                placeholder="Ex: Rafael Pita Solutions"
                                                value={formData.company_name}
                                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Nome Fantasia / Titular</Label>
                                            <Input
                                                placeholder="Ex: Rafael Pita"
                                                value={formData.company_trade_name}
                                                onChange={(e) => setFormData({ ...formData, company_trade_name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">CNPJ (Exibido no Cabeçalho do PDF)</Label>
                                            <Input
                                                placeholder="00.000.000/0001-00"
                                                value={formData.company_cnpj}
                                                onChange={(e) => setFormData({ ...formData, company_cnpj: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">CPF (Opcional se Pessoa Física)</Label>
                                            <Input
                                                placeholder="000.000.000-00"
                                                value={formData.company_cpf}
                                                onChange={(e) => setFormData({ ...formData, company_cpf: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">E-mail Comercial</Label>
                                            <Input
                                                type="email"
                                                placeholder="contato@rafaelpitaoficial.com.br"
                                                value={formData.company_email}
                                                onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">WhatsApp / Telefone</Label>
                                            <Input
                                                placeholder="(21) 96614-9077"
                                                value={formData.company_phone}
                                                onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Endereço / Localização</Label>
                                            <Input
                                                placeholder="Rio de Janeiro, RJ - Brasil"
                                                value={formData.company_address}
                                                onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Site Oficial</Label>
                                            <Input
                                                placeholder="https://rafaelpitaoficial.com.br"
                                                value={formData.company_website}
                                                onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Chave PIX e Validade */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg border border-border bg-emerald-500/5">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                Tipo de Chave
                                            </Label>
                                            <Select
                                                value={formData.pix_key_type || 'CNPJ'}
                                                onValueChange={(val) => setFormData({ ...formData, pix_key_type: val })}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                                                    <SelectItem value="CPF">CPF</SelectItem>
                                                    <SelectItem value="E-mail">E-mail</SelectItem>
                                                    <SelectItem value="Telefone">Celular / Telefone</SelectItem>
                                                    <SelectItem value="Aleatória">Chave Aleatória</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <Label className="text-xs font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                <QrCode className="w-3.5 h-3.5" />
                                                Chave PIX para Recebimento
                                            </Label>
                                            <Input
                                                placeholder="Ex: 45.123.456/0001-89 ou contato@empresa.com"
                                                value={formData.pix_key}
                                                onChange={(e) => setFormData({ ...formData, pix_key: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Validade Padrão da Proposta (Dias)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="90"
                                                value={formData.proposal_validity_days}
                                                onChange={(e) => setFormData({ ...formData, proposal_validity_days: parseInt(e.target.value, 10) || 15 })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Logotipo da Empresa no PDF (URL)</Label>
                                            <Input
                                                placeholder="/logo.png ou URL da imagem"
                                                value={formData.company_logo_url}
                                                onChange={(e) => setFormData({ ...formData, company_logo_url: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Termos & Condições Padrão do PDF */}
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">Termos e Condições Padrão do Orçamento</Label>
                                        <Textarea
                                            rows={3}
                                            value={formData.proposal_terms}
                                            onChange={(e) => setFormData({ ...formData, proposal_terms: e.target.value })}
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>

                        <DialogFooter className="p-6 pt-2 border-t border-border flex justify-end gap-2 bg-muted/20">
                            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={saving} className="gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Salvar Configurações
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PricingSettingsModal;
