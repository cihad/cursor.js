import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Cursor } from '../core/Cursor';
import { PromptPlugin } from './PromptPlugin';

class FloatingProviderPlugin {
  name = 'floating';
  private positioner: any;
  constructor(positioner: any) {
    this.positioner = positioner;
  }
  install() {}
  getPromptPositioner() {
    return this.positioner;
  }
}

describe('PromptPlugin', () => {
  let cursor: Cursor;
  let rectSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    cursor = new Cursor();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cursor.destroy();
    rectSpy?.mockRestore();
  });

  it('should add prompt method to cursor', () => {
    cursor.use(new PromptPlugin());
    expect(typeof (cursor as any).prompt).toBe('function');
  });

  it('should create a prompt element when prompt is called', async () => {
    cursor.use(new PromptPlugin());

    let resolvePrompt: any;
    const promptPromise = new Promise((resolve) => {
      resolvePrompt = resolve;
    });

    // Run prompt without waiting
    (cursor as any)
      .prompt('Do you confirm?', {
        buttons: [{ label: 'Confirm', type: 'primary', onClick: () => resolvePrompt('Confirmed') }],
      })
      .wait(10); // just to kick off the queue

    // Wait a little for DOM update
    await new Promise((resolve) => setTimeout(resolve, 30));

    const promptEl = document.querySelector('.cursor-js-prompt');
    expect(promptEl).not.toBeNull();
    expect(promptEl?.textContent).toContain('Do you confirm?');

    const btn = promptEl?.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn?.textContent).toBe('Confirm');

    // Emulate clicking the button
    btn?.click();

    const result = await promptPromise;
    expect(result).toBe('Confirmed');
  });

  it('should use custom render callback if provided', async () => {
    cursor.use(new PromptPlugin());

    let resolvePrompt: any;
    const promptPromise = new Promise((resolve) => {
      resolvePrompt = resolve;
    });

    (cursor as any).prompt('Custom Render', {
      render: (container: HTMLElement, cleanup: (value: any) => void) => {
        container.innerHTML = `<button id="custom-btn">CustomBtn</button>`;
        container.querySelector('#custom-btn')!.addEventListener('click', () => {
          cleanup('CustomValue');
          resolvePrompt('CustomValue');
        });
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 30));

    const promptEl = document.querySelector('.cursor-js-prompt');
    const customBtn = promptEl?.querySelector('#custom-btn') as HTMLButtonElement | null;
    expect(customBtn).not.toBeNull();

    customBtn?.click();

    const result = await promptPromise;
    expect(result).toBe('CustomValue');

    await new Promise((resolve) => setTimeout(resolve, 30));
    // Should be cleaned up
    expect(document.querySelector('.cursor-js-prompt')).toBeNull();
  });

  it('keeps cursor prompts inside the viewport', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 320 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 240 });
    Object.defineProperty(window, 'scrollX', { configurable: true, value: 0 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });

    cursor.cursor.el.getBoundingClientRect = () =>
      ({
        left: 300,
        top: 220,
        right: 320,
        bottom: 240,
        width: 20,
        height: 20,
        x: 300,
        y: 220,
        toJSON: () => {},
      }) as DOMRect;

    rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains('cursor-js-prompt')) {
        return {
          left: 0,
          top: 0,
          right: 180,
          bottom: 80,
          width: 180,
          height: 80,
          x: 0,
          y: 0,
          toJSON: () => {},
        } as DOMRect;
      }

      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as DOMRect;
    });

    cursor.use(new PromptPlugin());
    cursor.prompt('Near the edge', { position: 'cursor' });
    await new Promise((resolve) => setTimeout(resolve, 30));

    const promptEl = document.querySelector<HTMLElement>('.cursor-js-prompt');
    expect(promptEl).not.toBeNull();
    expect(Number.parseFloat(promptEl?.style.left || '0')).toBeLessThanOrEqual(132);
    expect(Number.parseFloat(promptEl?.style.top || '0')).toBeLessThanOrEqual(152);

    promptEl?.querySelector('button')?.click();
  });

  it('uses a custom positioner when one is provided', async () => {
    const cleanup = vi.fn();
    const positioner = vi.fn(({ promptElement }) => {
      promptElement.style.left = '12px';
      promptElement.style.top = '34px';
      return cleanup;
    });

    cursor.use(new PromptPlugin({ positioner }));
    cursor.prompt('Custom position');
    await new Promise((resolve) => setTimeout(resolve, 30));

    const promptEl = document.querySelector<HTMLElement>('.cursor-js-prompt');
    expect(positioner).toHaveBeenCalledOnce();
    expect(promptEl?.style.left).toBe('12px');
    expect(promptEl?.style.top).toBe('34px');

    promptEl?.querySelector('button')?.click();
    await cursor;
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it('uses the floating provider positioner when installed', async () => {
    const cleanup = vi.fn();
    const positioner = vi.fn(({ promptElement }) => {
      promptElement.style.left = '56px';
      promptElement.style.top = '78px';
      return cleanup;
    });

    cursor.use(new FloatingProviderPlugin(positioner) as any);
    cursor.use(new PromptPlugin());
    cursor.prompt('Floating provider prompt');
    await new Promise((resolve) => setTimeout(resolve, 30));

    const promptEl = document.querySelector<HTMLElement>('.cursor-js-prompt');
    expect(positioner).toHaveBeenCalledOnce();
    expect(promptEl?.style.left).toBe('56px');
    expect(promptEl?.style.top).toBe('78px');

    promptEl?.querySelector('button')?.click();
    await cursor;
    expect(cleanup).toHaveBeenCalledOnce();
  });
});
