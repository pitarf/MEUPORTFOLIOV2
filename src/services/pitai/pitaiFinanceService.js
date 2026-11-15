/**
 * PIT.AI — Serviço de Integração Financeira Grana+ (Finanças Fácil)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gerencia receitas, despesas, cartões de crédito e transferências
 * através da API REST do sistema financeiro Grana+ do Rafael Pita.
 */

// Mapeamento Oficial de Contas Bancárias
export const FINANCE_ACCOUNTS = {
  PJ: { id: 'cmpaky0ls000004jite17z6g0', name: 'Conta PJ', desc: 'Gastos e receitas empresariais' },
  PF: { id: 'cmpakxo41000004l8rnxhbwwt', name: 'Conta PF', desc: 'Gastos pessoais rotineiros' },
  CAIXINHA_INTER: { id: 'cmqfnghwt000104laa4u1mu28', name: 'Caixinha Inter', desc: 'Reserva e poupança' },
  DOLAR: { id: 'cmqssf8fz000005jpalk7ux9i', name: 'Conta Dólar', desc: 'Investimentos internacionais' }
};

// Mapeamento Oficial de Cartões de Crédito
export const FINANCE_CREDIT_CARDS = {
  PAO_DE_ACUCAR: { id: 'cmpal3z7c000104jlhlaadrrt', name: 'Pão de Açúcar - Itaú' },
  INTER: { id: 'cmpal4l15000204jldf8c835r', name: 'Inter' },
  CASAL: { id: 'cmpal9nu0000004l5jao5qcj7', name: 'Casal - Itaú Millena' },
  NUBANK_MAE: { id: 'cmpocb7ly000004k1os0en6fx', name: 'Nubank - Mãe' },
  MERCADO_LIVRE: { id: 'cmseskami000304l4z4cugewy', name: 'Mercado Livre' },
  RIACHUELO: { id: 'cmsesqw70000404l1u40xiemz', name: 'Riachuelo' },
  SANTANDER: { id: 'cmpal8f46000304jli5gi65z6', name: 'Santander' }
};

// Mapeamento Oficial de Categorias
export const FINANCE_CATEGORIES = {
  ALIMENTACAO: { id: 'cmpos8i81000004l1jgdjvzla', name: 'Alimentação', icon: 'Utensils' },
  TRANSPORTE: { id: 'cmposa1dc000104jvf9f918wj', name: 'Transporte', icon: 'Car' },
  MORADIA: { id: 'cmshf23w40003bsc6vcrnx9xq', name: 'Moradia / Casa', icon: 'Home' },
  SAUDE: { id: 'cmshf22sb0000bsc69yyldfi5', name: 'Saúde & Autocuidado', icon: 'HeartPulse' },
  LAZER: { id: 'cmshf239d0001bsc6j19wj18i', name: 'Lazer & Assinaturas', icon: 'Tv' },
  COMPRAS: { id: 'cmshf24mr0005bsc6e5f89vwe', name: 'Compras & Equipamentos', icon: 'ShoppingBag' },
  PAGAMENTOS: { id: 'cmshf24d50004bsc61z3y9qab', name: 'Pagamentos & Dívidas', icon: 'CreditCard' },
  PJ_CUSTOS: { id: 'cmq5nzo68000304jo8l45yy4g', name: 'Custos PJ / Servidores', icon: 'Building2' },
  SALARIO: { id: 'cmshf255y0007bsc69p3sb5j1', name: 'Salário / CLT', icon: 'BadgeDollarSign' },
  SERVICOS_PJ: { id: 'cmshf25ee0008bsc675t589r7', name: 'Serviços PJ / Faturamento', icon: 'Briefcase' }
};

const DEFAULT_API_KEY = 'ff_live_dd4eba5d2acc9956f76902aa328880f0bb3d121a1accc449';
const STORAGE_KEY_API_URL = 'pitai_financas_api_url';
const STORAGE_KEY_API_KEY = 'pitai_financas_api_key';

class PitAiFinanceService {
  constructor() {
    this.customBaseUrl = null;
    this.customApiKey = null;
  }

