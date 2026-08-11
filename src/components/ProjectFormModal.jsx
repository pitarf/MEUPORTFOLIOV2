import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Loader2, PlusCircle, Save, Trash2, Sparkles, Wand2, LayoutGrid, FileText, Image as ImageIcon, UploadCloud, Crop as CropIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateProjectContent } from '@/lib/gemini';
import ImageCropperModal from '@/components/ImageCropperModal';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';

// Função auxiliar para converter Blob em File (necessário para o upload do Supabase esperar um File object as vezes, ou pelo menos ter nome)
const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type });
};

const ProjectFormModal = ({ project, onSave, onClose }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [categories, setCategories] = useState([]);
    const [nichoOptions, setNichoOptions] = useState(['Casamentos', 'Ensaios', 'Eventos']);

    // Form Data
    const [formData, setFormData] = useState({
        category_id: '',
        slug: '',
        title: '',
        client: '',
        year: new Date().getFullYear(),
        services: '',
        description: '',
        challenge: '',
        solution: '',
        results: '',
        project_url: '',
        gallery_urls: [],
        video_urls: '',
        main_image_aspect_ratio: '16:9',
        gallery_aspect_ratio: '16:9',
        photography_nicho: 'Ensaios',
        new_photography_nicho: '',
        seo_subcategoria: '',
    });

    // Image States
    const [mainImage, setMainImage] = useState(null); // File object
    const [mainImagePreview, setMainImagePreview] = useState(null); // URL for preview
    const [galleryImages, setGalleryImages] = useState([]); // Array of File objects (new uploads)

    // Cropper State
    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null); // URL or Base64
    const [cropTarget, setCropTarget] = useState(null); // { type: 'main' } or { type: 'gallery', index: number }

    const isEditing = !!project;

    // Load Categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('id, title, slug');
            if (!error) setCategories(data);
        };
        fetchCategories();
    }, []);

    // Fetch existing niches from all photography projects
    useEffect(() => {
        const fetchExistingNiches = async () => {
            try {
                // Descobre a categoria de fotografia
                const { data: categoryData } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('slug', 'fotografia')
                    .single();
                    
                if (categoryData) {
                    const { data: projectsData } = await supabase
                        .from('projects')
                        .select('services')
                        .eq('category_id', categoryData.id);
                        
                    if (projectsData) {
                        const nichesSet = new Set(['Casamentos', 'Ensaios', 'Eventos']);
                        projectsData.forEach(p => {
                            const nicheTag = (p.services || []).find(s => s.startsWith('nicho:'));
                            if (nicheTag) {
                                const name = nicheTag.substring(6);
                                if (name) {
                                    // Capitaliza a primeira letra para manter a padronização
                                    nichesSet.add(name.charAt(0).toUpperCase() + name.slice(1));
                                }
                            }
                        });
                        setNichoOptions(Array.from(nichesSet));
                    }
                }
            } catch (err) {
                console.warn('Erro ao buscar nichos existentes de fotografia:', err);
            }
        };
        fetchExistingNiches();
    }, []);

    // Load Project Data
    useEffect(() => {
        if (isEditing && project) {
            const currentServices = project.services || [];
            const currentTitle = project.title || '';
            let nicho = 'Ensaios';
            
            // 1. Tenta achar tag de nicho com o prefixo 'nicho:'
            const nicheTag = currentServices.find(s => s.startsWith('nicho:'));
            if (nicheTag) {
                const name = nicheTag.substring(6);
                nicho = name.charAt(0).toUpperCase() + name.slice(1);
            } else {
                // 2. Fallback para retrocompatibilidade
                const servicesLower = currentServices.map(s => s.toLowerCase());
                const titleLower = currentTitle.toLowerCase();
                if (servicesLower.includes('casamento') || servicesLower.includes('pedido') || titleLower.includes('casamento') || titleLower.includes('pedido') || titleLower.includes('noivado')) {
                    nicho = 'Casamentos';
                } else if (servicesLower.includes('evento') || servicesLower.includes('festa') || servicesLower.includes('corporativo') || titleLower.includes('evento') || titleLower.includes('festa') || titleLower.includes('corporativo') || titleLower.includes('aniversario') || titleLower.includes('aniversário')) {
                    nicho = 'Eventos';
                }
            }

            // 3. Tenta achar tag de subcategoria com o prefixo 'subcategoria:'
            const subcatTag = currentServices.find(s => s.startsWith('subcategoria:'));
            const subcat = subcatTag ? subcatTag.substring(13) : '';

            // 4. Limpa as tags de sistema do array de serviços para exibir apenas as tecnologias/serviços reais no campo de texto
            const cleanServices = (project.services || []).filter(s => 
                typeof s === 'string' && !s.startsWith('subcategoria:') && !s.startsWith('nicho:')
            );

            setFormData({
                ...project,
                services: cleanServices.join(', '),
                gallery_urls: project.gallery_urls || [],
                video_urls: project.video_urls ? project.video_urls.join(', ') : '',
                main_image_aspect_ratio: project.main_image_aspect_ratio || '16:9',
                gallery_aspect_ratio: project.gallery_aspect_ratio || '16:9',
                category_id: project.category_id || '', // Explicitly set category_id
                photography_nicho: nicho,
                new_photography_nicho: '',
                seo_subcategoria: subcat,
            });
        } else {
            setFormData({
                category_id: '', slug: '', title: '', client: '', year: new Date().getFullYear(), services: '', description: '', challenge: '', solution: '', results: '', project_url: '', gallery_urls: [], video_urls: '', main_image_aspect_ratio: '4:5', gallery_aspect_ratio: '4:5', photography_nicho: 'Ensaios', new_photography_nicho: '', seo_subcategoria: '',
            });
        }
    }, [project, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Image Handling Logic ---

    // 1. Select Main Image -> Open Cropper
    const handleMainImageSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(file));
            // Reset input value to allow re-selecting same file
            e.target.value = '';
        }
    };

    // 2. Select Gallery Images -> Add to list (No auto crop for bulk)
    const handleGalleryImagesSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                id: Math.random().toString(36).substr(2, 9),
                preview: URL.createObjectURL(file)
            }));
            setGalleryImages(prev => [...prev, ...newFiles]);
        }
    };

    // 3. Trigger Crop for a specific Gallery Image
    const handleCropGalleryImage = (index) => {
        const img = galleryImages[index];
        setImageToCrop(img.preview);
        setCropTarget({ type: 'gallery', index, fileName: img.file.name });
        setCropperOpen(true);
    };

    // 4. Crop Complete Callback
    const onCropComplete = (croppedBlob) => {
        if (cropTarget.type === 'main') {
            const file = blobToFile(croppedBlob, cropTarget.fileName);
            setMainImage(file);
            setMainImagePreview(URL.createObjectURL(croppedBlob));
        } else if (cropTarget.type === 'gallery') {
            const file = blobToFile(croppedBlob, cropTarget.fileName);
            setGalleryImages(prev => {
                const newArr = [...prev];
                newArr[cropTarget.index] = {
                    ...newArr[cropTarget.index],
                    file,
                    preview: URL.createObjectURL(croppedBlob) // Update preview with cropped version
                };
                return newArr;
            });
        }
    };

    // Generate Slug automatically
    useEffect(() => {
        if (!isEditing && formData.title) {
            const slug = formData.title.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanum with -
                .replace(/^-+|-+$/g, ''); // Trim -
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, isEditing]);

    // ... (Keep existing AI and Delete logic) ...
    const handleGenerateAI = async () => {
        if (!formData.title) return toast({ variant: "destructive", title: "Preencha o Título primeiro" });
        setAiLoading(true);
        try {
            const categoryName = categories.find(c => String(c.id) === String(formData.category_id))?.title || 'Geral';
            const content = await generateProjectContent(formData.title, categoryName, formData.client, formData.services);
            setFormData(prev => ({ ...prev, ...content }));
            toast({ title: "Conteúdo gerado! ✨" });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro na IA", description: error.message });
        } finally {
            setAiLoading(false);
        }
    };

    const handleDeleteGalleryUrl = async (url) => {
        if (!window.confirm('Excluir imagem enviada?')) return;
        const updated = formData.gallery_urls.filter(u => u !== url);
        setFormData(prev => ({ ...prev, gallery_urls: updated }));
        // Should delete from storage too ideally, but for now just updating ref
    };

    const handleRemoveNewGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    // --- Config for Aspects ---
    const getAspectValue = (ratioString) => {
        const [w, h] = ratioString.split(':').map(Number);
        return w / h;
    };


    // --- Submit ---
    const uploadFile = async (file, bucket, path) => {
        try {
            // Otimiza e converte para WebP
            const optimizedFile = await optimizeAndConvertToWebP(file);
            
            // Garante que o nome do arquivo tenha extensão .webp no Firebase
            let finalPath = path;
            const extIndex = path.lastIndexOf('.');
            if (extIndex !== -1) {
                finalPath = path.substring(0, extIndex) + '.webp';
            } else {
                finalPath = path + '.webp';
            }

            const storageRef = ref(storage, `${bucket}/${finalPath}`);
            const snapshot = await uploadBytes(storageRef, optimizedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Erro no upload para o Firebase Storage:', error);
            throw new Error(`Falha no upload da imagem: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const selectedCategory = categories.find(c => String(c.id) === String(formData.category_id));
            const isPhotography = selectedCategory?.slug === 'fotografia';

            let servicesArray = formData.services.split(',').map(s => s.trim()).filter(s => s);
            
            // Remove qualquer tag antiga de subcategoria
            servicesArray = servicesArray.filter(s => !s.startsWith('subcategoria:'));

            // Adiciona a nova tag de subcategoria se selecionada
            if (formData.seo_subcategoria) {
                servicesArray.push(`subcategoria:${formData.seo_subcategoria}`);
            }

            if (isPhotography) {
                // Remove termos de nicho antigos, incluindo qualquer tag que comece com "nicho:" ou tags livres relacionadas
                servicesArray = servicesArray.filter(s => {
                    const sLower = s.toLowerCase();
                    if (sLower.startsWith('nicho:')) return false;
                    const termsToRemove = ['casamento', 'pedido', 'noivado', 'evento', 'festa', 'corporativo', 'aniversario', 'aniversário', 'ensaio'];
                    return !termsToRemove.includes(sLower);
                });

                // Adiciona a tag com o prefixo nicho:
                let finalNicho = formData.photography_nicho;
                if (finalNicho === 'new_nicho' && formData.new_photography_nicho.trim()) {
                    finalNicho = formData.new_photography_nicho.trim();
                }
                
                if (finalNicho && finalNicho !== 'new_nicho') {
                    servicesArray.push(`nicho:${finalNicho}`);
                }
            }

            const projectData = {
                ...formData,
                services: servicesArray,
                video_urls: formData.video_urls.split(',').map(s => s.trim()).filter(s => s),
                year: formData.year ? parseInt(formData.year, 10) : new Date().getFullYear(),
                category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
            };

            // Remove helper keys antes de salvar no Supabase
            delete projectData.category;
            delete projectData.photography_nicho;
            delete projectData.new_photography_nicho;
            delete projectData.seo_subcategoria;

            if (!projectData.category_id) {
                toast({ variant: 'destructive', title: 'Erro', description: 'Selecione uma categoria.' });
                setLoading(false);
                return;
            }

            const timestamp = Date.now();

            // 1. Upload Main Image (if changed)
            if (mainImage) {
                const path = `${formData.slug}-main-${timestamp}-${mainImage.name}`;
                projectData.main_image_url = await uploadFile(mainImage, 'project-images', path);
            }

            // 2. Upload New Gallery Images
            if (galleryImages.length > 0) {
                const newUrls = await Promise.all(galleryImages.map(async (item, i) => {
                    const path = `${formData.slug}-gallery-${timestamp}-${i}-${item.file.name}`;
                    return await uploadFile(item.file, 'project-images', path);
                }));
                projectData.gallery_urls = [...(formData.gallery_urls || []), ...newUrls];
            }

            // 3. Save to DB
            const { error } = isEditing
                ? await supabase.from('projects').update(projectData).eq('id', project.id)
                : await supabase.from('projects').insert([projectData]);

            if (error) throw error;

            toast({ title: 'Sucesso!', description: `Projeto ${isEditing ? 'atualizado' : 'criado'}.` });
            onSave();
            onClose();

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => String(c.id) === String(formData.category_id));
    const isPhotography = selectedCategory?.slug === 'fotografia';

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-h-[95vh] overflow-y-auto max-w-4xl bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Preencha os detalhes do projeto, gere conteúdo com IA e gerencie as imagens.
                    </DialogDescription>
                </DialogHeader>

                <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                    <Tabs className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted p-1 rounded-lg">
                            <TabsTrigger
                                onClick={() => setActiveTab('info')}
                                isActive={activeTab === 'info'}
                                className="gap-2"
                            >
                                <LayoutGrid className="w-4 h-4" /> Informações
                            </TabsTrigger>
                            <TabsTrigger
                                onClick={() => setActiveTab('content')}
                                isActive={activeTab === 'content'}
                                className="gap-2"
                            >
                                <FileText className="w-4 h-4" /> Conteúdo & IA
                            </TabsTrigger>
                            <TabsTrigger
                                onClick={() => setActiveTab('media')}
                                isActive={activeTab === 'media'}
                                className="gap-2"
                            >
                                <ImageIcon className="w-4 h-4" /> Mídia
                            </TabsTrigger>
                        </TabsList>

                        {/* INFO TAB */}
                        <TabsContent isActive={activeTab === 'info'} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Título</Label>
                                    <Input name="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input name="slug" value={formData.slug} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Categoria</Label>
                                    <Select name="category_id" value={String(formData.category_id)} onValueChange={(v) => handleSelectChange('category_id', v)}>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedCategory && (
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-1.5 text-purple-500 font-semibold">
                                            <Wand2 className="w-3.5 h-3.5" /> Subcategoria (SEO)
                                        </Label>
                                        <Select name="seo_subcategoria" value={formData.seo_subcategoria || 'none'} onValueChange={(v) => handleSelectChange('seo_subcategoria', v)}>
                                            <SelectTrigger className="border-purple-500/30 focus:ring-purple-500">
                                                <SelectValue placeholder="Selecione a subcategoria..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Não Definido (Opcional)</SelectItem>
                                                {selectedCategory.slug === 'desenvolvimento-web' && (
                                                    <>
                                                        <SelectItem value="criacao-de-sites">Criação de Sites</SelectItem>
                                                        <SelectItem value="landing-pages">Landing Pages</SelectItem>
                                                        <SelectItem value="desenvolvimento-de-sistemas">Desenvolvimento de Sistemas</SelectItem>
                                                        <SelectItem value="automacoes">Automações</SelectItem>
                                                    </>
                                                )}
                                                {selectedCategory.slug === 'dashboards-power-bi' && (
                                                    <SelectItem value="dashboards-power-bi">Dashboards Power BI</SelectItem>
                                                )}
                                                {selectedCategory.slug === 'fotografia' && (
                                                    <>
                                                        <SelectItem value="fotografia-corporativa">Fotografia Corporativa & Ensaios</SelectItem>
                                                        <SelectItem value="fotografia-eventos">Fotografia de Eventos</SelectItem>
                                                    </>
                                                )}
                                                {selectedCategory.slug === 'design-grafico' && (
                                                    <>
                                                        <SelectItem value="identidade-visual">Identidade Visual</SelectItem>
                                                        <SelectItem value="social-media">Social Media</SelectItem>
                                                        <SelectItem value="materiais-impressos">Materiais Impressos</SelectItem>
                                                    </>
                                                )}
                                                {selectedCategory.slug === 'trafego-pago' && (
                                                    <>
                                                        <SelectItem value="google-ads">Google Ads</SelectItem>
                                                        <SelectItem value="meta-ads">Meta Ads (Facebook/Instagram)</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {isPhotography && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 font-semibold">
                                                <Sparkles className="w-3.5 h-3.5" /> Subcategoria (Nicho)
                                            </Label>
                                            <Select name="photography_nicho" value={formData.photography_nicho || 'Ensaios'} onValueChange={(v) => handleSelectChange('photography_nicho', v)}>
                                                <SelectTrigger className="border-blue-500/30 focus:ring-blue-500"><SelectValue placeholder="Selecione o nicho..." /></SelectTrigger>
                                                <SelectContent>
                                                    {nichoOptions.map(niche => (
                                                        <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                                                    ))}
                                                    <SelectItem value="new_nicho" className="font-semibold text-purple-600 dark:text-purple-400">+ Criar Nova Subcategoria...</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {formData.photography_nicho === 'new_nicho' && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <Label className="text-purple-600 dark:text-purple-400 font-semibold">Nome da Nova Subcategoria</Label>
                                                <Input 
                                                    name="new_photography_nicho" 
                                                    placeholder="Ex: Gestantes, Newborn, Retratos..." 
                                                    value={formData.new_photography_nicho} 
                                                    onChange={handleInputChange} 
                                                    required 
                                                    className="border-purple-500/30 focus:border-purple-500 focus:ring-purple-500" 
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="space-y-2">
                                    <Label>Cliente</Label>
                                    <Input name="client" value={formData.client} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ano</Label>
                                    <Input name="year" type="number" value={formData.year} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center justify-between">
                                        <span>Tecnologias / Serviços (Tags)</span>
                                        <span className="text-[11px] text-muted-foreground font-normal">Separados por vírgula</span>
                                    </Label>
                                    <Input 
                                        name="services" 
                                        value={formData.services} 
                                        onChange={handleInputChange} 
                                        placeholder="Ex: React, Tailwind CSS, Supabase, Photoshop, Figma..." 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Link do Projeto</Label>
                                <Input name="project_url" value={formData.project_url} onChange={handleInputChange} />
                            </div>
                        </TabsContent>

                        {/* CONTENT TAB */}
                        <TabsContent isActive={activeTab === 'content'} className="space-y-6">
                            <div className="flex justify-between items-center bg-purple-500/10 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-500/20">
                                <div>
                                    <h3 className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Gerador IA</h3>
                                    <p className="text-xs text-muted-foreground">Gere descrições automáticas com base no título.</p>
                                </div>
                                <Button type="button" variant="outline" onClick={handleGenerateAI} disabled={aiLoading} className="border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300">
                                    {aiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />} Gerar
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <Label>Descrição Curta</Label>
                                <Textarea name="description" value={formData.description} onChange={handleInputChange} />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><Label>Desafio</Label><Textarea name="challenge" value={formData.challenge} onChange={handleInputChange} /></div>
                                    <div><Label>Solução</Label><Textarea name="solution" value={formData.solution} onChange={handleInputChange} /></div>
                                </div>
                                <Label>Resultados</Label><Textarea name="results" value={formData.results} onChange={handleInputChange} />
                                <Label>Vídeos (URLs)</Label><Input name="video_urls" value={formData.video_urls} onChange={handleInputChange} />
                            </div>
                        </TabsContent>

                        {/* MEDIA TAB */}
                        <TabsContent isActive={activeTab === 'media'} className="space-y-8">
                            {/* MAIN IMAGE */}
                            <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Capa Principal</h3>
                                    <div className="w-40">
                                        <Select name="main_image_aspect_ratio" value={formData.main_image_aspect_ratio} onValueChange={(v) => handleSelectChange('main_image_aspect_ratio', v)}>
                                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="16:9">Paisagem (16:9)</SelectItem>
                                                <SelectItem value="4:3">Padrão (4:3)</SelectItem>
                                                <SelectItem value="1:1">Quadrado (1:1)</SelectItem>
                                                <SelectItem value="9:16">Stories (9:16)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    <Label className="cursor-pointer md:col-span-1 h-32 border-2 border-dashed border-muted-foreground/45 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:text-primary transition-colors bg-muted/50">
                                        <UploadCloud className="w-8 h-8 mb-2" />
                                        <span className="text-xs">Selecionar Capa</span>
                                        <Input type="file" onChange={handleMainImageSelect} accept="image/*" className="hidden" />
                                    </Label>

                                    <div className="md:col-span-2 relative aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                                        {mainImagePreview ? (
                                            <div className="relative group w-full h-full">
                                                <img src={mainImagePreview} className="w-full h-full object-contain" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button type="button" size="sm" onClick={() => { setImageToCrop(mainImagePreview); setCropTarget({ type: 'main', fileName: mainImage?.name || 'capa.jpg' }); setCropperOpen(true); }}>
                                                        <CropIcon className="w-4 h-4 mr-2" /> Ajustar Recorte
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (formData.main_image_url ? (
                                            <img src={formData.main_image_url} className="w-full h-full object-cover opacity-50" alt="Current" />
                                        ) : <span className="text-muted-foreground/60 text-sm">Nenhuma capa selecionada</span>)}
                                    </div>
                                </div>
                            </div>

                            {/* GALLERY */}
                            <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-foreground flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> Galeria</h3>
                                    <div className="w-40">
                                        <Select name="gallery_aspect_ratio" value={formData.gallery_aspect_ratio} onValueChange={(v) => handleSelectChange('gallery_aspect_ratio', v)}>
                                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="16:9">PowerBI / Wide (16:9)</SelectItem>
                                                <SelectItem value="4:3">Padrão (4:3)</SelectItem>
                                                <SelectItem value="1:1">Instagram (1:1)</SelectItem>
                                                <SelectItem value="4:5">Feed Instagram (4:5)</SelectItem>
                                                <SelectItem value="9:16">Mobile (9:16)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Label className="cursor-pointer block border-2 border-dashed border-muted-foreground/45 rounded-lg p-8 text-center hover:border-primary hover:text-primary transition-colors bg-muted/50">
                                    <PlusCircle className="w-8 h-8 mx-auto mb-2" />
                                    <span className="text-sm">Adicionar imagens à galeria</span>
                                    <Input type="file" multiple onChange={handleGalleryImagesSelect} accept="image/*" className="hidden" />
                                </Label>

                                {/* New Uploads Preview */}
                                {galleryImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {galleryImages.map((img, idx) => (
                                            <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted border border-border">
                                                <img src={img.preview} className="w-full h-full object-cover" alt="New Gallery Item" />
                                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleCropGalleryImage(idx)}>
                                                        <CropIcon className="w-4 h-4" />
                                                    </Button>
                                                    <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleRemoveNewGalleryImage(idx)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute top-1 right-1 bg-green-500 text-[10px] text-white px-1.5 rounded-sm font-bold">NOVO</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Existing Gallery */}
                                {isEditing && formData.gallery_urls?.length > 0 && (
                                    <div className="pt-4 border-t border-border">
                                        <h4 className="text-xs text-muted-foreground uppercase font-bold mb-3">Imagens Já Salvas</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {formData.gallery_urls.map((url, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-md overflow-hidden bg-muted opacity-75 hover:opacity-100 transition-opacity">
                                                    <img src={url} className="w-full h-full object-cover" alt="Saved" />
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteGalleryUrl(url)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                        <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Salvar Projeto
                        </Button>
                    </DialogFooter>
                </form>

                {/* CROPPER MODAL */}
                <ImageCropperModal
                    isOpen={cropperOpen}
                    onClose={() => setCropperOpen(false)}
                    imageSrc={imageToCrop}
                    aspect={cropTarget?.type === 'main' ? getAspectValue(formData.main_image_aspect_ratio) : getAspectValue(formData.gallery_aspect_ratio)}
                    onCropComplete={onCropComplete}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ProjectFormModal;