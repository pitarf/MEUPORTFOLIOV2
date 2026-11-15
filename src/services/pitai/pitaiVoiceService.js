/**
 * PIT.AI — Serviço de Voz Integrado & Conversação Contínua
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gerencia a escuta vocal (Web Speech Recognition) e delega a síntese
 * ao pitaiTtsService (com suporte a ElevenLabs e Vozes Neurais Naturais).
 * Inclui o modo "Conversação Contínua" (Live / J.A.R.V.I.S.) onde o microfone
 * reabre automaticamente após a IA responder.
 */

import { pitaiTtsService } from './pitaiTtsService.js';

class PitAiVoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.continuousMode = true; // Conversação contínua por padrão
    this.onTranscriptCallback = null;
    this.onStatusChangeCallback = null;
    this.onSpeechEndCallback = null;
    this.autoRestartTimer = null;

    if (typeof window !== 'undefined') {
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

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[PIT.AI Voice] Reconhecimento de voz não suportado nativamente neste navegador.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notifyStatus('listening');
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (this.onTranscriptCallback) {
        this.onTranscriptCallback({
          interim,
          final: finalTranscript,
          isFinal: Boolean(finalTranscript)
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('[PIT.AI Voice] Aviso de captura vocal:', event.error);
      this.isListening = false;
      if (event.error === 'not-allowed') {
        this.continuousMode = false;
        this.notifyStatus('idle');
      } else if (this.continuousMode && !this.isSpeaking) {
        // Reinicia em silêncio após breve pausa
        this.scheduleAutoListen(600);
      } else {
        this.notifyStatus('idle');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (!this.isSpeaking) {
        this.notifyStatus('idle');
      }
    };
  }

  scheduleAutoListen(delayMs = 450) {
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
    try {
      this.recognition.start();
    } catch {
      // Já ativo
    }
  }

  stopListening() {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
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
    this.stopListening();
    return pitaiTtsService.speak(text);
  }

  stopSpeaking() {
    if (this.autoRestartTimer) clearTimeout(this.autoRestartTimer);
    pitaiTtsService.stop();
    this.isSpeaking = false;
  }
}

export const pitaiVoiceService = new PitAiVoiceService();
export default pitaiVoiceService;
