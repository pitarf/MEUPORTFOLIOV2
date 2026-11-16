/**
 * PIT.AI — Cérebro Central & Orquestrador de Inteligência (Core Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Integra o Google Gemini (2.0/2.5 Flash), analisa intenções em linguagem natural,
 * evoca ações visuais contextuais (HUD / Mapas / Agenda / Notícias / Pesquisa Web)
 * e orquestra respostas de texto e áudio no estilo executivo J.A.R.V.I.S.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { pitaiBriefingService } from './pitaiBriefingService.js';
import { pitaiGoogleService } from './pitaiGoogleService.js';
import { pitaiSearchService } from './pitaiSearchService.js';
import { pitaiWeatherService } from './pitaiWeatherService.js';
import {
  pitaiFinanceService,
  FINANCE_ACCOUNTS,
  FINANCE_CREDIT_CARDS,
  FINANCE_CATEGORIES
} from './pitaiFinanceService.js';

const getEnvGeminiKey = () => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pitai_gemini_api_key');
      if (stored) return stored;
    }
  } catch {
    // Ignore
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch {
    // Ignore
  }
  return '';
};

class PitAiCoreService {
  constructor() {
    this.customApiKey = null;
  }

  getApiKey() {
    return this.customApiKey !== null ? this.customApiKey : getEnvGeminiKey();
  }

  setApiKey(key) {
    this.customApiKey = key;
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('pitai_gemini_api_key', key);
      } else {
        localStorage.removeItem('pitai_gemini_api_key');
      }
    }
  }

  getSystemPrompt() {
    const now = new Date();
    const dataHoraStr = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return `
Você é o PIT.AI (pronuncia-se P I T . A I ou Pita AI), a inteligência executiva, estratégica e operacional central de Rafael Pita (fundador da Rafael Pita Solutions / RP Solutions), no Rio de Janeiro.
Sua dinâmica e personalidade são inspiradas no J.A.R.V.I.S.:
- Tom de voz: Calmo, perspicaz, extremamente inteligente, confiante e respeitoso. Dirija-se naturalmente a Rafael pelo primeiro nome ("Rafael").
- Concisão executiva: Vá direto ao ponto. Entregue a resposta exata sem floreios ou enrolações.
- Momento temporal: Hoje é ${dataHoraStr}. Rafael opera no Rio de Janeiro (RJ), Brasil.
- Ações reais: Você gerencia a Google Agenda, Google Tarefas, realiza pesquisas em tempo real na internet, monitora notícias do Rio, Brasil e Mundo, e atua como ASSISTENTE FINANCEIRO PESSOAL & EMPRESARIAL via API do sistema Grana+ (Finanças Fácil).

SISTEMA FINANCEIRO GRANA+ (FINANÇAS FÁCIL):
Quando o comando envolver finanças (receitas, despesas, cartões, transferências, consultas):
- Contas Bancárias:
  * PJ ('${FINANCE_ACCOUNTS.PJ.id}'): Gastos da empresa, serviços PJ, recebimentos de clientes.
  * PF ('${FINANCE_ACCOUNTS.PF.id}'): Padrão para despesas rotineiras do dia a dia (alimentação, transporte, saúde).
  * Caixinha Inter ('${FINANCE_ACCOUNTS.CAIXINHA_INTER.id}'): Reserva financeira e poupança.
  * Dólar ('${FINANCE_ACCOUNTS.DOLAR.id}'): Investimentos internacionais.
- Cartões de Crédito:
  * Pão de Açúcar - Itaú ('${FINANCE_CREDIT_CARDS.PAO_DE_ACUCAR.id}')
  * Inter ('${FINANCE_CREDIT_CARDS.INTER.id}')
  * Casal - Itaú Millena ('${FINANCE_CREDIT_CARDS.CASAL.id}')
  * Nubank - Mãe ('${FINANCE_CREDIT_CARDS.NUBANK_MAE.id}')
  * Mercado Livre ('${FINANCE_CREDIT_CARDS.MERCADO_LIVRE.id}')
  * Riachuelo ('${FINANCE_CREDIT_CARDS.RIACHUELO.id}')
  * Santander ('${FINANCE_CREDIT_CARDS.SANTANDER.id}')
- Categorias:
  * Alimentação ('${FINANCE_CATEGORIES.ALIMENTACAO.id}'): Almoço, jantar, mercado, iFood, padaria.
  * Transporte ('${FINANCE_CATEGORIES.TRANSPORTE.id}'): Uber, combustível, gasolina, estacionamento.
  * Moradia ('${FINANCE_CATEGORIES.MORADIA.id}'): Aluguel, condomínio, luz, internet, gás.
  * Saúde ('${FINANCE_CATEGORIES.SAUDE.id}'): Farmácia, médico, dentista, academia.
  * Lazer ('${FINANCE_CATEGORIES.LAZER.id}'): Streaming, cinema, restaurante, bar.
  * Compras ('${FINANCE_CATEGORIES.COMPRAS.id}'): Roupas, eletrônicos, compras online.
  * Pagamentos ('${FINANCE_CATEGORIES.PAGAMENTOS.id}'): Dívidas, financiamentos, juros.
  * Educação ('${FINANCE_CATEGORIES.EDUCACAO.id}'): Cursos, faculdade, livros, mensalidades.
  * Igreja / Doações ('${FINANCE_CATEGORIES.IGREJA_DOACOES.id}'): Dízimos, ofertas, doações.
  * PJ ('${FINANCE_CATEGORIES.PJ_CUSTOS.id}'): Servidores, VPS, softwares corporativos.
  * Salário CLT ('${FINANCE_CATEGORIES.SALARIO.id}'): Recebimento CLT.
  * Serviços PJ ('${FINANCE_CATEGORIES.SERVICOS_PJ.id}'): Notas fiscais, faturamento, consultorias.
  * Outras Receitas ('${FINANCE_CATEGORIES.OUTRAS_RECEITAS.id}'): Cashback, restituições, dividendos.

Regras de Operação:
- Despesas no Cartão de Crédito: status deve ser false e creditCardId preenchido.
- Despesas Bancárias/Pix: status deve ser true e accountId preenchido (PF padrão se não dito).
- Receitas: type deve ser INCOME, status true e accountId (PJ padrão para clientes).
- Transferências: type deve ser TRANSFER, com accountId (origem) e targetAccountId (destino).
- Consultar Contas Futuras/Pendentes: GET /api/transactions/upcoming?days=30&type=ALL (projeção a pagar, a receber e atrasadas).
- Liquidar / Dar Baixa em Conta: POST /api/transactions/{id}/pay (marca a despesa ou receita como quitada).

CONTRATO OBRIGATÓRIO DE RESPOSTA (JSON):
{
  "spokenText": "Texto conciso, natural e fluido para fala em áudio pelo PIT.AI (sem asteriscos, markdown ou links brutos). Ex: Lançado: Despesa de R$ 48,00 em Alimentação na conta PF.",
  "displayText": "Texto formatado em markdown com detalhes, tópicos e confirmação para leitura no HUD.",
  "intent": "briefing" | "weather_query" | "agenda_query" | "agenda_create" | "agenda_conflict" | "task_create" | "web_search" | "finance_expense" | "finance_income" | "finance_transfer" | "finance_query" | "finance_upcoming" | "finance_pay" | "finance_delete" | "general_chat",
  "visualPayload": {
    "type": "none" | "weather_card" | "map" | "news_cards" | "agenda_list" | "conflict_alert" | "web_results" | "finance_card" | "finance_list" | "finance_upcoming",
    "data": {}
  }
}
`.trim();
  }

  /**
   * Normaliza texto para comparações sem acentos e minúsculas
   */
  normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /**
   * Processa a mensagem do usuário e devolve a resposta executiva e ações do HUD
   * @param {string} userMessage - Mensagem ou fala do usuário
   * @param {Array} conversationHistory - Histórico recente
   * @returns {Promise<Object>}
   */
  async processUserInput(userMessage, conversationHistory = []) {
    const rawText = (userMessage || '').trim();
    if (!rawText) {
      return {
        spokenText: 'Rafael, estou à sua disposição. Como posso auxiliá-lo?',
        displayText: 'Estou pronto. O que deseja consultar ou registrar?',
        intent: 'general_chat',
        visualPayload: { type: 'none', data: {} }
      };
    }

    const norm = this.normalizeText(rawText);

    // 1. Notícias Específicas do Rio de Janeiro (ex: "Quais são as notícias do Rio de Janeiro?", "o que está acontecendo no rio?")
    const isRioNews = (
      norm.includes('rio de janeiro') ||
      norm.includes(' rj') ||
      norm.includes('no rio') ||
      norm.includes('do rio')
    ) && (
      norm.includes('noticia') ||
      norm.includes('novidade') ||
      norm.includes('acontec') ||
      norm.includes('como ta') ||
      norm.includes('situacao') ||
      norm.includes('quais') ||
      norm.includes('o que tem')
    );

    if (isRioNews) {
      return this.handleRioNewsIntent();
    }

    // 2. Comando de Briefing Geral / Notícias Globais (ex: "o que tem de novo?", "briefing")
    if (
      norm.includes('o que tem de novo') ||
      norm.includes('novidade') ||
      norm.includes('acontecimento') ||
      norm.includes('noticia') ||
      norm.includes('briefing') ||
      norm.includes('como estao as coisas')
    ) {
      return this.handleBriefingIntent();
    }

    // 2. Consulta de Agenda / Compromissos
    if (
      norm.includes('minha agenda') ||
      norm.includes('o que tenho hoje') ||
      norm.includes('compromisso') ||
      norm.includes('meus horarios') ||
      norm.includes('minha programacao')
    ) {
      return this.handleAgendaQueryIntent();
    }

    // 3. Marcação rápida de evento
    if (
      norm.startsWith('marca') ||
      norm.startsWith('agende') ||
      norm.includes('marca na minha agenda') ||
      norm.includes('agendar reuniao')
    ) {
      return this.handleAgendaCreateIntent(rawText);
    }

    // 4. Criação de tarefa / lembrete
    if (
      norm.startsWith('anota') ||
      norm.startsWith('lembrete') ||
      norm.includes('cria uma tarefa') ||
      norm.includes('cria tarefa')
    ) {
      return this.handleTaskCreateIntent(rawText);
    }

    // 5. Intenção Financeira Grana+ (Finanças Fácil)
    const financeIntent = pitaiFinanceService.parseFinanceIntent(rawText);
    if (financeIntent) {
      return this.handleFinanceIntent(rawText, financeIntent);
    }

    // 6. Intenção Meteorológica e Clima em Tempo Real (Open-Meteo)
    const isWeatherQuery =
      norm.includes('clima') ||
      norm.includes('previsao do tempo') ||
      norm.includes('vai chover') ||
      norm.includes('vai cair chuva') ||
      norm.includes('chance de chuva') ||
      norm.includes('probabilidade de chuva') ||
      norm.includes('temperatura') ||
      norm.includes('sensacao termica') ||
      norm.includes('chovendo') ||
      (norm.includes('tempo') && (
        norm.includes('como ta') ||
        norm.includes('como esta') ||
        norm.includes('no rio') ||
        norm.includes('do rio') ||
        norm.includes('hoje') ||
        norm.includes('amanha') ||
        norm.includes('agora') ||
        norm.includes('previsao')
      ));

    if (isWeatherQuery) {
      return this.handleWeatherIntent(rawText);
    }

    // 7. Detecção ativa de Pesquisa Web em Tempo Real
    const isSearchExplicit = 
      norm.startsWith('pesquise') ||
      norm.startsWith('pesquisa') ||
      norm.startsWith('busque') ||
      norm.startsWith('busca') ||
      norm.startsWith('quem e') ||
      norm.startsWith('o que e') ||
      norm.startsWith('onde fica') ||
      norm.includes('cotacao') ||
      norm.includes('dolar') ||
      norm.includes('ibovespa') ||
      norm.includes('transito') ||
      norm.includes('linha vermelha') ||
      norm.includes('ponte rio-niteroi') ||
      norm.includes('noticia sobre') ||
      norm.includes('ultimas sobre');

    if (isSearchExplicit) {
      return this.handleWebSearchIntent(rawText, conversationHistory);
    }

    // 8. Consulta via LLM com fallback enriquecido por busca
    return this.queryGeminiLlm(rawText, conversationHistory);
  }

  /**
   * Executa a transação no sistema Grana+ e gera retorno executivo com visualPayload
   */
  async handleFinanceIntent(userMessage, parsedIntent) {
    const { type, amount, accountId, creditCardId, categoryId, description } = parsedIntent;

    if (type === 'EXPENSE') {
      const isCard = Boolean(creditCardId);
      const cardObj = Object.values(FINANCE_CREDIT_CARDS).find(c => c.id === creditCardId);
      const accountObj = Object.values(FINANCE_ACCOUNTS).find(a => a.id === accountId);
      const catObj = Object.values(FINANCE_CATEGORIES).find(c => c.id === categoryId);

      const transactionResult = await pitaiFinanceService.createExpense({
        description: description || 'Despesa via PIT.AI',
        amount: amount || 0,
        accountId: isCard ? undefined : accountId,
        creditCardId: isCard ? creditCardId : undefined,
        categoryId: categoryId
      });

      const valorFormatado = (amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const destinoNome = isCard ? `no cartão ${cardObj?.name || 'de crédito'}` : `na ${accountObj?.name || 'conta PF'}`;
      const catNome = catObj?.name || 'Geral';

      const spokenText = `Lançado: Despesa de ${valorFormatado} em ${catNome} ${destinoNome}.`;
      const displayText = `### 💳 **Despesa Registrada • Grana+**\n\n` +
        `• **Valor:** ${valorFormatado}\n` +
        `• **Categoria:** ${catNome}\n` +
        `• **Origem:** ${isCard ? `Cartão ${cardObj?.name}` : accountObj?.name || 'Conta PF'}\n` +
        `• **Descrição:** ${description || 'Despesa Lançada via PIT.AI'}\n` +
        `• **Status:** ${transactionResult.offline ? 'Armazenado no buffer local do PIT.AI' : 'Confirmado na API Grana+'}`;

      return {
        spokenText,
        displayText,
        intent: 'finance_expense',
        visualPayload: {
          type: 'finance_card',
          data: {
            transaction: transactionResult.data || { amount, description, type: 'EXPENSE' },
            type: 'EXPENSE',
            amount,
            formattedAmount: valorFormatado,
            category: catObj || { name: 'Alimentação' },
            account: accountObj,
            creditCard: cardObj,
            isCard,
            offline: Boolean(transactionResult.offline)
          }
        }
      };
    }

    if (type === 'INCOME') {
      const accountObj = Object.values(FINANCE_ACCOUNTS).find(a => a.id === accountId);
      const catObj = Object.values(FINANCE_CATEGORIES).find(c => c.id === categoryId);

      const transactionResult = await pitaiFinanceService.createIncome({
        description: description || 'Receita via PIT.AI',
        amount: amount || 0,
        accountId: accountId,
        categoryId: categoryId
      });

      const valorFormatado = (amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const contaNome = accountObj?.name || 'Conta PJ';
      const catNome = catObj?.name || 'Serviços PJ';

      const spokenText = `Lançado: Receita de ${valorFormatado} em ${catNome} na ${contaNome}.`;
      const displayText = `### 💰 **Receita Registrada • Grana+**\n\n` +
        `• **Valor:** ${valorFormatado}\n` +
        `• **Categoria:** ${catNome}\n` +
        `• **Conta Destino:** ${contaNome}\n` +
        `• **Descrição:** ${description || 'Receita via PIT.AI'}\n` +
        `• **Status:** ${transactionResult.offline ? 'Armazenado no buffer local' : 'Confirmado na API Grana+'}`;

      return {
        spokenText,
        displayText,
        intent: 'finance_income',
        visualPayload: {
          type: 'finance_card',
          data: {
            transaction: transactionResult.data || { amount, description, type: 'INCOME' },
            type: 'INCOME',
            amount,
            formattedAmount: valorFormatado,
            category: catObj || { name: 'Serviços PJ' },
            account: accountObj,
            offline: Boolean(transactionResult.offline)
          }
        }
      };
    }

    if (type === 'TRANSFER') {
      const fromObj = Object.values(FINANCE_ACCOUNTS).find(a => a.id === (parsedIntent.sourceAccountId || parsedIntent.accountId));
      const toObj = Object.values(FINANCE_ACCOUNTS).find(a => a.id === parsedIntent.targetAccountId);

      const transactionResult = await pitaiFinanceService.createTransfer({
        description: description || 'Transferência via PIT.AI',
        amount: amount || 0,
        sourceAccountId: parsedIntent.sourceAccountId || parsedIntent.accountId,
        targetAccountId: parsedIntent.targetAccountId
      });

      const valorFormatado = (amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const spokenText = `Transferência de ${valorFormatado} realizada de ${fromObj?.name || 'Conta PF'} para ${toObj?.name || 'Caixinha Inter'}.`;
      const displayText = `### 🔄 **Transferência Realizada • Grana+**\n\n` +
        `• **Valor:** ${valorFormatado}\n` +
        `• **Origem:** ${fromObj?.name || 'Conta PF'}\n` +
        `• **Destino:** ${toObj?.name || 'Caixinha Inter'}\n` +
        `• **Status:** ${transactionResult.offline ? 'Salvo no buffer local' : 'Confirmado na API Grana+'}`;

      return {
        spokenText,
        displayText,
        intent: 'finance_transfer',
        visualPayload: {
          type: 'finance_card',
          data: {
            transaction: transactionResult.data || { amount, description, type: 'TRANSFER' },
            type: 'TRANSFER',
            amount,
            formattedAmount: valorFormatado,
            account: fromObj,
            targetAccount: toObj,
            offline: Boolean(transactionResult.offline)
          }
        }
      };
    }

    if (type === 'UPCOMING') {
      const days = parsedIntent.days || 30;
      const filterType = parsedIntent.filterType || 'ALL';
      const upcomingResult = await pitaiFinanceService.getUpcomingTransactions({
        days,
        type: filterType,
        includeOverdue: true,
        search: parsedIntent.search
      });

      const payload = upcomingResult.data || {};
      const summary = payload.summary || {
        totalToPay: 0,
        totalToReceive: 0,
        projectedNet: 0,
        totalOverdueExpenses: 0,
        countToPay: 0,
        countToReceive: 0,
        countOverdue: 0
      };

      const formatBRL = (val) => (Number(val) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const payStr = formatBRL(summary.totalToPay);
      const recStr = formatBRL(summary.totalToReceive);
      const netStr = formatBRL(summary.projectedNet);
      const overdueStr = formatBRL(summary.totalOverdueExpenses);

      let spokenText = '';
      if (filterType === 'EXPENSE') {
        spokenText = `Rafael, você tem ${summary.countToPay} contas a pagar nos próximos ${days} dias, totalizando ${payStr}.`;
        if (summary.countOverdue > 0) {
          spokenText += ` Atenção para ${summary.countOverdue} contas em atraso somando ${overdueStr}.`;
        }
      } else if (filterType === 'INCOME') {
        spokenText = `Rafael, há ${summary.countToReceive} recebimentos previstos para os próximos ${days} dias, somando ${recStr}.`;
      } else {
        spokenText = `Rafael, nos próximos ${days} dias temos ${payStr} a pagar e ${recStr} a receber. Saldo projetado de ${netStr}.`;
        if (summary.countOverdue > 0) {
          spokenText += ` Constam ${summary.countOverdue} pagamentos atrasados totalizando ${overdueStr}.`;
        }
      }

      let displayText = `### 📅 **Projeção Financeira • Próximos ${days} Dias**\n\n` +
        `• **Total a Pagar:** ${payStr} (${summary.countToPay} contas)\n` +
        `• **Total a Receber:** ${recStr} (${summary.countToReceive} previsões)\n` +
        `• **Saldo Projetado:** **${netStr}**\n`;

      if (summary.countOverdue > 0) {
        displayText += `• ⚠️ **Contas em Atraso:** ${overdueStr} (${summary.countOverdue} pendentes)\n`;
      }

      if (payload.overdue?.length > 0) {
        displayText += `\n**⚠️ Atrasadas:**\n` +
          payload.overdue.map(o => `• **${o.description}**: ${formatBRL(o.amount)} (${o.dueStatus || 'Vencido'})`).join('\n');
      }

      if (payload.expenses?.length > 0) {
        displayText += `\n**💳 Próximos Vencimentos:**\n` +
          payload.expenses.slice(0, 5).map(e => `• **${e.description}**: ${formatBRL(e.amount)} • ${e.dueStatus || 'A vencer'}`).join('\n');
      }

      if (payload.incomes?.length > 0) {
        displayText += `\n**💰 Previsão de Entradas:**\n` +
          payload.incomes.slice(0, 3).map(i => `• **${i.description}**: ${formatBRL(i.amount)} • ${i.dueStatus || 'A receber'}`).join('\n');
      }

      return {
        spokenText,
        displayText,
        intent: 'finance_upcoming',
        visualPayload: {
          type: 'finance_upcoming',
          data: {
            summary,
            expenses: payload.expenses || [],
            incomes: payload.incomes || [],
            overdue: payload.overdue || [],
            days,
            filterType,
            offline: Boolean(upcomingResult.offline)
          }
        }
      };
    }

    if (type === 'PAY') {
      const searchTerm = parsedIntent.search || '';
      const targetAmount = parsedIntent.amount;

      // Localiza a transação pendente correspondente
      const foundTx = await pitaiFinanceService.findPendingTransactionToPay(searchTerm, targetAmount);

      if (!foundTx) {
        const spokenText = `Rafael, não localizei nenhuma conta pendente correspondente a ${searchTerm || 'esta descrição'}. Deseja que eu consulte as contas a pagar?`;
        const displayText = `⚠️ **Lançamento Não Localizado**\n\n` +
          `Não encontramos nenhuma conta em aberto com a descrição *"${searchTerm || 'informada'}"*` +
          (targetAmount ? ` no valor de R$ ${targetAmount}` : '') + `.\n\n` +
          `Dica: Peça *"o que tenho para pagar"* para visualizar todos os títulos em aberto.`;

        return {
          spokenText,
          displayText,
          intent: 'finance_pay',
          visualPayload: { type: 'none', data: {} }
        };
      }

      // Executa a liquidação
      const payResult = await pitaiFinanceService.payTransaction(foundTx.id);
      const valorFmt = (Number(foundTx.amount) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const spokenText = `Confirmado: Baixa efetuada para ${foundTx.description || 'a conta'} no valor de ${valorFmt}.`;
      const displayText = `### ✅ **Baixa Efetuada com Sucesso • Grana+**\n\n` +
        `• **Descrição:** ${foundTx.description}\n` +
        `• **Valor Liquidado:** ${valorFmt}\n` +
        `• **Conta/Cartão:** ${foundTx.account?.name || foundTx.creditCard?.name || 'Conta Padrão'}\n` +
        `• **Status:** ${payResult.offline ? 'Baixa registrada no buffer local' : 'Liquidado com sucesso na API Grana+'}`;

      return {
        spokenText,
        displayText,
        intent: 'finance_pay',
        visualPayload: {
          type: 'finance_card',
          data: {
            transaction: { ...foundTx, status: true },
            type: foundTx.type || 'EXPENSE',
            amount: foundTx.amount,
            formattedAmount: valorFmt,
            category: foundTx.category || { name: 'Geral' },
            account: foundTx.account,
            creditCard: foundTx.creditCard,
            isCard: Boolean(foundTx.creditCard),
            offline: Boolean(payResult.offline)
          }
        }
      };
    }

    if (type === 'QUERY') {
      const list = await pitaiFinanceService.listTransactions({ limit: 5 });
      const total = list.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
      const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      const spokenText = `Rafael, localizei ${list.length} lançamentos recentes no Grana+. Total acumulado de ${totalFormatado}.`;
      const displayText = `### 📊 **Últimas Transações • Grana+**\n\n` +
        (list.length > 0
          ? list.map(t => `• **${t.description || 'Sem descrição'}**: ${(Number(t.amount) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (${t.type === 'INCOME' ? 'Receita' : 'Despesa'})`).join('\n')
          : '_Nenhuma transação recente encontrada._') +
        `\n\n**Total:** ${totalFormatado}`;

      return {
        spokenText,
        displayText,
        intent: 'finance_query',
        visualPayload: {
          type: 'finance_list',
          data: {
            transactions: list,
            total,
            totalFormatted: totalFormatado
          }
        }
      };
    }

    if (type === 'DELETE') {
      return {
        spokenText: 'Rafael, por favor me informe o ID da transação ou faça a busca dos últimos gastos para que eu possa localizar e excluir com segurança no Grana+.',
        displayText: '⚠️ **Exclusão de Transação Financeira**\n\nPara segurança do seu saldo no Grana+, informe o ID ou consulte os lançamentos recentes com *"consultar gastos"* para confirmar o cancelamento.',
        intent: 'finance_delete',
        visualPayload: { type: 'none', data: {} }
      };
    }

    return this.queryGeminiLlm(userMessage);
  }

  /**
   * Trata a consulta de telemetria climática em tempo real para o Rio de Janeiro (Open-Meteo)
   * @param {string} userMessage - Mensagem recebida
   * @returns {Promise<Object>} Resposta executiva e visualPayload weather_card
   */
  async handleWeatherIntent(userMessage = '') {
    const norm = this.normalizeText(userMessage);
    const forceRefresh = norm.includes('atualiza') || norm.includes('agora') || norm.includes('tempo real');
    const weatherData = await pitaiWeatherService.fetchWeatherData(forceRefresh);
    const spokenText = pitaiWeatherService.formatSpokenWeather(weatherData, 'Rafael');
    const displayText = pitaiWeatherService.formatDisplayWeather(weatherData);

    return {
      spokenText,
      displayText,
      intent: 'weather_query',
      visualPayload: {
        type: 'weather_card',
        data: weatherData
      }
    };
  }

  /**
   * Realiza pesquisa web em tempo real e sintetiza resposta rica
   */
  async handleWebSearchIntent(userMessage, conversationHistory = []) {
    const searchResult = await pitaiSearchService.search(userMessage);

    // Se encontrou dados em tempo real
    if (searchResult.results && searchResult.results.length > 0) {
      const topFact = searchResult.results[0];
      const spokenSummary = `Rafael, encontrei informações atualizadas sobre ${searchResult.query}. ${topFact.title.replace(/ - [^-]+$/, '')}.`;

      const displayText = `### 🌐 Pesquisa em Tempo Real: **${searchResult.query}**\n\n` +
        `**Principais Resultados:**\n` +
        searchResult.results.map((r, i) => 
          `**${i + 1}. [${r.source}] ${r.title}**\n${r.snippet ? `> ${r.snippet}\n` : ''}${r.url ? `🔗 [Ver fonte completa](${r.url})\n` : ''}`
        ).join('\n') +
        `\n*Fontes consultadas: ${searchResult.sources.join(', ')}.*`;

      return {
        spokenText: spokenSummary,
        displayText,
        intent: 'web_search',
        visualPayload: {
          type: 'web_results',
          data: {
            query: searchResult.query,
            results: searchResult.results,
            sources: searchResult.sources
          }
        }
      };
    }

    // Se não encontrou dados específicos, delega ao Gemini ou síntese contextual
    return this.queryGeminiLlm(userMessage, conversationHistory);
  }

  /**
   * Trata busca dedicada de Notícias do Rio de Janeiro
   */
  async handleRioNewsIntent() {
    const rioNews = await pitaiBriefingService.fetchRioNews(true);
    const spokenText = pitaiBriefingService.generateRioSpokenScript(rioNews, 'Rafael');

    let mapData = null;
    if (rioNews.length > 0) {
      mapData = {
        lat: -22.9068,
        lng: -43.1729,
        zoom: 12,
        title: 'Rio de Janeiro — Acontecimentos e Notícias em Tempo Real',
        newsTitle: rioNews[0].title
      };
    }

    const displayText = `### 📰 **Destaques do Rio de Janeiro • Tempo Real**\n\n` +
      rioNews.slice(0, 6).map((n, i) => 
        `**${i + 1}. [${n.sourceName}] ${n.title}**\n` +
        (n.summary ? `> ${n.summary.slice(0, 220)}...\n` : '') +
        (n.link ? `🔗 [Ler matéria completa no portal](${n.link})\n` : '')
      ).join('\n') +
      `\n*Fontes em tempo real: Google Notícias RJ, G1 Rio e Centro de Operações Rio (COR).*`;

    return {
      spokenText,
      displayText,
      intent: 'briefing',
      visualPayload: {
        type: 'map',
        data: {
          briefing: { rj: rioNews, brazil: [], world: [] },
          map: mapData
        }
      }
    };
  }

  /**
   * Trata o pedido de Briefing Diário
   */
  async handleBriefingIntent() {
    const briefingData = await pitaiBriefingService.fetchLiveBriefing(false);
    const spokenText = pitaiBriefingService.generateSpokenScript(briefingData, 'Rafael');
    pitaiBriefingService.markBriefingAsRead();

    let mapData = null;
    if (briefingData.rj.length > 0) {
      mapData = {
        lat: -22.9068,
        lng: -43.1729,
        zoom: 12,
        title: 'Rio de Janeiro — Foco de Notícias Recentes',
        newsTitle: briefingData.rj[0].title
      };
    }

    return {
      spokenText,
      displayText: `**Briefing Executivo • PIT.AI**\n\n` +
        `**Rio de Janeiro:**\n` + briefingData.rj.slice(0, 3).map(n => `• [${n.sourceName}] ${n.title}`).join('\n') + `\n\n` +
        `**Brasil & Economia:**\n` + briefingData.brazil.slice(0, 3).map(n => `• [${n.sourceName}] ${n.title}`).join('\n') + `\n\n` +
        `**Mundo:**\n` + briefingData.world.slice(0, 2).map(n => `• [${n.sourceName}] ${n.title}`).join('\n'),
      intent: 'briefing',
      visualPayload: {
        type: mapData ? 'map' : 'news_cards',
        data: {
          briefing: briefingData,
          map: mapData
        }
      }
    };
  }

  /**
   * Trata a consulta da Agenda
   */
  async handleAgendaQueryIntent() {
    const todayEvents = pitaiGoogleService.getEventsByHorizon('today');
    const tasks = pitaiGoogleService.getLocalTasks().filter(t => t.status !== 'completed');

    let spoken = '';
    if (todayEvents.length === 0) {
      spoken = 'Rafael, você não possui compromissos agendados para o restante do dia de hoje. Sua agenda está livre.';
    } else {
      spoken = `Rafael, você possui ${todayEvents.length} compromissos agendados para hoje. O próximo é ${todayEvents[0].title} às ${new Date(todayEvents[0].startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;
    }

    return {
      spokenText: spoken,
      displayText: `### Agenda de Hoje (${new Date().toLocaleDateString('pt-BR')})\n\n` +
        (todayEvents.length > 0 
          ? todayEvents.map(e => `• **${new Date(e.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(e.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}**: ${e.title} (${e.location || 'Sem local'})`).join('\n')
          : '_Nenhum evento agendado para hoje._') +
        `\n\n**Tarefas Pendentes:**\n` +
        tasks.slice(0, 3).map(t => `• [ ] ${t.title}`).join('\n'),
      intent: 'agenda_query',
      visualPayload: {
        type: 'agenda_list',
        data: {
          events: todayEvents,
          tasks
        }
      }
    };
  }

  /**
   * Trata a criação de eventos e detecção de conflitos
   */
  async handleAgendaCreateIntent(message) {
    const now = new Date();
    let targetDate = new Date(now);

    if (/amanh[ãa]/i.test(message)) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const timeMatch = message.match(/(?:às|as|\b)\s*(\d{1,2})(?:h(\d{2})?|:(\d{2}))/i);
    let startHour = null;
    let startMinute = 0;

    if (timeMatch) {
      startHour = parseInt(timeMatch[1], 10);
      startMinute = parseInt(timeMatch[2] || timeMatch[3] || '0', 10);
    }

    let startTime;
    let endTime;

    if (startHour !== null) {
      targetDate.setHours(startHour, startMinute, 0, 0);
      startTime = new Date(targetDate);
      endTime = new Date(targetDate.getTime() + 60 * 60 * 1000);
    } else {
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      nextHour.setMinutes(0, 0, 0);
      startTime = nextHour;
      endTime = new Date(nextHour.getTime() + 60 * 60 * 1000);
    }

    let cleanTitle = message
      .replace(/^(marca|agende|marca na minha agenda|agendar reunião|agendar compromisso)\s*(para|com|de)?\s*/i, '')
      .replace(/(?:^|\s+)(amanh[ãa]|hoje)(?=\s|$|[,.])/gi, '')
      .replace(/(?:às|as|\b)\s*\d{1,2}(?:h\d{0,2}|:\d{2})/gi, '')
      .replace(/^[\s\-–—e\.,]+|[\s\-–—\.,]+$/g, '')
      .trim();

    cleanTitle = cleanTitle.replace(/^(\s*e\s*|\s*para\s*|\s*às\s*)+/i, '').trim();
    const title = cleanTitle ? (cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)) : 'Reunião Externa';

    const result = pitaiGoogleService.createEvent({
      title,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      description: 'Criado via comando vocal PIT.AI',
      location: 'A definir'
    });

    if (!result.success && result.conflict) {
      const conflictMsg = `Rafael, identifiquei um possível conflito de horários: você já tem '${result.conflict.title}' agendado para o mesmo período. Deseja reagendar ou manter ambos?`;
      return {
        spokenText: conflictMsg,
        displayText: `⚠️ **Conflito de Agenda Detectado**\n\n` +
          `O horário solicitado coincide com o evento:\n` +
          `• **${result.conflict.title}** (${new Date(result.conflict.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às ${new Date(result.conflict.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})\n\n` +
          `Deseja reagendar para outro horário livre ou manter ambos?`,
        intent: 'agenda_conflict',
        visualPayload: {
          type: 'conflict_alert',
          data: {
            conflictEvent: result.conflict,
            requestedTitle: title,
            requestedStartTime: startTime.toISOString(),
            requestedEndTime: endTime.toISOString()
          }
        }
      };
    }

    const timeFormatted = startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const isTomorrow = targetDate.getDate() !== now.getDate();
    const dayDesc = isTomorrow ? 'amanhã' : 'hoje';

    return {
      spokenText: `Compromisso '${title}' agendado na sua agenda para ${dayDesc} às ${timeFormatted}.`,
      displayText: `✅ **Compromisso Agendado com Sucesso**\n\n• **Título:** ${title}\n• **Horário:** ${startTime.toLocaleString('pt-BR')}\n• **Status:** Confirmado no Google Agenda.`,
      intent: 'agenda_create',
      visualPayload: {
        type: 'agenda_list',
        data: {
          createdEvent: result.event,
          events: pitaiGoogleService.getEventsByHorizon('today')
        }
      }
    };
  }

  /**
   * Trata a criação de tarefas e lembretes
   */
  async handleTaskCreateIntent(message) {
    const cleanTitle = message
      .replace(/^(anota|cria tarefa|cria uma tarefa|lembrete|anotar)\s*(para|de)?\s*/i, '')
      .trim();

    const result = pitaiGoogleService.createTask({
      title: cleanTitle || 'Nova tarefa prioritária',
      notes: 'Registrada pelo assistente PIT.AI',
      priority: 'high'
    });

    return {
      spokenText: `Tarefa '${cleanTitle}' registrada com sucesso no seu Google Tarefas.`,
      displayText: `✅ **Tarefa Registrada:** ${cleanTitle}\nAdicionada à sua lista de pendências prioritárias.`,
      intent: 'task_create',
      visualPayload: {
        type: 'agenda_list',
        data: {
          task: result.task,
          tasks: pitaiGoogleService.getLocalTasks()
        }
      }
    };
  }

  /**
   * Dispara a inteligência central com o Gemini ou fallback enriquecido por busca em tempo real
   */
  async queryGeminiLlm(userMessage, conversationHistory = []) {
    const apiKey = this.getApiKey();

    if (apiKey) {
      const modelsToTry = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-flash-lite-latest'];
      const genAI = new GoogleGenerativeAI(apiKey);

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: this.getSystemPrompt(),
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          });

          // Prepara histórico com alternância de turnos garantindo que o primeiro seja user
          const contents = [];
          for (const msg of conversationHistory.slice(-4)) {
            const role = msg.role === 'user' ? 'user' : 'model';
            const text = msg.text || msg.content || '';
            if (!text) continue;
            if (contents.length === 0 && role === 'model') continue;
            contents.push({ role, parts: [{ text }] });
          }
          contents.push({ role: 'user', parts: [{ text: userMessage }] });

          const result = await model.generateContent({ contents });
          const rawText = result.response.text();

          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);

            // Se o Gemini identificou intenção de clima/tempo
            if (parsed.intent === 'weather_query' || parsed.visualPayload?.type === 'weather_card') {
              const liveWeather = await pitaiWeatherService.fetchWeatherData();
              return {
                spokenText: parsed.spokenText || pitaiWeatherService.formatSpokenWeather(liveWeather, 'Rafael'),
                displayText: parsed.displayText || pitaiWeatherService.formatDisplayWeather(liveWeather),
                intent: 'weather_query',
                visualPayload: {
                  type: 'weather_card',
                  data: liveWeather
                }
              };
            }

            // Se o Gemini identificou intenção financeira que ainda não foi registrada
            if (parsed.intent?.startsWith('finance_') && parsed.visualPayload?.data) {
              const txData = parsed.visualPayload.data;
              if (txData && txData.amount && !txData.offline) {
                try {
                  if (parsed.intent === 'finance_expense') {
                    await pitaiFinanceService.createExpense({
                      description: txData.description || 'Despesa via PIT.AI',
                      amount: txData.amount,
                      accountId: txData.accountId,
                      creditCardId: txData.creditCardId,
                      categoryId: txData.categoryId
                    });
                  } else if (parsed.intent === 'finance_income') {
                    await pitaiFinanceService.createIncome({
                      description: txData.description || 'Receita via PIT.AI',
                      amount: txData.amount,
                      accountId: txData.accountId,
                      categoryId: txData.categoryId
                    });
                  }
                } catch (e) {
                  console.warn('[PIT.AI Core] Erro ao registrar transação detectada pelo Gemini:', e);
                }
              }
            }

            return {
              spokenText: parsed.spokenText || rawText.replace(/[*_#`~[\]]/g, '').slice(0, 200),
              displayText: parsed.displayText || rawText,
              intent: parsed.intent || 'general_chat',
              visualPayload: parsed.visualPayload || { type: 'none', data: {} }
            };
          }

          return {
            spokenText: rawText.replace(/[*_#`~[\]]/g, '').slice(0, 220),
            displayText: rawText,
            intent: 'general_chat',
            visualPayload: { type: 'none', data: {} }
          };
        } catch (err) {
          console.warn(`[PIT.AI Core] Falha na tentativa com modelo ${modelName}:`, err?.message || err);
        }
      }
    }

    // FALLBACK INTELIGENTE: Se a chave falhar ou não estiver ativa, pesquisa na web e constrói resposta real!
    const liveSearch = await pitaiSearchService.search(userMessage);
    if (liveSearch.results && liveSearch.results.length > 0) {
      return this.handleWebSearchIntent(userMessage, conversationHistory);
    }

    // Resposta executiva contextual
    return {
      spokenText: `Rafael, registrei sua solicitação: "${userMessage}". Os módulos de agenda, notícias ao vivo e pesquisa web estão operando normalmente.`,
      displayText: `### 🛡️ **PIT.AI • Central Operacional**\n\n` +
        `Recebido: *"${userMessage}"*\n\n` +
        `• **Google Agenda & Tarefas:** Sincronizados com o Google Workspace.\n` +
        `• **Monitoramento de Notícias:** Feeds ao vivo de Rio de Janeiro, Brasil e Economia prontos.\n` +
        `• **Pesquisa em Tempo Real:** Diga *"Pesquise sobre..."* ou *"Notícias sobre..."* para varredura ao vivo na web.\n\n` +
        `*Dica: Você pode conectar sua chave direta do Google AI Studio no botão de Configurações no topo para raciocínio generativo ilimitado.*`,
      intent: 'general_chat',
      visualPayload: { type: 'none', data: {} }
    };
  }
}

export const pitaiCoreService = new PitAiCoreService();
export default pitaiCoreService;
