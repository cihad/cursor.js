import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Cursor } from '../core/Cursor';
import { PromptPlugin } from './PromptPlugin';

describe('PromptPlugin', () => {
  let cursor: Cursor;

  beforeEach(() => {
    cursor = new Cursor();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cursor.destroy();
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
    (cursor as any).prompt('Do you confirm?', {
      buttons: [{ label: 'Confirm', type: 'primary', onClick: () => resolvePrompt('Confirmed') }]
    }).wait(10); // just to kick off the queue

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
      }
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
});
