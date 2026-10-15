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
                setReviews(data || []);
            }
            setLoading(false);
        };

        fetchReviews();
    }, []);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-[#4d7c0f] dark:text-[#bcf13b] fill-current' : 'text-slate-300 dark:text-gray-600'}`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-[#4d7c0f] dark:text-[#bcf13b]" />
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
                            <div className="rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] shadow-xl bg-white dark:bg-[#121210] relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] max-w-2xl mx-auto group">
                                
                                {/* Aspas flutuantes como marca d'agua */}
                                <Quote className="absolute top-4 right-6 w-16 h-16 text-lime-600/10 dark:text-[#bcf13b]/10 group-hover:text-lime-600/20 dark:group-hover:text-[#bcf13b]/20 pointer-events-none transform rotate-180 transition-colors" />
                                
                                <div className="relative z-10 text-center">
                                    <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-gray-200 italic leading-relaxed mb-6 font-medium max-w-xl mx-auto transition-colors">
                                        "{review.comment}"
                                    </p>
                                    
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        {review.avatar_url ? (
                                            <div className="w-14 h-14 rounded-full p-[2px] bg-[#bcf13b] shadow-md shadow-[#bcf13b]/20">
                                                <img alt={review.name} className="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-[#0a0a08]" src={review.avatar_url} loading="lazy" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] flex items-center justify-center">
                                                <User className="w-6 h-6 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] text-base sm:text-lg transition-colors">{review.name}</h4>
                                            {review.role && (
                                                <p className="text-xs sm:text-sm text-[#4d7c0f] dark:text-[#bcf13b] font-semibold tracking-wide uppercase mt-0.5">{review.role}</p>
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
            <CarouselPrevious className="hidden md:flex border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] text-slate-800 dark:text-white transition-colors shadow-sm" />
            <CarouselNext className="hidden md:flex border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] text-slate-800 dark:text-white transition-colors shadow-sm" />
        </Carousel>
    );
};

export default ReviewsCarousel;