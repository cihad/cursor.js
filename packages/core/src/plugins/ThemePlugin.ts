import type { CursorPlugin } from './CursorPlugin';
import type { Cursor } from '../core/Cursor';

export interface ThemeCursorItem {
  html: string;
  hotspot?: { x: number; y: number } | 'center' | 'top-left';
  onStateChange?: (wrapperEl: HTMLElement, state: Record<string, any>) => void;
}

export type ThemePack = Record<string, ThemeCursorItem>;

export interface ThemePluginOptions {
  auto?: boolean; // Default true
}

export interface ThemePluginCursorFactoryOptions {
  colors?: {
    primary?: string;
    outline?: string;
  };
}

export type ThemePluginCursorFactory = (
  options?: ThemePluginCursorFactoryOptions,
) => ThemeCursorItem;

type ThemePluginCursorSource = {
  html: string;
  hotspot?: ThemeCursorItem['hotspot'];
  defaultColors: {
    primary: string;
    outline: string;
  };
};

const V1_DEFAULT_SOURCE: ThemePluginCursorSource = {
  html: `<svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24.9062 17.8506L14.3359 21.5273L14.2256 21.5664L14.1436 21.6494L6.91113 28.9932L0.762695 1.13574L24.9062 17.8506Z" fill="var(--cursor-primary, #00FF26)" stroke="var(--cursor-outline, #272727)" stroke-miterlimit="16"/>
    </svg>`,
  hotspot: 'top-left',
  defaultColors: {
    primary: '#00FF26',
    outline: '#272727',
  },
};

const V1_POINTER_SOURCE: ThemePluginCursorSource = {
  html: `<svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.4998 18.4814C23.4998 18.977 23.3973 19.5705 23.243 20.127C23.0885 20.6838 22.8709 21.2429 22.6209 21.665L22.6151 21.6748L22.6141 21.6777C22.6131 21.6793 22.6112 21.6814 22.6092 21.6846C22.6049 21.6915 22.5981 21.7022 22.5897 21.7158C22.5726 21.7435 22.5467 21.7851 22.5145 21.8379C22.4499 21.9435 22.3579 22.0963 22.2469 22.2832C22.0245 22.6577 21.7287 23.1686 21.4334 23.7158C21.1373 24.2647 20.8456 24.8427 20.6297 25.3525C20.4033 25.8872 20.2949 26.2683 20.2948 26.459V28.5H8.17854V26.459C8.17837 26.4263 8.16048 26.3279 8.06721 26.1494C7.9787 25.9801 7.84452 25.7795 7.67073 25.5547C7.32342 25.1055 6.85151 24.6042 6.36799 24.1289C5.88666 23.6558 5.40411 23.2179 5.04084 22.8984C4.85946 22.7389 4.70774 22.6091 4.60237 22.5195C4.55 22.475 4.5091 22.4403 4.48127 22.417C4.46733 22.4053 4.45608 22.3965 4.44905 22.3906C4.4456 22.3878 4.44291 22.3852 4.44124 22.3838L4.43928 22.3828V22.3818L4.43049 22.375L4.75764 21.9971L4.43049 22.374C3.7144 21.752 2.8779 20.5534 2.53987 19.6787L0.59065 14.6357C0.391417 14.1199 0.531278 13.527 0.909986 13.1455L0.878736 13.0869L1.24397 12.8984L1.25374 12.9189C2.98409 12.2534 5.07437 12.8876 6.10139 14.457L6.59065 15.2041V2.58789C6.59067 1.4361 7.51816 0.500155 8.67854 0.5C9.81797 0.5 10.793 1.39936 10.8651 2.55957L11.1864 7.75293C11.4789 7.56878 11.8269 7.46292 12.1951 7.46289C13.2955 7.46289 14.2792 8.00349 14.8553 8.83398C15.1973 8.46339 15.6945 8.23344 16.2362 8.2334C17.3364 8.2334 18.3202 8.77406 18.8963 9.60449C19.2384 9.23394 19.7355 9.00396 20.2772 9.00391C22.0209 9.00391 23.4651 10.3557 23.4998 12.0625V18.4814Z" fill="var(--cursor-primary, #00FF26)" stroke="var(--cursor-outline, #272727)"/>
</svg>`,
  defaultColors: {
    primary: '#00FF26',
    outline: '#272727',
  },
};

