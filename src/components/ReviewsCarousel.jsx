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

/**
 * Carrossel de Avaliações RAMIELL
 * Apresenta depoimentos em cards editoriais com cantos de 20px,
 * estrelas douradas e tipografia Geist.
 */
const ReviewsCarousel = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const plugin = useRef(
        Autoplay({ delay: 6000, stopOnInteraction: true })
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
                className={`w-4 h-4 ${i < rating ? 'text-[#C9A227] fill-[#C9A227]' : 'text-white/20'}`}
                strokeWidth={1.5}
            />
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-[#C9A227]" />
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
                            <div className="rounded-[20px] p-8 sm:p-12 border border-white/[0.06] hover:border-[#C9A227]/40 shadow-xl bg-[#0B0B0B] relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(201,162,39,0.12)] max-w-2xl mx-auto group">
                                <Quote className="absolute top-6 right-8 w-14 h-14 text-white/[0.03] group-hover:text-[#C9A227]/[0.08] pointer-events-none transform rotate-180 transition-colors" />

                                <div className="relative z-10 text-center">
                                    <div className="flex justify-center gap-1.5 mb-6">
                                        {renderStars(Number(review.rating) || 5)}
                                    </div>

                                    <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 font-normal max-w-xl mx-auto italic">
                                        "{review.comment}"
                                    </p>

                                    <div className="flex flex-col items-center justify-center space-y-2.5">
                                        {review.avatar_url ? (
                                            <div className="w-12 h-12 rounded-full p-[1.5px] bg-[#C9A227]/40 shadow-md">
                                                <img alt={review.name} className="w-full h-full rounded-full object-cover bg-[#121212]" src={review.avatar_url} loading="lazy" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#121212] border border-white/[0.06] flex items-center justify-center">
                                                <User className="w-5 h-5 text-[#C9A227]" strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-white group-hover:text-[#ECBD57] text-base transition-colors tracking-tight">
                                                {review.name}
                                            </h4>
                                            {review.role && (
                                                <p className="text-xs font-mono text-[#9E9E9E] mt-0.5">{review.role}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex border border-white/[0.08] bg-[#0B0B0B] text-white hover:bg-[#121212] hover:text-[#C9A227] rounded-full" />
            <CarouselNext className="hidden sm:flex border border-white/[0.08] bg-[#0B0B0B] text-white hover:bg-[#121212] hover:text-[#C9A227] rounded-full" />
        </Carousel>
    );
};

export default ReviewsCarousel;