  getBaseUrl() {
    if (this.customBaseUrl) return this.customBaseUrl;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_API_URL);
      if (stored) return stored;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FINANCAS_API_URL) {
      return import.meta.env.VITE_FINANCAS_API_URL;
    }
    return 'http://localhost:3000';
  }

  setBaseUrl(url) {
    this.customBaseUrl = url;
    if (typeof window !== 'undefined') {
      if (url) localStorage.setItem(STORAGE_KEY_API_URL, url);
      else localStorage.removeItem(STORAGE_KEY_API_URL);
    }
  }

  getApiKey() {
    if (this.customApiKey) return this.customApiKey;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_API_KEY);
      if (stored) return stored;
    }
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FINANCAS_API_KEY) {
      return import.meta.env.VITE_FINANCAS_API_KEY;
    }
    return DEFAULT_API_KEY;
  }

  setApiKey(key) {
    this.customApiKey = key;
    if (typeof window !== 'undefined') {
      if (key) localStorage.setItem(STORAGE_KEY_API_KEY, key);
      else localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  }

  getHeaders() {
    return {
      'x-api-key': this.getApiKey(),
      'Content-Type': 'application/json'
    };
  }

  /**
   * Registra uma Despesa Bancária / Pix / Cartão
   */
  async createExpense({ description, amount, accountId, creditCardId, categoryId, date }) {
    const isCreditCard = Boolean(creditCardId);
    const resolvedAccountId = isCreditCard ? undefined : (accountId || FINANCE_ACCOUNTS.PF.id);
    const resolvedCategory = categoryId || FINANCE_CATEGORIES.ALIMENTACAO.id;
    const finalDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const payload = {
      description: description || 'Despesa Lançada via PIT.AI',
      amount: Number(amount),
      type: 'EXPENSE',
      date: finalDate,
      categoryId: resolvedCategory,
      status: !isCreditCard // true para débito/pix, false para cartão (pendente na fatura)
    };

    if (isCreditCard) {
      payload.creditCardId = creditCardId;
    } else {
      payload.accountId = resolvedAccountId;
    }

    return this.postTransaction(payload);
  }

  /**
   * Registra uma Receita
   */
  async createIncome({ description, amount, accountId, categoryId, date }) {
    const resolvedAccountId = accountId || FINANCE_ACCOUNTS.PJ.id;
    const resolvedCategory = categoryId || FINANCE_CATEGORIES.SERVICOS_PJ.id;
    const finalDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const payload = {
      description: description || 'Receita Lançada via PIT.AI',
      amount: Number(amount),
      type: 'INCOME',
      date: finalDate,
      accountId: resolvedAccountId,
      categoryId: resolvedCategory,
      status: true
    };

    return this.postTransaction(payload);
  }

  /**
   * Registra uma Transferência entre Contas
   */
  async createTransfer({ description, amount, sourceAccountId, targetAccountId, date }) {
    const fromAccount = sourceAccountId || FINANCE_ACCOUNTS.PF.id;
    const toAccount = targetAccountId || FINANCE_ACCOUNTS.CAIXINHA_INTER.id;
    const finalDate = date ? new Date(date).toISOString() : new Date().toISOString();

    const payload = {
      description: description || 'Transferência via PIT.AI',
      amount: Number(amount),
      type: 'TRANSFER',
      date: finalDate,
      accountId: fromAccount,
      targetAccountId: toAccount,
      status: true
    };

    return this.postTransaction(payload);
  }

  /**
   * Envia a requisição de transação para a API Grana+
   */
  async postTransaction(payload) {
    const url = `${this.getBaseUrl()}/api/transactions`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro API Grana+ (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        offline: false
      };
    } catch (err) {
      console.warn('[PIT.AI Finance] Falha na conexão com API Grana+:', err.message);
      // Salva localmente como pendente de sincronização para resguardar o dado
      const localId = `local_tx_${Date.now()}`;
      const localTx = { ...payload, id: localId, createdAt: new Date().toISOString(), pendingSync: true };
      this.saveLocalTransaction(localTx);

      return {
        success: true,
        data: localTx,
        offline: true,
        message: 'Registrado no buffer local do PIT.AI (sincronizará quando o Grana+ estiver online).'
      };
    }
  }

  /**
   * Lista transações recentes
   */
  async listTransactions({ search, type, limit = 5, startDate, endDate } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    if (limit) params.append('limit', String(limit));
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${this.getBaseUrl()}/api/transactions?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      return data.data || data || [];
    } catch (err) {
      console.warn('[PIT.AI Finance] Falha ao consultar transações na API:', err.message);
      return this.getLocalTransactions().slice(0, limit);
    }
  }

  /**
   * Exclui transação
   */
  async deleteTransaction(id) {
    const url = `${this.getBaseUrl()}/api/transactions/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  saveLocalTransaction(tx) {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getLocalTransactions();
      list.unshift(tx);
      localStorage.setItem('pitai_local_transactions', JSON.stringify(list.slice(0, 50)));
    } catch {}
  }

  getLocalTransactions() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('pitai_local_transactions');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Parser inteligente de comandos financeiros em linguagem natural
   * @param {string} text - Frase dita ou digitada
   * @returns {Object|null}
   */
  parseFinanceIntent(text) {
    const lower = text.toLowerCase().trim();

    // 1. Detecção de Valor Monetário
    // Ex: "48 reais", "R$ 48,00", "48.50", "1500", "250 contos"
    const valueMatch = lower.match(/(?:r\$\s*|de\s*)?(\d+(?:[.,]\d{1,2})?)\s*(?:reais|real|conto|contos|pila)?/i);
    let amount = null;
    if (valueMatch) {
      amount = parseFloat(valueMatch[1].replace(',', '.'));
    }

    if (!amount && !lower.includes('quanto gastei') && !lower.includes('listar gastos') && !lower.includes('apagar')) {
      return null;
    }

    // 2. Detecção de Tipo (Despesa, Receita, Transferência, Consulta, Exclusão)
    let type = 'EXPENSE';
    if (lower.startsWith('recebi') || lower.startsWith('ganhei') || lower.includes('caiu o salário') || lower.includes('faturamento') || lower.includes('receita')) {
      type = 'INCOME';
    } else if (lower.startsWith('transferi') || lower.startsWith('transfere') || lower.includes('guardar na caixinha') || lower.includes('reserva')) {
      type = 'TRANSFER';
    } else if (lower.includes('quanto gastei') || lower.includes('extrato') || lower.includes('minhas transações') || lower.includes('últimos gastos')) {
      type = 'QUERY';
    } else if (lower.startsWith('apaga') || lower.startsWith('excluir') || lower.startsWith('deleta')) {
      type = 'DELETE';
    }

    // 3. Detecção de Cartão de Crédito
    let creditCardId = null;
    let cardName = null;
    if (lower.includes('pão de açucar') || lower.includes('pão de açúcar') || lower.includes('cartão itaú') || lower.includes('itau')) {
      creditCardId = FINANCE_CREDIT_CARDS.PAO_DE_ACUCAR.id;
      cardName = FINANCE_CREDIT_CARDS.PAO_DE_ACUCAR.name;
    } else if (lower.includes('cartão inter') || (lower.includes('inter') && lower.includes('crédito'))) {
      creditCardId = FINANCE_CREDIT_CARDS.INTER.id;
      cardName = FINANCE_CREDIT_CARDS.INTER.name;
    } else if (lower.includes('millena') || lower.includes('casal')) {
      creditCardId = FINANCE_CREDIT_CARDS.CASAL.id;
      cardName = FINANCE_CREDIT_CARDS.CASAL.name;
    } else if (lower.includes('nubank') || lower.includes('mãe')) {
      creditCardId = FINANCE_CREDIT_CARDS.NUBANK_MAE.id;
      cardName = FINANCE_CREDIT_CARDS.NUBANK_MAE.name;
    } else if (lower.includes('mercado livre')) {
      creditCardId = FINANCE_CREDIT_CARDS.MERCADO_LIVRE.id;
      cardName = FINANCE_CREDIT_CARDS.MERCADO_LIVRE.name;
    } else if (lower.includes('riachuelo')) {
      creditCardId = FINANCE_CREDIT_CARDS.RIACHUELO.id;
      cardName = FINANCE_CREDIT_CARDS.RIACHUELO.name;
    } else if (lower.includes('santander')) {
      creditCardId = FINANCE_CREDIT_CARDS.SANTANDER.id;
      cardName = FINANCE_CREDIT_CARDS.SANTANDER.name;
    }

    // 4. Detecção de Conta Bancária (PF vs PJ vs Caixinha vs Dólar)
    let accountId = FINANCE_ACCOUNTS.PF.id;
    let accountName = FINANCE_ACCOUNTS.PF.name;
    let sourceAccountId = FINANCE_ACCOUNTS.PF.id;
    let targetAccountId = FINANCE_ACCOUNTS.CAIXINHA_INTER.id;

    if (type === 'TRANSFER') {
      if (lower.includes('pj') && lower.includes('pf')) {
        sourceAccountId = FINANCE_ACCOUNTS.PJ.id;
        targetAccountId = FINANCE_ACCOUNTS.PF.id;
      } else if (lower.includes('caixinha') || lower.includes('reserva') || lower.includes('poupança')) {
        sourceAccountId = FINANCE_ACCOUNTS.PF.id;
        targetAccountId = FINANCE_ACCOUNTS.CAIXINHA_INTER.id;
      } else if (lower.includes('dolar') || lower.includes('dólar')) {
        sourceAccountId = FINANCE_ACCOUNTS.PF.id;
        targetAccountId = FINANCE_ACCOUNTS.DOLAR.id;
      }
      accountId = sourceAccountId;
    } else if (lower.includes('pj') || lower.includes('empresa') || lower.includes('corporativo') || lower.includes('faturamento') || lower.includes('servidor')) {
      accountId = FINANCE_ACCOUNTS.PJ.id;
      accountName = FINANCE_ACCOUNTS.PJ.name;
    } else if (lower.includes('caixinha') || lower.includes('reserva') || lower.includes('poupança')) {
      accountId = FINANCE_ACCOUNTS.CAIXINHA_INTER.id;
      accountName = FINANCE_ACCOUNTS.CAIXINHA_INTER.name;
    } else if (lower.includes('dolar') || lower.includes('dólar') || lower.includes('internacional')) {
      accountId = FINANCE_ACCOUNTS.DOLAR.id;
      accountName = FINANCE_ACCOUNTS.DOLAR.name;
    }

    // 5. Detecção de Categoria
    let categoryId = FINANCE_CATEGORIES.ALIMENTACAO.id;
    let categoryName = FINANCE_CATEGORIES.ALIMENTACAO.name;

    if (lower.includes('uber') || lower.includes('99') || lower.includes('gasolina') || lower.includes('combustível') || lower.includes('estacionamento') || lower.includes('pedágio')) {
      categoryId = FINANCE_CATEGORIES.TRANSPORTE.id;
      categoryName = FINANCE_CATEGORIES.TRANSPORTE.name;
    } else if (lower.includes('aluguel') || lower.includes('condomínio') || lower.includes('luz') || lower.includes('água') || lower.includes('internet') || lower.includes('gás')) {
      categoryId = FINANCE_CATEGORIES.MORADIA.id;
      categoryName = FINANCE_CATEGORIES.MORADIA.name;
    } else if (lower.includes('farmácia') || lower.includes('remédio') || lower.includes('médico') || lower.includes('dentista') || lower.includes('academia') || lower.includes('saúde')) {
      categoryId = FINANCE_CATEGORIES.SAUDE.id;
      categoryName = FINANCE_CATEGORIES.SAUDE.name;
    } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('cinema') || lower.includes('bar') || lower.includes('cerveja') || lower.includes('balada')) {
      categoryId = FINANCE_CATEGORIES.LAZER.id;
      categoryName = FINANCE_CATEGORIES.LAZER.name;
    } else if (lower.includes('compra') || lower.includes('roupa') || lower.includes('eletrônico') || lower.includes('equipamento') || lower.includes('mouse') || lower.includes('teclado')) {
      categoryId = FINANCE_CATEGORIES.COMPRAS.id;
      categoryName = FINANCE_CATEGORIES.COMPRAS.name;
    } else if (lower.includes('servidor') || lower.includes('vps') || lower.includes('hospedagem') || lower.includes('software pj') || lower.includes('vercel')) {
      categoryId = FINANCE_CATEGORIES.PJ_CUSTOS.id;
      categoryName = FINANCE_CATEGORIES.PJ_CUSTOS.name;
      accountId = FINANCE_ACCOUNTS.PJ.id;
      accountName = FINANCE_ACCOUNTS.PJ.name;
    } else if (lower.includes('salário') || lower.includes('salario')) {
      categoryId = FINANCE_CATEGORIES.SALARIO.id;
      categoryName = FINANCE_CATEGORIES.SALARIO.name;
    } else if (type === 'INCOME') {
      categoryId = FINANCE_CATEGORIES.SERVICOS_PJ.id;
      categoryName = FINANCE_CATEGORIES.SERVICOS_PJ.name;
      accountId = FINANCE_ACCOUNTS.PJ.id;
      accountName = FINANCE_ACCOUNTS.PJ.name;
    }

    // 6. Limpeza da Descrição
    let cleanDesc = text
      .replace(/^(gastei|paguei|comprei|coloquei|foi|despesa|recebi|ganhei|transferi|transfere|lança|anota)\s*/i, '')
      .replace(/(?:r\$\s*|de\s*)?\d+(?:[.,]\d{1,2})?\s*(?:reais|real|conto|contos|pila)?/gi, '')
      .replace(/(?:no|na|pelo|pela|com|em)\s*(?:cartão|conta|crédito|débito|pix)?\s*(?:inter|itaú|itau|pj|pf|nubank|santander|mercado livre|riachuelo|pão de açúcar|pao de acucar|millena|casal)?/gi, '')
      .replace(/^[\s\-–—e\.,]+|[\s\-–—\.,]+$/g, '')
      .trim();

    cleanDesc = cleanDesc.replace(/^(\s*no\s*|\s*na\s*|\s*de\s*|\s*com\s*)+/i, '').trim();
    if (!cleanDesc) cleanDesc = categoryName;
    cleanDesc = cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1);

    return {
      type,
      amount,
      description: cleanDesc,
      accountId,
      accountName,
      sourceAccountId,
      targetAccountId,
      creditCardId,
      cardName,
      categoryId,
      categoryName
    };
  }
}

export const pitaiFinanceService = new PitAiFinanceService();
export default pitaiFinanceService;
