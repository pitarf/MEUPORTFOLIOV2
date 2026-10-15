import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Star, Loader2, MessageCircle, User, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';

const ReviewForm = ({ onSuccess, className }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [newReview, setNewReview] = useState({
        name: '',
        role: '',
        rating: 5,
        comment: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);

                // Compress and convert to WebP
                const compressedFile = await optimizeAndConvertToWebP(file);
                setAvatarFile(compressedFile);
                if (import.meta.env.DEV) {
                    console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(compressedFile.size / 1024).toFixed(2)}KB`);
                }
            } catch (error) {
                console.error("Error compressing image:", error);
                setAvatarFile(file);
            }
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.comment) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Por favor, preencha pelo menos o nome e comentário.",
            });
            return;
        }

        setSubmitting(true);
        let avatar_url = null;

        if (avatarFile) {
            try {
                const fileName = `${Date.now()}.webp`;
                const storageRef = ref(storage, `avatars/${fileName}`);
                const snapshot = await uploadBytes(storageRef, avatarFile);
                avatar_url = await getDownloadURL(snapshot.ref);
            } catch (err) {
                console.error("Unexpected image error:", err);
                toast({
                    variant: "warning",
                    title: "Aviso na Imagem",
                    description: "Erro ao processar imagem. Seguindo apenas com o comentário.",
                });
            }
        }

        const reviewData = { ...newReview, avatar_url, is_approved: false };
        if (user) {
            reviewData.user_id = user.id;
        }

        const { error: insertError } = await supabase.from('reviews').insert([reviewData]);

        if (insertError) {
            setSubmitting(false);
            toast({
                variant: "destructive",
                title: "Erro ao Enviar",
                description: `Não foi possível salvar sua avaliação: ${insertError.message}`,
            });
        } else {
            setIsSuccess(true);
            toast({
                title: "Avaliação Enviada!",
                description: "Obrigado! Sua avaliação foi enviada para aprovação.",
            });
            setNewReview({ name: '', role: '', rating: 5, comment: '' });
            setAvatarFile(null);
            setAvatarPreview(null);

            if (onSuccess) {
                onSuccess();
            }
        }
        setSubmitting(false);
    };

    if (isSuccess) {
        return (
            <div className={`flex flex-col items-center justify-center p-8 text-center space-y-6 ${className || ''}`}>
                <div className="w-20 h-20 bg-[#bcf13b] text-[#0a0a08] rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-[#bcf13b]/20">
                    <Star className="w-10 h-10 fill-current" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">Obrigado!</h3>
                    <p className="text-slate-600 dark:text-gray-300 text-lg font-medium">Sua avaliação foi enviada com sucesso e passará por moderação.</p>
                </div>
                <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-6 border-slate-300 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] text-slate-800 dark:text-white hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] bg-white dark:bg-transparent w-full py-6 text-lg font-bold transition-all shadow-sm"
                >
                    Enviar outra avaliação
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmitReview} className={`space-y-6 ${className || ''}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-[#181814] flex items-center justify-center overflow-hidden border border-slate-200 dark:border-[#23231f] shadow-inner">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Preview do Avatar" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                            <User className="w-12 h-12 text-slate-400 dark:text-gray-500" />
                        )}
                    </div>
                    <label
                        htmlFor="avatar-upload-form"
                        className="absolute -bottom-1 -right-1 bg-[#bcf13b] text-[#0a0a08] p-2 rounded-full cursor-pointer hover:bg-[#a8df2a] transition-colors shadow-md"
                        title="Upload de foto"
                    >
                        <Upload className="w-4 h-4" />
                        <input id="avatar-upload-form" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                </div>
                <div className="w-full flex-1 grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="review-name" className="text-slate-700 dark:text-gray-300 font-semibold mb-1.5 block">Nome *</Label>
                        <Input
                            id="review-name"
                            type="text"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            placeholder="Seu nome"
                            className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus-visible:ring-lime-500 dark:focus-visible:ring-[#bcf13b] focus-visible:border-lime-500 dark:focus-visible:border-[#bcf13b]"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="review-role" className="text-slate-700 dark:text-gray-300 font-semibold mb-1.5 block">Cargo / Empresa</Label>
                        <Input
                            id="review-role"
                            type="text"
                            value={newReview.role}
                            onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                            placeholder="Ex: CEO, TechStart"
                            className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus-visible:ring-lime-500 dark:focus-visible:ring-[#bcf13b] focus-visible:border-lime-500 dark:focus-visible:border-[#bcf13b]"
                        />
                    </div>
                </div>
            </div>

            <div>
                <Label className="text-slate-700 dark:text-gray-300 font-semibold mb-2 block">Sua Avaliação</Label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-[#4d7c0f] dark:text-[#bcf13b] fill-current' : 'text-slate-300 dark:text-gray-600'} hover:text-lime-500 dark:hover:text-[#bcf13b] transition-colors`} />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <Label htmlFor="review-comment" className="text-slate-700 dark:text-gray-300 font-semibold mb-1.5 block">Comentário *</Label>
                <Textarea
                    id="review-comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    placeholder="Conte-nos sobre sua experiência com nossos serviços..."
                    className="bg-white dark:bg-[#181814] border-slate-200 dark:border-[#23231f] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus-visible:ring-lime-500 dark:focus-visible:ring-[#bcf13b] focus-visible:border-lime-500 dark:focus-visible:border-[#bcf13b]"
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#bcf13b]/20 py-3.5 text-base transition-all flex items-center justify-center"
                disabled={submitting}
            >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#0a0a08]" /> : <MessageCircle className="w-5 h-5 mr-2 text-[#0a0a08]" />}
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
        </form>
    );
};

export default ReviewForm;
