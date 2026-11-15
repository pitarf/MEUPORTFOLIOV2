/**
 * PIT.AI — Serviço de Síntese de Voz Ultra-Realista (TTS Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Fornece duas camadas de voz de alta fidelidade para o PIT.AI:
 * 1. ElevenLabs API (Voz Humana de Cinema / Estúdio com respiração e entonação natural)
 * 2. Vozes Neurais do Navegador (Microsoft Antonio Neural, Google PT-BR Natural) com filtros
 *    avançados que eliminam as vozes mecânicas/antigas do Windows (como a antiga SAPI5 Maria).
 */

const STORAGE_KEY_MODE = 'pitai_tts_mode'; // 'neural_browser' | 'elevenlabs'
const STORAGE_KEY_ELEVEN_KEY = 'pitai_elevenlabs_api_key';
const STORAGE_KEY_ELEVEN_VOICE = 'pitai_elevenlabs_voice_id';
const STORAGE_KEY_BROWSER_VOICE = 'pitai_browser_voice_uri';

// Vozes recomendadas da ElevenLabs compatíveis com português brasileiro
export const ELEVENLABS_VOICES = [
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Executivo / Estilo J.A.R.V.I.S.)', gender: 'male', desc: 'Tom sóbrio, articulado, autoritativo e direto.' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Narrativo / Elegante)', gender: 'male', desc: 'Voz encorpada, calorosa e executiva.' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (Jovem / Dinâmico)', gender: 'male', desc: 'Tom conversacional moderno e fluido.' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Feminina / Suave)', gender: 'female', desc: 'Tom profissional, calmo e acolhedor.' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura (Feminina / Executiva)', gender: 'female', desc: 'Tom executivo elegante e articulado.' }
];

