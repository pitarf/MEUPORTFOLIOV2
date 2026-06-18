import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Quote, ThumbsUp, MessageCircle, Loader2, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ReviewForm from '@/components/ReviewForm';

const Reviews = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userLikes, setUserLikes] = useState(new Set());

    const [newReview, setNewReview] = useState({
        name: '',
        role: '',
        rating: 5,
        comment: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    const fetchReviews = useCallback(async () => {
        setLoadingReviews(true);
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar avaliações",
                description: "Não foi possível buscar as avaliações. Tente novamente mais tarde.",
            });
        } else {
            setReviews(data);
        }
        setLoadingReviews(false);
    }, [toast]);

    const fetchUserLikes = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('review_likes')
            .select('review_id')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching user likes:', error);
        } else {
            setUserLikes(new Set(data.map(like => like.review_id)));
        }
    }, [user]);

    useEffect(() => {
        fetchReviews();
        if (user) {
            fetchUserLikes();
        }
    }, [fetchReviews, user, fetchUserLikes]);

    const handleLikeToggle = async (reviewId, currentLikes) => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Acesso Negado",
                description: "Você precisa estar logado para curtir uma avaliação.",
            });
            return;
        }

        const isLiked = userLikes.has(reviewId);
        const newLikesCount = isLiked ? currentLikes - 1 : currentLikes + 1;

        setReviews(prevReviews =>
            prevReviews.map(r => r.id === reviewId ? { ...r, likes: newLikesCount } : r)
        );
        const newUserLikes = new Set(userLikes);
        if (isLiked) {
            newUserLikes.delete(reviewId);
        } else {
            newUserLikes.add(reviewId);
        }
        setUserLikes(newUserLikes);

        if (isLiked) {
            const { error: deleteError } = await supabase
                .from('review_likes')
                .delete()
                .match({ review_id: reviewId, user_id: user.id });
            if (deleteError) console.error("Error unliking:", deleteError);
        } else {
            const { error: insertError } = await supabase
                .from('review_likes')
                .insert({ review_id: reviewId, user_id: user.id });
            if (insertError) console.error("Error liking:", insertError);
        }

        const { error: updateError } = await supabase
            .from('reviews')
            .update({ likes: newLikesCount })
            .eq('id', reviewId);
        if (updateError) {
            console.error("Error updating likes count:", updateError);
            fetchReviews();
            fetchUserLikes();
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);

                const optimizedFile = await optimizeAndConvertToWebP(file);
                setAvatarFile(optimizedFile);
            } catch (error) {
                console.error("Error optimizing avatar:", error);
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
            } catch (uploadError) {
                setSubmitting(false);
                toast({
                    variant: "destructive",
                    title: "Erro no Upload",
                    description: `Não foi possível enviar sua foto: ${uploadError.message}`,
                });
                return;
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
            toast({
                title: "Avaliação Enviada!",
                description: "Obrigado! Sua avaliação foi enviada para aprovação.",
            });
            setNewReview({ name: '', role: '', rating: 5, comment: '' });
            setAvatarFile(null);
            setAvatarPreview(null);
        }
        setSubmitting(false);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                    }`}
            />
        ));
    };

    const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

    return (
        <>
            <Helmet>
                <title>Avaliações - Rafael Pita Solutions</title>
                <meta name="description" content="Veja o que nossos clientes dizem sobre nossos serviços. Avaliações reais de projetos de design, desenvolvimento, marketing digital e muito mais." />
            </Helmet>

            <div className="pt-20 min-h-screen bg-background text-foreground transition-colors duration-300">
                <section className="py-20 tech-pattern relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="gradient-text">Avaliações</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium transition-colors duration-300">
                                Veja os depoimentos reais de clientes que confiaram em nossos serviços e na qualidade do nosso trabalho
                            </p>
                        </motion.div>
                    </div>
                </section>


                <section className="py-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {loadingReviews ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            <Carousel
                                plugins={[plugin.current]}
                                opts={{ align: "start", loop: true }}
                                className="w-full"
                                onMouseEnter={plugin.current.stop}
                                onMouseLeave={plugin.current.reset}
                            >
                                <CarouselContent>
                                    {reviews.map((review) => (
                                        <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-4 h-full">
                                                <motion.div className="service-card p-6 rounded-xl relative h-full flex flex-col border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-transparent shadow-lg dark:shadow-none transition-all duration-300">
                                                    <div className="absolute top-4 right-4"><Quote className="w-8 h-8 text-blue-400/30" /></div>
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        {review.avatar_url ? (
                                                            <img alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm" src={review.avatar_url} loading="lazy" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                                                                <User className="w-6 h-6 text-slate-400 dark:text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="text-gray-900 dark:text-white font-bold transition-colors duration-300">{review.name}</h3>
                                                            <p className="text-slate-600 dark:text-gray-400 text-sm font-medium transition-colors duration-300">{review.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-4">{renderStars(review.rating)}</div>
                                                    <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed flex-grow font-medium transition-colors duration-300">"{review.comment}"</p>
                                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-gray-400 mt-auto transition-colors duration-300">
                                                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => handleLikeToggle(review.id, review.likes)}
                                                            className={`flex items-center space-x-1 hover:text-blue-400 transition-colors ${userLikes.has(review.id) ? 'text-blue-400' : ''}`}
                                                        >
                                                            <ThumbsUp className={`w-4 h-4 ${userLikes.has(review.id) ? 'fill-current' : ''}`} />
                                                            <span>{review.likes > 0 ? review.likes : 'Curtir'}</span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex" />
                                <CarouselNext className="hidden sm:flex" />
                            </Carousel>
                        )}
                    </div>
                </section>

                <section className="py-20 bg-slate-50 dark:bg-gray-900/40 border-y border-slate-200/50 dark:border-white/5 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{averageRating.toFixed(1)}</div>
                                <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">Avaliação Média</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{reviews.length}</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">Avaliações</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">Satisfação</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">200+</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">Clientes Atendidos</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-slate-50 dark:bg-gray-900/40 border-t border-slate-200/50 dark:border-white/5 transition-colors duration-300">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
                            <h2 className="text-4xl font-bold gradient-text mb-6">Deixe sua avaliação</h2>
                            <p className="text-xl text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">Compartilhe sua experiência conosco e ajude outros clientes</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-effect p-8 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-xl transition-all duration-300">
                            <ReviewForm />
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Reviews;