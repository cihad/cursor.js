import {
  ThemePlugin,
  type ThemePack,
  type ThemePluginCursorFactory,
  type ThemePluginCursorFactoryOptions,
} from '@cursor.js/core';
import { proCursorCatalog } from '@cursor.js/pro/cursors';

export type CursorSlot = 'default' | 'pointer' | 'text';

export interface CursorColorPreset {
  id: string;
  label: string;
  colors: Record<string, string>;
}

interface ProCursorCatalogEntry {
  exportName: string;
  label: string;
  slot: CursorSlot;
  presets: CursorColorPreset[];
  isConfigurable: boolean;
  defaultColors: Record<string, string>;
  hotspot: ReturnType<ThemePluginCursorFactory>['hotspot'];
  previewHtml: string;
  factory: (
    options?: ThemePluginCursorFactoryOptions | { colors?: Record<string, string> },
  ) => ReturnType<ThemePluginCursorFactory>;
}

export type ThemeCursorSelection = Record<CursorSlot, string>;
export type ThemeCursorPresetSelection = Record<CursorSlot, string>;
export type ThemeCursorSource = 'core' | 'pro';

type ThemeCursorFactory = (
  options?: ThemePluginCursorFactoryOptions | { colors?: Record<string, string> },
) => ReturnType<ThemePluginCursorFactory>;

export interface ThemeCursorCatalogEntry
  extends Omit<ProCursorCatalogEntry, 'factory'> {
  factory: ThemeCursorFactory;
  source: ThemeCursorSource;
}

type CoreCursorDefinition = {
  exportName: string;
  label: string;
  slot: CursorSlot;
  factory: ThemePluginCursorFactory;
  presets: CursorColorPreset[];
  defaultColors: Record<string, string>;
};

export const themeCursorSlots: CursorSlot[] = ['default', 'pointer', 'text'];

const coreCursorDefinitions: CoreCursorDefinition[] = [
  {
    exportName: 'v1Default',
    label: 'V1 Default',
    slot: 'default',
    factory: ThemePlugin.cursors.default,
    defaultColors: { primary: '#00FF26', outline: '#272727' },
    presets: [
      { id: 'default', label: 'V1', colors: { primary: '#00FF26', outline: '#272727' } },
      { id: 'carbon', label: 'Carbon', colors: { primary: '#101418', outline: '#e5edf5' } },
      { id: 'sky', label: 'Sky', colors: { primary: '#0ea5e9', outline: '#082f49' } },
      { id: 'ember', label: 'Ember', colors: { primary: '#f97316', outline: '#7c2d12' } },
      { id: 'violet', label: 'Violet', colors: { primary: '#8b5cf6', outline: '#2e1065' } },
    ],
  },
  {
    exportName: 'v1Pointer',
    label: 'V1 Pointer',
    slot: 'pointer',
    factory: ThemePlugin.cursors.pointer,
    defaultColors: { primary: '#00FF26', outline: '#272727' },
    presets: [
      { id: 'default', label: 'V1', colors: { primary: '#00FF26', outline: '#272727' } },
      { id: 'graphite', label: 'Graphite', colors: { primary: '#111827', outline: '#f9fafb' } },
      { id: 'mint', label: 'Mint', colors: { primary: '#14b8a6', outline: '#042f2e' } },
      { id: 'rose', label: 'Rose', colors: { primary: '#f43f5e', outline: '#4c0519' } },
      { id: 'amber', label: 'Amber', colors: { primary: '#f59e0b', outline: '#451a03' } },
    ],
  },
  {
    exportName: 'v1Text',
    label: 'V1 Text',
    slot: 'text',
    factory: ThemePlugin.cursors.text,
    defaultColors: { primary: '#00FF26', outline: '#000000' },
    presets: [
      { id: 'default', label: 'V1', colors: { primary: '#00FF26', outline: '#000000' } },
      { id: 'ink', label: 'Ink', colors: { primary: '#111827', outline: '#f9fafb' } },
      { id: 'azure', label: 'Azure', colors: { primary: '#2563eb', outline: '#082f49' } },
      { id: 'orchid', label: 'Orchid', colors: { primary: '#a855f7', outline: '#2e1065' } },
      { id: 'sunset', label: 'Sunset', colors: { primary: '#fb923c', outline: '#431407' } },
    ],
  },
];

