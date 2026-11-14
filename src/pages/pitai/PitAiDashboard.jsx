import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Radio,
  Cpu,
  RefreshCw,
  Sparkles,
  Calendar,
  Newspaper,
  ShieldCheck,
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  Terminal,
  Check,
  LogOut,
  Key,
  X,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PitAiOrb from '@/components/pitai/PitAiOrb';
import PitAiVisualFeed from '@/components/pitai/PitAiVisualFeed';
import { pitaiVoiceService } from '@/services/pitai/pitaiVoiceService';
import { pitaiCoreService } from '@/services/pitai/pitaiCoreService';
import { pitaiBriefingService } from '@/services/pitai/pitaiBriefingService';
import { pitaiGoogleService } from '@/services/pitai/pitaiGoogleService';

export default function PitAiDashboard() {
  const { toast } = useToast();

  // Estados do Core e Voz
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [visualPayload, setVisualPayload] = useState({ type: 'none', data: {} });
  const [currentTime, setCurrentTime] = useState('');

  // Estados do Google Workspace (Agenda & Tasks)
  const [googleConnected, setGoogleConnected] = useState(() => pitaiGoogleService.isConnected());
  const [googleUser, setGoogleUser] = useState(() => pitaiGoogleService.getStoredUserProfile());
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(() => pitaiGoogleService.getClientId());
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);

  const chatBottomRef = useRef(null);

  // Relógio de Brasília ao vivo
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inicialização e vínculo de callbacks de voz
  useEffect(() => {
    pitaiVoiceService.bindCallbacks({
      onTranscript: ({ interim, final, isFinal }) => {
        if (interim) {
          setInputText(interim);
        }
        if (isFinal && final) {
          setInputText(final);
          handleSendMessage(final);
        }
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        setIsListening(newStatus === 'listening');
      },
      onSpeechEnd: () => {
        setStatus('idle');
      }
    });

    // Mensagem de boas-vindas inicial estilo J.A.R.V.I.S.
    const initialWelcome = {
      id: 'welcome',
      role: 'assistant',
      text: 'Olá, Rafael. Sistemas operacionais. Como posso auxiliar suas operações hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialWelcome]);

    // Opcional: fala inicial se o áudio estiver liberado
    let welcomeTimer = null;
    if (audioEnabled) {
      welcomeTimer = setTimeout(() => {
        pitaiVoiceService.speak('Olá, Rafael. Sistemas operacionais.');
      }, 600);
    }

    // Atalho global: Barra de Espaço alterna microfone quando não estiver digitando
    const handleGlobalKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;
      if (e.code === 'Space' && !isInput) {
        e.preventDefault();
        handleToggleMic();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      if (welcomeTimer) clearTimeout(welcomeTimer);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      pitaiVoiceService.stopSpeaking();
      pitaiVoiceService.stopListening();
      pitaiVoiceService.bindCallbacks({
        onTranscript: null,
        onStatusChange: null,
        onSpeechEnd: null
      });
    };
  }, []);

  // Rola para a mensagem mais recente
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visualPayload]);

  // Alterna o microfone
  const handleToggleMic = () => {
    if (isListening) {
      pitaiVoiceService.stopListening();
      setIsListening(false);
      setStatus('idle');
    } else {
      pitaiVoiceService.stopSpeaking();
      try {
        pitaiVoiceService.startListening();
        setIsListening(true);
        setStatus('listening');
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Microfone indisponível',
          description: 'Verifique as permissões de áudio no seu navegador.'
        });
      }
    }
  };

  // Envia a mensagem (voz ou texto digitado)
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    setInputText('');
    pitaiVoiceService.stopListening();

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus('thinking');

    try {
      const response = await pitaiCoreService.processUserInput(query, messages);

      const assistantMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: response.displayText || response.spokenText,
        intent: response.intent,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Atualiza a projeção visual no HUD
      if (response.visualPayload && response.visualPayload.type !== 'none') {
        setVisualPayload(response.visualPayload);
      }

      // Fala a resposta se áudio estiver ativado
      if (audioEnabled && response.spokenText) {
        setStatus('speaking');
        await pitaiVoiceService.speak(response.spokenText);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('[PIT.AI Dashboard] Erro no processamento:', err);
      setStatus('idle');
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: 'Ocorreu uma instabilidade na consulta. Todos os sistemas locais permanecem ativos.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Resolução de Conflito de Agenda por clique no HUD
  const handleResolveConflict = (action) => {
    if (action === 'reschedule') {
      handleSendMessage('reagenda para a próxima hora livre');
    } else {
      handleSendMessage('mantém ambos os compromissos');
    }
  };

  // Conexão Google Workspace (Agenda & Tasks)
  const handleConnectGoogle = async (customId = null) => {
    setIsConnectingGoogle(true);
    const idToUse = customId || clientIdInput.trim();
    if (idToUse) {
      pitaiGoogleService.saveClientId(idToUse);
    }

    try {
      const res = await pitaiGoogleService.requestGoogleAccess(idToUse || null);
      if (res.success) {
        setGoogleConnected(true);
        setGoogleUser(res.profile);
        setGoogleModalOpen(false);
        toast({
          title: 'Google Workspace Conectado!',
          description: `Agenda e Tarefas sincronizadas com ${res.profile?.email || 'sua conta'}.`
        });
        // Atualiza a visualização da agenda no HUD
        handleSendMessage('qual a minha agenda de hoje?');
      } else {
        if (res.error === 'CLIENT_ID_REQUIRED') {
          setGoogleModalOpen(true);
        } else {
          toast({
            variant: 'destructive',
            title: 'Falha na conexão Google',
            description: res.message || 'Não foi possível autorizar o acesso.'
          });
        }
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro inesperado',
        description: err?.message || 'Falha ao autenticar com o Google.'
      });
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  // Sincronização ao vivo da agenda e tarefas
  const handleSyncGoogle = async () => {
    setIsSyncingGoogle(true);
    try {
      const result = await pitaiGoogleService.syncFromGoogleLive();
      toast({
        title: 'Sincronização Concluída',
        description: `${result.calendarEventsCount} eventos da agenda e ${result.tasksCount} tarefas atualizadas com o Google.`
      });
      handleSendMessage('qual a minha agenda de hoje?');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro de sincronização',
        description: 'Não foi possível buscar os dados mais recentes do Google Workspace.'
      });
    } finally {
      setIsSyncingGoogle(false);
    }
  };

  // Desconectar Google
  const handleDisconnectGoogle = () => {
    pitaiGoogleService.clearToken();
    setGoogleConnected(false);
    setGoogleUser(null);
    setGoogleModalOpen(false);
    toast({
      title: 'Google Workspace Desconectado',
      description: 'O PIT.AI voltou a utilizar o armazenamento local e na VPS.'
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black relative overflow-x-hidden font-sans">
      
      {/* Proteção de Área Interna & Metadados (Regra de SEO) */}
      <Helmet>
        <title>PIT.AI | Centro de Inteligência Executiva</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Grid Cibernético Sutil & Luzes Volumétricas de Fundo */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Topbar de Telemetria & Status Executivo */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-white font-mono">
                PIT.AI
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Centro de Comando & Inteligência Operacional • Rafael Pita
            </p>
          </div>
        </div>

        {/* Telemetria e Controles */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Brasília:</span>
            <strong className="text-slate-200">{currentTime || '--:--:--'}</strong>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VPS Hostinger:</span>
            <strong className="text-emerald-400">100%</strong>
          </div>

          {/* Conexão Google Workspace (Agenda & Tasks) */}
          {googleConnected ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-emerald-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px] truncate max-w-[150px]">
                {googleUser?.email || 'Google Conectado'}
              </span>
              <button
                type="button"
                onClick={handleSyncGoogle}
                disabled={isSyncingGoogle}
                title="Sincronizar Agenda e Tarefas agora"
                className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(true)}
                title="Opções da conta Google"
                className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
              >
                <Key className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
              title="Conectar sua Google Agenda e Google Tarefas"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Conectar Google</span>
            </button>
          )}

          {/* Alternador de Áudio */}
          <button
            type="button"
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              if (!next) pitaiVoiceService.stopSpeaking();
            }}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs ${
              audioEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={audioEnabled ? 'Áudio ativado (fala ativada)' : 'Áudio mudo'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioEnabled ? 'Voz Ativa' : 'Voz Mudo'}</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal — Orbe Central e Interações */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between space-y-6">
        
        {/* Orbe Holográfico no Topo Central */}
        <div className="flex flex-col items-center justify-center pt-2">
          <PitAiOrb
            status={status}
            isListening={isListening}
            onToggleMic={handleToggleMic}
          />
        </div>

        {/* Projeção Visual Generativa do HUD (Mapas, Notícias, Agenda) */}
        <PitAiVisualFeed
          payload={visualPayload}
          onResolveConflict={handleResolveConflict}
          onRefreshBriefing={() => handleSendMessage('atualiza o briefing')}
        />

        {/* Linha de Conversação e Mensagens */}
        <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[380px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-100 rounded-br-none'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 rounded-bl-none backdrop-blur-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/5 pb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400">
                      {msg.role === 'user' ? 'Rafael Pita' : 'PIT.AI'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatBottomRef} />
        </div>

        {/* Comandos Rápidos em 1 Clique */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => handleSendMessage('O que tem de novo?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            <span>O que tem de novo?</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Qual a minha agenda de hoje?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Minha agenda de hoje</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Notícias de segurança do Rio de Janeiro')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Segurança no Rio de Janeiro</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Marca reunião amanhã às 15h')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agendar reunião</span>
          </button>
        </div>

        {/* Barra de Entrada (Input + Voz) */}
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Fale ou digite sua ordem para o PIT.AI..."
              className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500/60 rounded-2xl py-3.5 pl-4 pr-24 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-2xl backdrop-blur-xl"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isListening ? 'Parar escuta' : 'Falar pelo microfone'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
                title="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

      </main>

      {/* Footer Minimalista */}
      <footer className="relative z-10 border-t border-slate-900/80 px-4 py-2.5 text-center text-[10px] font-mono text-slate-600">
        <span>PIT.AI v1.0 • Rafael Pita Solutions • Conectado à VPS e Google Workspace</span>
      </footer>

      {/* Modal de Conexão com Google Workspace (Agenda & Tasks) */}
      <AnimatePresence>
        {googleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-slate-200"
            >
              {/* Header do Modal */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Google Workspace</span>
                      {googleConnected && (
                        <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          Conectado
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Sincronização ao vivo com Google Agenda e Google Tarefas
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status da Conta Conectada */}
              {googleConnected ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                      <Check className="w-4 h-4" />
                      <span>Conta Ativa e Sincronizada</span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">
                      {googleUser?.email || 'rafaelpita...'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Seus comandos de voz para criar, listar e reagendar compromissos ou tarefas estão sendo refletidos diretamente na nuvem oficial da Google e salvos na VPS.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleSyncGoogle}
                      disabled={isSyncingGoogle}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGoogle ? 'animate-spin' : ''}`} />
                      <span>{isSyncingGoogle ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDisconnectGoogle}
                      className="py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Desconectar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 block">
                      Google OAuth Client ID:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={clientIdInput}
                        onChange={(e) => setClientIdInput(e.target.value)}
                        placeholder="Ex: 123456789-abcdef.apps.googleusercontent.com"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-slate-500 outline-none font-mono"
                      />
                      <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Instruções Rápidas de Configuração */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-[11px] space-y-2 text-slate-400">
                    <p className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Como obter seu Client ID gratuito (Google Cloud):</span>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
                      <li>Acesse o <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-medium inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-2.5 h-2.5" /></a> e crie um <strong>ID do cliente OAuth (Aplicativo da Web)</strong>.</li>
                      <li>Ative as APIs <strong>Google Calendar API</strong> e <strong>Google Tasks API</strong> na biblioteca.</li>
                      <li>Adicione nas origens autorizadas: <code className="text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded font-mono">http://localhost:3001</code> e <code className="text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded font-mono">https://pitai.rafaelpitaoficial.com.br</code>.</li>
                    </ol>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleConnectGoogle()}
                      disabled={isConnectingGoogle}
                      className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {isConnectingGoogle ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Conectando com o Google...</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Autorizar e Conectar Conta Google</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
