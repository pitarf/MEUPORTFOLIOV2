import { supabase } from '../lib/customSupabaseClient.js';

/**
 * Servico de Integracao Oficial com a API v3 do Gateway de Pagamentos Asaas
 * Suporte a ambientes Sandbox (Homologacao) e Producao
 *
 * Responsavel por:
 * 1. Gestao de Clientes (consulta, criacao inteligente findOrCreate)
 * 2. Cobrancas Avulsas via PIX, Boleto e Cartao
 * 3. Obtencao de QR Code PIX (Copia e Cola e Base64)
 * 4. Assinaturas Recorrentes (criacao, listagem de pagamentos e cancelamento)
 * 5. Links de Pagamento para checkout rapido
 * 6. Gestao de Webhooks para atualizacao automatica de faturas
 * 7. Consulta de Saldo e metricas financeiras da conta
 * 8. Fallback amigavel em modo simulacao para desenvolvimento sem credencial
 */

const ASAAS_SANDBOX_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_PRODUCTION_URL = 'https://api.asaas.com/v3';

/**
 * Le variaveis de ambiente com protecao para Vite e Node.js
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
 * Limpa pontuacoes de CPF ou CNPJ mantendo apenas digitos numericos.
 *
 * @param {string} doc
 * @returns {string} Digitos limpos
 */
export const cleanDocument = (doc) => {
    if (!doc) return '';
    return String(doc).replace(/\D/g, '');
};

/**
 * Limpa pontuacoes de telefone mantendo apenas digitos com DDD.
 *
 * @param {string} phone
 * @returns {string} Digitos limpos
 */
export const cleanPhone = (phone) => {
    if (!phone) return '';
    return String(phone).replace(/\D/g, '');
};

/**
 * Normaliza valor monetario para formato numerico com duas casas decimais compativel com Asaas.
 * Exemplo: "150,50" -> 150.50, 150 -> 150.00
 *
 * @param {number|string} amount
 * @returns {number} Valor float positivo
 */
export const normalizeAsaasValue = (amount) => {
    if (amount === null || amount === undefined) {
        throw new Error('Valor para cobranca Asaas nao foi informado.');
    }

    const numericVal = typeof amount === 'string'
        ? Number(amount.replace(/\./g, '').replace(',', '.').trim())
        : Number(amount);

    if (isNaN(numericVal) || numericVal <= 0) {
        throw new Error(`Valor invalido para transacao Asaas: ${amount}`);
    }

    return Math.round(numericVal * 100) / 100;
};

/**
 * Converte ciclos em portugues para a constante da API Asaas.
 *
 * @param {string} cycle Ciclo em portugues ('mensal', 'trimestral', 'semestral', 'anual')
 * @returns {string} Ciclo Asaas ('MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY')
 */
export const mapCycleToAsaas = (cycle) => {
    const normalized = String(cycle || '').toLowerCase().trim();
    const map = {
        'mensal': 'MONTHLY',
        'monthly': 'MONTHLY',
        'trimestral': 'QUARTERLY',
        'quarterly': 'QUARTERLY',
        'semestral': 'SEMIANNUALLY',
        'semiannually': 'SEMIANNUALLY',
        'anual': 'YEARLY',
        'yearly': 'YEARLY'
    };
    return map[normalized] || 'MONTHLY';
};

/**
 * Busca as configuracoes do Asaas na tabela maintenance_settings do Supabase.
 * Retorna configuracao com fallback seguro caso o banco ainda esteja inicializando.
 *
 * @returns {Promise<Object>} Configuracoes do Asaas e gateway ativo
 */
export const fetchAsaasSettings = async () => {
    try {
        const { data, error } = await supabase
            .from('maintenance_settings')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.warn('Aviso: Nao foi possivel carregar maintenance_settings, usando variaveis de ambiente:', error.message);
            return {
                asaas_token: getEnvVariable('VITE_ASAAS_TOKEN') || getEnvVariable('ASAAS_API_KEY') || null,
                asaas_environment: getEnvVariable('VITE_ASAAS_ENVIRONMENT') || 'sandbox',
                active_gateway: 'pushinpay',
                is_fallback: true
            };
        }

        if (!data) {
            return {
                asaas_token: getEnvVariable('VITE_ASAAS_TOKEN') || getEnvVariable('ASAAS_API_KEY') || null,
                asaas_environment: getEnvVariable('VITE_ASAAS_ENVIRONMENT') || 'sandbox',
                active_gateway: 'pushinpay',
                is_fallback: false
            };
        }

        return {
            id: data.id,
            asaas_token: data.asaas_token || getEnvVariable('VITE_ASAAS_TOKEN') || getEnvVariable('ASAAS_API_KEY') || null,
            asaas_environment: data.asaas_environment || getEnvVariable('VITE_ASAAS_ENVIRONMENT') || 'sandbox',
            active_gateway: data.active_gateway || 'pushinpay',
            pushinpay_token: data.pushinpay_token,
            webhook_url: data.webhook_url,
            is_fallback: false
        };
    } catch (err) {
        console.error('Falha ao consultar credenciais do Asaas:', err);
        return {
            asaas_token: getEnvVariable('VITE_ASAAS_TOKEN') || null,
            asaas_environment: 'sandbox',
            active_gateway: 'pushinpay',
            is_fallback: true
        };
    }
};

