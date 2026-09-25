import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
    Loader2,
    Sparkles,
    Send,
    Copy,
    Check,
    Briefcase,
    Clock,
    DollarSign,
    ShieldAlert,
    ExternalLink,
    Image as ImageIcon,
    Plus,
    Trash2,
    CheckCircle2,
    Share2,
    MessageCircle,
    SlidersHorizontal,
    UploadCloud,
    FileText
} from 'lucide-react';
import { estimateBudgetScopeWithAI, generateSalesPitchWithAI } from '@/lib/gemini';
import { createBudget, updateBudget, convertBudgetToPortfolioProject, fetchPricingSettings } from '@/services/budgetService';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import BudgetPdfModal from '@/components/admin/BudgetPdfModal';

/**
 * Converte com segurança saídas monetárias de IA (string formatada ou número) em float
 * Ex: "R$ 450,00" -> 450, "1.200,50" -> 1200.5, 750 -> 750
 */
export const parseAiNumber = (val, fallback = 0) => {
    if (typeof val === 'number') return isNaN(val) ? fallback : val;
    if (typeof val === 'string') {
        const cleaned = val.replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
};

/**
 * Modal Completo de Gestão de Orçamentos, Precificação por HH, Copiloto IA de Vendas e Conversão para Portfólio
 */
const BudgetModal = ({
    isOpen,
    onClose,
    budget,
    categories = [],
    onSaved
}) => {
    const { toast } = useToast();
    const isEditing = Boolean(budget?.id);

    // Estados do Formulário
    const [activeTab, setActiveTab] = useState('escopo');
    const [saving, setSaving] = useState(false);
    const [aiScopeLoading, setAiScopeLoading] = useState(false);
    const [aiPitchLoading, setAiPitchLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [convertingPortfolio, setConvertingPortfolio] = useState(false);
    const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [aiScenarios, setAiScenarios] = useState(null);

    // Parâmetros de Precificação Base
    const [pricingBase, setPricingBase] = useState({
        hourly_rate: 120,
        profit_margin_percent: 20,
        contingency_margin_percent: 15
    });

    const [formData, setFormData] = useState({
        title: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        client_company: '',
        client_document: '',
        client_address: '',
        budget_code: '',
        category_id: '',
        scope_description: '',
        deliverables: [],
        estimated_hours: 0,
        hourly_rate_used: 120,
        subtotal: 0,
        profit_margin_percent: 20,
        discount_percent: 0,
        final_price: 0,
        payment_terms: '50% de entrada + 50% na entrega',
        deadline_days: 15,
        status: 'pendente',
        notes: '',
        ai_sales_pitch: '',
        ai_objections_handling: [],
        project_id: null,
        project_url: '',
        main_image_url: '',
        gallery_urls: []
    });

    // Carrega dados do orçamento e parâmetros de precificação
    useEffect(() => {
        if (!isOpen) return;

        const initModal = async () => {
            try {
                const settings = await fetchPricingSettings();
                if (settings) {
                    setPricingBase(settings);
                }

                if (budget) {
                    if (budget.ai_scope_analysis && typeof budget.ai_scope_analysis === 'object') {
                        setAiScenarios(budget.ai_scope_analysis.scenarios || budget.ai_scope_analysis);
                    } else {
                        setAiScenarios(null);
                    }

                    setFormData({
                        ...budget,
                        client_document: budget.client_document || '',
                        client_address: budget.client_address || '',
                        budget_code: budget.budget_code || '',
                        category_id: budget.category_id ? String(budget.category_id) : '',
                        deliverables: Array.isArray(budget.deliverables) ? budget.deliverables : [],
                        ai_objections_handling: Array.isArray(budget.ai_objections_handling) ? budget.ai_objections_handling : [],
                        gallery_urls: Array.isArray(budget.gallery_urls) ? budget.gallery_urls : []
                    });
                } else {
                    // Novo Orçamento
                    setAiScenarios(null);
                    setFormData({
                        title: '',
                        client_name: '',
                        client_email: '',
                        client_phone: '',
                        client_company: '',
                        client_document: '',
                        client_address: '',
                        budget_code: '',
                        category_id: categories.length > 0 ? String(categories[0].id) : '',
                        scope_description: '',
                        deliverables: [],
                        estimated_hours: 0,
                        hourly_rate_used: settings?.hourly_rate || 120,
                        subtotal: 0,
                        profit_margin_percent: settings?.profit_margin_percent || 20,
                        discount_percent: 0,
                        final_price: 0,
                        payment_terms: '50% de entrada + 50% na aprovação final',
                        deadline_days: 15,
                        status: 'pendente',
                        notes: '',
                        ai_sales_pitch: '',
                        ai_objections_handling: [],
                        project_id: null,
                        project_url: '',
                        main_image_url: '',
                        gallery_urls: []
                    });
                }
            } catch (err) {
                console.error('Erro ao inicializar dados do modal:', err);
            }
        };

        initModal();
    }, [isOpen, budget, categories]);

    // Recalcular totais sempre que horas, valor hora ou margens forem alterados manualmente
    const recalculateTotals = (hours, rate, margin, discount) => {
        const h = parseFloat(hours) || 0;
        const r = parseFloat(rate) || 0;
        const m = parseFloat(margin) || 0;
        const d = parseFloat(discount) || 0;

        const sub = h * r;
        const withMargin = sub * (1 + m / 100);
        const final = withMargin * (1 - d / 100);

        setFormData(prev => ({
            ...prev,
            estimated_hours: h,
            hourly_rate_used: r,
            profit_margin_percent: m,
            discount_percent: d,
            subtotal: parseFloat(sub.toFixed(2)),
            final_price: parseFloat(final.toFixed(2))
        }));
    };

    // Copiloto 1: Estimar Escopo e Horas com IA Gemini
    const handleEstimateScopeWithAI = async () => {
        if (!formData.scope_description.trim()) {
            toast({
                variant: 'destructive',
                title: 'Descreva a necessidade',
                description: 'Preencha o campo de briefing com o que o cliente pediu para a IA poder analisar.'
            });
            return;
        }

        setAiScopeLoading(true);
        try {
            const selectedCat = categories.find(c => String(c.id) === String(formData.category_id));
            const categoryTitle = selectedCat?.title || 'Tecnologia e Soluções Digitais';

            const result = await estimateBudgetScopeWithAI({
                description: formData.scope_description,
                categoryTitle,
                hourlyRate: formData.hourly_rate_used || pricingBase.hourly_rate,
                profitMargin: formData.profit_margin_percent || pricingBase.profit_margin_percent,
                contingencyMargin: pricingBase.contingency_margin_percent || 15
            });

            const totalH = parseAiNumber(result.totalHours || result.estimatedHours, 10);
            const deliverables = Array.isArray(result.deliverables) ? result.deliverables : [];
            const suggestedFinal = parseAiNumber(result.suggestedPrice, totalH * (formData.hourly_rate_used || 120));
            const minFinal = parseAiNumber(result.minPrice, suggestedFinal * 0.85);
            const premiumFinal = parseAiNumber(result.premiumPrice, suggestedFinal * 1.35);
            const recDeadline = parseInt(result.recommendedDeadlineDays, 10) || formData.deadline_days || 15;

            const scenariosData = {
                minPrice: minFinal,
                suggestedPrice: suggestedFinal,
                premiumPrice: premiumFinal,
                level: result.level || 2,
                complexity: result.complexity || 'Média',
                recommendedDeadlineDays: recDeadline
            };
            setAiScenarios(scenariosData);

            setFormData(prev => ({
                ...prev,
                title: prev.title || `Projeto: ${categoryTitle} - ${prev.client_name || 'Novo Cliente'}`,
                deliverables,
                estimated_hours: totalH,
                deadline_days: recDeadline,
                subtotal: parseFloat((totalH * prev.hourly_rate_used).toFixed(2)),
                final_price: parseFloat(Number(suggestedFinal).toFixed(2)),
                notes: prev.notes
                    ? `${prev.notes}\n\n[IA Recomendações]: ${result.technicalNotes || ''}`
                    : `[IA Complexidade: ${result.complexity || 'Média'}]\n${result.technicalNotes || ''}`
            }));

            toast({
                title: 'Escopo calculado pela IA!',
                description: `${deliverables.length} etapas decompostas. Total sugerido: R$ ${Number(suggestedFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
            });
            setActiveTab('precificacao');
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Falha na análise da IA',
                description: err.message || 'Não foi possível decompor o escopo automaticamente.'
            });
        } finally {
            setAiScopeLoading(false);
        }
    };

    // Aplica diretamente um dos cenários da IA (Piso, Recomendado ou Premium)
    const handleApplyPricingScenario = (price, label) => {
        const val = parseAiNumber(price, 0);
        setFormData(prev => ({
            ...prev,
            final_price: parseFloat(val.toFixed(2))
        }));
        toast({
            title: `Cenário ${label} aplicado!`,
            description: `Valor final ajustado para R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`
        });
    };

    // Copiloto 2: Gerar Proposta Comercial Persuasiva e Quebra de Objeções
    const handleGenerateSalesPitchWithAI = async () => {
        if (!formData.title || !formData.final_price) {
            toast({
                variant: 'destructive',
                title: 'Defina título e preço',
                description: 'Preencha o título do projeto e o valor final antes de gerar a proposta comercial.'
            });
            return;
        }

        setAiPitchLoading(true);
        try {
            const pitch = await generateSalesPitchWithAI({
                title: formData.title,
                clientName: formData.client_name || 'Prezado(a)',
                clientCompany: formData.client_company,
                deliverables: formData.deliverables,
                finalPrice: formData.final_price,
                deadlineDays: formData.deadline_days,
                paymentTerms: formData.payment_terms
            });

            setFormData(prev => ({
                ...prev,
                ai_sales_pitch: pitch.whatsappMessage || '',
                ai_objections_handling: pitch.objections || []
            }));

            toast({
                title: 'Proposta comercial gerada!',
                description: 'Copy persuasiva pronta para envio no WhatsApp e scripts de negociação disponíveis.'
            });
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Erro ao gerar proposta',
                description: err.message || 'Verifique sua conexão e tente novamente.'
            });
        } finally {
            setAiPitchLoading(false);
        }
    };

    // Copiar mensagem para a área de transferência
    const handleCopyWhatsApp = () => {
        if (!formData.ai_sales_pitch) return;
        navigator.clipboard.writeText(formData.ai_sales_pitch);
        setCopiedWhatsApp(true);
        toast({ title: 'Texto copiado!', description: 'Cole diretamente na conversa com o cliente no WhatsApp.' });
        setTimeout(() => setCopiedWhatsApp(false), 2500);
    };

    // Abrir conversa diretamente no WhatsApp do cliente
    const handleOpenWhatsApp = () => {
        const cleanPhone = formData.client_phone ? formData.client_phone.replace(/\D/g, '') : '';
        if (!cleanPhone || cleanPhone.length < 8) {
            toast({
                variant: 'destructive',
                title: 'WhatsApp inválido',
                description: 'Informe um número de telefone com DDD válido nos dados de contato.'
            });
            return;
        }
        const phoneWithCountry = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
        const encodedText = encodeURIComponent(formData.ai_sales_pitch || `Olá ${formData.client_name}, segue nossa proposta comercial.`);
        window.open(`https://wa.me/${phoneWithCountry}?text=${encodedText}`, '_blank');
    };

    // Upload de Imagem de Destaque com Otimização WebP
    const handleUploadMainImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const webpFile = await optimizeAndConvertToWebP(file, { maxWidthOrHeight: 1920, quality: 0.85 });
            const storagePath = `budgets/${Date.now()}-${webpFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const fileRef = ref(storage, storagePath);
            await uploadBytes(fileRef, webpFile);
            const downloadUrl = await getDownloadURL(fileRef);

            setFormData(prev => ({
                ...prev,
                main_image_url: downloadUrl
            }));

            toast({ title: 'Imagem enviada com sucesso!', description: 'Convertida em WebP e pronta para o portfólio.' });
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Erro no upload', description: 'Não foi possível enviar a imagem.' });
        } finally {
            setUploadingImage(false);
        }
    };

    // Conversão Direta em Projeto do Portfólio Público
    const handleConvertToPortfolio = async () => {
        if (!isEditing && !budget?.id && !formData.id) {
            toast({
                variant: 'destructive',
                title: 'Salve o orçamento primeiro',
                description: 'É necessário salvar o orçamento no pipeline antes de publicá-lo no portfólio para evitar projetos desvinculados.'
            });
            return;
        }

        if (!formData.title || !formData.category_id) {
            toast({
                variant: 'destructive',
                title: 'Dados insuficientes',
                description: 'O orçamento precisa ter título e categoria definidos.'
            });
            return;
        }

        setConvertingPortfolio(true);
        try {
            const result = await convertBudgetToPortfolioProject({
                budget: {
                    ...formData,
                    id: budget?.id || formData.id,
                    category_id: parseInt(formData.category_id, 10)
                }
            });

            setFormData(prev => ({
                ...prev,
                project_id: result.project.id,
                status: 'concluido'
            }));

            toast({
                title: '🎉 Publicado no Portfólio com Sucesso!',
                description: `O projeto "${result.project.title}" agora é público e visível na vitrine.`
            });

            if (onSaved) onSaved(result.budget);
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Falha ao converter em portfólio',
                description: err.message
            });
        } finally {
            setConvertingPortfolio(false);
        }
    };

    // Salvar Orçamento no Banco
    const handleSaveBudget = async () => {
        if (!formData.title.trim() || !formData.client_name.trim()) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Informe o título do orçamento e o nome do cliente.'
            });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                budget_code: formData.budget_code || `ORC-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
                category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
                estimated_hours: parseFloat(formData.estimated_hours) || 0,
                hourly_rate_used: parseFloat(formData.hourly_rate_used) || 120,
                subtotal: parseFloat(formData.subtotal) || 0,
                profit_margin_percent: parseFloat(formData.profit_margin_percent) || 0,
                discount_percent: parseFloat(formData.discount_percent) || 0,
                final_price: parseFloat(formData.final_price) || 0,
                deadline_days: parseInt(formData.deadline_days, 10) || 15,
                ai_scope_analysis: aiScenarios ? { scenarios: aiScenarios } : (formData.ai_scope_analysis || null)
            };

            let saved;
            if (isEditing) {
                saved = await updateBudget(budget.id, payload);
                toast({ title: 'Orçamento atualizado!', description: 'Todas as alterações foram salvas com sucesso.' });
            } else {
                saved = await createBudget(payload);
                toast({ title: 'Orçamento criado!', description: 'Adicionado ao seu pipeline comercial.' });
            }

            if (onSaved) onSaved(saved);
            onClose();
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Erro ao salvar',
                description: err.message || 'Verifique sua conexão.'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-card border-border text-foreground p-0">
                <DialogHeader className="p-6 pb-2 border-b border-border bg-muted/20">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            {isEditing ? 'Editar Orçamento & Negociação' : 'Novo Orçamento Comercial'}
                        </DialogTitle>
                        {formData.final_price > 0 && (
                            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                R$ {Number(formData.final_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-4 sm:px-6 pt-3 border-b border-border bg-background sticky top-0 z-10">
                        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/60 gap-1">
                            <TabsTrigger value="escopo" className="text-xs py-2 gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" />
                                1. Cliente & Escopo
                            </TabsTrigger>
                            <TabsTrigger value="precificacao" className="text-xs py-2 gap-1.5">
                                <DollarSign className="w-3.5 h-3.5" />
                                2. HH & Precificação
                            </TabsTrigger>
                            <TabsTrigger value="vendas" className="text-xs py-2 gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                3. Copiloto de Vendas
                            </TabsTrigger>
                            <TabsTrigger value="portfolio" className="text-xs py-2 gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" />
                                4. Entrega & Portfólio
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* ABA 1: CLIENTE E ESCOPO */}
                        <TabsContent value="escopo" className="m-0 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Título do Projeto *</Label>
                                    <Input
                                        placeholder="Ex: Landing Page de Alta Conversão / Ensaio Corporativo"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Categoria do Serviço *</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Dados do Cliente */}
                            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/20">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">Nome do Cliente *</Label>
                                        <Input
                                            placeholder="Ex: Dr. Roberto / Mariana Silva"
                                            value={formData.client_name}
                                            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">Empresa / Razão Social</Label>
                                        <Input
                                            placeholder="Ex: Clínica Odonto Prime"
                                            value={formData.client_company}
                                            onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold">WhatsApp (para propostas)</Label>
                                        <Input
                                            placeholder="(21) 99999-9999"
                                            value={formData.client_phone}
                                            onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Dados Opcionais para Emissão de PDF */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-border/50">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-muted-foreground">
                                            CPF / CNPJ do Cliente (Opcional p/ PDF)
                                        </Label>
                                        <Input
                                            placeholder="Ex: 000.000.000-00 ou CNPJ"
                                            value={formData.client_document}
                                            onChange={(e) => setFormData({ ...formData, client_document: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-muted-foreground">
                                            E-mail do Cliente (Opcional p/ PDF)
                                        </Label>
                                        <Input
                                            type="email"
                                            placeholder="cliente@email.com"
                                            value={formData.client_email}
                                            onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-muted-foreground">
                                            Endereço / Cidade (Opcional p/ PDF)
                                        </Label>
                                        <Input
                                            placeholder="Ex: Niterói, RJ"
                                            value={formData.client_address}
                                            onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Briefing / Necessidade do Cliente */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold">
                                        Briefing do Cliente (O que ele pediu)
                                    </Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                                        onClick={handleEstimateScopeWithAI}
                                        disabled={aiScopeLoading}
                                    >
                                        {aiScopeLoading ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Calculando com IA...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                Estimar Escopo & HH com IA
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <Textarea
                                    rows={4}
                                    placeholder="Ex: Cliente quer um site moderno para sua clínica odontológica, com agendamento direto pelo WhatsApp, mapa de localização, seção de tratamentos e fotos de alta resolução da equipe."
                                    value={formData.scope_description}
                                    onChange={(e) => setFormData({ ...formData, scope_description: e.target.value })}
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    💡 Dica: Cole a mensagem de áudio ou texto que o cliente mandou e clique em "Estimar Escopo & HH com IA". A IA quebrará as horas automaticamente!
                                </p>
                            </div>

                            {/* Status e Prazos */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">Status do Pipeline</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => setFormData({ ...formData, status: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pendente">📝 Pendente / Rascunho</SelectItem>
                                            <SelectItem value="em_analise">💬 Em Análise / Negociação</SelectItem>
                                            <SelectItem value="em_andamento">🚀 Aceito / Em Andamento</SelectItem>
                                            <SelectItem value="entregue">📦 Entregue</SelectItem>
                                            <SelectItem value="pendente_pagamento">💰 Aguardando Pagamento</SelectItem>
                                            <SelectItem value="concluido">✅ Concluído & Quitado</SelectItem>
                                            <SelectItem value="recusado">❌ Recusado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">Prazo de Entrega (dias úteis)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.deadline_days}
                                        onChange={(e) => setFormData({ ...formData, deadline_days: parseInt(e.target.value, 10) || 15 })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">Condições de Pagamento</Label>
                                    <Input
                                        value={formData.payment_terms}
                                        onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                        placeholder="Ex: 50% entrada + 50% entrega"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* ABA 2: HH E PRECIFICAÇÃO */}
                        <TabsContent value="precificacao" className="m-0 space-y-5">
                            {/* Calculadora de HH */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-lg border border-border bg-muted/30">
                                <div>
                                    <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Total Horas (HH)</Label>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            className="font-mono text-base font-bold h-9"
                                            value={formData.estimated_hours}
                                            onChange={(e) => recalculateTotals(e.target.value, formData.hourly_rate_used, formData.profit_margin_percent, formData.discount_percent)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Taxa HH (R$/h)</Label>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                        <Input
                                            type="number"
                                            step="5"
                                            min="10"
                                            className="font-mono text-base font-bold h-9"
                                            value={formData.hourly_rate_used}
                                            onChange={(e) => recalculateTotals(formData.estimated_hours, e.target.value, formData.profit_margin_percent, formData.discount_percent)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Margem de Lucro (%)</Label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="0"
                                        className="font-mono text-base font-bold h-9 mt-1"
                                        value={formData.profit_margin_percent}
                                        onChange={(e) => recalculateTotals(formData.estimated_hours, formData.hourly_rate_used, e.target.value, formData.discount_percent)}
                                    />
                                </div>

                                <div>
                                    <Label className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Desconto Concedido (%)</Label>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="50"
                                        className="font-mono text-base font-bold h-9 mt-1"
                                        value={formData.discount_percent}
                                        onChange={(e) => recalculateTotals(formData.estimated_hours, formData.hourly_rate_used, formData.profit_margin_percent, e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Cenários Estratégicos de Precificação Sugeridos pela IA */}
                            {aiScenarios && (
                                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles className="w-4 h-4 text-amber-500" />
                                            <span className="text-xs font-bold text-foreground">
                                                Cenários Estratégicos de Mercado (IA)
                                            </span>
                                            {aiScenarios.complexity && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                                                    Nível {aiScenarios.level || '2'}: {aiScenarios.complexity}
                                                </span>
                                            )}
                                        </div>
                                        {aiScenarios.recommendedDeadlineDays && (
                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Prazo sugerido: {aiScenarios.recommendedDeadlineDays} dias
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {/* Piso / Fechamento Rápido */}
                                        <div className="p-2.5 rounded-lg border border-border bg-card/60 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                                            <div>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Piso / Rápido
                                                </span>
                                                <p className="text-lg font-bold font-mono text-foreground mt-0.5">
                                                    R$ {Number(aiScenarios.minPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                    Sensíveis a preço / à vista
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="mt-2 h-7 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                                                onClick={() => handleApplyPricingScenario(aiScenarios.minPrice, 'Piso')}
                                            >
                                                Aplicar Piso
                                            </Button>
                                        </div>

                                        {/* Recomendado / Mercado */}
                                        <div className="p-2.5 rounded-lg border-2 border-emerald-500/50 bg-emerald-500/10 flex flex-col justify-between relative shadow-xs">
                                            <span className="absolute -top-2 right-2 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                                                Recomendado
                                            </span>
                                            <div>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                                                    Valor de Mercado
                                                </span>
                                                <p className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-0.5">
                                                    R$ {Number(aiScenarios.suggestedPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                    Equilíbrio ideal e margem justa
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="mt-2 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                                onClick={() => handleApplyPricingScenario(aiScenarios.suggestedPrice, 'Recomendado')}
                                            >
                                                Aplicar Recomendado
                                            </Button>
                                        </div>

                                        {/* Premium / Suporte */}
                                        <div className="p-2.5 rounded-lg border border-border bg-card/60 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                                            <div>
                                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Premium / Suporte
                                                </span>
                                                <p className="text-lg font-bold font-mono text-foreground mt-0.5">
                                                    R$ {Number(aiScenarios.premiumPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                    Escopo total + adicionais
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="mt-2 h-7 text-xs border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                                                onClick={() => handleApplyPricingScenario(aiScenarios.premiumPrice, 'Premium')}
                                            >
                                                Aplicar Premium
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resumo Financeiro */}
                            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Valor Final Proposto ao Cliente</p>
                                    <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                                        R$ {Number(formData.final_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Subtotal horas: R$ {Number(formData.subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Lucro: {formData.profit_margin_percent}%
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setActiveTab('vendas')}
                                        className="gap-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                                    >
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        Gerar Argumentos de Venda
                                    </Button>
                                </div>
                            </div>

                            {/* Lista de Entregáveis / Etapas Decompostas */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold">Etapas & Entregáveis do Projeto</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-xs gap-1 text-primary"
                                        onClick={() => {
                                            const newDeliverables = [...formData.deliverables, { stage: 'Nova Etapa', hours: 4, description: '' }];
                                            const totalH = newDeliverables.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
                                            recalculateTotals(totalH, formData.hourly_rate_used, formData.profit_margin_percent, formData.discount_percent);
                                            setFormData(prev => ({ ...prev, deliverables: newDeliverables }));
                                        }}
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Adicionar Etapa
                                    </Button>
                                </div>

                                {formData.deliverables.length === 0 ? (
                                    <div className="p-6 text-center border border-dashed rounded-lg border-border text-muted-foreground text-xs">
                                        Nenhuma etapa decomposta ainda. Digite o briefing na aba 1 e clique em <b>"Estimar Escopo & HH com IA"</b> para preencher automaticamente!
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                        {formData.deliverables.map((item, index) => (
                                            <div key={index} className="flex items-start gap-2 p-2.5 rounded-lg border border-border bg-muted/20 text-xs">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            placeholder="Nome da Etapa"
                                                            value={item.stage || ''}
                                                            onChange={(e) => {
                                                                const updated = formData.deliverables.map((d, i) => i === index ? { ...d, stage: e.target.value } : d);
                                                                setFormData(prev => ({ ...prev, deliverables: updated }));
                                                            }}
                                                            className="h-7 text-xs font-semibold w-2/3"
                                                        />
                                                        <div className="flex items-center gap-1 w-1/3">
                                                            <Input
                                                                type="number"
                                                                placeholder="Horas"
                                                                value={item.hours || ''}
                                                                onChange={(e) => {
                                                                    const updated = formData.deliverables.map((d, i) => i === index ? { ...d, hours: parseFloat(e.target.value) || 0 } : d);
                                                                    const totalH = updated.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
                                                                    setFormData(prev => ({ ...prev, deliverables: updated }));
                                                                    recalculateTotals(totalH, formData.hourly_rate_used, formData.profit_margin_percent, formData.discount_percent);
                                                                }}
                                                                className="h-7 text-xs font-mono text-right"
                                                            />
                                                            <span className="text-[11px] text-muted-foreground">h</span>
                                                        </div>
                                                    </div>
                                                    <Input
                                                        placeholder="Breve descrição dos entregáveis desta etapa..."
                                                        value={item.description || ''}
                                                        onChange={(e) => {
                                                            const updated = formData.deliverables.map((d, i) => i === index ? { ...d, description: e.target.value } : d);
                                                            setFormData(prev => ({ ...prev, deliverables: updated }));
                                                        }}
                                                        className="h-7 text-xs text-muted-foreground"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        const updated = formData.deliverables.filter((_, i) => i !== index);
                                                        const totalH = updated.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);
                                                        setFormData({ ...formData, deliverables: updated });
                                                        recalculateTotals(totalH, formData.hourly_rate_used, formData.profit_margin_percent, formData.discount_percent);
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* ABA 3: COPILOTO DE VENDAS E NEGOCIAÇÃO */}
                        <TabsContent value="vendas" className="m-0 space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        Gerador de Proposta Persuasiva para WhatsApp
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Mensagem calibrada para valorizar sua autoridade e focar no retorno financeiro do cliente.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleGenerateSalesPitchWithAI}
                                    disabled={aiPitchLoading}
                                    className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-sm"
                                >
                                    {aiPitchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    Gerar Pitch com IA
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    rows={8}
                                    placeholder="Clique no botão 'Gerar Pitch com IA' acima para criar a mensagem de proposta comercial pronta para o WhatsApp..."
                                    value={formData.ai_sales_pitch}
                                    onChange={(e) => setFormData({ ...formData, ai_sales_pitch: e.target.value })}
                                    className="text-xs font-sans leading-relaxed"
                                />

                                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCopyWhatsApp}
                                        disabled={!formData.ai_sales_pitch}
                                        className="gap-1.5 text-xs"
                                    >
                                        {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        Copiar Mensagem
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleOpenWhatsApp}
                                        disabled={!formData.ai_sales_pitch}
                                        className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Enviar no WhatsApp
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setPdfModalOpen(true)}
                                        className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        Visualizar & Baixar PDF
                                    </Button>
                                </div>
                            </div>

                            {/* Quebra de Objeções (O que responder se o cliente chiar) */}
                            {formData.ai_objections_handling && formData.ai_objections_handling.length > 0 && (
                                <div className="space-y-3 pt-3 border-t border-border">
                                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                        <ShieldAlert className="w-4 h-4 text-blue-500" />
                                        Guia Tático de Negociação (Como responder a objeções)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {formData.ai_objections_handling.map((obj, i) => (
                                            <div key={i} className="p-3 rounded-lg border border-border bg-muted/30 text-xs space-y-1.5">
                                                <p className="font-bold text-foreground">"{obj.objection}"</p>
                                                <p className="text-[11px] text-muted-foreground italic">{obj.strategy}</p>
                                                <div className="pt-1">
                                                    <p className="text-[11px] text-primary bg-primary/5 p-2 rounded border border-primary/10 select-all">
                                                        {obj.responseScript}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* ABA 4: ENTREGA E TRANSFORMAÇÃO EM PORTFÓLIO */}
                        <TabsContent value="portfolio" className="m-0 space-y-5">
                            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Transformar Trabalho em Projeto do Portfólio
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            Após entregar o trabalho, anexe a foto de capa e clique para publicá-lo diretamente no portfólio público.
                                        </p>
                                    </div>

                                    {formData.project_id ? (
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                            ✓ Já Publicado no Portfólio
                                        </span>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleConvertToPortfolio}
                                            disabled={convertingPortfolio}
                                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {convertingPortfolio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                                            Publicar no Portfólio Agora
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Foto de Capa do Projeto */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Imagem de Capa do Projeto (Otimizada WebP)</Label>
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed rounded-lg border-border bg-muted/10">
                                    {formData.main_image_url ? (
                                        <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-border group">
                                            <img
                                                src={formData.main_image_url}
                                                alt="Capa do Projeto"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, main_image_url: '' })}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-36 h-24 rounded-lg border border-border bg-muted flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                                            <ImageIcon className="w-6 h-6" />
                                            <span>Sem foto</span>
                                        </div>
                                    )}

                                    <div className="space-y-1.5 flex-1">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUploadMainImage}
                                            disabled={uploadingImage}
                                            className="text-xs file:text-xs file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            {uploadingImage
                                                ? 'Otimizando e enviando imagem WebP...'
                                                : 'A foto será comprimida em WebP e salva no armazenamento em nuvem com alta fidelidade visual.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Link de Produção do Projeto */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Link do Projeto em Produção (URL Final)</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="https://www.site-do-cliente.com.br"
                                        value={formData.project_url}
                                        onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                                    />
                                    {formData.project_url && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            asChild
                                            className="shrink-0"
                                        >
                                            <a href={formData.project_url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </div>

                    <DialogFooter className="p-4 border-t border-border bg-muted/20 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="w-full sm:w-auto">
                            Fechar
                        </Button>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPdfModalOpen(true)}
                                className="gap-1.5 text-xs border-primary/40 text-primary hover:bg-primary/10 w-full sm:w-auto"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Ver PDF da Proposta
                            </Button>

                            <Button
                                type="button"
                                onClick={handleSaveBudget}
                                disabled={saving}
                                className="gap-2 w-full sm:w-auto"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                {isEditing ? 'Atualizar Orçamento' : 'Salvar no Pipeline'}
                            </Button>
                        </div>
                    </DialogFooter>
                </Tabs>
            </DialogContent>

            {/* Modal de Exibição e Download do PDF */}
            {pdfModalOpen && (
                <BudgetPdfModal
                    isOpen={pdfModalOpen}
                    onClose={() => setPdfModalOpen(false)}
                    budget={formData}
                    pricingSettings={pricingBase}
                    categoryTitle={categories.find(c => String(c.id) === String(formData.category_id))?.title || 'Tecnologia & Desenvolvimento'}
                />
            )}
        </Dialog>
    );
};

export default BudgetModal;
