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
            className="w-full max-w-4xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {reviews.map((review) => (
                    <CarouselItem key={review.id}>
                        <div className="p-1 text-center">
                            <Quote className="w-12 h-12 text-blue-400/30 mx-auto mb-4" />
                            <p className="text-lg md:text-xl text-gray-300 italic mb-6 max-w-3xl mx-auto">
                                "{review.comment}"
                            </p>
                            <div className="flex items-center justify-center space-x-4">
                                {review.avatar_url ? (
                                    <img alt={review.name} className="w-12 h-12 rounded-full object-cover" src={review.avatar_url} loading="lazy" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-white">{review.name}</h4>
                                    <p className="text-sm text-gray-400">{review.role}</p>
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">{renderStars(review.rating)}</div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
    );
};

export default ReviewsCarousel;