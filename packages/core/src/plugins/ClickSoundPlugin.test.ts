import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Cursor } from '../core/Cursor';
import { ClickSoundPlugin } from './ClickSoundPlugin';

describe('ClickSoundPlugin', () => {
  let mockAudioContext: any;

  beforeEach(() => {
    mockAudioContext = vi.fn().mockImplementation(function () {
      return {
        createOscillator: vi.fn().mockReturnValue({
          type: '',
          frequency: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        }),
        createGain: vi.fn().mockReturnValue({
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        }),
        destination: {},
        currentTime: 0,
      };
    });

    vi.stubGlobal('AudioContext', mockAudioContext);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize AudioContext on install if available', () => {
    const plugin = new ClickSoundPlugin();
    const cursor = new Cursor();

    plugin.install(cursor);

    expect(mockAudioContext).toHaveBeenCalled();
  });

  it('should attempt to play a sound on onClickStart', () => {
    const plugin = new ClickSoundPlugin({ volume: 0.8 });
    const cursor = new Cursor();

    plugin.install(cursor);

    const btn = document.createElement('button');

    // If it doesn't throw, our mock is working and the code executed successfully
    expect(() => plugin.onClickStart(btn)).not.toThrow();
  });

  it('should not crash if AudioContext is not available', () => {
    vi.stubGlobal('AudioContext', undefined);

    const plugin = new ClickSoundPlugin();
    const cursor = new Cursor();

    expect(() => {
      plugin.install(cursor);
      plugin.onClickStart(document.createElement('button'));
    }).not.toThrow();
  });
});
