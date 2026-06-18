import imageCompression from 'browser-image-compression';

/**
 * Comprime e converte uma imagem (File) para o formato WebP.
 * 
 * @param {File} file - O arquivo de imagem original.
 * @param {Object} customOptions - Opções de compressão adicionais.
 * @returns {Promise<File>} O arquivo comprimido em formato WebP.
 */
/**
 * Obtém as dimensões originais de um arquivo de imagem.
 * 
 * @param {File} file - O arquivo de imagem.
 * @returns {Promise<{width: number, height: number}|null>} As dimensões da imagem.
 */
function getImageDimensions(file) {
    return new Promise((resolve) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
        };
        img.src = objectUrl;
    });
}

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

    let maxWidthOrHeight = 1920;

    try {
        const dims = await getImageDimensions(file);
        if (dims) {
            const ratio = dims.height / dims.width;
            // Se for uma imagem muito vertical (ex: prints de páginas inteiras de sites),
            // aumentamos o limite de tamanho para preservar a largura original e a legibilidade.
            if (ratio > 1.5) {
                maxWidthOrHeight = Math.min(Math.max(dims.width, dims.height), 8192);
            }
        }
    } catch (e) {
        console.warn('[ImageOptimizer] Não foi possível calcular as dimensões originais da imagem:', e);
    }

    // Configurações padrão ideais para manter qualidade premium de fotografia e carregamento instantâneo
    const defaultOptions = {
        maxSizeMB: 1.2,              // Tamanho máximo de 1.2MB (muito menor que as fotos brutas de câmera)
        maxWidthOrHeight: maxWidthOrHeight, // Resolução adaptada
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

        console.log(`[ImageOptimizer] Imagem otimizada: de ${(file.size / 1024 / 1024).toFixed(2)}MB para ${(webpFile.size / 1024 / 1024).toFixed(2)}MB (maxDim: ${options.maxWidthOrHeight})`);
        return webpFile;
    } catch (error) {
        console.error('[ImageOptimizer] Erro ao otimizar imagem, retornando arquivo original:', error);
        return file; // Em caso de falha catastrófica, retorna o arquivo original sem quebrar o fluxo
    }
}
