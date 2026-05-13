import type { Cursor } from '../core/Cursor';
import type { CursorPlugin } from './CursorPlugin';

export type PromptPosition = 'cursor' | 'bottom' | 'center' | 'subtitle';

export interface PromptButton {
  label: string;
  onClick?: (() => void) | 'continue';
  type?: 'primary' | 'secondary' | 'danger';
}

export interface PromptOptions {
  buttons?: PromptButton[];
  position?: PromptPosition;
  render?: (container: HTMLElement, resolve: (value: any) => void) => void;
  waitUntilFinished?: boolean;
}

declare module '../core/Cursor' {
  interface Cursor {
    prompt(message: string, options?: PromptOptions): this;
  }
}

export interface PromptPositionerContext {
  cursor: Cursor;
  cursorElement: HTMLElement;
  promptElement: HTMLElement;
  position: PromptPosition;
  options?: PromptOptions;
}

export type PromptPositionerCleanup = () => void;

export type PromptPositioner = (
  context: PromptPositionerContext,
) => void | PromptPositionerCleanup | Promise<void | PromptPositionerCleanup>;

export interface PromptPluginOptions {
  defaultPosition?: PromptPosition;
  positioner?: PromptPositioner;
}

export class PromptPlugin implements CursorPlugin {
  name = 'prompt';
  private options: PromptPluginOptions;
  private promptElement: HTMLElement | null = null;
  private moveIntervalId: ReturnType<typeof setInterval> | null = null;
  private positionCleanup: PromptPositionerCleanup | null = null;

  constructor(options: PromptPluginOptions = {}) {
    this.options = {
      defaultPosition: 'cursor',
      ...options,
    };
  }

  install(cursor: Cursor) {
    const self = this;

    // @ts-ignore
    cursor.constructor.prototype.prompt = function (message: string, options?: PromptOptions) {
      return this.addStep(async () => {
        const waitSpeech = options?.waitUntilFinished ?? true;

        // İkisi eşzamanlı çalışsın: Hem konuşma başlasın hem prompt menüsü açılsın
        const speechPromise = cursor.emitAsync('speech_requested', message, {
          waitUntilFinished: waitSpeech,
        });

        // Ekrana elementi çiz ve resolve'u bekle
        const promptPromise = new Promise<any>((resolve) => {
          void self.showPrompt(this, message, options, resolve);
        });

        // İkisinden birini sıraya koymak yerine ikisini de aynı anda bekliyoruz
        await Promise.all([speechPromise, promptPromise]);
      });
    };
  }

  private async showPrompt(
    cursor: Cursor,
    message: string,
    options: PromptOptions | undefined,
    resolve: (value: any) => void,
  ) {
    const position = options?.position || this.options.defaultPosition || 'center';

    this.cleanupPosition();

    this.promptElement = document.createElement('div');
    this.promptElement.className = `cursor-js-prompt cursor-js-prompt-${position}`;

    // Common styling
    Object.assign(this.promptElement.style, {
      position: 'absolute',
      zIndex: '100000',
      padding: '10px 16px',
      borderRadius: '16px',
      cornerShape: 'squircle',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: 'white',
      fontSize: '15px',
      fontFamily: 'sans-serif',
      transition: 'opacity 0.2s ease-in-out',
      opacity: '0',
      minWidth: '200px',
      pointerEvents: 'auto',
      textAlign: 'center',
      lineHeight: '1.4',
    });

    const cleanup = (value: any) => {
      if (this.promptElement) {
        this.promptElement.remove();
        this.promptElement = null;
      }
      this.cleanupPosition();
      resolve(value);
    };

    if (options?.render) {
      options.render(this.promptElement, cleanup);
    } else {
      // Varsayılan DOM
      const text = document.createElement('div');
      text.textContent = message;
      text.style.marginBottom = '12px';
      this.promptElement.appendChild(text);

      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.gap = '8px';
      btnContainer.style.justifyContent = 'flex-end';

      const buttons = options?.buttons || [{ label: 'OK', onClick: 'continue', type: 'primary' }];

      buttons.forEach((btnConfig) => {
        const btn = document.createElement('button');
        btn.textContent = btnConfig.label;
        Object.assign(btn.style, {
          padding: '5px 12px',
          fontSize: '13px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500',
          backgroundColor: btnConfig.type === 'secondary' ? '#e2e8f0' : '#3b82f6',
          color: btnConfig.type === 'secondary' ? '#1e293b' : 'white',
        });

        btn.onclick = () => {
          if (typeof btnConfig.onClick === 'function') {
            btnConfig.onClick();
          }
          cleanup(btnConfig.label);
        };
        btnContainer.appendChild(btn);
      });

      this.promptElement.appendChild(btnContainer);
    }

    document.body.appendChild(this.promptElement);
    this.positionCleanup = await this.positionPrompt(cursor, this.promptElement, position, options);

    if (position === 'cursor' && !this.options.positioner) {
      this.moveIntervalId = setInterval(() => {
        if (this.promptElement && cursor.cursor && cursor.cursor.el) {
          this.positionCursorPrompt(cursor, this.promptElement);
        }
      }, 16);
    }

    requestAnimationFrame(() => {
      if (this.promptElement) this.promptElement.style.opacity = '1';
    });
  }

  onDestroy() {
    this.cleanupPosition();
    this.promptElement?.remove();
    this.promptElement = null;
  }

  private async positionPrompt(
    cursor: Cursor,
    promptElement: HTMLElement,
    position: PromptPosition,
    options?: PromptOptions,
  ): Promise<PromptPositionerCleanup | null> {
    if (this.options.positioner) {
      const cleanup = await this.options.positioner({
        cursor,
        cursorElement: cursor.cursor.el,
        promptElement,
        position,
        options,
      });

      return cleanup || null;
    }

    if (position === 'cursor') {
      this.positionCursorPrompt(cursor, promptElement);
    } else if (position === 'bottom') {
      promptElement.style.position = 'fixed';
      promptElement.style.bottom = '20px';
      promptElement.style.left = '50%';
      promptElement.style.transform = 'translateX(-50%)';
    } else if (position === 'center') {
      promptElement.style.position = 'fixed';
      promptElement.style.top = '50%';
      promptElement.style.left = '50%';
      promptElement.style.transform = 'translate(-50%, -50%)';
    } else if (position === 'subtitle') {
      Object.assign(promptElement.style, {
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '80%',
      });
    }

    return null;
  }

  private positionCursorPrompt(cursor: Cursor, promptElement: HTMLElement) {
    const cursorRect = cursor.cursor.el.getBoundingClientRect();
    const promptRect = promptElement.getBoundingClientRect();
    const x = cursorRect.left + window.scrollX + 30;
    const y = cursorRect.top + window.scrollY - 10;
    const padding = 8;
    const maxX = window.scrollX + window.innerWidth - promptRect.width - padding;
    const maxY = window.scrollY + window.innerHeight - promptRect.height - padding;
    const minX = window.scrollX + padding;
    const minY = window.scrollY + padding;

    promptElement.style.left = `${this.clamp(x, minX, maxX)}px`;
    promptElement.style.top = `${this.clamp(y, minY, maxY)}px`;
  }

  private clamp(value: number, min: number, max: number) {
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
  }

  private cleanupPosition() {
    if (this.moveIntervalId) {
      clearInterval(this.moveIntervalId);
      this.moveIntervalId = null;
    }

    this.positionCleanup?.();
    this.positionCleanup = null;
  }
}
