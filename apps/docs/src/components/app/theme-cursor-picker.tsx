'use client';

import { Check } from 'lucide-react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  findCursorEntry,
  findCursorPreset,
  themeCursorCatalog,
  themeCursorSlots,
  type CursorColorPreset,
  type ThemeCursorCatalogEntry,
  type ThemeCursorPresetSelection,
  type ThemeCursorSelection,
} from '@/lib/theme-cursors';

export function ThemeCursorPicker({
  selection,
  presets,
  onSelectCursor,
  onSelectPreset,
  disabled = false,
}: {
  selection: ThemeCursorSelection;
  presets: ThemeCursorPresetSelection;
  onSelectCursor: (slot: (typeof themeCursorSlots)[number], exportName: string) => void;
  onSelectPreset: (slot: (typeof themeCursorSlots)[number], presetId: string) => void;
  disabled?: boolean;
}) {
  const hasProCursors = themeCursorSlots.some((slot) =>
    themeCursorCatalog[slot].some((entry) => entry.source === 'pro'),
  );

  return (
    <TooltipProvider delayDuration={120}>
      <div className={cn('space-y-8', disabled && 'opacity-50 pointer-events-none')}>
        {hasProCursors ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-[10px] w-[10px] rounded-full bg-orange-300" />
            <span>pro cursor</span>
          </div>
        ) : null}
        {themeCursorSlots.map((slot) => {
          const selectedEntry = findCursorEntry(slot, selection[slot]);
          const selectedPreset = findCursorPreset(selectedEntry, presets[slot]);

          return (
            <section key={slot} className="space-y-3">
              <h4 className="text-sm font-semibold capitalize">{slot}</h4>

              <div className="grid grid-cols-4 gap-3">
                {themeCursorCatalog[slot].map((entry: ThemeCursorCatalogEntry) => {
                  const isSelected = selection[slot] === entry.exportName;
                  const activePreset = isSelected
                    ? (findCursorPreset(entry, presets[slot]) ?? entry.presets[0])
                    : entry.presets[0];
                  const isPro = entry.source === 'pro';

                  const trigger = (
                    <button
                      type="button"
                      onClick={() => onSelectCursor(slot, entry.exportName)}
                      className={cn(
                        'relative aspect-square rounded-md border bg-card text-left transition',
                        isPro
                          ? 'border-orange-300/70 hover:border-orange-500/80'
                          : 'hover:border-foreground/30',
                        isSelected &&
                          (isPro
                            ? 'border-orange-500 shadow-sm shadow-orange-500/20'
                            : 'border-foreground shadow-sm'),
                      )}
                    >
                      <div className="flex h-full items-center justify-center rounded-sm bg-muted/60">
                        <div
                          className="flex h-14 w-14 items-center justify-center overflow-visible [&_svg]:block [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:w-auto"
                          dangerouslySetInnerHTML={{
                            __html:
                              activePreset != null
                                ? entry.factory({ colors: activePreset.colors }).html
                                : entry.previewHtml,
                          }}
                        />
                      </div>
                      {isPro ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="absolute top-[5px] right-[5px] h-[10px] w-[10px] rounded-full bg-orange-300" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="z-[100000]">
                            Pro
                          </TooltipContent>
                        </Tooltip>
                      ) : null}
                      {isSelected ? (
                        <span className="absolute right-1.5 bottom-1.5 rounded-full bg-background/90 p-1 shadow-sm">
                          <Check className="h-4 w-4 text-foreground" />
                        </span>
                      ) : null}
                    </button>
                  );

                  if (entry.presets.length === 0) {
                    return (
                      <Tooltip key={entry.exportName}>
                        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                        <TooltipContent side="top" className="z-[100000]">
                          {entry.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <HoverCard key={entry.exportName} openDelay={120} closeDelay={120}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="z-[100000]">
                          {entry.label}
                        </TooltipContent>
                      </Tooltip>
                      <HoverCardContent
                        side="bottom"
                        align="start"
                        className="z-[100000] w-fit max-w-[18rem] p-1.5"
                      >
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium text-muted-foreground">Presets</div>
                          <div className="flex flex-wrap gap-1">
                            {entry.presets.map((preset: CursorColorPreset) => {
                              const active = isSelected && presets[slot] === preset.id;
                              return (
                                <button
                                  key={preset.id}
                                  type="button"
                                  onClick={() => {
                                    onSelectCursor(slot, entry.exportName);
                                    onSelectPreset(slot, preset.id);
                                  }}
                                  className={cn(
                                    'aspect-square h-9 w-9 rounded-[3px] border text-center transition',
                                    isPro
                                      ? 'border-orange-300/70 hover:border-orange-500/80'
                                      : 'hover:border-foreground/30',
                                    active &&
                                      (isPro
                                        ? 'border-orange-500 shadow-sm shadow-orange-500/20'
                                        : 'border-foreground shadow-sm'),
                                  )}
                                >
                                  <div className="flex h-full items-center justify-center rounded-[2px] bg-muted/60">
                                    <div
                                      className="flex h-4.5 w-4.5 items-center justify-center overflow-visible [&_svg]:block [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:w-auto"
                                      dangerouslySetInnerHTML={{
                                        __html: entry.factory({ colors: preset.colors }).html,
                                      }}
                                    />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
