import type { Cursor } from '../core/Cursor';
import type { CursorPlugin } from './CursorPlugin';

export interface SoundPluginOptions {
  volume?: number;
  clickSoundUrl?: string; // e.g. click.mp3
  typingSoundUrl?: string; // e.g. typing.mp3
  // Enable fallback synthesizer if URL is not provided
  useSynthesizerFallback?: boolean;
}

export class SoundPlugin implements CursorPlugin {
  name = 'SoundPlugin';
  private audioContext: AudioContext | null = null;
  private clickAudio: HTMLAudioElement | null = null;
  private typingAudio: HTMLAudioElement | null = null;
  private options: SoundPluginOptions;

  constructor(options: SoundPluginOptions = {}) {
    this.options = { useSynthesizerFallback: true, volume: 0.5, ...options };
  }

  install(_cursor: Cursor) {
    if (typeof window !== 'undefined') {
      if (this.options.clickSoundUrl) {
        this.clickAudio = new Audio(this.options.clickSoundUrl);
        this.clickAudio.volume = this.options.volume as number;
      }

      if (this.options.typingSoundUrl) {
        this.typingAudio = new Audio(this.options.typingSoundUrl);
        this.typingAudio.volume = this.options.volume as number;
      }

      if (this.options.useSynthesizerFallback && (!this.clickAudio || !this.typingAudio)) {
        if (window.AudioContext || (window as any).webkitAudioContext) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          this.audioContext = new AudioContextClass();
        }
      }
    }
  }

  onStateChange(newState: Record<string, any>) {
    if (newState.sound?.volume !== undefined) {
      this.options.volume = newState.sound.volume;
      if (this.clickAudio) this.clickAudio.volume = this.options.volume as number;
      if (this.typingAudio) this.typingAudio.volume = this.options.volume as number;
    }
  }

  onClickStart(_target: Element) {
    if (this.clickAudio) {
      this.clickAudio.currentTime = 0;
      this.clickAudio.play().catch(() => {});
      return;
    }
    this.playSynthesizer(600, 50, 0.02);
  }

  onTypeStart(_text: string) {
    if (this.typingAudio) {
      this.typingAudio.currentTime = 0;
      this.typingAudio.loop = true;
      this.typingAudio.play().catch(() => {});
      return;
    }
    this.playSynthesizer(300, 100, 0.01);
  }

  onTypeEnd() {
    if (this.typingAudio) {
      this.typingAudio.pause();
      this.typingAudio.currentTime = 0;
    }
  }

  onPause() {
    if (this.clickAudio && !this.clickAudio.paused) {
      this.clickAudio.pause();
    }
    if (this.typingAudio && !this.typingAudio.paused) {
      this.typingAudio.pause();
    }
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend().catch(() => {});
    }
  }

  onResume() {
    // We optionally resume typing sound if it was paused. The click sound is usually too short.
    if (this.typingAudio && this.typingAudio.currentTime > 0) {
      this.typingAudio.play().catch(() => {});
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  private playSynthesizer(startFreq: number, endFreq: number, duration: number) {
    if (!this.audioContext || !this.options.useSynthesizerFallback) return;

    const volume = this.options.volume ?? 0.5;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration,
    );

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}
