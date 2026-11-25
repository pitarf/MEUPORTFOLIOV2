/**
 * PIT.AI — Serviço de Integração Google Workspace (Calendar & Tasks)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Conecta-se às APIs oficiais do Google Calendar e Google Tasks para leitura,
 * criação, reagendamento e exclusão de compromissos por voz/texto, com algoritmo
 * ativo de detecção de conflitos de horários em tempo real.
 */

const STORAGE_GOOGLE_TOKEN_KEY = 'pitai_google_access_token';
const STORAGE_GOOGLE_USER_KEY = 'pitai_google_user_profile';
const STORAGE_GOOGLE_CLIENT_ID_KEY = 'pitai_google_client_id';
const STORAGE_EVENTS_KEY = 'pitai_local_agenda_events_v1';
const STORAGE_TASKS_KEY = 'pitai_local_tasks_v1';

class PitAiGoogleService {
  constructor() {
    this.accessToken = this.getStoredToken();
    this.userProfile = this.getStoredUserProfile();
    this.tokenClient = null;
    this.lastCalendarError = null;
    this.lastTasksError = null;
    this.lastSyncDetails = null;
  }

  getClientId() {
    try {
      const fromEnv = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_CLIENT_ID);
      if (fromEnv && fromEnv !== 'your_google_oauth_client_id_here') return fromEnv;
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(STORAGE_GOOGLE_CLIENT_ID_KEY) || '';
      }
    } catch {
      return '';
    }
    return '';
  }

  saveClientId(clientId) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_GOOGLE_CLIENT_ID_KEY, clientId);
      }
    } catch {
      // Ignore
    }
  }

  setClientId(clientId) {
    return this.saveClientId(clientId);
  }

  requestAccessTokenInteractive(customClientId = null) {
    return this.requestGoogleAccess(customClientId);
  }

  getStoredToken() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(STORAGE_GOOGLE_TOKEN_KEY) || null;
      }
    } catch {
      return null;
    }
    return null;
  }

  saveToken(token) {
    this.accessToken = token;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_GOOGLE_TOKEN_KEY, token);
      }
    } catch {
      // Ignore
    }
  }

  clearToken() {
    this.accessToken = null;
    this.userProfile = null;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_GOOGLE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_GOOGLE_USER_KEY);
      }
    } catch {
      // Ignore
    }
  }

  getStoredUserProfile() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_GOOGLE_USER_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch {
      return null;
    }
    return null;
  }

  saveUserProfile(profile) {
    this.userProfile = profile;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_GOOGLE_USER_KEY, JSON.stringify(profile));
      }
    } catch {
      // Ignore
    }
  }

  isConnected() {
    return Boolean(this.accessToken);
  }

  /**
   * Inicializa o Google Identity Services (GIS) no navegador
   */
  async loadGoogleIdentityScript() {
    if (typeof window === 'undefined') return false;
    if (window.google?.accounts?.oauth2) return true;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Inicia o fluxo de autorização OAuth2 com a conta Google do Rafael
   */
  async requestGoogleAccess(customClientId = null) {
    const clientId = customClientId || this.getClientId();
    if (!clientId) {
      return {
        success: false,
        error: 'CLIENT_ID_REQUIRED',
        message: 'Google Client ID não configurado no ambiente nem no armazenamento local.'
      };
    }

    const loaded = await this.loadGoogleIdentityScript();
    if (!loaded || !window.google?.accounts?.oauth2) {
      return {
        success: false,
        error: 'SCRIPT_LOAD_FAILED',
        message: 'Falha ao carregar a biblioteca Google Identity Services.'
      };
    }

    return new Promise((resolve) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse) => {
            console.log('[Google OAuth Token Response]:', tokenResponse);
            if (tokenResponse?.access_token) {
              this.saveToken(tokenResponse.access_token);
              this.needsScopeUpgrade = false;
              // Busca dados do usuário (e-mail)
              const profile = await this.fetchUserProfile(tokenResponse.access_token);
              if (profile) this.saveUserProfile(profile);

              // Sincroniza dados imediatos
              await this.syncFromGoogleLive();

              resolve({
                success: true,
                accessToken: tokenResponse.access_token,
                profile,
                message: `Conta Google (${profile?.email || 'Conectada'}) sincronizada com sucesso!`
              });
            } else {
              const errCode = tokenResponse?.error || 'ACCESS_DENIED';
              const errDesc = tokenResponse?.error_description || 'Autorização não concluída na janela do Google.';
              resolve({
                success: false,
                error: errCode,
                message: `Google: ${errCode} - ${errDesc}`
              });
            }
          },
          error_callback: (err) => {
            console.error('[Google OAuth Error Callback]:', err);
            let userMsg = 'Erro durante o fluxo de autenticação do Google.';
            if (err?.type === 'popup_closed') {
              userMsg = 'A janela do Google foi fechada antes de você confirmar todas as permissões.';
            } else if (err?.type === 'popup_blocked') {
              userMsg = 'O navegador bloqueou o pop-up do Google. Permita pop-ups para este site.';
            } else if (err?.message) {
              userMsg = `Google: ${err.message}`;
            }
            resolve({
              success: false,
              error: err?.type || err?.message || 'OAUTH_ERROR',
              message: userMsg
            });
          }
        });

        client.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        resolve({
          success: false,
          error: err.message,
          message: `Erro ao iniciar autenticação: ${err.message}`
        });
      }
    });
  }

  /**
   * Obtém os dados de perfil da conta Google conectada
   */
  async fetchUserProfile(token = this.accessToken) {
    if (!token) return null;
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Sincroniza eventos da Google Agenda e tarefas do Google Tasks em tempo real
   */
  async syncFromGoogleLive() {
    if (!this.accessToken) return { synced: false, reason: 'NO_TOKEN' };

    const calendarPromise = this.fetchLiveCalendarEvents();
    const tasksPromise = this.fetchLiveTasks();

    const [calResult, taskResult] = await Promise.allSettled([calendarPromise, tasksPromise]);

    const calEvents = calResult.status === 'fulfilled' ? calResult.value : [];
    const tasks = taskResult.status === 'fulfilled' ? taskResult.value : [];
    const todayEvents = this.getEventsByHorizon('today');

    this.lastSyncDetails = {
      timestamp: new Date().toISOString(),
      calendarOk: !this.lastCalendarError,
      calendarError: this.lastCalendarError,
      calendarEventsCount: calEvents.length,
      todayEventsCount: todayEvents.length,
      calendarsFound: this.activeCalendars || ['Principal'],
      needsScopeUpgrade: Boolean(this.needsScopeUpgrade),
      tasksOk: !this.lastTasksError,
      tasksError: this.lastTasksError,
      tasksCount: tasks.length
    };

    return {
      synced: true,
      ...this.lastSyncDetails
    };
  }

  /**
   * Busca os eventos ao vivo na API do Google Calendar
   * Consulta o calendário primary e quaisquer outros calendários ativos do usuário (calendarList)
   */
  async fetchLiveCalendarEvents() {
    if (!this.accessToken) return this.getLocalEvents();

    try {
      this.lastCalendarError = null;

      // 1. Tenta listar todos os calendários do usuário
      let calendarEntries = [{ id: 'primary', summary: 'Principal' }];
      try {
        const listRes = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        });
        if (listRes.ok) {
          const listData = await listRes.json();
          if (Array.isArray(listData.items) && listData.items.length > 0) {
            calendarEntries = listData.items.map(c => ({
              id: c.id,
              summary: c.summary || c.id,
              primary: Boolean(c.primary)
            }));
            this.needsScopeUpgrade = false;
          }
        } else if (listRes.status === 403) {
          // Escopo atual não cobre leitura de calendários adicionais
          console.warn('[PIT.AI Google Calendar] calendarList retornou 403. Necessário upgrade de escopo.');
          this.needsScopeUpgrade = true;
        }
      } catch (err) {
        console.warn('[PIT.AI Google Calendar] Falha ao consultar calendarList:', err);
      }

      this.activeCalendars = calendarEntries.map(c => c.summary);

      // 2. Janela de busca ampla: últimas 48 horas até 45 dias no futuro
      const timeMin = new Date(Date.now() - (48 * 3600 * 1000)).toISOString();
      const timeMax = new Date(Date.now() + (45 * 24 * 3600 * 1000)).toISOString();

      const allFetchedEvents = [];
      let anySuccess = false;
      let lastErrMsg = null;

      for (const cal of calendarEntries) {
        try {
          const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime&maxResults=250`;
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          });

          if (!response.ok) {
            let errorDetail = `Status ${response.status}`;
            try {
              const errBody = await response.json();
              errorDetail = errBody.error?.message || errorDetail;
            } catch {
              // Ignore
            }
            lastErrMsg = errorDetail;
            console.error(`[PIT.AI Google Calendar] Erro no calendário '${cal.summary}' (${cal.id}):`, errorDetail);
            if (response.status === 401) {
              this.clearToken();
              this.lastCalendarError = 'Sessão expirada. Reconecte sua conta Google no topo.';
              return this.getLocalEvents();
            }
            continue;
          }

          anySuccess = true;
          const data = await response.json();
          const items = data.items || [];

          for (const item of items) {
            if (item.status === 'cancelled') continue;

            const isAllDay = !item.start?.dateTime;
            const startRaw = item.start?.dateTime || item.start?.date;
            const endRaw = item.end?.dateTime || item.end?.date;

            allFetchedEvents.push({
              id: item.id,
              calendarId: cal.id,
              calendarName: cal.summary,
              title: item.summary || 'Sem título',
              description: item.description || '',
              startTime: startRaw,
              endTime: endRaw || startRaw,
              location: item.location || '',
              isAllDay,
              status: item.status || 'confirmed'
            });
          }
        } catch (err) {
          console.warn(`[PIT.AI Google Calendar] Falha ao consultar calendário '${cal.summary}':`, err);
        }
      }

      if (!anySuccess && lastErrMsg) {
        this.lastCalendarError = lastErrMsg;
      } else {
        this.lastCalendarError = null;
      }

      // Desduplica por id de evento
      const uniqueMap = new Map();
      for (const evt of allFetchedEvents) {
        if (!uniqueMap.has(evt.id)) {
          uniqueMap.set(evt.id, evt);
        }
      }
      const uniqueEvents = Array.from(uniqueMap.values());

      // Salva a lista real atualizada
      this.saveLocalEvents(uniqueEvents);
      return uniqueEvents;
    } catch (err) {
      console.warn('[PIT.AI Google Calendar] Erro geral ao sincronizar eventos:', err);
      this.lastCalendarError = err.message;
    }

    return this.getLocalEvents();
  }

  /**
   * Busca as tarefas ao vivo na API do Google Tasks (todas as listas)
   */
  async fetchLiveTasks() {
    if (!this.accessToken) return this.getLocalTasks();

    try {
      this.lastTasksError = null;

      // 1. Tenta listar todas as listas de tarefas do usuário
      let listIds = ['@default'];
      try {
        const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        });
        if (listsRes.ok) {
          const listsData = await listsRes.json();
          if (Array.isArray(listsData.items) && listsData.items.length > 0) {
            listIds = listsData.items.map(l => l.id);
          }
        }
      } catch {
        // Fallback para @default
      }

      const allTasks = [];
      for (const listId of listIds) {
        try {
          const url = `https://tasks.googleapis.com/tasks/v1/lists/${encodeURIComponent(listId)}/tasks?showCompleted=true&maxResults=100`;
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          });

          if (!response.ok) {
            let errDetail = `Status ${response.status}`;
            try {
              const errBody = await response.json();
              errDetail = errBody.error?.message || errDetail;
            } catch {
              // Ignore
            }
            this.lastTasksError = errDetail;
            if (response.status === 401) {
              this.clearToken();
              return this.getLocalTasks();
            }
            continue;
          }

          const data = await response.json();
          const rawTasks = data.items || [];

          for (const item of rawTasks) {
            allTasks.push({
              id: item.id,
              listId,
              title: item.title || 'Sem título',
              notes: item.notes || '',
              dueDate: item.due || null,
              status: item.status || 'needsAction',
              priority: 'high',
              completedAt: item.completed || null,
              createdAt: item.updated || new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn(`[PIT.AI Google Tasks] Erro ao buscar lista '${listId}':`, err);
        }
      }

      // Desduplica tarefas por id
      const uniqueTasksMap = new Map();
      for (const t of allTasks) {
        if (!uniqueTasksMap.has(t.id)) {
          uniqueTasksMap.set(t.id, t);
        }
      }
      const uniqueTasks = Array.from(uniqueTasksMap.values());

      this.saveLocalTasks(uniqueTasks);
      return uniqueTasks;
    } catch (err) {
      console.warn('[PIT.AI Google Tasks] Erro ao sincronizar tarefas ao vivo:', err);
      this.lastTasksError = err.message;
    }

    return this.getLocalTasks();
  }

  /**
   * Retorna os eventos salvos localmente, expurgando quaisquer mocks fictícios
   */
  getLocalEvents() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_EVENTS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            // Elimina qualquer mock antigo residual
            const cleaned = parsed.filter(e => 
              e && e.id !== 'evt_1' && e.id !== 'evt_2' && 
              !String(e.title || '').includes('Cliente Jurídico') &&
              !String(e.title || '').includes('Deploy e Manutenção de Servidores VPS')
            );
            if (cleaned.length !== parsed.length) {
              this.saveLocalEvents(cleaned);
            }
            return cleaned;
          }
        }
      }
    } catch {
      // Ignore
    }

    return [];
  }

  saveLocalEvents(events) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events || []));
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Retorna tarefas do Google Tasks salvas localmente, expurgando mocks fictícios
   */
  getLocalTasks() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_TASKS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter(t => 
              t && t.id !== 'tsk_1' && t.id !== 'tsk_2' && 
              !String(t.title || '').includes('Radar Maps') &&
              !String(t.title || '').includes('Revisar faturamento')
            );
            if (cleaned.length !== parsed.length) {
              this.saveLocalTasks(cleaned);
            }
            return cleaned;
          }
        }
      }
    } catch {
      // Ignore
    }

    return [];
  }

  saveLocalTasks(tasks) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks || []));
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Algoritmo de Detecção de Conflitos de Horário na Agenda
   * @param {Date|string} newStartTime 
   * @param {Date|string} newEndTime 
   * @param {string} excludeEventId - ID de evento a ignorar em caso de edição
   * @returns {Object|null} Retorna o evento conflitante ou null se o horário estiver livre
   */
  checkTimeConflict(newStartTime, newEndTime, excludeEventId = null) {
    const events = this.getLocalEvents();
    const start = new Date(newStartTime).getTime();
    const end = new Date(newEndTime).getTime();

    for (const evt of events) {
      if (excludeEventId && evt.id === excludeEventId) continue;
      const evtStart = new Date(evt.startTime).getTime();
      const evtEnd = new Date(evt.endTime).getTime();

      // Verifica sobreposição de intervalos: (StartA < EndB) e (EndA > StartB)
      if (start < evtEnd && end > evtStart) {
        return evt;
      }
    }

    return null;
  }

  /**
   * Adiciona um novo compromisso na agenda com verificação prévia de conflito
   * @param {Object} eventData 
   * @returns {{success: boolean, conflict?: Object, event?: Object, message: string}}
   */
  createEvent({ title, startTime, endTime, description = '', location = '' }) {
    const conflict = this.checkTimeConflict(startTime, endTime);
    if (conflict) {
      return {
        success: false,
        conflict,
        message: `Possível conflito de horários com o compromisso '${conflict.title}' agendado das ${new Date(conflict.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às ${new Date(conflict.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`
      };
    }

    const createdId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const events = this.getLocalEvents();
    const newEvent = {
      id: createdId,
      title,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      description,
      location,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    this.saveLocalEvents(events);

    // Se estiver conectado à Google API ao vivo, dispara sincronização assíncrona com o Google Calendar
    if (this.accessToken) {
      this.pushEventToGoogleCalendar(newEvent).catch(err => {
        console.warn('[PIT.AI Google Calendar] Erro ao sincronizar evento ao vivo na nuvem:', err);
      });
    }

    return {
      success: true,
      event: newEvent,
      message: `Compromisso '${title}' agendado com sucesso para ${new Date(startTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}.`
    };
  }

  async pushEventToGoogleCalendar(event) {
    if (!this.accessToken) return;
    const payload = {
      summary: event.title,
      description: event.description || 'Criado pelo assistente PIT.AI',
      location: event.location || '',
      start: { dateTime: new Date(event.startTime).toISOString() },
      end: { dateTime: new Date(event.endTime).toISOString() }
    };

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      event.id = data.id;
      this.saveLocalEvents(this.getLocalEvents());
    }
  }

  /**
   * Cria uma tarefa no Google Tasks
   */
  createTask({ title, notes = '', dueDate = null, recurringInterval = null, priority = 'medium' }) {
    const createdTaskId = `tsk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const tasks = this.getLocalTasks();
    const newTask = {
      id: createdTaskId,
      title,
      notes,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      recurringInterval,
      priority,
      status: 'needsAction',
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    this.saveLocalTasks(tasks);

    // Se conectado à API ao vivo, dispara criação em segundo plano
    if (this.accessToken) {
      this.pushTaskToGoogleTasks(newTask).catch(err => {
        console.warn('[PIT.AI Google Tasks] Erro ao sincronizar tarefa ao vivo na nuvem:', err);
      });
    }

    return {
      success: true,
      task: newTask,
      message: `Tarefa '${title}' registrada com sucesso.`
    };
  }

  async pushTaskToGoogleTasks(task) {
    if (!this.accessToken) return;
    const payload = {
      title: task.title,
      notes: task.notes || 'Registrada pelo assistente PIT.AI',
      due: task.dueDate ? new Date(task.dueDate).toISOString() : undefined
    };

    const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      task.id = data.id;
      this.saveLocalTasks(this.getLocalTasks());
    }
  }

  /**
   * Marca uma tarefa como concluída
   */
  completeTask(taskId) {
    const tasks = this.getLocalTasks();
    const target = tasks.find(t => t.id === taskId);
    if (!target) return { success: false, message: 'Tarefa não encontrada.' };

    target.status = 'completed';
    target.completedAt = new Date().toISOString();
    this.saveLocalTasks(tasks);

    if (this.accessToken) {
      fetch(`https://tasks.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      }).catch(err => console.warn('[PIT.AI Google Tasks] Erro ao concluir tarefa:', err));
    }

    return { success: true, message: `Tarefa '${target.title}' marcada como concluída.` };
  }

  /**
   * Exclui ou cancela um evento da agenda
   */
  deleteEvent(eventId) {
    const events = this.getLocalEvents();
    const filtered = events.filter(e => e.id !== eventId);
    this.saveLocalEvents(filtered);

    if (this.accessToken) {
      fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${this.accessToken}` }
      }).catch(err => console.warn('[PIT.AI Google Calendar] Erro ao deletar evento:', err));
    }

    return { success: true, message: 'Compromisso removido da agenda.' };
  }

  /**
   * Verifica de forma robusta e resiliente se um evento do Google Calendar pertence ao dia de hoje (Fuso Brasília)
   */
  isEventToday(event) {
    if (!event || !event.startTime) return false;
    const todayStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // 1. Caso seja string de data pura YYYY-MM-DD (dia inteiro)
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.startTime)) {
      const [y, m, d] = event.startTime.split('-');
      const evDateStr = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
      return evDateStr === todayStr;
    }

    // 2. Data/hora ISO: verifica pelo fuso de Brasília
    const s = new Date(event.startTime);
    if (!isNaN(s.getTime())) {
      const sLocal = s.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      if (sLocal === todayStr) return true;
    }

    // 3. Verifica se o evento está em andamento cobrindo o dia de hoje
    if (event.endTime) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(event.endTime)) {
        const [y, m, d] = event.endTime.split('-');
        const evEndDateStr = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
        if (evEndDateStr === todayStr) return true;
      }
      const e = new Date(event.endTime);
      if (!isNaN(e.getTime())) {
        const eLocal = e.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        if (eLocal === todayStr) return true;

        if (!isNaN(s.getTime())) {
          const now = new Date();
          if (s <= now && e >= now) return true;
        }
      }
    }

    return false;
  }

  /**
   * Filtra eventos por horizonte de tempo com validação rigorosa de datas
   * @param {'today'|'week'|'month'} horizon 
   */
  getEventsByHorizon(horizon = 'today') {
    const events = this.getLocalEvents();
    if (!events || events.length === 0) return [];

    if (horizon === 'today') {
      return events.filter(e => this.isEventToday(e));
    }

    if (horizon === 'week') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
      const endOfWeek = startOfDay + (7 * 24 * 60 * 60 * 1000);
      return events.filter(e => {
        if (!e?.startTime) return false;
        if (this.isEventToday(e)) return true;
        const t = new Date(e.startTime).getTime();
        return !isNaN(t) && t >= (startOfDay - (12 * 3600 * 1000)) && t <= endOfWeek;
      });
    }

    return events;
  }
}

export const pitaiGoogleService = new PitAiGoogleService();
export default pitaiGoogleService;
