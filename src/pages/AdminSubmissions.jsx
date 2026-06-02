import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Mail, Calculator, Inbox, Archive, Trash2, Eye, MessageSquare, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const AdminSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('contacts');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const { toast } = useToast();

    const statusOptions = {
        novo: { label: 'Novo', icon: Mail, color: 'text-blue-400' },
        visualizado: { label: 'Visualizado', icon: Eye, color: 'text-yellow-400' },
        respondido: { label: 'Respondido', icon: MessageSquare, color: 'text-green-400' },
        'virou-cliente': { label: 'Virou Cliente', icon: UserCheck, color: 'text-teal-400' },
        arquivado: { label: 'Arquivado', icon: Archive, color: 'text-gray-500' },
    };

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from(activeTab)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({ variant: 'destructive', title: `Erro ao buscar ${activeTab}.` });
            console.error(error);
        } else {
            setSubmissions(data);
        }
        setLoading(false);
    }, [toast, activeTab]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleStatusChange = async (id, newStatus) => {
        const { error } = await supabase
            .from(activeTab)
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao atualizar status.' });
        } else {
            toast({ title: 'Status atualizado com sucesso!' });
            fetchSubmissions();
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta submissão permanentemente?')) return;

        const { error } = await supabase
            .from(activeTab)
            .delete()
            .eq('id', id);

        if (error) {
            toast({ variant: 'destructive', title: 'Erro ao excluir.' });
        } else {
            toast({ title: 'Submissão excluída com sucesso.' });
            setSelectedSubmission(null);
            fetchSubmissions();
        }
    };

    const openSubmission = (submission) => {
        setSelectedSubmission(submission);
        if (submission.status === 'novo') {
            handleStatusChange(submission.id, 'visualizado');
        }
    };

    const renderSubmissionList = () => (
        <div className="space-y-3">
            {submissions.filter(s => s.status !== 'arquivado').length > 0 ? submissions.filter(s => s.status !== 'arquivado').map(submission => {
                const StatusIcon = statusOptions[submission.status]?.icon || Mail;
                return (
                    <div
                        key={submission.id}
                        onClick={() => openSubmission(submission)}
                        className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <StatusIcon className={`w-5 h-5 ${statusOptions[submission.status]?.color}`} />
                            <div>
                                <p className="font-semibold text-foreground">{submission.subject || submission.service}</p>
                                <p className="text-sm text-muted-foreground">{submission.name}</p>
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(submission.created_at).toLocaleDateString()}</span>
                    </div>
                )
            }) : (
                <div className="text-center py-12 text-muted-foreground">
                    <Inbox className="mx-auto h-12 w-12 mb-4" />
                    <p>Nenhuma submissão activa.</p>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Admin - Submissões</title>
            </Helmet>
            <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">
                        <span className="gradient-text">Submissões de Formulários</span>
                    </h1>
                </motion.div>

                <div className="flex justify-center mb-8">
                    <div className="glass-effect p-2 rounded-lg flex space-x-2">
                        <Button
                            onClick={() => setActiveTab('contacts')}
                            variant={activeTab === 'contacts' ? 'default' : 'ghost'}
                            className={`${activeTab === 'contacts' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Contatos
                        </Button>
                        <Button
                            onClick={() => setActiveTab('quotes')}
                            variant={activeTab === 'quotes' ? 'default' : 'ghost'}
                            className={`${activeTab === 'quotes' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}`}
                        >
                            <Calculator className="w-5 h-5 mr-2" />
                            Orçamentos
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {renderSubmissionList()}
                    </motion.div>
                )}
            </div>

            {selectedSubmission && (
                <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedSubmission.subject || `Orçamento: ${selectedSubmission.service}`}</DialogTitle>
                            <DialogDescription>
                                De: {selectedSubmission.name} ({selectedSubmission.email}) em {new Date(selectedSubmission.created_at).toLocaleString()}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4 text-foreground">
                            <p className="whitespace-pre-wrap bg-muted p-4 rounded-md text-foreground">{selectedSubmission.message || selectedSubmission.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {selectedSubmission.phone && <div><strong className="text-muted-foreground">Telefone:</strong> {selectedSubmission.phone}</div>}
                                {selectedSubmission.company && <div><strong className="text-muted-foreground">Empresa:</strong> {selectedSubmission.company}</div>}
                                {selectedSubmission.budget && <div><strong className="text-muted-foreground">Orçamento:</strong> {selectedSubmission.budget}</div>}
                                {selectedSubmission.deadline && <div><strong className="text-muted-foreground">Prazo:</strong> {new Date(selectedSubmission.deadline).toLocaleDateString()}</div>}
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Select value={selectedSubmission.status} onValueChange={(newStatus) => handleStatusChange(selectedSubmission.id, newStatus)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(statusOptions).map(([key, { label }]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedSubmission.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default AdminSubmissions;