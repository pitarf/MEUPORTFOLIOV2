import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGalleryModal = ({ images, startIndex, onClose }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        startIndex: startIndex,
        align: 'center',
    });
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isZoomed, setIsZoomed] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
        setCurrentIndex(emblaApi.selectedScrollSnap());
        setIsZoomed(false); // Reset zoom on slide change
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isZoomed) {
                if (event.key === 'Escape') setIsZoomed(false);
                return;
            }
            if (event.key === 'ArrowLeft') {
                scrollPrev();
            } else if (event.key === 'ArrowRight') {
                scrollNext();
            } else if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [scrollPrev, scrollNext, onClose, isZoomed]);

    const toggleZoom = (e) => {
        // Prevent zoom when clicking on buttons inside the image container
        if (e.target.closest('button')) return;
        setIsZoomed(!isZoomed);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="bg-black/90 border-none p-0 w-screen h-screen max-w-full max-h-full flex items-center justify-center rounded-none">
                <div className="relative w-full h-full">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="h-8 w-8" />
                    </Button>

                    <div className="overflow-hidden w-full h-full" ref={emblaRef}>
                        <div className="flex h-full">
                            {images.map((url, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center p-8 overflow-auto" onClick={toggleZoom}>
                                    <motion.img
                                        src={url}
                                        alt={`Galeria do projeto - Imagem ${index + 1}`}
                                        className="max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300"
                                        animate={{ scale: isZoomed ? 2 : 1 }}
                                        style={{
                                            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                        {!isZoomed && canScrollPrev && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={scrollPrev}
                                    className="w-14 h-14 rounded-full bg-black/50 text-white hover:bg-white/20 hover:text-white"
                                >
                                    <ArrowLeft className="h-8 w-8" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isZoomed && canScrollNext && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={scrollNext}
                                    className="w-14 h-14 rounded-full bg-black/50 text-white hover:bg-white/20 hover:text-white"
                                >
                                    <ArrowRight className="h-8 w-8" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageGalleryModal;