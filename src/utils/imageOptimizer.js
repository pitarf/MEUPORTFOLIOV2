import imageCompression from 'browser-image-compression';

/**
 * Comprime e converte uma imagem (File) para o formato WebP.
 * 
 * @param {File} file - O arquivo de imagem original.
 * @param {Object} customOptions - Opções de compressão adicionais.
 * @returns {Promise<File>} O arquivo comprimido em formato WebP.
 */
export async function optimizeAndConvertToWebP(file, customOptions = {}) {
    // Se não for uma imagem, apenas retorna o arquivo original
    if (!file || !file.type.startsWith('image/')) {
        return file;
    }

    // Configurações padrão ideais para manter qualidade premium de fotografia e carregamento instantâneo
    const defaultOptions = {
        maxSizeMB: 1.2,              // Tamanho máximo de 1.2MB (muito menor que as fotos brutas de câmera)
        maxWidthOrHeight: 1920,      // Resolução máxima Full HD
        useWebWorker: true,
        fileType: 'image/webp',      // Conversão forçada para WebP
        initialQuality: 0.85         // Excelente balanço entre tamanho e nitidez para fotografia
    };

    const options = { ...defaultOptions, ...customOptions };

    try {
        const compressedBlob = await imageCompression(file, options);
        
        // Cria o novo arquivo com a extensão .webp
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
        
        const webpFile = new File([compressedBlob], newFileName, {
            type: 'image/webp',
            lastModified: Date.now()
        });

        console.log(`[ImageOptimizer] Imagem otimizada: de ${(file.size / 1024 / 1024).toFixed(2)}MB para ${(webpFile.size / 1024 / 1024).toFixed(2)}MB`);
        return webpFile;
    } catch (error) {
        console.error('[ImageOptimizer] Erro ao otimizar imagem, retornando arquivo original:', error);
        return file; // Em caso de falha catastrófica, retorna o arquivo original sem quebrar o fluxo
    }
}
