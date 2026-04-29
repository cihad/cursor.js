import type { Cursor, CursorPlugin } from '@cursor.js/core';
import { SayPlugin as SayPluginClass } from './SayPlugin';

export interface SpeechPluginOptions {
  enabled?: boolean;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class SpeechPlugin implements CursorPlugin {
  name = 'speech';
  private options: Required<Omit<SpeechPluginOptions, 'enabled'>> & { enabled: boolean };
  private originalOnBeforeSay: ((text: string, options?: any) => void) | null = null;

  constructor(options: SpeechPluginOptions = {}) {
    this.options = {
      enabled: options.enabled ?? true,
      lang: options.lang ?? 'tr-TR',
      rate: options.rate ?? 1,
      pitch: options.pitch ?? 1,
      volume: options.volume ?? 1,
    };
  }

  install(cursor: Cursor) {
    const sayPlugin = (cursor as any).plugins?.find((p: any) => p.name === 'say');
    if (!(sayPlugin instanceof SayPluginClass)) {
      console.warn('[SpeechPlugin] SayPlugin not found. Please install SayPlugin first.');
      return;
    }

    // Store original callback
    this.originalOnBeforeSay = sayPlugin.onBeforeSay || null;

    // Override with speech synthesis
    sayPlugin.onBeforeSay = (text: string, options?: { speak?: boolean }) => {
      // Call original if exists
      this.originalOnBeforeSay?.(text, options);

      // Check if speech is enabled (global + per-call)
      const shouldSpeak = this.options.enabled && (options?.speak !== false);
      
      if (shouldSpeak) {
        this.speak(text);
      }
    };
  }

  private speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('[SpeechPlugin] Web Speech API not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.options.lang;
    utterance.rate = this.options.rate;
    utterance.pitch = this.options.pitch;
    utterance.volume = this.options.volume;

    speechSynthesis.speak(utterance);
  }

  setEnabled(enabled: boolean): void {
    this.options.enabled = enabled;
  }

  setLang(lang: string): void {
    this.options.lang = lang;
  }
}
