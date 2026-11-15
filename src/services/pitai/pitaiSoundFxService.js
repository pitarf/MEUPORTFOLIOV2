/**
 * PIT.AI — Serviço de Efeitos Sonoros Sci-Fi Holográficos (Sound FX Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Síntese acústica neural em tempo real via Web Audio API pura
 * (AudioContext, OscillatorNode, GainNode, BiquadFilterNode).
 * Elimina 100% a dependência de arquivos externos MP3/WAV que podem sofrer com 404,
 * latência de rede ou bloqueios de CORS.
 * 
 * Sons do Sistema J.A.R.V.I.S.:
 * - playActivate(): Abertura de canal holográfico / escuta atenta
 * - playAcknowledge(): Reconhecimento de comando e início de processamento
 * - playDone(): Conclusão de tarefa / sucesso de sincronização
 * - playAlert(): Alerta tático de conflito ou atenção necessária
 */

const STORAGE_KEY_SFX_ENABLED = 'pitai_sfx_enabled';
const STORAGE_KEY_SFX_VOLUME = 'pitai_sfx_volume';
const DEFAULT_VOLUME = 0.18; // Calibrado para sonoridade discreta, executiva e de alta definição

class PitAiSoundFxService {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.enabled = true;
    this.volume = DEFAULT_VOLUME;

    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem(STORAGE_KEY_SFX_ENABLED);
      if (savedEnabled !== null) {
        this.enabled = savedEnabled === 'true';
      }

      const savedVol = localStorage.getItem(STORAGE_KEY_SFX_VOLUME);
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }
    }
  }

  /**
   * Obtém ou inicializa com segurança a instância global de AudioContext
   * Respeitando a política de autoplay dos navegadores modernos.
   */
  getAudioContext() {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('[PIT.AI SFX] Web Audio API não suportada neste ambiente.');
        return null;
      }

      this.audioCtx = new AudioContextClass();

      // Master Gain para calibrar o volume geral dos efeitos
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {
        // Aguarda próxima interação do usuário se ainda bloqueado
      });
    }

    return this.audioCtx;
  }

  /**
   * Atualiza o volume do Master Gain (0.0 a 1.0)
   */
  setVolume(newVolume) {
    const clamped = Math.max(0, Math.min(1, Number(newVolume) || DEFAULT_VOLUME));
    this.volume = clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SFX_VOLUME, String(clamped));
    }
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
    }
  }

  getVolume() {
    return this.volume;
  }

  /**
   * Liga ou desliga todos os efeitos sonoros do assistente
   */
  setEnabled(isEnabled) {
    this.enabled = Boolean(isEnabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SFX_ENABLED, String(this.enabled));
    }
  }

  isEnabled() {
    return this.enabled;
  }

  toggleSound() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  /**
   * SOM 1: ACTIVATE (Abertura de Canal Holográfico / Escuta Atenta)
   * Chime harmônico suave de abertura sci-fi com filtro passa-baixas progressivo.
   */
  playActivate() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;

      // Frequências harmônicas (Arpeggio rápido em quinta sci-fi: D5 -> A5 -> D6)
      const frequencies = [587.33, 880.0, 1174.66];
      const durations = [0.18, 0.22, 0.32];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Filtro suave para dar corpo holográfico e retirar aspereza
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);

        osc.type = idx === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        // Envelope com ataque macio e cauda cristalina
        const startTime = now + idx * 0.04;
        const noteDuration = durations[idx];
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + noteDuration + 0.05);
      });
    } catch (e) {
      console.warn('[PIT.AI SFX] Falha ao sintetizar Activate:', e);
    }
  }

  /**
   * SOM 2: ACKNOWLEDGE (Comando Entendido / Processando)
   * Pulso duplo cristalino sci-fi estilo HUD Stark, sutil e preciso.
   */
  playAcknowledge() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const blips = [
        { freq: 1046.50, start: 0, dur: 0.06, gainVal: 0.22 },     // C6
        { freq: 1567.98, start: 0.065, dur: 0.09, gainVal: 0.26 }  // G6
      ];

      blips.forEach(({ freq, start, dur, gainVal }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, now + start);
        filter.Q.setValueAtTime(3.5, now + start);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        const startTime = now + start;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.02);
      });
    } catch (e) {
      console.warn('[PIT.AI SFX] Falha ao sintetizar Acknowledge:', e);
    }
  }

  /**
   * SOM 3: DONE (Conclusão de Tarefa / Sucesso Executivo)
   * Acorde tríade maior futurista em cascata harmoniosa (F#5, A#5, C#6, F#6).
   */
  playDone() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const chord = [
        { freq: 739.99, delay: 0.0, dur: 0.35, gain: 0.20 },  // F#5
        { freq: 932.33, delay: 0.04, dur: 0.38, gain: 0.22 }, // A#5
        { freq: 1108.73, delay: 0.08, dur: 0.42, gain: 0.24 },// C#6
        { freq: 1479.98, delay: 0.12, dur: 0.50, gain: 0.20 } // F#6
      ];

      chord.forEach(({ freq, delay, dur, gain }) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2600, now);
        filter.Q.setValueAtTime(1.8, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        const startTime = now + delay;
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.linearRampToValueAtTime(gain, startTime + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.05);
      });
    } catch (e) {
      console.warn('[PIT.AI SFX] Falha ao sintetizar Done:', e);
    }
  }

  /**
   * SOM 4: ALERT (Alerta Tático / Conflito Operacional)
   * Bi-tom tático refinado, suavemente filtrado para não soar estridente.
   */
  playAlert() {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const pulses = [
        { freq: 554.37, start: 0, dur: 0.11 },      // C#5
        { freq: 440.00, start: 0.13, dur: 0.15 }    // A4
      ];

      pulses.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Filtro corta-altas em 1200Hz para remover asperezas e manter tom tático
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, now);
        filter.Q.setValueAtTime(2.0, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + start);

        const startTime = now + start;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.24, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + dur + 0.03);
      });
    } catch (e) {
      console.warn('[PIT.AI SFX] Falha ao sintetizar Alert:', e);
    }
  }
}

export const pitaiSoundFxService = new PitAiSoundFxService();
export default pitaiSoundFxService;
