/**
 * PIT.AI — Serviço de Visualização de Espectro de Áudio Holográfico (Audio Visualizer Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Mede em tempo real os níveis de frequência (FFT / frequencyData e timeDomainData)
 * tanto do MICROFONE do usuário quanto do ÁUDIO de fala (TTS / ElevenLabs / Google Natural)
 * do PIT.AI.
 * 
 * Alimenta o Orbe Holográfico (PitAiOrb) e o HUD tático a 60fps via requestAnimationFrame,
 * permitindo que os anéis de energia e o núcleo oscilem com precisão milimétrica.
 */

import { pitaiSoundFxService } from './pitaiSoundFxService.js';

const FFT_SIZE = 128; // 64 faixas de frequência (excelente resolução e alta performance 60fps)

class PitAiAudioVisualizerService {
  constructor() {
    this.audioCtx = null;
    this.ttsAnalyser = null;
    this.micAnalyser = null;
    this.connectedAudioElements = new WeakSet();
    this.micStream = null;
    this.micSource = null;

    // Buffers pré-alocados para evitar garbage collection a 60fps
    this.frequencyBuffer = new Uint8Array(FFT_SIZE / 2);
    this.timeDomainBuffer = new Uint8Array(FFT_SIZE / 2);

    // Estado de fala simulada (quando o navegador usa SpeechSynthesis sem saída WebAudio direta)
    this.isSimulatedSpeaking = false;
    this.simulationPhase = 0;

    // Ouvintes registrados para o loop de 60fps
    this.subscribers = new Set();
    this.animationFrameId = null;
    this.isLoopRunning = false;
  }

