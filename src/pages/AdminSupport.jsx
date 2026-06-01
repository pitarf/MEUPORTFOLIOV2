import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Filter, X, Send, Clock, Trash2, Archive, Edit } from 'lucide-react';
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

const AdminSupport = () => {
    const { toast } = useToast();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: 'todos', search: '', showArchived: false });
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [isSubmittingNote, setIsSubmittingNote] = useState(false);

    const statuses = ['aberto', 'em andamento', 'concluído', 'cancelado'];
    const priorities = ['baixa', 'normal', 'alta', 'urgente'];

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('support_tickets').select('*, ticket_updates(*)');

        if (filters.status !== 'todos') {
            query = query.eq('status', filters.status);
        }
        if (filters.search) {
            query = query.or(`subject.ilike.%${filters.search}%,ticket_code.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }

        query = query.eq('is_archived', filters.showArchived);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao buscar chamados.' });
        } else {
            setTickets(data);
        }
        setLoading(false);
    }, [toast, filters]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({ status: 'todos', search: '', showArchived: false });
    };

    const handleUpdateTicket = async (ticketId, updateData) => {
        const { error } = await supabase.from('support_tickets').update(updateData).eq('id', ticketId);
        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao atualizar chamado.' });
        } else {
            toast({ title: 'Chamado atualizado com sucesso!' });
            if (selectedTicket?.id === ticketId) {
                setSelectedTicket(prev => ({ ...prev, ...updateData }));
            }
            fetchTickets();
        }
    };

    const handleDeleteTicket = async (ticketId) => {
        const { error } = await supabase.from('support_tickets').delete().eq('id', ticketId);
        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao excluir chamado.' });
        } else {
            toast({ title: 'Chamado excluído com sucesso!' });
            setSelectedTicket(null);
            fetchTickets();
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim() || !selectedTicket) return;
        setIsSubmittingNote(true);
        const { data, error } = await supabase.from('ticket_updates').insert([{ ticket_id: selectedTicket.id, note: newNote }]).select().single();
        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao adicionar nota.' });
        } else {
            toast({ title: 'Nota adicionada com sucesso!' });
            setSelectedTicket(prev => ({ ...prev, ticket_updates: [...(prev.ticket_updates || []), data] }));
            setNewNote('');
        }
        setIsSubmittingNote(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'aberto': return 'border-blue-500';
            case 'em andamento': return 'border-yellow-500';
            case 'concluído': return 'border-green-500';
            case 'cancelado': return 'border-red-500';
            default: return 'border-gray-700';
        }
    };

    const ticketsByStatus = statuses.reduce((acc, status) => {
        acc[status] = tickets.filter(t => t.status === status);
        return acc;
    }, {});

    return (
        <>
            <Helmet><title>Admin - Gerenciar Suporte</title></Helmet>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl md:text-5xl font-bold mb-8"><span className="gradient-text">Gerenciar Chamados</span></h1>
                </motion.div>

                <div className="glass-effect p-4 rounded-lg mb-8 flex flex-wrap items-center gap-4">
                    <Filter className="text-gray-400" />
                    <Input placeholder="Buscar..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="max-w-xs" />
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por status" /></SelectTrigger>
                        <SelectContent>{['todos', ...statuses].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant={filters.showArchived ? "secondary" : "ghost"} onClick={() => handleFilterChange('showArchived', !filters.showArchived)}><Archive className="mr-2 h-4 w-4" /> {filters.showArchived ? "Mostrando Arquivados" : "Ver Arquivados"}</Button>
                    <Button variant="ghost" onClick={clearFilters}><X className="mr-2 h-4 w-4" /> Limpar</Button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-blue-500" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statuses.map(status => (
                            <div key={status}>
                                <h2 className={`text-xl font-bold mb-4 capitalize p-2 rounded-t-lg ${getStatusColor(status).replace('border-', 'bg-').replace('-500', '-500/20')} border-b-2 ${getStatusColor(status)}`}>{status} ({ticketsByStatus[status]?.length || 0})</h2>
                                <div className="space-y-4 h-[60vh] overflow-y-auto pr-2">
                                    {ticketsByStatus[status]?.map(ticket => (
                                        <motion.div key={ticket.id} layoutId={`ticket-${ticket.id}`} onClick={() => setSelectedTicket(ticket)} className={`p-4 rounded-lg cursor-pointer glass-effect border-l-4 ${getStatusColor(ticket.status)} hover:bg-gray-700/50 transition-colors`}>
                                            <p className="font-bold truncate">{ticket.subject}</p>
                                            <p className="text-sm text-gray-400">{ticket.name || ticket.email}</p>
                                            <p className="text-xs text-gray-500 mt-2">{ticket.ticket_code}</p>
                                        </motion.div>
                                    ))}
                                    {(ticketsByStatus[status]?.length === 0) && <p className="text-gray-600 text-sm p-4">Nenhum chamado.</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    {selectedTicket && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{selectedTicket.subject}</DialogTitle>
                                <DialogDescription><span className="font-mono">{selectedTicket.ticket_code}</span> - por {selectedTicket.name} ({selectedTicket.email})</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                <div><Label>Status</Label><Select value={selectedTicket.status} onValueChange={(value) => handleUpdateTicket(selectedTicket.id, { status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
                                <div><Label>Prioridade</Label><Select value={selectedTicket.priority} onValueChange={(value) => handleUpdateTicket(selectedTicket.id, { priority: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{priorities.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-2 space-y-4 glass-effect p-4 rounded-lg">
                                <h3 className="font-bold text-lg">Descrição Original</h3>
                                <p className="text-gray-300 whitespace-pre-wrap bg-gray-800/50 p-3 rounded-md">{selectedTicket.description}</p>
                                <h3 className="font-bold text-lg mt-4">Histórico de Atualizações</h3>
                                <div className="space-y-4">
                                    {(selectedTicket.ticket_updates || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map(update => (
                                        <div key={update.id} className="text-sm"><p className="text-gray-300 bg-gray-800/50 p-3 rounded-md">{update.note}</p><p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(update.created_at).toLocaleString()}</p></div>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex-col sm:flex-col gap-4">
                                <div className="w-full"><Label htmlFor="new-note">Adicionar Nova Nota</Label><div className="flex gap-2"><Textarea id="new-note" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Digite a atualização aqui..." /><Button onClick={handleAddNote} disabled={isSubmittingNote}>{isSubmittingNote ? <Loader2 className="animate-spin" /> : <Send />}</Button></div></div>
                                <div className="flex flex-wrap justify-end gap-2">
                                    <Button variant="outline" onClick={() => handleUpdateTicket(selectedTicket.id, { is_archived: !selectedTicket.is_archived })}><Archive className="mr-2 h-4 w-4" />{selectedTicket.is_archived ? 'Desarquivar' : 'Arquivar'}</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</Button></AlertDialogTrigger>
                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. O chamado será excluído permanentemente.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteTicket(selectedTicket.id)}>Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                    </AlertDialog>
                                    <DialogClose asChild><Button type="button" variant="secondary" className="w-full sm:w-auto">Fechar</Button></DialogClose>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AdminSupport;