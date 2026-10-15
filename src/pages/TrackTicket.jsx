import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Ticket, Clock, MessageSquare, AlertTriangle, Image as ImageIcon, ZoomIn } from 'lucide-react';
import ImageLightboxModal from '@/components/common/ImageLightboxModal';

const TrackTicket = () => {
    const { ticketCode: urlTicketCode } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [ticketCode, setTicketCode] = useState(urlTicketCode || '');
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    const fetchTicket = useCallback(async (code) => {
        if (!code) return;
        setLoading(true);
        setSearched(true);
        setTicketData(null);

        const { data, error } = await supabase
            .from('support_tickets')
            .select('*, ticket_updates(*)')
            .eq('ticket_code', code)
            .single();

        if (error || !data) {
            toast({
                variant: 'destructive',
                title: 'Chamado não encontrado',
                description: 'Verifique o código e tente novamente.',
            });
            setTicketData(null);
        } else {
            // Fetch public updates separately
            const { data: updatesData, error: updatesError } = await supabase
                .from('ticket_updates')
                .select('*')
                .eq('ticket_id', data.id)
                .order('created_at', { ascending: false });

            if (updatesError) {
                console.error("Error fetching updates:", updatesError);
                setTicketData({ ...data, updates: [] });
            } else {
                setTicketData({ ...data, updates: updatesData });
            }
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        if (urlTicketCode) {
            fetchTicket(urlTicketCode);
        }
    }, [urlTicketCode, fetchTicket]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/track-ticket/${ticketCode}`);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'aberto': return { color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
            case 'em andamento': return { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
            case 'concluído': return { color: 'text-green-400', bgColor: 'bg-green-500/20' };
            case 'cancelado': return { color: 'text-red-400', bgColor: 'bg-red-500/20' };
            default: return { color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
        }
    };

    return (
        <>
            <Helmet>
                <title>Rastrear Chamado - Rafael Pita Solutions</title>
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Rastrear Chamado</span>
                    </h1>
                    <p className="text-lg text-gray-650 dark:text-gray-400 font-medium">Insira o código do seu chamado para ver o status e as atualizações.</p>
                </motion.div>

                <form onSubmit={handleSearch} className="flex gap-2 mb-12">
                    <Input
                        type="text"
                        placeholder="Digite o código do chamado (ex: RPS-123456)"
                        value={ticketCode}
                        onChange={(e) => setTicketCode(e.target.value)}
                        className="text-lg bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 font-bold text-white" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    </Button>
                </form>

                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    </div>
                )}

                {!loading && searched && !ticketData && (
                    <div className="text-center glass-effect p-8 rounded-lg">
                        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nenhum chamado encontrado</h2>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">O código inserido não corresponde a nenhum chamado. Por favor, verifique e tente novamente.</p>
                    </div>
                )}

                {ticketData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect p-8 rounded-2xl space-y-8">
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Ticket className="text-blue-500 dark:text-blue-400" />
                                    Chamado: {ticketData.ticket_code}
                                </h2>
                                <span className={`text-sm font-bold py-1 px-3 rounded-full ${getStatusInfo(ticketData.status).bgColor} ${getStatusInfo(ticketData.status).color}`}>
                                    {ticketData.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{ticketData.subject}</p>
                            <p className="text-gray-700 dark:text-gray-300 mt-2 font-medium whitespace-pre-wrap">{ticketData.message || ticketData.description}</p>
                            
                            {/* Print anexado na abertura do chamado */}
                            {(ticketData.attachment_url || (ticketData.attachments && ticketData.attachments.length > 0)) && (
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2 flex items-center gap-1.5">
                                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                                        Print anexado:
                                    </span>
                                    <div
                                        onClick={() => setLightboxImage({
                                            url: ticketData.attachment_url || ticketData.attachments[0]?.url,
                                            title: `Print do Chamado : ${ticketData.ticket_code}`
                                        })}
                                        className="group relative inline-block cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-black/10 dark:bg-black/30 hover:border-blue-500 transition-all max-w-xs shadow-sm"
                                    >
                                        <img
                                            src={ticketData.attachment_url || ticketData.attachments[0]?.url}
                                            alt="Print do chamado"
                                            className="h-32 w-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                                            <ZoomIn className="w-4 h-4" />
                                            <span>Ampliar Print</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 font-semibold">Criado em: {new Date(ticketData.created_at).toLocaleString()}</p>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                                <MessageSquare className="text-purple-500 dark:text-purple-400" />
                                Histórico de Atualizações
                            </h3>
                            <div className="space-y-6">
                                {ticketData.updates && ticketData.updates.length > 0 ? (
                                    ticketData.updates.map(update => (
                                        <div key={update.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <div className="w-px flex-grow bg-gray-200 dark:bg-gray-700"></div>
                                            </div>
                                            <div className="pb-6 flex-1">
                                                <p className="text-gray-700 dark:text-gray-250 font-medium whitespace-pre-wrap">{update.note}</p>
                                                
                                                {/* Print da nota de atualizacao */}
                                                {(update.attachment_url || (update.attachments && update.attachments.length > 0)) && (
                                                    <div className="mt-3">
                                                        <div
                                                            onClick={() => setLightboxImage({
                                                                url: update.attachment_url || update.attachments[0]?.url,
                                                                title: `Print da Atualização : ${new Date(update.created_at).toLocaleString()}`
                                                            })}
                                                            className="group relative inline-block cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-black/10 dark:bg-black/30 hover:border-blue-500 transition-all max-w-xs shadow-sm"
                                                        >
                                                            <img
                                                                src={update.attachment_url || update.attachments[0]?.url}
                                                                alt="Print da atualização"
                                                                className="h-28 w-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                                                                <ZoomIn className="w-4 h-4" />
                                                                <span>Ampliar Print</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="text-xs text-gray-550 dark:text-gray-450 mt-2 flex items-center gap-1 font-semibold">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(update.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-450 font-medium">Nenhuma atualização ainda.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Modal Lightbox para visualizacao ampliada */}
            <ImageLightboxModal
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
                imageUrl={lightboxImage?.url}
                title={lightboxImage?.title}
            />
        </>
    );
};

export default TrackTicket;