import * as React from 'react';
import { cn } from '@/lib/utils';

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center rounded-md border border-input bg-transparent',
        'focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50',
        className,
      )}
      {...props}
    />
  ),
);
InputGroup.displayName = 'InputGroup';

const InputGroupAddon = React.forwardRef<HTMLLabelElement, React.HTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'flex items-center px-3 text-sm text-muted-foreground bg-muted/50 whitespace-nowrap',
        className,
      )}
      {...props}
    />
  ),
);
InputGroupAddon.displayName = 'InputGroupAddon';

const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-8 w-full min-w-0 bg-transparent px-2.5 py-1 text-xs outline-none',
        'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
InputGroupInput.displayName = 'InputGroupInput';

export { InputGroup, InputGroupAddon, InputGroupInput };
