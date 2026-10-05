import { supabase } from '../lib/customSupabaseClient.js';
import { createCashInPix } from './pushinPayService.js';

/**
 * Servico de Gestao de Assinaturas, Categorias, Faturas PIX e Atendimento
 * Modulo Central de Manutencao Mensal do MeuPortfolio v2
 *
 * Responsavel por:
 * 1. CRUD de Categorias de Manutencao (maintenance_categories)
 * 2. CRUD de Assinaturas de Clientes (maintenance_subscriptions)
 * 3. Geracao e liquidacao de faturas (maintenance_invoices) integradas com PushinPay
 * 4. Reajuste e programacao de novos precos de planos
 * 5. Confirmacao manual e liquidacao de pagamentos com avanco de ciclo mensal
 * 6. Consulta publica / Portal do Cliente por documento ou e-mail
 * 7. Abertura e consulta de chamados de suporte (support_tickets)
 */

/**
 * Gera um codigo unico e amigavel com prefixo e ano.
 * Exemplo: FAT-2026-A8K2
 *
 * @param {string} prefix Prefixo do identificador (SUB, FAT, TICK)
 * @returns {string} Codigo gerado
 */
export const generateUniqueCode = (prefix = 'COD') => {
    const year = new Date().getFullYear();
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${year}-${randomPart}`;
};

/**
 * Higieniza documento (CPF ou CNPJ), mantendo apenas digitos numericos.
 *
 * @param {string} doc Documento com ou sem pontuacao
 * @returns {string} Documento contendo apenas digitos
 */
export const sanitizeDocument = (doc) => {
    if (!doc) return '';
    return String(doc).replace(/\D/g, '');
};

/**
 * Higieniza numero de telefone, mantendo apenas digitos numericos.
 *
 * @param {string} phone Telefone com ou sem mascara
 * @returns {string} Telefone com apenas digitos
 */
export const sanitizePhone = (phone) => {
    if (!phone) return '';
    return String(phone).replace(/\D/g, '');
};

/**
 * Calcula a proxima data de vencimento a partir do dia de faturamento (billing_day).
 * Caso a data de referencia seja omitida, utiliza a data atual.
 *
 * @param {number} billingDay Dia fixo do vencimento (1 a 31)
 * @param {Date|string} [baseDate] Data de partida opcional
 * @returns {string} Data em formato ISO (YYYY-MM-DD)
 */
export const calculateNextDueDate = (billingDay = 10, baseDate = null) => {
    const now = baseDate ? new Date(baseDate) : new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 a 11
    const currentDay = now.getDate();

    const targetDay = Math.min(Math.max(Number(billingDay) || 10, 1), 31);

    let year = currentYear;
    let month = currentMonth;

    // Se a data base for nula e o dia de faturamento deste mes ja passou, avanca para o proximo mes
    if (!baseDate && currentDay >= targetDay) {
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
    } else if (baseDate) {
        // Se foi passada uma data base existente (ex: vencimento atual), avanca exatamente 1 mes
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
    }

    // Garante que o dia nao ultrapasse o ultimo dia do mes de destino
    const maxDayInMonth = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(targetDay, maxDayInMonth);

    const pad = (n) => String(n).padStart(2, '0');
    return `${year}-${pad(month + 1)}-${pad(safeDay)}`;
};

/* ==========================================================================
   1. CATEGORIAS DE MANUTENCAO (maintenance_categories)
   ========================================================================== */

/**
 * Busca todas as categorias de manutencao cadastradas.
 *
 * @returns {Promise<Array>} Lista de categorias
 */
export const fetchMaintenanceCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('maintenance_categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.warn('Aviso ao buscar maintenance_categories:', error.message);
            // Categorias padrao de fallback
            return [
                { id: 'cat-1', name: 'Manutenção Web & Hospedagem', description: 'Gestão, atualizações de segurança e hospedagem para sites e sistemas.', color: 'from-blue-500 to-indigo-600', icon: 'Wrench' },
                { id: 'cat-2', name: 'Suporte Técnico & Infraestrutura', description: 'Suporte contínuo, monitoramento preventivo e infraestrutura em nuvem.', color: 'from-indigo-500 to-purple-600', icon: 'Server' },
                { id: 'cat-3', name: 'Gestão de Tráfego & SEO', description: 'Otimização para motores de busca e gestão de tráfego qualificado.', color: 'from-amber-500 to-orange-600', icon: 'TrendingUp' },
                { id: 'cat-4', name: 'Automações & APIs', description: 'Desenvolvimento, integrações via webhook e rotinas automatizadas.', color: 'from-emerald-500 to-teal-600', icon: 'Cpu' }
            ];
        }

        return data || [];
    } catch (err) {
        console.error('Falha no servico fetchMaintenanceCategories:', err);
        return [];
    }
};

/**
 * Cadastra uma nova categoria de servico de manutencao.
 *
 * @param {Object} categoryData
 * @param {string} categoryData.name Nome da categoria
 * @param {string} [categoryData.description] Descricao da categoria
 * @param {string} [categoryData.color] Gradiente ou cor
 * @param {string} [categoryData.icon] Nome do icone Lucide
 * @returns {Promise<Object>} Categoria criada
 */
export const createMaintenanceCategory = async ({
    name,
    description = '',
    color = 'from-blue-500 to-indigo-600',
    icon = 'Wrench'
}) => {
    if (!name || name.trim() === '') {
        throw new Error('O nome da categoria e obrigatorio.');
    }

    const { data, error } = await supabase
        .from('maintenance_categories')
        .insert([{
            name: name.trim(),
            description: description ? description.trim() : null,
            color,
            icon
        }])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar categoria de manutencao:', error);
        throw error;
    }

    return data;
};

/* ==========================================================================
   2. ASSINATURAS DE CLIENTES (maintenance_subscriptions)
   ========================================================================== */

/**
 * Lista as assinaturas de manutencao cadastradas com suporte a filtros.
 *
 * @param {Object} [filters] Filtros de busca
 * @param {string} [filters.status] Status da assinatura (ativo, pendente, cancelado)
 * @param {string} [filters.search] Busca textual por nome, documento ou email
 * @param {string} [filters.categoryId] ID da categoria
 * @returns {Promise<Array>} Lista de assinaturas com categoria
 */
export const fetchSubscriptions = async (filters = {}) => {
    try {
        let query = supabase
            .from('maintenance_subscriptions')
            .select(`
                *,
                category:maintenance_categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                )
            `)
            .order('created_at', { ascending: false });

        if (filters.status && filters.status !== 'todos') {
            query = query.eq('status', filters.status);
        }

        if (filters.categoryId) {
            query = query.eq('category_id', filters.categoryId);
        }

        if (filters.search && filters.search.trim() !== '') {
            const cleanSearch = filters.search.trim();
            query = query.or(`client_name.ilike.%${cleanSearch}%,client_email.ilike.%${cleanSearch}%,client_document.ilike.%${cleanSearch}%,subscription_code.ilike.%${cleanSearch}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao buscar assinaturas:', error);
            throw error;
        }

        return data || [];
    } catch (err) {
        console.error('Falha no servico fetchSubscriptions:', err);
        throw err;
    }
};

