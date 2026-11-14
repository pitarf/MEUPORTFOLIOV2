/**
 * PIT.AI — Serviço de Voz Nativo (Web Speech API)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Gerencia a escuta vocal (SpeechRecognition) e a síntese de fala (SpeechSynthesis)
 * em português do Brasil com latência zero e custo R$ 0,00 de APIs externas.
 */

class PitAiVoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.isSpeaking = false;
    this.selectedVoice = null;
    this.onTranscriptCallback = null;
    this.onStatusChangeCallback = null;
    this.onSpeechEndCallback = null;

    if (typeof window !== 'undefined') {
      this.initRecognition();
      this.initVoices();
    }
  }

  /**
   * Inicializa o mecanismo de reconhecimento de voz do navegador
   */
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('[PIT.AI Voice] Reconhecimento de voz não suportado neste navegador.');
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
      console.warn('[PIT.AI Voice] Erro de captura vocal:', event.error);
      this.isListening = false;
      this.notifyStatus('idle');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notifyStatus('idle');
    };
  }

  /**
   * Carrega a melhor voz disponível no navegador para Português do Brasil
   */
  initVoices() {
    if (!this.synthesis) return;

    const pickBestVoice = () => {
      const voices = this.synthesis.getVoices();
      // Procura primeiro por vozes neurais / naturais do Chrome/Edge (Microsoft Daniel, Google português, etc.)
      const ptBrVoices = voices.filter(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
      
      const naturalVoice = ptBrVoices.find(v => 
        v.name.toLowerCase().includes('natural') || 
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('antonio')
      );

      this.selectedVoice = naturalVoice || ptBrVoices[0] || voices.find(v => v.lang.startsWith('pt')) || null;
    };

    pickBestVoice();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = pickBestVoice;
    }
  }

  /**
   * Registra callbacks de transcrição e status
   */
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

  /**
   * Inicia a escuta do microfone
   */
  startListening() {
    if (!this.recognition) {
      throw new Error('Reconhecimento de voz não disponível.');
    }
    if (this.isSpeaking) {
      this.stopSpeaking();
    }
    try {
      this.recognition.start();
    } catch (e) {
      // Já pode estar rodando
      console.debug('[PIT.AI Voice] Recognition start ignorado (já ativo).');
    }
  }

  /**
   * Para a escuta do microfone
   */
  stopListening() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Fala uma mensagem em português do Brasil no tom executivo
   * @param {string} text - Texto a ser falado
   * @param {number} rate - Velocidade da fala (padrão 1.05 para fala executiva ágil)
   */
  speak(text, rate = 1.05) {
    if (!this.synthesis) return Promise.resolve();

    this.stopSpeaking();

    // Limpa tags HTML ou marcações markdown antes de falar
    const cleanText = text
      .replace(/<[^>]*>?/gm, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link anexo')
      .trim();

    if (!cleanText) return Promise.resolve();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = rate;
      utterance.pitch = 0.98; // Tom ligeiramente grave e sóbrio

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.notifyStatus('speaking');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.notifyStatus('idle');
        if (this.onSpeechEndCallback) this.onSpeechEndCallback();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('[PIT.AI Voice] Erro na síntese de fala:', e);
        this.isSpeaking = false;
        this.notifyStatus('idle');
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Interrompe qualquer fala em andamento imediatamente
   */
  stopSpeaking() {
    if (!this.synthesis) return;
    try {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.notifyStatus('idle');
    } catch (e) {
      // Ignore
    }
  }
}

export const pitaiVoiceService = new PitAiVoiceService();
export default pitaiVoiceService;
