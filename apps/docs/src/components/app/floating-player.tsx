import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingPlayerProps {
  demoState: 'idle' | 'running' | 'paused' | 'done';
  isFixed?: boolean;
  onRun: () => void;
  onPause: () => void;
  onRestart: () => void;
  settingsContent: ReactNode;
}

export function FloatingPlayer({
  demoState,
  isFixed = true,
  onRun,
  onPause,
  onRestart,
  settingsContent,
}: FloatingPlayerProps) {
  return (
    <div
      className={cn(
        'z-[50] flex items-center gap-2 p-2 bg-background/80 backdrop-blur-lg border rounded-full shadow-lg transition-all duration-500 ease-in-out',
        isFixed ? 'fixed bottom-6 left-1/2 -translate-x-1/2' : 'relative',
      )}
    >
      <div className="flex items-center gap-2 px-2">
        {demoState !== 'running' && demoState !== 'paused' ? (
          <Button size="sm" onClick={onRun} className="rounded-full font-medium px-4">
            <Play className="w-4 h-4 mr-2" />
            Run Live Demo
          </Button>
        ) : (
          <>
            {demoState === 'running' ? (
              <Button variant="secondary" size="icon" className="rounded-full" onClick={onPause}>
                <Pause className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="secondary" size="icon" className="rounded-full" onClick={onRun}>
                <Play className="w-4 h-4" />
              </Button>
            )}
            <Button variant="destructive" size="icon" className="rounded-full" onClick={onRestart}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full mr-1">
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-[380px] p-0 mb-4 rounded-xl shadow-xl z-[9999]"
        >
          {settingsContent}
        </PopoverContent>
      </Popover>
    </div>
  );
}