/**
 * Busca uma assinatura especifica pelo ID, incluindo faturas associadas.
 *
 * @param {string} id ID da assinatura
 * @returns {Promise<Object>} Dados completos da assinatura e suas faturas
 */
export const getSubscriptionById = async (id) => {
    if (!id) throw new Error('ID da assinatura nao informado.');

    try {
        const { data, error } = await supabase
            .from('maintenance_subscriptions')
            .select(`
                *,
                category:maintenance_categories (
                    id,
                    name,
                    description,
                    color,
                    icon
                ),
                invoices:maintenance_invoices (
                    id,
                    invoice_code,
                    amount,
                    due_date,
                    status,
                    pix_qr_code,
                    pix_qr_code_base64,
                    paid_at,
                    created_at
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar assinatura por ID:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Falha no servico getSubscriptionById:', err);
        throw err;
    }
};

/**
 * Cadastra uma nova assinatura de manutencao no sistema.
 *
 * @param {Object} subscriptionData Dados do cliente e do plano
 * @returns {Promise<Object>} Registro da assinatura criada
 */
export const createSubscription = async (subscriptionData) => {
    const {
        client_name,
        client_document,
        client_email,
        client_phone,
        client_company = '',
        category_id = null,
        plan_title,
        plan_description = '',
        current_price,
        next_price = null,
        next_price_effective_date = null,
        billing_day = 10,
        billing_cycle = 'mensal',
        status = 'ativo',
        next_due_date = null,
        notes = ''
    } = subscriptionData;

    if (!client_email || !client_email.trim()) {
        throw new Error('E-mail do cliente e obrigatorio.');
    }
    const finalClientName = client_name && client_name.trim()
        ? client_name.trim()
        : client_email.split('@')[0];

    if (!plan_title || !plan_title.trim()) {
        throw new Error('Titulo do plano de manutencao e obrigatorio.');
    }
    if (current_price === undefined || current_price === null || Number(current_price) <= 0) {
        throw new Error('Valor mensal atual da assinatura e obrigatorio.');
    }

    const cleanDocument = client_document ? sanitizeDocument(client_document) : null;
    const cleanPhone = client_phone ? sanitizePhone(client_phone) : null;
    const safeBillingDay = Math.min(Math.max(Number(billing_day) || 10, 1), 31);
    const calculatedDueDate = next_due_date || calculateNextDueDate(safeBillingDay);
    const code = subscriptionData.subscription_code || generateUniqueCode('SUB');

    const payload = {
        subscription_code: code,
        client_name: finalClientName,
        client_document: cleanDocument,
        client_email: client_email.trim().toLowerCase(),
        client_phone: cleanPhone,
        client_company: client_company ? client_company.trim() : null,
        category_id: category_id || null,
        plan_title: plan_title.trim(),
        plan_description: plan_description ? plan_description.trim() : null,
        current_price: Number(current_price),
        next_price: next_price !== null && next_price !== undefined ? Number(next_price) : null,
        next_price_effective_date: next_price_effective_date || null,
        billing_day: safeBillingDay,
        billing_cycle,
        status,
        next_due_date: calculatedDueDate,
        notes: notes ? notes.trim() : null
    };

    const { data, error } = await supabase
        .from('maintenance_subscriptions')
        .insert([payload])
        .select(`
            *,
            category:maintenance_categories (
                id,
                name,
                color,
                icon
            )
        `)
        .single();

    if (error) {
        console.error('Erro ao cadastrar assinatura:', error);
        throw error;
    }

    return data;
};

/**
 * Atualiza os dados de uma assinatura existente.
 *
 * @param {string} id ID da assinatura
 * @param {Object} updateData Campos a atualizar
 * @returns {Promise<Object>} Assinatura atualizada
 */
export const updateSubscription = async (id, updateData) => {
    if (!id) throw new Error('ID da assinatura nao informado.');

    const payload = { ...updateData };

    if (payload.client_document) {
        payload.client_document = sanitizeDocument(payload.client_document);
    }
    if (payload.client_phone) {
        payload.client_phone = sanitizePhone(payload.client_phone);
    }
    if (payload.client_email) {
        payload.client_email = payload.client_email.trim().toLowerCase();
    }
    if (payload.current_price !== undefined) {
        payload.current_price = Number(payload.current_price);
    }
    if (payload.next_price !== undefined) {
        payload.next_price = payload.next_price !== null ? Number(payload.next_price) : null;
    }

    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('maintenance_subscriptions')
        .update(payload)
        .eq('id', id)
        .select(`
            *,
            category:maintenance_categories (
                id,
                name,
                color,
                icon
            )
        `)
        .single();

    if (error) {
        console.error('Erro ao atualizar assinatura:', error);
        throw error;
    }

    return data;
};

/**
 * Atualiza o valor atual ou programa reajuste futuro na assinatura.
 *
 * @param {string} id ID da assinatura
 * @param {Object} priceOptions
 * @param {number} [priceOptions.currentPrice] Novo valor atual
 * @param {number|null} [priceOptions.nextPrice] Novo valor futuro agendado
 * @param {string|null} [priceOptions.nextPriceEffectiveDate] Data em que o reajuste entra em vigor
 * @returns {Promise<Object>} Assinatura atualizada
 */
export const updateSubscriptionPrice = async (id, {
    currentPrice,
    nextPrice,
    nextPriceEffectiveDate
} = {}) => {
    if (!id) throw new Error('ID da assinatura nao informado.');

    const payload = {
        updated_at: new Date().toISOString()
    };

    if (currentPrice !== undefined && currentPrice !== null) {
        payload.current_price = Number(currentPrice);
    }

    if (nextPrice !== undefined) {
        payload.next_price = nextPrice !== null ? Number(nextPrice) : null;
        payload.next_price_effective_date = nextPrice !== null ? nextPriceEffectiveDate : null;
    }

    return await updateSubscription(id, payload);
};

/**
 * Exclui uma assinatura de manutencao do sistema.
 *
 * @param {string} id ID da assinatura
 * @returns {Promise<boolean>} Sucesso da exclusao
 */
export const deleteSubscription = async (id) => {
    if (!id) throw new Error('ID da assinatura nao informado.');

    const { error } = await supabase
        .from('maintenance_subscriptions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir assinatura:', error);
        throw error;
    }

    return true;
};

/* ==========================================================================
   3. FATURAS E COBRANCAS PIX (maintenance_invoices)
   ========================================================================== */

/**
 * Lista as faturas de manutencao com filtros e dados da assinatura vinculada.
 *
 * @param {Object} [filters]
 * @param {string} [filters.subscriptionId] ID de uma assinatura especifica
 * @param {string} [filters.status] Status da fatura (pendente, pago, cancelado)
 * @param {string} [filters.search] Busca por codigo da fatura ou nome do cliente
 * @returns {Promise<Array>} Lista de faturas
 */
export const fetchInvoices = async (filters = {}) => {
    try {
        let query = supabase
            .from('maintenance_invoices')
            .select(`
                *,
                subscription:maintenance_subscriptions (
                    id,
                    subscription_code,
                    client_name,
                    client_document,
                    client_email,
                    client_phone,
                    plan_title,
                    billing_day
                )
            `)
            .order('due_date', { ascending: false });

        if (filters.subscriptionId) {
            query = query.eq('subscription_id', filters.subscriptionId);
        }

        if (filters.status && filters.status !== 'todos') {
            query = query.eq('status', filters.status);
        }

        if (filters.search && filters.search.trim() !== '') {
            query = query.ilike('invoice_code', `%${filters.search.trim()}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao buscar faturas:', error);
            throw error;
        }

        return data || [];
    } catch (err) {
        console.error('Falha no servico fetchInvoices:', err);
        throw err;
    }
};

