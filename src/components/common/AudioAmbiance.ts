/**
 * Synthesizes subtle ambient fire crackle and gentle breeze acoustics
 * using the Web Audio API. 100% self-contained with no external media files.
 */
class FireSoundEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.isRunning = true;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      // Pink noise generator for gentle low-frequency flame hiss
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for warm fireplace low rumble
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(450, this.ctx.currentTime);

      whiteNoise.connect(lowpass);
      lowpass.connect(this.gainNode);
      whiteNoise.start(0);
      this.noiseNode = whiteNoise;

      // Random micro-pops / ember crackles
      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.isRunning || Math.random() > 0.45) return;
        try {
          const popOsc = this.ctx.createOscillator();
          const popGain = this.ctx.createGain();
          const popFilter = this.ctx.createBiquadFilter();

          popFilter.type = 'bandpass';
          popFilter.frequency.setValueAtTime(1200 + Math.random() * 2400, this.ctx.currentTime);
          popFilter.Q.setValueAtTime(8, this.ctx.currentTime);

          const now = this.ctx.currentTime;
          popGain.gain.setValueAtTime(0.001, now);
          popGain.gain.exponentialRampToValueAtTime(0.04 + Math.random() * 0.06, now + 0.005);
          popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03 + Math.random() * 0.03);

          popOsc.frequency.setValueAtTime(400 + Math.random() * 1000, now);
          popOsc.connect(popFilter);
          popFilter.connect(popGain);
          popGain.connect(this.ctx.destination);

          popOsc.start(now);
          popOsc.stop(now + 0.07);
        } catch {
          // Ignore transient audio error
        }
      }, 120);

    } catch (e) {
      console.warn('Audio ambient engine initialization prevented by browser autoplay policy:', e);
      this.isRunning = false;
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // Safe dismiss
      }
      this.noiseNode = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // Safe dismiss
      }
      this.gainNode = null;
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const soundEngine = new FireSoundEngine();
