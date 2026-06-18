import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, HardDrive, CheckCircle2, AlertTriangle, Play, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const StorageOptimization = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ totalImages: 0, processed: 0, savedSpace: 0 }); // savedSpace is hard to calc without metadata, treating as placeholder
    const [currentFile, setCurrentFile] = useState('');
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao buscar projetos.' });
            return;
        }
        setProjects(data);

        // Calculate total images
        let total = 0;
        data.forEach(p => {
            if (p.main_image_url) total++;
            if (p.gallery_urls) total += p.gallery_urls.length;
        });
        setStats(prev => ({ ...prev, totalImages: total }));
    };

    const addLog = (message, type = 'info') => {
        setLogs(prev => [{ message, type, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    };

    const processImage = async (url, project, type) => {
        try {
            // Se já for uma URL do Firebase, ignora a migração
            if (url.includes('firebasestorage.googleapis.com')) {
                addLog(`Ignorado (já no Firebase): ${url.split('/').pop()}`, 'warning');
                return url;
            }

            // 1. Extrair path da URL do Supabase
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/project-images/');
            if (pathParts.length < 2) return url;
            const path = decodeURIComponent(pathParts[1]);

            setCurrentFile(path);

            // 2. Download do arquivo
            const response = await fetch(url);
            const blob = await response.blob();
            const originalSize = blob.size;

            // 3. Converter e Otimizar para WebP
            const webpFile = await optimizeAndConvertToWebP(new File([blob], path, { type: blob.type }));
            const newSize = webpFile.size;

            // 4. Upload para o Firebase Storage
            const finalName = path.replace(/\.[^/.]+$/, "") + ".webp";
            const storageRef = ref(storage, `project-images/${finalName}`);
            const snapshot = await uploadBytes(storageRef, webpFile);
            const firebasePublicUrl = await getDownloadURL(snapshot.ref);

            addLog(`Migrado: ${finalName} (${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB)`, 'success');

            // 5. Excluir do Supabase Storage
            try {
                await supabase.storage.from('project-images').remove([path]);
                addLog(`Removido do Supabase: ${path}`, 'info');
            } catch (delErr) {
                console.warn(`Erro ao excluir ${path} do Supabase:`, delErr);
            }

            return firebasePublicUrl;

        } catch (error) {
            console.error(error);
            addLog(`Erro ao migrar ${url}: ${error.message}`, 'error');
            return url; // Retorna URL antiga em caso de erro para não danificar o banco
        }
    };

    const startOptimization = async () => {
        if (!window.confirm('Isso irá baixar, converter para WebP, fazer upload para o Firebase Storage e atualizar as referências de todas as imagens no banco de dados. Deseja continuar?')) return;

        setLoading(true);
        setStats(prev => ({ ...prev, processed: 0 }));
        setLogs([]);

        let processedCount = 0;

        for (const project of projects) {
            let updatedData = {};
            let hasChanges = false;

            // Processar Capa Principal
            if (project.main_image_url && !project.main_image_url.includes('firebasestorage.googleapis.com')) {
                const newUrl = await processImage(project.main_image_url, project, 'main');
                if (newUrl !== project.main_image_url) {
                    updatedData.main_image_url = newUrl;
                    hasChanges = true;
                }
                processedCount++;
                setStats(prev => ({ ...prev, processed: processedCount }));
            }

            // Processar Galeria
            if (project.gallery_urls && project.gallery_urls.length > 0) {
                const newGalleryUrls = [];
                let galleryChanged = false;

                for (const url of project.gallery_urls) {
                    if (!url.includes('firebasestorage.googleapis.com')) {
                        const newUrl = await processImage(url, project, 'gallery');
                        newGalleryUrls.push(newUrl);
                        if (newUrl !== url) {
                            galleryChanged = true;
                        }
                    } else {
                        newGalleryUrls.push(url);
                    }
                    processedCount++;
                    setStats(prev => ({ ...prev, processed: processedCount }));
                }

                if (galleryChanged) {
                    updatedData.gallery_urls = newGalleryUrls;
                    hasChanges = true;
                }
            }

            // Atualiza o banco do Supabase com as URLs do Firebase
            if (hasChanges) {
                const { error } = await supabase
                    .from('projects')
                    .update(updatedData)
                    .eq('id', project.id);

                if (error) {
                    addLog(`Erro ao salvar projeto "${project.title}" no banco: ${error.message}`, 'error');
                } else {
                    addLog(`Salvo no banco de dados: "${project.title}"`, 'info');
                }
            }
        }

        setLoading(false);
        setCurrentFile('');
        fetchProjects(); // Recarrega dados com novas URLs
        toast({ title: 'Migração Concluída!', description: `${processedCount} imagens processadas.` });
    };

    const progressPercentage = stats.totalImages === 0 ? 0 : (stats.processed / stats.totalImages) * 100;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Otimização de Armazenamento</h1>
                    <p className="text-muted-foreground mt-1">Recupere espaço comprimindo imagens antigas.</p>
                </div>
                <Button
                    onClick={startOptimization}
                    disabled={loading || stats.totalImages === 0}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                >
                    {loading ? <Loader2 className="mr-2 w-5 h-5 animate-spin" /> : <Play className="mr-2 w-5 h-5" />}
                    {loading ? 'Otimizando...' : 'Iniciar Otimização'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><HardDrive className="w-5 h-5 text-blue-400" /> Status do Processo</CardTitle>
                        <CardDescription>O navegador fará todo o trabalho. Não feche esta aba.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progresso Geral</span>
                                <span className={loading ? "text-green-500 animate-pulse" : "text-muted-foreground"}>{stats.processed} / {stats.totalImages} imagens</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
                        </div>

                        {loading && (
                            <div className="p-4 bg-muted/50 rounded-lg border border-border flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-500 dark:text-purple-400" />
                                <div className="overflow-hidden">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Processando agora:</p>
                                    <p className="text-sm truncate font-mono text-purple-650 dark:text-purple-300" title={currentFile}>{currentFile || 'Preparando...'}</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-muted/40 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs border border-border space-y-1">
                            {logs.length === 0 && <p className="text-muted-foreground/60 italic text-center py-10">O log de execução aparecerá aqui...</p>}
                            {logs.map((log, i) => (
                                <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-destructive' : log.type === 'success' ? 'text-green-600 dark:text-green-400' : log.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                                    <span className="text-muted-foreground/60">[{log.timestamp}]</span>
                                    <span>{log.message}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5 text-purple-400" /> Resumo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">Total de Projetos</p>
                            <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">Total de Imagens</p>
                            <p className="text-2xl font-bold text-foreground">{stats.totalImages}</p>
                        </div>
                        <div className="bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-yellow-800 dark:text-yellow-200/80">
                                    <p className="font-semibold mb-1">Atenção</p>
                                    <p>Esta ação substitui os arquivos originais. Certifique-se de que sua conexão com a internet esteja estável.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StorageOptimization;
