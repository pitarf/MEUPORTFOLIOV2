/**
 * PIT.AI — Serviço de Voz Integrado & Conversação Contínua com Debounce Inteligente
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gerencia a escuta vocal (Web Speech Recognition) com detecção inteligente de pausas
 * de pensamento (Speech Debounce / Silence Detection de 2.2 segundos).
 * 
 * Proteções ativas:
 * - Previne loops infinitos de abertura e fechamento de microfone.
 * - Impede que o microfone abra sozinho na inicialização da página.
 * - Só reabre o microfone em modo contínuo se a sessão foi ativamente iniciada pelo usuário.
 * - Desliga pacificamente após timeout de silêncio (sem insistência ou travamento de UI).
 */

import { pitaiTtsService } from './pitaiTtsService.js';
import { pitaiSoundFxService } from './pitaiSoundFxService.js';
import { pitaiAudioVisualizerService } from './pitaiAudioVisualizerService.js';

const STORAGE_SILENCE_DELAY_KEY = 'pitai_voice_silence_delay_ms';
const DEFAULT_SILENCE_DELAY_MS = 2200; // 2.2 segundos de pausa para concluir pensamento

class PitAiVoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.continuousMode = false; // Padrão seguro: ativado voluntariamente pelo usuário
    this.userInitiatedVoice = false; // Só reabre automaticamente se o usuário iniciou a conversa por voz
    this.silenceDelayMs = DEFAULT_SILENCE_DELAY_MS;
    this.silenceTimer = null;
    this.accumulatedText = '';

    this.onTranscriptCallback = null;
    this.onStatusChangeCallback = null;
    this.onSpeechEndCallback = null;
    this.autoRestartTimer = null;
    this.isStarting = false;

    if (typeof window !== 'undefined') {
      const savedDelay = localStorage.getItem(STORAGE_SILENCE_DELAY_KEY);
      if (savedDelay) {
        this.silenceDelayMs = Number(savedDelay) || DEFAULT_SILENCE_DELAY_MS;
      }

      this.initRecognition();
      pitaiTtsService.bindCallbacks({
        onStatusChange: (status) => {
          this.isSpeaking = status === 'speaking';
          this.notifyStatus(status);
        },
        onSpeechEnd: () => {
          this.isSpeaking = false;
          if (this.onSpeechEndCallback) this.onSpeechEndCallback();

          // Só reabre o microfone se:
          // 1. O modo contínuo estiver ativado
          // 2. A sessão de voz foi iniciada pelo usuário (NUNCA na saudação inicial do sistema)
          if (this.continuousMode && this.userInitiatedVoice) {
            this.scheduleAutoListen(600);
          } else {
            this.userInitiatedVoice = false;
            this.notifyStatus('idle');
          }
        }
      });
    }
  }

  getSilenceDelay() {
    return this.silenceDelayMs;
  }

  setSilenceDelay(ms) {
    this.silenceDelayMs = Math.max(1200, Math.min(5000, Number(ms) || DEFAULT_SILENCE_DELAY_MS));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SILENCE_DELAY_KEY, String(this.silenceDelayMs));
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[PIT.AI Voice] Reconhecimento de voz não suportado nativamente neste navegador.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'pt-BR';
      // Mantém escuta contínua durante a fala do usuário para não cortar na respiração
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isStarting = false;
        this.isListening = true;
        this.notifyStatus('listening');
      };

      this.recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }

        const cleanText = fullTranscript.trim();
        this.accumulatedText = cleanText;

        // Notifica o texto intermediário para renderizar em tempo real no input
        if (this.onTranscriptCallback && cleanText) {
          this.onTranscriptCallback({
            text: cleanText,
            interim: cleanText,
            final: cleanText,
            isFinal: false,
            isSpeechComplete: false
          });
        }

        // Reinicia o temporizador de silêncio: se o usuário parar de falar pelo tempo configurado, encerra e envia
        this.resetSilenceTimer();
      };

      this.recognition.onerror = (event) => {
        this.isStarting = false;
        const errType = event?.error || 'unknown';
        console.warn('[PIT.AI Voice] Evento de reconhecimento:', errType);

        // Se for apenas silêncio inicial ('no-speech'), NÃO encerra abruptamente
        if (errType === 'no-speech') {
          // Mantém a intenção de voz ativa; o onend tentará manter a escuta se o usuário ainda não falou
          return;
        }

        // Se o usuário recusou a permissão no navegador
        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          this.continuousMode = false;
          this.userInitiatedVoice = false;
          this.isListening = false;
          pitaiAudioVisualizerService.stopMicVisualizer();
          this.notifyStatus('idle');
          if (this.onTranscriptCallback) {
            this.onTranscriptCallback({
              error: 'PERMISSION_DENIED',
              message: 'Acesso ao microfone bloqueado no navegador. Permita o microfone nas configurações do site.'
            });
          }
          return;
        }

        // Outros erros transitórios (ex: network, audio-capture)
        this.isListening = false;
        this.userInitiatedVoice = false;
        pitaiAudioVisualizerService.stopMicVisualizer();
        this.notifyStatus('idle');
      };

      this.recognition.onend = () => {
        this.isStarting = false;

        // Se tiver texto acumulado pendente que ainda não foi enviado, conclui e envia
        if (this.accumulatedText && this.accumulatedText.length >= 2) {
          this.isListening = false;
          pitaiAudioVisualizerService.stopMicVisualizer();
          this.commitSpeech();
          return;
        }

        // Se o usuário iniciou a voz e o Chrome fechou por silêncio curto ('no-speech'), reabre suavemente
        if (this.userInitiatedVoice && !this.isSpeaking) {
          try {
            this.recognition.start();
            return;
          } catch {
            // Se falhar ao manter, desliga pacificamente
          }
        }

        this.isListening = false;
        this.userInitiatedVoice = false;
        pitaiAudioVisualizerService.stopMicVisualizer();
        if (!this.isSpeaking) {
          this.notifyStatus('idle');
        }
      };
    } catch (err) {
      console.warn('[PIT.AI Voice] Erro ao instanciar SpeechRecognition:', err);
    }
  }

  /**
   * Reseta o temporizador de silêncio a cada som captado
   */
  resetSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }

    if (!this.accumulatedText || this.accumulatedText.length < 2) return;

    this.silenceTimer = setTimeout(() => {
      this.commitSpeech();
    }, this.silenceDelayMs);
  }

  /**
   * Conclui a fala após a pausa de pensamento e dispara o processamento
   */
  commitSpeech() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    const textToCommit = (this.accumulatedText || '').trim();
    this.accumulatedText = '';

    if (textToCommit && textToCommit.length >= 2 && this.onTranscriptCallback) {
      // Toca o efeito sutil sci-fi de comando aceito/reconhecido
      pitaiSoundFxService.playAcknowledge();

      this.onTranscriptCallback({
        text: textToCommit,
        interim: textToCommit,
        final: textToCommit,
        isFinal: true,
        isSpeechComplete: true
      });
    }

    // Para a escuta ativa para liberar os canais enquanto a IA pensa
    this.stopListening(false);
  }

  /**
   * Reabre o microfone em modo contínuo de forma suave após a IA responder
   */
  scheduleAutoListen(delayMs = 600) {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    if (!this.continuousMode || !this.userInitiatedVoice || this.isSpeaking) return;

    this.autoRestartTimer = setTimeout(() => {
      if (!this.isSpeaking && !this.isListening) {
        try {
          this.startListening({ isAuto: true });
        } catch {
          this.userInitiatedVoice = false;
          this.notifyStatus('idle');
        }
      }
    }, delayMs);
  }

  bindCallbacks({ onTranscript, onStatusChange, onSpeechEnd }) {
    this.onTranscriptCallback = onTranscript;
    this.onStatusChangeCallback = onStatusChange;
    this.onSpeechEndCallback = onSpeechEnd;
  }

  notifyStatus(status) {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  setContinuousMode(enabled) {
    this.continuousMode = enabled;
    if (!enabled) {
      if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
      this.userInitiatedVoice = false;
    }
  }

  /**
   * Inicia a escuta do microfone
   * @param {Object} options
   * @param {boolean} options.isAuto - Se foi disparado pelo modo contínuo
   */
  startListening({ isAuto = false } = {}) {
    if (!this.recognition) {
      throw new Error('Reconhecimento de voz não suportado.');
    }
    if (this.isListening || this.isStarting) {
      return;
    }
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    this.isStarting = true;
    this.accumulatedText = '';
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);

    // Marca que a sessão de voz foi iniciada pelo usuário
    this.userInitiatedVoice = true;

    // Só toca o som de ativação holográfica se for clique/espaço manual (não toca em reaberturas automáticas)
    if (!isAuto) {
      pitaiSoundFxService.playActivate();
    }

    // Conecta o analisador de áudio do microfone para o Arc Reactor
    pitaiAudioVisualizerService.startMicVisualizer().catch(() => {});

    try {
      this.recognition.start();
    } catch (err) {
      this.isStarting = false;
      this.isListening = false;
      // Se der erro ao iniciar, não tenta de novo automaticamente
      console.warn('[PIT.AI Voice] start() cancelado ou já ativo:', err.message);
    }
  }

  /**
   * Encerra a escuta do microfone
   * @param {boolean} resetUserVoice - Se deve resetar a intenção de conversa por voz
   */
  stopListening(resetUserVoice = true) {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.accumulatedText = '';
    this.isStarting = false;

    if (resetUserVoice) {
      this.userInitiatedVoice = false;
    }

    // Encerra visualizador do microfone
    pitaiAudioVisualizerService.stopMicVisualizer();

    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {
      // Ignore
    }
    this.isListening = false;
  }

  speak(text) {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.stopListening(false);
    return pitaiTtsService.speak(text);
  }

  stopSpeaking() {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    pitaiTtsService.stop();
    this.isSpeaking = false;
  }
}

export const pitaiVoiceService = new PitAiVoiceService();
export default pitaiVoiceService;
