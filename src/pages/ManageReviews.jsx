import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Check, X, Trash2, Star, User, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ReviewCard = ({ review, onToggle, onDelete }) => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-500'
                    }`}
            />
        ));
    };

    return (
        <Card className={`bg-gray-800/50 border-gray-700 transition-all`}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            {review.avatar_url ? (
                                <img src={review.avatar_url} alt={review.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-lg">{review.name}</CardTitle>
                                <CardDescription>{review.role}</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleString()}</span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap mb-4 text-gray-300">"{review.comment}"</p>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-700">
                    <Button
                        variant="outline"
                        size="sm"
                        className={`border ${review.is_approved ? 'border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10' : 'border-green-500/50 text-green-300 hover:bg-green-500/10'}`}
                        onClick={() => onToggle(review.id, review.is_approved)}
                    >
                        {review.is_approved ? <X className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                        {review.is_approved ? 'Reprovar' : 'Aprovar'}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(review.id)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', rating: 'all' });
    const { toast } = useToast();

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        let query = supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.search) {
            query = query.ilike('name', `%${filters.search}%`);
        }
        if (filters.rating !== 'all') {
            query = query.eq('rating', filters.rating);
        }

        const { data, error } = await query;

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao buscar avaliações.' });
            console.error(error);
        } else {
            setReviews(data);
        }
        setLoading(false);
    }, [toast, filters]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ search: '', rating: 'all' });
    };

    const handleApprovalToggle = async (reviewId, currentStatus) => {
        const { error } = await supabase
            .from('reviews')
            .update({ is_approved: !currentStatus })
            .eq('id', reviewId);

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao atualizar status.' });
        } else {
            toast({ title: `Avaliação ${!currentStatus ? 'aprovada' : 'reprovada'} com sucesso.` });
            fetchReviews();
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Tem certeza que deseja excluir esta avaliação permanentemente?')) return;

        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao excluir avaliação.' });
        } else {
            toast({ title: 'Avaliação excluída com sucesso.' });
            fetchReviews();
        }
    };

    const pendingReviews = reviews.filter(r => !r.is_approved);
    const approvedReviews = reviews.filter(r => r.is_approved);

    return (
        <>
            <Helmet>
                <title>Admin - Gerenciar Avaliações</title>
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">
                        <span className="gradient-text">Gerenciar Avaliações</span>
                    </h1>
                </motion.div>

                <div className="glass-effect p-4 rounded-lg mb-8 flex flex-wrap items-center gap-4">
                    <Filter className="text-gray-400" />
                    <Input
                        placeholder="Buscar por nome..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="max-w-xs"
                    />
                    <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por nota" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Notas</SelectItem>
                            <SelectItem value="5">5 Estrelas</SelectItem>
                            <SelectItem value="4">4 Estrelas</SelectItem>
                            <SelectItem value="3">3 Estrelas</SelectItem>
                            <SelectItem value="2">2 Estrelas</SelectItem>
                            <SelectItem value="1">1 Estrela</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Limpar Filtros</Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 border-b-2 border-yellow-500 pb-2">Pendentes ({pendingReviews.length})</h2>
                            {pendingReviews.length > 0 ? (
                                <div className="space-y-6">
                                    {pendingReviews.map(review => (
                                        <ReviewCard key={review.id} review={review} onToggle={handleApprovalToggle} onDelete={handleDelete} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-4">Nenhuma avaliação pendente.</p>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-6 border-b-2 border-green-500 pb-2">Aprovadas ({approvedReviews.length})</h2>
                            {approvedReviews.length > 0 ? (
                                <div className="space-y-6">
                                    {approvedReviews.map(review => (
                                        <ReviewCard key={review.id} review={review} onToggle={handleApprovalToggle} onDelete={handleDelete} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-4">Nenhuma avaliação aprovada.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageReviews;