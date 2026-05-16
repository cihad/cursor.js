// This acts as a dummy/mock library when open source developers clone the cursor.js
// repository but lack access to the proprietary @cursor.js/pro package.
// The TypeScript compiler & Webpack will alias to this file to prevent build failures.

// Make a catch-all proxy so any imported variable correctly maps to a no-op function / empty object
import {
  PromptPlugin,
  SayPlugin,
  type Cursor,
  type PromptPositioner,
  type SayPositioner,
} from '@cursor.js/core';

declare module '@cursor.js/core' {
  interface Cursor {
    spotlight(target: string | HTMLElement, options?: {
      backdrop?: boolean;
      padding?: number;
      borderRadius?: number;
      borderColor?: string;
      backdropColor?: string;
    }): this;
    removeSpotlight(): this;
    waitForUser(options?: {
      message?: string;
      target?: string | HTMLElement;
      event?: string;
      predicate?: (context: {
        cursor: Cursor;
        target: HTMLElement | null;
        overlayElement: HTMLElement | null;
        spotlightElement: HTMLElement | null;
        lastEvent: Event | null;
      }) => boolean | Promise<boolean>;
      timeout?: number;
      pollInterval?: number;
      showOverlay?: boolean;
      spotlight?: boolean;
      backdrop?: boolean;
      targetPadding?: number;
      pauseEffects?: boolean;
      resumeLabel?: string;
      cancelLabel?: string;
    }): this;
  }
}

const mockProxy = new Proxy(
  {},
  {
    get: function (target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return mockProxy;
      return new Proxy(function () {}, {
        get: function (t, p) {
          return (t as any)[p];
        },
      });
    },
  },
);

// Since Next.js uses strict ES modules occasionally, we export common placeholders.
// You might need to add specific named exports here if Webpack complains about
// 'export "SpecificPlugin" was not found in "@cursor.js/pro"'.
export const ProPlugin = class {};
export const TrailPlugin = class {
  name = 'trail-mock';
  constructor(args: any) {}
  install() {}
  onMove() {}
  onDestroy() {}
};

export const GeminiTTSPlugin = class {
  name = 'gemini-tts-mock';
  constructor(args: any) {}
  install() {}
};

export const ParticlePlugin = class {
  name = 'particle-mock';
  constructor(args: any) {}
  install() {}
  destroy() {}
};

export const FloatingSayPlugin = class {
  name = 'say';
  private fallback = new SayPlugin();

  constructor(_args?: unknown) {}
  install(cursor: Cursor) {
    this.fallback.install(cursor);
  }
  onDestroy() {
    this.fallback.onDestroy?.();
  }
};

export function createFloatingSayPositioner(): SayPositioner {
  return () => {};
}

export const FloatingPromptPlugin = class {
  name = 'prompt';
  private fallback = new PromptPlugin();

  constructor(_args?: unknown) {}
  install(cursor: Cursor) {
    this.fallback.install(cursor);
  }
  onDestroy() {
    this.fallback.onDestroy?.();
  }
};

export function createFloatingPromptPositioner(): PromptPositioner {
  return () => {};
}

export const ScrollIllusionPlugin = class {
  name = 'scroll-illusion-mock';
  constructor(args: any) {}
  install() {}
};

export const SpotlightPlugin = class {
  name = 'spotlight';
  constructor(args?: any) {}
  install() {}
  show() {
    return null;
  }
  hide() {}
  getElement() {
    return null;
  }
};