/**
 * Salva ou atualiza as configuracoes do Asaas na tabela maintenance_settings.
 *
 * @param {Object} newSettings
 * @param {string} [newSettings.asaas_token]
 * @param {string} [newSettings.asaas_environment] 'sandbox' ou 'production'
 * @param {string} [newSettings.active_gateway] 'pushinpay' ou 'asaas'
 * @returns {Promise<Object>} Registro atualizado
 */
export const updateAsaasSettings = async (newSettings) => {
    const { asaas_token, asaas_environment, active_gateway } = newSettings;

    const payload = {};
    if (asaas_token !== undefined) payload.asaas_token = asaas_token ? asaas_token.trim() : null;
    if (asaas_environment !== undefined) payload.asaas_environment = asaas_environment;
    if (active_gateway !== undefined) payload.active_gateway = active_gateway;

    // Busca registro existente
    const { data: existing } = await supabase
        .from('maintenance_settings')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (existing?.id) {
        const { data, error } = await supabase
            .from('maintenance_settings')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single();

        if (error) {
            throw new Error(`Falha ao atualizar configuracoes do Asaas: ${error.message}`);
        }
        return data;
    } else {
        const { data, error } = await supabase
            .from('maintenance_settings')
            .insert([{
                ...payload,
                asaas_environment: payload.asaas_environment || 'sandbox',
                active_gateway: payload.active_gateway || 'pushinpay'
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Falha ao inserir configuracoes do Asaas: ${error.message}`);
        }
        return data;
    }
};

/**
 * Resolve URL base da API Asaas de acordo com o ambiente configurado.
 *
 * @param {string} [environment] 'sandbox' ou 'production'
 * @returns {string} URL base da API v3
 */
export const getAsaasBaseUrl = (environment = 'sandbox') => {
    const env = String(environment || '').toLowerCase().trim();
    return env === 'production' || env === 'prod' ? ASAAS_PRODUCTION_URL : ASAAS_SANDBOX_URL;
};

/**
 * Simulador de resposta para chamadas Asaas quando em ambiente local sem chave real.
 * Garante que a aplicacao continue estavel para testes sem interrupcoes.
 *
 * @param {string} path Endpoint da requisicao
 * @param {string} method Metodo HTTP
 * @param {Object} [body] Payload enviado
 * @returns {Object} Resposta mockada estruturada
 */
const simulateAsaasResponse = (path, method, body = {}) => {
    const timestamp = Date.now();
    const fakeId = `sim_${timestamp.toString(36)}`;

    // Criacao ou busca de cliente
    if (path.startsWith('/customers')) {
        if (method === 'GET' && path.includes('?')) {
            return {
                object: 'list',
                hasMore: false,
                totalCount: 0,
                limit: 10,
                offset: 0,
                data: []
            };
        }
        return {
            object: 'customer',
            id: `cus_${fakeId}`,
            dateCreated: new Date().toISOString().split('T')[0],
            name: body?.name || 'Cliente Simulado Asaas',
            email: body?.email || 'cliente.simulado@exemplo.com',
            phone: body?.phone || '',
            mobilePhone: body?.mobilePhone || '11999998888',
            cpfCnpj: body?.cpfCnpj || '00000000000',
            notificationDisabled: false,
            city: 0,
            state: 'SP',
            country: 'Brasil'
        };
    }

    // Geracao de QR Code PIX
    if (path.includes('/pixQrCode')) {
        return {
            encodedImage: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            payload: `00020126580014br.gov.bcb.pix0136simulado-asaas-${fakeId}5204000053039865405150.005802BR5925RAFAEL PITA TECNOLOGIA6009SAO PAULO62070503***6304ABCD`,
            expirationDate: new Date(Date.now() + 86400000).toISOString()
        };
    }

    // Criacao ou consulta de cobranca
    if (path.startsWith('/payments')) {
        return {
            object: 'payment',
            id: `pay_${fakeId}`,
            dateCreated: new Date().toISOString().split('T')[0],
            customer: body?.customer || `cus_${fakeId}`,
            paymentLink: null,
            value: body?.value || 150.00,
            netValue: body?.value ? (body.value * 0.98) : 147.00,
            originalValue: null,
            interestValue: null,
            description: body?.description || 'Cobranca de Manutencao Tecnologica (Simulado)',
            billingType: body?.billingType || 'PIX',
            status: 'PENDING',
            dueDate: body?.dueDate || new Date().toISOString().split('T')[0],
            originalDueDate: body?.dueDate || new Date().toISOString().split('T')[0],
            paymentDate: null,
            clientPaymentDate: null,
            invoiceUrl: `https://sandbox.asaas.com/i/${fakeId}`,
            bankSlipUrl: null,
            transactionReceiptUrl: null,
            invoiceNumber: fakeId.toUpperCase(),
            deleted: false
        };
    }

    // Assinaturas Recorrentes
    if (path.startsWith('/subscriptions')) {
        return {
            object: 'subscription',
            id: `sub_${fakeId}`,
            dateCreated: new Date().toISOString().split('T')[0],
            customer: body?.customer || `cus_${fakeId}`,
            paymentLink: null,
            value: body?.value || 150.00,
            nextDueDate: body?.nextDueDate || new Date().toISOString().split('T')[0],
            cycle: body?.cycle || 'MONTHLY',
            description: body?.description || 'Assinatura Recorrente Simulado',
            billingType: body?.billingType || 'PIX',
            status: 'ACTIVE',
            deleted: false
        };
    }

    // Links de Pagamento
    if (path.startsWith('/paymentLinks')) {
        return {
            object: 'paymentLink',
            id: `link_${fakeId}`,
            name: body?.name || 'Link de Pagamento Simulado',
            value: body?.value || 150.00,
            active: true,
            billingType: body?.billingType || 'UNDEFINED',
            chargeType: body?.chargeType || 'DETACHED',
            url: `https://sandbox.asaas.com/c/${fakeId}`
        };
    }

    // Saldo financeiro
    if (path.startsWith('/finance/balance')) {
        return {
            balance: 1540.50
        };
    }

    // Resposta padrao generica
    return {
        id: `sim_${fakeId}`,
        success: true,
        simulated: true,
        timestamp: new Date().toISOString()
    };
};

/**
 * Cliente HTTP unificado para chamadas a API do Asaas v3.
 * Executa autenticacao automatica via header access_token.
 *
 * @param {string} endpoint Caminho do endpoint (ex: '/customers', '/payments')
 * @param {Object} [options] Opcoes da requisicao
 * @param {string} [options.method='GET'] Metodo HTTP
 * @param {Object} [options.body] Payload para JSON.stringify
 * @param {string} [options.token] Token opcional (se nao informado, le das configuracoes)
 * @param {string} [options.environment] Ambiente opcional ('sandbox' ou 'production')
 * @returns {Promise<Object>} Resposta em JSON da API Asaas
 */
export const asaasRequest = async (endpoint, options = {}) => {
    const {
        method = 'GET',
        body = null,
        token = null,
        environment = null
    } = options;

    // Busca credenciais dinamicamente se nao forem passadas diretamente
    let activeToken = token;
    let activeEnv = environment;

    if (!activeToken) {
        const settings = await fetchAsaasSettings();
        activeToken = settings.asaas_token;
        activeEnv = activeEnv || settings.asaas_environment || 'sandbox';
    }

    // Se nao possui token cadastrado, ativa modo de simulacao seguro
    if (!activeToken) {
        console.warn(`[Asaas Service] Token de acesso nao configurado. Executando em modo simulacao para: ${method} ${endpoint}`);
        return simulateAsaasResponse(endpoint, method, body);
    }

    const baseUrl = getAsaasBaseUrl(activeEnv);
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const headers = {
        'access_token': activeToken,
        'Content-Type': 'application/json',
        'User-Agent': 'MeuPortfolio-Asaas-Client/1.0'
    };

    const fetchConfig = {
        method,
        headers
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        fetchConfig.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, fetchConfig);
        const responseData = await response.json().catch(() => null);

        if (!response.ok) {
            let errorMessage = `Erro Asaas (${response.status}): `;
            if (responseData && responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                errorMessage += responseData.errors.map(e => e.description || e.code).join('; ');
            } else if (responseData && responseData.message) {
                errorMessage += responseData.message;
            } else {
                errorMessage += response.statusText || 'Falha na comunicacao com o gateway.';
            }

            console.error('[Asaas Service] Resposta de erro da API:', {
                status: response.status,
                endpoint: cleanEndpoint,
                data: responseData
            });

            throw new Error(errorMessage);
        }

        return responseData;
    } catch (err) {
        console.error(`[Asaas Service] Falha na requisicao ${method} ${url}:`, err.message);
        throw err;
    }
};

// ============================================================================
// 1. MODULO DE CLIENTES (CUSTOMERS - /v3/customers)
// ============================================================================

/**
 * Cria um novo cliente no Asaas.
 *
 * @param {Object} customerData
 * @param {string} customerData.name Nome completo ou Razao Social
 * @param {string} customerData.cpfCnpj CPF ou CNPJ (limpo ou formatado)
 * @param {string} [customerData.email] E-mail do cliente
 * @param {string} [customerData.phone] Telefone fixo com DDD
 * @param {string} [customerData.mobilePhone] Celular / WhatsApp com DDD
 * @param {string} [customerData.postalCode] CEP
 * @param {string} [customerData.address] Logradouro
 * @param {string} [customerData.addressNumber] Numero
 * @param {string} [customerData.complement] Complemento
 * @param {string} [customerData.province] Bairro
 * @param {string} [customerData.externalReference] Identificador interno no portfolio
 * @param {boolean} [customerData.notificationDisabled=false] Se desabilita notificacoes nativas do Asaas
 * @returns {Promise<Object>} Cliente criado no Asaas
 */
export const createCustomer = async (customerData) => {
    if (!customerData?.name) {
        throw new Error('Nome do cliente e obrigatorio para cadastro no Asaas.');
    }

    const payload = {
        name: customerData.name.trim(),
        cpfCnpj: cleanDocument(customerData.cpfCnpj),
        email: customerData.email ? customerData.email.trim().toLowerCase() : undefined,
        phone: cleanPhone(customerData.phone) || undefined,
        mobilePhone: cleanPhone(customerData.mobilePhone) || undefined,
        postalCode: cleanDocument(customerData.postalCode) || undefined,
        address: customerData.address || undefined,
        addressNumber: customerData.addressNumber || undefined,
        complement: customerData.complement || undefined,
        province: customerData.province || undefined,
        externalReference: customerData.externalReference || undefined,
        notificationDisabled: Boolean(customerData.notificationDisabled)
    };

    return await asaasRequest('/customers', {
        method: 'POST',
        body: payload
    });
};

/**
 * Busca clientes no Asaas filtrando por CPF/CNPJ.
 *
 * @param {string} cpfCnpj
 * @returns {Promise<Object|null>} Primeiro cliente encontrado ou null
 */
export const findCustomerByCpfCnpj = async (cpfCnpj) => {
    const cleanDoc = cleanDocument(cpfCnpj);
    if (!cleanDoc) return null;

    try {
        const response = await asaasRequest(`/customers?cpfCnpj=${cleanDoc}`);
        if (response?.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (err) {
        console.warn('[Asaas Service] Erro ao buscar cliente por CPF/CNPJ:', err.message);
        return null;
    }
};

/**
 * Busca clientes no Asaas filtrando por e-mail.
 *
 * @param {string} email
 * @returns {Promise<Object|null>} Primeiro cliente encontrado ou null
 */
export const findCustomerByEmail = async (email) => {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();

    try {
        const response = await asaasRequest(`/customers?email=${encodeURIComponent(cleanEmail)}`);
        if (response?.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    } catch (err) {
        console.warn('[Asaas Service] Erro ao buscar cliente por e-mail:', err.message);
        return null;
    }
};

/**
 * Localiza cliente existente por CPF/CNPJ ou e-mail, ou cadastra automaticamente se nao existir.
 * Evita duplicidade de cadastros no Asaas.
 *
 * @param {Object} customerData Dados completos do cliente
 * @returns {Promise<Object>} Cliente existente ou recem criado
 */
export const findOrCreateCustomer = async (customerData) => {
    // 1. Tenta buscar por CPF/CNPJ se fornecido
    if (customerData?.cpfCnpj) {
        const existingByDoc = await findCustomerByCpfCnpj(customerData.cpfCnpj);
        if (existingByDoc?.id) return existingByDoc;
    }

    // 2. Tenta buscar por e-mail se fornecido
    if (customerData?.email) {
        const existingByEmail = await findCustomerByEmail(customerData.email);
        if (existingByEmail?.id) return existingByEmail;
    }

    // 3. Nao encontrado: cria novo cliente no Asaas
    return await createCustomer(customerData);
};

/**
 * Obtem detalhes completos de um cliente por ID no Asaas.
 *
 * @param {string} customerId Ex: 'cus_000005...'
 * @returns {Promise<Object>} Dados do cliente
 */
export const getCustomerById = async (customerId) => {
    if (!customerId) throw new Error('ID do cliente Asaas nao fornecido.');
    return await asaasRequest(`/customers/${customerId}`);
};

/**
 * Lista clientes cadastrados com paginacao e filtros.
 *
 * @param {Object} [params]
 * @param {number} [params.offset=0]
 * @param {number} [params.limit=20]
 * @param {string} [params.name]
 * @param {string} [params.email]
 * @param {string} [params.cpfCnpj]
 * @returns {Promise<Object>} Lista de clientes
 */
export const listCustomers = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.offset !== undefined) query.append('offset', String(params.offset));
    if (params.limit !== undefined) query.append('limit', String(params.limit));
    if (params.name) query.append('name', params.name);
    if (params.email) query.append('email', params.email);
    if (params.cpfCnpj) query.append('cpfCnpj', cleanDocument(params.cpfCnpj));

    const queryString = query.toString();
    const endpoint = queryString ? `/customers?${queryString}` : '/customers';
    return await asaasRequest(endpoint);
};

/**
 * Atualiza os dados de um cliente existente.
 *
 * @param {string} customerId ID do cliente
 * @param {Object} customerData Campos a atualizar
 * @returns {Promise<Object>} Cliente atualizado
 */
export const updateCustomer = async (customerId, customerData) => {
    if (!customerId) throw new Error('ID do cliente Asaas nao fornecido.');

    const payload = {};
    if (customerData.name) payload.name = customerData.name.trim();
    if (customerData.cpfCnpj) payload.cpfCnpj = cleanDocument(customerData.cpfCnpj);
    if (customerData.email) payload.email = customerData.email.trim().toLowerCase();
    if (customerData.phone) payload.phone = cleanPhone(customerData.phone);
    if (customerData.mobilePhone) payload.mobilePhone = cleanPhone(customerData.mobilePhone);
    if (customerData.postalCode) payload.postalCode = cleanDocument(customerData.postalCode);
    if (customerData.address) payload.address = customerData.address;
    if (customerData.addressNumber) payload.addressNumber = customerData.addressNumber;
    if (customerData.complement) payload.complement = customerData.complement;
    if (customerData.province) payload.province = customerData.province;

    return await asaasRequest(`/customers/${customerId}`, {
        method: 'PUT',
        body: payload
    });
};

/**
 * Remove um cliente no Asaas.
 *
 * @param {string} customerId
 * @returns {Promise<Object>}
 */
export const deleteCustomer = async (customerId) => {
    if (!customerId) throw new Error('ID do cliente Asaas nao fornecido.');
    return await asaasRequest(`/customers/${customerId}`, {
        method: 'DELETE'
    });
};

// ============================================================================
// 2. MODULO DE COBRANCAS (PAYMENTS - /v3/payments)
// ============================================================================

/**
 * Cria uma nova cobranca no Asaas (PIX, Boleto, Cartao de Credito ou Indefinido).
 *
 * @param {Object} paymentData
 * @param {string} paymentData.customer ID do cliente no Asaas (ex: 'cus_...')
 * @param {string} [paymentData.billingType='PIX'] 'PIX', 'BOLETO', 'CREDIT_CARD', 'UNDEFINED'
 * @param {number|string} paymentData.value Valor monetario em reais
 * @param {string} paymentData.dueDate Data de vencimento no formato YYYY-MM-DD
 * @param {string} [paymentData.description] Descricao visivel na fatura
 * @param {string} [paymentData.externalReference] Codigo unico interno (ex: 'FAT-2026-001')
 * @param {boolean} [paymentData.postalService=false] Envio postal de boleto impresso
 * @param {Object} [paymentData.discount] Regras de desconto por antecipacao
 * @param {Object} [paymentData.interest] Juros de mora apos vencimento
 * @param {Object} [paymentData.fine] Multa percentual apos vencimento
 * @returns {Promise<Object>} Cobranca criada
 */
export const createPayment = async (paymentData) => {
    if (!paymentData?.customer) {
        throw new Error('ID do cliente Asaas (customer) e obrigatorio para gerar cobranca.');
    }
    if (!paymentData?.dueDate) {
        throw new Error('Data de vencimento (dueDate) e obrigatoria para cobranca Asaas.');
    }

    const payload = {
        customer: paymentData.customer,
        billingType: paymentData.billingType || 'PIX',
        value: normalizeAsaasValue(paymentData.value),
        dueDate: paymentData.dueDate,
        description: paymentData.description || 'Fatura de Servicos Tecnologicos e Manutencao',
        externalReference: paymentData.externalReference || undefined,
        postalService: Boolean(paymentData.postalService),
        discount: paymentData.discount || undefined,
        interest: paymentData.interest || undefined,
        fine: paymentData.fine || undefined
    };

    return await asaasRequest('/payments', {
        method: 'POST',
        body: payload
    });
};

/**
 * Obtem os dados detalhados de uma cobranca por ID.
 *
 * @param {string} paymentId ID da cobranca no Asaas (ex: 'pay_...')
 * @returns {Promise<Object>} Dados da cobranca com status
 */
export const getPaymentById = async (paymentId) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao fornecido.');
    return await asaasRequest(`/payments/${paymentId}`);
};

/**
 * Obtem o QR Code oficial e o codigo Copia e Cola para cobrancas via PIX.
 * Endpoint Asaas: GET /v3/payments/{id}/pixQrCode
 *
 * @param {string} paymentId ID da cobranca no Asaas
 * @returns {Promise<{ encodedImage: string, payload: string, expirationDate: string }>}
 */
export const getPaymentPixQrCode = async (paymentId) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao informado.');
    return await asaasRequest(`/payments/${paymentId}/pixQrCode`);
};

