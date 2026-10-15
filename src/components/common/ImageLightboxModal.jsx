import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ExternalLink, ZoomIn } from 'lucide-react';

/**
 * Modal Lightbox para visualizacao ampliada de prints e anexos em alta resolucao
 * @param {Object} props
 * @param {boolean} props.isOpen Estado de visibilidade
 * @param {Function} props.onClose Callback ao fechar
 * @param {string} props.imageUrl URL da imagem a exibir
 * @param {string} [props.title] Titulo ou descricao da imagem
 */
export default function ImageLightboxModal({ isOpen, onClose, imageUrl, title = 'Visualização do Print' }) {
    if (!isOpen || !imageUrl) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[92vh] p-3 sm:p-5 bg-slate-950/95 border border-slate-800 text-white flex flex-col items-center justify-between overflow-hidden rounded-2xl">
                {/* Cabecalho da Modal */}
                <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs sm:text-sm">
                    <DialogTitle className="font-semibold text-slate-200 truncate max-w-md">
                        {title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                            title="Abrir em nova aba"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Nova Aba</span>
                        </a>
                        <a
                            href={imageUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                            title="Baixar imagem original"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Baixar</span>
                        </a>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Container da Imagem Centralizada */}
                <div className="flex-1 w-full flex items-center justify-center p-2 overflow-auto max-h-[75vh]">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800/80 bg-black/40"
                    />
                </div>

                {/* Rodape com instrucao de atalho */}
                <div className="w-full pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Clique fora ou no X para fechar</span>
                    <span className="font-mono text-emerald-400">Imagem em alta definição</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
