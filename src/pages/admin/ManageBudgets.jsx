import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
    PlusCircle,
    Settings,
    Kanban,
    List,
    Search,
    Filter,
    DollarSign,
    Clock,
    Briefcase,
    TrendingUp,
    CheckCircle2,
    Loader2,
    RefreshCw,
    MessageCircle,
    Building2,
    Trash2,
    Edit,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import {
    fetchBudgets,
    updateBudgetStatus,
    deleteBudget,
    fetchPricingSettings
} from '@/services/budgetService';
import BudgetKanban from '@/components/admin/BudgetKanban';
import BudgetModal from '@/components/admin/BudgetModal';
import PricingSettingsModal from '@/components/admin/PricingSettingsModal';
import BudgetPdfModal from '@/components/admin/BudgetPdfModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Página Administrativa de Gestão de Orçamentos, Vendas, Precificação por HH e Pipeline
 * Rota restrita aos administradores com proteção contra indexação de motores de busca.
 */
const ManageBudgets = () => {
    const { toast } = useToast();

    // Estados de Controle
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pricingSettings, setPricingSettings] = useState(null);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Modais
    const [budgetModalOpen, setBudgetModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [pricingModalOpen, setPricingModalOpen] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfBudget, setPdfBudget] = useState(null);
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, budgetId: null, budgetTitle: '' });

    // Carregar categorias
    const loadCategories = useCallback(async () => {
        const { data, error } = await supabase.from('categories').select('id, title, slug');
        if (!error && data) {
            setCategories(data);
        }
    }, []);

    // Carregar orçamentos e configurações
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [budgetsData, settingsData] = await Promise.all([
                fetchBudgets(),
                fetchPricingSettings()
            ]);
            setBudgets(budgetsData);
            setPricingSettings(settingsData);
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Erro ao carregar orçamentos',
                description: err.message
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        loadCategories();
        loadData();
    }, [loadCategories, loadData]);

    // Filtragem de Orçamentos
    const filteredBudgets = useMemo(() => {
        return budgets.filter((b) => {
            const matchesSearch =
                !searchTerm ||
                b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.client_company?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                selectedCategory === 'all' || String(b.category_id) === String(selectedCategory);

            const matchesStatus =
                selectedStatus === 'all' || b.status === selectedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [budgets, searchTerm, selectedCategory, selectedStatus]);

    // Métricas Comerciais Consolidadas
    const metrics = useMemo(() => {
        let emNegociacao = 0;
        let emAndamento = 0;
        let aguardandoPagamento = 0;
        let concluido = 0;
        let totalHoras = 0;

        budgets.forEach((b) => {
            const val = parseFloat(b.final_price) || 0;
            const hours = parseFloat(b.estimated_hours) || 0;

            if (['pendente', 'em_analise'].includes(b.status)) {
                emNegociacao += val;
            } else if (['aceito', 'em_andamento'].includes(b.status)) {
                emAndamento += val;
                totalHoras += hours;
            } else if (['entregue', 'pendente_pagamento'].includes(b.status)) {
                aguardandoPagamento += val;
            } else if (b.status === 'concluido') {
                concluido += val;
            }
        });

        return {
            emNegociacao,
            emAndamento,
            aguardandoPagamento,
            concluido,
            totalHoras
        };
    }, [budgets]);

    // Atualização rápida de status no Kanban
    const handleStatusChange = async (budgetId, newStatus) => {
        try {
            // Atualização otimista
            setBudgets(prev =>
                prev.map(b => b.id === budgetId ? { ...b, status: newStatus } : b)
            );

            await updateBudgetStatus(budgetId, newStatus);
            toast({
                title: 'Status atualizado!',
                description: `O orçamento foi movido para "${newStatus}".`
            });
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Falha ao mover',
                description: err.message
            });
            loadData(); // Reverte
        }
    };

    // Confirmação e Deleção
    const handleConfirmDelete = async () => {
        if (!deleteModalState.budgetId) return;
        try {
            await deleteBudget(deleteModalState.budgetId);
            setBudgets(prev => prev.filter(b => b.id !== deleteModalState.budgetId));
            toast({ title: 'Orçamento removido com sucesso!' });
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Erro ao excluir',
                description: err.message
            });
        } finally {
            setDeleteModalState({ isOpen: false, budgetId: null, budgetTitle: '' });
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <Helmet>
                <title>Gestão de Orçamentos & Vendas | Rafael Pita Solutions</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Cabeçalho da Página */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        Orçamentos, Vendas & HH
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">
                        Pipeline de negociação, calculadora inteligente de Hora-Homem com IA e conversão direta em portfólio.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPricingModalOpen(true)}
                        className="gap-1.5 text-xs border-border"
                    >
                        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                        Configurar Meu HH (R$ {pricingSettings?.hourly_rate ? Number(pricingSettings.hourly_rate).toFixed(0) : '120'}/h)
                    </Button>

                    <Button
                        size="sm"
                        onClick={() => {
                            setSelectedBudget(null);
                            setBudgetModalOpen(true);
                        }}
                        className="gap-1.5 text-xs bg-primary text-primary-foreground shadow-sm"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Novo Orçamento
                    </Button>
                </div>
            </div>

            {/* Cards de Métricas Comerciais */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-medium">Em Negociação</span>
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-lg md:text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                        R$ {metrics.emNegociacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Propostas em análise</p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-medium">Em Execução</span>
                        <Clock className="w-4 h-4 text-purple-500" />
                    </div>
                    <p className="text-lg md:text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                        R$ {metrics.emAndamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{metrics.totalHoras}h em desenvolvimento</p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-medium">Aguardando Pagamento</span>
                        <DollarSign className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-lg md:text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                        R$ {metrics.aguardandoPagamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Entregues a receber</p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm space-y-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-xs font-medium">Faturamento Concluído</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-lg md:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        R$ {metrics.concluido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Projetos quitados</p>
                </div>
            </div>

            {/* Barra de Filtros e Alternador Kanban / Lista */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card/40">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por cliente, empresa ou projeto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9 text-xs"
                        />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40 h-9 text-xs">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas Categorias</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center p-1 rounded-lg border border-border bg-muted/60">
                        <Button
                            type="button"
                            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('kanban')}
                            className="h-7 px-2.5 text-xs gap-1.5"
                        >
                            <Kanban className="w-3.5 h-3.5" />
                            Kanban
                        </Button>
                        <Button
                            type="button"
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="h-7 px-2.5 text-xs gap-1.5"
                        >
                            <List className="w-3.5 h-3.5" />
                            Lista
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={loadData}
                        disabled={loading}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Recarregar dados"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Conteúdo: Kanban ou Lista */}
            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm">Carregando painel de orçamentos...</p>
                </div>
            ) : viewMode === 'kanban' ? (
                <BudgetKanban
                    budgets={filteredBudgets}
                    onSelectBudget={(b) => {
                        setSelectedBudget(b);
                        setBudgetModalOpen(true);
                    }}
                    onStatusChange={handleStatusChange}
                    onViewPdf={(b) => {
                        setPdfBudget(b);
                        setPdfModalOpen(true);
                    }}
                />
            ) : (
                /* Visualização em Lista / Tabela */
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[10px]">
                                <tr>
                                    <th className="py-3 px-4">Projeto & Cliente</th>
                                    <th className="py-3 px-4">Categoria</th>
                                    <th className="py-3 px-4">Horas (HH)</th>
                                    <th className="py-3 px-4">Valor Final</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Portfólio</th>
                                    <th className="py-3 px-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredBudgets.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            Nenhum orçamento encontrado com os filtros aplicados.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBudgets.map((b) => (
                                        <tr
                                            key={b.id}
                                            onClick={() => {
                                                setSelectedBudget(b);
                                                setBudgetModalOpen(true);
                                            }}
                                            className="hover:bg-muted/40 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-foreground">{b.title}</div>
                                                <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {b.client_name} {b.client_company ? `(${b.client_company})` : ''}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                    {b.category?.title || 'Geral'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-mono">
                                                {b.estimated_hours}h
                                            </td>
                                            <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                R$ {Number(b.final_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold border border-border bg-muted/50">
                                                    {b.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {b.project_id ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">Não publicado</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    {b.client_phone && b.client_phone.replace(/\D/g, '').length >= 8 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-emerald-600 hover:bg-emerald-500/10"
                                                            onClick={() => {
                                                                const phone = b.client_phone.replace(/\D/g, '');
                                                                const fullPhone = phone.length <= 11 ? '55' + phone : phone;
                                                                const text = encodeURIComponent(b.ai_sales_pitch || `Olá ${b.client_name}, tudo bem? Segue a proposta comercial referente ao projeto "${b.title}".`);
                                                                window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
                                                            }}
                                                            title="WhatsApp"
                                                        >
                                                            <MessageCircle className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-blue-600 hover:bg-blue-500/10"
                                                        onClick={() => {
                                                            setPdfBudget(b);
                                                            setPdfModalOpen(true);
                                                        }}
                                                        title="Ver Proposta em PDF"
                                                    >
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                        onClick={() => {
                                                            setSelectedBudget(b);
                                                            setBudgetModalOpen(true);
                                                        }}
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setDeleteModalState({
                                                            isOpen: true,
                                                            budgetId: b.id,
                                                            budgetTitle: b.title
                                                        })}
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de Criação / Edição do Orçamento */}
            {budgetModalOpen && (
                <BudgetModal
                    isOpen={budgetModalOpen}
                    onClose={() => {
                        setBudgetModalOpen(false);
                        setSelectedBudget(null);
                    }}
                    budget={selectedBudget}
                    categories={categories}
                    onSaved={() => {
                        loadData();
                    }}
                />
            )}

            {/* Modal de Configuração de HH */}
            {pricingModalOpen && (
                <PricingSettingsModal
                    isOpen={pricingModalOpen}
                    onClose={() => setPricingModalOpen(false)}
                    onSaved={(updated) => {
                        setPricingSettings(updated);
                    }}
                />
            )}

            {/* Modal de Visualização & Download de Proposta em PDF */}
            {pdfModalOpen && pdfBudget && (
                <BudgetPdfModal
                    isOpen={pdfModalOpen}
                    onClose={() => {
                        setPdfModalOpen(false);
                        setPdfBudget(null);
                    }}
                    budget={pdfBudget}
                    pricingSettings={pricingSettings}
                    categoryTitle={categories.find(c => String(c.id) === String(pdfBudget?.category_id))?.title}
                />
            )}

            {/* Alerta de Confirmação de Exclusão */}
            <AlertDialog
                open={deleteModalState.isOpen}
                onOpenChange={(open) => !open && setDeleteModalState({ isOpen: false, budgetId: null, budgetTitle: '' })}
            >
                <AlertDialogContent className="bg-card border-border text-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Orçamento?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o orçamento "{deleteModalState.budgetTitle}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ManageBudgets;