/**
 * Busca uma fatura por ID com todos os detalhes e vinculo de assinatura.
 *
 * @param {string} id ID da fatura
 * @returns {Promise<Object>} Dados da fatura
 */
export const getInvoiceById = async (id) => {
    if (!id) throw new Error('ID da fatura nao informado.');

    try {
        const { data, error } = await supabase
            .from('maintenance_invoices')
            .select(`
                *,
                subscription:maintenance_subscriptions (
                    id,
                    subscription_code,
                    client_name,
                    client_document,
                    client_email,
                    client_phone,
                    plan_title,
                    billing_day,
                    current_price
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar fatura por ID:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Falha no servico getInvoiceById:', err);
        throw err;
    }
};

/**
 * Gera uma nova fatura para uma assinatura, integrando com o gateway PushinPay.
 * Calcula o valor correto (considerando reajuste futuro caso a data de vigencia ja tenha chegado)
 * e gera o QR Code e chave Copia e Cola PIX.
 *
 * @param {string} subscriptionId ID da assinatura
 * @param {Object} [options]
 * @param {string} [options.dueDate] Data de vencimento especifica (YYYY-MM-DD)
 * @param {number} [options.customAmount] Valor customizado opcional
 * @param {string} [options.notes] Observacoes na fatura
 * @returns {Promise<Object>} Fatura gerada com dados do Pix
 */
export const generateInvoiceForSubscription = async (subscriptionId, options = {}) => {
    if (!subscriptionId) {
        throw new Error('ID da assinatura e obrigatorio para geracao de fatura.');
    }

    // 1. Busca dados da assinatura
    const subscription = await getSubscriptionById(subscriptionId);
    if (!subscription) {
        throw new Error(`Assinatura nao encontrada para o ID: ${subscriptionId}`);
    }

    // 2. Determina a data de vencimento
    const dueDate = options.dueDate || subscription.next_due_date || calculateNextDueDate(subscription.billing_day);

    // 3. Determina o valor da fatura
    let invoiceAmount = Number(subscription.current_price);

    if (options.customAmount !== undefined && options.customAmount !== null) {
        invoiceAmount = Number(options.customAmount);
    } else if (
        subscription.next_price &&
        subscription.next_price_effective_date &&
        dueDate >= subscription.next_price_effective_date
    ) {
        // Se a data de vencimento atinge a vigencia do novo valor, aplica o reajuste
        invoiceAmount = Number(subscription.next_price);
    }

    // 4. Gera codigo unico da fatura
    const invoiceCode = generateUniqueCode('FAT');

    // 5. Gera a cobranca via gateway PushinPay
    let pushinPayResult = null;
    try {
        pushinPayResult = await createCashInPix({
            amount: invoiceAmount,
            invoiceCode,
            description: `${subscription.plan_title} (${subscription.client_name})`
        });
    } catch (gatewayError) {
        console.warn('Aviso: Gateway PushinPay retornou erro na emissao, usando geracao de contingencia:', gatewayError.message);
        // Em caso de falha de conexao com a gateway, gera fatura pendente para nao travar a operacao
        pushinPayResult = {
            id: 'err_fallback_' + Date.now().toString(36),
            qr_code: null,
            qr_code_base64: null,
            status: 'pending'
        };
    }

    // 6. Insere a fatura no banco de dados
    const invoicePayload = {
        subscription_id: subscription.id,
        invoice_code: invoiceCode,
        amount: invoiceAmount,
        due_date: dueDate,
        status: 'pendente',
        pushinpay_id: pushinPayResult?.id || null,
        pix_qr_code: pushinPayResult?.qr_code || null,
        pix_qr_code_base64: pushinPayResult?.qr_code_base64 || null,
        notes: options.notes ? options.notes.trim() : null
    };

    const { data: createdInvoice, error: invoiceError } = await supabase
        .from('maintenance_invoices')
        .insert([invoicePayload])
        .select(`
            *,
            subscription:maintenance_subscriptions (
                id,
                subscription_code,
                client_name,
                client_document,
                client_email,
                client_phone,
                plan_title
            )
        `)
        .single();

    if (invoiceError) {
        console.error('Erro ao salvar fatura gerada:', invoiceError);
        throw invoiceError;
    }

    return createdInvoice;
};

/**
 * Confirma o pagamento manual de uma fatura (ex: transferencia, PIX direto ou dinheiro).
 * Atualiza a fatura para 'pago', registra a data, avanca o proximo vencimento da assinatura
 * em 1 mes e aplica reajuste de preco pendente caso agendado.
 *
 * @param {string} invoiceId ID da fatura
 * @param {Object} [options]
 * @param {string} [options.paidAt] Data/hora do pagamento (ISO)
 * @param {string} [options.notes] Observacoes complementares
 * @returns {Promise<Object>} Objeto com fatura e assinatura atualizadas
 */
export const confirmManualPayment = async (invoiceId, options = {}) => {
    if (!invoiceId) throw new Error('ID da fatura nao informado.');

    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) throw new Error(`Fatura nao encontrada: ${invoiceId}`);

    const subscription = invoice.subscription;
    const paymentTimestamp = options.paidAt || new Date().toISOString();

    // 1. Atualiza a fatura para pago
    const invoiceUpdatePayload = {
        status: 'pago',
        paid_at: paymentTimestamp,
        updated_at: new Date().toISOString()
    };

    if (options.notes) {
        invoiceUpdatePayload.notes = invoice.notes
            ? `${invoice.notes}\n[Pagamento Manual]: ${options.notes}`
            : `[Pagamento Manual]: ${options.notes}`;
    }

    const { data: updatedInvoice, error: invoiceError } = await supabase
        .from('maintenance_invoices')
        .update(invoiceUpdatePayload)
        .eq('id', invoiceId)
        .select()
        .single();

    if (invoiceError) {
        console.error('Erro ao liquidar fatura:', invoiceError);
        throw invoiceError;
    }

    // 2. Se houver assinatura vinculada, avanca o ciclo
    let updatedSubscription = null;
    if (subscription?.id) {
        // Recalcula o proximo vencimento somando 1 mes a partir do vencimento da fatura
        const nextDueDate = calculateNextDueDate(subscription.billing_day, invoice.due_date);

        const subUpdatePayload = {
            last_payment_date: paymentTimestamp,
            next_due_date: nextDueDate,
            updated_at: new Date().toISOString()
        };

        // Se a assinatura estava suspensa ou com atraso, restaura para ativo
        if (subscription.status !== 'ativo') {
            subUpdatePayload.status = 'ativo';
        }

        // Verifica se havia novo preco programado para vigorar
        if (
            subscription.next_price &&
            subscription.next_price_effective_date &&
            nextDueDate >= subscription.next_price_effective_date
        ) {
            subUpdatePayload.current_price = Number(subscription.next_price);
            subUpdatePayload.next_price = null;
            subUpdatePayload.next_price_effective_date = null;
        }

        const { data: subData, error: subError } = await supabase
            .from('maintenance_subscriptions')
            .update(subUpdatePayload)
            .eq('id', subscription.id)
            .select()
            .single();

        if (subError) {
            console.error('Erro ao atualizar ciclo da assinatura:', subError);
        } else {
            updatedSubscription = subData;
        }
    }

    return {
        invoice: updatedInvoice,
        subscription: updatedSubscription || subscription
    };
};

/**
 * Desfaz a confirmacao manual de pagamento de uma fatura (Estorno / Reabertura).
 * Retorna a fatura para o status 'pendente', limpa o 'paid_at', restaura a data de proximo
 * vencimento da assinatura para a data da fatura reaberta e recalcula o ultimo pagamento.
 *
 * @param {string} invoiceId ID da fatura a ter a baixa desfeita
 * @param {Object} [options]
 * @param {string} [options.reason] Motivo do estorno / cancelamento da baixa
 * @returns {Promise<Object>} Objeto com a fatura reaberta e a assinatura atualizada
 */
export const undoManualPayment = async (invoiceId, options = {}) => {
    if (!invoiceId) throw new Error('ID da fatura nao informado.');

    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) throw new Error(`Fatura nao encontrada: ${invoiceId}`);

    if (invoice.status !== 'pago') {
        throw new Error('Apenas faturas pagas ou baixadas podem ter o pagamento desfeito.');
    }

    const subscription = invoice.subscription;

    // 1. Atualiza a fatura de volta para 'pendente' e remove a data de pagamento
    const invoiceUpdatePayload = {
        status: 'pendente',
        paid_at: null,
        updated_at: new Date().toISOString()
    };

    if (options.reason) {
        invoiceUpdatePayload.notes = invoice.notes
            ? `${invoice.notes}\n[Baixa Desfeita]: ${options.reason}`
            : `[Baixa Desfeita]: ${options.reason}`;
    }

    const { data: updatedInvoice, error: invoiceError } = await supabase
        .from('maintenance_invoices')
        .update(invoiceUpdatePayload)
        .eq('id', invoiceId)
        .select()
        .single();

    if (invoiceError) {
        console.error('Erro ao estornar fatura:', invoiceError);
        throw invoiceError;
    }

    // 2. Se houver assinatura vinculada, restaura a data de vencimento e ultimo pagamento
    let updatedSubscription = null;
    if (subscription?.id) {
        // Busca se ainda ha outras faturas pagas anteriores para manter o last_payment_date consistente
        const { data: otherPaidInvoices } = await supabase
            .from('maintenance_invoices')
            .select('paid_at')
            .eq('subscription_id', subscription.id)
            .eq('status', 'pago')
            .neq('id', invoiceId)
            .order('paid_at', { ascending: false })
            .limit(1);

        const previousLastPaymentDate = otherPaidInvoices && otherPaidInvoices.length > 0
            ? otherPaidInvoices[0].paid_at
            : null;

        const subUpdatePayload = {
            next_due_date: invoice.due_date,
            last_payment_date: previousLastPaymentDate,
            updated_at: new Date().toISOString()
        };

        const { data: subData, error: subError } = await supabase
            .from('maintenance_subscriptions')
            .update(subUpdatePayload)
            .eq('id', subscription.id)
            .select()
            .single();

        if (subError) {
            console.error('Erro ao reverter ciclo da assinatura:', subError);
        } else {
            updatedSubscription = subData;
        }
    }

    return {
        invoice: updatedInvoice,
        subscription: updatedSubscription || subscription
    };
};

/* ==========================================================================
   4. PORTAL DO CLIENTE E CONSULTA PUBLICA (SEM SENHA)
   ========================================================================== */

/**
 * Consulta os dados consolidados do cliente para exibicao no Portal Publico.
 * Permite busca unificada por CPF/CNPJ (apenas numeros) ou e-mail (case insensitive).
 *
 * @param {string} documentOrEmail Documento (CPF/CNPJ) ou E-mail do cliente
 * @returns {Promise<Object>} Resumo completo de assinaturas, faturas abertas/pagas e chamados
 */
export const fetchClientPortalData = async (documentOrEmail) => {
    if (!documentOrEmail || !documentOrEmail.trim()) {
        throw new Error('Informe o CPF, CNPJ ou E-mail para acessar o portal.');
    }

    const cleanInput = documentOrEmail.trim();
    const isEmail = cleanInput.includes('@');
    const cleanDoc = sanitizeDocument(cleanInput);

    try {
        let subscriptionQuery = supabase
            .from('maintenance_subscriptions')
            .select(`
                *,
                category:maintenance_categories (
                    id,
                    name,
                    color,
                    icon
                )
            `)
            .order('created_at', { ascending: false });

        if (isEmail) {
            subscriptionQuery = subscriptionQuery.ilike('client_email', cleanInput.toLowerCase());
        } else {
            subscriptionQuery = subscriptionQuery.eq('client_document', cleanDoc);
        }

        const { data: subscriptions, error: subError } = await subscriptionQuery;

        if (subError) {
            console.error('Erro ao buscar dados do cliente no portal:', subError);
            throw subError;
        }

        if (!subscriptions || subscriptions.length === 0) {
            return {
                notFound: true,
                client: null,
                subscriptions: [],
                pendingInvoices: [],
                paidInvoices: [],
                supportTickets: []
            };
        }

        // Dados do cliente a partir da assinatura mais recente
        const primarySub = subscriptions[0];
        const clientProfile = {
            name: primarySub.client_name,
            document: primarySub.client_document,
            email: primarySub.client_email,
            phone: primarySub.client_phone,
            company: primarySub.client_company
        };

        const subscriptionIds = subscriptions.map((s) => s.id);

        // Busca todas as faturas das assinaturas localizadas
        const { data: invoices, error: invError } = await supabase
            .from('maintenance_invoices')
            .select('*')
            .in('subscription_id', subscriptionIds)
            .order('due_date', { ascending: false });

        if (invError) {
            console.warn('Aviso ao buscar faturas no portal:', invError.message);
        }

        const allInvoices = invoices || [];
        const pendingInvoices = allInvoices.filter((inv) => inv.status !== 'pago' && inv.status !== 'cancelado');
        const paidInvoices = allInvoices.filter((inv) => inv.status === 'pago');

        // Busca chamados de suporte vinculados ao documento ou as assinaturas
        let ticketQuery = supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (clientProfile.document) {
            ticketQuery = ticketQuery.or(`client_document.eq.${clientProfile.document},client_email.ilike.${clientProfile.email}`);
        } else {
            ticketQuery = ticketQuery.ilike('client_email', clientProfile.email);
        }

        const { data: tickets, error: ticketError } = await ticketQuery;
        if (ticketError) {
            console.warn('Aviso ao buscar chamados no portal:', ticketError.message);
        }

        return {
            notFound: false,
            client: clientProfile,
            subscriptions,
            pendingInvoices,
            paidInvoices,
            supportTickets: tickets || []
        };
    } catch (err) {
        console.error('Falha geral no servico fetchClientPortalData:', err);
        throw err;
    }
};

/**
 * Registra a abertura de um chamado de suporte a partir do Portal do Cliente.
 * Gera codigo unico com prefixo TICK (ex: TICK-2026-X8P1).
 *
 * @param {Object} ticketData
 * @param {string} [ticketData.subscriptionId] ID opcional da assinatura relacionada
 * @param {string} ticketData.clientName Nome do cliente
 * @param {string} ticketData.clientEmail E-mail de contato
 * @param {string} [ticketData.clientDocument] CPF ou CNPJ
 * @param {string} ticketData.subject Assunto do chamado
 * @param {string} ticketData.message Mensagem descritiva da solicitacao
 * @param {string} [ticketData.priority] Prioridade (baixa, normal, alta, urgente)
 * @returns {Promise<Object>} Chamado cadastrado
 */
export const createClientTicket = async ({
    subscriptionId = null,
    clientName,
    clientEmail,
    clientDocument = '',
    subject,
    message,
    priority = 'normal'
}) => {
    if (!clientName || !clientName.trim()) {
        throw new Error('Nome do solicitante e obrigatorio.');
    }
    if (!clientEmail || !clientEmail.trim()) {
        throw new Error('E-mail do solicitante e obrigatorio.');
    }
    if (!subject || !subject.trim()) {
        throw new Error('Assunto do chamado e obrigatorio.');
    }
    if (!message || !message.trim()) {
        throw new Error('Descricao da solicitacao e obrigatoria.');
    }

    const ticketCode = generateUniqueCode('TICK');
    const cleanDoc = clientDocument ? sanitizeDocument(clientDocument) : null;

    const payload = {
        ticket_code: ticketCode,
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        client_document: cleanDoc,
        subscription_id: subscriptionId || null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'aberto',
        priority: priority || 'normal'
    };

    const { data, error } = await supabase
        .from('support_tickets')
        .insert([payload])
        .select()
        .single();

    if (error) {
        console.error('Erro ao abrir chamado de suporte:', error);
        throw error;
    }

    return data;
};

/**
 * Atualiza dados cadastrais do cliente (CPF/CNPJ, WhatsApp, Nome, Empresa) em suas assinaturas.
 * Permite ao cliente completar o cadastro sem senha ao entrar pela primeira vez via e-mail.
 *
 * @param {string} email E-mail do cliente
 * @param {Object} profileData Dados complementares
 * @returns {Promise<Array>} Registros atualizados
 */
export const updateClientProfile = async (email, profileData = {}) => {
    if (!email || !email.trim()) {
        throw new Error('E-mail do cliente e obrigatorio.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const updatePayload = {
        updated_at: new Date().toISOString()
    };

    if (profileData.document !== undefined) {
        updatePayload.client_document = profileData.document ? sanitizeDocument(profileData.document) : null;
    }
    if (profileData.phone !== undefined) {
        updatePayload.client_phone = profileData.phone ? sanitizePhone(profileData.phone) : null;
    }
    if (profileData.name && profileData.name.trim()) {
        updatePayload.client_name = profileData.name.trim();
    }
    if (profileData.company !== undefined) {
        updatePayload.client_company = profileData.company ? profileData.company.trim() : null;
    }

    const { data, error } = await supabase
        .from('maintenance_subscriptions')
        .update(updatePayload)
        .ilike('client_email', cleanEmail)
        .select();

    if (error) {
        console.error('Erro ao atualizar cadastro do cliente:', error);
        throw error;
    }

    return data;
};