export const WaitForUserPlugin = class {
  name = 'wait-for-user';
  private activeSession:
    | {
        resume: (value?: unknown) => void;
        cancel: (value?: unknown) => void;
      }
    | null = null;

  install(cursor: any) {
    const plugin = this;

    // @ts-ignore
    cursor.constructor.prototype.waitForUser = function (options?: any) {
      return this.addStep(async () => {
        await plugin.waitForUser(this, options);
      });
    };
  }

  resume(value?: unknown) {
    this.activeSession?.resume(value);
  }

  cancel(value?: unknown) {
    this.activeSession?.cancel(value);
  }

  onDestroy() {
    this.cancel();
  }

  private waitForUser(cursor: Cursor, options: any = {}): Promise<void> {
    const showOverlay =
      options.showOverlay ??
      Boolean(
        options.message ||
          options.resumeLabel ||
          options.cancelLabel ||
          options.spotlight ||
          options.backdrop,
      );
    const pollInterval = options.pollInterval ?? 50;
    const overlayElement = showOverlay ? this.createOverlay(options) : null;
    const spotlightElement =
      showOverlay && (options.spotlight || options.backdrop) ? this.createSpotlight() : null;
    const targetPadding = options.targetPadding ?? 12;
    const wasPaused = cursor.isGlobalPaused;
    let lastEvent: Event | null = null;
    let resolved = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let predicateTimerId: ReturnType<typeof setTimeout> | null = null;
    let spotlightTimerId: ReturnType<typeof setTimeout> | null = null;

    if (overlayElement) {
      document.body.appendChild(overlayElement);
    }

    if (spotlightElement && overlayElement) {
      overlayElement.appendChild(spotlightElement);
    }

    if (options.pauseEffects && !wasPaused) {
      cursor.pause();
    }

    return new Promise<void>((resolve) => {
      const cleanupFns: Array<() => void> = [];

      const getTarget = () => this.resolveTarget(options.target);
      const getContext = () => ({
        cursor,
        target: getTarget(),
        overlayElement,
        spotlightElement,
        lastEvent,
      });

      const cleanup = () => {
        cleanupFns.forEach((fn) => fn());
        if (timeoutId) clearTimeout(timeoutId);
        if (predicateTimerId) clearTimeout(predicateTimerId);
        if (spotlightTimerId) clearTimeout(spotlightTimerId);
        overlayElement?.remove();
        this.activeSession = null;

        if (options.pauseEffects && !wasPaused) {
          cursor.play();
        }
      };

      const finalize = () => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve();
      };

      this.activeSession = {
        resume: () => finalize(),
        cancel: () => finalize(),
      };

      if (options.resumeLabel && overlayElement) {
        const button = this.createButton(options.resumeLabel, 'primary');
        button.addEventListener('click', () => this.resume());
        this.getPanel(overlayElement).appendChild(button);
      }

      if (options.cancelLabel && overlayElement) {
        const button = this.createButton(options.cancelLabel, 'secondary');
        button.addEventListener('click', () => this.cancel());
        this.getPanel(overlayElement).appendChild(button);
      }

      if (options.event) {
        cleanupFns.push(
          this.bindEventListener(options, (eventTarget, event) => {
            lastEvent = event;
            void this.evaluatePredicate(options.predicate, getContext()).then((matched) => {
              if (!matched) return;
              finalize();
            });
          }),
        );
      }

      if (options.predicate) {
        const checkPredicate = () => {
          void this.evaluatePredicate(options.predicate, getContext()).then((matched) => {
            if (resolved) return;

            if (matched) {
              finalize();
              return;
            }

            predicateTimerId = setTimeout(checkPredicate, pollInterval);
          });
        };

        predicateTimerId = setTimeout(checkPredicate, pollInterval);
      }

      if (spotlightElement) {
        const updateSpotlight = () => {
          if (resolved) return;
          this.positionSpotlight(
            spotlightElement,
            getTarget(),
            targetPadding,
            options.backdrop === true,
          );
          spotlightTimerId = setTimeout(updateSpotlight, pollInterval);
        };

        updateSpotlight();
      }

      if (typeof options.timeout === 'number' && options.timeout >= 0) {
        timeoutId = setTimeout(() => finalize(), options.timeout);
      }
    });
  }

  private async evaluatePredicate(predicate: any, context: any): Promise<boolean> {
    if (!predicate) return true;
    return Boolean(await predicate(context));
  }

  private bindEventListener(
    options: { event?: string; target?: string | HTMLElement },
    listener: (eventTarget: EventTarget | null, event: Event) => void,
  ) {
    const eventName = options.event ?? 'click';

    if (typeof options.target === 'string') {
      const delegatedListener = (event: Event) => {
        const eventTarget = event.target;
        if (!(eventTarget instanceof Element)) return;
        const matched = eventTarget.closest(options.target as string);
        if (!matched) return;
        listener(matched, event);
      };

      document.addEventListener(eventName, delegatedListener);
      return () => document.removeEventListener(eventName, delegatedListener);
    }

    const target = this.resolveTarget(options.target) ?? document;
    const directListener = (event: Event) => listener(event.currentTarget, event);
    target.addEventListener(eventName, directListener);
    return () => target.removeEventListener(eventName, directListener);
  }

  private resolveTarget(target?: string | HTMLElement) {
    if (!target) return null;
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      return element instanceof HTMLElement ? element : null;
    }
    return target instanceof HTMLElement ? target : null;
  }

  private createOverlay(options: { message?: string }) {
    const overlay = document.createElement('div');
    overlay.className = 'cursor-js-wait-for-user-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '100001',
      pointerEvents: 'none',
    });

    const panel = document.createElement('div');
    panel.className = 'cursor-js-wait-for-user-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      left: '50%',
      bottom: '32px',
      transform: 'translateX(-50%)',
      minWidth: '260px',
      maxWidth: 'min(420px, calc(100vw - 32px))',
      padding: '14px 16px',
      borderRadius: '16px',
      background: 'rgba(15, 23, 42, 0.92)',
      color: '#f8fafc',
      boxShadow: '0 18px 48px rgba(15, 23, 42, 0.32)',
      border: '1px solid rgba(148, 163, 184, 0.28)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      pointerEvents: 'auto',
      fontFamily: 'sans-serif',
    });

    if (options.message) {
      const message = document.createElement('div');
      message.textContent = options.message;
      Object.assign(message.style, {
        flexBasis: '100%',
        fontSize: '14px',
        lineHeight: '1.5',
      });
      panel.appendChild(message);
    }

    overlay.appendChild(panel);
    return overlay;
  }

  private createSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-js-wait-for-user-spotlight';
    Object.assign(spotlight.style, {
      position: 'fixed',
      borderRadius: '16px',
      border: '2px solid rgba(251, 146, 60, 0.95)',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      transition: 'all 120ms ease-out',
    });
    return spotlight;
  }

  private positionSpotlight(
    spotlight: HTMLElement,
    target: HTMLElement | null,
    padding: number,
    backdrop: boolean,
  ) {
    if (!target) {
      spotlight.style.display = 'none';
      return;
    }

    const rect = target.getBoundingClientRect();
    spotlight.style.display = 'block';
    spotlight.style.left = `${rect.left - padding}px`;
    spotlight.style.top = `${rect.top - padding}px`;
    spotlight.style.width = `${rect.width + padding * 2}px`;
    spotlight.style.height = `${rect.height + padding * 2}px`;
    spotlight.style.boxShadow = backdrop
      ? '0 0 0 9999px rgba(15, 23, 42, 0.58)'
      : '0 0 0 1px rgba(251, 146, 60, 0.2)';
  }

  private createButton(label: string, variant: 'primary' | 'secondary') {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    Object.assign(button.style, {
      border: 'none',
      borderRadius: '999px',
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      background: variant === 'primary' ? '#f97316' : 'rgba(148, 163, 184, 0.22)',
      color: '#f8fafc',
    });
    return button;
  }

  private getPanel(overlay: HTMLElement) {
    const panel = overlay.querySelector('.cursor-js-wait-for-user-panel');
    if (!(panel instanceof HTMLElement)) {
      throw new Error('WaitForUserPlugin mock panel is missing.');
    }
    return panel;
  }
};

