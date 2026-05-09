import type { Cursor } from '../core/Cursor';
import type { CursorPlugin } from './CursorPlugin';

export interface PromptButton {
  label: string;
  onClick?: (() => void) | 'continue';
  type?: 'primary' | 'secondary' | 'danger';
}

export interface PromptOptions {
  buttons?: PromptButton[];
  position?: 'cursor' | 'bottom' | 'center' | 'subtitle';
  onComplete?: (value: any) => void;
  render?: (container: HTMLElement, resolve: (value: any) => void) => void;
  waitUntilFinished?: boolean;
}

declare module '../core/Cursor' {
  interface Cursor {
    prompt(message: string, options?: PromptOptions): this;
  }
}

export interface PromptPluginOptions {
  defaultPosition?: 'cursor' | 'bottom' | 'center' | 'subtitle';
}

export class PromptPlugin implements CursorPlugin {
  name = 'prompt';
  private options: PromptPluginOptions;
  private promptElement: HTMLElement | null = null;
  private moveIntervalId: ReturnType<typeof setInterval> | null = null;

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
          self.showPrompt(this, message, options, resolve);
        }).then((val) => {
          if (options?.onComplete) options.onComplete(val);
        });

        // İkisinden birini sıraya koymak yerine ikisini de aynı anda bekliyoruz
        await Promise.all([speechPromise, promptPromise]);
      });
    };
  }

  private showPrompt(
    cursor: Cursor,
    message: string,
    options: PromptOptions | undefined,
    resolve: (value: any) => void,
  ) {
    const position = options?.position || this.options.defaultPosition || 'center';

    this.promptElement = document.createElement('div');
    this.promptElement.className = `cursor-js-prompt cursor-js-prompt-${position}`;

    // Common styling
    Object.assign(this.promptElement.style, {
      position: 'absolute',
      zIndex: '100000',
      padding: '10px 16px',
      borderRadius: '8px',
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

    // Positioning & Position-specific styling
    if (position === 'cursor') {
      const cursorRect = cursor.cursor.el.getBoundingClientRect();
      this.promptElement.style.left = `${cursorRect.left + window.scrollX + 30}px`;
      this.promptElement.style.top = `${cursorRect.top + window.scrollY - 10}px`;

      // Track cursor position
      this.moveIntervalId = setInterval(() => {
        if (this.promptElement && cursor.cursor && cursor.cursor.el) {
          const rect = cursor.cursor.el.getBoundingClientRect();
          this.promptElement.style.left = `${rect.left + window.scrollX + 30}px`;
          this.promptElement.style.top = `${rect.top + window.scrollY - 10}px`;
        }
      }, 16);
    } else if (position === 'bottom') {
      this.promptElement.style.position = 'fixed';
      this.promptElement.style.bottom = '20px';
      this.promptElement.style.left = '50%';
      this.promptElement.style.transform = 'translateX(-50%)';
    } else if (position === 'center') {
      this.promptElement.style.position = 'fixed';
      this.promptElement.style.top = '50%';
      this.promptElement.style.left = '50%';
      this.promptElement.style.transform = 'translate(-50%, -50%)';
    } else if (position === 'subtitle') {
      Object.assign(this.promptElement.style, {
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '80%',
      });
    }

    const cleanup = (value: any) => {
      if (this.promptElement) {
        this.promptElement.remove();
        this.promptElement = null;
      }
      if (this.moveIntervalId) {
        clearInterval(this.moveIntervalId);
        this.moveIntervalId = null;
      }
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
      btnContainer.style.justifyContent = 'center';

      const buttons = options?.buttons || [{ label: 'OK', onClick: 'continue', type: 'primary' }];

      buttons.forEach((btnConfig) => {
        const btn = document.createElement('button');
        btn.textContent = btnConfig.label;
        Object.assign(btn.style, {
          padding: '8px 16px',
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
    requestAnimationFrame(() => {
      if (this.promptElement) this.promptElement.style.opacity = '1';
    });
  }
}
