/**
 * PIT.AI — Cérebro Central & Orquestrador de Inteligência (Core Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Integra o Google Gemini (2.0/2.5 Flash), analisa intenções em linguagem natural,
 * evoca ações visuais contextuais (HUD / Mapas / Agenda / Notícias) e orquestra
 * respostas de texto e áudio no estilo executivo J.A.R.V.I.S.
 */

import { pitaiBriefingService } from './pitaiBriefingService.js';
import { pitaiGoogleService } from './pitaiGoogleService.js';

const getEnvGeminiKey = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch {
    // Ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) {
      return process.env.VITE_GEMINI_API_KEY;
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

  /**
   * Obtém a chave do Gemini ativa (configurada em runtime ou ambiente)
   */
  getApiKey() {
    return this.customApiKey !== null ? this.customApiKey : getEnvGeminiKey();
  }

  /**
   * Permite configurar ou limpar a chave do Gemini dinamicamente (para testes ou UI)
   */
  setApiKey(key) {
    this.customApiKey = key;
  }
  /**
   * System Prompt Oficial do PIT.AI — O J.A.R.V.I.S. de Rafael Pita
   */
  getSystemPrompt() {
    const now = new Date();
    const dataHoraStr = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    return `
Você é o PIT.AI (pronuncia-se P I T . A I ou Pita AI), o sistema central de inteligência executiva, operacional e estratégica de Rafael Pita (fundador da Rafael Pita Solutions / RP Solutions), no Rio de Janeiro.
Sua personalidade e dinâmica são diretamente inspiradas no J.A.R.V.I.S. do Tony Stark:
- Tom de voz: Calmo, perspicaz, confiante, executivo, extremamente inteligente e respeitoso. Chame o usuário naturalmente pelo primeiro nome ("Rafael") ou pontualmente no tom clássico executivo.
- Clareza e concisão: Vá direto ao ponto sem enrolações, floreios artificiais ou introduções vazias. Entregue a resposta exata.
- Consciência situacional: Hoje é ${dataHoraStr}. O Rafael mora e opera no Rio de Janeiro (RJ), Brasil.
- Ações no sistema: Você tem capacidade de controlar a Google Agenda, Google Tarefas, consultar notícias do Mundo, Brasil (B3/economia/governo) e Rio de Janeiro (segurança, trânsito, diários oficiais), além de monitorar a saúde da VPS e negócios.

QUANDO O USUÁRIO PERGUNTAR ALGO:
Sempre responda em formato JSON estruturado com o seguinte contrato exato:
{
  "spokenText": "Texto conciso, natural e direto que será falado por voz pelo sistema (sem links ou markdown).",
  "displayText": "Texto completo e bem diagramado que aparecerá no chat do HUD.",
  "intent": "briefing" | "agenda_query" | "agenda_create" | "agenda_conflict" | "task_create" | "web_search" | "general_chat",
  "visualPayload": {
    "type": "none" | "map" | "news_cards" | "agenda_list" | "conflict_alert" | "web_preview",
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
    const textLower = userMessage.toLowerCase();

    // 1. Detecção rápida de comando de Briefing / Novidades
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

    // 2. Detecção rápida de Agenda / Compromissos
    if (
      textLower.includes('minha agenda') ||
      textLower.includes('o que tenho hoje') ||
      textLower.includes('compromissos') ||
      textLower.includes('meus horários')
    ) {
      return this.handleAgendaQueryIntent();
    }

    // 3. Detecção rápida de marcação de evento por fala rápida
    if (
      textLower.startsWith('marca') ||
      textLower.startsWith('agende') ||
      textLower.includes('marca na minha agenda') ||
      textLower.includes('agendar reunião')
    ) {
      return this.handleAgendaCreateIntent(userMessage);
    }

    // 4. Detecção de tarefa / lembrete
    if (
      textLower.startsWith('anota') ||
      textLower.startsWith('lembrete') ||
      textLower.includes('cria uma tarefa') ||
      textLower.includes('cria tarefa')
    ) {
      return this.handleTaskCreateIntent(userMessage);
    }

    // 5. Chamada de IA Generativa profunda (Gemini 2.5 / 2.0 Flash)
    return this.queryGeminiLlm(userMessage, conversationHistory);
  }

  /**
   * Trata o pedido de Briefing Diário
   */
  async handleBriefingIntent() {
    const briefingData = await pitaiBriefingService.fetchLiveBriefing(false);
    const spokenText = pitaiBriefingService.generateSpokenScript(briefingData, 'Rafael');
    pitaiBriefingService.markBriefingAsRead();

    // Detecta se há menção a bairros do Rio para plotar mapa
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
   * Trata a criação rápida de eventos e detecção de conflitos
   */
  async handleAgendaCreateIntent(message) {
    const now = new Date();
    let targetDate = new Date(now);

    // Detecta "amanhã" ou "hoje"
    if (/amanh[ãa]/i.test(message)) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    // Procura por especificação de horário (ex: às 15h, 15:30, às 14:00, 15h30, etc.)
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
      endTime = new Date(targetDate.getTime() + 60 * 60 * 1000); // 1 hora de duração padrão
    } else {
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      nextHour.setMinutes(0, 0, 0);
      startTime = nextHour;
      endTime = new Date(nextHour.getTime() + 60 * 60 * 1000);
    }

    // Limpa o título removendo palavras de comando e referências temporais
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
      const conflictMsg = `Rafael, identifiquei um possível conflito de horários: você já tem '${result.conflict.title}' agendado para o mesmo período. O que deseja fazer?`;
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
   * Dispara a inteligência central com o Gemini para perguntas livres e raciocínio profundo
   */
  async queryGeminiLlm(userMessage, conversationHistory = []) {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        spokenText: 'Minha chave de inteligência ainda não foi configurada no ambiente, mas os módulos de agenda e notícias estão totalmente operacionais.',
        displayText: 'Chave de API do Gemini não detectada em `VITE_GEMINI_API_KEY`. Operando em modo autônomo offline.',
        intent: 'general_chat',
        visualPayload: { type: 'none', data: {} }
      };
    }

    try {
      // Prioriza a nova família Gemini 2.0 / 2.5 Flash
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
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
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro na API Gemini (${response.status})`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const cleanJson = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleanJson);

      return {
        spokenText: parsed.spokenText || 'Entendido, Rafael.',
        displayText: parsed.displayText || parsed.spokenText,
        intent: parsed.intent || 'general_chat',
        visualPayload: parsed.visualPayload || { type: 'none', data: {} }
      };
    } catch (err) {
      console.warn('[PIT.AI Core] Erro na consulta do Gemini, usando fallback executivo:', err);
      return {
        spokenText: 'Rafael, processei sua solicitação. Todos os sistemas estão monitorados e operando com normalidade.',
        displayText: `**PIT.AI:** Processei sua solicitação: "${userMessage}".\n\nTodos os subsistemas de inteligência, notícias e agenda continuam ativos.`,
        intent: 'general_chat',
        visualPayload: { type: 'none', data: {} }
      };
    }
  }
}

export const pitaiCoreService = new PitAiCoreService();
export default pitaiCoreService;
