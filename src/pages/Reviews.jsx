import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Quote, ThumbsUp, Loader2, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
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
    const [userLikes, setUserLikes] = useState(new Set());

    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
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
            setReviews(data || []);
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

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-[#4d7c0f] dark:text-[#bcf13b] fill-current' : 'text-slate-300 dark:text-gray-600'}`}
            />
        ));
    };

    const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 5.0;

    return (
        <>
            <Helmet>
                <title>Avaliações - Rafael Pita Solutions</title>
                <meta name="description" content="Veja o que nossos clientes dizem sobre nossos serviços. Avaliações reais de projetos de design, desenvolvimento, marketing digital e muito mais." />
            </Helmet>

            <div className="pt-20 min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
                {/* Hero Section */}
                <section className="py-20 relative bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
                                Todas as <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Avaliações</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Veja os depoimentos reais de clientes que confiaram em nossos serviços e na qualidade do nosso trabalho
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Carousel Section */}
                <section className="py-4 pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {loadingReviews ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="w-12 h-12 animate-spin text-[#4d7c0f] dark:text-[#bcf13b]" />
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
                                                <motion.div className="service-card p-6 rounded-xl relative h-full flex flex-col border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 group shadow-sm">
                                                    <div className="absolute top-4 right-4">
                                                        <Quote className="w-8 h-8 text-lime-600/30 dark:text-[#bcf13b]/30 group-hover:text-lime-600/60 dark:group-hover:text-[#bcf13b]/60 transition-colors" />
                                                    </div>
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        {review.avatar_url ? (
                                                            <img
                                                                alt={review.name}
                                                                className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-[#23231f]"
                                                                src={review.avatar_url}
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] flex items-center justify-center">
                                                                <User className="w-6 h-6 text-slate-400 dark:text-gray-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3 className="text-slate-900 dark:text-white font-bold group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors">{review.name}</h3>
                                                            <p className="text-slate-600 dark:text-gray-400 text-sm font-medium">{review.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mb-4">{renderStars(review.rating)}</div>
                                                    <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed flex-grow font-medium">"{review.comment}"</p>
                                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-gray-500 mt-auto pt-4 border-t border-slate-200 dark:border-[#23231f]">
                                                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                                        <button
                                                            onClick={() => handleLikeToggle(review.id, review.likes)}
                                                            className={`flex items-center space-x-1.5 transition-colors ${userLikes.has(review.id) ? 'text-[#4d7c0f] dark:text-[#bcf13b]' : 'text-slate-400 dark:text-gray-400 hover:text-[#4d7c0f] dark:hover:text-[#bcf13b]'}`}
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
                                <CarouselPrevious className="hidden sm:flex bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] text-slate-800 dark:text-white hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] shadow-sm" />
                                <CarouselNext className="hidden sm:flex bg-white dark:bg-[#121210] border-slate-200 dark:border-[#23231f] text-slate-800 dark:text-white hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] shadow-sm" />
                            </Carousel>
                        )}
                    </div>
                </section>

                {/* Metrics Section */}
                <section className="py-20 bg-slate-100/60 dark:bg-[#121210] border-y border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center p-6 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 transition-colors shadow-sm">
                                <div className="text-4xl md:text-5xl font-black text-[#4d7c0f] dark:text-[#bcf13b] mb-2">{averageRating.toFixed(1)}</div>
                                <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium">Avaliação Média</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center p-6 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 transition-colors shadow-sm">
                                <div className="text-4xl md:text-5xl font-black text-[#4d7c0f] dark:text-[#bcf13b] mb-2">{reviews.length}</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium">Avaliações</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center p-6 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 transition-colors shadow-sm">
                                <div className="text-4xl md:text-5xl font-black text-[#4d7c0f] dark:text-[#bcf13b] mb-2">98%</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium">Satisfação</div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center p-6 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 transition-colors shadow-sm">
                                <div className="text-4xl md:text-5xl font-black text-[#4d7c0f] dark:text-[#bcf13b] mb-2">200+</div>
                                <div className="text-slate-600 dark:text-gray-400 font-medium">Clientes Atendidos</div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Review Form Section */}
                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08] border-t border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                                Deixe sua <span className="text-[#4d7c0f] dark:text-[#bcf13b]">avaliação</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-gray-400 font-medium">Compartilhe sua experiência conosco e ajude outros clientes</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#121210] p-8 md:p-10 rounded-2xl border border-slate-200 dark:border-[#23231f] shadow-xl hover:border-lime-500/40 dark:hover:border-[#bcf13b]/40 transition-colors"
                        >
                            <ReviewForm onSuccess={fetchReviews} />
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Reviews;