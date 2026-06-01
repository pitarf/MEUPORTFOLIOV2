import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext'; // Import context
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
        { label: 'Baixa', value: 'low', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
        { label: 'Normal', value: 'normal', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
        { label: 'Alta', value: 'high', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
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
                    // Ensure priority is set
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
            toast({ variant: "destructive", title: "Erro ao enviar", description: "Houve um problema. Tente novamente." });
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
    // Clean phone for whatsapp link (remove non-digits)
    const whatsappNumber = contactPhone.replace(/\D/g, '');


    const contactInfo = [
        { icon: Mail, title: 'Email', info: contactEmail, link: `mailto:${contactEmail}` },
        { icon: Phone, title: 'Telefone', info: contactPhone, link: config?.social_links?.whatsapp || `https://wa.me/55${whatsappNumber}` },
        { icon: MapPin, title: 'Localização', info: contactAddress, link: '#' },
        { icon: Clock, title: 'Horário', info: 'Seg - Sex: 9h às 18h', link: '#' }
    ];

    return (
        <>
            <Helmet>
                <title>Contato e Suporte - Rafael Pita Solutions</title>
                <meta name="description" content="Entre em contato, solicite orçamentos ou abra um chamado de suporte. Estamos prontos para ajudar." />
            </Helmet>

            <div className="pt-20">
                <section className="py-20 tech-pattern">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold mb-6"><span className="gradient-text">Fale Conosco</span></motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Pronto para transformar suas ideias em realidade? Vamos conversar sobre seu próximo projeto ou resolver qualquer questão.</motion.p>
                    </div>
                </section>

                <section className="py-12 bg-white/40 dark:bg-gray-900/50 border-y border-gray-200/50 dark:border-white/5 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="text-center p-6 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/40"><info.icon className="w-8 h-8 text-white" /></div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{info.title}</h3>
                                <a href={info.link} className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors block font-medium">{info.info}</a>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="py-20" id="form-section">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* --- Tab Navigation --- */}
                        <div className="flex justify-center mb-12">
                            <div className="glass-effect p-2 rounded-xl flex flex-wrap justify-center gap-2 shadow-2xl">
                                <Button onClick={() => setActiveForm('contact')} variant={activeForm === 'contact' ? 'default' : 'ghost'} className={`h-12 px-8 text-base rounded-lg ${activeForm === 'contact' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}><MessageSquare className="w-5 h-5 mr-2" />Contato</Button>
                                <Button onClick={() => setActiveForm('quote')} variant={activeForm === 'quote' ? 'default' : 'ghost'} className={`h-12 px-8 text-base rounded-lg ${activeForm === 'quote' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}><Calculator className="w-5 h-5 mr-2" />Orçamento</Button>
                                <Button onClick={() => setActiveForm('support')} variant={activeForm === 'support' ? 'default' : 'ghost'} className={`h-12 px-8 text-base rounded-lg ${activeForm === 'support' ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}><LifeBuoy className="w-5 h-5 mr-2" />Suporte</Button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeForm} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-effect p-8 md:p-12 rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl">

                                {/* --- CONTACT FORM --- */}
                                {activeForm === 'contact' && (
                                    <>
                                        <div className="text-center mb-10">
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Envie uma Mensagem</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Dúvidas gerais ou parcerias? Escreva pra gente.</p>
                                        </div>
                                        <form onSubmit={(e) => handleSubmit(e, 'contact', contactForm, setContactForm)} className="space-y-6 max-w-2xl mx-auto">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-14 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" type="text" name="name" placeholder="Nome *" value={contactForm.name} onChange={handleFormChange('contact', setContactForm)} required />
                                                <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-14 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" type="email" name="email" placeholder="Email *" value={contactForm.email} onChange={handleFormChange('contact', setContactForm)} required />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Assunto</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {contactSubjects.map(sub => (
                                                        <button
                                                            key={sub.label}
                                                            type="button"
                                                            onClick={() => handleSelection(setContactForm, 'subject', sub.label)}
                                                            className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${contactForm.subject === sub.label
                                                                ? 'bg-purple-50 dark:bg-purple-500/20 border-purple-500 text-purple-700 dark:text-white shadow-lg'
                                                                : 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                        >
                                                            <sub.icon className="w-4 h-4" />
                                                            {sub.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Textarea className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-lg min-h-[150px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" name="message" placeholder="Sua mensagem *" value={contactForm.message} onChange={handleFormChange('contact', setContactForm)} required />

                                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold shadow-lg hover:brightness-110 transition-all rounded-xl" disabled={loading}>
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
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Solicitar Orçamento</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Conte sobre seu projeto e receba uma proposta personalizada.</p>
                                        </div>
                                        <form onSubmit={(e) => handleSubmit(e, 'quote', quoteForm, setQuoteForm)} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Seus Dados</label>
                                                    <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-12 text-gray-900 dark:text-white placeholder-gray-400" type="text" name="name" placeholder="Seu Nome *" value={quoteForm.name} onChange={handleFormChange('quote', setQuoteForm)} required />
                                                    <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-12 text-gray-900 dark:text-white placeholder-gray-400" type="email" name="email" placeholder="Seu Email *" value={quoteForm.email} onChange={handleFormChange('quote', setQuoteForm)} required />
                                                    <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-12 text-gray-900 dark:text-white placeholder-gray-400" type="tel" name="phone" placeholder="WhatsApp / Telefone" value={quoteForm.phone} onChange={handleFormChange('quote', setQuoteForm)} />
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">O que você precisa?</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {services.map(s => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => handleSelection(setQuoteForm, 'service', s)}
                                                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${quoteForm.service === s
                                                                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                                                                    : 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Orçamento Estimado</label>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                                    {budgetRanges.map(b => (
                                                        <button
                                                            key={b.value}
                                                            type="button"
                                                            onClick={() => handleSelection(setQuoteForm, 'budget', b.value)}
                                                            className={`p-3 rounded-xl text-sm font-bold border flex flex-col items-center justify-center gap-1 transition-all h-20 ${quoteForm.budget === b.value
                                                                ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-700 dark:text-blue-200 shadow-md'
                                                                : 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                        >
                                                            <DollarSign className={`w-4 h-4 ${quoteForm.budget === b.value ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`} />
                                                            {b.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Detalhes do Projeto</label>
                                                <Textarea className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 min-h-[120px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" name="description" placeholder="Descreva sua ideia, prazos desejados ou referências..." value={quoteForm.description} onChange={handleFormChange('quote', setQuoteForm)} required />
                                            </div>

                                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold shadow-lg hover:brightness-110 transition-all rounded-xl mt-4" disabled={loading}>
                                                {loading ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Calculator className="w-6 h-6 mr-2" />}
                                                {loading ? 'Enviando Proposta...' : 'Solicitar Orçamento Grátis'}
                                            </Button>
                                        </form>
                                    </>
                                )}

                                {/* --- SUPPORT FORM --- */}
                                {activeForm === 'support' && (
                                    <>
                                        <div className="text-center mb-10">
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Suporte Técnico</h2>
                                            <p className="text-gray-600 dark:text-gray-400">Já é cliente? Abra um chamado para nossa equipe.</p>
                                        </div>
                                        <form onSubmit={(e) => handleSubmit(e, 'support', supportForm, setSupportForm)} className="space-y-6 max-w-2xl mx-auto">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-14 text-gray-900 dark:text-white placeholder-gray-400" type="text" name="name" placeholder="Seu Nome *" value={supportForm.name} onChange={handleFormChange('support', setSupportForm)} required disabled={!!user} />
                                                <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-14 text-gray-900 dark:text-white placeholder-gray-400" type="email" name="email" placeholder="Seu Email *" value={supportForm.email} onChange={handleFormChange('support', setSupportForm)} required disabled={!!user} />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 ml-1">Prioridade</label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {supportPriorities.map(p => (
                                                        <button
                                                            key={p.value}
                                                            type="button"
                                                            onClick={() => handleSelection(setSupportForm, 'priority', p.value)}
                                                            className={`py-3 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${supportForm.priority === p.value
                                                                ? `${p.color} border-current shadow-md`
                                                                : 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                        >
                                                            <ShieldAlert className="w-4 h-4" />
                                                            {p.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Input className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 h-14 text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" type="text" name="subject" placeholder="Assunto do problema *" value={supportForm.subject} onChange={handleFormChange('support', setSupportForm)} required />
                                            <Textarea className="bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 text-lg min-h-[150px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" name="description" placeholder="Descreva detalhadamente o que está acontecendo..." value={supportForm.description} onChange={handleFormChange('support', setSupportForm)} rows={5} required />

                                            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-6 text-lg font-semibold shadow-lg hover:brightness-110 transition-all rounded-xl" disabled={loading}>
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
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-400"><CheckCircle2 className="w-6 h-6" /> Chamado Criado!</DialogTitle>
                        <DialogDescription className="text-gray-400">Seu ticket foi gerado com sucesso. Guarde o código abaixo.</DialogDescription>
                    </DialogHeader>
                    <div className="my-6 p-6 bg-black/50 border border-gray-800 rounded-xl flex items-center justify-between group cursor-pointer" onClick={copyToClipboard}>
                        <span className="text-2xl font-mono font-bold text-blue-400 tracking-wider">{generatedTicketCode}</span>
                        <Button size="icon" variant="ghost" className="text-gray-500 group-hover:text-white"><Copy className="h-6 w-6" /></Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Contact;