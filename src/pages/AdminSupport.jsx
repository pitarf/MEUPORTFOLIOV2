import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Loader2, Filter, X, Send, Clock, Trash2, Archive, Edit, Paperclip, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { uploadTicketAttachment, extractImageFromClipboard } from '@/services/ticketAttachmentService';
import ImageLightboxModal from '@/components/common/ImageLightboxModal';
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
    const [attachedImage, setAttachedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const fileInputRef = useRef(null);

    const statuses = ['aberto', 'em andamento', 'concluído', 'cancelado'];
    const priorities = ['baixa', 'normal', 'alta', 'urgente'];

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        let query = supabase.from('support_tickets').select('*, ticket_updates(*)');

        if (filters.status !== 'todos') {
            query = query.eq('status', filters.status);
        }
        if (filters.search && filters.search.trim()) {
            const cleanSearch = filters.search.trim();
            query = query.or(`subject.ilike.%${cleanSearch}%,ticket_code.ilike.%${cleanSearch}%,client_name.ilike.%${cleanSearch}%,client_email.ilike.%${cleanSearch}%,name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%`);
        }

        query = query.eq('is_archived', filters.showArchived);

        let { data, error } = await query.order('created_at', { ascending: false });

        // Fallback resiliente: caso ocorra erro no join de ticket_updates, tenta carregar os chamados sem o join
        if (error) {
            console.warn('Tentando fallback de chamados sem ticket_updates(*):', error);
            let fallbackQuery = supabase.from('support_tickets').select('*');
            if (filters.status !== 'todos') fallbackQuery = fallbackQuery.eq('status', filters.status);
            if (filters.search && filters.search.trim()) {
                const cleanSearch = filters.search.trim();
                fallbackQuery = fallbackQuery.or(`subject.ilike.%${cleanSearch}%,ticket_code.ilike.%${cleanSearch}%,client_name.ilike.%${cleanSearch}%,client_email.ilike.%${cleanSearch}%,name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%`);
            }
            fallbackQuery = fallbackQuery.eq('is_archived', filters.showArchived);
            const fallbackResult = await fallbackQuery.order('created_at', { ascending: false });
            if (!fallbackResult.error && fallbackResult.data) {
                data = fallbackResult.data.map(t => ({ ...t, ticket_updates: [] }));
                error = null;
            }
        }

        if (error) {
            console.error('Falha ao carregar chamados:', error);
            toast({
                variant: 'destructive',
                title: 'Falha ao buscar chamados',
                description: error.message || 'Servidor instável. Tente novamente em alguns instantes.'
            });
        } else {
            setTickets(data || []);
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
            toast({
                variant: 'destructive',
                title: 'Falha ao atualizar chamado',
                description: error.message || 'Não foi possível salvar as alterações no chamado.'
            });
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
            toast({
                variant: 'destructive',
                title: 'Falha ao excluir chamado',
                description: error.message || 'Não foi possível remover o chamado.'
            });
        } else {
            toast({ title: 'Chamado excluído com sucesso!' });
            setSelectedTicket(null);
            fetchTickets();
        }
    };

    const handleRemoveAttachedImage = () => {
        setAttachedImage(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePaste = (e) => {
        const file = extractImageFromClipboard(e);
        if (file) {
            e.preventDefault();
            setAttachedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
            toast({
                title: 'Print detectado!',
                description: 'Imagem capturada do teclado e anexada à nota com sucesso.'
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type || !file.type.startsWith('image/')) {
                toast({
                    variant: 'destructive',
                    title: 'Formato inválido',
                    description: 'Por favor, selecione um arquivo de imagem (PNG, JPG, WebP, etc.).'
                });
                return;
            }
            setAttachedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(previewUrl);
        }
    };

    const handleAddNote = async () => {
        if ((!newNote.trim() && !attachedImage) || !selectedTicket) return;
        setIsSubmittingNote(true);

        try {
            let uploadedAttachmentUrl = null;
            let attachmentsArray = [];

            if (attachedImage) {
                const folderName = selectedTicket.ticket_code || selectedTicket.id || 'geral';
                const uploadedData = await uploadTicketAttachment(attachedImage, folderName);
                uploadedAttachmentUrl = uploadedData.url;
                attachmentsArray = [uploadedData];
            }

            const notePayload = {
                ticket_id: selectedTicket.id,
                note: newNote.trim() || 'Print anexado pelo suporte.',
                attachment_url: uploadedAttachmentUrl,
                attachments: attachmentsArray
            };

            const { data, error } = await supabase
                .from('ticket_updates')
                .insert([notePayload])
                .select()
                .single();

            if (error) {
                console.error('Erro ao inserir nota:', error);
                toast({
                    variant: 'destructive',
                    title: 'Falha ao adicionar nota',
                    description: error.message || 'Não foi possível registrar a nota no chamado.'
                });
            } else {
                toast({
                    title: 'Nota registrada!',
                    description: attachedImage ? 'Nota e print anexado com sucesso.' : 'Nota adicionada com sucesso.'
                });
                setSelectedTicket(prev => ({
                    ...prev,
                    ticket_updates: [...(prev.ticket_updates || []), data]
                }));
                setNewNote('');
                handleRemoveAttachedImage();
            }
        } catch (uploadErr) {
            console.error('Falha no upload do anexo:', uploadErr);
            toast({
                variant: 'destructive',
                title: 'Falha no anexo',
                description: uploadErr.message || 'Não foi possível fazer upload do print.'
            });
        } finally {
            setIsSubmittingNote(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'aberto': return 'border-blue-500';
            case 'em andamento': return 'border-yellow-500';
            case 'concluído': return 'border-green-500';
            case 'cancelado': return 'border-red-500';
            default: return 'border-border';
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
                    <Filter className="text-muted-foreground" />
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
                                        <motion.div key={ticket.id} layoutId={`ticket-${ticket.id}`} onClick={() => setSelectedTicket(ticket)} className={`p-4 rounded-lg cursor-pointer glass-effect border-l-4 ${getStatusColor(ticket.status)} hover:bg-muted/50 transition-colors`}>
                                            <p className="font-bold truncate">{ticket.subject}</p>
                                            <p className="text-sm text-muted-foreground">{ticket.client_name || ticket.name || ticket.client_email || ticket.email || 'Cliente'}</p>
                                            <p className="text-xs text-muted-foreground mt-2">{ticket.ticket_code}</p>
                                        </motion.div>
                                    ))}
                                    {(ticketsByStatus[status]?.length === 0) && <p className="text-muted-foreground text-sm p-4">Nenhum chamado.</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!selectedTicket} onOpenChange={() => { setSelectedTicket(null); handleRemoveAttachedImage(); }}>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                    {selectedTicket && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{selectedTicket.subject}</DialogTitle>
                                <DialogDescription><span className="font-mono">{selectedTicket.ticket_code}</span> : por {selectedTicket.client_name || selectedTicket.name || 'Cliente'} ({selectedTicket.client_email || selectedTicket.email || 'Sem e-mail'})</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                <div><Label>Status</Label><Select value={selectedTicket.status} onValueChange={(value) => handleUpdateTicket(selectedTicket.id, { status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
                                <div><Label>Prioridade</Label><Select value={selectedTicket.priority} onValueChange={(value) => handleUpdateTicket(selectedTicket.id, { priority: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{priorities.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-2 space-y-4 glass-effect p-4 rounded-lg">
                                <h3 className="font-bold text-lg">Descrição Original</h3>
                                <div className="text-foreground bg-muted p-3 rounded-md space-y-3">
                                    <p className="whitespace-pre-wrap">{selectedTicket.message || selectedTicket.description || 'Sem descrição.'}</p>
                                    
                                    {/* Print anexado na abertura do chamado */}
                                    {(selectedTicket.attachment_url || (selectedTicket.attachments && selectedTicket.attachments.length > 0)) && (
                                        <div className="pt-2 border-t border-border/60">
                                            <span className="text-xs font-semibold text-muted-foreground block mb-1.5 flex items-center gap-1.5">
                                                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                                                Print anexado na abertura:
                                            </span>
                                            <div
                                                onClick={() => setLightboxImage({
                                                    url: selectedTicket.attachment_url || selectedTicket.attachments[0]?.url,
                                                    title: `Print do Chamado : ${selectedTicket.ticket_code}`
                                                })}
                                                className="group relative inline-block cursor-pointer overflow-hidden rounded-lg border border-border/80 bg-background/50 hover:border-blue-500 transition-all max-w-xs shadow-sm hover:shadow-md"
                                            >
                                                <img
                                                    src={selectedTicket.attachment_url || selectedTicket.attachments[0]?.url}
                                                    alt="Print anexado na abertura"
                                                    className="h-28 w-auto object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                                                    <ZoomIn className="w-4 h-4" />
                                                    <span>Ampliar Print</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-bold text-lg mt-4">Histórico de Atualizações</h3>
                                <div className="space-y-4">
                                    {(selectedTicket.ticket_updates || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map(update => (
                                        <div key={update.id} className="text-sm">
                                            <div className="text-foreground bg-muted p-3 rounded-md space-y-2">
                                                <p className="whitespace-pre-wrap">{update.note}</p>
                                                
                                                {/* Renderizacao de print ou anexo da nota */}
                                                {(update.attachment_url || (update.attachments && update.attachments.length > 0)) && (
                                                    <div className="pt-2 border-t border-border/50">
                                                        <div
                                                            onClick={() => setLightboxImage({
                                                                url: update.attachment_url || update.attachments[0]?.url,
                                                                title: `Print da Atualização : ${new Date(update.created_at).toLocaleString()}`
                                                            })}
                                                            className="group relative inline-block cursor-pointer overflow-hidden rounded-lg border border-border/80 bg-background/50 hover:border-blue-500 transition-all max-w-xs shadow-sm hover:shadow-md"
                                                        >
                                                            <img
                                                                src={update.attachment_url || update.attachments[0]?.url}
                                                                alt="Print da atualização"
                                                                className="h-28 w-auto object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                                                                <ZoomIn className="w-4 h-4" />
                                                                <span>Ampliar Print</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(update.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                    {(selectedTicket.ticket_updates?.length === 0 || !selectedTicket.ticket_updates) && (
                                        <p className="text-xs text-muted-foreground italic">Nenhuma nota ou atualização registrada até o momento.</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex-col sm:flex-col gap-4">
                                <div className="w-full space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="new-note" className="text-sm font-semibold flex items-center gap-1.5">
                                            Adicionar Nova Nota ou Print
                                        </Label>
                                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                                            Dica: você pode colar um print diretamente com <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] border border-border">Ctrl+V</kbd>
                                        </span>
                                    </div>

                                    {/* Preview da imagem anexada */}
                                    {imagePreviewUrl && (
                                        <div className="flex items-center gap-3 p-2 bg-blue-50/10 border border-blue-500/40 rounded-lg">
                                            <img
                                                src={imagePreviewUrl}
                                                alt="Preview do print"
                                                className="w-12 h-12 object-cover rounded-md border border-border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold truncate text-foreground">
                                                    {attachedImage?.name || 'Print capturado'}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {attachedImage?.size ? `${Math.round(attachedImage.size / 1024)} KB` : 'Imagem pronta para envio'}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleRemoveAttachedImage}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                                                title="Remover anexo"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="flex gap-2 items-end">
                                        <div className="relative flex-1">
                                            <Textarea
                                                id="new-note"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                onPaste={handlePaste}
                                                placeholder="Digite a atualização aqui ou pressione Ctrl+V para colar um print..."
                                                rows={2}
                                                className="resize-none"
                                            />
                                        </div>

                                        {/* Input file invisivel */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        {/* Botao de anexar print */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isSubmittingNote}
                                            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-blue-500 hover:border-blue-500"
                                            title="Anexar print ou imagem do computador"
                                        >
                                            <Paperclip className="w-4 h-4" />
                                        </Button>

                                        {/* Botao de enviar */}
                                        <Button
                                            type="button"
                                            onClick={handleAddNote}
                                            disabled={isSubmittingNote || (!newNote.trim() && !attachedImage)}
                                            className="h-10 px-4 shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-medium"
                                        >
                                            {isSubmittingNote ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-1.5" />
                                                    <span>Enviar</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
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

            {/* Modal Lightbox para visualizacao ampliada de prints */}
            <ImageLightboxModal
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
                imageUrl={lightboxImage?.url}
                title={lightboxImage?.title}
            />
        </>
    );
};

export default AdminSupport;