/**
 * Obtem a linha digitavel do boleto bancario para a cobranca.
 *
 * @param {string} paymentId ID da cobranca no Asaas
 * @returns {Promise<{ identificationField: string, nossonumero: string, barCode: string }>}
 */
export const getBankSlipIdentificationField = async (paymentId) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao informado.');
    return await asaasRequest(`/payments/${paymentId}/identificationField`);
};

/**
 * Lista cobrancas com filtros e paginacao.
 *
 * @param {Object} [params]
 * @param {string} [params.customer] ID do cliente
 * @param {string} [params.status] PENDING, RECEIVED, CONFIRMED, OVERDUE, REFUNDED, etc.
 * @param {string} [params.subscription] ID da assinatura
 * @param {string} [params.dueDateGE] Vencimento maior ou igual (YYYY-MM-DD)
 * @param {string} [params.dueDateLE] Vencimento menor ou igual (YYYY-MM-DD)
 * @param {number} [params.offset=0]
 * @param {number} [params.limit=20]
 * @returns {Promise<Object>} Lista de cobrancas
 */
export const listPayments = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.customer) query.append('customer', params.customer);
    if (params.status) query.append('status', params.status);
    if (params.subscription) query.append('subscription', params.subscription);
    if (params.dueDateGE) query.append('dueDate[ge]', params.dueDateGE);
    if (params.dueDateLE) query.append('dueDate[le]', params.dueDateLE);
    if (params.offset !== undefined) query.append('offset', String(params.offset));
    if (params.limit !== undefined) query.append('limit', String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString ? `/payments?${queryString}` : '/payments';
    return await asaasRequest(endpoint);
};

