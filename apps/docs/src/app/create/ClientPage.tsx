'use client';

import { useState, useReducer, useEffect, useRef } from 'react';
import {
  Settings,
  MousePointer2,
  PaintBucket,
  Sparkles,
  MessageSquare,
  Mic,
  Volume2,
  Play,
  Palette,
  Navigation,
  Terminal,
  Image,
  AudioLines,
  ScanLine,
  Gem,
  Code,
  ExternalLink,
  Info,
  ArrowLeft,
} from 'lucide-react';
import {
  Cursor,
  ThemePlugin,
  RipplePlugin,
  SayPlugin,
  PromptPlugin,
  IndicatorPlugin,
  SoundPlugin,
  LoggingPlugin,
  SpeechPlugin,
} from '@cursor.js/core';
import { TrailPlugin, ParticlePlugin, GeminiTTSPlugin, OutlinePlugin } from '@cursor.js/pro';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

// Settings type and reducer from home page
type SettingsState = {
  coreConfig: { humanize: boolean; speed: number; size: number };
  plugins: {
    theme: boolean;
    ripple: boolean;
    indicator: boolean;
    sound: boolean;
    logging: boolean;
    trail: boolean;
    particle: boolean;
    say: boolean;
    prompt: boolean;
    speech: boolean;
    geminiTts: boolean;
    outline: boolean;
  };
  rippleConfig: { color: string; duration: number; size: number };
  trailConfig: { length: number; thickness: number; color: string; fadeDuration: number };
  particleConfig: {
    size: number;
    color: string;
    duration: number;
    particleCount: number;
    scatterDistance: number;
  };
  soundConfig: { volume: number; clickSoundUrl: string; typingSoundUrl: string };
  speechConfig: { lang: string; rate: number; pitch: number; voiceName: string };
  geminiTtsConfig: { speaker: string; style: string; model: string; language: string };
  outlineConfig: { resolution: number };
  indicatorConfig: { color: string; size: number };
};

type SettingsAction =
  | { type: 'TOGGLE_PLUGIN'; plugin: keyof SettingsState['plugins']; enabled: boolean }
  | {
      type: 'UPDATE_CORE_CONFIG';
      key: keyof SettingsState['coreConfig'];
      value: string | number | boolean;
    }
  | {
      type: 'UPDATE_INDICATOR_CONFIG';
      key: keyof SettingsState['indicatorConfig'];
      value: string | number;
    }
  | {
      type: 'UPDATE_RIPPLE_CONFIG';
      key: keyof SettingsState['rippleConfig'];
      value: string | number;
    }
  | { type: 'UPDATE_TRAIL_CONFIG'; key: keyof SettingsState['trailConfig']; value: string | number }
  | {
      type: 'UPDATE_PARTICLE_CONFIG';
      key: keyof SettingsState['particleConfig'];
      value: string | number;
    }
  | { type: 'UPDATE_SOUND_CONFIG'; key: keyof SettingsState['soundConfig']; value: string | number }
  | {
      type: 'UPDATE_SPEECH_CONFIG';
      key: keyof SettingsState['speechConfig'];
      value: string | number;
    }
  | {
      type: 'UPDATE_GEMINI_TTS_CONFIG';
      key: keyof SettingsState['geminiTtsConfig'];
      value: string;
    }
  | { type: 'UPDATE_OUTLINE_CONFIG'; key: keyof SettingsState['outlineConfig']; value: number };

