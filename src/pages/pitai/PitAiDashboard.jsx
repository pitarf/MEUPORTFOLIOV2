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
  ExternalLink,
  Settings,
  Sliders,
  Globe,
  Play,
  Flame
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PitAiOrb from '@/components/pitai/PitAiOrb';
import PitAiVisualFeed from '@/components/pitai/PitAiVisualFeed';
import { pitaiVoiceService } from '@/services/pitai/pitaiVoiceService';
import { pitaiTtsService, ELEVENLABS_VOICES } from '@/services/pitai/pitaiTtsService';
import { pitaiCoreService } from '@/services/pitai/pitaiCoreService';
import { pitaiBriefingService } from '@/services/pitai/pitaiBriefingService';
import { pitaiGoogleService } from '@/services/pitai/pitaiGoogleService';

export default function PitAiDashboard() {
  const { toast } = useToast();

  // Estados do Core e Voz
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'thinking' | 'speaking'
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [continuousMode, setContinuousMode] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [visualPayload, setVisualPayload] = useState({ type: 'none', data: {} });
  const [currentTime, setCurrentTime] = useState('');

  // Modais de Configuração
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'brain'

  // Configurações de Voz (TTS)
  const [ttsMode, setTtsMode] = useState(() => pitaiTtsService.getMode());
  const [elevenKey, setElevenKey] = useState(() => pitaiTtsService.getElevenLabsKey());
  const [elevenVoiceId, setElevenVoiceId] = useState(() => pitaiTtsService.getElevenLabsVoiceId());
  const [browserVoices, setBrowserVoices] = useState([]);
  const [selectedBrowserVoiceUri, setSelectedBrowserVoiceUri] = useState(() => pitaiTtsService.getBrowserVoiceUri());
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  // Configurações do Gemini (Brain)
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => pitaiCoreService.getApiKey());
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState(null); // 'ok' | 'error' | null

  // Estados do Google Workspace (Agenda & Tasks)
  const [googleConnected, setGoogleConnected] = useState(() => pitaiGoogleService.isConnected());
  const [googleUser, setGoogleUser] = useState(() => pitaiGoogleService.getStoredUserProfile());
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(() => pitaiGoogleService.getClientId());
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);

  const chatBottomRef = useRef(null);

  // Carrega vozes neurais instaladas no navegador
  useEffect(() => {
    const updateVoices = () => {
      const voices = pitaiTtsService.getAvailableBrowserVoices();
      setBrowserVoices(voices);
      if (!selectedBrowserVoiceUri && voices.length > 0) {
        setSelectedBrowserVoiceUri(voices[0].voiceURI);
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedBrowserVoiceUri]);

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
    pitaiVoiceService.setContinuousMode(continuousMode);

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
        if (!continuousMode) {
          setStatus('idle');
          setIsListening(false);
        }
      }
    });

    // Mensagem de boas-vindas inicial estilo J.A.R.V.I.S.
    const initialWelcome = {
      id: 'welcome',
      role: 'assistant',
      text: 'Olá, Rafael. Sistemas operacionais e conectados à internet em tempo real. Como posso auxiliar suas operações hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialWelcome]);

    // Fala inicial se áudio ativado
    let welcomeTimer = null;
    if (audioEnabled) {
      welcomeTimer = setTimeout(() => {
        pitaiVoiceService.speak('Olá, Rafael. Sistemas operacionais e conectados.');
      }, 500);
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
          description: 'Permita o acesso ao microfone no seu navegador para utilizar os comandos vocais.'
        });
      }
    }
  };

  // Alterna o modo contínuo de conversação
  const handleToggleContinuous = () => {
    const next = !continuousMode;
    setContinuousMode(next);
    pitaiVoiceService.setContinuousMode(next);
    toast({
      title: next ? 'Modo Contínuo Ativado' : 'Modo Manual Ativado',
      description: next
        ? 'O PIT.AI reabrirá o microfone automaticamente após responder para conversa fluida ininterrupta.'
        : 'O microfone aguardará seu clique ou barra de espaço para falar.'
    });
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
      console.warn('[PIT.AI Dashboard] Erro no processamento:', err);
      const fallbackMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: 'Rafael, houve uma intermitência momentânea no processador. Os subsistemas continuam ativos.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setStatus('idle');
    }
  };

  // Testar a Voz no Modal de Configurações
  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    pitaiVoiceService.stopSpeaking();
    try {
      const sampleText = 'Olá, Rafael. Este é o meu novo tom de voz executivo para o centro de inteligência PIT.AI.';
      await pitaiTtsService.speak(sampleText);
    } finally {
      setIsTestingVoice(false);
    }
  };

  // Salvar Configurações de Voz
  const handleSaveVoiceSettings = () => {
    pitaiTtsService.setMode(ttsMode);
    pitaiTtsService.setElevenLabsKey(elevenKey);
    pitaiTtsService.setElevenLabsVoiceId(elevenVoiceId);
    pitaiTtsService.setBrowserVoiceUri(selectedBrowserVoiceUri);
    toast({
      title: 'Configurações de Voz Salvas',
      description: `Motor ativo: ${ttsMode === 'elevenlabs' ? 'ElevenLabs (Ultra-Humana)' : 'Neural do Navegador'}.`
    });
  };

  // Testar Chave do Gemini
  const handleTestGeminiKey = async () => {
    setIsTestingGemini(true);
    setGeminiStatus(null);
    try {
      const key = geminiKeyInput.trim();
      if (!key) {
        setGeminiStatus('error');
        toast({ variant: 'destructive', title: 'Chave Vazia', description: 'Insira sua chave da API do Google Gemini.' });
        return;
      }
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Responda OK' }] }] })
      });
      if (res.ok) {
        setGeminiStatus('ok');
        pitaiCoreService.setApiKey(key);
        toast({ title: 'Gemini 2.0 Flash Conectado', description: 'A chave foi validada com sucesso e salva no PIT.AI.' });
      } else {
        setGeminiStatus('error');
        const errData = await res.json();
        toast({ variant: 'destructive', title: 'Falha na Validação', description: errData.error?.message || 'Chave rejeitada.' });
      }
    } catch (e) {
      setGeminiStatus('error');
      toast({ variant: 'destructive', title: 'Erro de Conexão', description: e.message });
    } finally {
      setIsTestingGemini(false);
    }
  };

  // Salvar Chave do Gemini
  const handleSaveGeminiKey = () => {
    pitaiCoreService.setApiKey(geminiKeyInput.trim());
    toast({ title: 'Configurações Salvas', description: 'Chave do Gemini atualizada com sucesso.' });
  };

  // Conectar com Google Workspace
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      if (clientIdInput && clientIdInput !== pitaiGoogleService.getClientId()) {
        pitaiGoogleService.setClientId(clientIdInput.trim());
      }
      const res = await pitaiGoogleService.requestAccessTokenInteractive();
      if (res.success) {
        setGoogleConnected(true);
        setGoogleUser(res.userProfile);
        setGoogleModalOpen(false);
        toast({
          title: 'Google Workspace Conectado',
          description: `Sincronizado como ${res.userProfile?.email || 'Rafael Pita'}.`
        });
        handleSyncGoogle();
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha na conexão Google',
          description: res.message || 'Não foi possível autorizar o acesso.'
        });
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

  // Sincronização Google
  const handleSyncGoogle = async () => {
    setIsSyncingGoogle(true);
    try {
      const result = await pitaiGoogleService.syncFromGoogleLive();
      toast({
        title: 'Sincronização Concluída',
        description: `${result.calendarEventsCount} eventos da agenda e ${result.tasksCount} tarefas sincronizadas.`
      });
      handleSendMessage('qual a minha agenda de hoje?');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro de sincronização',
        description: 'Não foi possível buscar os dados do Google Workspace.'
      });
    } finally {
      setIsSyncingGoogle(false);
    }
  };

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
      
      {/* Proteção de Área Interna & Metadados */}
      <Helmet>
        <title>PIT.AI | Centro de Inteligência Executiva</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Grid Cibernético & Iluminação */}
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
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono hidden md:inline-flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                WEB LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Centro de Comando & Inteligência Operacional • Rafael Pita
            </p>
          </div>
        </div>

        {/* Telemetria e Controles */}
        <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Brasília:</span>
            <strong className="text-slate-200">{currentTime || '--:--:--'}</strong>
          </div>

          {/* Alternador Modo Contínuo (Live / Sempre Ouvindo) */}
          <button
            type="button"
            onClick={handleToggleContinuous}
            className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              continuousMode
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={continuousMode ? 'Modo Contínuo J.A.R.V.I.S. Ativo (o microfone reabre sozinho)' : 'Modo Manual'}
          >
            <span className={`w-2 h-2 rounded-full ${continuousMode ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            <span className="hidden sm:inline">{continuousMode ? 'Modo Live: Contínuo' : 'Modo: Manual'}</span>
          </button>

          {/* Conexão Google Workspace */}
          {googleConnected ? (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-emerald-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px] truncate max-w-[130px]">
                {googleUser?.email || 'Google OK'}
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
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
              title="Conectar Google Agenda e Tarefas"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Google</span>
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
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={audioEnabled ? 'Voz ativada' : 'Voz mudo'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Botão de Configurações (Voz & Cérebro) */}
          <button
            type="button"
            onClick={() => setSettingsModalOpen(true)}
            className="p-2 rounded-xl border border-slate-800 hover:border-cyan-500/40 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Ajustar Voz Humana e Cérebro Gemini"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal — Orbe Central e Interações */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between space-y-6">
        
        {/* Orbe Holográfico no Topo Central */}
        <div className="flex flex-col items-center justify-center pt-1 space-y-2">
          <PitAiOrb
            status={status}
            isListening={isListening}
            onToggleMic={handleToggleMic}
          />
          
          {/* Botão de Ativação Vocal Rápida */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`px-4 py-1.5 rounded-full border text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              isListening
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span>
              {isListening ? 'Ouvindo você... Fale agora' : 'Clique ou aperte Espaço para Falar'}
            </span>
          </button>
        </div>

        {/* Projeção Visual Generativa do HUD (Mapas, Notícias, Pesquisa Web, Agenda) */}
        <PitAiVisualFeed
          payload={visualPayload}
          onResolveConflict={() => handleSendMessage('ajuste o conflito')}
          onRefreshBriefing={() => handleSendMessage('o que tem de novo?')}
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

        {/* Comandos Rápidos em 1 Clique (Notícias, Agenda, Pesquisa em Tempo Real) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => handleSendMessage('O que tem de novo?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            <span>Briefing de Notícias</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Qual a minha agenda de hoje?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Minha Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Pesquise a cotação do dólar hoje')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cotação do Dólar</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Como está o trânsito no Rio de Janeiro agora?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trânsito no Rio</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Marca reunião amanhã às 15h')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agendar Reunião</span>
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
              placeholder="Fale ou digite para o PIT.AI (ex: 'pesquise sobre...', 'o que tem de novo?', 'minha agenda')..."
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
        <span>PIT.AI v1.1 • Rafael Pita Solutions • Pesquisa em Tempo Real e Voz Humana</span>
      </footer>

      {/* MODAL DE CONFIGURAÇÃO (VOZ & CÉREBRO) */}
      <AnimatePresence>
        {settingsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 text-slate-200"
            >
              {/* Header do Modal */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Configurações do PIT.AI
                    </h3>
                    <p className="text-xs text-slate-400">
                      Voz Humana de Alta Fidelidade e Inteligência
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Abas: Voz vs Cérebro */}
              <div className="flex border-b border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('voice')}
                  className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'voice'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Voz Humana (TTS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('brain')}
                  className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'brain'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Cérebro & Pesquisa Web</span>
                </button>
              </div>

              {/* CONTEÚDO DA ABA DE VOZ */}
              {activeTab === 'voice' && (
                <div className="space-y-4 text-xs">
                  {/* Seleção do Motor */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">Motor de Síntese de Voz:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTtsMode('elevenlabs')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          ttsMode === 'elevenlabs'
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-white text-xs">ElevenLabs</strong>
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <p className="text-[11px] text-slate-400">Voz humana ultra-realista de estúdio/cinema.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTtsMode('neural_browser')}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          ttsMode === 'neural_browser'
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-white text-xs">Voz Neural Grátis</strong>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                        <p className="text-[11px] text-slate-400">Microsoft Edge / Google Natural (sem custo).</p>
                      </button>
                    </div>
                  </div>

                  {/* Campos do ElevenLabs */}
                  {ttsMode === 'elevenlabs' && (
                    <div className="space-y-3 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-medium block">
                          Chave da API ElevenLabs (xi-api-key):
                        </label>
                        <input
                          type="password"
                          value={elevenKey}
                          onChange={(e) => setElevenKey(e.target.value)}
                          placeholder="Ex: sk_... (plano gratuito disponível em elevenlabs.io)"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white font-mono outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-medium block">Voz Executiva Selecionada:</label>
                        <select
                          value={elevenVoiceId}
                          onChange={(e) => setElevenVoiceId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white outline-none"
                        >
                          {ELEVENLABS_VOICES.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Crie sua conta gratuita em{' '}
                        <a
                          href="https://elevenlabs.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          elevenlabs.io <ExternalLink className="w-2.5 h-2.5" />
                        </a>{' '}
                        para ter 10.000 caracteres mensais com voz de estúdio cinematográfica.
                      </p>
                    </div>
                  )}

                  {/* Campos da Voz Neural do Navegador */}
                  {ttsMode === 'neural_browser' && (
                    <div className="space-y-2 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                      <label className="text-slate-300 font-medium block">
                        Voz Neural Instalada no seu Navegador:
                      </label>
                      <select
                        value={selectedBrowserVoiceUri}
                        onChange={(e) => setSelectedBrowserVoiceUri(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white outline-none"
                      >
                        {browserVoices.map((v) => (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400">
                        Filtramos as vozes antigas e robóticas do Windows (como Maria SAPI5) para selecionar as vozes naturais do Edge/Chrome.
                      </p>
                    </div>
                  )}

                  {/* Botões de Ação da Voz */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleTestVoice}
                      disabled={isTestingVoice}
                      className="py-2.5 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isTestingVoice ? 'Falando...' : 'Ouvir Demonstração'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveVoiceSettings}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 text-center"
                    >
                      Salvar Preferência de Voz
                    </button>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA DE CÉREBRO */}
              {activeTab === 'brain' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">
                      Chave da API Google Gemini (AI Studio):
                    </label>
                    <input
                      type="password"
                      value={geminiKeyInput}
                      onChange={(e) => setGeminiKeyInput(e.target.value)}
                      placeholder="Ex: AIzaSy..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2.5 px-3 text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-slate-400 text-[11px] leading-relaxed">
                    <p className="font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Como obter sua chave gratuita do Gemini em 30 segundos:</span>
                    </p>
                    <p>
                      1. Acesse o{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-0.5"
                      >
                        Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
                      </a>.
                      <br />
                      2. Clique em <strong>"Create API Key"</strong>.
                      <br />
                      3. Cole sua chave acima e clique em "Validar e Conectar".
                    </p>
                  </div>

                  {/* Status da Pesquisa Web Integrada */}
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-[11px]">
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>Pesquisa Web em Tempo Real:</strong> Ativa e operando sem limites (Google News, DuckDuckGo, Wikipédia, Diários Oficiais e COR).
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleTestGeminiKey}
                      disabled={isTestingGemini}
                      className="py-2.5 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingGemini ? 'animate-spin' : ''}`} />
                      <span>{isTestingGemini ? 'Testando...' : 'Validar e Conectar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveGeminiKey}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 text-center"
                    >
                      Salvar Chave
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                      Sincronização com Google Agenda e Google Tarefas
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
                      Seus comandos de voz para criar, listar e reagendar compromissos ou tarefas estão sendo sincronizados com o Google Agenda.
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
                        placeholder="Ex: 38604710980-...apps.googleusercontent.com"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-slate-500 outline-none font-mono"
                      />
                      <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                    </div>
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