/**
 * Atualiza uma cobranca existente no Asaas.
 *
 * @param {string} paymentId ID da cobranca
 * @param {Object} paymentData Dados a atualizar (valor, vencimento, descricao)
 * @returns {Promise<Object>} Cobranca atualizada
 */
export const updatePayment = async (paymentId, paymentData) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao fornecido.');

    const payload = {};
    if (paymentData.value !== undefined) payload.value = normalizeAsaasValue(paymentData.value);
    if (paymentData.dueDate) payload.dueDate = paymentData.dueDate;
    if (paymentData.description) payload.description = paymentData.description;
    if (paymentData.billingType) payload.billingType = paymentData.billingType;

    return await asaasRequest(`/payments/${paymentId}`, {
        method: 'PUT',
        body: payload
    });
};

/**
 * Cancela ou exclui uma cobranca pendente no Asaas.
 *
 * @param {string} paymentId ID da cobranca
 * @returns {Promise<Object>} Confirmacao de cancelamento
 */
export const cancelPayment = async (paymentId) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao fornecido.');
    return await asaasRequest(`/payments/${paymentId}`, {
        method: 'DELETE'
    });
};

/**
 * Realiza o estorno de uma cobranca recebida no Asaas.
 *
 * @param {string} paymentId ID da cobranca
 * @param {Object} [refundData]
 * @param {number} [refundData.value] Valor parcial (se nulo, estorna total)
 * @param {string} [refundData.description] Motivo do estorno
 * @returns {Promise<Object>} Dados do estorno
 */