  /**
   * Obtém a instância compartilhada de AudioContext
   */
  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      this.audioCtx = pitaiSoundFxService.getAudioContext();
    }
    return this.audioCtx;
  }

  /**
   * Garante a inicialização do analisador para o canal TTS
   */
  ensureTtsAnalyser() {
    const ctx = this.getAudioContext();
    if (!ctx) return null;

    if (!this.ttsAnalyser) {
      this.ttsAnalyser = ctx.createAnalyser();
      this.ttsAnalyser.fftSize = FFT_SIZE;
      this.ttsAnalyser.smoothingTimeConstant = 0.82; // Suavização orgânica
      this.ttsAnalyser.minDecibels = -90;
      this.ttsAnalyser.maxDecibels = -10;
    }
    return this.ttsAnalyser;
  }

  /**
   * Conecta um elemento HTMLAudioElement (ex: ElevenLabs MP3 ou Google Natural)
   * ao analisador FFT e ao destino de áudio dos alto-falantes.
   * @param {HTMLAudioElement} audioElement
   */
  connectAudioElement(audioElement) {
    if (!audioElement || typeof window === 'undefined') return;

    if (this.connectedAudioElements.has(audioElement)) {
      return; // Já conectado previamente, evita InvalidStateError
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const analyser = this.ensureTtsAnalyser();
      const source = ctx.createMediaElementSource(audioElement);

      // Conecta o áudio: Source -> Analyser -> Speakers
      source.connect(analyser);
      analyser.connect(ctx.destination);

      this.connectedAudioElements.add(audioElement);
    } catch (err) {
      console.warn('[PIT.AI Visualizer] Aviso ao conectar elemento de áudio:', err?.message || err);
    }
  }

  /**
   * Inicia a captura e análise do microfone do usuário
   * (NÃO roteia para os alto-falantes para evitar feedback/microfonia)
   */
  async startMicVisualizer() {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }

      if (!this.micAnalyser) {
        this.micAnalyser = ctx.createAnalyser();
        this.micAnalyser.fftSize = FFT_SIZE;
        this.micAnalyser.smoothingTimeConstant = 0.75;
      }

      // Se já houver stream aberto, não recria
      if (this.micStream && this.micStream.active) {
        return true;
      }

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      this.micSource = ctx.createMediaStreamSource(this.micStream);
      this.micSource.connect(this.micAnalyser);
      // NUNCA conectar micAnalyser a ctx.destination!

      return true;
    } catch (err) {
      console.warn('[PIT.AI Visualizer] Microfone inacessível para visualizador:', err?.message || err);
      return false;
    }
  }

  /**
   * Encerra a análise do microfone liberando a faixa de captura
   */
  stopMicVisualizer() {
    if (this.micSource) {
      try {
        this.micSource.disconnect();
      } catch {
        // Ignore
      }
      this.micSource = null;
    }

    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach((track) => track.stop());
      } catch {
        // Ignore
      }
      this.micStream = null;
    }
  }

  /**
   * Ativa a simulação de fala neural procedural
   * (Usado quando a fala ocorre via SpeechSynthesis nativo)
   */
  setSimulatedSpeaking(isSpeaking) {
    this.isSimulatedSpeaking = Boolean(isSpeaking);
  }

  /**
   * Retorna os dados acústicos em tempo real (FFT, envelope, bandas de frequência)
   * Pode ser chamado a 60fps dentro de loops requestAnimationFrame.
   */
  getAudioData() {
    let activeAnalyser = null;
    let source = 'idle';

    // Prioridade 1: Áudio do TTS (J.A.R.V.I.S. falando via MP3)
    if (this.ttsAnalyser) {
      this.ttsAnalyser.getByteFrequencyData(this.frequencyBuffer);
      let sum = 0;
      for (let i = 0; i < this.frequencyBuffer.length; i++) {
        sum += this.frequencyBuffer[i];
      }
      if (sum > 10) {
        activeAnalyser = this.ttsAnalyser;
        source = 'tts';
      }
    }

    // Prioridade 2: Microfone do usuário (se TTS estiver em silêncio)
    if (!activeAnalyser && this.micAnalyser && this.micStream?.active) {
      this.micAnalyser.getByteFrequencyData(this.frequencyBuffer);
      let sum = 0;
      for (let i = 0; i < this.frequencyBuffer.length; i++) {
        sum += this.frequencyBuffer[i];
      }
      if (sum > 10) {
        activeAnalyser = this.micAnalyser;
        source = 'mic';
      }
    }

    // Prioridade 3: Fala Simulada (SpeechSynthesis nativo)
    if (!activeAnalyser && this.isSimulatedSpeaking) {
      return this.generateSimulatedVocalData();
    }

    // Se houver um analisador ativo com som real:
    if (activeAnalyser) {
      activeAnalyser.getByteFrequencyData(this.frequencyBuffer);
      activeAnalyser.getByteTimeDomainData(this.timeDomainBuffer);

      return this.computeMetrics(this.frequencyBuffer, this.timeDomainBuffer, source);
    }

    // Em repouso (silêncio calmo)
    this.frequencyBuffer.fill(0);
    this.timeDomainBuffer.fill(128); // 128 representa linha central de onda

    return {
      frequencyData: this.frequencyBuffer,
      timeDomainData: this.timeDomainBuffer,
      volume: 0,
      rawVolume: 0,
      bass: 0,
      mid: 0,
      treble: 0,
      isActive: false,
      source: 'idle'
    };
  }

  /**
   * Computa métricas normalizadas de volume e bandas espectrais
   */
  computeMetrics(freqs, waveform, source) {
    const len = freqs.length; // 64
    let total = 0;
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    const bassBoundary = Math.floor(len * 0.18); // ~0 a 12
    const midBoundary = Math.floor(len * 0.60);  // ~12 a 38

    for (let i = 0; i < len; i++) {
      const val = freqs[i];
      total += val;
      if (i < bassBoundary) {
        bassSum += val;
      } else if (i < midBoundary) {
        midSum += val;
      } else {
        trebleSum += val;
      }
    }

    const avg = total / len;
    const volume = Math.min(1, Math.max(0, avg / 140)); // Normalizado 0.0 - 1.0
    const bass = Math.min(1, (bassSum / (bassBoundary || 1)) / 160);
    const mid = Math.min(1, (midSum / ((midBoundary - bassBoundary) || 1)) / 130);
    const treble = Math.min(1, (trebleSum / ((len - midBoundary) || 1)) / 100);

    return {
      frequencyData: freqs,
      timeDomainData: waveform,
      volume,
      rawVolume: avg,
      bass,
      mid,
      treble,
      isActive: volume > 0.05,
      source
    };
  }

  /**
   * Gera modulações vocais harmônicas para síntese nativa do navegador
   */
  generateSimulatedVocalData() {
    this.simulationPhase += 0.12;
    const len = this.frequencyBuffer.length;

    // Modulação orgânica com cadência humana (harmônicos vocais e pausas de respiração)
    const baseEnergy = Math.sin(this.simulationPhase * 0.8) * 0.35 + 0.65;
    const flutter = Math.sin(this.simulationPhase * 3.5) * 0.15;
    const vocalCadence = Math.max(0.1, baseEnergy + flutter);

    for (let i = 0; i < len; i++) {
      const formantFactor = Math.sin((i / len) * Math.PI) * 1.8;
      const wave = Math.sin(this.simulationPhase * 2 + i * 0.3);
      const val = Math.floor(Math.max(0, Math.min(255, (vocalCadence * formantFactor + wave * 0.2) * 160)));
      this.frequencyBuffer[i] = val;
      this.timeDomainBuffer[i] = 128 + Math.floor(Math.sin(this.simulationPhase + i * 0.4) * (val * 0.3));
    }

    return this.computeMetrics(this.frequencyBuffer, this.timeDomainBuffer, 'simulated');
  }

  /**
   * Registra um callback para receber dados a cada frame (60fps)
   * @param {Function} callback - Recebe o objeto de métricas
   * @returns {Function} Função de cancelamento (unsubscribe)
   */
  subscribe(callback) {
    if (typeof callback !== 'function') return () => {};

    this.subscribers.add(callback);
    this.ensureLoopRunning();

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stopLoop();
      }
    };
  }

  ensureLoopRunning() {
    if (this.isLoopRunning || typeof window === 'undefined') return;
    this.isLoopRunning = true;

    const tick = () => {
      if (!this.isLoopRunning) return;

      const data = this.getAudioData();
      for (const subscriber of this.subscribers) {
        try {
          subscriber(data);
        } catch {
          // Ignora erro em assinante individual
        }
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  stopLoop() {
    this.isLoopRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Retoma o contexto de áudio em caso de clique do usuário
   */
  async resumeContext() {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // Ignora
      }
    }
  }
}

export const pitaiAudioVisualizerService = new PitAiAudioVisualizerService();
export default pitaiAudioVisualizerService;