export const FloatingWaitForUserPlugin = class {
  name = 'wait-for-user';
  private fallback = new WaitForUserPlugin();

  constructor(_args?: unknown) {}
  install(cursor: Cursor) {
    this.fallback.install(cursor);
  }
  resume(value?: unknown) {
    this.fallback.resume(value);
  }
  cancel(value?: unknown) {
    this.fallback.cancel(value);
  }
  onDestroy() {
    this.fallback.onDestroy?.();
  }
};

export function createFloatingWaitForUserPositioner() {
  return () => {};
}

export default mockProxy;

export const OutlinePlugin = class {
  name = 'outline-mock';
  constructor(args?: any) {}
  install() {}
};

const mockCursorFactory = () => ({
  html: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"></svg>',
  hotspot: 'top-left' as const,
});

export const proCursorCatalog = {
  default: [
    {
      exportName: 'bibataDark',
      label: 'Mock Cursor',
      slot: 'default' as const,
      presets: [],
      isConfigurable: false,
      defaultColors: {},
      hotspot: 'top-left' as const,
      factory: mockCursorFactory,
      previewHtml: mockCursorFactory().html,
    },
  ],
  pointer: [
    {
      exportName: 'bibataPointer',
      label: 'Mock Pointer',
      slot: 'pointer' as const,
      presets: [],
      isConfigurable: false,
      defaultColors: {},
      hotspot: 'top-left' as const,
      factory: mockCursorFactory,
      previewHtml: mockCursorFactory().html,
    },
  ],
  text: [
    {
      exportName: 'bibataText',
      label: 'Mock Text',
      slot: 'text' as const,
      presets: [],
      isConfigurable: false,
      defaultColors: {},
      hotspot: 'top-left' as const,
      factory: mockCursorFactory,
      previewHtml: mockCursorFactory().html,
    },
  ],
};
