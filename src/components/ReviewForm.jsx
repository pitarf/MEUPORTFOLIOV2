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
                // Show preview immediately with original file (optional, but faster feedback)
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);

                // Compress and convert to WebP
                const compressedFile = await optimizeAndConvertToWebP(file);
                setAvatarFile(compressedFile);
                console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(compressedFile.size / 1024).toFixed(2)}KB`);
            } catch (error) {
                console.error("Error compressing image:", error);
                // Fallback to original file if compression fails
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
            <div className={`flex flex-col items-center justify-center p-8 text-center space-y-6 ${className}`}>
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-green-500/20">
                    <Star className="w-10 h-10 text-white fill-current" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">Obrigado!</h3>
                    <p className="text-gray-300 text-lg">Sua avaliação foi enviada com sucesso.</p>
                </div>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-6 border-gray-600 text-white hover:bg-gray-800 w-full py-6 text-lg">
                    Enviar outra avaliação
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmitReview} className={`space-y-6 ${className}`}>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden transition-colors duration-300 border border-slate-300/50 dark:border-transparent shadow-inner">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Preview do Avatar" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                            <User className="w-12 h-12 text-slate-400 dark:text-gray-400 transition-colors duration-300" />
                        )}
                    </div>
                    <label htmlFor="avatar-upload-form" className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                        <Upload className="w-4 h-4 text-white" />
                        <input id="avatar-upload-form" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                </div>
                <div className="flex-1 grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="review-name">Nome *</Label>
                        <Input id="review-name" type="text" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} placeholder="Seu nome" required />
                    </div>
                    <div>
                        <Label htmlFor="review-role">Cargo / Empresa</Label>
                        <Input id="review-role" type="text" value={newReview.role} onChange={(e) => setNewReview({ ...newReview, role: e.target.value })} placeholder="Ex: CEO, TechStart" />
                    </div>
                </div>
            </div>
            <div>
                <Label>Avaliação</Label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} className="focus:outline-none">
                            <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'} hover:text-yellow-400 transition-colors`} />
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <Label htmlFor="review-comment">Comentário *</Label>
                <Textarea id="review-comment" value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows={4} placeholder="Conte-nos sobre sua experiência..." required />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3" disabled={submitting}>
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <MessageCircle className="w-5 h-5 mr-2" />}
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
        </form>
    );
};

export default ReviewForm;
