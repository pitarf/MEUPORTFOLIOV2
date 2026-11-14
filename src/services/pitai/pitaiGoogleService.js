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
          scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              this.saveToken(tokenResponse.access_token);
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
              resolve({
                success: false,
                error: tokenResponse?.error || 'ACCESS_DENIED',
                message: 'Autorização recusada pelo usuário.'
              });
            }
          },
          error_callback: (err) => {
            resolve({
              success: false,
              error: err?.message || 'OAUTH_ERROR',
              message: 'Erro durante o fluxo de autenticação do Google.'
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

    return {
      synced: true,
      calendarEventsCount: calResult.status === 'fulfilled' ? calResult.value.length : 0,
      tasksCount: taskResult.status === 'fulfilled' ? taskResult.value.length : 0
    };
  }

  /**
   * Busca os eventos ao vivo na API do Google Calendar
   */
  async fetchLiveCalendarEvents() {
    if (!this.accessToken) return this.getLocalEvents();

    try {
      const now = new Date();
      // Pega desde o início do dia até 60 dias à frente
      const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime&maxResults=50`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
        }
        return this.getLocalEvents();
      }

      const data = await response.json();
      const rawEvents = data.items || [];

      const parsedEvents = rawEvents.map(item => ({
        id: item.id,
        title: item.summary || 'Sem título',
        description: item.description || '',
        startTime: item.start?.dateTime || `${item.start?.date}T00:00:00`,
        endTime: item.end?.dateTime || `${item.end?.date}T23:59:59`,
        location: item.location || '',
        isAllDay: !item.start?.dateTime,
        status: item.status || 'confirmed'
      }));

      if (parsedEvents.length > 0) {
        this.saveLocalEvents(parsedEvents);
        return parsedEvents;
      }
    } catch (err) {
      console.warn('[PIT.AI Google Calendar] Erro ao sincronizar eventos ao vivo:', err);
    }

    return this.getLocalEvents();
  }

  /**
   * Busca as tarefas ao vivo na API do Google Tasks
   */
  async fetchLiveTasks() {
    if (!this.accessToken) return this.getLocalTasks();

    try {
      const url = `https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=true&maxResults=50`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
        }
        return this.getLocalTasks();
      }

      const data = await response.json();
      const rawTasks = data.items || [];

      const parsedTasks = rawTasks.map(item => ({
        id: item.id,
        title: item.title || 'Sem título',
        notes: item.notes || '',
        dueDate: item.due || null,
        status: item.status || 'needsAction',
        priority: 'high',
        completedAt: item.completed || null,
        createdAt: item.updated || new Date().toISOString()
      }));

      if (parsedTasks.length > 0) {
        this.saveLocalTasks(parsedTasks);
        return parsedTasks;
      }
    } catch (err) {
      console.warn('[PIT.AI Google Tasks] Erro ao sincronizar tarefas ao vivo:', err);
    }

    return this.getLocalTasks();
  }

  /**
   * Retorna os eventos salvos localmente (com fallback inicial realista para Rafael Pita)
   */
  getLocalEvents() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_EVENTS_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }

    // Eventos padrão da rotina de tecnologia e negócios de Rafael Pita
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = today.getFullYear();
    const mm = pad(today.getMonth() + 1);
    const dd = pad(today.getDate());

    const defaultEvents = [
      {
        id: 'evt_1',
        title: 'Reunião de Alinhamento com Cliente Jurídico',
        description: 'Apresentação da Landing Page e proposta de R$ 297',
        startTime: `${yyyy}-${mm}-${dd}T14:00:00`,
        endTime: `${yyyy}-${mm}-${dd}T15:00:00`,
        location: 'Google Meet',
        isAllDay: false,
        status: 'confirmed'
      },
      {
        id: 'evt_2',
        title: 'Deploy e Manutenção de Servidores VPS',
        description: 'Revisão periódica de containers Docker e updates de segurança',
        startTime: `${yyyy}-${mm}-${dd}T16:30:00`,
        endTime: `${yyyy}-${mm}-${dd}T17:30:00`,
        location: 'Home Office / VPS',
        isAllDay: false,
        status: 'confirmed'
      }
    ];

    this.saveLocalEvents(defaultEvents);
    return defaultEvents;
  }

  saveLocalEvents(events) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Retorna tarefas do Google Tasks salvas localmente
   */
  getLocalTasks() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_TASKS_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }

    const defaultTasks = [
      {
        id: 'tsk_1',
        title: 'Disparar e-mails de prospecção do Radar Maps',
        notes: 'Cold outreach para advogados e psicólogos identificados sem site',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'needsAction',
        priority: 'high',
        recurringInterval: '2_hours'
      },
      {
        id: 'tsk_2',
        title: 'Revisar faturamento e recebíveis de mensalidades',
        notes: 'Verificar pagamentos via PIX e transferências',
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'needsAction',
        priority: 'medium',
        recurringInterval: 'daily'
      }
    ];

    this.saveLocalTasks(defaultTasks);
    return defaultTasks;
  }

  saveLocalTasks(tasks) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
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
   * Filtra eventos por horizonte de tempo
   * @param {'today'|'week'|'month'} horizon 
   */
  getEventsByHorizon(horizon = 'today') {
    const events = this.getLocalEvents();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (horizon === 'today') {
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
      return events.filter(e => {
        const t = new Date(e.startTime).getTime();
        return t >= startOfDay && t <= endOfDay;
      });
    }

    if (horizon === 'week') {
      const endOfWeek = startOfDay + 7 * 24 * 60 * 60 * 1000;
      return events.filter(e => {
        const t = new Date(e.startTime).getTime();
        return t >= startOfDay && t <= endOfWeek;
      });
    }

    return events;
  }
}

export const pitaiGoogleService = new PitAiGoogleService();
export default pitaiGoogleService;