export const refundPayment = async (paymentId, refundData = {}) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao fornecido.');

    const payload = {};
    if (refundData.value) payload.value = normalizeAsaasValue(refundData.value);
    if (refundData.description) payload.description = refundData.description;

    return await asaasRequest(`/payments/${paymentId}/refund`, {
        method: 'POST',
        body: payload
    });
};

/**
 * Confirma o recebimento manual de uma cobranca em dinheiro ou transferencia fora do gateway.
 *
 * @param {string} paymentId ID da cobranca
 * @param {Object} [data]
 * @param {string} [data.paymentDate] Data do pagamento (YYYY-MM-DD)
 * @param {number} [data.value] Valor recebido
 * @param {boolean} [data.notifyCustomer=false] Se envia notificacao por e-mail ao cliente
 * @returns {Promise<Object>} Cobranca confirmada
 */
export const confirmPaymentInCash = async (paymentId, data = {}) => {
    if (!paymentId) throw new Error('ID da cobranca Asaas nao fornecido.');

    const payload = {
        paymentDate: data.paymentDate || new Date().toISOString().split('T')[0],
        value: data.value ? normalizeAsaasValue(data.value) : undefined,
        notifyCustomer: Boolean(data.notifyCustomer)
    };

    return await asaasRequest(`/payments/${paymentId}/receiveInCash`, {
        method: 'POST',
        body: payload
    });
};

