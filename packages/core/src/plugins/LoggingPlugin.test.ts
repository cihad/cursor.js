import { describe, it, expect, vi } from 'vitest';
import { Cursor } from '../core/Cursor';
import { LoggingPlugin } from './LoggingPlugin';

describe('LoggingPlugin & Plugin System', () => {
  it('should be able to install logging plugin and trigger hooks', async () => {
    const cursor = new Cursor();
    const plugin = new LoggingPlugin();

    // Spy on the console or methods
    const installSpy = vi.spyOn(plugin, 'install');
    const moveSpy = vi.spyOn(plugin, 'onMoveStart');
    const clickSpy = vi.spyOn(plugin, 'onClickStart');
    const hoverSpy = vi.spyOn(plugin, 'onHoverStart');
    const typeSpy = vi.spyOn(plugin, 'onTypeStart');
    const destroySpy = vi.spyOn(plugin, 'onDestroy');

    cursor.use(plugin);

    expect(installSpy).toHaveBeenCalledWith(cursor);

    // Mock an element
    document.body.innerHTML = `
      <button id='btn'>Click</button>
      <input id='inp' type='text' />
    `;
    const btn = document.getElementById('btn')!;
    const inp = document.getElementById('inp') as HTMLInputElement;

    // Perform an action
    await cursor.click(btn);
    await cursor.type(inp, 'hello');

    // Add custom step test
    await cursor.addStep(async () => {
      // Custom action
    });

    cursor.destroy();

    expect(moveSpy).toHaveBeenCalled();
    expect(hoverSpy).toHaveBeenCalledWith(btn);
    expect(clickSpy).toHaveBeenCalledWith(btn);
    expect(typeSpy).toHaveBeenCalledWith('hello');
    expect(destroySpy).toHaveBeenCalled();
  });
});
