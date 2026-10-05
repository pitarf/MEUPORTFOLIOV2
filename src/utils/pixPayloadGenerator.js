/**
 * Utilitario oficial para geracao de payloads PIX EMV (BR Code) padrao Banco Central do Brasil.
 *
 * Utilizado como fallback automatico e modo resiliente para garantir que faturas
 * de manutencao sempre tenham um QR Code e codigo Copia e Cola 100% legiveis
 * por qualquer aplicativo bancario, mesmo se a API da gateway estiver offline.
 */

/**
 * Calcula o checksum CRC16 (polinomio 0x1021, valor inicial 0xFFFF) exigido pela especificacao EMV/BACEN.
 *
 * @param {string} payload String completa do payload ate o campo 6304
 * @returns {string} Checksum hexadecimal de 4 caracteres em maiusculo
 */
export const calculatePixCrc16 = (payload) => {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < payload.length; i++) {
        crc ^= (payload.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ polynomial) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, '0');
};

/**
 * Formata um campo TLV (Tag, Length, Value) do padrao EMVCo.
 *
 * @param {string} id Codigo de 2 digitos do campo
 * @param {string} value Conteudo do campo
 * @returns {string} String formatada no padrao TTLLVVV...
 */
const formatTlv = (id, value) => {
    const stringValue = String(value || '');
    const length = stringValue.length.toString().padStart(2, '0');
    return `${id}${length}${stringValue}`;
};

/**
 * Sanitiza o texto para caracteres compativeis com a norma EMV (remove acentos).
 *
 * @param {string} text Texto de entrada
 * @param {number} [maxLength=25] Tamanho maximo permitido
 * @returns {string} Texto sanitizado
 */
const sanitizeEmvText = (text, maxLength = 25) => {
    if (!text) return '';
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .trim()
        .substring(0, maxLength);
};

/**
 * Gera a string PIX Copia e Cola (BR Code) estatica e oficial.
 *
 * @param {Object} params Parametros do Pix
 * @param {string} params.pixKey Chave PIX (CPF, CNPJ, Telefone, E-mail ou Chave Aleatoria)
 * @param {number} [params.amount] Valor da fatura em Reais (opcional)
 * @param {string} [params.receiverName='Rafael Pita'] Nome do recebedor (max 25 caracteres)
 * @param {string} [params.receiverCity='Aracaju'] Cidade do recebedor (max 15 caracteres)
 * @param {string} [params.txid='***'] Identificador da transacao / Fatura (sem espacos)
 * @param {string} [params.description] Descricao adicional
 * @returns {string} Payload PIX completo pronto para Copia e Cola e geracao de QR Code
 */
export const generatePixPayload = ({
    pixKey,
    amount,
    receiverName = 'Rafael Pita Solutions',
    receiverCity = 'Aracaju',
    txid = '***',
    description
} = {}) => {
    if (!pixKey || pixKey.trim() === '') {
        throw new Error('A chave PIX e obrigatoria para a geracao do BR Code.');
    }

    const cleanPixKey = pixKey.trim();
    const cleanReceiverName = sanitizeEmvText(receiverName, 25) || 'RAFAEL PITA';
    const cleanReceiverCity = sanitizeEmvText(receiverCity, 15) || 'ARACAJU';
    const cleanTxid = (txid || '***').replace(/[^a-zA-Z0-9]/g, '').substring(0, 25) || '***';

    // 1. Payload Format Indicator (00)
    let payload = formatTlv('00', '01');

    // 2. Point of Initiation Method (01: 11 = Estatico / Multiplos pagamentos, 12 = Dinamico)
    payload += formatTlv('01', '12');

    // 3. Merchant Account Information (26: GUI br.gov.bcb.pix + Chave Pix + Descricao opcional)
    let merchantAccount = formatTlv('00', 'br.gov.bcb.pix');
    merchantAccount += formatTlv('01', cleanPixKey);
    if (description) {
        const cleanDesc = sanitizeEmvText(description, 40);
        if (cleanDesc) {
            merchantAccount += formatTlv('02', cleanDesc);
        }
    }
    payload += formatTlv('26', merchantAccount);

    // 4. Merchant Category Code (52: 0000 = Geral)
    payload += formatTlv('52', '0000');

    // 5. Transaction Currency (53: 986 = Real Brasileiro BRL)
    payload += formatTlv('53', '986');

    // 6. Transaction Amount (54: Valor com ponto decimal)
    if (amount !== undefined && amount !== null && Number(amount) > 0) {
        payload += formatTlv('54', Number(amount).toFixed(2));
    }

    // 7. Country Code (58: BR)
    payload += formatTlv('58', 'BR');

    // 8. Merchant Name (59: Nome do beneficiario)
    payload += formatTlv('59', cleanReceiverName);

    // 9. Merchant City (60: Cidade)
    payload += formatTlv('60', cleanReceiverCity);

    // 10. Additional Data Field Template (62: Campo TXID de referencia)
    const additionalData = formatTlv('05', cleanTxid);
    payload += formatTlv('62', additionalData);

    // 11. CRC16 (63: Tag 63, tamanho 04 e valor checksum)
    payload += '6304';
    const crc = calculatePixCrc16(payload);

    return `${payload}${crc}`;
};

/**
 * Gera a URL do servico de renderizacao de imagem do QR Code
 *
 * @param {string} payload Payload Copia e Cola
 * @param {number} [size=240] Tamanho da imagem em pixels
 * @returns {string} URL publica do QR Code
 */
export const getQrCodeImageUrl = (payload, size = 240) => {
    if (!payload) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payload)}`;
};
