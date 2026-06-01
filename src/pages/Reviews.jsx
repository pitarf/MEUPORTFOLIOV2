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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
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
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile);

            if (uploadError) {
                setSubmitting(false);
                toast({
                    variant: "destructive",
                    title: "Erro no Upload",
                    description: `Não foi possível enviar sua foto: ${uploadError.message}`,
                });
                return;
            }

            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
            avatar_url = urlData.publicUrl;
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

            <div className="pt-20">
                <section className="py-20 tech-pattern">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="gradient-text">Avaliações</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
                                                <motion.div className="service-card p-6 rounded-xl relative h-full flex flex-col">
                                                    <div className="absolute top-4 right-4"><Quote className="w-8 h-8 text-blue-400/30" /></div>
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        {review.avatar_url ? (
                                                            <img alt={review.name} className="w-12 h-12 rounded-full object-cover" src={review.avatar_url} loading="lazy" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                                                <User className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="text-white font-semibold">{review.name}</h3>
                                                            <p className="text-gray-400 text-sm">{review.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-4">{renderStars(review.rating)}</div>
                                                    <p className="text-gray-300 mb-4 leading-relaxed flex-grow">"{review.comment}"</p>
                                                    <div className="flex justify-between items-center text-sm text-gray-400 mt-auto">
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

                <section className="py-20 bg-gray-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{averageRating.toFixed(1)}</div>
                                <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
                                <div className="text-gray-400">Avaliação Média</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">{reviews.length}</div>
                                <div className="text-gray-400">Avaliações</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                                <div className="text-gray-400">Satisfação</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                                <div className="text-4xl font-bold gradient-text mb-2">200+</div>
                                <div className="text-gray-400">Clientes Atendidos</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-gray-900/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
                            <h2 className="text-4xl font-bold gradient-text mb-6">Deixe sua avaliação</h2>
                            <p className="text-xl text-gray-400">Compartilhe sua experiência conosco e ajude outros clientes</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-effect p-8 rounded-2xl">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="glass-effect p-8 rounded-2xl">
                                <ReviewForm />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Reviews;