const initialSettings: SettingsState = {
  coreConfig: { humanize: true, speed: 0.7, size: 1 },
  plugins: {
    theme: true,
    ripple: true,
    indicator: true,
    sound: false,
    logging: false,
    trail: true,
    particle: true,
    say: true,
    prompt: true,
    speech: false,
    geminiTts: true,
    outline: true,
  },
  rippleConfig: { color: '#000000', duration: 600, size: 50 },
  trailConfig: { length: 40, thickness: 7, color: '#0099ff', fadeDuration: 500 },
  particleConfig: {
    size: 6,
    color: '#0099ff',
    duration: 600,
    particleCount: 5,
    scatterDistance: 30,
  },
  soundConfig: { volume: 0.5, clickSoundUrl: '/click.mp3', typingSoundUrl: '/typing.mp3' },
  speechConfig: { lang: 'en-US', rate: 1, pitch: 1, voiceName: '' },
  geminiTtsConfig: {
    speaker: 'Achernar',
    style: 'default',
    model: 'models/gemini-2.0-flash',
    language: 'en',
  },
  outlineConfig: { resolution: 2 },
  indicatorConfig: { color: '#000000', size: 12 },
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'TOGGLE_PLUGIN':
      return { ...state, plugins: { ...state.plugins, [action.plugin]: action.enabled } };
    case 'UPDATE_CORE_CONFIG':
      return { ...state, coreConfig: { ...state.coreConfig, [action.key]: action.value } };
    case 'UPDATE_INDICATOR_CONFIG':
      return {
        ...state,
        indicatorConfig: { ...state.indicatorConfig, [action.key]: action.value },
      };
    case 'UPDATE_RIPPLE_CONFIG':
      return { ...state, rippleConfig: { ...state.rippleConfig, [action.key]: action.value } };
    case 'UPDATE_TRAIL_CONFIG':
      return { ...state, trailConfig: { ...state.trailConfig, [action.key]: action.value } };
    case 'UPDATE_PARTICLE_CONFIG':
      return { ...state, particleConfig: { ...state.particleConfig, [action.key]: action.value } };
    case 'UPDATE_SOUND_CONFIG':
      return { ...state, soundConfig: { ...state.soundConfig, [action.key]: action.value } };
    case 'UPDATE_SPEECH_CONFIG':
      return { ...state, speechConfig: { ...state.speechConfig, [action.key]: action.value } };
    case 'UPDATE_GEMINI_TTS_CONFIG':
      return {
        ...state,
        geminiTtsConfig: { ...state.geminiTtsConfig, [action.key]: action.value },
      };
    case 'UPDATE_OUTLINE_CONFIG':
      return { ...state, outlineConfig: { ...state.outlineConfig, [action.key]: action.value } };
    default:
      return state;
  }
}

