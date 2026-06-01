import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import getCroppedImg from '@/utils/cropImage';
import { Loader2, Check, X, ZoomIn } from 'lucide-react';

const ImageCropperModal = ({ isOpen, onClose, imageSrc, aspect = 16 / 9, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImageBlob);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl bg-gray-900 border-gray-800 text-white p-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="p-4 bg-gray-900/50 backdrop-blur-sm z-10 border-b border-white/10">
                    <DialogTitle>Ajustar Imagem</DialogTitle>
                    <DialogDescription className="text-gray-400 text-xs">
                        Ajuste o zoom e a posição da imagem para definir a área visível.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-[400px] bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className="p-4 space-y-4 bg-gray-900 border-t border-white/10">
                    <div className="flex items-center gap-4">
                        <ZoomIn className="w-5 h-5 text-gray-400" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    <DialogFooter className="flex-row gap-2 justify-end">
                        <Button variant="ghost" onClick={onClose} disabled={loading} className="flex-1 sm:flex-none">
                            <X className="w-4 h-4 mr-2" /> Cancelar
                        </Button>
                        <Button onClick={handleConfirm} disabled={loading} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                            Confirmar
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageCropperModal;
