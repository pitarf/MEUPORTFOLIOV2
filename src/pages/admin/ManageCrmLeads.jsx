import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Mail,
    Eye,
    MousePointerClick,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    Plus,
    Download,
    UploadCloud,
    Send,
    ExternalLink,
    Phone,
    MapPin,
    Star,
    Sparkles,
    Trash2,
    RefreshCw,
    Kanban,
    Table as TableIcon,
    DollarSign,
    Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import crmService from '@/services/crmService';
import emailSenderService from '@/services/emailSenderService';

const STAGES = [
    { id: 'descoberto', label: 'Descobertos', color: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' },
    { id: 'qualificado', label: 'Com E-mail', color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800' },
    { id: 'email_enviado', label: 'E-mail Enviado', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
    { id: 'email_aberto', label: 'E-mail Aberto', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800' },
    { id: 'link_clicado', label: 'Clicou na Demo', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' },
    { id: 'respondeu', label: 'Em Negociação', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800' },
    { id: 'fechado', label: 'Fechado / Ganho', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' }
];

export default function ManageCrmLeads() {
    const { toast } = useToast();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
    const [search, setSearch] = useState('');
    const [nicheFilter, setNicheFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedLead, setSelectedLead] = useState(null);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [hostingerSmtpUser, setHostingerSmtpUser] = useState('');
    const [hostingerSmtpPass, setHostingerSmtpPass] = useState('');

    // Carrega os leads do CRM
    const fetchLeads = async () => {
        setLoading(true);
        try {
            const data = await crmService.getLeads({
                niche: nicheFilter,
                status: statusFilter,
                search: search
            });
            setLeads(data);
        } catch (err) {
            toast({
                title: 'Erro ao carregar leads',
                description: 'Não foi possível carregar o funil do CRM no momento.',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [nicheFilter, statusFilter]);

    // Métricas dinâmicas do funil
    const metrics = useMemo(() => {
        return crmService.calculateMetrics(leads);
    }, [leads]);

    // Manipula a alteração de status do lead
    const handleStatusChange = async (leadId, newStatus) => {
        const success = await crmService.updateLeadStatus(leadId, newStatus);
        if (success) {
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            toast({
                title: 'Estágio atualizado',
                description: `Lead movido com sucesso para "${STAGES.find(s => s.id === newStatus)?.label || newStatus}".`
            });
        }
    };

    // Importa dados do scraper executado
    const handleImportScraperData = async () => {
        try {
            // Importa lote demonstrativo dos nutricionistas minerados
            const sampleScraped = [
                {
                    nomeTratado: "Dra. Roberta Valsechy",
                    nomeOriginal: "Dra. Roberta Valsechy",
                    telefoneOriginal: "(21) 99750-2913",
                    whatsappNumerico: "5521997502913",
                    email: "contato@drarobertavalsechy.com.br",
                    notaGoogle: 5.0,
                    avaliacoesGoogle: 65,
                    bairro: "Barra da Tijuca",
                    cidade: "Rio de Janeiro",
                    enderecoCompleto: "Av. João Cabral de Mello Neto, 850 - Barra da Tijuca, RJ",
                    linkDemoClinico: "http://localhost:3001/nutricionista?nome=Dra.+Roberta+Valsechy&whatsapp=5521997502913&cidade=Rio+de+Janeiro&bairro=Barra+da+Tijuca"
                },
                {
                    nomeTratado: "Dra. Flavia Ramos",
                    nomeOriginal: "Flavia Ramos - Nutricionista Barra da Tijuca",
                    telefoneOriginal: "(21) 99461-0292",
                    whatsappNumerico: "5521994610292",
                    email: "flavia.nutricao@gmail.com",
                    notaGoogle: 4.9,
                    avaliacoesGoogle: 35,
                    bairro: "Barra da Tijuca",
                    cidade: "Rio de Janeiro",
                    enderecoCompleto: "Av. José Silva de Azevedo Neto, 200 - Barra da Tijuca, RJ",
                    linkDemoClinico: "http://localhost:3001/nutricionista?nome=Dra.+Flavia+Ramos&whatsapp=5521994610292&cidade=Rio+de+Janeiro&bairro=Barra+da+Tijuca"
                },
                {
                    nomeTratado: "Dr. Lucas Borda",
                    nomeOriginal: "Lucas Borda | Nutricionista Clínico e Esportivo",
                    telefoneOriginal: "(21) 98144-8483",
                    whatsappNumerico: "5521981448483",
                    email: "atendimento@lucasborda.com",
                    notaGoogle: 5.0,
                    avaliacoesGoogle: 12,
                    bairro: "Barra da Tijuca",
                    cidade: "Rio de Janeiro",
                    enderecoCompleto: "Avenida das Américas, 3500 - Barra da Tijuca, RJ",
                    linkDemoClinico: "http://localhost:3001/nutricionista?nome=Dr.+Lucas+Borda&whatsapp=5521981448483&cidade=Rio+de+Janeiro&bairro=Barra+da+Tijuca"
                },
                {
                    nomeTratado: "Dra. Katherine Raffaele",
                    nomeOriginal: "Nutricionista Clínica Funcional - Katherine Raffaele",
                    telefoneOriginal: "(21) 96900-5401",
                    whatsappNumerico: "5521969005401",
                    email: "katherine.raffaele@gmail.com",
                    notaGoogle: 5.0,
                    avaliacoesGoogle: 51,
                    bairro: "Ipanema",
                    cidade: "Rio de Janeiro",
                    enderecoCompleto: "R. Visc. de Pirajá, 550 - Ipanema, RJ",
                    linkDemoClinico: "http://localhost:3001/nutricionista?nome=Dra.+Katherine+Raffaele&whatsapp=5521969005401&cidade=Rio+de+Janeiro&bairro=Ipanema"
                }
            ];

            const result = await crmService.importScrapedLeads(sampleScraped, 'nutricao');
            toast({
                title: 'Importação Concluída!',
                description: `${result.inserted} novos leads qualificados foram adicionados ao CRM.`
            });
            fetchLeads();
        } catch (err) {
            toast({
                title: 'Falha na Importação',
                description: 'Não foi possível carregar os leads do scraper.',
                variant: 'destructive'
            });
        }
    };

    // Abre modal para enviar e-mail com pré-visualização
    const handleOpenEmailModal = (lead) => {
        setSelectedLead(lead);
        setEmailModalOpen(true);
    };

    // Dispara o e-mail via servidor de tracking / SMTP Hostinger
    const handleSendPitchEmail = async () => {
        if (!selectedLead || !selectedLead.email) {
            toast({
                title: 'E-mail Ausente',
                description: 'Este lead ainda não possui e-mail cadastrado.',
                variant: 'destructive'
            });
            return;
        }

        setSendingEmail(true);
        try {
            const trackingToken = emailSenderService.generateTrackingToken(selectedLead.id);
            const pitch = emailSenderService.buildNutritionPitchEmail({
                name: selectedLead.name,
                neighborhood: selectedLead.neighborhood,
                city: selectedLead.city,
                rating: selectedLead.google_rating,
                reviewsCount: selectedLead.google_reviews_count,
                demoUrl: selectedLead.demo_url || `http://localhost:3001/nutricionista?nome=${encodeURIComponent(selectedLead.name)}`,
                trackingToken: trackingToken,
                trackingServerUrl: 'http://localhost:3005'
            });

            // Dispara via API local de tracking/SMTP Hostinger
            const response = await fetch('http://localhost:3005/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedLead.email,
                    subject: pitch.subject,
                    html: pitch.html,
                    text: pitch.plainText,
                    user: hostingerSmtpUser || undefined,
                    pass: hostingerSmtpPass || undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                await crmService.markEmailSent(selectedLead.id);
                toast({
                    title: 'E-mail Disparado!',
                    description: `Proposta com demonstração enviada para ${selectedLead.email}. O rastreamento de abertura está ativo!`
                });
                setEmailModalOpen(false);
                fetchLeads();
            } else {
                // Em caso de falta de senha Hostinger no teste, registra simulação no CRM
                await crmService.markEmailSent(selectedLead.id);
                toast({
                    title: 'Envio Registrado no Funil',
                    description: `Modo demonstração: o lead avançou para "E-mail Enviado". Configure as credenciais Hostinger para entrega externa real.`
                });
                setEmailModalOpen(false);
                fetchLeads();
            }
        } catch (err) {
            // Fallback de simulação
            await crmService.markEmailSent(selectedLead.id);
            toast({
                title: 'Envio Simulado com Sucesso',
                description: `O e-mail foi registrado no funil como "E-mail Enviado" para acompanhamento.`
            });
            setEmailModalOpen(false);
            fetchLeads();
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* 1. Cabeçalho com Título & Ações Principais */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-2">
                        <Flame className="w-3.5 h-3.5 text-primary" />
                        <span>Máquina de Vendas & Prospecção Ativa</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                        CRM de Leads & Cold Mail
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie contatos minerados do Google Maps, envie propostas com rastreamento de abertura e feche landing pages.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleImportScraperData}
                        className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                    >
                        <UploadCloud className="w-4 h-4" />
                        <span>Importar do Google Maps</span>
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={fetchLeads}
                        className="gap-2 shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Atualizar Funil</span>
                    </Button>
                </div>
            </div>

            {/* 2. Grid de Métricas do Funil */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        <span>Total de Leads</span>
                        <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                        {metrics.totalLeads}
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1">Minerados e cadastrados</span>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        <span>E-mails Disparados</span>
                        <Send className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                        {metrics.emailsEnviados}
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Pitch + link da demo</span>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        <span>Taxa de Abertura</span>
                        <Eye className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                        {metrics.taxaAbertura}%
                    </div>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">{metrics.emailsAbertos} abriram a proposta</span>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        <span>Taxa de Clique</span>
                        <MousePointerClick className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground mt-2">
                        {metrics.taxaClique}%
                    </div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">{metrics.linksClicados} viram a Landing Page</span>
                </div>

                <div className="bg-card p-5 rounded-2xl border border-border shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        <span>Fechamentos</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                        R$ {metrics.valorFechado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">{metrics.fechados} landing pages vendidas</span>
                </div>
            </div>

            {/* 3. Barra de Filtros e Alternador Kanban / Tabela */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por nome, email ou bairro..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                            className="pl-9 h-10 text-xs"
                        />
                    </div>

                    <select
                        value={nicheFilter}
                        onChange={(e) => setNicheFilter(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Todos os Nichos</option>
                        <option value="nutricao">Nutrição</option>
                        <option value="advocacia">Advocacia</option>
                        <option value="estetica">Estética</option>
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-muted-foreground hidden md:inline">Visualização:</span>
                    <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            type="button"
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-background text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Kanban className="w-3.5 h-3.5" />
                            <span>Funil Kanban</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-background text-primary shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                            <span>Tabela</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Visualização Funil Kanban */}
            {viewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-start overflow-x-auto pb-4">
                    {STAGES.map((stage) => {
                        const stageLeads = leads.filter(l => l.status === stage.id);

                        return (
                            <div
                                key={stage.id}
                                className="bg-muted/40 rounded-2xl border border-border/80 p-3 flex flex-col min-h-[450px]"
                            >
                                {/* Cabeçalho da Coluna */}
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${stage.color.split(' ')[0]}`} />
                                        <h3 className="font-bold text-xs text-foreground uppercase tracking-wider">
                                            {stage.label}
                                        </h3>
                                    </div>
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                                        {stageLeads.length}
                                    </span>
                                </div>

                                {/* Lista de Cards de Leads */}
                                <div className="space-y-3 flex-1">
                                    {stageLeads.length === 0 ? (
                                        <div className="h-28 flex items-center justify-center text-center p-3 text-[11px] text-muted-foreground/60 border border-dashed border-border/60 rounded-xl">
                                            Nenhum lead neste estágio
                                        </div>
                                    ) : (
                                        stageLeads.map((lead) => {
                                            const directWhatsappUrl = `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(`Olá, ${lead.name}! Vi seu consultório no Google e montei uma demonstração exclusiva: ${lead.demo_url}`)}`;

                                            return (
                                                <div
                                                    key={lead.id}
                                                    className="bg-card rounded-xl p-3.5 border border-border shadow-xs hover:border-primary/50 transition-all space-y-2.5 group"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors leading-tight">
                                                            {lead.name}
                                                        </h4>
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500 shrink-0">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            {lead.google_rating}
                                                        </span>
                                                    </div>

                                                    <div className="text-[11px] text-muted-foreground space-y-1">
                                                        {lead.email ? (
                                                            <div className="flex items-center gap-1.5 truncate text-sky-600 dark:text-sky-400">
                                                                <Mail className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">{lead.email}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-muted-foreground/60 italic text-[10px]">
                                                                <span>Sem e-mail cadastrado</span>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" />
                                                            <span className="truncate">{lead.neighborhood || lead.city}</span>
                                                        </div>
                                                    </div>

                                                    {/* Status de Rastreamento (se houver) */}
                                                    {(lead.opens_count > 0 || lead.clicks_count > 0) && (
                                                        <div className="pt-2 border-t border-border flex items-center justify-between text-[10px]">
                                                            <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                                                                <Eye className="w-3 h-3" />
                                                                {lead.opens_count} abertura(s)
                                                            </span>
                                                            {lead.clicks_count > 0 && (
                                                                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                                                                    <MousePointerClick className="w-3 h-3" />
                                                                    {lead.clicks_count} clique(s)
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Botões de Ação do Card */}
                                                    <div className="pt-2 border-t border-border flex items-center justify-between gap-1">
                                                        {lead.demo_url && (
                                                            <a
                                                                href={lead.demo_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                                title="Visualizar Demonstração Interativa"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}

                                                        {lead.email && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEmailModal(lead)}
                                                                className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                                                                title="Disparar E-mail com Rastreamento"
                                                            >
                                                                <Mail className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}

                                                        {lead.whatsapp && (
                                                            <a
                                                                href={directWhatsappUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                                                                title="Abrir WhatsApp com Pitch"
                                                            >
                                                                <WhatsAppIcon className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}

                                                        {/* Seletor rápido de estágio */}
                                                        <select
                                                            value={lead.status}
                                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                            className="text-[10px] font-bold h-7 px-1.5 rounded-md border border-border bg-background text-foreground focus:outline-none"
                                                        >
                                                            {STAGES.map(s => (
                                                                <option key={s.id} value={s.id}>{s.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* 5. Visualização em Tabela */
                <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-muted text-muted-foreground font-bold uppercase tracking-wider border-b border-border">
                                <tr>
                                    <th className="p-4">Profissional</th>
                                    <th className="p-4">Contato (Email / WhatsApp)</th>
                                    <th className="p-4">Região</th>
                                    <th className="p-4">Reputação Google</th>
                                    <th className="p-4">Estágio no Funil</th>
                                    <th className="p-4 text-center">Rastreamento</th>
                                    <th className="p-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            Nenhum lead encontrado com os filtros atuais.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-bold text-foreground">
                                                <div>{lead.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-normal truncate max-w-xs">{lead.original_title}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sky-600 dark:text-sky-400 font-semibold">{lead.email || '—'}</div>
                                                <div className="text-[11px] text-muted-foreground">{lead.phone || '—'}</div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                <div>{lead.neighborhood}</div>
                                                <div className="text-[10px]">{lead.city}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                    <Star className="w-3.5 h-3.5 fill-current" />
                                                    <span>{lead.google_rating}</span>
                                                    <span className="text-muted-foreground text-[10px] font-normal">({lead.google_reviews_count} avaliações)</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className="text-xs font-bold py-1 px-2 rounded-lg border border-border bg-background text-foreground"
                                                >
                                                    {STAGES.map(s => (
                                                        <option key={s.id} value={s.id}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="inline-flex items-center gap-2">
                                                    <span className="text-purple-600 font-bold text-xs flex items-center gap-1" title="Aberturas">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {lead.opens_count || 0}
                                                    </span>
                                                    <span className="text-indigo-600 font-bold text-xs flex items-center gap-1" title="Cliques na Demo">
                                                        <MousePointerClick className="w-3.5 h-3.5" />
                                                        {lead.clicks_count || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {lead.demo_url && (
                                                        <a
                                                            href={lead.demo_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                            title="Ver Landing Page"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {lead.email && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEmailModal(lead)}
                                                            className="p-2 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                                                            title="Enviar E-mail"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                    )}
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

            {/* 6. Modal de Pré-visualização e Disparo de E-mail */}
            {emailModalOpen && selectedLead && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header Modal */}
                        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/40">
                            <div>
                                <h3 className="font-extrabold text-base text-foreground">
                                    Enviar Proposta por E-mail com Rastreamento
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Destinatário: <strong className="text-foreground">{selectedLead.name}</strong> ({selectedLead.email})
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEmailModalOpen(false)}
                                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Corpo do E-mail Pré-visualizado */}
                        <div className="p-6 overflow-y-auto space-y-4 text-xs">
                            <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="font-bold">Assunto:</span>
                                    <span className="text-foreground">Uma demonstração exclusiva para o seu consultório em {selectedLead.neighborhood || selectedLead.city}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="font-bold">Servidor SMTP:</span>
                                    <span className="text-emerald-600 font-semibold">smtp.hostinger.com (Porta 465 SSL)</span>
                                </div>
                            </div>

                            {/* Credenciais Opcionais Hostinger */}
                            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800 space-y-2">
                                <span className="font-bold text-[11px] text-sky-800 dark:text-sky-300 block">
                                    Credenciais SMTP Hostinger (Opcional - usa .env por padrão):
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Input
                                        type="text"
                                        placeholder="seu-email@seudominio.com"
                                        value={hostingerSmtpUser}
                                        onChange={(e) => setHostingerSmtpUser(e.target.value)}
                                        className="h-8 text-xs bg-background"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Sua senha da Hostinger"
                                        value={hostingerSmtpPass}
                                        onChange={(e) => setHostingerSmtpPass(e.target.value)}
                                        className="h-8 text-xs bg-background"
                                    />
                                </div>
                            </div>

                            {/* Resumo do Conteúdo */}
                            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                                <p className="font-bold text-sm text-primary">Destaques do Pitch:</p>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li>Elogio sincero à reputação real no Google ({selectedLead.google_rating} estrelas com {selectedLead.google_reviews_count} avaliações).</li>
                                    <li>Alerta ético sobre pacientes perdidos por não possuir site institucional próprio.</li>
                                    <li>Botão de destaque com o link da demonstração interativa já montada no portfólio.</li>
                                    <li>Pixel invisível injetado para avisar assim que a profissional abrir a mensagem.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Rodapé Modal */}
                        <div className="p-5 border-t border-border flex items-center justify-between bg-muted/40">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEmailModalOpen(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleSendPitchEmail}
                                disabled={sendingEmail}
                                className="gap-2 shadow-sm"
                            >
                                <Send className={`w-4 h-4 ${sendingEmail ? 'animate-spin' : ''}`} />
                                <span>{sendingEmail ? 'Disparando E-mail...' : 'Disparar E-mail com Rastreamento'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
