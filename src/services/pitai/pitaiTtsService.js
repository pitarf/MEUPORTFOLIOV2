/**
 * PIT.AI — Serviço de Síntese de Voz Executiva de Alta Fidelidade (TTS Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Especializado em síntese de VOZ MASCULINA executiva, sóbria e articulada
 * no estilo J.A.R.V.I.S., eliminando sintetizadores robóticos ou femininos.
 * 
 * Camadas de Reprodução:
 * 1. ElevenLabs API (Voz Humana de Estúdio/Cinema Masculina - Daniel J.A.R.V.I.S.)
 * 2. Google Natural Voice Stream (/api/tts/google - Áudio MP3 fluido em PT-BR sem custos)
 * 3. Vozes Neurais Masculinas do Navegador (Microsoft Antonio Online Natural / Daniel) com pitch grave (0.88)
 */

const STORAGE_KEY_MODE = 'pitai_tts_mode'; // 'neural_browser' | 'google_natural' | 'elevenlabs'
const STORAGE_KEY_ELEVEN_KEY = 'pitai_elevenlabs_api_key';
const STORAGE_KEY_ELEVEN_VOICE = 'pitai_elevenlabs_voice_id';
const STORAGE_KEY_BROWSER_VOICE = 'pitai_browser_voice_uri';

// Vozes recomendadas da ElevenLabs - Prioridade absoluta Masculina Executiva (J.A.R.V.I.S.)
export const ELEVENLABS_VOICES = [
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Executivo / Estilo J.A.R.V.I.S.)', gender: 'male', desc: 'Tom sóbrio, articulado, autoritativo e direto.' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Narrativo / Elegante)', gender: 'male', desc: 'Voz encorpada, calorosa e executiva.' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam (Jovem / Dinâmico)', gender: 'male', desc: 'Tom conversacional moderno e fluido.' }
];

