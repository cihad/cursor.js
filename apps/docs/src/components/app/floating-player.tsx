import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';

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
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {!mounted ? (
        <Button variant="ghost" size="icon" className="rounded-full mr-1">
          <Settings className="w-4 h-4" />
        </Button>
      ) : isDesktop ? (
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
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full mr-1">
              <Settings className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 z-[99999] w-[350px] sm:w-[400px]">
            <SheetHeader className="p-4 pb-0 text-left">
              <SheetTitle>Cursor Settings</SheetTitle>
            </SheetHeader>
            {settingsContent}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
