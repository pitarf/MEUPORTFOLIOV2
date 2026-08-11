import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Edit, Trash2, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import ProjectFormModal from '@/components/ProjectFormModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ManagePortfolio = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({ search: '', categoryId: 'all' });
    const [modalState, setModalState] = useState({ isOpen: false, project: null });
    const [sortConfig, setSortConfig] = useState({ key: 'display_order', direction: 'asc' });
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const fetchCategories = useCallback(async () => {
        const { data, error } = await supabase.from('categories').select('id, title');
        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao buscar categorias.' });
        } else {
            setCategories(data);
        }
    }, [toast]);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        // Default fetching order, client side will handle dynamic sort
        let query = supabase
            .from('projects')
            .select('*, category:categories(title)')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (filters.search) {
            query = query.ilike('title', `%${filters.search}%`);
        }
        if (filters.categoryId !== 'all') {
            query = query.eq('category_id', filters.categoryId);
        }

        const { data, error } = await query;

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao buscar projetos.', description: error.message });
        } else {
            setProjects(data);
        }
        setLoading(false);
    }, [toast, filters]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProjects = React.useMemo(() => {
        let sortableItems = [...projects];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested keys (like category.title)
                if (sortConfig.key === 'category') {
                    aValue = a.category?.title || '';
                    bValue = b.category?.title || '';
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [projects, sortConfig]);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ArrowUpDown className="w-4 h-4 ml-2 opacity-30" />;
        if (sortConfig.direction === 'asc') return <ArrowUp className="w-4 h-4 ml-2 text-blue-400" />;
        return <ArrowDown className="w-4 h-4 ml-2 text-blue-400" />;
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ search: '', categoryId: 'all' });
    };

    const handleMove = async (index, direction) => {
        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        if (otherIndex < 0 || otherIndex >= sortedProjects.length) return;

        const currentProject = sortedProjects[index];
        const otherProject = sortedProjects[otherIndex];

        let currentOrder = currentProject.display_order ?? 0;
        let otherOrder = otherProject.display_order ?? 0;

        if (currentOrder === otherOrder) {
            // Se as ordens forem iguais (ex: tudo 0), vamos normalizar os display_orders
            // de todos os projetos exibidos na categoria de 10 em 10 (ex: 10, 20, 30, ...)
            const updates = sortedProjects.map((p, idx) => ({
                id: p.id,
                display_order: (idx + 1) * 10
            }));

            // Atualização local imediata (otimista)
            setProjects(prev => prev.map(p => {
                const update = updates.find(u => u.id === p.id);
                return update ? { ...p, display_order: update.display_order } : p;
            }));

            // Salva no banco de dados
            try {
                await Promise.all(updates.map(u => 
                    supabase.from('projects').update({ display_order: u.display_order }).eq('id', u.id)
                ));
                toast({ title: 'Ajustando ordenação...', description: 'Normalizamos a ordenação interna. Tente mover novamente.' });
            } catch (error) {
                console.error('Error resetting order:', error);
                toast({ variant: 'destructive', title: 'Erro ao reordenar', description: 'Erro ao normalizar as ordens.' });
            }
            fetchProjects();
            return;
        }

        // Caso normal: troca de display_orders
        // Atualização local imediata
        setProjects(prev => prev.map(p => {
            if (p.id === currentProject.id) return { ...p, display_order: otherOrder };
            if (p.id === otherProject.id) return { ...p, display_order: currentOrder };
            return p;
        }));

        try {
            const { error: error1 } = await supabase
                .from('projects')
                .update({ display_order: otherOrder })
                .eq('id', currentProject.id);
            
            const { error: error2 } = await supabase
                .from('projects')
                .update({ display_order: currentOrder })
                .eq('id', otherProject.id);

            if (error1 || error2) throw new Error("Erro na atualização do Supabase.");
            toast({ title: 'Ordem salva!' });
        } catch (error) {
            console.error('Error swapping order:', error);
            toast({ variant: 'destructive', title: 'Erro ao salvar ordem', description: 'Não foi possível salvar no banco de dados.' });
            fetchProjects();
        }
    };

    const handleDragDrop = async (sourceIndex, targetIndex) => {
        if (sourceIndex === null || targetIndex === null || sourceIndex === targetIndex) return;

        const reorderedProjects = [...sortedProjects];
        const [movedItem] = reorderedProjects.splice(sourceIndex, 1);
        reorderedProjects.splice(targetIndex, 0, movedItem);

        // Calcula os novos display_orders de 10 em 10 para todos os itens
        const updates = reorderedProjects.map((p, idx) => ({
            id: p.id,
            display_order: (idx + 1) * 10
        }));

        // Atualização local imediata (otimista)
        setProjects(prev => prev.map(p => {
            const update = updates.find(u => u.id === p.id);
            return update ? { ...p, display_order: update.display_order } : p;
        }));

        try {
            await Promise.all(updates.map(u => 
                supabase.from('projects').update({ display_order: u.display_order }).eq('id', u.id)
            ));
            toast({ title: 'Ordem salva com sucesso!' });
        } catch (error) {
            console.error('Error updating drag-and-drop order:', error);
            toast({ variant: 'destructive', title: 'Erro ao salvar ordem', description: 'Não foi possível salvar a nova ordenação.' });
            fetchProjects();
        }
    };

    const handleAddNew = () => {
        setModalState({ isOpen: true, project: null });
    };

    const handleEdit = (project) => {
        setModalState({ isOpen: true, project: project });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, project: null });
    };

    const handleDelete = async (projectId) => {
        try {
            const projectToDelete = projects.find(p => p.id === projectId);
            if (!projectToDelete) return;

            // Deletar as imagens do Firebase Storage
            if (projectToDelete.main_image_url) {
                try {
                    // ref(storage, url) aceita a URL completa do Firebase
                    const imgRef = ref(storage, projectToDelete.main_image_url);
                    await deleteObject(imgRef);
                } catch (err) {
                    console.warn("Could not delete main image from Firebase Storage:", err.message);
                }
            }

            if (projectToDelete.gallery_urls && projectToDelete.gallery_urls.length > 0) {
                await Promise.all(projectToDelete.gallery_urls.map(async (url) => {
                    try {
                        const imgRef = ref(storage, url);
                        await deleteObject(imgRef);
                    } catch (err) {
                        console.warn("Could not delete gallery image from Firebase Storage:", err.message);
                    }
                }));
            }

            const { error } = await supabase.from('projects').delete().eq('id', projectId);
            if (error) throw error;

            toast({ title: 'Sucesso!', description: 'Projeto excluído.' });
            fetchProjects();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao excluir projeto.', description: error.message });
        }
    };

    const handleSave = () => {
        fetchProjects();
        handleCloseModal();
    };

    return (
        <>
            <Helmet>
                <title>Gerenciar Portfólio - Admin</title>
            </Helmet>
            <div className="space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <span className="gradient-text">Gerenciar Portfólio</span>
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium">Adicione, edite ou remova projetos do seu site.</p>
                    </div>
                    <Button onClick={handleAddNew} className="bg-gradient-to-r from-blue-500 to-purple-600">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Projeto
                    </Button>
                </motion.div>

                <div className="glass-effect p-4 rounded-lg mb-8 flex flex-wrap items-center gap-4">
                    <Filter className="text-muted-foreground" />
                    <Input
                        placeholder="Buscar por título..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="max-w-xs"
                    />
                    <Select value={filters.categoryId} onValueChange={(value) => handleFilterChange('categoryId', value)}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Filtrar por categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Categorias</SelectItem>
                            {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Limpar Filtros</Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <>
                        {filters.categoryId !== 'all' && sortConfig.key === 'display_order' && sortConfig.direction === 'asc' && (
                            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-xl text-sm mb-6 flex items-start gap-2 shadow-sm animate-fade-in">
                                <span className="text-base select-none">💡</span>
                                <div>
                                    <span className="font-semibold text-blue-300">Dica de Ordenação:</span> Você pode clicar e arrastar as linhas da tabela pelo ícone <strong className="font-semibold text-blue-300">⋮⋮ (Grip)</strong> para reordenar os projetos de forma prática, ou continuar usando as setas.
                                </div>
                            </div>
                        )}
                        <motion.div
                            className="glass-effect p-4 sm:p-8 rounded-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border">
                                            {filters.categoryId !== 'all' && sortConfig.key === 'display_order' && sortConfig.direction === 'asc' && (
                                                <th className="p-4 w-12"></th>
                                            )}
                                            {filters.categoryId !== 'all' && (
                                                <th className="p-4 w-24 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort('display_order')}>
                                                    <div className="flex items-center">Ordem <SortIcon column="display_order" /></div>
                                                </th>
                                            )}
                                            <th className="p-4 cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort('title')}>
                                                <div className="flex items-center">Projeto <SortIcon column="title" /></div>
                                            </th>
                                            <th className="p-4 hidden md:table-cell cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort('category')}>
                                                <div className="flex items-center">Categoria <SortIcon column="category" /></div>
                                            </th>
                                            <th className="p-4 hidden lg:table-cell cursor-pointer hover:bg-muted transition-colors" onClick={() => handleSort('year')}>
                                                <div className="flex items-center">Ano <SortIcon column="year" /></div>
                                            </th>
                                            <th className="p-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedProjects.map((project, idx) => {
                                            const isDragEnabled = filters.categoryId !== 'all' && sortConfig.key === 'display_order' && sortConfig.direction === 'asc';
                                            return (
                                                <tr
                                                    key={project.id}
                                                    className={`border-b border-border transition-all duration-200 ${
                                                        draggedIndex === idx ? 'opacity-40 bg-muted/30' : 'hover:bg-muted/50'
                                                    } ${
                                                        dragOverIndex === idx && draggedIndex !== idx ? 'border-t-2 border-blue-500 bg-blue-500/10' : ''
                                                    }`}
                                                    draggable={isDragEnabled}
                                                    onDragStart={(e) => {
                                                        if (!isDragEnabled) return;
                                                        setDraggedIndex(idx);
                                                        e.dataTransfer.effectAllowed = 'move';
                                                    }}
                                                    onDragOver={(e) => {
                                                        if (!isDragEnabled) return;
                                                        e.preventDefault();
                                                        if (dragOverIndex !== idx) {
                                                            setDragOverIndex(idx);
                                                        }
                                                    }}
                                                    onDragEnd={() => {
                                                        setDraggedIndex(null);
                                                        setDragOverIndex(null);
                                                    }}
                                                    onDrop={() => {
                                                        if (!isDragEnabled) return;
                                                        handleDragDrop(draggedIndex, idx);
                                                        setDraggedIndex(null);
                                                        setDragOverIndex(null);
                                                    }}
                                                >
                                                    {isDragEnabled && (
                                                        <td className="p-4 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors select-none">
                                                            <GripVertical className="h-5 w-5" />
                                                        </td>
                                                    )}
                                                    {filters.categoryId !== 'all' && (
                                                        <td className="p-4 font-mono text-xs text-muted-foreground">{project.display_order ?? 0}</td>
                                                    )}
                                                    <td className="p-4 font-medium">{project.title}</td>
                                                    <td className="p-4 text-muted-foreground hidden md:table-cell">
                                                         <div className="flex flex-col gap-1">
                                                             <span>{project.category?.title}</span>
                                                             {(() => {
                                                                 const subcatTag = (project.services || []).find(s => s.startsWith('subcategoria:'));
                                                                 const nicheTag = (project.services || []).find(s => s.startsWith('nicho:'));
                                                                 const subcatNames = {
                                                                     'criacao-de-sites': 'Criação de Sites',
                                                                     'landing-pages': 'Landing Pages',
                                                                     'desenvolvimento-de-sistemas': 'Sistemas Web',
                                                                     'automacoes': 'Automações',
                                                                     'dashboards-power-bi': 'Power BI',
                                                                     'fotografia-corporativa': 'Retratos/Corporativo',
                                                                     'fotografia-eventos': 'Eventos'
                                                                 };
                                                                 if (subcatTag) {
                                                                     const code = subcatTag.substring(13);
                                                                     return (
                                                                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                                                                             {subcatNames[code] || code}
                                                                         </span>
                                                                     );
                                                                 } else if (nicheTag) {
                                                                     const label = nicheTag.substring(6);
                                                                     return (
                                                                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                                                                             {label}
                                                                         </span>
                                                                     );
                                                                 }
                                                                 return null;
                                                             })()}
                                                         </div>
                                                     </td>
                                                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{project.year}</td>
                                                    <td className="p-4 flex justify-end gap-2">
                                                        {filters.categoryId !== 'all' && sortConfig.key === 'display_order' && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleMove(idx, 'up')}
                                                                    disabled={idx === 0}
                                                                    title="Mover para cima"
                                                                >
                                                                    <ArrowUp className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleMove(idx, 'down')}
                                                                    disabled={idx === sortedProjects.length - 1}
                                                                    title="Mover para baixo"
                                                                >
                                                                    <ArrowDown className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                                            <Edit className="h-4 w-4 text-blue-400" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto e todas as suas imagens do servidor.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                        onClick={() => handleDelete(project.id)}
                                                                    >
                                                                        Excluir
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>

            {modalState.isOpen && (
                <ProjectFormModal
                    project={modalState.project}
                    categories={categories}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default ManagePortfolio;