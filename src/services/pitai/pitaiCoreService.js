/**
 * PIT.AI — Cérebro Central & Orquestrador de Inteligência (Core Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Integra o Google Gemini (2.0/2.5 Flash), analisa intenções em linguagem natural,
 * evoca ações visuais contextuais (HUD / Mapas / Agenda / Notícias / Pesquisa Web)
 * e orquestra respostas de texto e áudio no estilo executivo J.A.R.V.I.S.
 */

import { pitaiBriefingService } from './pitaiBriefingService.js';
import { pitaiGoogleService } from './pitaiGoogleService.js';
import { pitaiSearchService } from './pitaiSearchService.js';

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
- Ações reais: Você gerencia a Google Agenda, Google Tarefas, realiza pesquisas em tempo real na internet, monitora notícias do Rio, Brasil e Mundo, e os sistemas do ecossistema RP Solutions.

CONTRATO OBRIGATÓRIO DE RESPOSTA (JSON):
{
  "spokenText": "Texto conciso, natural e fluido para fala em áudio pelo PIT.AI (sem asteriscos, markdown ou links brutos).",
  "displayText": "Texto formatado em markdown com detalhes, tópicos e links úteis para leitura no HUD.",
  "intent": "briefing" | "agenda_query" | "agenda_create" | "agenda_conflict" | "task_create" | "web_search" | "general_chat",
  "visualPayload": {
    "type": "none" | "map" | "news_cards" | "agenda_list" | "conflict_alert" | "web_results",
    "data": {}
  }
}
`.trim();
  }

  /**
   * Processa a mensagem do usuário e devolve a resposta executiva e ações do HUD
   * @param {string} userMessage - Mensagem ou fala do usuário
   * @param {Array} conversationHistory - Histórico recente
   * @returns {Promise<Object>}
   */
  async processUserInput(userMessage, conversationHistory = []) {
    const textLower = userMessage.toLowerCase().trim();

    // 1. Comando de Briefing / Novidades
    if (
      textLower.includes('o que tem de novo') ||
      textLower.includes('novidades') ||
      textLower.includes('acontecimentos') ||
      textLower.includes('notícias') ||
      textLower.includes('briefing') ||
      textLower.includes('como estão as coisas')
    ) {
      return this.handleBriefingIntent();
    }

    // 2. Consulta de Agenda / Compromissos
    if (
      textLower.includes('minha agenda') ||
      textLower.includes('o que tenho hoje') ||
      textLower.includes('compromissos') ||
      textLower.includes('meus horários')
    ) {
      return this.handleAgendaQueryIntent();
    }

    // 3. Marcação rápida de evento
    if (
      textLower.startsWith('marca') ||
      textLower.startsWith('agende') ||
      textLower.includes('marca na minha agenda') ||
      textLower.includes('agendar reunião')
    ) {
      return this.handleAgendaCreateIntent(userMessage);
    }

    // 4. Criação de tarefa / lembrete
    if (
      textLower.startsWith('anota') ||
      textLower.startsWith('lembrete') ||
      textLower.includes('cria uma tarefa') ||
      textLower.includes('cria tarefa')
    ) {
      return this.handleTaskCreateIntent(userMessage);
    }

    // 5. Detecção ativa de Pesquisa Web em Tempo Real
    const isSearchExplicit = 
      textLower.startsWith('pesquise') ||
      textLower.startsWith('pesquisa') ||
      textLower.startsWith('busque') ||
      textLower.startsWith('busca') ||
      textLower.startsWith('quem é') ||
      textLower.startsWith('o que é') ||
      textLower.startsWith('onde fica') ||
      textLower.includes('cotação') ||
      textLower.includes('dólar') ||
      textLower.includes('ibovespa') ||
      textLower.includes('clima') ||
      textLower.includes('previsão do tempo') ||
      textLower.includes('trânsito') ||
      textLower.includes('linha vermelha') ||
      textLower.includes('ponte rio-niterói') ||
      textLower.includes('notícia sobre') ||
      textLower.includes('últimas sobre');

    if (isSearchExplicit) {
      return this.handleWebSearchIntent(userMessage, conversationHistory);
    }

    // 6. Consulta via LLM com fallback enriquecido por busca
    return this.queryGeminiLlm(userMessage, conversationHistory);
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
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const payload = {
          systemInstruction: {
            parts: [{ text: this.getSystemPrompt() }]
          },
          contents: [
            ...conversationHistory.slice(-4).map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text || msg.content || '' }]
            })),
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.3
          }
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          // Tenta extrair JSON do modelo
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
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
        }
      } catch (err) {
        console.warn('[PIT.AI Core] Chamada do Gemini falhou, ativando motor de pesquisa e síntese contextual:', err);
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
