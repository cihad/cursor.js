import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SoundPlugin } from './SoundPlugin';
import type { Cursor } from '../core/Cursor';

describe('SoundPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('window', {
      AudioContext: vi.fn().mockImplementation(function () {
        return {
          createOscillator: vi.fn(() => ({
            frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
          })),
          createGain: vi.fn(() => ({
            gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
            connect: vi.fn(),
          })),
          currentTime: 0,
          destination: {},
        };
      }),
    } as any);
    vi.stubGlobal(
      'Audio',
      vi.fn().mockImplementation(function () {
        return {
          play: vi.fn().mockResolvedValue(true),
          currentTime: 0,
          volume: 0.5,
        };
      }) as any,
    );
  });

  it('should initialize with default options', () => {
    const plugin = new SoundPlugin();
    expect(plugin.name).toBe('SoundPlugin');
  });

  it('should use Audio when urls are provided', () => {
    const plugin = new SoundPlugin({
      clickSoundUrl: 'click.mp3',
      typingSoundUrl: 'typing.mp3',
    });

    plugin.install({} as Cursor);

    expect(globalThis.Audio).toHaveBeenCalledWith('click.mp3');
    expect(globalThis.Audio).toHaveBeenCalledWith('typing.mp3');
  });

  it('should react to state change for sound volume', () => {
    const plugin = new SoundPlugin({
      clickSoundUrl: 'click.mp3',
      typingSoundUrl: 'typing.mp3',
      volume: 0.5,
    });
    plugin.install({} as Cursor);
    plugin.onStateChange({ sound: { volume: 0.8 } });

    expect((plugin as any).clickAudio.volume).toBe(0.8);
    expect((plugin as any).typingAudio.volume).toBe(0.8);
  });

  it('should play click sound on onClickStart', () => {
    const plugin = new SoundPlugin({ clickSoundUrl: 'click.mp3' });
    plugin.install({} as Cursor);
    plugin.onClickStart({} as Element);
    expect((plugin as any).clickAudio.play).toHaveBeenCalled();
  });

  it('should play typing sound on onTypeStart', () => {
    const plugin = new SoundPlugin({ typingSoundUrl: 'typing.mp3' });
    plugin.install({} as Cursor);
    plugin.onTypeStart?.('a');
    expect((plugin as any).typingAudio.play).toHaveBeenCalled();
  });
});
