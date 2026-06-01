/**
 * Compresses an image file using the browser's Canvas API.
 * @param {File} file - The image file to compress.
 * @param {number} maxWidth - Maximum width of the output image.
 * @param {number} quality - JPEG quality (0 to 1).
 * @returns {Promise<File>} - The compressed image file.
 */
export const compressImage = async (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Determine output format based on input file type to preserve transparency
                const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                // Note: quality parameter is ignored for image/png in standard implementations
                const outputQuality = file.type === 'image/png' ? undefined : quality;

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }
                        const compressedFile = new File([blob], file.name, {
                            type: outputType,
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    outputType,
                    outputQuality
                );
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
