export type PluginToggleState = {
  say: boolean;
  prompt: boolean;
  speech: boolean;
  geminiTts: boolean;
  floating: boolean;
  waitForUser: boolean;
};

export function normalizePluginToggleState<T extends PluginToggleState>(
  plugins: T,
  plugin: keyof T,
  enabled: boolean,
): T {
  const next = {
    ...plugins,
    [plugin]: enabled,
  } as T;

  if (!enabled) {
    return next;
  }

  switch (plugin) {
    case 'speech':
      next.geminiTts = false as T['geminiTts'];
      break;
    case 'geminiTts':
      next.speech = false as T['speech'];
      break;
  }

  return next;
}
