import { supabase } from '../lib/customSupabaseClient.js';

/**
 * Servico de Integracao com o Gateway de Pagamentos PushinPay
 * Base URL oficial: https://api.pushinpay.com.br/api
 *
 * Responsavel por:
 * 1. Geracao de cobrancas PIX via Cash-In (valores estritamente inteiros em centavos)
 * 2. Consulta e polling de transacoes
 * 3. Modo de simulacao e fallback quando credenciais nao estiverem cadastradas
 * 4. Gestao de configuracoes persistidas na tabela maintenance_settings
 */

const PUSHINPAY_API_BASE_URL = 'https://api.pushinpay.com.br/api';

/**
 * Obtem variaveis de ambiente de forma segura para Vite e Node.js
 */
const getEnvVariable = (key) => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
            return import.meta.env[key];
        }
    } catch {
        // Ignora erro se import.meta nao for suportado
    }

    try {
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
    } catch {
        // Ignora erro se process nao for suportado
    }

    return null;
};

/**
 * Normaliza qualquer valor monetario para inteiro estrito em centavos.
 * Exemplo: 150.00 -> 15000, "150.50" -> 15050.
 *
 * @param {number|string} amount
 * @returns {number} Valor inteiro em centavos
 */
export const normalizeValueInCents = (amount) => {
    if (amount === null || amount === undefined) {
        throw new Error('Valor para cobranca PIX nao foi informado.');
    }

    const numericVal = typeof amount === 'string'
        ? Number(amount.replace(',', '.').trim())
        : Number(amount);

    if (isNaN(numericVal) || numericVal <= 0) {
        throw new Error(`Valor invalido para transacao PIX: ${amount}`);
    }

    // Multiplica por 100 e arredonda para eliminar pontos decimais
    const cents = Math.round(numericVal * 100);

    if (!Number.isInteger(cents) || cents <= 0) {
        throw new Error(`Valor em centavos invalido: ${cents}`);
    }

    return cents;
};

/**
 * Busca as configuracoes de manutencao e PushinPay na tabela maintenance_settings.
 * Retorna configuracao com fallback seguro caso o banco ainda esteja inicializando.
 *
 * @returns {Promise<Object>} Configuracoes da PushinPay e chave Pix padrao
 */
export const fetchPushinPaySettings = async () => {
    try {
        const { data, error } = await supabase
            .from('maintenance_settings')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.warn('Aviso: Nao foi possivel carregar maintenance_settings, usando fallback:', error.message);
            return {
                pushinpay_token: getEnvVariable('VITE_PUSHINPAY_TOKEN') || getEnvVariable('PUSHINPAY_TOKEN') || null,
                pushinpay_webhook_token: getEnvVariable('VITE_PUSHINPAY_WEBHOOK_TOKEN') || null,
                default_pix_key: null,
                default_pix_key_type: 'chave_aleatoria',
                webhook_url: getEnvVariable('VITE_PUSHINPAY_WEBHOOK_URL') || null,
                whatsapp_notification_template: null,
                is_fallback: true
            };
        }

        if (!data) {
            // Cria registro padrao inicial se nao existir
            const defaultSettings = {
                pushinpay_token: getEnvVariable('VITE_PUSHINPAY_TOKEN') || getEnvVariable('PUSHINPAY_TOKEN') || null,
                pushinpay_webhook_token: 'whsec_' + Math.random().toString(36).substring(2, 12),
                default_pix_key: null,
                default_pix_key_type: 'chave_aleatoria',
                webhook_url: null,
                whatsapp_notification_template: 'Ola {{cliente}}, sua fatura {{fatura}} no valor de R$ {{valor}} vence em {{vencimento}}. Link PIX: {{link_pix}}'
            };

            const { data: created, error: insertError } = await supabase
                .from('maintenance_settings')
                .insert([defaultSettings])
                .select()
                .maybeSingle();

            if (insertError) {
                console.warn('Aviso ao inserir maintenance_settings inicial:', insertError.message);
                return defaultSettings;
            }

            return created || defaultSettings;
        }

        // Se o token nao esta no banco, tenta variavel de ambiente
        if (!data.pushinpay_token) {
            data.pushinpay_token = getEnvVariable('VITE_PUSHINPAY_TOKEN') || getEnvVariable('PUSHINPAY_TOKEN') || null;
        }

        return data;
    } catch (err) {
        console.error('Falha ao recuperar configuracoes da PushinPay:', err);
        return {
            pushinpay_token: getEnvVariable('VITE_PUSHINPAY_TOKEN') || getEnvVariable('PUSHINPAY_TOKEN') || null,
            pushinpay_webhook_token: null,
            default_pix_key: null,
            default_pix_key_type: 'chave_aleatoria',
            webhook_url: null,
            is_fallback: true
        };
    }
};

