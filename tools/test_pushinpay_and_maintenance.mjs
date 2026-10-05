/**
 * Script de Testes e Validacao dos Servicos:
 * 1. PushinPay (pushinPayService.js)
 * 2. Mensagens de WhatsApp (whatsappMessages.js)
 * 3. Gestao de Manutencao (maintenanceService.js)
 *
 * Executado via Node.js para atestar conformidade e ausencia de travessoes.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import dns from 'dns';

if (dns && typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
}
import { createClient } from '@supabase/supabase-js';

// Carrega .env manualmente para Node.js
if (existsSync('.env')) {
    const envLines = readFileSync('.env', 'utf8').split('\n');
    for (const line of envLines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('//') && trimmed.includes('=')) {
            const [k, ...v] = trimmed.split('=');
            process.env[k.trim()] = v.join('=').trim();
        }
    }
}

// Imports dinamicos dos servicos apos carregar variaveis de ambiente
const {
    normalizeValueInCents,
    createCashInPix,
    validatePushinPayWebhook,
    fetchPushinPaySettings
} = await import('../src/services/pushinPayService.js');

const {
    formatCurrencyBRL,
    formatDateBR,
    sanitizeWhatsAppPhone,
    generateWhatsAppUrl,
    formatWhatsAppPriceChangeMessage,
    formatWhatsAppInvoiceMessage,
    formatWhatsAppTicketMessage
} = await import('../src/utils/whatsappMessages.js');

const {
    generateUniqueCode,
    sanitizeDocument,
    sanitizePhone,
    calculateNextDueDate,
    fetchMaintenanceCategories,
    fetchSubscriptions,
    createSubscription,
    generateInvoiceForSubscription,
    confirmManualPayment,
    fetchClientPortalData,
    createClientTicket,
    deleteSubscription
} = await import('../src/services/maintenanceService.js');

let passedTests = 0;
let totalTests = 0;

const assert = (condition, title) => {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`[PASS] ${title}`);
    } else {
        console.error(`[FAIL] ${title}`);
        throw new Error(`Falha no teste: ${title}`);
    }
};

const assertNoDashes = (text, title) => {
    const hasEmDash = text.includes('\u2014');
    const hasEnDash = text.includes('\u2013');
    assert(!hasEmDash && !hasEnDash, `${title} (Sem travessao: em-dash ou en-dash)`);
};

console.log('======================================================');
console.log('INICIANDO BATERIA DE TESTES : GATEWAY & WHATSAPP & MANUTENCAO');
console.log('======================================================\n');

async function runTests() {
    // -------------------------------------------------------------------------
    // 1. TESTES DO PUSHINPAY SERVICE
    // -------------------------------------------------------------------------
    console.log('--- 1. TESTES PUSHINPAY SERVICE ---');

    // Normalizacao em centavos
    assert(normalizeValueInCents(150.00) === 15000, 'normalizeValueInCents: R$ 150.00 converte para 15000 centavos');
    assert(normalizeValueInCents(299.90) === 29990, 'normalizeValueInCents: R$ 299.90 converte para 29990 centavos');
    assert(normalizeValueInCents('1250,50') === 125050, 'normalizeValueInCents: "1250,50" com virgula converte para 125050');
    assert(normalizeValueInCents('89.00') === 8900, 'normalizeValueInCents: "89.00" string converte para 8900');

    let threwError = false;
    try {
        normalizeValueInCents(0);
    } catch {
        threwError = true;
    }
    assert(threwError, 'normalizeValueInCents: Rejeita valor zero ou negativo');

    // Modo de simulacao e fallback quando nao ha token real
    const simResult = await createCashInPix({
        amount: 250.00,
        invoiceCode: 'FAT-TESTE-001'
    });

    assert(simResult.is_simulation === true, 'createCashInPix: Ativa modo de simulacao seguro na ausencia de token');
    assert(simResult.value === 25000, 'createCashInPix: Retorna valor em centavos correto (25000)');
    assert(simResult.status === 'pending', 'createCashInPix: Status inicial retornado como pending');
    assert(typeof simResult.qr_code === 'string' && simResult.qr_code.length > 20, 'createCashInPix: qr_code payload gerado');
    assert(typeof simResult.qr_code_base64 === 'string' && simResult.qr_code_base64.startsWith('data:image/'), 'createCashInPix: qr_code_base64 gerado com sucesso');

    // Validacao de webhook
    const whValid = validatePushinPayWebhook({
        payload: { id: 'tx_123', status: 'paid', value: 15000, end_to_end_id: 'E123456789' },
        incomingToken: 'segredo123',
        expectedToken: 'segredo123'
    });
    assert(whValid.valid === true && whValid.isPaid === true && whValid.endToEndId === 'E123456789', 'validatePushinPayWebhook: Valida webhook com token autenticado e status pago');

    const whInvalid = validatePushinPayWebhook({
        payload: { id: 'tx_123', status: 'paid' },
        incomingToken: 'token_errado',
        expectedToken: 'segredo_correto'
    });
    assert(whInvalid.valid === false, 'validatePushinPayWebhook: Rejeita requisicao com token divergente');

    // -------------------------------------------------------------------------
    // 2. TESTES DOS FORMATADORES DE WHATSAPP
    // -------------------------------------------------------------------------
    console.log('\n--- 2. TESTES FORMATADORES DE WHATSAPP ---');

    // Sanitizacao de telefone
    assert(sanitizeWhatsAppPhone('(11) 98765-4321') === '5511987654321', 'sanitizeWhatsAppPhone: Formata telefone de 11 digitos com DDI 55');
    assert(sanitizeWhatsAppPhone('5511987654321') === '5511987654321', 'sanitizeWhatsAppPhone: Preserva telefone que ja contem 55');

    // Gerador de URL
    const waUrl = generateWhatsAppUrl('(19) 99116-4333', 'Ola teste');
    assert(waUrl.startsWith('https://wa.me/5519991164333?text=Ola%20teste'), 'generateWhatsAppUrl: Gera URL wa.me com DDI sanitizado e encoding');

    // Formatacao de precos e datas
    assert(formatCurrencyBRL(150) === 'R$\u00a0150,00' || formatCurrencyBRL(150) === 'R$ 150,00', 'formatCurrencyBRL: Formata valor para BRL');
    assert(formatDateBR('2026-10-15') === '15/10/2026', 'formatDateBR: Formata data ISO para DD/MM/AAAA');

    // Mensagem de Reajuste
    const priceChangeMsg = formatWhatsAppPriceChangeMessage({
        clientName: 'Dra. Roseli Hanna',
        planTitle: 'Manutencao Web & Hospedagem',
        oldPrice: 150.00,
        newPrice: 200.00,
        effectiveDate: '2026-11-10',
        billingDay: 10
    });
    assertNoDashes(priceChangeMsg, 'formatWhatsAppPriceChangeMessage');
    assert(priceChangeMsg.includes('Dra. Roseli Hanna'), 'formatWhatsAppPriceChangeMessage: Contem nome do cliente');
    assert(priceChangeMsg.includes('200,00'), 'formatWhatsAppPriceChangeMessage: Contem novo valor');

    // Mensagem de Fatura
    const invoiceMsg = formatWhatsAppInvoiceMessage({
        clientName: 'Dr. Jorge Santos',
        planTitle: 'Suporte Tecnico & Infraestrutura',
        amount: 250.00,
        dueDate: '2026-10-10',
        pixCode: '00020126580014br.gov.bcb.pix...',
        invoiceCode: 'FAT-2026-001'
    });
    assertNoDashes(invoiceMsg, 'formatWhatsAppInvoiceMessage');
    assert(invoiceMsg.includes('FAT-2026-001'), 'formatWhatsAppInvoiceMessage: Contem codigo da fatura');
    assert(invoiceMsg.includes('Pix Copia e Cola:'), 'formatWhatsAppInvoiceMessage: Contem orientacao Pix Copia e Cola');

    // Mensagem de Ticket
    const ticketMsg = formatWhatsAppTicketMessage({
        clientName: 'Paula Souza',
        ticketCode: 'TICK-2026-001',
        subject: 'Atualizacao de Banner Promocional',
        priority: 'alta'
    });
    assertNoDashes(ticketMsg, 'formatWhatsAppTicketMessage');

    // -------------------------------------------------------------------------
    // 3. TESTES DO SERVICO DE MANUTENCAO (maintenanceService.js)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. TESTES MAINTENANCE SERVICE ---');

    // Gerador de codigos
    const subCode = generateUniqueCode('SUB');
    const fatCode = generateUniqueCode('FAT');
    const tickCode = generateUniqueCode('TICK');
    assert(subCode.startsWith('SUB-2026-'), 'generateUniqueCode: Gera codigo SUB padronizado');
    assert(fatCode.startsWith('FAT-2026-'), 'generateUniqueCode: Gera codigo FAT padronizado');
    assert(tickCode.startsWith('TICK-2026-'), 'generateUniqueCode: Gera codigo TICK padronizado');

    // Sanitizadores
    assert(sanitizeDocument('123.456.789-00') === '12345678900', 'sanitizeDocument: Remove pontuacao de CPF');
    assert(sanitizeDocument('12.345.678/0001-90') === '12345678000190', 'sanitizeDocument: Remove pontuacao de CNPJ');
    assert(sanitizePhone('(11) 98765-4321') === '11987654321', 'sanitizePhone: Mantem apenas numeros');

    // Calculo de vencimento
    const nextDue = calculateNextDueDate(10, '2026-10-10');
    assert(nextDue === '2026-11-10', 'calculateNextDueDate: Avanca exatamente 1 mes no dia de faturamento (10/10 -> 10/11)');

    // -------------------------------------------------------------------------
    // 4. TESTES DE INTEGRACAO COM BANCO SUPABASE
    // -------------------------------------------------------------------------
    console.log('\n--- 4. TESTES DE INTEGRACAO SUPABASE ---');

    try {
        const categories = await fetchMaintenanceCategories();
        assert(Array.isArray(categories) && categories.length > 0, `fetchMaintenanceCategories: Retornou ${categories.length} categorias`);

        // Teste de criacao de assinatura temporaria de homologacao
        const testDoc = '99988877700';
        const testEmail = `teste_auto_${Date.now()}@teste.com`;

        const newSub = await createSubscription({
            client_name: 'Cliente Teste Automatizado',
            client_document: testDoc,
            client_email: testEmail,
            client_phone: '11999998888',
            plan_title: 'Plano Start Web Homologacao',
            current_price: 180.00,
            next_price: 220.00,
            next_price_effective_date: '2026-11-10',
            billing_day: 15,
            notes: 'Criado pelo teste automatizado'
        });

        assert(newSub && newSub.id, 'createSubscription: Cria assinatura no Supabase com sucesso');
        assert(newSub.client_document === testDoc, 'createSubscription: Salva documento higienizado');
        assert(newSub.current_price === 180.00, 'createSubscription: Salva current_price correto');

        // Gera fatura para a assinatura criada
        const invoice = await generateInvoiceForSubscription(newSub.id, {
            dueDate: '2026-10-15'
        });
        assert(invoice && invoice.id, 'generateInvoiceForSubscription: Gera fatura com sucesso');
        assert(invoice.amount === 180.00, 'generateInvoiceForSubscription: Valor da fatura confere com current_price');
        assert(invoice.status === 'pendente', 'generateInvoiceForSubscription: Fatura inicia com status pendente');

        // Confirma pagamento manual
        const paymentResult = await confirmManualPayment(invoice.id, {
            notes: 'Comprovante PIX transferido via WhatsApp'
        });
        assert(paymentResult.invoice.status === 'pago', 'confirmManualPayment: Marca fatura como pago');
        assert(paymentResult.subscription.last_payment_date !== null, 'confirmManualPayment: Atualiza last_payment_date da assinatura');

        // Consulta pelo portal do cliente (sem senha)
        const portalData = await fetchClientPortalData(testDoc);
        assert(portalData.notFound === false, 'fetchClientPortalData: Encontra cliente por CPF/CNPJ');
        assert(portalData.subscriptions.length >= 1, 'fetchClientPortalData: Retorna assinaturas vinculadas');
        assert(portalData.paidInvoices.length >= 1, 'fetchClientPortalData: Contem fatura paga no historico');

        // Abertura de chamado de suporte pelo portal
        const ticket = await createClientTicket({
            subscriptionId: newSub.id,
            clientName: 'Cliente Teste Automatizado',
            clientEmail: testEmail,
            clientDocument: testDoc,
            subject: 'Duvida sobre Certificado SSL',
            message: 'Solicito verificacao da renovacao do SSL no portal.',
            priority: 'normal'
        });
        assert(ticket && ticket.ticket_code.startsWith('TICK-2026-'), 'createClientTicket: Abre chamado com codigo TICK gerado');

        // Limpeza dos dados de teste
        await deleteSubscription(newSub.id);
        console.log('[CLEANUP] Assinatura e dados de teste removidos com sucesso.');

    } catch (dbErr) {
        console.error('Aviso no teste de banco (verificar credenciais/tabelas):', dbErr.message);
        throw dbErr;
    }

    console.log('\n======================================================');
    console.log(`BATERIA CONCLUIDA COM SUCESSO: ${passedTests}/${totalTests} TESTES APROVADOS!`);
    console.log('======================================================');
}

runTests().catch((err) => {
    console.error('\nFALHA NA EXECUCAO DOS TESTES:', err);
    process.exit(1);
});