function createCoreCatalogEntry(entry: CoreCursorDefinition): ThemeCursorCatalogEntry {
  return {
    exportName: entry.exportName,
    label: entry.label,
    slot: entry.slot,
    presets: entry.presets,
    isConfigurable: entry.presets.length > 0,
    defaultColors: entry.defaultColors,
    hotspot: entry.factory().hotspot,
    factory: entry.factory,
    previewHtml: entry.factory().html,
    source: 'core',
  };
}

function createProCatalogEntry(entry: ProCursorCatalogEntry): ThemeCursorCatalogEntry {
  return {
    ...entry,
    source: 'pro',
  };
}

const coreCatalog = coreCursorDefinitions.reduce(
  (acc, entry) => {
    acc[entry.slot].push(createCoreCatalogEntry(entry));
    return acc;
  },
  {
    default: [],
    pointer: [],
    text: [],
  } as Record<CursorSlot, ThemeCursorCatalogEntry[]>,
);

export const themeCursorCatalog: Record<CursorSlot, ThemeCursorCatalogEntry[]> = {
  default: [...coreCatalog.default, ...proCursorCatalog.default.map((entry) => createProCatalogEntry(entry as ProCursorCatalogEntry))],
  pointer: [...coreCatalog.pointer, ...proCursorCatalog.pointer.map((entry) => createProCatalogEntry(entry as ProCursorCatalogEntry))],
  text: [...coreCatalog.text, ...proCursorCatalog.text.map((entry) => createProCatalogEntry(entry as ProCursorCatalogEntry))],
};

export const initialThemeCursorSelection: ThemeCursorSelection = {
  default: 'v1Default',
  pointer: 'v1Pointer',
  text: 'v1Text',
};

export const initialThemePresetSelection: ThemeCursorPresetSelection = {
  default: 'default',
  pointer: 'default',
  text: 'default',
};

export function findCursorEntry(
  slot: CursorSlot,
  exportName: string,
): ThemeCursorCatalogEntry | undefined {
  return themeCursorCatalog[slot]?.find((entry) => entry.exportName === exportName);
}

export function findCursorPreset(
  entry: ThemeCursorCatalogEntry | undefined,
  presetId: string,
): CursorColorPreset | undefined {
  return entry?.presets.find((preset) => preset.id === presetId);
}

export function buildThemePackFromSelection(
  selection: ThemeCursorSelection,
  presets: ThemeCursorPresetSelection,
): Partial<ThemePack> {
  const themePack: Partial<ThemePack> = {};

  for (const slot of themeCursorSlots) {
    const exportName = selection[slot];
    if (!exportName) continue;

    const entry = findCursorEntry(slot, exportName);
    if (!entry) continue;

    const preset = findCursorPreset(entry, presets[slot]);
    themePack[slot] = entry.factory(preset ? { colors: preset.colors } : undefined);
  }

  return themePack;
}

export function getThemeCursorImports(selection: ThemeCursorSelection): string[] {
  return themeCursorSlots
    .map((slot) => {
      const exportName = selection[slot];
      if (!exportName) return null;

      const entry = findCursorEntry(slot, exportName);
      return entry?.source === 'pro' ? entry.exportName : null;
    })
    .filter(
      (value, index, values): value is string => Boolean(value) && values.indexOf(value) === index,
    );
}

export function getThemePluginCode(
  selection: ThemeCursorSelection,
  presets: ThemeCursorPresetSelection,
): string {
  const entries = themeCursorSlots
    .map((slot) => {
      const exportName = selection[slot];
      if (!exportName) return null;

      const entry = findCursorEntry(slot, exportName);
      if (!entry) return null;

      const preset = findCursorPreset(entry, presets[slot]);
      const defaultPreset = entry.presets[0];
      const presetArgs =
        preset && defaultPreset && preset.id !== defaultPreset.id
          ? `(${JSON.stringify({ colors: preset.colors })})`
          : '()';

      const factoryCall =
        entry.source === 'core'
          ? `ThemePlugin.cursors.${slot}${presetArgs}`
          : `${entry.exportName}${presetArgs}`;

      return `${slot}: ${factoryCall}`;
    })
    .filter((value): value is string => Boolean(value));

  return entries.length > 0 ? `new ThemePlugin({ ${entries.join(', ')} })` : 'new ThemePlugin()';
}
