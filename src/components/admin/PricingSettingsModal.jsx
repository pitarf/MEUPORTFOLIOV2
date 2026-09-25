import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, DollarSign, Percent, ShieldCheck, HelpCircle, Save } from 'lucide-react';
import { fetchPricingSettings, updatePricingSettings } from '@/services/budgetService';

/**
 * Modal de Configuração de Precificação e Taxa de Hora-Homem (HH)
 * Permite ao profissional ajustar o valor base da sua hora técnica, margens e custos fixos.
 */
const PricingSettingsModal = ({ isOpen, onClose, onSaved }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        hourly_rate: 120,
        profit_margin_percent: 20,
        contingency_margin_percent: 15,
        fixed_costs_monthly: 0,
        min_project_value: 500,
        notes: ''
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
                        notes: settings.notes || ''
                    });
                }
            } catch (err) {
                console.error(err);
                toast({
                    variant: 'destructive',
                    title: 'Falha ao carregar configurações',
                    description: 'Não foi possível carregar suas configurações de precificação.'
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
                title: 'Configurações salvas!',
                description: `Valor da hora base fixado em R$ ${Number(formData.hourly_rate).toFixed(2)}/h.`
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
            <DialogContent className="max-w-lg bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <DollarSign className="text-emerald-500 w-5 h-5" />
                        Configurar Minha Precificação & Hora-Homem (HH)
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm">Carregando parâmetros comerciais...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
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

                        <DialogFooter className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={saving} className="gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Salvar Minha Taxa
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PricingSettingsModal;