function SidebarItem({
  id,
  label,
  icon: Icon,
  activeCategory,
  onClick,
  isPro,
  hasSwitch,
  switchChecked,
  onSwitchChange,
  hasDemo,
  demoUrl,
}: {
  id: string;
  label: string;
  icon: any;
  activeCategory: string;
  onClick: () => void;
  isPro?: boolean;
  hasSwitch?: boolean;
  switchChecked?: boolean;
  onSwitchChange?: (val: boolean) => void;
  hasDemo?: boolean;
  demoUrl?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2 rounded-md cursor-pointer ${activeCategory === id ? 'bg-secondary' : 'hover:bg-accent'}`}
    >
      <div className="flex items-center">
        <Icon className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">{label}</span>
        {isPro && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Gem className="w-3 h-3 ml-2 text-blue-500 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-[200px] text-xs">
              This is a Pro plugin. Available via @cursor.js/pro.
            </HoverCardContent>
          </HoverCard>
        )}
        {hasDemo && demoUrl && (
          <div onClick={(e) => e.stopPropagation()} className="ml-2 flex items-center">
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent
                side="right"
                className="p-0 z-[9999999] overflow-hidden border bg-background rounded-lg shadow-md w-[320px] h-[250px]"
              >
                <iframe
                  src={demoUrl}
                  className="w-full h-full border-0 pointer-events-none"
                  scrolling="no"
                />
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
      </div>
      {hasSwitch && onSwitchChange !== undefined && switchChecked !== undefined && (
        <Switch
          checked={switchChecked}
          onCheckedChange={onSwitchChange}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}

export function ClientPage() {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
  const [activeCategory, setActiveCategory] = useState<string>('core');
  const actorRef = useRef<Cursor | null>(null);

  const getInitializationCode = () => {
    const coreImports: string[] = ['Cursor'];
    const proImports: string[] = [];

    const activeCore: string[] = [];
    const activePro: string[] = [];

    // Core
    if (settings.plugins.theme) activeCore.push('ThemePlugin');
    if (settings.plugins.indicator) activeCore.push('IndicatorPlugin');
    if (settings.plugins.ripple) activeCore.push('RipplePlugin');
    if (settings.plugins.sound) activeCore.push('SoundPlugin');
    if (settings.plugins.logging) activeCore.push('LoggingPlugin');
    if (settings.plugins.say) activeCore.push('SayPlugin');
    if (settings.plugins.prompt) activeCore.push('PromptPlugin');
    if (settings.plugins.speech) activeCore.push('SpeechPlugin');

    // Pro
    if (settings.plugins.trail) activePro.push('TrailPlugin');
    if (settings.plugins.particle) activePro.push('ParticlePlugin');
    if (settings.plugins.geminiTts) activePro.push('GeminiTTSPlugin');
    if (settings.plugins.outline) activePro.push('OutlinePlugin');

    coreImports.push(...activeCore);
    proImports.push(...activePro);

    const importLines = [`import { ${coreImports.join(', ')} } from '@cursor.js/core';`];
    if (proImports.length > 0) {
      importLines.push(`import { ${proImports.join(', ')} } from '@cursor.js/pro';`);
    }

    const coreDiff: Record<string, any> = {};
    if (settings.coreConfig.humanize !== initialSettings.coreConfig.humanize)
      coreDiff.humanize = settings.coreConfig.humanize;
    if (settings.coreConfig.speed !== initialSettings.coreConfig.speed)
      coreDiff.speed = settings.coreConfig.speed;
    if (settings.coreConfig.size !== initialSettings.coreConfig.size)
      coreDiff.size = settings.coreConfig.size;

    const constructorParam =
      Object.keys(coreDiff).length > 0 ? `\n${JSON.stringify(coreDiff, null, 2)}\n` : '';
    const initLines = [`\nconst cursor = new Cursor(${constructorParam});\n`];

    const getPluginDiff = (currentKey: keyof SettingsState) => {
      const current = settings[currentKey] as any;
      const init = initialSettings[currentKey] as any;
      const diff: Record<string, any> = {};
      Object.keys(current).forEach((key) => {
        if (current[key] !== init[key]) {
          diff[key] = current[key];
        }
      });
      return Object.keys(diff).length > 0 ? `(${JSON.stringify(diff)})` : '()';
    };

    if (settings.plugins.theme) initLines.push(`cursor.use(new ThemePlugin());`);
    if (settings.plugins.indicator)
      initLines.push(`cursor.use(new IndicatorPlugin${getPluginDiff('indicatorConfig')});`);
    if (settings.plugins.ripple)
      initLines.push(`cursor.use(new RipplePlugin${getPluginDiff('rippleConfig')});`);
    if (settings.plugins.sound)
      initLines.push(`cursor.use(new SoundPlugin${getPluginDiff('soundConfig')});`);
    if (settings.plugins.logging) initLines.push(`cursor.use(new LoggingPlugin());`);
    if (settings.plugins.trail)
      initLines.push(`cursor.use(new TrailPlugin${getPluginDiff('trailConfig')});`);
    if (settings.plugins.particle)
      initLines.push(`cursor.use(new ParticlePlugin${getPluginDiff('particleConfig')});`);
    if (settings.plugins.say) initLines.push(`cursor.use(new SayPlugin());`);
    if (settings.plugins.prompt) initLines.push(`cursor.use(new PromptPlugin());`);
    if (settings.plugins.speech)
      initLines.push(`cursor.use(new SpeechPlugin${getPluginDiff('speechConfig')});`);
    if (settings.plugins.outline)
      initLines.push(`cursor.use(new OutlinePlugin${getPluginDiff('outlineConfig')});`);
    if (settings.plugins.geminiTts) {
      const diffStr = getPluginDiff('geminiTtsConfig');
      const paramStr =
        diffStr === '()'
          ? '({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })'
          : `({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY, ...${diffStr.slice(1, -1)} })`;
      initLines.push(`cursor.use(new GeminiTTSPlugin${paramStr});`);
    }

    return importLines.join('\n') + initLines.join('\n');
  };

  const runDemo = () => {
    if (actorRef.current) {
      actorRef.current.destroy();
    }

    // Create cursor with current settings
    const cursor = new Cursor({
      humanize: settings.coreConfig.humanize,
      speed: settings.coreConfig.speed,
      size: settings.coreConfig.size,
    });

    actorRef.current = cursor;

    if (settings.plugins.theme) cursor.use(new ThemePlugin());
    if (settings.plugins.indicator) cursor.use(new IndicatorPlugin(settings.indicatorConfig));
    if (settings.plugins.sound) cursor.use(new SoundPlugin(settings.soundConfig));
    if (settings.plugins.logging) cursor.use(new LoggingPlugin());
    if (settings.plugins.ripple) cursor.use(new RipplePlugin(settings.rippleConfig));
    if (settings.plugins.trail) cursor.use(new TrailPlugin(settings.trailConfig));
    if (settings.plugins.particle) cursor.use(new ParticlePlugin(settings.particleConfig));
    if (settings.plugins.say) cursor.use(new SayPlugin());
    if (settings.plugins.prompt) cursor.use(new PromptPlugin());
    if (settings.plugins.speech) cursor.use(new SpeechPlugin(settings.speechConfig));
    if (settings.plugins.outline) cursor.use(new OutlinePlugin(settings.outlineConfig));
    if (settings.plugins.geminiTts && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      cursor.use(
        new GeminiTTSPlugin({
          apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
          ...settings.geminiTtsConfig,
        }),
      );
    }

    cursor
      .move('#demo-input')
      .click('#demo-input')
      .type('#demo-input', 'Hello Cursor.js!')
      .wait(500)
      .say('Nice to meet you!', { duration: 2000 })
      .wait(500)
      .move('#demo-button')
      .click('#demo-button');
  };

  return (
    <div className="flex w-full overflow-hidden bg-background" style={{ height: '100vh' }}>
      {/* LEFT COLUMN: Categories */}
      <div className="w-[300px] flex-shrink-0 border-r hidden md:flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 w-full justify-start text-sm"
            onClick={() => (window.location.href = '/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Homepage
          </Button>
          <div className="text-sm font-medium mb-2 text-muted-foreground">General Settings</div>
          <SidebarItem
            id="core"
            label="Core Config"
            icon={Settings}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('core')}
          />

          <div className="text-sm font-medium mt-6 mb-2 text-muted-foreground">Plugins</div>
          <SidebarItem
            id="theme"
            hasDemo
            demoUrl="/demos/theme"
            label="Theme"
            icon={Palette}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('theme')}
            hasSwitch
            switchChecked={settings.plugins.theme}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'theme', enabled: val })
            }
          />
          <SidebarItem
            id="indicator"
            hasDemo
            demoUrl="/demos/indicator"
            label="Indicator"
            icon={Navigation}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('indicator')}
            hasSwitch
            switchChecked={settings.plugins.indicator}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'indicator', enabled: val })
            }
          />
          <SidebarItem
            id="sound"
            hasDemo
            demoUrl="/demos/sound"
            label="Sound"
            icon={Volume2}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('sound')}
            hasSwitch
            switchChecked={settings.plugins.sound}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'sound', enabled: val })
            }
          />
          <SidebarItem
            id="ripple"
            hasDemo
            demoUrl="/demos/ripple"
            label="Ripple"
            icon={MousePointer2}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('ripple')}
            hasSwitch
            switchChecked={settings.plugins.ripple}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'ripple', enabled: val })
            }
          />
          <SidebarItem
            id="trail"
            hasDemo
            demoUrl="/demos/trail"
            label="Trail"
            icon={PaintBucket}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('trail')}
            isPro
            hasSwitch
            switchChecked={settings.plugins.trail}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'trail', enabled: val })
            }
          />
          <SidebarItem
            id="particle"
            hasDemo
            demoUrl="/demos/particle"
            label="Particle"
            icon={Sparkles}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('particle')}
            isPro
            hasSwitch
            switchChecked={settings.plugins.particle}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'particle', enabled: val })
            }
          />
          <SidebarItem
            id="say"
            hasDemo
            demoUrl="/demos/say"
            label="Say"
            icon={MessageSquare}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('say')}
            hasSwitch
            switchChecked={settings.plugins.say}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'say', enabled: val })
            }
          />
          <SidebarItem
            id="prompt"
            hasDemo
            demoUrl="/demos/prompt"
            label="Prompt"
            icon={Image}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('prompt')}
            hasSwitch
            switchChecked={settings.plugins.prompt}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'prompt', enabled: val })
            }
          />
          <SidebarItem
            id="speech"
            hasDemo
            demoUrl="/demos/speech"
            label="Speech"
            icon={AudioLines}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('speech')}
            hasSwitch
            switchChecked={settings.plugins.speech}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'speech', enabled: val })
            }
          />
          <SidebarItem
            id="geminiTts"
            hasDemo
            demoUrl="/demos/geminitts"
            label="Gemini TTS"
            icon={Mic}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('geminiTts')}
            isPro
            hasSwitch
            switchChecked={settings.plugins.geminiTts}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'geminiTts', enabled: val })
            }
          />
          <SidebarItem
            id="outline"
            hasDemo
            demoUrl="/demos/outline"
            label="Outline"
            icon={ScanLine}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('outline')}
            isPro
            hasSwitch
            switchChecked={settings.plugins.outline}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'outline', enabled: val })
            }
          />
          <SidebarItem
            id="logging"
            hasDemo
            demoUrl="/demos/logging"
            label="Logging"
            icon={Terminal}
            activeCategory={activeCategory}
            onClick={() => setActiveCategory('logging')}
            hasSwitch
            switchChecked={settings.plugins.logging}
            onSwitchChange={(val) =>
              dispatch({ type: 'TOGGLE_PLUGIN', plugin: 'logging', enabled: val })
            }
          />
        </div>

        {/* Create Button area inside Left Column */}
        <div className="p-4 border-t bg-background mt-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Code className="w-4 h-4 mr-2" />
                Show Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Cursor Initialization Code</DialogTitle>
                <DialogDescription>Copy and paste this into your project.</DialogDescription>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-md overflow-x-auto text-xs font-mono whitespace-pre text-foreground">
                {getInitializationCode()}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* MIDDLE COLUMN: Details */}
      <div className="w-[350px] flex-shrink-0 border-r overflow-y-auto hidden lg:block bg-muted/20">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 capitalize">{activeCategory} Settings</h2>

          {activeCategory === 'core' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Speed ({settings.coreConfig.speed})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.coreConfig.speed}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_CORE_CONFIG',
                      key: 'speed',
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Size ({settings.coreConfig.size})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.coreConfig.size}
                  min={0.5}
                  max={2}
                  step={0.1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_CORE_CONFIG',
                      key: 'size',
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Humanize Movement</Label>
                <Switch
                  checked={settings.coreConfig.humanize}
                  onCheckedChange={(val) =>
                    dispatch({ type: 'UPDATE_CORE_CONFIG', key: 'humanize', value: val })
                  }
                />
              </div>
            </div>
          )}

          {activeCategory === 'ripple' && (
            <div
              className={`space-y-6 ${!settings.plugins.ripple ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={settings.rippleConfig.color}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_RIPPLE_CONFIG', key: 'color', value: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Size ({settings.rippleConfig.size}px)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.rippleConfig.size}
                  min={10}
                  max={100}
                  step={1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_RIPPLE_CONFIG',
                      key: 'size',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Duration ({settings.rippleConfig.duration}ms)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.rippleConfig.duration}
                  min={200}
                  max={1500}
                  step={100}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_RIPPLE_CONFIG',
                      key: 'duration',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Add more categories here for trail, particle... */}
          {activeCategory === 'trail' && (
            <div
              className={`space-y-6 ${!settings.plugins.trail ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={settings.trailConfig.color}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_TRAIL_CONFIG', key: 'color', value: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Length ({settings.trailConfig.length})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.trailConfig.length}
                  min={10}
                  max={100}
                  step={1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_TRAIL_CONFIG',
                      key: 'length',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Thickness ({settings.trailConfig.thickness}px)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.trailConfig.thickness}
                  min={1}
                  max={20}
                  step={1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_TRAIL_CONFIG',
                      key: 'thickness',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Fade Duration ({settings.trailConfig.fadeDuration}ms)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.trailConfig.fadeDuration}
                  min={100}
                  max={2000}
                  step={50}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_TRAIL_CONFIG',
                      key: 'fadeDuration',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          {activeCategory === 'particle' && (
            <div
              className={`space-y-6 ${!settings.plugins.particle ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={settings.particleConfig.color}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_PARTICLE_CONFIG',
                      key: 'color',
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Size ({settings.particleConfig.size}px)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.particleConfig.size}
                  min={2}
                  max={15}
                  step={1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_PARTICLE_CONFIG',
                      key: 'size',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Duration ({settings.particleConfig.duration}ms)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.particleConfig.duration}
                  min={200}
                  max={1500}
                  step={50}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_PARTICLE_CONFIG',
                      key: 'duration',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Particle Count ({settings.particleConfig.particleCount})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.particleConfig.particleCount}
                  min={1}
                  max={20}
                  step={1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_PARTICLE_CONFIG',
                      key: 'particleCount',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Scatter Distance ({settings.particleConfig.scatterDistance}px)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.particleConfig.scatterDistance}
                  min={10}
                  max={100}
                  step={5}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_PARTICLE_CONFIG',
                      key: 'scatterDistance',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          {activeCategory === 'say' && (
            <div
              className={`space-y-6 ${!settings.plugins.say ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="text-muted-foreground text-sm">
                No extra configuration for this plugin yet.
              </div>
            </div>
          )}
          {activeCategory === 'prompt' && (
            <div
              className={`space-y-6 ${!settings.plugins.prompt ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="text-muted-foreground text-sm">
                No extra configuration for this plugin yet.
              </div>
            </div>
          )}
          {activeCategory === 'speech' && (
            <div
              className={`space-y-6 ${!settings.plugins.speech ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Language</Label>
                <Input disabled value={settings.speechConfig.lang} />
              </div>
              <div className="space-y-2">
                <Label>Rate ({settings.speechConfig.rate})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.speechConfig.rate}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SPEECH_CONFIG',
                      key: 'rate',
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Pitch ({settings.speechConfig.pitch})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.speechConfig.pitch}
                  min={0}
                  max={2}
                  step={0.1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SPEECH_CONFIG',
                      key: 'pitch',
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Voice Name</Label>
                <Input
                  value={settings.speechConfig.voiceName}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SPEECH_CONFIG',
                      key: 'voiceName',
                      value: e.target.value,
                    })
                  }
                  placeholder="e.g. Google US English"
                />
              </div>
            </div>
          )}
          {activeCategory === 'geminiTts' && (
            <div
              className={`space-y-6 ${!settings.plugins.geminiTts ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Speaker</Label>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  value={settings.geminiTtsConfig.speaker}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_GEMINI_TTS_CONFIG',
                      key: 'speaker',
                      value: e.target.value,
                    })
                  }
                >
                  <option value="Aoede">Aoede</option>
                  <option value="Charon">Charon</option>
                  <option value="Fenrir">Fenrir</option>
                  <option value="Kore">Kore</option>
                  <option value="Puck">Puck</option>
                  <option value="Achernar">Achernar</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Style</Label>
                <Input disabled value={settings.geminiTtsConfig.style} />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input disabled value={settings.geminiTtsConfig.model} />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Input disabled value={settings.geminiTtsConfig.language} />
              </div>
            </div>
          )}
          {activeCategory === 'outline' && (
            <div
              className={`space-y-6 ${!settings.plugins.outline ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Resolution ({settings.outlineConfig.resolution})</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.outlineConfig.resolution}
                  min={1}
                  max={5}
                  step={0.5}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_OUTLINE_CONFIG',
                      key: 'resolution',
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          {activeCategory === 'theme' && (
            <div
              className={`space-y-6 ${!settings.plugins.theme ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="text-muted-foreground text-sm">No extra configuration for Theme.</div>
            </div>
          )}
          {activeCategory === 'indicator' && (
            <div
              className={`space-y-6 ${!settings.plugins.indicator ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={settings.indicatorConfig?.color || '#000000'}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_INDICATOR_CONFIG',
                      key: 'color',
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Size ({settings.indicatorConfig?.size || 12}px)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.indicatorConfig?.size || 12}
                  min={8}
                  max={40}
                  step={1}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_INDICATOR_CONFIG',
                      key: 'size',
                      value: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}
          {activeCategory === 'sound' && (
            <div
              className={`space-y-6 ${!settings.plugins.sound ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="space-y-2">
                <Label>Volume ({Math.round(settings.soundConfig.volume * 100)}%)</Label>
                <input
                  type="range"
                  className="w-full"
                  value={settings.soundConfig.volume}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SOUND_CONFIG',
                      key: 'volume',
                      value: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Click Sound URL</Label>
                <Input
                  value={settings.soundConfig.clickSoundUrl}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SOUND_CONFIG',
                      key: 'clickSoundUrl',
                      value: e.target.value,
                    })
                  }
                  placeholder="/sounds/click.mp3"
                />
              </div>
              <div className="space-y-2">
                <Label>Typing Sound URL</Label>
                <Input
                  value={settings.soundConfig.typingSoundUrl}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_SOUND_CONFIG',
                      key: 'typingSoundUrl',
                      value: e.target.value,
                    })
                  }
                  placeholder="/sounds/typing.mp3"
                />
              </div>
            </div>
          )}
          {activeCategory === 'logging' && (
            <div
              className={`space-y-6 ${!settings.plugins.logging ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="text-muted-foreground text-sm">Logging configuration goes here.</div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 bg-dot-pattern relative overflow-hidden">
        <div className="flex gap-2 mb-8 absolute top-8 right-8 z-10">
          <Button onClick={runDemo} className="shadow-lg">
            <Play className="w-4 h-4 mr-2" /> Play Demo
          </Button>
          <Button variant="outline" onClick={() => actorRef.current?.destroy()}>
            Reset
          </Button>
        </div>

        <div className="w-[400px] border shadow-2xl bg-card rounded-xl p-8 space-y-6">
          <h3 className="text-2xl font-bold">Demo Setup</h3>
          <div className="space-y-2">
            <Label htmlFor="demo-input">Type something</Label>
            <Input id="demo-input" placeholder="Cursor will type here..." />
          </div>
          <Button id="demo-button" className="w-full">
            Action Button
          </Button>
        </div>
      </div>
    </div>
  );
}