const FEMALE_NAMES = [
  'maria', 'francisca', 'helena', 'luciana', 'leticia', 'female',
  'zira', 'yumi', 'victoria', 'sabina', 'camila', 'mulher',
  'gabriela', 'mariana', 'raquel', 'heloisa', 'fernanda', 'aline'
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
        console.warn('[PIT.AI TTS] Erro no player de áudio:', e);
        this.handleSpeechComplete();
      };
    }
  }

  getMode() {
    if (typeof window === 'undefined') return 'neural_browser';
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    if (saved) return saved;
    if (this.getElevenLabsKey()) return 'elevenlabs';
    return 'neural_browser';
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
    return localStorage.getItem(STORAGE_KEY_ELEVEN_VOICE) || 'onwK4e9ZLuTAKqWW03F9'; // Daniel (J.A.R.V.I.S.)
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
   * Avalia a voz atribuindo pontuação prioritária para vozes MASCULINAS neurais
   * e descartando estritamente vozes femininas ou sintetizadores mecânicos antigos.
   */
  scoreVoice(voice) {
    const name = (voice.name || '').toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();
    const textToCheck = `${name} ${uri}`;

    // Descarta completamente qualquer voz feminina
    for (const femaleName of FEMALE_NAMES) {
      if (textToCheck.includes(femaleName)) {
        return -999;
      }
    }

    let score = 10;

    // Prioridade máxima: Voz Neural Masculina Antonio (Windows / Edge)
    if (textToCheck.includes('antonio')) {
      score += 250;
    }

    // Prioridade alta: Voz Masculina Daniel (Windows / Edge)
    if (textToCheck.includes('daniel')) {
      score += 200;
    }

    // Outras vozes masculinas conhecidas
    if (textToCheck.includes('felipe') || textToCheck.includes('jorge') || textToCheck.includes('ricardo')) {
      score += 150;
    }

    // Bonificação por motor Natural / Neural
    if (textToCheck.includes('natural') || textToCheck.includes('online')) {
      score += 80;
    }

    // Google Voz Natural PT-BR
    if (textToCheck.includes('google')) {
      score += 60;
    }

    // Penalidade para sintetizadores desktop mecânicos antigos
    if (textToCheck.includes('desktop') && !textToCheck.includes('daniel')) {
      score -= 50;
    }

    return score;
  }

  /**
   * Obtém apenas vozes MASCULINAS instaladas no navegador
   */
  getAvailableBrowserVoices() {
    if (!this.synthesis) return [];
    const all = this.synthesis.getVoices() || [];
    const ptVoices = all.filter(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.startsWith('pt'));

    // Filtra apenas vozes masculinas (score > 0)
    const filtered = ptVoices.filter(v => this.scoreVoice(v) > 0);

    return filtered.sort((a, b) => {
      const aScore = this.scoreVoice(a);
      const bScore = this.scoreVoice(b);
      return bScore - aScore;
    });
  }

  /**
   * Encontra a melhor voz masculina neural do navegador
   */
  pickBestBrowserVoice() {
    const voices = this.getAvailableBrowserVoices();
    if (voices.length === 0) {
      // Se não encontrou nenhuma filtrada, pega pt-BR evitando Maria
      const allPt = (this.synthesis?.getVoices() || []).filter(v => v.lang.includes('pt'));
      return allPt.find(v => !v.name.toLowerCase().includes('maria')) || allPt[0] || null;
    }

    const savedUri = this.getBrowserVoiceUri();
    if (savedUri) {
      const match = voices.find(v => v.voiceURI === savedUri);
      if (match) return match;
    }

    return voices[0];
  }

  /**
   * Fala um texto usando o motor ativo com tom e cadência masculina J.A.R.V.I.S.
   * @param {string} text - Texto a ser falado
   * @returns {Promise<void>}
   */
  async speak(text) {
    this.stop();

    // Sanitiza o texto para remover links, emojis e formatações markdown
    const cleanText = (text || '')
      .replace(/<[^>]*>?/gm, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link anexo')
      .replace(/[^\w\sÀ-ÿ.,!?:-]/g, '')
      .trim();

    if (!cleanText) return;

    this.isSpeaking = true;
    this.notifyStatus('speaking');

    const mode = this.getMode();
    const elevenKey = this.getElevenLabsKey();

    // 1. ElevenLabs API (Voz Masculina de Cinema)
    if (mode === 'elevenlabs' && elevenKey) {
      const success = await this.speakElevenLabs(cleanText, elevenKey);
      if (success) return;
      console.warn('[PIT.AI TTS] Falha no ElevenLabs, acionando fallback neural.');
    }

    // 2. Se as vozes do navegador forem muito pobres ou arcaicas, tenta o áudio natural direto
    const bestVoice = this.pickBestBrowserVoice();
    const hasGreatLocalVoice = bestVoice && (
      bestVoice.name.toLowerCase().includes('antonio') ||
      bestVoice.name.toLowerCase().includes('daniel') ||
      bestVoice.name.toLowerCase().includes('natural')
    );

    if (!hasGreatLocalVoice && cleanText.length <= 250) {
      const googleSuccess = await this.speakGoogleNatural(cleanText);
      if (googleSuccess) return;
    }

    // 3. Síntese do Navegador ajustada para tom grave masculino (J.A.R.V.I.S.)
    return this.speakBrowserNeural(cleanText, bestVoice);
  }

  /**
   * Toca via Google Natural TTS (MP3 limpo sem sintetizador de lata)
   */
  async speakGoogleNatural(text) {
    if (!this.audioElement) return false;
    try {
      const trimmed = text.slice(0, 200);
      // Tenta via proxy do Nginx local ou direto
      const proxyUrl = `/api/tts/google?ie=UTF-8&q=${encodeURIComponent(trimmed)}&tl=pt-BR&client=tw-ob`;
      
      this.audioElement.src = proxyUrl;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        await playPromise;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Síntese com ElevenLabs API (Voz Masculina Daniel J.A.R.V.I.S.)
   */
  async speakElevenLabs(text, apiKey) {
    try {
      const voiceId = this.getElevenLabsVoiceId();
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
            stability: 0.6,
            similarity_boost: 0.85,
            style: 0.15,
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
   * Síntese Neural do Navegador com tom executivo MASCULINO (pitch grave 0.88)
   */
  speakBrowserNeural(text, preferredVoice = null) {
    if (!this.synthesis) {
      this.handleSpeechComplete();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0; // Cadência executiva firme
      utterance.pitch = 0.88; // Tom encorpado e grave (remove timbre fino/robótico)

      const voice = preferredVoice || this.pickBestBrowserVoice();
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
