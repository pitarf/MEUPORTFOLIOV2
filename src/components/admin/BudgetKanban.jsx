import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    DollarSign,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    MessageCircle,
    Share2,
    CheckCircle2,
    Building2,
    FolderKanban,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Definição das colunas do Kanban e suas ordens de progressão
export const KANBAN_COLUMNS = [
    {
        id: 'pendente',
        title: 'Pendente / Proposta',
        icon: '📝',
        color: 'border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400'
    },
    {
        id: 'em_analise',
        title: 'Em Negociação',
        icon: '💬',
        color: 'border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400'
    },
    {
        id: 'em_andamento',
        title: 'Aceito / Em Andamento',
        icon: '🚀',
        color: 'border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400'
    },
    {
        id: 'entregue',
        title: 'Entregue',
        icon: '📦',
        color: 'border-indigo-500/40 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400'
    },
    {
        id: 'pendente_pagamento',
        title: 'Aguardando Pagamento',
        icon: '💰',
        color: 'border-orange-500/40 bg-orange-500/5 text-orange-600 dark:text-orange-400'
    },
    {
        id: 'concluido',
        title: 'Concluído & Quitado',
        icon: '✅',
        color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
    }
];

const ORDERED_STATUSES = [
    'pendente',
    'em_analise',
    'em_andamento',
    'entregue',
    'pendente_pagamento',
    'concluido'
];

/**
 * Quadro Kanban estilo Trello para gestão ágil de orçamentos e vendas
 */
const BudgetKanban = ({
    budgets = [],
    onSelectBudget,
    onStatusChange
}) => {
    // Agrupa orçamentos por status
    const groupedBudgets = ORDERED_STATUSES.reduce((acc, status) => {
        acc[status] = budgets.filter(b => b.status === status);
        return acc;
    }, {});

    // Mover para próxima coluna
    const handleMoveForward = (budget, e) => {
        e.stopPropagation();
        const currentIndex = ORDERED_STATUSES.indexOf(budget.status);
        if (currentIndex < ORDERED_STATUSES.length - 1) {
            const nextStatus = ORDERED_STATUSES[currentIndex + 1];
            onStatusChange(budget.id, nextStatus);
        }
    };

    // Mover para coluna anterior
    const handleMoveBackward = (budget, e) => {
        e.stopPropagation();
        const currentIndex = ORDERED_STATUSES.indexOf(budget.status);
        if (currentIndex > 0) {
            const prevStatus = ORDERED_STATUSES[currentIndex - 1];
            onStatusChange(budget.id, prevStatus);
        }
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x select-none min-h-[600px]">
            {KANBAN_COLUMNS.map((col) => {
                const columnItems = groupedBudgets[col.id] || [];
                const totalColumnValue = columnItems.reduce(
                    (sum, b) => sum + (parseFloat(b.final_price) || 0),
                    0
                );

                return (
                    <div
                        key={col.id}
                        className="w-80 shrink-0 flex flex-col rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm"
                    >
                        {/* Cabeçalho da Coluna */}
                        <div className={`p-3.5 border-b border-border/80 rounded-t-xl flex items-center justify-between ${col.color}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-base">{col.icon}</span>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                                    {col.title}
                                </h3>
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background/80 text-foreground border border-border">
                                    {columnItems.length}
                                </span>
                            </div>
                        </div>

                        {/* Totalizador Financeiro da Coluna */}
                        <div className="px-3.5 py-1.5 bg-muted/30 border-b border-border/40 flex justify-between text-[11px] text-muted-foreground font-mono">
                            <span>Subtotal:</span>
                            <span className="font-semibold text-foreground">
                                R$ {totalColumnValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Lista de Cards da Coluna */}
                        <div className="p-2.5 flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-280px)]">
                            <AnimatePresence>
                                {columnItems.length === 0 ? (
                                    <div className="py-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg border-border/60">
                                        Nenhum item
                                    </div>
                                ) : (
                                    columnItems.map((budget) => {
                                        const currentIndex = ORDERED_STATUSES.indexOf(budget.status);
                                        const canMoveBack = currentIndex > 0;
                                        const canMoveForward = currentIndex < ORDERED_STATUSES.length - 1;

                                        return (
                                            <motion.div
                                                key={budget.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                onClick={() => onSelectBudget(budget)}
                                                className="group relative p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-md cursor-pointer space-y-2.5"
                                            >
                                                {/* Topo do Card: Categoria e Projeto Vinculado */}
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground truncate max-w-[150px]">
                                                        {budget.category?.title || 'Geral'}
                                                    </span>

                                                    {budget.project_id && (
                                                        <span className="text-[10px] font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                            <CheckCircle2 className="w-3 h-3" /> Portfólio
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Título e Cliente */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                                        {budget.title}
                                                    </h4>
                                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                                                        <Building2 className="w-3 h-3 shrink-0" />
                                                        <span>{budget.client_name} {budget.client_company ? `(${budget.client_company})` : ''}</span>
                                                    </p>
                                                </div>

                                                {/* Indicadores: Valor R$ e Horas HH */}
                                                <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
                                                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                                        R$ {Number(budget.final_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </span>

                                                    {budget.estimated_hours > 0 && (
                                                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                                                            <Clock className="w-3 h-3 text-primary" />
                                                            {budget.estimated_hours}h
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Ações Rápidas de Navegação no Kanban */}
                                                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                                    <div className="flex items-center gap-1">
                                                        {budget.client_phone && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const cleanPhone = budget.client_phone.replace(/\D/g, '');
                                                                    const phone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
                                                                    const text = encodeURIComponent(budget.ai_sales_pitch || `Olá ${budget.client_name}, gostaria de falar sobre a proposta de ${budget.title}.`);
                                                                    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                                                                }}
                                                                className="p-1 rounded text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                                                                title="Abrir WhatsApp com Proposta"
                                                            >
                                                                <MessageCircle className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                        {budget.ai_sales_pitch && (
                                                            <span title="IA Pitch Gerado" className="text-amber-500">
                                                                <Sparkles className="w-3 h-3" />
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Botões de Mover Card no Trello */}
                                                    <div className="flex items-center gap-1">
                                                        {canMoveBack && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                                                onClick={(e) => handleMoveBackward(budget, e)}
                                                                title="Mover para estágio anterior"
                                                            >
                                                                <ChevronLeft className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                        {canMoveForward && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-muted-foreground hover:text-primary"
                                                                onClick={(e) => handleMoveForward(budget, e)}
                                                                title="Avançar para próximo estágio"
                                                            >
                                                                <ChevronRight className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BudgetKanban;