class PitAiTtsService {
  constructor() {
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioElement = null;
    this.currentAudioUrl = null;
    this.isSpeaking = false;
    this.onStatusChangeCallback = null;
    this.onSpeechEndCallback = null;

    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.onended = () => this.handleSpeechComplete();
      this.audioElement.onerror = (e) => {
        console.warn('[PIT.AI TTS] Erro no player de áudio ElevenLabs:', e);
        this.handleSpeechComplete();
      };
    }
  }

  getMode() {
    if (typeof window === 'undefined') return 'neural_browser';
    return localStorage.getItem(STORAGE_KEY_MODE) || (this.getElevenLabsKey() ? 'elevenlabs' : 'neural_browser');
  }

  setMode(mode) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_MODE, mode);
    }
  }

  getElevenLabsKey() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_ELEVEN_KEY);
        if (stored) return stored;
      }
      if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY) {
        return import.meta.env.VITE_ELEVENLABS_API_KEY;
      }
    } catch {
      // Ignore
    }
    return '';
  }

  setElevenLabsKey(key) {
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem(STORAGE_KEY_ELEVEN_KEY, key);
      } else {
        localStorage.removeItem(STORAGE_KEY_ELEVEN_KEY);
      }
    }
  }

  getElevenLabsVoiceId() {
    if (typeof window === 'undefined') return 'onwK4e9ZLuTAKqWW03F9';
    return localStorage.getItem(STORAGE_KEY_ELEVEN_VOICE) || 'onwK4e9ZLuTAKqWW03F9'; // Daniel por padrão
  }

  setElevenLabsVoiceId(voiceId) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ELEVEN_VOICE, voiceId);
    }
  }

  getBrowserVoiceUri() {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY_BROWSER_VOICE) || '';
  }

  setBrowserVoiceUri(uri) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_BROWSER_VOICE, uri);
    }
  }

  bindCallbacks({ onStatusChange, onSpeechEnd }) {
    this.onStatusChangeCallback = onStatusChange;
    this.onSpeechEndCallback = onSpeechEnd;
  }

  notifyStatus(status) {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  handleSpeechComplete() {
    this.isSpeaking = false;
    this.notifyStatus('idle');
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    if (this.onSpeechEndCallback) {
      this.onSpeechEndCallback();
    }
  }

  /**
   * Obtém a lista das melhores vozes instaladas no navegador, filtrando as robóticas
   */
  getAvailableBrowserVoices() {
    if (!this.synthesis) return [];
    const all = this.synthesis.getVoices() || [];
    const ptVoices = all.filter(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.startsWith('pt'));

    // Ordena priorizando vozes Neurais e Naturais (Google, Microsoft Online Natural)
    return ptVoices.sort((a, b) => {
      const aScore = this.scoreVoice(a);
      const bScore = this.scoreVoice(b);
      return bScore - aScore;
    });
  }

  scoreVoice(voice) {
    const name = voice.name.toLowerCase();
    let score = 0;
    if (name.includes('natural') || name.includes('online')) score += 10;
    if (name.includes('google')) score += 8;
    if (name.includes('antonio') || name.includes('francisca') || name.includes('daniel')) score += 6;
    if (name.includes('desktop') || name.includes('maria')) score -= 5; // Penaliza sintetizador arcaico SAPI5
    return score;
  }

  /**
   * Encontra a melhor voz neural do navegador
   */
  pickBestBrowserVoice() {
    const voices = this.getAvailableBrowserVoices();
    if (voices.length === 0) return null;

    const savedUri = this.getBrowserVoiceUri();
    if (savedUri) {
      const match = voices.find(v => v.voiceURI === savedUri);
      if (match) return match;
    }

    return voices[0];
  }

  /**
   * Fala um texto usando o motor ativo (ElevenLabs ou Neural do Navegador)
   * @param {string} text - Texto a ser falado
   * @returns {Promise<void>}
   */
  async speak(text) {
    this.stop();

    // Sanitiza o texto para remover marcações
    const cleanText = text
      .replace(/<[^>]*>?/gm, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link anexo')
      .trim();

    if (!cleanText) return;

    this.isSpeaking = true;
    this.notifyStatus('speaking');

    const mode = this.getMode();
    const elevenKey = this.getElevenLabsKey();

    if (mode === 'elevenlabs' && elevenKey) {
      const success = await this.speakElevenLabs(cleanText, elevenKey);
      if (success) return;
      console.warn('[PIT.AI TTS] Falha no ElevenLabs, acionando fallback neural do navegador.');
    }

    // Fallback ou modo padrão: Voz Neural do Navegador
    return this.speakBrowserNeural(cleanText);
  }

  /**
   * Síntese com ElevenLabs API
   */
  async speakElevenLabs(text, apiKey) {
    try {
      const voiceId = this.getElevenLabsVoiceId();
      // Limita caracteres da fala para resposta rápida e economia de quota
      const trimmed = text.slice(0, 500);

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: trimmed,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        console.warn(`[PIT.AI TTS] ElevenLabs retornou erro ${response.status}`);
        return false;
      }

      const audioBlob = await response.blob();
      if (this.currentAudioUrl) {
        URL.revokeObjectURL(this.currentAudioUrl);
      }
      this.currentAudioUrl = URL.createObjectURL(audioBlob);
      this.audioElement.src = this.currentAudioUrl;
      await this.audioElement.play();
      return true;
    } catch (err) {
      console.warn('[PIT.AI TTS] Exceção no ElevenLabs:', err);
      return false;
    }
  }

  /**
   * Síntese Neural do Navegador com tom executivo e velocidade ajustada
   */
  speakBrowserNeural(text) {
    if (!this.synthesis) {
      this.handleSpeechComplete();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.02; // Cadência natural humana
      utterance.pitch = 0.95; // Tom ligeiramente grave para sobriedade

      const voice = this.pickBestBrowserVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        this.handleSpeechComplete();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('[PIT.AI TTS] Erro no SpeechSynthesis:', e);
        this.handleSpeechComplete();
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Para qualquer reprodução de áudio imediatamente
   */
  stop() {
    this.isSpeaking = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    this.notifyStatus('idle');
  }
}

export const pitaiTtsService = new PitAiTtsService();
export default pitaiTtsService;