const V1_TEXT_SOURCE: ThemePluginCursorSource = {
  html: `<svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.25 2.38333H3.25V14.1167H0.25V16.25H4.25V15.1833H5.25V16.25H9.25V14.1167H6.25V2.38333H9.25V0.25H5.25V1.31667H4.25V0.25H0.25V2.38333Z" fill="var(--cursor-primary, #00FF26)" stroke="var(--cursor-outline, #000000)" stroke-width="0.5"/>
</svg>`,
  hotspot: 'center',
  defaultColors: {
    primary: '#00FF26',
    outline: '#000000',
  },
};

function createThemeCursorFactory(source: ThemePluginCursorSource): ThemePluginCursorFactory {
  return (options = {}) => {
    const colors = {
      primary: options.colors?.primary ?? source.defaultColors.primary,
      outline: options.colors?.outline ?? source.defaultColors.outline,
    };

    return {
      html: source.html,
      hotspot: source.hotspot,
      onStateChange: (wrapperEl: HTMLElement) => {
        wrapperEl.style.setProperty('--cursor-primary', colors.primary);
        wrapperEl.style.setProperty('--cursor-outline', colors.outline);
      },
    };
  };
}

export const v1Default = createThemeCursorFactory(V1_DEFAULT_SOURCE);
export const v1Pointer = createThemeCursorFactory(V1_POINTER_SOURCE);
export const v1Text = createThemeCursorFactory(V1_TEXT_SOURCE);

const themePluginCursors = {
  default: v1Default,
  pointer: v1Pointer,
  text: v1Text,
} as const;

export const defaultTheme: ThemePack = {
  default: themePluginCursors.default(),
  pointer: themePluginCursors.pointer(),
  text: themePluginCursors.text(),
};

function mergeThemePack(themePack: Partial<ThemePack>): ThemePack {
  const merged: ThemePack = { ...defaultTheme };

  for (const [key, value] of Object.entries(themePack)) {
    if (value) {
      merged[key] = value;
    }
  }

  return merged;
}

export class ThemePlugin implements CursorPlugin {
  static cursors = themePluginCursors;
  public name = 'ThemePlugin';
  private cursorRef: Cursor | null = null;
  private wrapper: HTMLDivElement | null = null;
  private themePack: ThemePack;
  private options: ThemePluginOptions;
  private currentCursorType: string = 'default';
  private lastElement: Element | null = null;

  constructor(themePack: Partial<ThemePack> = defaultTheme, options: ThemePluginOptions = {}) {
    this.themePack = mergeThemePack(themePack);
    this.options = { auto: true, ...options };
  }

  install(cursor: Cursor): void {
    this.cursorRef = cursor;

    // Clear GhostCursor default inner HTML if it has the default SVG
    if (this.cursorRef.cursor.el) {
      const el = this.cursorRef.cursor.el;
      el.innerHTML = '';
      el.style.width = '0px';
      el.style.height = '0px';
      el.style.margin = '0px';
      el.style.background = 'transparent';

      this.wrapper = document.createElement('div');
      this.wrapper.className = 'cursor-theme-wrapper';
      this.wrapper.style.position = 'absolute';
      this.wrapper.style.top = '0';
      this.wrapper.style.left = '0';
      // this.wrapper.style.pointerEvents = 'none';
      // this.wrapper.style.zIndex = '9999999';

      this.cursorRef.cursor.el.appendChild(this.wrapper);
    }

    this.renderCursor('default');
  }