// ============================================================================
// 3. MODULO DE ASSINATURAS RECORRENTES (SUBSCRIPTIONS - /v3/subscriptions)
// ============================================================================

/**
 * Cria uma assinatura recorrente no Asaas.
 *
 * @param {Object} subscriptionData
 * @param {string} subscriptionData.customer ID do cliente no Asaas
 * @param {string} [subscriptionData.billingType='PIX'] 'PIX', 'BOLETO', 'CREDIT_CARD', 'UNDEFINED'
 * @param {number|string} subscriptionData.value Valor de cada ciclo
 * @param {string} subscriptionData.nextDueDate Data do primeiro vencimento (YYYY-MM-DD)
 * @param {string} [subscriptionData.cycle='MONTHLY'] 'MONTHLY', 'QUARTERLY', 'SEMIANNUALLY', 'YEARLY'
 * @param {string} [subscriptionData.description] Descricao do plano contratado
 * @param {string} [subscriptionData.externalReference] Codigo unico do contrato (ex: 'SUB-2026-001')
 * @returns {Promise<Object>} Assinatura criada
 */
export const createSubscription = async (subscriptionData) => {
    if (!subscriptionData?.customer) {
        throw new Error('ID do cliente Asaas (customer) e obrigatorio para criar assinatura.');
    }
    if (!subscriptionData?.nextDueDate) {
        throw new Error('Data do proximo vencimento (nextDueDate) e obrigatoria para assinatura.');
    }

    const payload = {
        customer: subscriptionData.customer,
        billingType: subscriptionData.billingType || 'PIX',
        value: normalizeAsaasValue(subscriptionData.value),
        nextDueDate: subscriptionData.nextDueDate,
        cycle: mapCycleToAsaas(subscriptionData.cycle),
        description: subscriptionData.description || 'Assinatura de Manutencao Tecnologica Contínua',
        externalReference: subscriptionData.externalReference || undefined
    };

    return await asaasRequest('/subscriptions', {
        method: 'POST',
        body: payload
    });
};

/**
 * Obtem os detalhes de uma assinatura recorrente por ID.
 *
 * @param {string} subscriptionId ID da assinatura no Asaas (ex: 'sub_...')
 * @returns {Promise<Object>} Dados da assinatura
 */
export const getSubscriptionById = async (subscriptionId) => {
    if (!subscriptionId) throw new Error('ID da assinatura Asaas nao fornecido.');
    return await asaasRequest(`/subscriptions/${subscriptionId}`);
};

/**
 * Lista assinaturas recorrentes com filtros.
 *
 * @param {Object} [params]
 * @param {string} [params.customer] ID do cliente
 * @param {string} [params.status] ACTIVE, INACTIVE
 * @param {number} [params.offset=0]
 * @param {number} [params.limit=20]
 * @returns {Promise<Object>} Lista de assinaturas
 */
export const listSubscriptions = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.customer) query.append('customer', params.customer);
    if (params.status) query.append('status', params.status);
    if (params.offset !== undefined) query.append('offset', String(params.offset));
    if (params.limit !== undefined) query.append('limit', String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString ? `/subscriptions?${queryString}` : '/subscriptions';
    return await asaasRequest(endpoint);
};

/**
 * Lista todas as cobrancas vinculadas a uma assinatura recorrente.
 *
 * @param {string} subscriptionId ID da assinatura
 * @param {Object} [params] Filtros opcionais
 * @returns {Promise<Object>} Lista de cobrancas da assinatura
 */
export const listSubscriptionPayments = async (subscriptionId, params = {}) => {
    if (!subscriptionId) throw new Error('ID da assinatura Asaas nao fornecido.');

    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.offset !== undefined) query.append('offset', String(params.offset));
    if (params.limit !== undefined) query.append('limit', String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString
        ? `/subscriptions/${subscriptionId}/payments?${queryString}`
        : `/subscriptions/${subscriptionId}/payments`;

    return await asaasRequest(endpoint);
};

