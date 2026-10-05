import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
    createSubscription,
    updateSubscription,
    calculateNextDueDate
} from '@/services/maintenanceService';
import { maskCpfCnpj, maskPhone, parseCoveredWebsites } from '@/utils/maintenanceFormatters';
import { Loader2, User, FileText, Calendar, DollarSign, Globe } from 'lucide-react';

/**
 * Modal de cadastro e edicao de assinaturas de manutencao.
 * Permite preenchimento completo de cliente, plano, ciclo e condicoes de cobranca.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Estado de visibilidade do modal
 * @param {Function} props.onClose Callback ao fechar
 * @param {Function} props.onSuccess Callback executado apos salvar com sucesso
 * @param {Object|null} props.subscription Assinatura em edicao ou null para nova
 * @param {Array} props.categories Lista de categorias de manutencao cadastradas
 */
const SubscriptionFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    subscription = null,
    categories = []
}) => {
    const { toast } = useToast();
    const isEditing = Boolean(subscription?.id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        client_name: '',
        client_document: '',
        client_email: '',
        client_phone: '',
        client_company: '',
        category_id: '',
        plan_title: '',
        plan_description: '',
        current_price: '',
        billing_day: 10,
        billing_cycle: 'mensal',
        status: 'ativo',
        next_due_date: '',
        covered_websites: '',
        notes: ''
    });

    useEffect(() => {
        if (subscription) {
            setFormData({
                client_name: subscription.client_name || '',
                client_document: maskCpfCnpj(subscription.client_document || ''),
                client_email: subscription.client_email || '',
                client_phone: maskPhone(subscription.client_phone || ''),
                client_company: subscription.client_company || '',
                category_id: subscription.category_id || (categories[0]?.id || ''),
                plan_title: subscription.plan_title || '',
                plan_description: subscription.plan_description || '',
                covered_websites: subscription.covered_websites || '',
                current_price: subscription.current_price !== undefined ? String(subscription.current_price) : '',
                billing_day: subscription.billing_day || 10,
                billing_cycle: subscription.billing_cycle || 'mensal',
                status: subscription.status || 'ativo',
                next_due_date: subscription.next_due_date || calculateNextDueDate(subscription.billing_day || 10),
                notes: subscription.notes || ''
            });
        } else {
            const defaultDay = 10;
            setFormData({
                client_name: '',
                client_document: '',
                client_email: '',
                client_phone: '',
                client_company: '',
                category_id: categories[0]?.id || '',
                plan_title: 'Manutenção Contínua & Suporte',
                plan_description: 'Atualizações de segurança, hospedagem, monitoramento preventivo e suporte técnico contínuo.',
                covered_websites: '',
                current_price: '250',
                billing_day: defaultDay,
                billing_cycle: 'mensal',
                status: 'ativo',
                next_due_date: calculateNextDueDate(defaultDay),
                notes: ''
            });
        }
    }, [subscription, categories, isOpen]);

    const handleBillingDayChange = (e) => {
        const dayVal = Math.min(Math.max(Number(e.target.value) || 1, 1), 31);
        const autoDueDate = calculateNextDueDate(dayVal);
        setFormData((prev) => ({
            ...prev,
            billing_day: dayVal,
            next_due_date: autoDueDate
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.client_email.trim()) {
            toast({
                variant: 'destructive',
                title: 'Campo obrigatório',
                description: 'Por favor, informe o e-mail do cliente.'
            });
            return;
        }

        const finalName = formData.client_name.trim() || formData.client_email.split('@')[0];

        if (!formData.plan_title.trim()) {
            toast({
                variant: 'destructive',
                title: 'Campo obrigatório',
                description: 'Por favor, informe o título do plano.'
            });
            return;
        }

        const priceNum = Number(String(formData.current_price).replace(',', '.'));
        if (isNaN(priceNum) || priceNum <= 0) {
            toast({
                variant: 'destructive',
                title: 'Valor inválido',
                description: 'Por favor, informe um valor mensal válido maior que zero.'
            });
            return;
        }

        setLoading(true);

        try {
            const payload = {
                client_name: finalName,
                client_document: formData.client_document,
                client_email: formData.client_email.trim().toLowerCase(),
                client_phone: formData.client_phone,
                client_company: formData.client_company.trim() || null,
                category_id: formData.category_id || null,
                plan_title: formData.plan_title.trim(),
                plan_description: formData.plan_description.trim() || null,
                covered_websites: formData.covered_websites.trim() || null,
                current_price: priceNum,
                billing_day: Number(formData.billing_day),
                billing_cycle: formData.billing_cycle,
                status: formData.status,
                next_due_date: formData.next_due_date,
                notes: formData.notes.trim() || null
            };

            if (isEditing) {
                await updateSubscription(subscription.id, payload);
                toast({
                    title: 'Assinatura atualizada!',
                    description: `Os dados de ${payload.client_name} foram salvos com sucesso.`
                });
            } else {
                await createSubscription(payload);
                toast({
                    title: 'Assinatura cadastrada!',
                    description: `A assinatura de ${payload.client_name} foi criada com sucesso.`
                });
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erro ao salvar assinatura:', err);
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar',
                description: err.message || 'Ocorreu uma falha ao persistir a assinatura no banco de dados.'
            });
        } finally {
            setLoading(false);
        }
    };

    const parsedWebsites = parseCoveredWebsites(formData.covered_websites);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <FileText className="w-5 h-5 text-primary" />
                        {isEditing ? 'Editar Assinatura de Manutenção' : 'Nova Assinatura de Manutenção'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Bloco 1: Dados do Cliente */}
                    <div className="space-y-4 border border-border/70 p-4 rounded-xl bg-muted/20">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <User className="w-4 h-4" />
                            <span>Dados do Cliente & Empresa</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="client_name">Nome Completo</Label>
                                <Input
                                    id="client_name"
                                    placeholder="Ex: João da Silva (ou preenchido pelo cliente)"
                                    value={formData.client_name}
                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="client_company">Empresa / Razão Social</Label>
                                <Input
                                    id="client_company"
                                    placeholder="Ex: Silva Advocacia & Associados"
                                    value={formData.client_company}
                                    onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="client_document">CPF ou CNPJ (Opcional)</Label>
                                <Input
                                    id="client_document"
                                    placeholder="000.000.000-00 (cliente pode informar no portal)"
                                    value={formData.client_document}
                                    onChange={(e) => setFormData({ ...formData, client_document: maskCpfCnpj(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="client_phone">WhatsApp / Telefone (Opcional)</Label>
                                <Input
                                    id="client_phone"
                                    placeholder="(11) 98765-4321"
                                    value={formData.client_phone}
                                    onChange={(e) => setFormData({ ...formData, client_phone: maskPhone(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="client_email">E-mail de Contato *</Label>
                                <Input
                                    id="client_email"
                                    type="email"
                                    placeholder="cliente@empresa.com.br"
                                    value={formData.client_email}
                                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bloco 2: Plano & Categoria */}
                    <div className="space-y-4 border border-border/70 p-4 rounded-xl bg-muted/20">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <FileText className="w-4 h-4" />
                            <span>Plano de Manutenção</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="plan_title">Título do Plano *</Label>
                                <Input
                                    id="plan_title"
                                    placeholder="Ex: Manutenção Web Pro"
                                    value={formData.plan_title}
                                    onChange={(e) => setFormData({ ...formData, plan_title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="category_id">Categoria de Serviço</Label>
                                <Select
                                    value={formData.category_id}
                                    onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                                >
                                    <SelectTrigger id="category_id">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label htmlFor="plan_description">Escopo e Descrição do Plano</Label>
                                <Textarea
                                    id="plan_description"
                                    rows={2}
                                    placeholder="Descreva as tarefas e coberturas inclusas nesta assinatura..."
                                    value={formData.plan_description}
                                    onChange={(e) => setFormData({ ...formData, plan_description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="covered_websites" className="flex items-center gap-1.5 font-bold text-foreground">
                                        <Globe className="w-3.5 h-3.5 text-primary" />
                                        Sites & Aplicações Cobertos pela Manutenção
                                    </Label>
                                    <span className="text-[11px] text-muted-foreground font-medium">
                                        Aparecerão nas faturas em PDF e no portal
                                    </span>
                                </div>
                                <Textarea
                                    id="covered_websites"
                                    rows={2}
                                    placeholder={"Informe os links ou domínios (um por linha ou separados por vírgula):\nEx: https://consultasbrasil.net\nhttps://painel.consultasbrasil.net"}
                                    value={formData.covered_websites}
                                    onChange={(e) => setFormData({ ...formData, covered_websites: e.target.value })}
                                    className="font-mono text-xs"
                                />
                                {parsedWebsites.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className="text-[11px] text-muted-foreground font-medium">Sites identificados:</span>
                                        {parsedWebsites.map((site, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-primary/10 text-primary border border-primary/20"
                                            >
                                                <Globe className="w-3 h-3" />
                                                {site}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Valores, Vencimentos e Ciclo */}
                    <div className="space-y-4 border border-border/70 p-4 rounded-xl bg-muted/20">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <DollarSign className="w-4 h-4" />
                            <span>Valores & Ciclo de Cobrança</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="current_price">Valor Mensal (R$) *</Label>
                                <Input
                                    id="current_price"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    placeholder="250.00"
                                    value={formData.current_price}
                                    onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="billing_day">Dia do Vencimento (1 a 31) *</Label>
                                <Input
                                    id="billing_day"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={formData.billing_day}
                                    onChange={handleBillingDayChange}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="billing_cycle">Ciclo de Faturamento</Label>
                                <Select
                                    value={formData.billing_cycle}
                                    onValueChange={(val) => setFormData({ ...formData, billing_cycle: val })}
                                >
                                    <SelectTrigger id="billing_cycle">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mensal">Mensal</SelectItem>
                                        <SelectItem value="trimestral">Trimestral</SelectItem>
                                        <SelectItem value="semestral">Semestral</SelectItem>
                                        <SelectItem value="anual">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status da Assinatura</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ativo">Ativo</SelectItem>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                        <SelectItem value="atrasado">Atrasado</SelectItem>
                                        <SelectItem value="pausado">Pausado</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="next_due_date">Próximo Vencimento (YYYY-MM-DD)</Label>
                                <Input
                                    id="next_due_date"
                                    type="date"
                                    value={formData.next_due_date}
                                    onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 md:col-span-3">
                                <Label htmlFor="notes">Anotações Internas (Privadas)</Label>
                                <Textarea
                                    id="notes"
                                    rows={2}
                                    placeholder="Observações administrativas, particularidades do cliente ou acordos verbais..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Assinatura'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriptionFormModal;
