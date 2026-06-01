import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Star, Quote, User } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";

const ReviewsCarousel = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const plugin = useRef(
        Autoplay({ delay: 30000, stopOnInteraction: true })
    );

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching reviews:', error);
            } else {
                setReviews(data);
            }
            setLoading(false);
        };

        fetchReviews();
    }, []);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                    }`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }

    if (reviews.length === 0) {
        return null;
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-3xl mx-auto px-4 sm:px-0"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {reviews.map((review) => (
                    <CarouselItem key={review.id}>
                        <div className="p-2 sm:p-4">
                            {/* Card Premium de Depoimento */}
                            <div className="glass-effect rounded-2xl p-6 sm:p-10 border border-gray-200/50 dark:border-white/10 shadow-xl backdrop-blur-xl bg-white/50 dark:bg-gray-900/40 relative overflow-hidden transition-all duration-300 hover:shadow-2xl max-w-2xl mx-auto">
                                
                                {/* Aspas flutuantes elegantes como marca d'água */}
                                <Quote className="absolute top-4 right-6 w-16 h-16 text-blue-500/10 dark:text-blue-400/10 pointer-events-none transform rotate-180" />
                                
                                <div className="relative z-10 text-center">
                                    <p className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200 italic leading-relaxed mb-6 font-medium max-w-xl mx-auto transition-colors duration-300">
                                        "{review.comment}"
                                    </p>
                                    
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        {/* Avatar com moldura gradiente refinada */}
                                        {review.avatar_url ? (
                                            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-600 shadow-md">
                                                <img alt={review.name} className="w-full h-full rounded-full object-cover bg-background" src={review.avatar_url} loading="lazy" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-650/20 flex items-center justify-center border border-blue-500/30">
                                                <User className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg transition-colors duration-300">{review.name}</h4>
                                            {review.role && (
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase mt-0.5 transition-colors duration-300">{review.role}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-1 mt-4">{renderStars(review.rating)}</div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex border-gray-200/80 dark:border-gray-800 hover:bg-gray-150 dark:hover:bg-white/10 hover:text-blue-500 text-gray-600 dark:text-gray-400 transition-colors" />
            <CarouselNext className="hidden md:flex border-gray-200/80 dark:border-gray-800 hover:bg-gray-150 dark:hover:bg-white/10 hover:text-blue-500 text-gray-600 dark:text-gray-400 transition-colors" />
        </Carousel>
    );
};

export default ReviewsCarousel;