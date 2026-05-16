export type PluginToggleState = {
  say: boolean;
  prompt: boolean;
  speech: boolean;
  geminiTts: boolean;
  floatingSay: boolean;
  floatingPrompt: boolean;
  waitForUser: boolean;
  floatingWaitForUser: boolean;
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
    case 'say':
      next.floatingSay = false as T['floatingSay'];
      break;
    case 'floatingSay':
      next.say = false as T['say'];
      break;
    case 'prompt':
      next.floatingPrompt = false as T['floatingPrompt'];
      break;
    case 'floatingPrompt':
      next.prompt = false as T['prompt'];
      break;
    case 'waitForUser':
      next.floatingWaitForUser = false as T['floatingWaitForUser'];
      break;
    case 'floatingWaitForUser':
      next.waitForUser = false as T['waitForUser'];
      break;
    case 'speech':
      next.geminiTts = false as T['geminiTts'];
      break;
    case 'geminiTts':
      next.speech = false as T['speech'];
      break;
  }

  return next;
}
