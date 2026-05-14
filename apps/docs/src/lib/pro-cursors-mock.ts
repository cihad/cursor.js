import type { ThemeCursorItem } from '@cursor.js/core';

const mockCursor = (): ThemeCursorItem => ({
  html: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"></svg>',
  hotspot: 'top-left',
});

const entry = {
  exportName: 'mockCursor',
  label: 'Mock Cursor',
  slot: 'default' as const,
  presets: [],
  isConfigurable: false,
  defaultColors: {},
  hotspot: 'top-left' as const,
  factory: mockCursor,
  previewHtml: mockCursor().html,
};

export const bibataDark = mockCursor;
export const bibataPointer = mockCursor;
export const bibataText = mockCursor;

export const proCursorCatalog = {
  default: [entry],
  pointer: [
    { ...entry, exportName: 'mockPointer', label: 'Mock Pointer', slot: 'pointer' as const },
  ],
  text: [{ ...entry, exportName: 'mockText', label: 'Mock Text', slot: 'text' as const }],
};
