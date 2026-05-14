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