/**
 * Cancela e encerra uma assinatura recorrente no Asaas.
 *
 * @param {string} subscriptionId ID da assinatura
 * @returns {Promise<Object>} Resposta de cancelamento
 */
export const cancelSubscription = async (subscriptionId) => {
    if (!subscriptionId) throw new Error('ID da assinatura Asaas nao fornecido.');
    return await asaasRequest(`/subscriptions/${subscriptionId}`, {
        method: 'DELETE'
    });
};

/**
 * Atualiza o valor, ciclo ou condicoes de uma assinatura existente.
 *
 * @param {string} subscriptionId ID da assinatura
 * @param {Object} data Dados a atualizar
 * @returns {Promise<Object>} Assinatura atualizada
 */
export const updateSubscription = async (subscriptionId, data = {}) => {
    if (!subscriptionId) throw new Error('ID da assinatura Asaas nao fornecido.');

    const payload = {};
    if (data.value !== undefined) payload.value = normalizeAsaasValue(data.value);
    if (data.nextDueDate) payload.nextDueDate = data.nextDueDate;
    if (data.cycle) payload.cycle = mapCycleToAsaas(data.cycle);
    if (data.description) payload.description = data.description;
    if (data.billingType) payload.billingType = data.billingType;
    if (data.updatePendingPayments !== undefined) payload.updatePendingPayments = Boolean(data.updatePendingPayments);

    return await asaasRequest(`/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        body: payload
    });
};

// ============================================================================
// 4. MODULO DE LINKS DE PAGAMENTO (PAYMENT LINKS - /v3/paymentLinks)
// ============================================================================

/**
 * Cria um link de pagamentos para checkout rapido.
 *
 * @param {Object} linkData
 * @param {string} linkData.name Titulo do link
 * @param {string} [linkData.description] Descricao do servico
 * @param {number|string} linkData.value Valor cobrado
 * @param {string} [linkData.billingType='UNDEFINED'] Forma de cobranca
 * @param {string} [linkData.chargeType='DETACHED'] 'DETACHED', 'RECURRENT', 'INSTALLMENT'
 * @param {number} [linkData.dueDateLimitDays] Dias limite para vencimento
 * @returns {Promise<Object>} Link de pagamento com URL publica
 */
export const createPaymentLink = async (linkData) => {
    if (!linkData?.name) throw new Error('Nome do link de pagamento e obrigatorio.');
    if (!linkData?.value) throw new Error('Valor do link de pagamento e obrigatorio.');

    const payload = {
        name: linkData.name.trim(),
        description: linkData.description || undefined,
        value: normalizeAsaasValue(linkData.value),
        billingType: linkData.billingType || 'UNDEFINED',
        chargeType: linkData.chargeType || 'DETACHED',
        dueDateLimitDays: linkData.dueDateLimitDays || 3
    };

    return await asaasRequest('/paymentLinks', {
        method: 'POST',
        body: payload
    });
};

/**
 * Obtem dados de um link de pagamento.
 *
 * @param {string} linkId
 * @returns {Promise<Object>}
 */
export const getPaymentLinkById = async (linkId) => {
    if (!linkId) throw new Error('ID do link de pagamento nao fornecido.');
    return await asaasRequest(`/paymentLinks/${linkId}`);
};

/**
 * Lista links de pagamento criados.
 *
 * @param {Object} [params]
 * @returns {Promise<Object>}
 */
export const listPaymentLinks = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.active !== undefined) query.append('active', String(params.active));
    if (params.offset !== undefined) query.append('offset', String(params.offset));
    if (params.limit !== undefined) query.append('limit', String(params.limit));

    const queryString = query.toString();
    const endpoint = queryString ? `/paymentLinks?${queryString}` : '/paymentLinks';
    return await asaasRequest(endpoint);
};

// ============================================================================
// 5. MODULO DE WEBHOOKS (WEBHOOKS - /v3/webhooks)
// ============================================================================

/**
 * Cria ou configura um novo webhook no Asaas.
 *
 * @param {Object} webhookData
 * @param {string} webhookData.url URL HTTPS publica do endpoint de webhook
 * @param {string} [webhookData.email] E-mail para avisos de falha
 * @param {string} [webhookData.name='Webhook Portfolio'] Nome identificador
 * @param {string} [webhookData.authToken] Token de autenticacao enviado no header da chamada
 * @param {Array<string>} [webhookData.events] Lista de eventos (PAYMENT_RECEIVED, PAYMENT_CONFIRMED, etc.)
 * @returns {Promise<Object>} Webhook configurado
 */
export const createWebhook = async (webhookData) => {
    if (!webhookData?.url) throw new Error('URL de destino do webhook e obrigatoria.');

    const defaultEvents = [
        'PAYMENT_CREATED',
        'PAYMENT_UPDATED',
        'PAYMENT_CONFIRMED',
        'PAYMENT_RECEIVED',
        'PAYMENT_OVERDUE',
        'PAYMENT_DELETED',
        'PAYMENT_REFUNDED'
    ];

    const payload = {
        name: webhookData.name || 'Webhook Portfolio & Manutencao',
        url: webhookData.url.trim(),
        email: webhookData.email || undefined,
        sendType: 'SEQUENTIALLY',
        enabled: true,
        interleaved: false,
        apiVersion: 3,
        authToken: webhookData.authToken || undefined,
        events: webhookData.events || defaultEvents
    };

    return await asaasRequest('/webhooks', {
        method: 'POST',
        body: payload
    });
};

/**
 * Lista os webhooks configurados na conta Asaas.
 *
 * @returns {Promise<Object>} Lista de webhooks
 */
export const listWebhooks = async () => {
    return await asaasRequest('/webhooks');
};

/**
 * Remove um webhook configurado.
 *
 * @param {string} webhookId
 * @returns {Promise<Object>}
 */
export const deleteWebhook = async (webhookId) => {
    if (!webhookId) throw new Error('ID do webhook Asaas nao fornecido.');
    return await asaasRequest(`/webhooks/${webhookId}`, {
        method: 'DELETE'
    });
};

// ============================================================================
// 6. MODULO DE GESTAO FINANCEIRA & SALDO (FINANCE - /v3/finance)
// ============================================================================

/**
 * Consulta o saldo atual disponivel na conta Asaas.
 *
 * @returns {Promise<{ balance: number }>} Saldo em reais
 */
export const getAccountBalance = async () => {
    return await asaasRequest('/finance/balance');
};

/**
 * Consulta informacoes comerciais e cadastrais da conta Asaas.
 *
 * @returns {Promise<Object>} Dados da conta
 */
export const getAccountCommercialInfo = async () => {
    return await asaasRequest('/myAccount/commercialInfo/');
};

/**
 * Consulta a situacao cadastral e status da conta.
 *
 * @returns {Promise<Object>}
 */
export const getAccountStatus = async () => {
    return await asaasRequest('/myAccount/status/');
};

/**
 * Consulta as taxas aplicadas a conta para PIX, Boleto e Cartao.
 *
 * @returns {Promise<Object>} Taxas comerciais
 */
export const getAccountFees = async () => {
    return await asaasRequest('/myAccount/fees/');
};

/**
 * Consulta estatisticas consolidadas de cobrancas (valores recebidos, pendentes e vencidos).
 *
 * @param {Object} [params] Filtros por cliente ou periodo
 * @returns {Promise<Object>} Estatisticas consolidadas
 */
export const getPaymentStatistics = async (params = {}) => {
    const query = new URLSearchParams();
    if (params.customer) query.append('customer', params.customer);
    if (params.status) query.append('status', params.status);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.finishDate) query.append('finishDate', params.finishDate);

    const queryString = query.toString();
    const endpoint = queryString ? `/finance/payment/statistics?${queryString}` : '/finance/payment/statistics';
    return await asaasRequest(endpoint);
};

// ============================================================================
// 7. FUNCOES INTEGRADAS PARA FLUXOS DE FATURAMENTO DO PORTFOLIO
// ============================================================================

/**
 * Emite cobranca PIX completa no Asaas com busca/criacao automatica de cliente e obtencao de QR Code.
 *
 * @param {Object} params
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.clientDocument CPF ou CNPJ
 * @param {string} [params.clientEmail] E-mail
 * @param {string} [params.clientPhone] Celular / WhatsApp
 * @param {number|string} params.amount Valor da fatura
 * @param {string} params.dueDate Data de vencimento (YYYY-MM-DD)
 * @param {string} [params.description] Descricao do servico
 * @param {string} [params.invoiceCode] Codigo da fatura (ex: 'FAT-2026-001')
 * @returns {Promise<{
 *   paymentId: string,
 *   customerId: string,
 *   invoiceUrl: string,
 *   pixQrCode: string,
 *   pixQrCodeBase64: string,
 *   expirationDate: string,
 *   gateway: string
 * }>}
 */
export const generateAsaasPixInvoice = async (params) => {
    const {
        clientName,
        clientDocument,
        clientEmail,
        clientPhone,
        amount,
        dueDate,
        description,
        invoiceCode
    } = params;

    // 1. Localiza ou cria o cliente no Asaas
    const customer = await findOrCreateCustomer({
        name: clientName,
        cpfCnpj: clientDocument,
        email: clientEmail,
        mobilePhone: clientPhone,
        externalReference: clientDocument ? cleanDocument(clientDocument) : undefined
    });

    if (!customer?.id) {
        throw new Error('Nao foi possivel registrar ou localizar o cliente no Asaas.');
    }

    // 2. Cria a cobranca no Asaas com tipo PIX
    const payment = await createPayment({
        customer: customer.id,
        billingType: 'PIX',
        value: amount,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        description: description || `Fatura de Manutencao ${invoiceCode || ''}`.trim(),
        externalReference: invoiceCode || undefined
    });

    if (!payment?.id) {
        throw new Error('Falha ao criar cobranca PIX no Asaas.');
    }

    // 3. Obtem o QR Code PIX oficial e o Copia e Cola
    let pixData = { encodedImage: '', payload: '', expirationDate: '' };
    try {
        pixData = await getPaymentPixQrCode(payment.id);
    } catch (err) {
        console.warn('[Asaas Service] Nao foi possivel carregar QR Code imediato:', err.message);
    }

    return {
        paymentId: payment.id,
        customerId: customer.id,
        invoiceUrl: payment.invoiceUrl || `https://sandbox.asaas.com/i/${payment.id}`,
        pixQrCode: pixData.payload || '',
        pixQrCodeBase64: pixData.encodedImage ? `data:image/png;base64,${pixData.encodedImage}` : '',
        expirationDate: pixData.expirationDate || '',
        gateway: 'asaas'
    };
};
