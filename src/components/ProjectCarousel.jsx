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

/**
 * Carrossel de Projetos RAMIELL
 * Apresenta projetos em formato card editorial quadrado com cantos de 20px,
 * gradiente escuro e acentos dourados.
 */
const ProjectCarousel = ({ categorySlug, excludeCategorySlug, onDataLoaded, basePath = '/portfolio' }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const plugin = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true })
    );

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
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
                <Loader2 className="h-10 w-10 animate-spin text-[#C9A227]" />
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
                        <div className="p-2">
                            <div className="rounded-[20px] overflow-hidden group border border-white/[0.06] hover:border-[#C9A227]/40 bg-[#0B0B0B] hover:shadow-[0_0_24px_rgba(201,162,39,0.12)] transition-all duration-300">
                                <Link to={`${basePath}/${project.category?.slug}/${project.slug}`} className="block w-full">
                                    <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#121212]">
                                        <img
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                                            src={project.main_image_url || "https://images.unsplash.com/photo-1572177812156-58036aae439c"}
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent" />
                                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                                            <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] mb-1">
                                                {project.category?.title}
                                            </span>
                                            <h3 className="text-xl font-semibold text-white mb-3 tracking-[-0.02em] leading-snug group-hover:text-[#ECBD57] transition-colors">
                                                {project.title}
                                            </h3>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#C9A227] px-4 py-2 rounded-full border border-white/[0.08] bg-[#070707]/90 backdrop-blur-md">
                                                    <span>Ver detalhes</span>
                                                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
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

export default ProjectCarousel;
