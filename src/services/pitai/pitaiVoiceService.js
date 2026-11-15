/**
 * PIT.AI — Serviço de Voz Integrado & Conversação Contínua com Debounce Inteligente
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gerencia a escuta vocal (Web Speech Recognition) com detecção inteligente de pausas
 * de pensamento (Speech Debounce / Silence Detection de 2.2 segundos), impedindo que o
 * assistente corte o usuário no meio da frase enquanto ele ainda está elaborando a ideia.
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
    this.continuousMode = true; // Conversação contínua por padrão
    this.silenceDelayMs = DEFAULT_SILENCE_DELAY_MS;
    this.silenceTimer = null;
    this.accumulatedText = '';

    this.onTranscriptCallback = null;
    this.onStatusChangeCallback = null;
    this.onSpeechEndCallback = null;
    this.autoRestartTimer = null;

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
          // Se estiver em modo contínuo, reabre o microfone suavemente para o usuário continuar falando
          if (this.continuousMode) {
            this.scheduleAutoListen();
          } else {
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

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    // Habilita captura contínua para não desligar o microfone nas pausas de respiração
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
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

      // Reinicia o temporizador de silêncio: se o usuário parar de falar por 2.2s, encerra e envia
      this.resetSilenceTimer();
    };

    this.recognition.onerror = (event) => {
      console.warn('[PIT.AI Voice] Aviso de captura vocal:', event.error);
      if (event.error === 'not-allowed') {
        this.continuousMode = false;
        this.isListening = false;
        this.notifyStatus('idle');
      } else if (event.error === 'no-speech') {
        // Silêncio sem detecção: mantém ativo se contínuo
      } else {
        this.isListening = false;
        if (this.continuousMode && !this.isSpeaking) {
          this.scheduleAutoListen(700);
        } else {
          this.notifyStatus('idle');
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      // Se tiver texto acumulado pendente que ainda não foi enviado
      if (this.accumulatedText && this.accumulatedText.length >= 2) {
        this.commitSpeech();
      } else if (!this.isSpeaking) {
        this.notifyStatus('idle');
      }
    };
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

    // Se não estiver em modo contínuo, para a escuta
    if (!this.continuousMode) {
      this.stopListening();
    }
  }

  scheduleAutoListen(delayMs = 500) {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    if (!this.continuousMode || this.isSpeaking) return;

    this.autoRestartTimer = setTimeout(() => {
      if (!this.isSpeaking && !this.isListening) {
        try {
          this.startListening();
        } catch {
          // Ignore
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
    }
  }

  startListening() {
    if (!this.recognition) {
      throw new Error('Reconhecimento de voz não suportado.');
    }
    if (this.isSpeaking) {
      this.stopSpeaking();
    }
    this.accumulatedText = '';
    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    // Efeito de abertura de canal holográfico e conexão do analisador de áudio do microfone
    pitaiSoundFxService.playActivate();
    pitaiAudioVisualizerService.startMicVisualizer().catch(() => {});

    try {
      this.recognition.start();
    } catch {
      // Já ativo
    }
  }

  stopListening() {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.accumulatedText = '';

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
    this.stopListening();
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
