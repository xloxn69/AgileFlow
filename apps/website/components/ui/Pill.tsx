import { cn } from '@/lib/cn';

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium tracking-caps text-secondary shadow-hairline',
        className,
      )}
    >
      {children}
    </span>
  );
}

