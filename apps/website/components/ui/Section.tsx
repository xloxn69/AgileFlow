import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';

export function Section({
  id,
  alternate,
  className,
  children,
}: {
  id?: string;
  alternate?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative isolate overflow-hidden py-16 sm:py-20 lg:py-28',
        alternate ? 'bg-panel' : 'bg-background',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-[0.55]',
          'texture-grid',
        )}
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-[0.08]',
          'texture-noise',
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-hairline"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-hairline"
      />
      <Container>{children}</Container>
    </section>
  );
}

