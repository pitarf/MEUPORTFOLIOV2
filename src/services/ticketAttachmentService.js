import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseClient';
import { optimizeAndConvertToWebP } from '@/utils/imageOptimizer';

/**
 * Servico de Upload e Gerenciamento de Anexos e Prints de Chamados
 * Permite anexar capturas de tela e documentos aos chamados de suporte e notas.
 */

/**
 * Realiza o upload de uma imagem ou print para o Firebase Storage
 * @param {File|Blob} file Arquivo de imagem ou print
 * @param {string} ticketFolder Identificador do chamado (codigo ou ID)
 * @returns {Promise<Object>} Dados do anexo com URL publica
 */
export async function uploadTicketAttachment(file, ticketFolder = 'geral') {
    if (!file) throw new Error('Nenhum arquivo fornecido para upload.');

    try {
        let uploadPayload = file;
        let fileExtension = 'png';
        const originalName = file.name || `print_${Date.now()}.png`;

        // Se for imagem, otimiza e converte para WebP
        if (file.type && file.type.startsWith('image/')) {
            try {
                uploadPayload = await optimizeAndConvertToWebP(file, {
                    maxWidthOrHeight: 2048,
                    quality: 0.88
                });
                fileExtension = 'webp';
            } catch (optErr) {
                console.warn('Fallback: usando arquivo original sem conversao WebP:', optErr);
                uploadPayload = file;
            }
        }

        const cleanFolder = String(ticketFolder).replace(/[^a-zA-Z0-9_-]/g, '_');
        const timestamp = Date.now();
        const randomHash = Math.random().toString(36).substring(2, 7);
        const fileName = `${timestamp}_${randomHash}.${fileExtension}`;
        const storagePath = `tickets-attachments/${cleanFolder}/${fileName}`;

        const storageRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(storageRef, uploadPayload);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        return {
            id: `att_${timestamp}_${randomHash}`,
            name: originalName,
            url: downloadUrl,
            size: uploadPayload.size || file.size || 0,
            type: uploadPayload.type || file.type || 'image/webp',
            created_at: new Date().toISOString()
        };
    } catch (error) {
        console.error('Falha no upload do anexo do chamado:', error);
        throw new Error(`Falha no upload do print: ${error.message}`);
    }
}

/**
 * Extrai arquivo de imagem colado via teclado (Ctrl+V) no clipboard
 * @param {ClipboardEvent} event Evento de paste
 * @returns {File|null}
 */
export function extractImageFromClipboard(event) {
    if (!event || !event.clipboardData || !event.clipboardData.items) {
        return null;
    }

    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type && item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            if (blob) {
                const extension = item.type.split('/')[1] || 'png';
                const fileName = `print_${Date.now()}.${extension}`;
                return new File([blob], fileName, { type: item.type });
            }
        }
    }
    return null;
}
