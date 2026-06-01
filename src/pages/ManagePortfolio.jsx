import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Edit, Trash2, Filter, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

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

            const filesToRemove = [];
            if (projectToDelete.main_image_url) {
                const fileName = projectToDelete.main_image_url.split('/').pop();
                filesToRemove.push(fileName);
            }
            if (projectToDelete.gallery_urls && projectToDelete.gallery_urls.length > 0) {
                projectToDelete.gallery_urls.forEach(url => {
                    const fileName = url.split('/').pop();
                    filesToRemove.push(fileName);
                });
            }

            if (filesToRemove.length > 0) {
                const { error: storageError } = await supabase.storage.from('project-images').remove(filesToRemove);
                if (storageError) {
                    console.warn("Could not delete some images, but proceeding with db deletion:", storageError.message);
                }
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
                        <p className="text-lg text-gray-400">Adicione, edite ou remova projetos do seu site.</p>
                    </div>
                    <Button onClick={handleAddNew} className="bg-gradient-to-r from-blue-500 to-purple-600">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Projeto
                    </Button>
                </motion.div>

                <div className="glass-effect p-4 rounded-lg mb-8 flex flex-wrap items-center gap-4">
                    <Filter className="text-gray-400" />
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
                    <motion.div
                        className="glass-effect p-4 sm:p-8 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('title')}>
                                            <div className="flex items-center">Projeto <SortIcon column="title" /></div>
                                        </th>
                                        <th className="p-4 hidden md:table-cell cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('category')}>
                                            <div className="flex items-center">Categoria <SortIcon column="category" /></div>
                                        </th>
                                        <th className="p-4 hidden lg:table-cell cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('year')}>
                                            <div className="flex items-center">Ano <SortIcon column="year" /></div>
                                        </th>
                                        <th className="p-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedProjects.map(project => (
                                        <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                            <td className="p-4 font-medium">{project.title}</td>
                                            <td className="p-4 text-gray-400 hidden md:table-cell">{project.category?.title}</td>
                                            <td className="p-4 text-gray-400 hidden lg:table-cell">{project.year}</td>
                                            <td className="p-4 flex justify-end gap-2">
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>

            {modalState.isOpen && (
                <ProjectFormModal
                    project={modalState.project}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default ManagePortfolio;