import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Calculator, Loader2, LifeBuoy, Copy, CheckCircle2, DollarSign, Users, HelpCircle, Info, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// Importação do logotipo oficial do WhatsApp para os canais de atendimento e suporte
import WhatsAppIcon from '@/components/common/WhatsAppIcon';

const Contact = () => {
    const { config } = useSiteConfig();
    const { toast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeForm, setActiveForm] = useState('contact');
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [generatedTicketCode, setGeneratedTicketCode] = useState('');

    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'Parceria', message: '' });
    const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', deadline: '', description: '' });
    const [supportForm, setSupportForm] = useState({ name: '', email: '', subject: '', description: '', priority: 'normal' });

    useEffect(() => {
        if (user) {
            setSupportForm(prev => ({
                ...prev,
                name: prev.name || user.user_metadata?.full_name || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    // --- Configuration Lists ---
    const services = ['Design Gráfico', 'Fotografia', 'Sites', 'Dashboards Power BI', 'Vídeos com IA', 'Tráfego Pago', 'Manutenção PC', 'Câmeras CFTV', 'Outro'];

    const budgetRanges = [
        { label: 'Até R$ 1k', value: 'Até R$ 1.000' },
        { label: 'R$ 1k - 5k', value: 'R$ 1.000 - R$ 5.000' },
        { label: 'R$ 5k - 10k', value: 'R$ 5.000 - R$ 10.000' },
        { label: 'R$ 10k - 25k', value: 'R$ 10.000 - R$ 25.000' },
        { label: '+ R$ 25k', value: 'Acima de R$ 25.000' },
        { label: 'A definir', value: 'A definir' }
    ];

    const contactSubjects = [
        { label: 'Parceria', icon: Users },
        { label: 'Dúvida Geral', icon: HelpCircle },
        { label: 'Feedback', icon: MessageSquare },
        { label: 'Outro', icon: Info }
    ];

    const supportPriorities = [
        { label: 'Baixa', value: 'low', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500' },
        { label: 'Normal', value: 'normal', color: 'bg-lime-500/20 dark:bg-[#bcf13b]/20 text-[#4d7c0f] dark:text-[#bcf13b] border-lime-600 dark:border-[#bcf13b]' },
        { label: 'Alta', value: 'high', color: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500' }
    ];

    // --- Handlers ---
    const handleFormChange = (formName, setForm) => (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelection = (setForm, field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const generateTicketCode = () => `RPS-${Date.now().toString().slice(-6)}`;

    const handleSubmit = async (e, formType, formData, setFormData) => {
        e.preventDefault();

        // Validation
        let requiredFields = [];
        if (formType === 'contact') requiredFields = ['name', 'email', 'message'];
        if (formType === 'quote') requiredFields = ['name', 'email', 'service', 'description'];
        if (formType === 'support') requiredFields = ['name', 'email', 'subject', 'description'];

        for (const field of requiredFields) {
            if (!formData[field]) {
                toast({ variant: "destructive", title: "Campos obrigatórios", description: `Por favor, preencha o campo: ${field}.` });
                return;
            }
        }
        setLoading(true);

        // Prep Data
        let dataToInsert = { ...formData };
        let tableName = '';
        let successTitle = '';
        let successDescription = '';

        switch (formType) {
            case 'contact':
                tableName = 'contacts';
                successTitle = 'Mensagem Enviada!';
                successDescription = 'Obrigado por entrar em contato. Retornaremos em breve.';
                break;
            case 'quote':
                tableName = 'quotes';
                successTitle = 'Orçamento Solicitado!';
                successDescription = 'Recebemos seu pedido. Entraremos em contato para mais detalhes.';
                break;
            case 'support':
                tableName = 'support_tickets';
                const ticketCode = generateTicketCode();
                dataToInsert = {
                    ...dataToInsert,
                    ticket_code: ticketCode,
                    user_id: user?.id || null,
                };
                successTitle = 'Chamado Aberto!';
                successDescription = 'Seu chamado de suporte foi criado com sucesso.';
                setGeneratedTicketCode(ticketCode);
                break;
            default:
                setLoading(false);
                return;
        }

        const { error } = await supabase.from(tableName).insert([dataToInsert]);
        setLoading(false);

        if (error) {
            toast({
                variant: "destructive",
                title: "Falha no Envio da Mensagem",
                description: error.message || "Servidor instável no momento. Verifique sua conexão e tente novamente em alguns instantes."
            });
            console.error(error);
        } else {
            toast({ title: successTitle, description: successDescription });
            // Reset forms
            const resetState = Object.fromEntries(Object.keys(formData).map(key => [key, (key === 'subject' && formType === 'contact') ? 'Parceria' : (key === 'priority' && formType === 'support') ? 'normal' : '']));

            // Re-populate user data if logged in
            if (user && formType === 'support') {
                setFormData({ ...resetState, name: user.user_metadata?.full_name || '', email: user.email || '', priority: 'normal' });
            } else if (formType === 'contact') {
                setFormData({ ...resetState, subject: 'Parceria' });
            } else {
                setFormData(resetState);
            }

            if (formType === 'support') {
                setShowTicketModal(true);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedTicketCode);
        toast({ title: 'Copiado!', description: 'Código do chamado copiado para a área de transferência.' });
    };

    const contactEmail = config?.contact_email || 'contato@rafaelpitaoficial.com.br';
    const contactPhone = config?.contact_phone || '(21) 96614-9077';
    const contactAddress = config?.contact_address || 'Rio de Janeiro, RJ - Brasil';
    const whatsappNumber = contactPhone.replace(/\D/g, '');

    // Canais de informacao e suporte : Substituicao do icone generico de telefone pela logo oficial do WhatsApp
    const contactInfo = [
        { icon: Mail, title: 'Email', info: contactEmail, link: `mailto:${contactEmail}` },
        { icon: WhatsAppIcon, title: 'WhatsApp / Suporte', info: contactPhone, link: config?.social_links?.whatsapp || `https://wa.me/55${whatsappNumber}` },
        { icon: MapPin, title: 'Localização', info: contactAddress, link: '#' },
        { icon: Clock, title: 'Horário', info: 'Seg - Sex: 9h às 18h', link: '#' }
    ];

    return (
        <>
            <Helmet>
                <title>Contato e Suporte - Rafael Pita Solutions</title>
                <meta name="description" content="Entre em contato, solicite orçamentos ou abra um chamado de suporte. Estamos prontos para ajudar." />
            </Helmet>

            <div className="pt-20 min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08] tech-pattern">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
                            Fale <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Conosco</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                            Pronto para transformar suas ideias em realidade? Vamos conversar sobre seu próximo projeto ou resolver qualquer questão.
                        </motion.p>
                    </div>
                </section>

                <section className="py-12 bg-slate-100/60 dark:bg-[#0a0a08] border-y border-slate-200 dark:border-[#23231f] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="text-center p-6 rounded-xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all shadow-sm">
                                <div className="w-16 h-16 mx-auto mb-4 bg-slate-50 dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] rounded-full flex items-center justify-center">
                                    <info.icon className="w-8 h-8 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{info.title}</h3>
                                <a href={info.link} className="text-slate-600 dark:text-gray-400 hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] transition-colors block font-medium">{info.info}</a>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08]" id="form-section">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* --- Tab Navigation --- */}
                        <div className="flex justify-center mb-12">
                            <div className="bg-slate-200/70 dark:bg-[#121210] border border-slate-300/80 dark:border-[#23231f] p-2 rounded-xl flex flex-wrap justify-center gap-2 shadow-sm dark:shadow-2xl">
                                <Button onClick={() => setActiveForm('contact')} variant={activeForm === 'contact' ? 'default' : 'ghost'} className={`h-11 px-4 sm:px-8 text-sm sm:text-base rounded-lg transition-all ${activeForm === 'contact' ? 'bg-[#bcf13b] text-[#0a0a08] font-bold shadow-lg shadow-[#bcf13b]/20 hover:bg-[#a8df2a]' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#181814]'}`}><MessageSquare className="w-4 h-4 mr-2" />Contato</Button>
                                <Button onClick={() => setActiveForm('quote')} variant={activeForm === 'quote' ? 'default' : 'ghost'} className={`h-11 px-4 sm:px-8 text-sm sm:text-base rounded-lg transition-all ${activeForm === 'quote' ? 'bg-[#bcf13b] text-[#0a0a08] font-bold shadow-lg shadow-[#bcf13b]/20 hover:bg-[#a8df2a]' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#181814]'}`}><Calculator className="w-4 h-4 mr-2" />Orçamento</Button>
                                <Button onClick={() => setActiveForm('support')} variant={activeForm === 'support' ? 'default' : 'ghost'} className={`h-11 px-4 sm:px-8 text-sm sm:text-base rounded-lg transition-all ${activeForm === 'support' ? 'bg-[#bcf13b] text-[#0a0a08] font-bold shadow-lg shadow-[#bcf13b]/20 hover:bg-[#a8df2a]' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#181814]'}`}><LifeBuoy className="w-4 h-4 mr-2" />Suporte</Button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeForm} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-[#23231f] shadow-xl bg-white dark:bg-[#121210] transition-colors">

                                {/* --- CONTACT FORM --- */}
                                {activeForm === 'contact' && (
                                    <>
                                        <div className="text-center mb-10">
                                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Envie uma Mensagem</h2>
                                            <p className="text-slate-600 dark:text-gray-400">Dúvidas gerais ou parcerias? Escreva pra gente.</p>
                                        </div>
                                        <form onSubmit={(e) => handleSubmit(e, 'contact', contactForm, setContactForm)} className="space-y-6 max-w-2xl mx-auto">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-14 text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" type="text" name="name" placeholder="Nome *" value={contactForm.name} onChange={handleFormChange('contact', setContactForm)} required />
                                                <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-14 text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" type="email" name="email" placeholder="Email *" value={contactForm.email} onChange={handleFormChange('contact', setContactForm)} required />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-400 ml-1">Assunto</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {contactSubjects.map(sub => (
                                                        <button
                                                            key={sub.label}
                                                            type="button"
                                                            onClick={() => handleSelection(setContactForm, 'subject', sub.label)}
                                                            className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${contactForm.subject === sub.label
                                                                ? 'bg-lime-500/10 dark:bg-[#bcf13b]/10 border-lime-600 dark:border-[#bcf13b] text-[#4d7c0f] dark:text-[#bcf13b] shadow-sm'
                                                                : 'bg-slate-50 dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-600 dark:text-gray-400 hover:border-lime-500/50 dark:hover:border-[#bcf13b]/50 hover:text-slate-900 dark:hover:text-white'}`}
                                                        >
                                                            <sub.icon className="w-4 h-4" />
                                                            {sub.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Textarea className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] text-lg min-h-[150px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" name="message" placeholder="Sua mensagem *" value={contactForm.message} onChange={handleFormChange('contact', setContactForm)} required />

                                            <Button type="submit" className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold py-6 text-lg shadow-lg shadow-[#bcf13b]/20 transition-all rounded-xl" disabled={loading}>
                                                {loading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Send className="w-6 h-6 mr-2" />}
                                                {loading ? 'Enviando...' : 'Enviar Mensagem'}
                                            </Button>
                                        </form>
                                    </>
                                )}

                                {/* --- QUOTE FORM --- */}
                                {activeForm === 'quote' && (
                                    <>
                                        <div className="text-center mb-10">
                                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Solicitar Orçamento</h2>
                                            <p className="text-slate-600 dark:text-gray-400">Conte sobre seu projeto e receba uma proposta personalizada.</p>
                                        </div>
                                        <form onSubmit={(e) => handleSubmit(e, 'quote', quoteForm, setQuoteForm)} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-400 ml-1">Seus Dados</label>
                                                    <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" type="text" name="name" placeholder="Seu Nome *" value={quoteForm.name} onChange={handleFormChange('quote', setQuoteForm)} required />
                                                    <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" type="email" name="email" placeholder="Seu Email *" value={quoteForm.email} onChange={handleFormChange('quote', setQuoteForm)} required />
                                                    <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" type="tel" name="phone" placeholder="WhatsApp / Telefone" value={quoteForm.phone} onChange={handleFormChange('quote', setQuoteForm)} />
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-gray-400 ml-1">O que você precisa?</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {services.map(s => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => handleSelection(setQuoteForm, 'service', s)}
                                                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${quoteForm.service === s
                                                                    ? 'bg-[#bcf13b] border-[#bcf13b] text-[#0a0a08] shadow-md font-bold'
                                                                    : 'bg-slate-50 dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-600 dark:text-gray-400 hover:border-lime-500/50 dark:hover:border-[#bcf13b]/50 hover:text-slate-900 dark:hover:text-white'}`}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-400 ml-1">Orçamento Estimado</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                                    {budgetRanges.map(b => (
                                                        <button
                                                            key={b.value}
                                                            type="button"
                                                            onClick={() => handleSelection(setQuoteForm, 'budget', b.value)}
                                                            className={`p-3 rounded-xl text-sm font-bold border flex flex-col items-center justify-center gap-1 transition-all h-20 ${quoteForm.budget === b.value
                                                                ? 'bg-lime-500/10 dark:bg-[#bcf13b]/10 border-lime-600 dark:border-[#bcf13b] text-[#4d7c0f] dark:text-[#bcf13b] shadow-sm'
                                                                : 'bg-slate-50 dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-600 dark:text-gray-400 hover:border-lime-500/50 dark:hover:border-[#bcf13b]/50 hover:text-slate-900 dark:hover:text-white'}`}
                                                        >
                                                            <DollarSign className={`w-4 h-4 ${quoteForm.budget === b.value ? 'text-[#4d7c0f] dark:text-[#bcf13b]' : 'text-slate-400 dark:text-gray-500'}`} />
                                                            {b.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-400 ml-1">Detalhes do Projeto</label>
                                                <Textarea className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] min-h-[120px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" name="description" placeholder="Descreva sua ideia, prazos desejados ou referências..." value={quoteForm.description} onChange={handleFormChange('quote', setQuoteForm)} required />
                                            </div>

                                            <Button type="submit" className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold py-6 text-lg shadow-lg shadow-[#bcf13b]/20 transition-all rounded-xl mt-4" disabled={loading}>
                                                {loading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Calculator className="w-6 h-6 mr-2" />}
                                                {loading ? 'Enviando Proposta...' : 'Solicitar Orçamento Grátis'}
                                            </Button>
                                        </form>
                                    </>
                                )}

                                {/* --- SUPPORT FORM --- */}
                                {activeForm === 'support' && (
                                    <>
                                        <div className="text-center mb-10 space-y-3">
                                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Suporte Técnico</h2>
                                            <p className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto">Já é cliente? Abra um chamado detalhado para nossa equipe ou esclareça dúvidas emergenciais diretamente no WhatsApp.</p>
                                            
                                            {/* Canal rápido de atendimento de suporte via WhatsApp */}
                                            <div className="pt-2">
                                                <a
                                                    href={config?.social_links?.whatsapp || `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent('Olá Rafael! Gostaria de suporte técnico para o meu projeto/serviço.')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1e8343] dark:text-[#25D366] border border-[#25D366]/30 shadow-sm transition-all"
                                                >
                                                    <WhatsAppIcon className="w-4 h-4" />
                                                    Atendimento Imediato no WhatsApp
                                                </a>
                                            </div>
                                        </div>
                                        <form onSubmit={(e) => handleSubmit(e, 'support', supportForm, setSupportForm)} className="space-y-6 max-w-2xl mx-auto">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-14 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl disabled:opacity-60" type="text" name="name" placeholder="Seu Nome *" value={supportForm.name} onChange={handleFormChange('support', setSupportForm)} required disabled={!!user} />
                                                <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-14 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl disabled:opacity-60" type="email" name="email" placeholder="Seu Email *" value={supportForm.email} onChange={handleFormChange('support', setSupportForm)} required disabled={!!user} />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-gray-400 ml-1">Prioridade</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {supportPriorities.map(p => (
                                                        <button
                                                            key={p.value}
                                                            type="button"
                                                            onClick={() => handleSelection(setSupportForm, 'priority', p.value)}
                                                            className={`py-3 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${supportForm.priority === p.value
                                                                ? `${p.color} border-current shadow-md`
                                                                : 'bg-slate-50 dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-600 dark:text-gray-400 hover:border-slate-400 dark:hover:border-gray-600 hover:text-slate-900 dark:hover:text-white'}`}
                                                        >
                                                            <ShieldAlert className="w-4 h-4" />
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Input className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] h-14 text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" type="text" name="subject" placeholder="Assunto do problema *" value={supportForm.subject} onChange={handleFormChange('support', setSupportForm)} required />
                                            <Textarea className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] focus:border-lime-500 dark:focus:border-[#bcf13b] focus:ring-1 focus:ring-lime-500 dark:focus:ring-[#bcf13b] text-lg min-h-[150px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl" name="description" placeholder="Descreva detalhadamente o que está acontecendo..." value={supportForm.description} onChange={handleFormChange('support', setSupportForm)} rows={5} required />

                                            <Button type="submit" className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold py-6 text-lg shadow-lg shadow-[#bcf13b]/20 transition-all rounded-xl" disabled={loading}>
                                                {loading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <LifeBuoy className="w-6 h-6 mr-2" />}
                                                {loading ? 'Processando...' : 'Abrir Ticket'}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>
            </div>

            <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
                <DialogContent className="bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#4d7c0f] dark:text-[#bcf13b]"><CheckCircle2 className="w-6 h-6" /> Chamado Criado!</DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-gray-400">Seu ticket foi gerado com sucesso. Guarde o código abaixo.</DialogDescription>
                    </DialogHeader>
                    <div className="my-6 p-6 bg-slate-100 dark:bg-[#0a0a08] border border-slate-200 dark:border-[#23231f] rounded-xl flex items-center justify-between group cursor-pointer" onClick={copyToClipboard}>
                        <span className="text-2xl font-mono font-bold text-[#4d7c0f] dark:text-[#bcf13b] tracking-wider">{generatedTicketCode}</span>
                        <Button size="icon" variant="ghost" className="text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:group-hover:text-white"><Copy className="h-6 w-6" /></Button>
                    </div>
                    {/* Botão de envio rápido do protocolo para suporte via WhatsApp */}
                    <a
                        href={`https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(`Olá! Acabei de abrir o chamado ${generatedTicketCode} e gostaria de acompanhamento da equipe de suporte.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md transition-colors"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        Acompanhar Chamado no WhatsApp
                    </a>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Contact;