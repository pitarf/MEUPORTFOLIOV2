import React, { useState, useEffect } from 'react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { compressImage } from '@/utils/imageCompression'; // Import compression
import { useToast } from '@/components/ui/use-toast';
import { Save, Loader2, Globe, Phone, Share2, BarChart3, AlertTriangle, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const ManageGeneralSettings = () => {
    const { config, refreshConfig, loading: configLoading, dbError } = useSiteConfig();
    const { user } = useAuth();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [ogImageFile, setOgImageFile] = useState(null);
    const [ogImagePreview, setOgImagePreview] = useState(null);

    useEffect(() => {
        if (config) {
            setFormData({ ...config });
            if (config.logo_url) {
                setLogoPreview(config.logo_url);
            }
            if (config.favicon_url) {
                setFaviconPreview(config.favicon_url);
            }
            if (config.og_image_url) {
                setOgImagePreview(config.og_image_url);
            }
        }
    }, [config]);

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Preview
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result);
                reader.readAsDataURL(file);

                // Compress
                const compressed = await compressImage(file);
                setLogoFile(compressed);
            } catch (error) {
                console.error("Error compressing logo:", error);
                setLogoFile(file);
            }
        }
    };

    const handleFaviconChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => setFaviconPreview(reader.result);
                reader.readAsDataURL(file);

                const compressed = await compressImage(file);
                setFaviconFile(compressed);
            } catch (error) {
                console.error("Error compressing favicon:", error);
                setFaviconFile(file);
            }
        }
    };

    const handleOgImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => setOgImagePreview(reader.result);
                reader.readAsDataURL(file);

                const compressed = await compressImage(file);
                setOgImageFile(compressed);
            } catch (error) {
                console.error("Error compressing OG image:", error);
                setOgImageFile(file);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!user) {
            toast({ variant: "destructive", title: "Erro de Permissão", description: "Você precisa estar logado." });
            setSubmitting(false);
            return;
        }

        try {
            let logo_url = config?.logo_url;
            let favicon_url = config?.favicon_url;
            let og_image_url = config?.og_image_url;

            // Upload Logo se foi alterado
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop();
                const fileName = `logo_${user.id}_${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(fileName, logoFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(uploadData.path);
                logo_url = urlData.publicUrl;
            }

            // Upload Favicon se foi alterado
            if (faviconFile) {
                const fileExt = faviconFile.name.split('.').pop();
                const fileName = `favicon_${user.id}_${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(fileName, faviconFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(uploadData.path);
                favicon_url = urlData.publicUrl;
            }

            // Upload OG Image se foi alterada
            if (ogImageFile) {
                const fileExt = ogImageFile.name.split('.').pop();
                const fileName = `og_${user.id}_${Date.now()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(fileName, ogImageFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(uploadData.path);
                og_image_url = urlData.publicUrl;
            }

            // Determine se é Update ou Insert com base no config.id
            const payload = {
                user_id: user.id, // Enforce User ID
                logo_url: logo_url,
                favicon_url: favicon_url,
                og_image_url: og_image_url,
                site_name: formData.site_name,
                site_title: formData.site_title || formData.site_name,
                site_description: formData.site_description || formData.hero_description,
                site_keywords: formData.site_keywords || '',
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                contact_address: formData.contact_address,
                hero_title: formData.hero_title,
                hero_subtitle: formData.hero_subtitle,
                hero_description: formData.hero_description,
                footer_description: formData.footer_description,
                stats_projects_count: parseInt(formData.stats_projects_count),
                stats_clients_count: parseInt(formData.stats_clients_count),
                stats_success_rate: parseInt(formData.stats_success_rate),
                social_links: formData.social_links,
                updated_at: new Date().toISOString()
            };

            let error;

            // Se temos um ID de config real (não fallback), fazemos UPDATE.
            if (config.id && !config.isFallback) {
                const { error: updateError } = await supabase
                    .from('site_config')
                    .update(payload)
                    .eq('id', config.id)
                    .eq('user_id', user.id);
                error = updateError;
            } else {
                // CRIAR NOVA CONFIGURAÇÃO
                const { error: insertError } = await supabase
                    .from('site_config')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            await refreshConfig(); // Refresh context
            toast({
                title: "Configurações Salvas!",
                description: "As informações do site foram atualizadas com sucesso.",
            });
        } catch (error) {
            console.error('Error updating settings:', error);
            toast({
                variant: "destructive",
                title: "Erro ao Salvar",
                description: "Não foi possível atualizar as configurações.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (configLoading || !formData) {
        return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="space-y-8 p-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold gradient-text mb-2">Configurações Gerais</h1>
                <p className="text-gray-400">Gerencie as informações globais do seu portfólio.</p>
            </motion.div>

            {dbError && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Erro de Conexão com Banco</AlertTitle>
                    <AlertDescription>
                        Não foi possível carregar as configurações do banco de dados.
                        Verifique se a tabela <code>site_config</code> existe.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo & Identity */}
                <section className="glass-effect p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Identidade Visual</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Logo do Site</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-gray-500" />
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-6 h-6 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                </div>
                                <div className="text-sm text-gray-400 flex-1">
                                    Clique na imagem para enviar sua logo.<br />
                                    Recomendado: PNG com fundo transparente.
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="site_name">Nome do Site</Label>
                            <Input
                                id="site_name"
                                name="site_name"
                                value={formData.site_name}
                                onChange={handleChange}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Hero Content */}
                <section className="glass-effect p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Conteúdo da Seção Hero</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Título (Hero)</Label>
                            <Input name="hero_title" value={formData.hero_title} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Subtítulo (Hero)</Label>
                            <Input name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Descrição (Hero)</Label>
                            <Textarea name="hero_description" value={formData.hero_description} onChange={handleChange} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Descrição (Rodapé)</Label>
                            <Textarea name="footer_description" value={formData.footer_description} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* SEO & Metadata Settings */}
                <section className="glass-effect p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-xl font-semibold text-white">Configurações de SEO & Compartilhamento</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="site_title">Título SEO do Site</Label>
                            <Input
                                id="site_title"
                                name="site_title"
                                value={formData.site_title || ''}
                                onChange={handleChange}
                                placeholder="Ex: Rafael Pita Solutions - Criatividade e Tecnologia"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <p className="text-xs text-gray-400">
                                Este título aparece na aba do navegador e nos resultados de pesquisa do Google. Recomendado: 50-60 caracteres.
                            </p>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="site_description">Descrição SEO do Site</Label>
                            <Textarea
                                id="site_description"
                                name="site_description"
                                value={formData.site_description || ''}
                                onChange={handleChange}
                                placeholder="Descreva brevemente sua empresa e o que faz para atrair cliques no Google."
                                className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                            />
                            <p className="text-xs text-gray-400">
                                Esta descrição é exibida abaixo do título nos resultados de pesquisa. Recomendado: 120-160 caracteres.
                            </p>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="site_keywords">Palavras-chave (Separadas por vírgula)</Label>
                            <Input
                                id="site_keywords"
                                name="site_keywords"
                                value={formData.site_keywords || ''}
                                onChange={handleChange}
                                placeholder="portfólio, design, desenvolvimento, fotografia"
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            <p className="text-xs text-gray-400">
                                Termos relevantes pesquisados por seus clientes. Separe-os por vírgulas.
                            </p>
                        </div>

                        {/* Favicon Upload */}
                        <div className="space-y-2">
                            <Label>Favicon do Site (Ícone de Aba)</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                    {faviconPreview ? (
                                        <img src={faviconPreview} alt="Favicon Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-500" />
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-4 h-4 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFaviconChange} />
                                    </label>
                                </div>
                                <div className="text-xs text-gray-400 flex-1">
                                    Ícone exibido na aba do navegador.<br />
                                    Formatos suportados: ICO, PNG (quadrado, ex: 32x32px).
                                </div>
                            </div>
                        </div>

                        {/* OG Image Upload */}
                        <div className="space-y-2">
                            <Label>Imagem de Compartilhamento (Open Graph)</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                    {ogImagePreview ? (
                                        <img src={ogImagePreview} alt="OG Image Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-500" />
                                    )}
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-4 h-4 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleOgImageChange} />
                                    </label>
                                </div>
                                <div className="text-xs text-gray-400 flex-1">
                                    Imagem exibida ao compartilhar o link em redes sociais (WhatsApp, LinkedIn, etc.).<br />
                                    Proporção recomendada: 1200x630px.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-effect p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Phone className="w-6 h-6 text-green-400" />
                        <h2 className="text-xl font-semibold text-white">Contato</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input name="contact_email" value={formData.contact_email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Telefone / WhatsApp</Label>
                            <Input name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Endereço</Label>
                            <Input name="contact_address" value={formData.contact_address} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="glass-effect p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-6 h-6 text-purple-400" />
                        <h2 className="text-xl font-semibold text-white">Estatísticas (Numéricas)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Projetos Concluídos</Label>
                            <Input type="number" name="stats_projects_count" value={formData.stats_projects_count} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Clientes Satisfeitos</Label>
                            <Input type="number" name="stats_clients_count" value={formData.stats_clients_count} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Taxa de Sucesso (%)</Label>
                            <Input type="number" name="stats_success_rate" value={formData.stats_success_rate} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="glass-effect p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Share2 className="w-6 h-6 text-pink-400" />
                        <h2 className="text-xl font-semibold text-white">Redes Sociais</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Instagram (URL)</Label>
                            <Input name="instagram" value={formData.social_links?.instagram || ''} onChange={handleSocialChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn (URL)</Label>
                            <Input name="linkedin" value={formData.social_links?.linkedin || ''} onChange={handleSocialChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Facebook (URL)</Label>
                            <Input name="facebook" value={formData.social_links?.facebook || ''} onChange={handleSocialChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Twitter / X (URL)</Label>
                            <Input name="twitter" value={formData.social_links?.twitter || ''} onChange={handleSocialChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>WhatsApp Link (URL completa)</Label>
                            <Input name="whatsapp" value={formData.social_links?.whatsapp || ''} onChange={handleSocialChange} />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end sticky bottom-8">
                    <Button type="submit" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl" disabled={submitting || dbError}>
                        {submitting ? <Loader2 className="w-6 h-6 mr-2 animate-spin" /> : <Save className="w-6 h-6 mr-2" />}
                        {dbError ? 'Banco Indisponível' : (submitting ? 'Salvando...' : 'Salvar Alterações')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ManageGeneralSettings;
