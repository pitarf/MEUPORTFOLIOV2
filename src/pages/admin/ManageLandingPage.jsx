import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';
import { useToast } from '@/components/ui/use-toast';

const ManageLandingPage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        hero_title: '',
        hero_subtitle: '',
        hero_image_url: '',
        specialties: [],
        nav_logo_url: '',    // Add initial state
        nav_site_name: ''    // Add initial state
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if (content.nav_logo_url) {
            setLogoPreview(content.nav_logo_url);
        }
    }, [content.nav_logo_url]);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('landing_page_content')
                .select('*')
                .eq('page_slug', 'fotografia')
                .single();

            if (error) {
                // If not found, we might need to insert initial (handled by migration preferably)
                // or just leave empty
                console.error('Error fetching content:', error);
            } else if (data) {
                setContent(data);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Preview
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result);
                reader.readAsDataURL(file);

                // Compress and convert to WebP
                const compressed = await optimizeAndConvertToWebP(file);
                setLogoFile(compressed);
            } catch (error) {
                console.error("Error compressing logo:", error);
                setLogoFile(file);
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalLogoUrl = content.nav_logo_url;

            // Upload Logo if changed
            if (logoFile) {
                const fileName = `nav_logo_photo_${Date.now()}.webp`;
                const storageRef = ref(storage, `site-assets/${fileName}`);
                const snapshot = await uploadBytes(storageRef, logoFile);
                finalLogoUrl = await getDownloadURL(snapshot.ref);
            }

            const { error } = await supabase
                .from('landing_page_content')
                .upsert({
                    page_slug: 'fotografia',
                    ...content,
                    nav_logo_url: finalLogoUrl,
                    updated_at: new Date()
                }, { onConflict: 'page_slug' });

            if (error) throw error;

            // Update local state with new URL if uploaded
            if (logoFile) {
                setContent(prev => ({ ...prev, nav_logo_url: finalLogoUrl }));
                setLogoFile(null);
            }

            toast({
                title: "Sucesso!",
                description: "Página atualizada com sucesso.",
            });
        } catch (error) {
            console.error('Error saving:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Não foi possível salvar as alterações.",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSpecialtyChange = (index, field, value) => {
        const newSpecialties = [...(content.specialties || [])];
        if (!newSpecialties[index]) newSpecialties[index] = {};
        newSpecialties[index][field] = value;
        setContent({ ...content, specialties: newSpecialties });
    };

    const addSpecialty = () => {
        setContent({
            ...content,
            specialties: [...(content.specialties || []), { title: '', description: '', image: '' }]
        });
    };

    const removeSpecialty = (index) => {
        const newSpecialties = content.specialties.filter((_, i) => i !== index);
        setContent({ ...content, specialties: newSpecialties });
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Gerenciar Página de Fotografia</h1>
                <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                    Salvar Alterações
                </Button>
            </div>

            {/* Navbar Branding Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-foreground">Identidade Visual no Menu (Exclusivo Fotografia)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Nome do Site no Menu</label>
                        <Input
                            className="mt-1"
                            placeholder="Ex: Rafael Pita Photography"
                            value={content.nav_site_name || ''}
                            onChange={(e) => setContent({ ...content, nav_site_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Logo do Menu</label>
                        <div className="flex gap-4 mt-1">
                            {/* File Upload UI */}
                            <div className="w-24 h-24 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden relative group">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
                                )}
                                <label className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Upload className="w-6 h-6 text-foreground" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                </label>
                            </div>

                            <div className="flex-1 flex flex-col justify-center text-sm text-muted-foreground">
                                <p>Clique na imagem para alterar.</p>
                                <p className="text-xs text-muted-foreground/80 mt-1">Recomendado: PNG Transparente</p>
                                {/* Fallback URL Input */}
                                <input
                                    className="bg-background border border-border text-foreground text-xs mt-2 p-1 rounded w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                    placeholder="Ou cole uma URL direta..."
                                    value={content.nav_logo_url || ''}
                                    onChange={(e) => {
                                        setContent({ ...content, nav_logo_url: e.target.value });
                                        setLogoPreview(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hero Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-foreground">Seção Hero (Capa)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Título Principal</label>
                        <Input
                            className="mt-1"
                            value={content.hero_title || ''}
                            onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Subtítulo</label>
                        <Textarea
                            className="mt-1"
                            value={content.hero_subtitle || ''}
                            onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Imagem de Fundo (URL)</label>
                        <div className="flex gap-4 mt-1">
                            <Input
                                className="flex-1"
                                value={content.hero_image_url || ''}
                                onChange={(e) => setContent({ ...content, hero_image_url: e.target.value })}
                            />
                            {content.hero_image_url && (
                                <div className="w-16 h-10 rounded overflow-hidden border border-border flex-shrink-0">
                                    <img src={content.hero_image_url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Specialties Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-foreground">Especialidades</CardTitle>
                    <Button variant="outline" size="sm" onClick={addSpecialty} className="border-border text-foreground hover:bg-muted">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {content.specialties?.map((item, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg border border-border relative group">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeSpecialty(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Título</label>
                                    <Input
                                        className="mt-1 h-9"
                                        value={item.title || ''}
                                        onChange={(e) => handleSpecialtyChange(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Imagem URL</label>
                                    <Input
                                        className="mt-1 h-9"
                                        value={item.image || ''}
                                        onChange={(e) => handleSpecialtyChange(index, 'image', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground">Descrição</label>
                                    <Textarea
                                        className="mt-1 h-20"
                                        value={item.description || ''}
                                        onChange={(e) => handleSpecialtyChange(index, 'description', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {content.specialties?.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">Nenhuma especialidade adicionada.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageLandingPage;