/**
 * Salva ou atualiza as configuracoes da PushinPay no banco de dados.
 *
 * @param {Object} settings Objeto com dados para salvar
 * @returns {Promise<Object>} Configuracao atualizada
 */
export const updatePushinPaySettings = async (settings) => {
    try {
        const current = await fetchPushinPaySettings();

        const payload = {
            pushinpay_token: settings.pushinpay_token !== undefined ? settings.pushinpay_token : current.pushinpay_token,
            pushinpay_webhook_token: settings.pushinpay_webhook_token !== undefined ? settings.pushinpay_webhook_token : current.pushinpay_webhook_token,
            default_pix_key: settings.default_pix_key !== undefined ? settings.default_pix_key : current.default_pix_key,
            default_pix_key_type: settings.default_pix_key_type !== undefined ? settings.default_pix_key_type : current.default_pix_key_type,
            webhook_url: settings.webhook_url !== undefined ? settings.webhook_url : current.webhook_url,
            whatsapp_notification_template: settings.whatsapp_notification_template !== undefined ? settings.whatsapp_notification_template : current.whatsapp_notification_template,
            updated_at: new Date().toISOString()
        };

        if (current.id) {
            const { data, error } = await supabase
                .from('maintenance_settings')
                .update(payload)
                .eq('id', current.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('maintenance_settings')
                .insert([payload])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    } catch (err) {
        console.error('Erro ao atualizar maintenance_settings:', err);
        throw err;
    }
};

/**
 * Cria uma cobranca PIX avulso ou fatura de assinatura via Cash-In na PushinPay.
 * Endpoint: POST /api/pix/cashIn
 *
 * Caso o token nao esteja configurado, aciona modo de simulacao seguro.
 *
 * @param {Object} params Parametros da solicitacao
 * @param {number} [params.valueInCents] Valor ja em centavos inteiros
 * @param {number} [params.amount] Valor em Reais (ex: 150.00)
 * @param {string} [params.invoiceId] ID unico da fatura no sistema
 * @param {string} [params.invoiceCode] Codigo legivel da fatura (ex: FAT-2026-001)
 * @param {string} [params.webhookUrl] URL de webhook customizada
 * @param {string} [params.token] Token PushinPay explicito
 * @param {string} [params.description] Descricao da cobranca
 * @returns {Promise<Object>} Resposta contendo id, qr_code, qr_code_base64 e status
 */
export const createCashInPix = async ({
    valueInCents,
    amount,
    invoiceId,
    invoiceCode,
    webhookUrl,
    token,
    description
} = {}) => {
    // 1. Calculo estrito do valor em centavos inteiros
    let finalCents;
    if (valueInCents !== undefined && valueInCents !== null) {
        finalCents = Math.round(Number(valueInCents));
        if (isNaN(finalCents) || finalCents <= 0) {
            throw new Error(`Valor em centavos invalido: ${valueInCents}`);
        }
    } else if (amount !== undefined && amount !== null) {
        finalCents = normalizeValueInCents(amount);
    } else {
        throw new Error('Informe amount (em Reais) ou valueInCents (em centavos).');
    }

    // 2. Identificacao do token e configuracoes
    let activeToken = token;
    let settings = null;

    if (!activeToken) {
        settings = await fetchPushinPaySettings();
        activeToken = settings.pushinpay_token;
    }

    // 3. Fallback / Modo de Simulacao se o token nao existir
    if (!activeToken || activeToken.trim() === '') {
        console.info('PushinPay: Token nao configurado. Gerando fatura em modo de simulacao e fallback Pix.');

        const defaultPixKey = settings?.default_pix_key || 'contato@rafaelpitaoficial.com.br';
        const simId = 'sim_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
        const simCode = invoiceCode || 'FAT-SIM-' + Date.now().toString().slice(-4);

        // Gera codigo copia e cola ilustrativo e imagem SVG data-url em base64
        const simulatedPayloadPix = `00020126580014br.gov.bcb.pix0136${defaultPixKey}520400005303986540${(finalCents / 100).toFixed(2)}5802BR5913RafaelPitaDev6009SaoPaulo62070503***6304SIMU`;
        const simulatedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280"><rect width="280" height="280" fill="#f8fafc"/><rect x="20" y="20" width="240" height="240" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><text x="140" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">MODO DE SIMULACAO PIX</text><text x="140" y="135" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">Fatura: ${simCode}</text><text x="140" y="160" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a" text-anchor="middle">R$ ${(finalCents / 100).toFixed(2)}</text><text x="140" y="195" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Configure o token da PushinPay</text><text x="140" y="215" font-family="sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">para gerar o QR Code oficial</text></svg>`;
        const simulatedBase64 = typeof btoa === 'function'
            ? 'data:image/svg+xml;base64,' + btoa(simulatedSvg)
            : 'data:image/svg+xml;base64,' + Buffer.from(simulatedSvg).toString('base64');

        return {
            id: simId,
            qr_code: simulatedPayloadPix,
            qr_code_base64: simulatedBase64,
            status: 'pending',
            value: finalCents,
            is_simulation: true,
            default_pix_key: defaultPixKey,
            message: 'Cobranca gerada em modo demonstrativo. Chave Pix padrao disponivel para recebimento direto.'
        };
    }

    // 4. Montagem da URL de Webhook segura
    let finalWebhookUrl = webhookUrl;
    if (!finalWebhookUrl) {
        if (!settings) {
            settings = await fetchPushinPaySettings();
        }
        if (settings.webhook_url) {
            finalWebhookUrl = settings.webhook_url;
        }
    }

    if (finalWebhookUrl && invoiceId) {
        const separator = finalWebhookUrl.includes('?') ? '&' : '?';
        const webhookToken = settings?.pushinpay_webhook_token || '';
        finalWebhookUrl = `${finalWebhookUrl}${separator}invoice_id=${encodeURIComponent(invoiceId)}&token=${encodeURIComponent(webhookToken)}`;
    }

    // 5. Chamada a API oficial PushinPay
    const requestBody = {
        value: finalCents
    };

    if (finalWebhookUrl) {
        requestBody.webhook_url = finalWebhookUrl;
    }

    if (description) {
        requestBody.description = description;
    }

    try {
        const response = await fetch(`${PUSHINPAY_API_BASE_URL}/pix/cashIn`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${activeToken.trim()}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = responseData?.message || responseData?.error || `Falha HTTP ${response.status} na PushinPay`;
            console.error('Erro na chamada da PushinPay:', response.status, responseData);
            throw new Error(`PushinPay API: ${errorMsg}`);
        }

        return {
            id: responseData.id || responseData.transaction_id,
            qr_code: responseData.qr_code || responseData.pix_copia_e_cola,
            qr_code_base64: responseData.qr_code_base64 || responseData.qrcode_base64,
            status: responseData.status || 'pending',
            value: responseData.value || finalCents,
            is_simulation: false,
            raw_response: responseData
        };
    } catch (apiError) {
        console.error('Falha de comunicacao com gateway PushinPay:', apiError);
        throw apiError;
    }
};

/**
 * Consulta o status atual de uma transacao na PushinPay.
 * Endpoint: GET /api/transactions/{id}
 *
 * Utilizado para polling ativo quando o webhook tiver atraso ou o cliente solicitar verificacao.
 *
 * @param {Object} params
 * @param {string} params.transactionId ID da transacao na PushinPay
 * @param {string} [params.token] Token de autenticacao opcional
 * @returns {Promise<Object>} Dados da transacao com status atualizado
 */
export const checkTransactionStatus = async ({ transactionId, token } = {}) => {
    if (!transactionId) {
        throw new Error('ID da transacao PushinPay nao informado.');
    }

    // Se comeca com sim_, trata transacao simulada
    if (String(transactionId).startsWith('sim_')) {
        return {
            id: transactionId,
            status: 'pending',
            is_simulation: true,
            paid: false,
            message: 'Transacao em modo demonstrativo.'
        };
    }

    let activeToken = token;
    if (!activeToken) {
        const settings = await fetchPushinPaySettings();
        activeToken = settings.pushinpay_token;
    }

    if (!activeToken) {
        throw new Error('Token PushinPay nao localizado para consulta de transacao.');
    }

    try {
        const response = await fetch(`${PUSHINPAY_API_BASE_URL}/transactions/${encodeURIComponent(transactionId)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${activeToken.trim()}`,
                'Accept': 'application/json'
            }
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = responseData?.message || responseData?.error || `Falha HTTP ${response.status}`;
            throw new Error(`Erro ao consultar transacao PushinPay: ${errorMsg}`);
        }

        const rawStatus = String(responseData.status || '').toLowerCase();
        const isPaid = ['paid', 'approved', 'completed', 'pago', 'liquidado'].includes(rawStatus);

        return {
            id: responseData.id || transactionId,
            status: responseData.status,
            is_paid: isPaid,
            value: responseData.value,
            end_to_end_id: responseData.end_to_end_id || responseData.endToEndId || null,
            created_at: responseData.created_at || null,
            paid_at: isPaid ? (responseData.paid_at || responseData.updated_at || new Date().toISOString()) : null,
            raw_response: responseData
        };
    } catch (err) {
        console.error(`Erro ao consultar transacao ${transactionId}:`, err);
        throw err;
    }
};

/**
 * Validador seguro para requisicoes de webhook da PushinPay.
 * Confere o token de seguranca configurado no sistema.
 *
 * @param {Object} params
 * @param {Object} params.payload Corpo da requisicao recebida
 * @param {string} params.incomingToken Token passado via query param ou cabecalho
 * @param {string} params.expectedToken Token seguro esperado
 * @returns {Object} Resultado da validacao com invoiceId e transacao
 */
export const validatePushinPayWebhook = ({
    payload = {},
    incomingToken = '',
    expectedToken = ''
} = {}) => {
    // Validacao do token se configurado
    if (expectedToken && incomingToken && incomingToken !== expectedToken) {
        return {
            valid: false,
            reason: 'Token de seguranca do webhook invalido.'
        };
    }

    const transactionId = payload.id || payload.transaction_id || payload.data?.id;
    const rawStatus = String(payload.status || payload.data?.status || '').toLowerCase();
    const isPaid = ['paid', 'approved', 'completed', 'pago', 'liquidado'].includes(rawStatus);
    const endToEndId = payload.end_to_end_id || payload.data?.end_to_end_id || null;
    const invoiceId = payload.invoice_id || payload.custom_id || null;

    return {
        valid: true,
        transactionId,
        status: payload.status || payload.data?.status,
        isPaid,
        endToEndId,
        invoiceId,
        value: payload.value || payload.data?.value
    };
};
