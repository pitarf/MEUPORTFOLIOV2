import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from '@/lib/customSupabaseClient';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Autoplay from "embla-carousel-autoplay";

const ProjectCarousel = ({ categorySlug, excludeCategorySlug, onDataLoaded, basePath = '/portfolio' }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const plugin = useRef(
        Autoplay({ delay: 1000, stopOnInteraction: true })
    );

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                // Use !inner if filtering by category (include or exclude), otherwise left join
                const selectString = (categorySlug || excludeCategorySlug)
                    ? `*, category:categories!inner(slug, title)`
                    : `*, category:categories(slug, title)`;

                let query = supabase
                    .from('projects')
                    .select(selectString)
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (categorySlug) {
                    query = query.eq('category.slug', categorySlug);
                }

                if (excludeCategorySlug) {
                    query = query.neq('category.slug', excludeCategorySlug);
                }

                const { data, error } = await query;

                if (error) {
                    console.error('Error fetching projects for carousel:', error);
                } else {
                    let fetchedProjects = data || [];

                    // Randomize the order
                    for (let i = fetchedProjects.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [fetchedProjects[i], fetchedProjects[j]] = [fetchedProjects[j], fetchedProjects[i]];
                    }

                    setProjects(fetchedProjects);
                    if (onDataLoaded) {
                        onDataLoaded(data ? data.length : 0);
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [categorySlug, onDataLoaded]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-[#4d7c0f] dark:text-[#bcf13b]" />
            </div>
        );
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {projects.map((project) => (
                    <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card className="service-card rounded-xl overflow-hidden group border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] bg-white dark:bg-[#121210] shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300">
                                <CardContent className="flex flex-col aspect-square items-start justify-between p-0">
                                    <Link to={`${basePath}/${project.category?.slug}/${project.slug}`} className="block w-full h-full">
                                        <div className="relative overflow-hidden h-full">
                                            <img alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src={project.main_image_url || "https://images.unsplash.com/photo-1572177812156-58036aae439c"} loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                                                <span className="text-sm font-bold text-[#bcf13b] mb-1">{project.category?.title}</span>
                                                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <Button size="sm" variant="outline" className="bg-[#121210]/80 border-[#23231f] hover:border-[#bcf13b] text-white hover:text-[#bcf13b] backdrop-blur-sm">
                                                        Ver detalhes <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#181814] hover:text-lime-600 dark:hover:text-[#bcf13b]" />
            <CarouselNext className="hidden sm:flex border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#181814] hover:text-lime-600 dark:hover:text-[#bcf13b]" />
        </Carousel>
    );
};

export default ProjectCarousel;