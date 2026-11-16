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
  Flame,
  Wallet,
  Utensils,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  DollarSign,
  CreditCard,
  CloudSun,
  AlertTriangle,
  CalendarClock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PitAiOrb from '@/components/pitai/PitAiOrb';
import PitAiVisualFeed from '@/components/pitai/PitAiVisualFeed';
import { pitaiVoiceService } from '@/services/pitai/pitaiVoiceService';
import { pitaiTtsService, ELEVENLABS_VOICES } from '@/services/pitai/pitaiTtsService';
import { pitaiSoundFxService } from '@/services/pitai/pitaiSoundFxService';
import { pitaiAudioVisualizerService } from '@/services/pitai/pitaiAudioVisualizerService';
import { pitaiCoreService } from '@/services/pitai/pitaiCoreService';
import { pitaiBriefingService } from '@/services/pitai/pitaiBriefingService';
import { pitaiGoogleService } from '@/services/pitai/pitaiGoogleService';
import { pitaiFinanceService } from '@/services/pitai/pitaiFinanceService';

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
  const [silenceDelay, setSilenceDelay] = useState(() => pitaiVoiceService.getSilenceDelay());

  // Configurações de Efeitos Sonoros Sci-Fi (SFX)
  const [sfxEnabled, setSfxEnabled] = useState(() => pitaiSoundFxService.isEnabled());
  const [sfxVolume, setSfxVolume] = useState(() => Math.round(pitaiSoundFxService.getVolume() * 100));

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

  // Estados do Grana+ (Finanças Fácil)
  const [financeUrlInput, setFinanceUrlInput] = useState(() => pitaiFinanceService.getBaseUrl());
  const [financeKeyInput, setFinanceKeyInput] = useState(() => pitaiFinanceService.getApiKey());
  const [localTxCount, setLocalTxCount] = useState(() => pitaiFinanceService.getLocalTransactions().length);

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
      onTranscript: ({ text, interim, final, isSpeechComplete }) => {
        const queryText = text || final || interim || '';
        if (queryText) {
          setInputText(queryText);
        }
        if (isSpeechComplete && queryText.trim()) {
          setInputText(queryText.trim());
          handleSendMessage(queryText.trim());
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
    pitaiSoundFxService.playAcknowledge();

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus('thinking');

    try {
      const responsePromise = pitaiCoreService.processUserInput(query, messages);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_LIMIT')), 12000)
      );

      const response = await Promise.race([responsePromise, timeoutPromise]);

      const assistantMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: response.displayText || response.spokenText,
        intent: response.intent,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      pitaiSoundFxService.playDone();

      // Atualiza a projeção visual no HUD
      if (response.visualPayload && response.visualPayload.type !== 'none') {
        setVisualPayload(response.visualPayload);
      }

      // Fala a resposta se áudio estiver ativado
      if (audioEnabled && response.spokenText) {
        setStatus('speaking');
        try {
          await pitaiVoiceService.speak(response.spokenText);
        } catch {
          // Ignore
        } finally {
          setStatus('idle');
        }
      } else {
        setStatus('idle');
      }
    } catch (err) {
      pitaiSoundFxService.playAlert();
      console.warn('[PIT.AI Dashboard] Aviso no processamento:', err?.message || err);
      const fallbackText = query.toLowerCase().includes('noticia') || query.toLowerCase().includes('rio')
        ? 'Rafael, os sistemas do Rio de Janeiro continuam operando com monitoramento ativo das vias (Avenida Brasil, Linha Vermelha e Ponte). Para ocorrências em tempo real, consulte também o Centro de Operações Rio (COR).'
        : `Rafael, registrei seu comando: "${query}". Os subsistemas de agenda, finanças e notícias continuam prontos para novas consultas.`;

      const fallbackMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);

      if (audioEnabled) {
        setStatus('speaking');
        try {
          await pitaiVoiceService.speak(fallbackText);
        } catch {
          // Ignore
        } finally {
          setStatus('idle');
        }
      } else {
        setStatus('idle');
      }
    }
  };

  // Testar a Voz no Modal de Configurações
  const handleTestVoice = async () => {
    setIsTestingVoice(true);
    pitaiVoiceService.stopSpeaking();
    try {
      const sampleText = 'Olá, Rafael. Sistemas operacionais e inteligência estratégica conectados. Este é o meu tom de voz executivo masculino.';
      await pitaiTtsService.speak(sampleText);
    } finally {
      setIsTestingVoice(false);
    }
  };

  // Salvar Configurações de Voz e Efeitos
  const handleSaveVoiceSettings = () => {
    pitaiTtsService.setMode(ttsMode);
    pitaiTtsService.setElevenLabsKey(elevenKey);
    pitaiTtsService.setElevenLabsVoiceId(elevenVoiceId);
    pitaiTtsService.setBrowserVoiceUri(selectedBrowserVoiceUri);
    pitaiVoiceService.setSilenceDelay(silenceDelay);
    pitaiSoundFxService.setEnabled(sfxEnabled);
    pitaiSoundFxService.setVolume(sfxVolume / 100);

    if (sfxEnabled) {
      pitaiSoundFxService.playDone();
    }

    toast({
      title: 'Configurações de Áudio e Voz Salvas',
      description: `Motor: ${ttsMode === 'elevenlabs' ? 'ElevenLabs' : 'Voz Neural'}. Efeitos Sci-Fi: ${sfxEnabled ? 'Ativados (' + sfxVolume + '%)' : 'Desativados'}.`
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

  // Salvar Configurações Grana+ (Finanças Fácil)
  const handleSaveFinanceConfig = () => {
    pitaiFinanceService.setBaseUrl(financeUrlInput.trim());
    pitaiFinanceService.setApiKey(financeKeyInput.trim());
    toast({
      title: 'Configurações Financeiras Salvas',
      description: 'Base URL e Chave x-api-key atualizadas com sucesso para o Grana+.'
    });
  };

  // Limpar Buffer Local de Transações
  const handleClearFinanceBuffer = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pitai_local_transactions');
      setLocalTxCount(0);
      toast({
        title: 'Buffer Local Limpo',
        description: 'O histórico de transações offline locais foi esvaziado.'
      });
    }
  };

  // Dá baixa em conta pendente diretamente pelo card visual
  const handlePayFromFeed = async (transactionId, description) => {
    try {
      pitaiSoundFxService.playAcknowledge();
      const res = await pitaiFinanceService.payTransaction(transactionId);
      toast({
        title: 'Baixa Confirmada',
        description: `Lançamento "${description || 'Conta'}" marcado como pago no Grana+.`
      });

      // Confirmação no chat
      const confirmMsg = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: `✅ **Baixa Efetuada no Grana+**\n\nO lançamento *"${description || 'Conta'}"* foi liquidado com sucesso.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, confirmMsg]);

      // Atualiza projeção visual chamando a verificação de contas
      handleSendMessage('o que tenho para pagar nos próximos 30 dias?');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Falha na baixa',
        description: err?.message || 'Não foi possível liquidar o lançamento.'
      });
    }
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
              {isListening ? 'Ouvindo você... Fale no seu ritmo (pausas permitidas)' : 'Clique ou aperte Espaço para Falar'}
            </span>
          </button>
        </div>

        {/* Projeção Visual Generativa do HUD (Telemetria Climática, Mapas, Notícias, Pesquisa Web, Agenda, Finanças) */}
        <PitAiVisualFeed
          payload={visualPayload}
          onResolveConflict={() => handleSendMessage('ajuste o conflito')}
          onRefreshBriefing={() => handleSendMessage('o que tem de novo?')}
          onRefreshWeather={() => handleSendMessage('como está o tempo no Rio agora?')}
          onPayTransaction={handlePayFromFeed}
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

            {status === 'thinking' && (
              <motion.div
                key="thinking_indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-start"
              >
                <div className="max-w-md p-3.5 rounded-2xl rounded-bl-none bg-slate-900/90 border border-cyan-500/30 text-slate-200 shadow-xl backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400">
                      PIT.AI Processando
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    <span>Consultando sistemas e dados em tempo real...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatBottomRef} />
        </div>

        {/* Comandos Rápidos em 1 Clique (Notícias, Agenda, Pesquisa em Tempo Real) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => handleSendMessage('Como está o tempo no Rio agora?')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all flex items-center gap-1.5 shrink-0 font-semibold"
          >
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            <span>Clima no Rio</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Quais são as notícias do Rio de Janeiro?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Notícias do Rio</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('O que tem de novo?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
            <span>Briefing Geral</span>
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
            onClick={() => handleSendMessage('Gastei R$ 48 no almoço')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Utensils className="w-3.5 h-3.5 text-rose-400" />
            <span>Almoço R$ 48</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Recebi R$ 3.500 de cliente PJ')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Receita PJ R$ 3.5k</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Guardar R$ 400 na caixinha inter')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reserva R$ 400</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('O que tenho para pagar nos próximos 30 dias?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <CalendarClock className="w-3.5 h-3.5 text-rose-400" />
            <span>Contas a Pagar</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('O que tenho a receber este mês?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Contas a Receber</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Tenho alguma conta atrasada?')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Contas Atrasadas</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage('Consultar meus gastos recentes')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Gastos</span>
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

                <button
                  type="button"
                  onClick={() => setActiveTab('finance')}
                  className={`pb-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'finance'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Finanças Grana+</span>
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
                        Voz Neural Masculina Selecionada (J.A.R.V.I.S.):
                      </label>
                      <select
                        value={selectedBrowserVoiceUri}
                        onChange={(e) => setSelectedBrowserVoiceUri(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white outline-none"
                      >
                        {browserVoices.map((v) => (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            🎙️ {v.name} (Masculina Executiva)
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400">
                        Voz masculina calibrada com tom grave e cadência executiva estilo J.A.R.V.I.S., eliminando vozes femininas e sintetizadores robóticos mecânicos.
                      </p>
                    </div>
                  )}

                  {/* Tempo de Espera / Pausa para Pensar */}
                  <div className="space-y-1.5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-medium block">
                        Pausa para Pensar (Detecção de Silêncio):
                      </label>
                      <span className="text-cyan-400 font-mono font-bold text-xs">
                        {(silenceDelay / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <select
                      value={silenceDelay}
                      onChange={(e) => setSilenceDelay(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white outline-none"
                    >
                      <option value={1500}>1.5 segundos — Resposta Rápida</option>
                      <option value={2200}>2.2 segundos — Pausa Natural (Recomendado)</option>
                      <option value={3000}>3.0 segundos — Falar com Calma / Pensativo</option>
                      <option value={4000}>4.0 segundos — Pausas Longas</option>
                    </select>
                    <p className="text-[11px] text-slate-400">
                      Evita que o assistente corte a sua fala no meio da frase enquanto você ainda está respirando ou elaborando o pensamento.
                    </p>
                  </div>

                  {/* Efeitos Sonoros Sci-Fi Holográficos (Web Audio API) */}
                  <div className="space-y-2.5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        <label className="text-slate-200 font-semibold block text-xs">
                          Efeitos Holográficos Sci-Fi (J.A.R.V.I.S.)
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !sfxEnabled;
                          setSfxEnabled(next);
                          pitaiSoundFxService.setEnabled(next);
                          if (next) pitaiSoundFxService.playActivate();
                        }}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                          sfxEnabled
                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {sfxEnabled ? 'LIGADO' : 'DESLIGADO'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Sons táteis sintetizados em tempo real via Web Audio API pura (sem arquivos externos ou falhas de rede).
                    </p>

                    {/* Teste Rápido dos 4 Efeitos */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => pitaiSoundFxService.playActivate()}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-950 text-slate-300 hover:text-white text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                        title="Som de abertura de canal"
                      >
                        <Play className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Activate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => pitaiSoundFxService.playAcknowledge()}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 bg-slate-950 text-slate-300 hover:text-white text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                        title="Som de comando recebido"
                      >
                        <Play className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Acknowledge</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => pitaiSoundFxService.playDone()}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-[#bcf13b]/40 bg-slate-950 text-slate-300 hover:text-white text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                        title="Som de tarefa concluída"
                      >
                        <Play className="w-2.5 h-2.5 text-[#bcf13b]" />
                        <span>Done</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => pitaiSoundFxService.playAlert()}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-amber-500/40 bg-slate-950 text-slate-300 hover:text-white text-[10px] font-mono flex items-center justify-center gap-1 transition-all"
                        title="Som de alerta operacional"
                      >
                        <Play className="w-2.5 h-2.5 text-amber-400" />
                        <span>Alert</span>
                      </button>
                    </div>
                  </div>

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

              {/* CONTEÚDO DA ABA DE FINANÇAS GRANA+ */}
              {activeTab === 'finance' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2 text-cyan-300 text-[11px] leading-relaxed">
                    <Wallet className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>Módulo Jarvis Financeiro:</strong> O PIT.AI interpreta comandos informais de gastos, faturamentos, transferências e cartões e lança diretamente no seu sistema Grana+ (Finanças Fácil).
                    </div>
                  </div>

                  {/* URL da API */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">
                      Base URL da API Grana+:
                    </label>
                    <input
                      type="text"
                      value={financeUrlInput}
                      onChange={(e) => setFinanceUrlInput(e.target.value)}
                      placeholder="http://localhost:3000"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Local padrão: http://localhost:3000 ou o endereço de produção do Finanças Fácil.
                    </span>
                  </div>

                  {/* Header x-api-key */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">
                      Chave de Autenticação (x-api-key):
                    </label>
                    <input
                      type="password"
                      value={financeKeyInput}
                      onChange={(e) => setFinanceKeyInput(e.target.value)}
                      placeholder="ff_live_..."
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2 px-3 text-xs text-white font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      Header x-api-key utilizado para autorizar as chamadas POST /api/transactions.
                    </span>
                  </div>

                  {/* Mapeamentos Ativos */}
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 text-slate-400 text-[11px]">
                    <span className="font-semibold text-white block">Mapeamentos Pré-Configurados:</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <strong className="text-cyan-400">Contas:</strong>
                        <ul className="list-disc pl-3 text-slate-300 mt-0.5 space-y-0.5">
                          <li>PF (Padrão para dia a dia)</li>
                          <li>PJ (Gastos e faturamento)</li>
                          <li>Caixinha Inter (Reserva)</li>
                          <li>Dólar (Investimentos)</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-cyan-400">Cartões:</strong>
                        <ul className="list-disc pl-3 text-slate-300 mt-0.5 space-y-0.5">
                          <li>Pão de Açúcar - Itaú</li>
                          <li>Inter & Santander</li>
                          <li>Nubank Mãe & Mercado Livre</li>
                          <li>Casal & Riachuelo</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Buffer Local */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-300 font-semibold block">Buffer Local Offline:</span>
                      <span className="text-slate-500 text-[10px]">
                        {localTxCount} transações salvas localmente
                      </span>
                    </div>
                    {localTxCount > 0 && (
                      <button
                        type="button"
                        onClick={handleClearFinanceBuffer}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] transition-colors"
                      >
                        Limpar Buffer
                      </button>
                    )}
                  </div>

                  {/* Botão de Salvar */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveFinanceConfig}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 text-center"
                    >
                      Salvar Configurações Grana+
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