  private renderCursor(type: string): void {
    if (!this.wrapper) return;

    const themeItem = this.themePack[type] || this.themePack.default;
    if (!themeItem) return;

    this.wrapper.innerHTML = themeItem.html;
    this.currentCursorType = type;

    if (themeItem.hotspot === 'center') {
      this.wrapper.style.transform = 'translate(-50%, -50%)';
    } else if (themeItem.hotspot === 'top-left' || !themeItem.hotspot) {
      this.wrapper.style.transform = 'translate(0, 0)';
    } else if (typeof themeItem.hotspot === 'object') {
      this.wrapper.style.transform = `translate(-${themeItem.hotspot.x}px, -${themeItem.hotspot.y}px)`;
    }

    // Run initial state change if needed
    if (themeItem.onStateChange && this.cursorRef) {
      themeItem.onStateChange(this.wrapper, this.cursorRef.state);
    }
  }

  onStateChange(newState: Record<string, any>, _oldState: Record<string, any>): void {
    if (newState.theme && typeof newState.theme.cursor === 'string') {
      if (newState.theme.cursor !== this.currentCursorType) {
        this.renderCursor(newState.theme.cursor);
      }
    }

    // Call customized state lifecycle on the element wrapper
    if (this.wrapper) {
      const themeItem = this.themePack[this.currentCursorType];
      // Attribute binding for simple CSS animations
      // Flat properties on state
      for (const [key, value] of Object.entries(newState)) {
        if (typeof value === 'boolean') {
          this.wrapper.setAttribute(`data-cursor-${key}`, value.toString());
        }
      }

      if (themeItem && themeItem.onStateChange) {
        themeItem.onStateChange(this.wrapper, newState);
      }
    }
  }

  onMove(x: number, y: number): void {
    if (!this.options.auto || !this.cursorRef || typeof document === 'undefined') return;

    // Detect element
    try {
      // Need viewport coordinates
      const clientX = x - window.scrollX;
      const clientY = y - window.scrollY;

      // Temporarily hide wrapper so elementFromPoint works correctly underneath it
      if (this.wrapper) this.wrapper.style.pointerEvents = 'none';

      const element = document.elementFromPoint(clientX, clientY);

      if (element && element !== this.lastElement) {
        this.lastElement = element;
        this.autoDetectCursor(element);
      }
    } catch (e) {
      // ignore
    }
  }

  private autoDetectCursor(element: Element): void {
    if (!this.cursorRef) return;

    // Simplistic heuristic, could use getComputedStyle
    const tag = element.tagName.toLowerCase();
    const style = window.getComputedStyle(element);
    const cssCursor = style.cursor;

    let targetCursor = 'default';

    if (cssCursor === 'pointer' || tag === 'a' || tag === 'button') {
      targetCursor = 'pointer';
    } else if (
      tag === 'input' ||
      tag === 'textarea' ||
      (element as HTMLElement).isContentEditable
    ) {
      // Ignore some inputs
      if (tag === 'input') {
        const type = (element as HTMLInputElement).type;
        if (['button', 'submit', 'checkbox', 'radio', 'color', 'file'].includes(type)) {
          targetCursor = 'pointer';
        } else {
          targetCursor = 'text';
        }
      } else {
        targetCursor = 'text';
      }
    } else {
      targetCursor = 'default';
    }

    // Only update synchronously to prevent massive promise queueing delays during move
    if (!this.cursorRef.state.theme) {
      this.cursorRef.state.theme = {};
    }

    if (this.cursorRef.state.theme.cursor !== targetCursor) {
      this.cursorRef.state.theme.cursor = targetCursor;
      this.renderCursor(targetCursor);
    }
  }

  onDestroy(): void {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
    if (this.cursorRef && this.cursorRef.cursor.el) {
      const el = this.cursorRef.cursor.el;
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.margin = '0';
      el.style.marginTop = '-8px';
      el.style.marginLeft = '-8px';
      el.style.background = 'rgba(0, 0, 0, 0.5)';
      el.style.borderRadius = '50%';
    }
  }
}
